/// <reference lib="webworker" />

import sqlite3InitModule, { Database } from "@sqlite.org/sqlite-wasm";

import { instance as opfs } from "../opfs";
import { parseEmlFile } from "../opfs/worker";

let db: Database;

export async function saveToDb(filename: string) {
	const file = await parseEmlFile(filename);

	db.exec({
		bind: [
			file.from
				.map(({ address, name }) => `${name ?? ""} ${address}`)
				.join(" "),
			file.to.map(({ address, name }) => `${name ?? ""} ${address}`).join(" "),
			file.subject,
			file.body,
		],
		sql: `insert into emails values (?, ?, ?, ?)`,
	});
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
		'create virtual table emails using fts5(from, to, title, body, tokenize="trigram");',
	);

	const filenames = await opfs.getAllFilenames();
	for (const filename of filenames) {
		await saveToDb(filename);
	}

	const all = db.exec("select * from emails", {
		returnValue: "resultRows",
		rowMode: "object",
	});

	console.log({ all });

	return typeof db !== "undefined";
}
