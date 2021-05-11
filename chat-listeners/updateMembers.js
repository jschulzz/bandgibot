import axios from "axios";

export const updateMembers = async ({ group_id, memberDB, chatBody }) => {
	try {
		const { data } = await axios.get(
			`https://api.groupme.com/v3/groups/${group_id}?token=${process.env.API_TOKEN}`
		);
		const current_members = data.response.members;
		current_members.forEach(async (member) => {
			await memberDB.update({ user_id: member.user_id }, member, {
				upsert: true,
			});
		});
	} catch (error) {
		console.error(error);
	}
};
