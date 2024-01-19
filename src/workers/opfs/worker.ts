/// <reference lib="webworker" />

import load, { eml_to_json } from "../../../crate/pkg/eml_viewer";
import { EmailJson } from "../../types/email";

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

async function emlFileToJsonString(file: File): Promise<string> {
	await load();
	const buffer = await file.arrayBuffer();
	const bytes = new Uint8Array(buffer);
	const jsonString = eml_to_json(bytes);
	return jsonString;
}

export async function emlToJsonString(buf: Uint8Array): Promise<string> {
	await load();
	return eml_to_json(buf);
}

export async function parseEmlFile(filename: string) {
	const root = await getRoot();
	const fileHandle = await root.getFileHandle(filename);
	const file = await fileHandle.getFile();
	const jsonString = await emlFileToJsonString(file);

	return EmailJson.parse(JSON.parse(jsonString));
}
