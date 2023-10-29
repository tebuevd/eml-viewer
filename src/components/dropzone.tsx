import clsx from "clsx";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export function Dropzone({
	className,
	processFile,
}: {
	className?: string;
	processFile: (file: File) => unknown;
}) {
	const [highlight, setHighlight] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<label
			className={twMerge(
				clsx(
					"grid place-content-center rounded border-2 border-solid",
					"hover:border-none hover:outline hover:outline-2",
					{
						"border-none outline outline-2": highlight,
					},
					className,
				),
			)}
			onDragEnter={(e) => {
				e.preventDefault();
				void setHighlight(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				void setHighlight(false);
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={async (e) => {
				e.preventDefault();

				for (const file of e.dataTransfer.files) {
					await processFile(file);
				}

				setHighlight(false);
			}}
		>
			<input
				ref={inputRef}
				accept=".eml"
				id="file-input"
				type="file"
				multiple
				className="hidden"
				onChange={async (e) => {
					e.preventDefault();

					for (const file of e.target.files ?? []) {
						await processFile(file);
					}

					setHighlight(false);
				}}
			/>
			Drag Files Here
		</label>
	);
}
