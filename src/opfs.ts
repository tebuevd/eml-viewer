import { eml_to_json } from "../crate/pkg/eml_viewer";

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
  const fileBytes = await fileHandle
    .getFile()
    .then((file) => file.arrayBuffer())
    .then((buffer) => new Uint8Array(buffer));

  const json = eml_to_json(fileBytes);
  console.log(JSON.parse(json));
}
