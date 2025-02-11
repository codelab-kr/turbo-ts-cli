import path from 'path';
import { createDirIfNotExists, writeJsonFile } from '../../utils';

/**
 * 공통적으로 포함할 기본 package.json 설정
 */
const basePackageJson = {
  private: true,
  type: 'module',
  version: '1.0.0',
  types: '',
  exports: {},
  publishConfig: {},
  scripts: {},
  dependencies: {},
  devDependencies: {},
  nodemonConfig: {},
};

/**
 * 공통적으로 사용될 exports 설정
 */
const commonExports = {
  '.': {
    types: './src/index.ts',
    default: './dist/index.js',
  }
};

/**
 * 공통적으로 사용될 scripts 설정 (🚀 apps 에만 적용)
 */
const commonScripts = {
  build: 'tsup --clean',
  'check-types': 'tsc --noEmit',
  dev: 'tsup --watch & nodemon',
  lint: 'eslint .',
  start: 'node dist/index', // 기본적으로 dist/index.js 실행
};

/**
 * 공통적으로 사용될 nodemon 설정
 */
const commonNodemonConfig = {
  watch: ['dist'],
  ext: 'js',
  exec: 'node dist/index.js', // 기본적으로 index.js 실행
};

/**
 * 특정 패키지별 추가 설정
 */
const packageOverrides: Record<string, Partial<typeof basePackageJson>> = {
  eslint: {
    exports: { '.': './index.js' },
  },
  tsconfig: {
    exports: { './base.json': './base.json' },
    publishConfig: { access: 'public' },
  },
  database: {
    types: 'dist/index.d.ts',
    exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
    },
    scripts: {
      ...commonScripts,
      drop: 'drizzle-kit drop',
      generate: 'drizzle-kit generate',
      migrate: 'drizzle-kit migrate',
      studio: 'drizzle-kit studio',
      seed: 'tsx scripts/seed.ts',
    },
  },
  queue: {
    exports: commonExports,
    scripts: commonScripts,
  },
  'auth-common': {
    exports: commonExports,
    scripts: commonScripts,
  },
};

/**
 * package.json 생성 함수
 */
export const addPackageJson = (
  appDir: string,
  type: string,
  appName: string
) => {
  console.log(`🚀 Generating package.json for: ${appName}`);

  createDirIfNotExists(appDir);

  const appType = type === 'package' ? 'packages' : 'apps';

  // ✅ NestJS(`api`, `auth` 등)는 `dist/main.js`, 그 외는 `dist/index.js`
  const isNestApp = type === 'nest';
  const scripts = {
    ...commonScripts,
    start: isNestApp ? 'node dist/main' : 'node dist/index',
  };

  const nodemonConfig = {
    ...commonNodemonConfig,
    exec: isNestApp ? 'node dist/main.js' : 'node dist/index.js',
  };

  const packageJson = Object.assign(
    {
      name: `@${appType}/${appName}`,
      ...basePackageJson,
      // exports: commonExports,
      nodemonConfig,
      scripts: appType === 'apps' ? scripts : {}, // ✅ apps 에만 commonScripts 적용
    },
    packageOverrides[appName] || {} // 특정 패키지별 설정 적용
  );

  writeJsonFile(path.join(appDir, 'package.json'), packageJson);
  console.log(`✅ ${appType} '${appName}' created successfully.`);
};
