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

	db = new sqlite3.oo1.OpfsDb("./db.sqlite3", "c");

	db.exec(
		'create virtual table if not exists emails_fts using fts5(from, to, title, body, tokenize="trigram");',
	);
	db.exec(
		`create table if not exists emails (
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

		resolve(emails.map((email) => EmailMetadata.parse(email)));
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

// export async function processMboxWorkerPoolSharedArrayBuffer(file: File) {
// 	const buffer = new SharedArrayBuffer(file.size);
// 	const bytesView = new Uint8Array(buffer);
// 	const reader = file.stream().getReader();
// 	let pos = 0;

// 	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
// 	while (true) {
// 		const { done, value } = await reader.read();

// 		if (value) {
// 			bytesView.set(value, pos);
// 			pos += value.length;
// 		}

// 		if (done) {
// 			break;
// 		}
// 	}

// 	const numWorkers = navigator.hardwareConcurrency;
// 	console.log(`using ${numWorkers} workers`);
// 	const chunkSize = Math.ceil(file.size / numWorkers);
// 	const workerPool: Worker[] = [];

// 	for (let i = 0; i < numWorkers; i++) {
// 		const worker = new Worker(new URL("../emailParser", import.meta.url), {
// 			name: "emailParser",
// 			type: "module",
// 		});
// 		workerPool.push(worker);

// 		worker.postMessage({ buffer, chunkSize, id: i, start: i * chunkSize });

// 		worker.onmessage = () => {
// 			console.log(`worker ${i} finished`);
// 			worker.terminate();
// 		};
// 	}
// }

// export async function processMboxWorkerPool(file: File) {
// 	const numWorkers = Math.ceil(navigator.hardwareConcurrency / 2);
// 	const chunkSize = Math.ceil(file.size / numWorkers);
// 	const workerPool: Worker[] = [];
// 	const buffer = await file.arrayBuffer();

// 	for (let i = 0; i < numWorkers; i++) {
// 		const worker = new Worker(new URL("../emailParser", import.meta.url), {
// 			name: "emailParser",
// 			type: "module",
// 		});
// 		workerPool.push(worker);
// 		const slice = new Uint8Array(
// 			buffer,
// 			i * chunkSize,
// 			i < numWorkers - 1 ? chunkSize : undefined,
// 		);

// 		worker.postMessage({ buffer: slice, id: i }, [slice.buffer]);

// 		worker.onmessage = () => {
// 			console.log(`worker ${i} finished`);
// 			worker.terminate();
// 		};
// 	}
// }
