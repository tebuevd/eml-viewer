import { Outlet } from "@tanstack/react-router";

import { Dropzone } from "./components/dropzone";
import { useFiles } from "./hooks/useFiles";
import { DbProvider } from "./providers/db-provider";

function App() {
	const { addFile } = useFiles();

	return (
		<DbProvider>
			<div className="grid max-h-full min-h-full grid-cols-[minmax(520px,1fr),minmax(200px,15%)] grid-rows-1">
				<main className="row-span-full shadow-[0_0_30px_0] shadow-black/10">
					<Outlet />
				</main>

				<aside
					className="col-start-2 row-span-full flex flex-col bg-gradient-to-r from-sh-sidebar-start from-0% to-sh-sidebar-end to-40% p-2"
					id="dropzone"
				>
					<Dropzone className="mt-auto h-40" processFile={addFile} />
				</aside>
			</div>
		</DbProvider>
	);
}

export default App;

// <form
// 		className="hidden gap-2"
// 		onSubmit={function formOnSubmit(e) {
// 			e.preventDefault();

// 			const data = new FormData(e.target as HTMLFormElement);
// 			const query =
// 				typeof data.get("query") === "string" ? data.get("query") : "";

// 			db.query(query?.toString() ?? "")
// 				.then((results) => {
// 					setResults(results);
// 				})
// 				.catch((e) => {
// 					console.error("Error in query:", e);
// 				});
// 		}}
// 	>
// 		<input className="p-2 dark:text-black" name="query" type="search" />
// 		<button
// 			className="rounded-md p-2 dark:border-2 dark:border-white"
// 			type="submit"
// 		>
// 			Search
// 		</button>
// 	</form>
// 	<div className="hidden flex-1 overflow-scroll">
// 		{results.map((result, ix) => (
// 			//@ts-expect-error need typing for the result type
// 			<p key={ix}>{result.title}</p>
// 		))}
// 	</div>
// 	{json && (
// 		<iframe className="h-full w-full" srcDoc={json.body_html as string} />
// 	)}
