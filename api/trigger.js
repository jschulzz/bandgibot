import express from "express";
import Joi from "joi";

import { triggersDB, memberDB } from "../datastores.js";

const triggerSchema = Joi.object({
	trigger: Joi.string().required(),
	message: Joi.string().allow("").optional().default(""),
	image_url: Joi.string().allow("").optional().default(""),
	creator: Joi.string().optional().default(""),
	created_at: Joi.string().optional().default(""),
});

const router = express.Router();

router.post("/", async (req, res) => {
	const { body } = req;
	const validation = triggerSchema.validate(body);
	if (validation.error) {
		return res.status(400).json(validation.error.details);
	}
	if (!req.session.isInGroup || !req.session.isLoggedIn) {
		return res.status(401).json({ message: "User does not have access" });
	}
	await triggersDB.insert({
		...validation.value,
		creator: req.session.user_id,
		created_at: new Date().toISOString(),
	});
	res.send(validation);
});

router.get("/", async (req, res) => {
	// if (req.session.user_id) {
		const allTriggers = await triggersDB.find();
		for (const trigger of allTriggers) {
			const [creator] = await memberDB.find({ user_id: trigger.creator });
			trigger.creator = creator?.name || "Unknown";
		}
		res.json(allTriggers);
	// } else {
	// 	res.status(401).json({ message: "User does not have access" });
	// }
});
router.get("/mine", async (req, res) => {
	// if (req.session.user_id) {
		const allTriggers = await triggersDB.find({
			creator: req.session.user_id,
		});
		for (const trigger of allTriggers) {
			const [creator] = await memberDB.find({ user_id: trigger.creator });
			trigger.creator = creator?.name || "Unknown";
		}
		res.json(allTriggers);
	// } else {
	// 	res.status(401).json({ message: "User does not have access" });
	// }
});

router.delete("/:id", async (req, res) => {
	if (!req.session.isAdmin || !req.session.isLoggedIn) {
		return res.status(401).json({ message: "User does not have access" });
	}
	if (!req.params.id) {
		return res.status(400).json({ message: "Must supply an id to delete" });
	}
	await triggersDB.remove({ _id: req.params.id });
	res.json({ message: "Trigger deleted" });
});

export default router;
