import express from "express";
import Joi from "joi";

import { superlativesDB, memberDB } from "../datastores.js";

const superlativeSchema = Joi.object({
	karma: Joi.number().required(),
	message: Joi.string().allow("").optional().default(""),
	image_url: Joi.string().allow("").optional().default(""),
	creator: Joi.string().optional().default(""),
	created_at: Joi.string().optional().default(""),
});

const router = express.Router();

router.post("/", async (req, res) => {
	const { body } = req;
	const validation = superlativeSchema.validate(body);
	if (validation.error) {
		return res.status(400).json(validation.error.details);
	}
	if (!req.session.isInGroup || !res.session.isLoggedIn) {
		return res.status(401).json({ message: "User does not have access" });
	}
	await superlativesDB.insert({
		...validation.value,
		creator: req.session.user_id,
		created_at: new Date().toISOString(),
	});
	res.send(validation);
});

router.get("/", async (req, res) => {
	if (req.session.user_id) {
		const allSuperlatives = await superlativesDB.find();
		for (const superlative of allSuperlatives) {
			const [creator] = await memberDB.find({ user_id: superlative.creator });
			superlative.creator = creator?.name || "Unknown";
		}
		res.json(allSuperlatives);
	} else {
		res.status(401).json({ message: "User does not have access" });
	}
});
router.get("/mine", async (req, res) => {
	if (req.session.user_id) {
		const allSuperlatives = await superlativesDB.find({
			creator: req.session.user_id,
		});
		for (const superlative of allSuperlatives) {
			const [creator] = await memberDB.find({ user_id: superlative.creator });
			superlative.creator = creator?.name || "Unknown";
		}
		res.json(allSuperlatives);
	} else {
		res.status(401).json({ message: "User does not have access" });
	}
});

router.delete("/:id", async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ message: "Must supply an id to delete" });
	}
	if (!req.session.isAdmin) {
		return res.status(401).json({ message: "User does not have access" });
	}
	await superlativesDB.remove({ _id: req.params.id });
	res.json({ message: "Superlative deleted" });
});

export default router;
