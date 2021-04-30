"use strict";

import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

export default {
  input: "dist/index.js",
  output: [
    {
      file: pkg.unpkg,
      format: "umd",
      name: "d3",
      extend: true,
      plugins: [terser()]
    },
    {
      file: pkg.main,
      format: "umd",
      name: "d3",
      extend: true
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  onwarn(warning) {
    // generated by typescript for compatability
    if (warning.code === "THIS_IS_UNDEFINED") return;
    console.warn(warning.message);
  },
  plugins: [
    replace({
      preventAssignment: true,
      // FastPriorityQueue has this nasty line that breaks iife
      "require.main === module": false
    }),
    alias({
      // this is a hack, we replace fs and child process with "something else"
      // since we know they won't be called
      entries: {
        fs: "d3-array",
        child_process: "d3-array"
      }
    }),
    nodeResolve({ preferBuiltins: false }),
    commonjs()
  ]
};
