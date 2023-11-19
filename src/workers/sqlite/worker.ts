/// <reference lib="webworker" />

import sqlite3InitModule, { Database } from "@sqlite.org/sqlite-wasm";

import { instance as opfs } from "../opfs";
import { parseEmlFile } from "../opfs/worker";

let db: Database;

export async function saveToDb(filename: string) {
	const file = await parseEmlFile(filename);

	if (
		typeof file.from === "object" &&
		typeof file.subject === "string" &&
		typeof file.body === "string"
	) {
		db.exec({
			bind: [file.from.join(", "), file.subject, file.body],
			sql: `insert into emails values (?, ?, ?)`,
		});
	}
}

export function query(text: string) {
	return db.exec({
		bind: [text],
		returnValue: "resultRows",
		rowMode: "object",
		sql: `select * from emails(?)`,
	});
}

export async function initDb() {
	const sqlite3 = await sqlite3InitModule({
		print: console.log,
		printErr: console.error,
	});

	db = new sqlite3.oo1.DB("db.sqlite3", "c");

	db.exec(
		'create virtual table emails using fts5(sender, title, body, tokenize="trigram");',
	);

	const filenames = await opfs.getAllFilenames();
	for (const filename of filenames) {
		await saveToDb(filename);
	}

	return typeof db !== "undefined";
}
