export const sqliteWorker = new ComlinkWorker<typeof import("./worker")>(
	new URL("./worker", import.meta.url),
	{ type: "module" },
);
