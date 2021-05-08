import express from "express";
import Joi from "joi";
import nedb from "nedb-promises";
import path from "path";

import { superlativesDB } from "../datastores.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const superlativeSchema = Joi.object({
	karma: Joi.number().required(),
	message: Joi.string().optional().default(""),
	image_url: Joi.string().optional().default(""),
	creator: Joi.string().optional().default(""),
});

const router = express.Router();

router.post("/", async (req, res) => {
	const { body } = req;
	const validation = superlativeSchema.validate(body);
	if (validation.error) {
		return res.status(400).json(validation.error.details);
	}
	await superlativesDB.insert({ ...validation.value });
	res.send(validation);
});

router.get("/", async (req, res) => {
	const allSuperlatives = await superlativesDB.find();
	res.json(allSuperlatives);
});

router.delete("/:id", async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ message: "Must supply an id to delete" });
	}
	await superlativesDB.remove({ _id: req.params.id });
	res.json({ message: "Superlative deleted" });
});

export default router;
