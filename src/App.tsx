import load, { eml_to_json } from "../crate/pkg/eml_viewer";

await load();

function App() {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const contents = e.target?.result as ArrayBuffer;
              const byteArray = new Uint8Array(contents);
              const json = eml_to_json(byteArray);
              console.log(json);
            };
            reader.readAsArrayBuffer(file);
          }
        }}
      />
    </main>
  );
}

export default App;
