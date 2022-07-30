import { karmaDB, superlativesDB } from "../datastores.js";

import { sendMessage } from "../utils.js";

export const checkForKarma = async (message) => {
	const { attachments, sender_type, text } = message || {};
	const responses = [];
	if (sender_type !== "user") {
		// only users can perform karma actions
		return;
	}
	// matches for @<target><0 or more whitespace>
	const karmaRegex = new RegExp(/(@[\w\s\.'"_]{1,})(([\+\-])\3+)/gm);
	const loci = new Map();
	if (attachments && attachments.length) {
		attachments
			.filter((a) => a.type === "mentions")
			.forEach((mention) => {
				const startIndex = mention.loci[0][0];
				const user_id = mention.user_ids[0];
				// prevent giving someone karma multiple times in the same message
				if (!loci.has(startIndex) && ![...loci.values()].includes(user_id)) {
					loci.set(startIndex, user_id);
				}
			});
	}

	const matchingPhrases = text.match(karmaRegex);
	let superlative = {};
	if (matchingPhrases && matchingPhrases.length) {
		const uniqueTargets = matchingPhrases
			.map((match) => {
				karmaRegex.lastIndex = 0;
				const regexResult = karmaRegex.exec(String(match));
				const matchingText = regexResult[1].trim();
				const isUser = loci.has(regexResult.index);
				const change =
					Math.min(regexResult[2].length, 10) *
					(regexResult[3] === "-" ? -1 : 1);
				return {
					id:
						loci.get(regexResult.index) || matchingText.slice(1).toLowerCase(),
					index: regexResult.index,
					value: matchingText.slice(1),
					change,
					isUser,
				};
			})
			.filter((target, index, all) => {
				return all.slice(0, index).every((x) => x.id !== target.id);
			});
		for (const target of uniqueTargets) {
			await karmaDB.update(
				{ _id: target.id },
				{
					$inc: { karma: Number(target.change) },
					$set: {
						value: target.value,
						isUser: target.isUser,
					},
				},
				{ upsert: true }
			);

			const { karma } = await karmaDB.findOne({ _id: target.id });
			const possesive =
				target.value.slice(-1).toLowerCase() === "s" ? "'" : "'s";
			const direction = target.change > 0 ? "increased" : "decreased";

			const [firstMatch] = await superlativesDB.find({ karma });
			if (firstMatch && target.isUser) {
				superlative = {
					message: `Congratulations ${target.value}, you've reached ${karma} karma. ${firstMatch.message}`,
					images: [firstMatch.image_url],
				};
			} else {
				responses.push(
					`${target.value}${possesive} karma has ${direction} to ${karma}`
				);
			}
		}
		await sendMessage({ message: responses.join("\n") });
		if (superlative.message) {
			await sendMessage({
				message: superlative.message,
				images: superlative.images,
			});
		}
	}
};
