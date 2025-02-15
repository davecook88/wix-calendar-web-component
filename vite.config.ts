import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ThriveCalendar", // This will be your global variable name in UMD
      formats: ["umd"],
      fileName: (format) => `thrive-calendar.${format}.js`,
    },
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        globals: {
          // No need to specify globals since we're bundling everything
        },
      },
    },
  },
});
