import { useState } from "react";
import { useFiles } from "./hooks/useFiles";
import { instance } from "./workers/opfs";
import { Dropzone } from "./components/dropzone";

function App() {
	const [json, setJson] = useState<null | Record<
		string,
		string | number | string[]
	>>(null);
	const { files, addFile } = useFiles();

	return (
		<main className="grid min-h-full grid-cols-4 grid-rows-5 gap-4">
			<section
				id="files"
				className="col-span-1 col-start-1 row-span-4 row-start-1"
			>
				<ul className="mt-4 cursor-pointer space-y-1 text-sm">
					<li className="cursor-default">🏠 (Root)</li>
					{files.map((name) => (
						<li
							key={name}
							className="overflow-hidden overflow-ellipsis whitespace-nowrap bg-slate-200 pl-4 hover:bg-transparent"
							onClick={async () => {
								const json = await instance.parseEmlFile(name);
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
				className="col-span-1 col-start-1 row-span-1 row-end-6 p-1"
			>
				<Dropzone className="h-full" />
			</section>

			<section className="col-span-3 row-span-full p-8 pl-0">
				{json && (
					<iframe className="h-full w-full" srcDoc={json.body_html as string} />
				)}
			</section>
		</main>
	);
}

export default App;
