import fs from "fs";
import axios from "axios";
import { sendMessage } from "../utils.js";

export const birthdayCheck = (memberDB) => {
	return async () => {
		const dateString = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
		const birthdays = JSON.parse(fs.readFileSync(`birthdays.json`));
		const birthdaysToday = birthdays[dateString] || [];
		for (const bday of birthdaysToday) {
			const { user_id, nickname, muted } = await memberDB.findOne({
				name: bday,
			});
			const googleImageSearchRequest = await axios.get(
				`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=Happy Birthday&rating=g`
			);
			const imageSet = googleImageSearchRequest.data.data;
			const image = imageSet[Math.floor(Math.random() * imageSet.length)];
			const message = `Happy Birthday ${nickname}!!`;
			let attachments = [
				{
					type: "image",
					url: `https://media0.giphy.com/media/${image.id}/giphy.gif`,
				},
			];
			if (!muted) {
				const loci = [[15, nickname.length + 1]];
				const user_ids = [user_id];
				attachments.push({
					type: "mentions",
					user_ids,
					loci,
				});
			}
			await sendMessage({ message, attachments });
			console.log(`Happy Birthday to ${nickname}`);
		}
	};
};
