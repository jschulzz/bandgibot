import nedb from "nedb-promises";
import path from "path";

export const karmaDB = nedb.create({
	filename: path.join("karma.db"),
	autoload: true,
});

export const triggersDB = nedb.create({
	filename: path.join("triggers.db"),
	autoload: true,
});

export const superlativesDB = nedb.create({
	filename: path.join("superlatives.db"),
	autoload: true,
});

export const memberDB = nedb.create({
	filename: path.join("members.db"),
	autoload: true,
});

export const kickDB = nedb.create({
	filename: path.join("kicks.db"),
	autoload: true,
});

export const dukeDB = nedb.create({
	filename: path.join("duke.db"),
	autoload: true,
});
