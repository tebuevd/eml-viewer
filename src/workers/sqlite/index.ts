export const sqliteWorker = new ComlinkWorker<typeof import("./worker")>(
	new URL("./worker", import.meta.url),
	{ name: "SQLite Beast", type: "module" },
);
