import { useRef, useState } from "react";
import { cn } from "../utils/styles";

export function Dropzone({
	className,
	processFile,
}: {
	className?: string;
	processFile: (file: File) => unknown;
}) {
	const [highlight, setHighlight] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	async function writeFilesToOPFS(files: FileList) {
		for (const file of files) {
			await processFile(file);
		}
	}

	return (
		<label
			className={cn(
				"grid place-content-center rounded border-2 border-solid",
				"hover:border-none hover:outline hover:outline-2",
				{
					"border-none outline outline-2": highlight,
				},
				className,
			)}
			onDragEnter={(e) => {
				e.preventDefault();
				setHighlight(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				setHighlight(false);
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				writeFilesToOPFS(e.dataTransfer.files)
					.then(() => {
						setHighlight(false);
					})
					.catch((err) => {
						console.error("Error in writeFilesToOPFS:", err);
					});
			}}
		>
			<input
				ref={inputRef}
				accept=".eml"
				id="file-input"
				type="file"
				multiple
				className="hidden"
				onChange={(e) => {
					e.preventDefault();

					if (!e.target.files) {
						return;
					}

					writeFilesToOPFS(e.target.files)
						.then(() => {
							setHighlight(false);
						})
						.catch((err) => {
							console.error("Error in writeFilesToOPFS:", err);
						});
				}}
			/>
			Drag Files Here
		</label>
	);
}
