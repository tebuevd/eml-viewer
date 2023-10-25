export const instance = new ComlinkWorker<typeof import("../opfs")>(
  new URL("../opfs", import.meta.url),
  { type: "module" }
);
