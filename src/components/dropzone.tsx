import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { cn } from "../utils/styles";
import { sqliteWorker } from "../workers/sqlite";

export function Dropzone({ className }: { className?: string }) {
	const queryClient = useQueryClient();
	const [highlight, setHighlight] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	async function processFiles(files: FileList) {
		for (const file of files) {
			if (file.name.endsWith(".eml")) {
				await sqliteWorker.processEmlFile(file);
			} else if (file.name.endsWith(".mbox")) {
				await sqliteWorker.processMbox(file);
			}
		}
		await queryClient.refetchQueries({
			queryKey: ["emails"],
		});
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
				processFiles(e.dataTransfer.files)
					.then(() => {
						setHighlight(false);
					})
					.catch((err) => {
						console.error("Error in writeFilesToOPFS:", err);
					});
			}}
		>
			<input
				accept=".eml,.mbox"
				className="hidden"
				id="file-input"
				multiple
				onChange={(e) => {
					e.preventDefault();

					if (!e.target.files) {
						return;
					}

					processFiles(e.target.files)
						.then(() => {
							setHighlight(false);
						})
						.catch((err) => {
							console.error("Error in writeFilesToOPFS:", err);
						});
				}}
				ref={inputRef}
				type="file"
			/>
			Drag Files Here
		</label>
	);
}
