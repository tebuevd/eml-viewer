import { useCallback, useEffect, useState } from "react";

import { instance as opfs } from "../workers/opfs";

export function useFiles() {
	const [loading, setLoading] = useState<boolean>(true);
	const [files, setFiles] = useState<string[]>(() => []);

	useEffect(() => {
		async function loadFilenamesIntoState() {
			const filenames = await opfs.getAllFilenames();
			setFiles(filenames);
			setLoading(false);
		}
		loadFilenamesIntoState().catch(console.error);
	}, []);

	const addFile = useCallback(async (file: File) => {
		await opfs.saveToOpfs(file);
		setFiles((files) => [...files, file.name]);
		return file;
	}, []);

	return { addFile, files, loading };
}
