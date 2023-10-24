import { useState, useCallback, useEffect } from "react";
import { getAllFilenames, saveToOpfs } from "../opfs";

export function useFiles() {
  const [files, setFiles] = useState<string[]>(() => []);

  useEffect(() => {
    getAllFilenames().then((filenames) => setFiles(filenames));
  }, []);

  const addFile = useCallback(async (file: File) => {
    await saveToOpfs(file);
    setFiles((files) => [...files, file.name]);
    return file;
  }, []);

  return { files, addFile };
}
