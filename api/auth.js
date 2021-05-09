import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/login", async (req, res) => {
	const { access_token } = req.query;
	req.session.access_token = access_token;
	const groups = await axios.get(
		`https://api.groupme.com/v3/groups?token=${access_token}`
	);
	if (
		groups.data.response.some((x) => x.group_id === process.env.TARGET_GROUP_ID)
	) {
		req.session.isInGroup = true;
	} else {
		req.session.isInGroup = false;
	}
	res.redirect("../../../superlatives");
});
router.get("/logout", async (req, res) => {
	req.session.destroy((err) => {
		console.error(err);
	});
	res.sendStatus(200);
});

router.get("/group-status", async (req, res) => {
	const { isInGroup } = req.session;
	res.json(isInGroup);
});
router.get("/loggedin", async (req, res) => {
	const { access_token } = req.session;
	res.json({ isLoggedIn: !!access_token });
});

export default router;
