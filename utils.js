import axios from 'axios'

export const sendMessage = async ({ message, attachments }) => {
	try {
		await axios.post(`https://api.groupme.com/v3/bots/post`, {
			bot_id: process.env.BOT_ID,
			text: message,
			attachments,
		});
	} catch (error) {
		console.error(error);
	}
};