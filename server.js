import express from "express";
import cron from "cron";
import cheerio from "cheerio";
import nedb from "nedb-promises";
import path from "path";

import { didDukeWin } from "./cronjobs/didDukeWin";
import { birthdayCheck } from "./cronjobs/birthdayCheck";
import { updateMembers } from "./chat-listeners/updateMembers";
import { userKicked } from "./chat-listeners/userKicked";

const { CronJob } = cron;
const app = express();
app.use(express.json());

const everySecond = "* * * * * *";
const everyMinute = "0 * * * * *";
const everyHour = "0 0 * * * *"; // second 0, minute 0, of any hour, day, month, and year
const everyDay = "0 0 7 * * *"; // second 0, minute 0, hour 7, on any day, month, and year

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

const DukeWinCheck = new CronJob(everyHour, didDukeWin(dukeDB), null, true);
DukeWinCheck.start();

const BirthdayCheck = new CronJob(everyDay, birthdayCheck, null, true);
BirthdayCheck.start();

app.post("/", async (req, res) => {
	const message = req.body;
	const { text, system, group_id } = message;
	console.log(text);
	await updateMembers({ group_id, memberDB, chatBody: req });
	if (system && text.includes("removed") && text.includes("from the group")) {
		await userKicked({ text, memberDB, kickDB });
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on Port 3000");
});
