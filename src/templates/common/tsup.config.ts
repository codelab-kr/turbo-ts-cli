import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/main.ts'],
  clean: true,
  format: ['esm'],
  minify: false,
  sourcemap: true,
});
