import { useState, useCallback, useEffect } from "react";
import { instance as opfs } from "../workers/opfs-worker";

export function useFiles() {
	const [files, setFiles] = useState<string[]>(() => []);

	useEffect(() => {
		opfs.getAllFilenames().then((filenames) => {
			setFiles(filenames);
		});
	}, []);

	const addFile = useCallback(async (file: File) => {
		await opfs.saveToOpfs(file);
		setFiles((files) => [...files, file.name]);
		return file;
	}, []);

	return { files, addFile };
}
