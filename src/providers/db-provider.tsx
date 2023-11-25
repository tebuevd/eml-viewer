import { useEffect, useState } from "react";

import { LoadingScreen } from "../components/LoadingScreen";
import { instance as dbWorker } from "../workers/sqlite";

export function DbProvider({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("attempting to load db");
		dbWorker
			.initDb()
			.then((result) => {
				console.log("db loaded:", result);
				setLoading(false);
			})
			.catch((error) => {
				console.log("db error:", error);
			});
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}

	return <>{children}</>;
}
