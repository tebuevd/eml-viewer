/// <reference lib="webworker" />
import { parseEml } from "../../utils/eml";

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

	return JSON.parse(json) as Record<string, number | string | string[]>;
}
