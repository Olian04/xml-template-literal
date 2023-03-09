import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: './src/api.ts',
    output: {
      file: './dist/api.umd.js',
      format: 'umd',
      name: 'xmlTemplateLiteral',
      sourcemap: true,
    },
    plugins: [
      typescript({
        target: 'es5',
        module: 'es6',
        compilerOptions: {
          declaration: false,
          sourceMap: true,
        },
        exclude: ['tests/**/*.ts'],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: './src/api.ts',
    output: {
      file: './dist/api.es.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript({
        target: 'es6',
        module: 'es6',
        compilerOptions: {
          declaration: false,
          sourceMap: true,
        },
        exclude: ['tests/**/*.ts'],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: './src/api.ts',
    output: {
      file: './dist/api.js',
      format: 'commonjs',
      sourcemap: true,
    },
    plugins: [
      typescript({
        typescript: ttypescript,
        target: 'es6',
        module: 'es6',
        compilerOptions: {
          target: 'es6',
          module: 'es6',
          plugins: [
            { transform: 'typescript-transform-paths' },
            {
              transform: 'typescript-transform-paths',
              afterDeclarations: true,
            },
          ],
        },
        exclude: ['tests/**/*.test.ts'],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];
