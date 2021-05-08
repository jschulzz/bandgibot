import express from "express";
import superlativeRouter from "./superlatives.js";
import authRouter from "./auth.js";
import karmaRouter from "./karma.js";

const router = express.Router();

router.use("/superlative", superlativeRouter);

router.use("/auth", authRouter);

router.use("/karma", karmaRouter);

router.use((err, req, res, next) => {
	// console.error(err);
	// res.status(500).send(err);
	next(err);
});

export default router;
