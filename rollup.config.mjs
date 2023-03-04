import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions[]} */
const es6 = [
  {
    input: './src/api.ts',
    output: {
      file: './cdn/xml-template-literal.mjs',
      format: 'es',
    },
    plugins: [
      typescript({
        target: 'es6',
        module: 'esnext',
        compilerOptions: {
          declaration: false,
          sourceMap: false,
        },
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];

/** @type {import('rollup').RollupOptions[]} */
const es5 = [
  {
    input: './src/api.ts',
    output: {
      file: './cdn/xml-template-literal.js',
      format: 'umd',
      name: 'xmlTemplateLiteral',
    },
    plugins: [
      typescript({
        target: 'es5',
        module: 'esnext',
        compilerOptions: {
          declaration: false,
          sourceMap: false,
        },
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];

/** @type {import('rollup').RollupOptions[]} */
export default [...es5, ...es6];
