/// <reference lib="webworker" />
import { z } from "zod";

import { parseEml } from "../../utils/eml";

const AddressBlob = z.object({
	address: z.string(),
	name: z.string().nullable(),
});

const EmailJson = z.object({
	body: z.string().nullable(),
	body_html: z.string().nullable(),
	date: z.string().nullable(),
	from: z.array(AddressBlob),
	subject: z.string().nullable(),
	to: z.array(AddressBlob),
});

async function getRoot() {
	return await navigator.storage.getDirectory();
}

export async function saveToOpfs(file: File) {
	const opfsRoot = await navigator.storage.getDirectory();

	const fileHandle = await opfsRoot.getFileHandle(file.name, { create: true });
	const syncHandle = await fileHandle.createSyncAccessHandle();
	const fileBuf = await file.arrayBuffer();
	const fileBytes = new Uint8Array(fileBuf);

	syncHandle.write(fileBytes);
	syncHandle.close();
}

export async function getAllFilenames() {
	const root = await getRoot();
	const filenames = [];

	for await (const name of root.keys()) {
		filenames.push(name);
	}
	return filenames;
}

export async function getFile(filename: string) {
	const root = await getRoot();
	const fileHandle = await root.getFileHandle(filename);
	const file = await fileHandle.getFile();
	return file;
}

export async function parseEmlFile(filename: string) {
	const root = await getRoot();
	const fileHandle = await root.getFileHandle(filename);
	const file = await fileHandle.getFile();
	const json = await parseEml(file);

	return EmailJson.parse(JSON.parse(json));
}
