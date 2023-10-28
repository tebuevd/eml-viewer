import { useState, useCallback, useEffect } from "react";
import { instance } from "../workers/opfs";

export function useFiles() {
	const [files, setFiles] = useState<string[]>(() => []);

	useEffect(() => {
		instance.getAllFilenames().then((filenames) => {
			setFiles(filenames);
		});
	}, []);

	const addFile = useCallback(async (file: File) => {
		await instance.saveToOpfs(file);
		setFiles((files) => [...files, file.name]);
		return file;
	}, []);

	return { files, addFile };
}
