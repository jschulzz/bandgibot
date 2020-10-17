import express from "express";
import axios from "axios";
import fs from "fs";

const app = express();
app.use(express.json());

const sendMessage = async (message) => {
	await axios.post(`https://api.groupme.com/v3/bots/post`, {
		bot_id: process.env.BOT_ID,
		text: message,
	});
};

app.post("/", async (req, res) => {
	const message = req.body;
	const { text, system, group_id } = message;
	const { data } = await axios.get(
		`https://api.groupme.com/v3/groups/${group_id}?token=${process.env.API_TOKEN}`
	);
	const current_members = data.response.members;
	const stored_members = JSON.parse(fs.readFileSync(`members.json`)).members;
	let all_members = [];
	[...current_members, ...stored_members].forEach((newMember) => {
		if (
			!all_members.some(
				(member) => member.user_id && member.user_id === newMember.user_id
			)
		) {
			all_members.push(newMember);
		}
	});
	fs.writeFileSync(
		`members.json`,
		JSON.stringify(
			{
				members: Array.from(all_members),
			},
			null,
			2
		)
	);
	if (system && text.includes("removed") && text.includes("from the group")) {
		const kicker = text.split("removed")[0].trim();
		const kickee = text.split("removed")[1].split("from the group")[0].trim();

		const { user_id: kicker_id, name: kicker_name } = all_members.find(
			(member) => {
				console.log(member);
				return member.nickname === kicker;
			}
		);
		const { user_id: kickee_id, name: kickee_name } = all_members.find(
			(member) => member.nickname === kickee
		);
		console.log(kicker_name, "kicked", kickee_name);
		let currentStats = JSON.parse(fs.readFileSync(`scores.json`)).scores;
		if (!currentStats[kickee_id]) {
			currentStats[kickee_id] = {
				name: kickee_name,
			};
		}
		if (!currentStats[kickee_id][kicker_id]) {
			currentStats[kickee_id][kicker_id] = 1;
		} else {
			currentStats[kickee_id][kicker_id]++;
		}
		const timesKicked = currentStats[kickee_id][kicker_id];
		const totalKicks = Object.values(currentStats[kickee_id]).reduce(
			(sum, next) => {
				if (typeof next === "number") {
					return sum + next;
				}
				return sum;
			}
		);
		fs.writeFileSync(
			`scores.json`,
			JSON.stringify({ scores: currentStats }, null, 2)
		);
		await sendMessage(
			`${kickee} has been kicked out ${timesKicked} time(s) by ${kicker}\nThey've been kicked ${totalKicks} time(s) total`
		);
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on Port 3000");
});
