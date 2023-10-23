import { useState } from "react";
import { parseEml } from "./utils";

function App() {
  const [json, setJson] = useState<null | Record<string, string | number>>(
    null
  );
  return (
    <main className="space-y-4 p-4 sm:p-6 md:p-8">
      <section>
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (!file) {
              return;
            }

            const json = JSON.parse(await parseEml(file));
            setJson(json);
          }}
        />
      </section>
      {json && (
        <section>
          <code>{JSON.stringify(json, null, 2)}</code>
        </section>
      )}
    </main>
  );
}

export default App;
