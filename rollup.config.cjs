import { visualizer } from "rollup-plugin-visualizer";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import pkg from './package.json' assert { type: 'json' };
import { dts } from "rollup-plugin-dts";
import ts from "rollup-plugin-ts";

const isProduction = process.env.NODE_ENV === "production";
const libraryName = "module-manager";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "auto",
        inlineDynamicImports: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: libraryName,
        sourcemap: true,
        globals: {
          "reflect-metadata": "Reflect",
        },
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
        extensions: [".js", ".ts"],
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        rootDir: "src"
      }),
      visualizer(),
      isProduction && terser(),
    ],
    external: [
      'reflect-metadata',
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      "__tests__/**/*"
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins: [
      dts()
    ],
    external: [
      'reflect-metadata',
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      "__tests__/**/*"
    ]
  },
  {
    input: "__tests__/test.ts",
    output: {
      file: "dist_test/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
      inlineDynamicImports: true,
    },
    plugins: [
      resolve({
        preferBuiltins: true,
        extensions: [".js", ".ts"],
      }),
      commonjs(),
      json(),
      ts({
        tsconfig: "./tsconfig.json"
      }),
      isProduction && terser(),
    ],
    external: [
      'reflect-metadata',
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]
  },
];
