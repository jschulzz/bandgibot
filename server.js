import express from "express";
import cron from "cron";
import path from "path";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import { memberDB, kickDB, dukeDB } from "./datastores.js";

import { didDukeWin } from "./cronjobs/didDukeWin.js";
import { birthdayCheck } from "./cronjobs/birthdayCheck.js";
import { updateMembers } from "./chat-listeners/updateMembers.js";
import { userKicked } from "./chat-listeners/userKicked.js";
import { checkForKarma } from "./chat-listeners/karma.js";
import apiRouter from "./api/router.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import nedbSessionStore from "nedb-session-store";
const NedbStore = nedbSessionStore(session);

const { CronJob } = cron;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: {
			path: "/",
			httpOnly: true,
			maxAge: 365 * 24 * 60 * 60 * 1000, // e.g. 1 year
		},
		store: new NedbStore({
			filename: "sessions.db",
		}),
	})
);

const everySecond = "* * * * * *";
const everyMinute = "0 * * * * *";
const everyHour = "0 0 * * * *"; // second 0, minute 0, of every hour, day, month, and year
const everyDay = "0 0 7 * * *"; // second 0, minute 0, hour 7, on every day, month, and year

const DukeWinCheck = new CronJob(everyHour, didDukeWin(dukeDB), null, true);
DukeWinCheck.start();

const BirthdayCheck = new CronJob(everyDay, birthdayCheck, null, true);
BirthdayCheck.start();

app.use("/api/v1", apiRouter);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.post("/", (req, res) => {
	console.log(req);
	res.sendStatus(200);
});

app.post("/chatbot", async (req, res) => {
	const message = req.body;
	const { text, system, group_id } = message;
	console.log(text);
	if (!text || !group_id) {
		console.log(req);
	}
	await updateMembers({ group_id, memberDB, chatBody: req });
	if (system && text.includes("removed") && text.includes("from the group")) {
		await userKicked({ text, memberDB, kickDB });
	}
	checkForKarma(message);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use((err, req, res, next) => {
	// console.error(err);
	res.status(500).json(err);
	next(err);
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on Port 3000");
});
