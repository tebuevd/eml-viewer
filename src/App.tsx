import { useState } from "react";
import { useFiles } from "./hooks/useFiles";
import { instance as opfs } from "./workers/opfs";
import { instance as db } from "./workers/sqlite";
import { Dropzone } from "./components/dropzone";

function App() {
	const [json, setJson] = useState<null | Record<
		string,
		string | number | string[]
	>>(null);
	const { files, addFile, loading } = useFiles();
	const [results, setResults] = useState<any[]>([]);

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<main className="grid max-h-full min-h-full grid-cols-[minmax(200px,15%),1fr] grid-rows-5 gap-2 dark:bg-slate-600 dark:text-slate-200">
			<section
				id="files"
				className="col-span-1 col-start-1 row-span-4 row-start-1 overflow-scroll p-2"
			>
				<ul className="mt-4 cursor-pointer space-y-1 text-sm">
					<li className="cursor-default">🏠 (Root)</li>
					{files.map((name) => (
						<li
							key={name}
							className="overflow-hidden overflow-ellipsis whitespace-nowrap bg-slate-200 pl-4 hover:bg-transparent dark:bg-slate-800 dark:text-white dark:hover:bg-red-800"
							onClick={async () => {
								const json = await opfs.parseEmlFile(name);
								setJson(json);
							}}
						>
							{name}
						</li>
					))}
				</ul>
			</section>
			<section
				id="dropzone"
				className="col-span-1 col-start-1 row-span-1 row-end-6 p-2"
			>
				<Dropzone className="h-full" processFile={addFile} />
			</section>

			<section className="col-start-2 row-span-full flex flex-col space-x-4 p-8 pl-0">
				<form
					className="hidden gap-2"
					onSubmit={async function (e) {
						e.preventDefault();

						const data = new FormData(e.target as HTMLFormElement);
						const query =
							typeof data.get("query") === "string" ? data.get("query") : "";
						const results = await db.query(query?.toString() ?? "");
						setResults(results);
					}}
				>
					<input className="p-2 dark:text-black" name="query" type="search" />
					<button
						type="submit"
						className="rounded-md p-2 dark:border-2 dark:border-white"
					>
						Search
					</button>
				</form>
				<div className="hidden flex-1 overflow-scroll">
					{results.map((result, ix) => (
						<p key={ix}>{result.title}</p>
					))}
				</div>
				{json && (
					<iframe className="h-full w-full" srcDoc={json.body_html as string} />
				)}
			</section>
		</main>
	);
}

export default App;
