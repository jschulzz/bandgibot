import express from "express";
import cron from "cron";
import cheerio from "cheerio";
import nedb from "nedb-promises";
import path from "path";

import { didDukeWin } from "./cronjobs/didDukeWin.js";
import { birthdayCheck } from "./cronjobs/birthdayCheck.js";
import { updateMembers } from "./chat-listeners/updateMembers.js";
import { userKicked } from "./chat-listeners/userKicked.js";
import { checkForKarma } from "./chat-listeners/karma.js";
import apiRouter from "./api/router.js";

const { CronJob } = cron;
const app = express();
app.use(express.json());

const everySecond = "* * * * * *";
const everyMinute = "0 * * * * *";
const everyHour = "0 0 * * * *"; // second 0, minute 0, of every hour, day, month, and year
const everyDay = "0 0 7 * * *"; // second 0, minute 0, hour 7, on every day, month, and year

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
const karmaDB = nedb.create({
	filename: path.join("karma.db"),
	autoload: true,
});
const superlativesDB = nedb.create({
	filename: path.join("superlatives.db"),
	autoload: true,
});

const DukeWinCheck = new CronJob(everyHour, didDukeWin(dukeDB), null, true);
DukeWinCheck.start();

const BirthdayCheck = new CronJob(everyDay, birthdayCheck, null, true);
BirthdayCheck.start();

app.use("/api/v1", apiRouter);



app.post("/", async (req, res) => {
	const message = req.body;
	const { text, system, group_id } = message;
	console.log(text);
	await updateMembers({ group_id, memberDB, chatBody: req });
	if (system && text.includes("removed") && text.includes("from the group")) {
		await userKicked({ text, memberDB, kickDB });
	}
	checkForKarma(karmaDB, message);
});

app.use((err, req, res, next) => {
	// console.error(err);
    res.status(500).json(err);
    next(err)
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on Port 3000");
});
