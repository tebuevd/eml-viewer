export const instance = new ComlinkWorker<typeof import("./worker")>(
	new URL("./worker", import.meta.url),
	{ type: "module" },
);
