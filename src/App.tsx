import { parseEml } from "./utils";

function App() {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) {
            return;
          }

          const json = JSON.parse(await parseEml(file));
          console.log(json);
        }}
      />
    </main>
  );
}

export default App;
