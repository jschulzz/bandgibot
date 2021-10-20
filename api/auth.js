import express from "express";
import axios from "axios";

const router = express.Router();

router.use((req, res, next) => {
	if (process.env.NODE_ENV === "development") {
		req.session.isAdmin = true;
		req.session.isLoggedIn = true;
		req.session.isInGroup = true;
		req.session.user_id = process.env.ADMIN_IDS.split(",")[0];
	}
	next();
});

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
		console.error("There was an issue verifying the user", err);
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

	res.redirect("../../../leaderboard");
});
router.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.log("Logout Error", err);
				res.status(400).json({ msg: "Unable to log out" });
			} else {
				console.log("User logged out");
				req.session = null;
				res.clearCookie("connect.sid");
				res.redirect("/login");
			}
		});
	} else {
		res.end();
	}
});

router.get("/permissions", async (req, res) => {
	const { isInGroup, isAdmin, isLoggedIn } = req.session;
	console.debug("Getting permissions", req.session);
	res.json({ isInGroup, isAdmin, isLoggedIn });
});

export default router;
