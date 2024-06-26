import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/login", async (req, res) => {
	const { access_token } = req.query;
	req.session.access_token = access_token;
	let groups = {},
		me = {};
	try {
		groups = await axios.get(
			`https://api.groupme.com/v3/groups?token=${access_token}`
		);
		me = await axios.get(
			`https://api.groupme.com/v3/users/me?token=${access_token}`
		);
	} catch (error) {
		console.log("There was an issue verifying the user", err);
		req.session.isAdmin = false;
		req.session.isLoggedIn = false;
		req.session.isInGroup = false;
		res.send(401).json({ message: "There was an issue verifying the user" });
	}
	req.session.user_id = me.data.response.id;
	const admins = process.env.ADMIN_IDS.split(",");
	req.session.isAdmin = admins.includes(req.session.user_id);
	req.session.isLoggedIn = !!req.session.access_token;
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
		console.log("Logout Error", err);
	});
	res.sendStatus(200);
});

router.get("/permissions", async (req, res) => {
	const { isInGroup, isAdmin, isLoggedIn } = req.session;
	res.json({ isInGroup, isAdmin, isLoggedIn });
});
router.get("/loggedin", async (req, res) => {
	const { access_token } = req.session;
	res.json({ isLoggedIn: !!access_token });
});

export default router;
