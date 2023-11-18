/// <reference lib="webworker" />

import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { parseEmlFile } from "../opfs/worker";
import { instance as opfs } from "../opfs";

const sqlite3 = await sqlite3InitModule({
	print: console.log,
	printErr: console.error,
});

const db = new sqlite3.oo1.DB("db.sqlite3", "c");

db.exec(
	'create virtual table emails using fts5(sender, title, body, tokenize="trigram");',
);

const filenames = await opfs.getAllFilenames();
for (const filename of filenames) {
	await saveToDb(filename);
}

export async function saveToDb(filename: string) {
	const file = await parseEmlFile(filename);

	db.exec({
		sql: `insert into emails values (?, ?, ?)`,
		//@ts-ignore
		bind: [file.from.join(", "), file.subject, file.body],
	});
}

export function query(text: string) {
	return db.exec({
		sql: `select * from emails(?)`,
		bind: [text],
		returnValue: "resultRows",
		rowMode: "object",
	});
}
