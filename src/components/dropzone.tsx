import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function Dropzone({ className }: { className?: string }) {
  const [drag, setDrag] = useState(false);

  return (
    <label
      className={twMerge(
        clsx(
          "p-2 block border-2 border-solid rounded",
          {
            "border-t-orange-300": drag,
          },
          className
        )
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
      <input id="file-input" type="file" className="w-full text-sm hidden" />
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
