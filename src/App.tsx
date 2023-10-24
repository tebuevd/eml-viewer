import { useEffect, useState } from "react";
import { parseEml } from "./utils";
import { getAllFilenames, parseEmlFile, saveToOpfs } from "./opfs";

function App() {
  const [json, setJson] = useState<null | Record<string, string | number>>(
    null
  );
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    getAllFilenames().then((files) => setFiles(files));
  }, []);

  return (
    <main className="grid grid-cols-4 gap-4">
      <section className="cols-span-1 p-4 pr-0 max-w-xs">
        <ul className="space-y-1 text-sm cursor-pointer">
          <li className="cursor-default">🏠 (Root)</li>
          {files.map((name) => (
            <li
              key={name}
              className="pl-4 bg-slate-200 hover:bg-transparent"
              onClick={() => parseEmlFile(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="p-8 pl-0">
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (!file) {
              return;
            }

            await saveToOpfs(file);

            const json = JSON.parse(await parseEml(file));
            setJson(json);
          }}
        />
        {json && <code>{JSON.stringify(json, null, 2)}</code>}
      </section>
    </main>
  );
}

export default App;
