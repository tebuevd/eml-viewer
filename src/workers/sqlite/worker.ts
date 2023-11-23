/// <reference lib="webworker" />

import sqlite3InitModule, { Database } from "@sqlite.org/sqlite-wasm";
import { ulid } from "ulidx";

import { EmailRow } from "../../types/email";
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
		sql: `insert into emails_fts values (?, ?, ?, ?)`,
	});

	db.exec({
		bind: [
			ulid(),
			file.from[0].name,
			file.from[0].address,
			file.to[0].name,
			file.to[0].address,
			file.subject,
			file.body,
			file.body_html,
			file.date,
		],
		sql: `
			insert into emails (
				id, 
				from_name, 
				from_address, 
				to_name, 
				to_address, 
				subject, 
				body, 
				html, 
				date
			) 
			values (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
	});
}

export function query(text: string) {
	return db.exec({
		bind: [text],
		returnValue: "resultRows",
		rowMode: "object",
		sql: `select * from emails_fts(?)`,
	});
}

export async function initDb() {
	const sqlite3 = await sqlite3InitModule({
		print: console.log,
		printErr: console.error,
	});

	db = new sqlite3.oo1.DB("db.sqlite3", "c");

	db.exec(
		'create virtual table emails_fts using fts5(from, to, title, body, tokenize="trigram");',
	);
	db.exec(
		`create table emails (
			id text primary key,
			from_name text,
			from_address text,
			to_name text,
			to_address text,
			subject text,
			body text,
			html text,
			date text
		);`,
	);

	const filenames = await opfs.getAllFilenames();
	for (const filename of filenames) {
		await saveToDb(filename);
	}

	return typeof db !== "undefined";
}

export function getAllEmails() {
	const emails = db.exec("select * from emails order by date desc", {
		returnValue: "resultRows",
		rowMode: "object",
	});

	return emails.map((email) => EmailRow.parse(email));
}

export function getEmailById(emailId: string) {
	const rows = db.exec({
		bind: [emailId],
		returnValue: "resultRows",
		rowMode: "object",
		sql: "select * from emails where id = ?",
	});

	return rows.map((row) => EmailRow.parse(row));
}
