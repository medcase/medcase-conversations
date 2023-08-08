//tsup.config.ts
import { Options } from 'tsup';

const config: Options = {
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  // minify: true,
  format: ['esm', 'cjs'],
};

export default config;
