import {
  createDirIfNotExists,
  installDependencies,
  installDevDependencies,
  removeGitDirectory,
  runCommand,
} from '../../utils';

/**
 * 패키지 유형 (package)에 따라 종속성 추가
 */
const handlePackageDependencies = (appName: string, appDir: string) => {
  const packageDeps: Record<string, { deps?: string; devDeps?: string }> = {
    tsconfig: { devDeps: '@tsconfig/node20' },
    eslint: { devDeps: '@eslint/js eslint globals typescript-eslint' },
    'auth-common': {
      deps: '@nestjs/common @nestjs/config @nestjs/core @nestjs/platform-express @nestjs/passport dotenv reflect-metadata rxjs zod jsonwebtoken @nestjs/jwt passport-jwt passport-local nestjs-zod',
      devDeps:
        '@packages/eslint@workspace:^ @packages/tsconfig@workspace:^ tsup @swc/core nodemon @types/passport-jwt @types/passport-local',
    },
    database: {
      deps: '@nestjs/common @nestjs/config @nestjs/core @nestjs/platform-express dotenv drizzle-orm pg reflect-metadata rxjs zod',
      devDeps:
        '@packages/eslint@workspace:^ @packages/tsconfig@workspace:^ tsup @swc/core nodemon @types/node @types/pg drizzle-kit',
    },
    queue: {
      deps: 'bullmq ioredis',
      devDeps:
        '@packages/eslint@workspace:^ @packages/tsconfig@workspace:^ tsup @swc/core nodemon',
    },
  };

  const { deps, devDeps } = packageDeps[appName] || {};

  installDependencies(deps || '', appDir);
  installDevDependencies(devDeps || '', appDir);

  console.log(`✅ Package dependencies added for: ${appName}`);
};

/**
 * 애플리케이션 유형 (next, nest, node)에 따라 종속성 추가
 */
const handleAppDependencies = (
  type: string,
  appName: string,
  appDir: string
) => {
  if (type === 'next') {
    runCommand(
      `pnpm dlx create-next-app@latest ${appDir} --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --turbo`
    );
    installDependencies(
      '@packages/queue@workspace:^ @packages/database@workspace:^ drizzle-orm zustand axios class-transformer class-validator pg',
      appDir
    );
    removeGitDirectory(appDir, appName);
    return;
  }

  if (type === 'nest') {
    installDependencies(
      '@nestjs/core @nestjs/common @nestjs/config @nestjs/platform-express reflect-metadata rxjs nestjs-zod express zod',
      appDir
    );
    installDependencies(
      '@packages/queue@workspace:^ @packages/database@workspace:^ @packages/auth-common@workspace:^ drizzle-orm @types/express',
      appDir
    );

    if (appName === 'auth') {
      installDependencies(
        '@nestjs/passport @nestjs/jwt passport passport-jwt passport-local passport-github passport-google-oauth20 ioredis @nestjs-modules/ioredis bcrypt cookie-parser',
        appDir
      );
      installDevDependencies('@types/bcrypt @types/cookie-parser', appDir);
    }
  }

  if (type === 'node') {
    installDependencies(
      '@faker-js/faker bullmq @packages/queue@workspace:^ @packages/database@workspace:^ drizzle-orm',
      appDir
    );
  }

  installDevDependencies(
    '@packages/eslint@workspace:^ @packages/tsconfig@workspace:^ tsup @swc/core nodemon',
    appDir
  );
};

/**
 * Monorepo에 새로운 앱을 추가하고 종속성을 설정
 */
export const addDependencies = (
  appDir: string,
  type: string,
  appName: string
): void => {
  console.log(`🚀 Adding new app: ${appName} (${type})`);
  console.log(`📂 App directory: ${appDir}`);

  createDirIfNotExists(appDir);

  if (type === 'package') {
    handlePackageDependencies(appName, appDir);
  } else {
    handleAppDependencies(type, appName, appDir);
  }

  runCommand(`pnpm install`, { cwd: appDir });
  console.log(`✅ Dependencies installed for: ${appName}`);
};
