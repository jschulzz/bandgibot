import { sendMessage } from "../utils";

export const userKicked = async ({ text, kickDB, memberDB }) => {
	const kicker = text.split("removed")[0].trim();
	const kickee = text.split("removed")[1].split("from the group")[0].trim();
	const { user_id: kicker_id, name: kicker_name } = await memberDB.findOne({
		nickname: kicker,
	});
	const { user_id: kickee_id, name: kickee_name } = await memberDB.findOne({
		nickname: kickee,
	});
	console.log(kicker_name, "kicked", kickee_name);

	let currentStats = await kickDB.findOne({ user_kicked: kickee_id });
	if (!currentStats) {
		await kickDB.insert({
			user_kicked: kickee_id,
			kicked_by: [],
			name: kickee_name,
		});
	}
	await kickDB.update(
		{ user_kicked: kickee_id },
		{ $push: { kicked_by: { user_id: kicker_id } } }
	);

	const { kicked_by } = await kickDB.findOne({ user_kicked: kickee_id });
	const totalKicks = kicked_by.length;
	const kicksByKicker = kicked_by.filter((kick) => kick.user_id === kicker_id)
		.length;
	await sendMessage({
		message: `${kickee} has been kicked out ${kicksByKicker} time(s) by ${kicker}\nThey've been kicked ${totalKicks} time(s) total`,
	});
};
