import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [wasm(), react()],
});
