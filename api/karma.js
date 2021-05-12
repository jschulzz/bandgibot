import express from "express";
import { karmaDB } from "../datastores.js";

const router = express.Router();

router.get("/", async (req, res) => {
	if (req.session.isLoggedIn && req.session.isInGroup) {
		const allKarma = await karmaDB.find();
		res.json(allKarma);
	} else {
		return res.statusCode(401).json({ message: "User does not have access" });
	}
});

export default router;
