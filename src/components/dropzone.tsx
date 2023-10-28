import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function Dropzone({ className }: { className?: string }) {
	const [drag, setDrag] = useState(false);

	return (
		<label
			className={twMerge(
				clsx(
					"block rounded border-2 border-solid p-2",
					{
						"border-t-orange-300": drag,
					},
					className,
				),
			)}
			onDragEnter={() => void setDrag(true)}
			onDragLeave={() => void setDrag(false)}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={async (e) => {
				e.preventDefault();
			}}
		>
			<input id="file-input" type="file" className="hidden w-full text-sm" />
		</label>
	);
}
// async (e) => {
//           const file = e.target.files?.[0];

//           if (!file) {
//             return;
//           }

//           await addFile(file);
//         }
