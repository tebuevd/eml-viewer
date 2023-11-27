/// <reference lib="webworker" />

import { EmailJson } from "../types/email";
import { emlToJsonString } from "./opfs/worker";

type WorkerMessage = {
	buffer: ArrayBuffer;
	chunkSize: number;
	id: number;
	start: number;
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
	const startTime = performance.now();
	const decoder = new TextDecoder();
	const { buffer, chunkSize, id, start } = event.data;
	const bytes = new Uint8Array(buffer, start, chunkSize).slice();
	const text = decoder.decode(bytes);
	const emails = text.split(/^From .+\r?\n/gm);

	console.log(`worker ${id} has ${emails.length} emails`);

	const firstEmail = emails.shift();
	const lastEmail = emails.pop();

	for (const email of emails) {
		if (email.length) {
			// console.log("processing email in worker", id);
			const bytes = new TextEncoder().encode(email);
			await emlToJsonString(bytes)
				.then((jsonString) => JSON.parse(jsonString) as unknown)
				.then((json) => EmailJson.parse(json))
				.catch((err) => {
					console.error(err);
				});
		}
	}

	const endTime = performance.now();
	console.log(`worker ${id} took ${endTime - startTime}ms`);

	postMessage({ firstEmail, lastEmail });
};
