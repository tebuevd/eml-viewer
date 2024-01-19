import { Outlet } from "@tanstack/react-router";

import { Dropzone } from "./components/dropzone";

function App() {
	return (
		<div className="grid max-h-full min-h-full grid-cols-[minmax(520px,1fr),minmax(200px,15%)] grid-rows-1">
			<main className="z-10 row-span-full">
				<Outlet />
			</main>

			<aside
				className="col-start-2 row-span-full flex flex-col bg-gradient-to-r from-sh-sidebar-start from-0% to-sh-sidebar-end to-40% p-2"
				id="dropzone"
			>
				<Dropzone className="mt-auto h-40" />
			</aside>
		</div>
	);
}

export default App;
