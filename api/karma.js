import express from "express";
import { karmaDB } from "../datastores.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const allKarma = await karmaDB.find();
	res.json(allKarma);
});

export default router;
