import { useEffect, useState } from "react";
import { getAllFilenames, parseEmlFile, saveToOpfs } from "./opfs";

function App() {
  const [json, setJson] = useState<null | Record<
    string,
    string | number | string[]
  >>(null);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    getAllFilenames().then((files) => setFiles(files));
  }, []);

  return (
    <main className="grid grid-cols-4 gap-4 min-h-full">
      <section className="cols-span-1 p-4 pr-0 max-w-xs">
        <label className="block border-2 border-solid p-2 rounded">
          <input
            id="file-input"
            type="file"
            className="block w-full text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (!file) {
                return;
              }

              await saveToOpfs(file);
              // const json = await parseEml(file);
            }}
          />
        </label>
        <ul className="mt-4 space-y-1 text-sm cursor-pointer">
          <li className="cursor-default">🏠 (Root)</li>
          {files.map((name) => (
            <li
              key={name}
              className="pl-4 bg-slate-200 hover:bg-transparent overflow-ellipsis overflow-hidden whitespace-nowrap"
              onClick={async () => {
                const json = await parseEmlFile(name);
                setJson(json);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="p-8 pl-0 col-span-3">
        {json && (
          <iframe className="w-full h-full" srcDoc={json.body_html as string} />
        )}
      </section>
    </main>
  );
}

export default App;
