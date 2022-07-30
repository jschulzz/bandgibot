import { triggersDB } from "../datastores.js";
import { sendMessage } from "../utils.js";

export const checkForTriggers = async (message) => {
	const { sender_type, text } = message || {};
	if (sender_type !== "user") {
		// only users can trigger actions
		return;
	}
	if (!text) {
		return;
	}

	const allTriggers = await triggersDB.find({});

	allTriggers.forEach(async ({ triggers, message, image_url }) => {
		triggers.forEach(async (t) => {
			if (text.toLowerCase().includes(t)) {
				await sendMessage({
					message,
                    images: [image_url]
				});
			}
		});
	});
};
