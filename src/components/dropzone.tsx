import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
	Button,
	DropZone,
	FileDropItem,
	FileTrigger,
} from "react-aria-components";

import { cn } from "../utils/styles";
import { sqliteWorker } from "../workers/sqlite";

export function Dropzone({ className }: { className?: string }) {
	const queryClient = useQueryClient();
	const [processing, setProcessing] = useState(false);
	const highlight = false;

	const processEmlMboxFiles = useCallback(async function processEmlMboxFiles(
		files: File[] | FileList,
	) {
		setProcessing(true);
		const promises = [];
		for (const file of files) {
			switch (true) {
				case file.name.endsWith(".eml"):
					promises.push(sqliteWorker.processEmlFile(file));
					break;
				case file.name.endsWith(".mbox"):
					promises.push(sqliteWorker.processMbox(file));
					break;
				default:
					break;
			}
		}

		await Promise.allSettled(promises)
			.then((results) => {
				console.log(results);
				setProcessing(false);
			})
			.catch((err) => {
				console.error(err);
				setProcessing(false);
			});
	}, []);

	return (
		<DropZone
			className={cn(
				"grid place-content-center rounded border-2 border-solid",
				"hover:border-none hover:outline hover:outline-2",
				{
					"border-none outline outline-2": highlight,
				},
				className,
			)}
			onDrop={function dropZoneOnDrop(e) {
				Promise.all(
					e.items
						.filter((i): i is FileDropItem => i.kind === "file")
						.map((i) => i.getFile()),
				)
					.then((files) => {
						return processEmlMboxFiles(files);
					})
					.then(() => {
						return queryClient.refetchQueries({ queryKey: ["emails"] });
					})
					.catch((err) => {
						console.error(err);
					});
			}}
		>
			<FileTrigger
				acceptedFileTypes={[".eml", ".mbox"]}
				allowsMultiple
				onSelect={function fileTriggerOnSelect(files) {
					if (files) {
						processEmlMboxFiles(files).catch(console.error);
					}
				}}
			>
				{!processing && <Button>Drag Files Here</Button>}
				{processing && "Processing..."}
			</FileTrigger>
		</DropZone>
	);
}
