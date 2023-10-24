import { parseEml } from "./utils";

async function getRoot() {
  return await navigator.storage.getDirectory();
}

export async function saveToOpfs(file: File) {
  const opfsRoot = await navigator.storage.getDirectory();

  const fileHandle = await opfsRoot.getFileHandle(file.name, { create: true });

  const writable = await fileHandle.createWritable();
  await writable.write(file);
  await writable.close();
}

export async function getAllFilenames() {
  const root = await getRoot();
  const filenames = [];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  for await (const name of root.keys()) {
    filenames.push(name);
  }
  return filenames;
}

export async function parseEmlFile(filename: string) {
  const root = await getRoot();
  const fileHandle = await root.getFileHandle(filename);
  const file = await fileHandle.getFile();
  const json = await parseEml(file);

  return JSON.parse(json) as Record<string, string | string[] | number>;
}
