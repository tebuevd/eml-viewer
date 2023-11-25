import { Outlet } from "@tanstack/react-router";

import { Dropzone } from "./components/dropzone";
import { useFiles } from "./hooks/useFiles";

function App() {
	const { addFile } = useFiles();

	return (
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
	);
}

export default App;
