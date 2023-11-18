import { useState, useCallback, useEffect } from "react";
import { instance as opfs } from "../workers/opfs";

export function useFiles() {
	const [loading, setLoading] = useState<boolean>(true);
	const [files, setFiles] = useState<string[]>(() => []);

	useEffect(() => {
		opfs.getAllFilenames().then(async (filenames) => {
			setFiles(filenames);
			setLoading(false);
		});
	}, []);

	const addFile = useCallback(async (file: File) => {
		await opfs.saveToOpfs(file);
		setFiles((files) => [...files, file.name]);
		return file;
	}, []);

	return { files, addFile, loading };
}
