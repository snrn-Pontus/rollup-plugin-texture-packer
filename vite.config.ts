import {defineConfig} from "vite";

import typescript from "@rollup/plugin-typescript";
import path from "path";
import {typescriptPaths} from "rollup-plugin-typescript-paths";
import {nodePolyfills} from "vite-plugin-node-polyfills";

export default defineConfig({
    plugins: [
        nodePolyfills(),
    ],
    resolve: {
        alias: [
            {
                find: "~",
                replacement: path.resolve(__dirname, "./src"),
            },
        ],
    },
    server: {
        port: 3000,
    },
    build: {
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, "src/rollup-plugin-texture-packer.ts"),
            fileName: "main",
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: [],
            plugins: [
                typescriptPaths({
                    preserveExtensions: true,
                }),
                typescript({
                    sourceMap: false,
                    declaration: true,
                    outDir: "dist",
                }),
            ],
        },
    },
});
