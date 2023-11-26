/// <reference lib="webworker" />

import sqlite3InitModule, { Database } from "@sqlite.org/sqlite-wasm";
import { ulid } from "ulidx";

import { EmailJson, EmailMetadata, EmailRow } from "../../types/email";
import { emlToJsonString, parseEmlFile } from "../opfs/worker";

let db: Database;

export function writeJsonToDb(json: EmailJson) {
	db.exec({
		bind: [
			json.from
				.map(({ address, name }) => `${name ?? ""} ${address}`)
				.join(" "),
			json.to.map(({ address, name }) => `${name ?? ""} ${address}`).join(" "),
			json.subject,
			json.body,
		],
		sql: `insert into emails_fts values (?, ?, ?, ?)`,
	});

	db.exec({
		bind: [
			ulid(),
			json.from[0].name,
			json.from[0].address,
			json.to[0].name,
			json.to[0].address,
			json.subject,
			json.body,
			json.body_html,
			json.date,
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

export async function saveToDb(filename: string) {
	await parseEmlFile(filename).then((json) => {
		writeJsonToDb(json);
	});
}

export async function processEmlFile(file: File) {
	const bytes = await file.arrayBuffer();
	const uintbuf = new Uint8Array(bytes);

	// todo: hand this to another worker
	const json = await emlToJsonString(uintbuf)
		.then((json) => JSON.parse(json) as unknown)
		.then((json) => EmailJson.parse(json));

	writeJsonToDb(json);
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

	return typeof db !== "undefined";
}

export function getAllEmails() {
	const emails = db.exec(
		"select id, from_name, from_address, subject, date from emails order by date desc limit 25",
		{
			returnValue: "resultRows",
			rowMode: "object",
		},
	);

	return emails.map((email) => EmailMetadata.parse(email));
}

export function getAllEmailsSlow(): Promise<EmailMetadata[]> {
	return new Promise((resolve) => {
		const emails = db.exec(
			"select id, from_name, from_address, subject, date from emails order by date desc",
			{
				returnValue: "resultRows",
				rowMode: "object",
			},
		);

		// add some delay because it's just too fast ;)
		setTimeout(() => {
			resolve(emails.map((email) => EmailMetadata.parse(email)));
		}, 300);
	});
}

export function getEmailById(emailId: string) {
	console.log("fetching email with id ", emailId);
	const rows = db.exec({
		bind: [emailId],
		returnValue: "resultRows",
		rowMode: "object",
		sql: "select * from emails where id = ?",
	});

	return rows.map((row) => EmailRow.parse(row));
}

export async function processMbox(file: File) {
	const start = performance.now();
	const stream = file.stream();
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let running = true;

	do {
		const { done, value } = await reader.read();
		running = !done;

		buffer += decoder.decode(value, { stream: running });
		const emails = buffer.split(/^From .+\r?\n/gm);

		if (!done) {
			buffer = emails.pop() ?? "";
		} else {
			buffer = "";
		}

		for (const email of emails) {
			if (email.length) {
				const bytes = new TextEncoder().encode(email);
				await emlToJsonString(bytes)
					.then((jsonString) => JSON.parse(jsonString) as unknown)
					.then((json) => EmailJson.parse(json))
					.then((json) => {
						writeJsonToDb(json);
					});
			}
		}
	} while (running);

	const end = performance.now();
	console.log(`Processing took ${end - start}ms`);
}
