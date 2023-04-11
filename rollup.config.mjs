import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: './src/api.ts',
    output: [
      {
        file: './legacy/umd.js',
        format: 'umd',
        name: 'xmlTemplateLiteral',
        sourcemap: true,
      },
      {
        file: './legacy/umd.cjs',
        format: 'umd',
        name: 'xmlTemplateLiteral',
        sourcemap: true,
      }
    ],
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
  }
];
