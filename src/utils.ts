import load, { eml_to_json } from "../crate/pkg/eml_viewer";

await load();

export async function parseEml(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const jsonString = eml_to_json(bytes);
  return jsonString;
}
