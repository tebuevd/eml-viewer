export const opfsWorker = new ComlinkWorker<typeof import("./worker")>(
	new URL("./worker", import.meta.url),
	{ name: "OPFS Chad", type: "module" },
);
