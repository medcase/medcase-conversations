import { Options } from 'tsup';

const config: Options = {
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  format: ['cjs'],
};

export default config;
