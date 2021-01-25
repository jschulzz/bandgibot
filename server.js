import express from "express";
import axios from "axios";
import fs from "fs";
import cron from "cron";
import cheerio from "cheerio";
import nedb from "nedb-promises";
import path from "path";

const { CronJob } = cron;
const app = express();
app.use(express.json());

const sendMessage = async ({ message, attachments }) => {
	try {
		await axios.post(`https://api.groupme.com/v3/bots/post`, {
			bot_id: process.env.DEV_BOT_ID,
			text: message,
			attachments,
		});
	} catch (error) {
		console.error(error);
	}
};

const everySecond = "* * * * * *";
const everyMinute = "0 * * * * *";
const everyHour = "* 0 * * * *";
const everyDay = "* * 7 * * *";

const memberDB = nedb.create({
	filename: path.join("members.db"),
	autoload: true,
});
const kickDB = nedb.create({
	filename: path.join("kicks.db"),
	autoload: true,
});
const dukeDB = nedb.create({
	filename: path.join("duke.db"),
	autoload: true,
});

const DukeWinCheck = new CronJob(
	everyHour,
	async () => {
		const didDukeWin = await axios.get("http://diddukewin.com");
		const $ = cheerio.load(didDukeWin.data);
		const winStatus = $("#middle").text();
		const gameLink = $("a").attr("href");
		const winText = winStatus.trim().split(" ")[0];
		let [oldDukeStatus] = await dukeDB.find({});
		if (!oldDukeStatus) {
			oldDukeStatus = { winText, gameLink };
		}
		if (oldDukeStatus.gameLink !== gameLink) {
			// new game
			console.log(`Duke Update:\n won: ${winText}`);
			if (winText == "NO") {
				console.log("Duke Lost. Sending Message");
				await sendMessage({ message: `Duke lost lol\n${gameLink}` });
			}
			await dukeDB.update(
				{},
				{ winText, gameLink },
				{ upsert: true, multi: false }
			);
		}
	},
	null,
	true
);
const BirthdayCheck = new CronJob(
	everyDay,
	async () => {
		const dateString = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
		const birthdays = JSON.parse(fs.readFileSync(`birthdays.json`));
		const birthdaysToday = birthdays[dateString] || [];
		// console.log(birthdaysToday, dateString)
		for (const bday of birthdaysToday) {
			const { user_id, nickname, muted } = await memberDB.findOne({
				name: bday,
			});
			if (!muted) {
				const googleImageSearchRequest = await axios.get(
					`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=Happy Birthday&rating=g`
				);
				const imageSet = googleImageSearchRequest.data.data;
				const image = imageSet[Math.floor(Math.random() * imageSet.length)];
				const message = `Happy Birthday ${nickname}!!`;
				const loci = [[15, nickname.length + 1]];
				const user_ids = [user_id];
				const attachments = [
					{
						type: "mentions",
						user_ids,
						loci,
					},
					{
						type: "image",
						url: `https://media0.giphy.com/media/${image.id}/giphy.gif`,
					},
				];
				await sendMessage({ message, attachments });
				console.log(`Happy Birthday to ${nickname}`);
			}
		}
	},
	null,
	true
);

BirthdayCheck.start();
DukeWinCheck.start();

app.post("/", async (req, res) => {
	const message = req.body;
	const { text, system, group_id } = message;
	console.log(text);
	const { data } = await axios.get(
		`https://api.groupme.com/v3/groups/${group_id}?token=${process.env.API_TOKEN}`
	);
	const current_members = data.response.members;
	current_members.forEach(async (member) => {
		await memberDB.update({ user_id: member.user_id }, member, {
			upsert: true,
		});
	});
	if (system && text.includes("removed") && text.includes("from the group")) {
		const kicker = text.split("removed")[0].trim();
		const kickee = text.split("removed")[1].split("from the group")[0].trim();
		const { user_id: kicker_id, name: kicker_name } = await memberDB.findOne({
			nickname: kicker,
		});
		const { user_id: kickee_id, name: kickee_name } = await memberDB.findOne({
			nickname: kickee,
		});
		console.log(kicker_name, "kicked", kickee_name);

		let currentStats = await kickDB.findOne({ user_kicked: kickee_id });
		if (!currentStats) {
			await kickDB.insert({
				user_kicked: kickee_id,
				kicked_by: [],
				name: kickee_name,
			});
		}
		await kickDB.update(
			{ user_kicked: kickee_id },
			{ $push: { kicked_by: { user_id: kicker_id } } }
		);

		const { kicked_by } = await kickDB.findOne({ user_kicked: kickee_id });
		const totalKicks = kicked_by.length;
		const kicksByKicker = kicked_by.filter((kick) => kick.user_id === kicker_id)
			.length;
		await sendMessage({
			message: `${kickee} has been kicked out ${kicksByKicker} time(s) by ${kicker}\nThey've been kicked ${totalKicks} time(s) total`,
		});
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on Port 3000");
});
