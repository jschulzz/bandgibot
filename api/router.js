import express from "express";
import superlativeRouter from "./superlatives.js";

const router = express.Router();

router.use("/superlative", superlativeRouter);

router.use((err, req, res, next) => {
	// console.error(err);
    // res.status(500).send(err);
    next(err)
});

export default router;
