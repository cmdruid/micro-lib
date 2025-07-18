import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import terser     from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const treeshake = {
	moduleSideEffects       : false,
	propertyReadSideEffects : false,
	tryCatchDeoptimization  : false
}

const onwarn = (warning) => {
  if (
    warning.code === 'INVALID_ANNOTATION' && 
    warning.message.includes('@__PURE__')
  ) {
    return
  } else if (warning.code === 'CIRCULAR_DEPENDENCY') {
    return
  } else {
    console.error(warning)
  }
  throw new Error(warning)
}

export default {
  input: 'src/index.ts',
  onwarn,
  output: [
    {
      file: 'dist/main.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/module.mjs',
      format: 'es',
      sourcemap: true,
      minifyInternalExports: false
    },
    {
      file: 'dist/script.js',
      format: 'iife',
      name: 'microlib',
      plugins: [ terser() ],
      sourcemap: true,
      globals: {
        crypto: 'crypto',
      }
    }
  ],
  plugins: [ typescript(), resolve(), commonjs() ],
  strictDeprecations: true,
  treeshake
}
