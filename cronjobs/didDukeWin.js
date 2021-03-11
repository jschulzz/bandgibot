import axios from "axios";
import cheerio from "cheerio";

export const didDukeWin = (dukeDB) => {
	return async () => {
		const webRequest = await axios.get("https://diddukewin.com");
		const $ = cheerio.load(webRequest.data);
		const winStatus = $("#middle").text();
		const gameLink = $("a").attr("href");
		const winText = winStatus.trim().split(" ")[0];
		let [oldDukeStatus] = await dukeDB.find({});
		if (!oldDukeStatus) {
			oldDukeStatus = { winText, gameLink };
			if (winText == "NO") {
				console.log("Duke Lost. Sending Message");
				await sendMessage({ message: `Duke lost lol\n${gameLink}` });
			}
		}
		if (oldDukeStatus.gameLink !== gameLink) {
			// new game
			console.log(`Duke Update:\n won: ${winText}`);
			if (winText == "NO") {
				console.log("Duke Lost. Sending Message");
				await sendMessage({ message: `Duke lost lol\n${gameLink}` });
			}
		}
		await dukeDB.update(
			{},
			{ winText, gameLink },
			{ upsert: true, multi: false }
		);
	};
};
