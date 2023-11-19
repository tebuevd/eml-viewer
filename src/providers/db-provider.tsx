import { useEffect } from "react";

import { instance as dbWorker } from "../workers/sqlite";

export function DbProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		console.log("attempting to load db");
		dbWorker
			.initDb()
			.then((result) => {
				console.log("db loaded:", result);
			})
			.catch((error) => {
				console.log("db error:", error);
			});
	}, []);

	return <>{children}</>;
}
