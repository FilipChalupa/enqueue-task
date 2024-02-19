import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import del from 'rollup-plugin-delete'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' assert { type: 'json' }

const outputDirectory = path.parse(packageJson.main).dir

export default {
	input: './src/index.ts',
	output: {
		dir: outputDirectory,
		format: 'esm',
		sourcemap: true,
		preserveModules: true,
	},
	plugins: [
		del({ targets: path.parse(packageJson.main).dir + '/*' }),
		resolve(),
		commonjs(),
		typescript(),
	],
}
