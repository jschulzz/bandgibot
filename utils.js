import axios from "axios";

const uploadImageToGroupme = async (imageUrl) => {
	//curl "https://image.groupme.com/pictures?url=https://media2.giphy.com/media/hPTZgtzfRIB5Nfb5rL/giphy.gif" -X POST   -H "X-Access-Token: TOKEN" --verbose
	console.log("Uploading image to Groupme", imageUrl);
	try {
		const response = await axios.post(
			`https://image.groupme.com/pictures?url=${imageUrl}`,
			null,
			{
				headers: {
					"X-Access-Token": process.env.API_TOKEN,
				},
			}
		);
		console.log(response);
		return response.data.payload.picture_url;
	} catch (error) {
		console.error("Error uploading image to Groupme", {
			message: error.message,
			data: error.response.data,
		});
	}
};

export const sendMessage = async ({
	message,
	attachments = [],
	images = [],
}) => {
	try {
		let groupmeImages = [];
		for (const image of images) {
			const url = await uploadImageToGroupme(image);
			groupmeImages.push({ type: "image", url });
		}
		await axios.post(`https://api.groupme.com/v3/bots/post`, {
			bot_id: process.env.BOT_ID,
			text: message,
			attachments: [...attachments, ...groupmeImages],
		});
	} catch (error) {
		console.error("Error sending Groupme", {
			message: error.message,
			data: error.response.data,
		});
	}
};
