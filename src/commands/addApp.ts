import path from 'path';
import {
  createDirIfNotExists,
  removeGitDirectory,
  runCommand,
  writeFile,
  writeJsonFile,
} from '../utils';
import {
  dbEnv,
  eslintConfigJs,
  nestAppModuleTs,
  nestMainTs,
  tsconfigJson,
  tsupConfigTs,
} from '../contents/app';

/**
 * Adds a new app to the monorepo.
 * @param monorepoName - The name of the monorepo.
 * @param appName - The name of the app to add.
 * @param type - The type of app to create (next, node, nest, package).
 */
export const addApp = (
  appName: string,
  type: 'next' | 'node' | 'nest' | 'package',
  monorepoName?: string
): void => {
  console.log(`Adding new app: ${appName} (${type})`);

  const repo = type === 'package' ? 'packages' : 'apps';
  let appDir = path.join(process.cwd(), repo, appName);
  let dbName = `${appName.replace(/-/g, '_')}_dev`;

  if (monorepoName) {
    console.log(`Monorepo name: ${monorepoName}`);
    appDir = path.join(process.cwd(), monorepoName, repo, appName);
    dbName = `${monorepoName.replace(/-/g, '_')}_dev`;
  }

  // Define app directory
  console.log(`App directory: ${appDir}`);
  console.log(`Adding new app: ${appName} (${type})`);

  if (type === 'next') {
    runCommand(
      `pnpm dlx create-next-app@latest ${appDir} --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --turbo`
    );
    runCommand(
      `pnpm add @packages/queue@workspace:^ @packages/db@workspace:^ @prisma/client`,
      { cwd: appDir }
    );
    runCommand(`pnpm add -D @packages/types@workspace:^`, { cwd: appDir });
    writeFile(path.join(appDir, '.env'), dbEnv(dbName));
    removeGitDirectory(appDir, appName);
    return;
  }
  createDirIfNotExists(appDir);

  // eslint.config.js
  writeFile(path.join(appDir, 'eslint.config.js'), eslintConfigJs);

  // tsconfig.json
  writeJsonFile(path.join(appDir, 'tsconfig.json'), tsconfigJson);

  // tsup.config.ts
  writeFile(path.join(appDir, 'tsup.config.ts'), tsupConfigTs);

  createDirIfNotExists(path.join(appDir, 'src'));

  // Create a basic package.json for the app
  const packageJson: Record<string, any> = {
    name: `@${repo}/${appName}`,
    private: true,
    type: 'module',
    version: '1.0.0',
    main: type === 'nest' ? 'dist/main.js' : 'dist/index.js',
    exports: {},
    scripts: {
      build: 'tsup --clean',
      'check-types': 'tsc --noEmit',
      dev: 'tsup --watch & nodemon',
      lint: 'eslint .',
      start: `node dist/${type === 'nest' ? 'main' : 'index'}`,
    },
    dependencies: {},
    devDependencies: {
      '@packages/eslint-config': 'workspace:^',
      '@packages/typescript-config': 'workspace:^',
      '@swc/core': '^1',
      nodemon: '^3',
      tsup: '^8',
    },
    nodemonConfig: {
      watch: ['dist'],
      ext: 'js',
      exec: `node dist/${type === 'nest' ? 'main' : 'index'}.js`,
    },
  };

  if (type === 'package') {
    if (appName === 'db') {
      console.log('Adding db package...');
      packageJson.dependencies['@prisma/client'] = '^6';
      packageJson.dependencies['nanoid'] = '^5';
      packageJson.dependencies['@faker-js/faker'] = '^9';
      packageJson.devDependencies['prisma'] = '^6';
      packageJson.devDependencies['@types/node'] = '^20';
      packageJson.scripts['build'] = `pnpm build:prisma && tsup --clean`;
      packageJson.scripts['build:prisma'] = `prisma generate`;
      packageJson.scripts['migrate'] = `prisma migrate`;
      packageJson.scripts['seed'] = `prisma db seed`;
      packageJson.scripts['push'] = `prisma db push`;
      packageJson.scripts['studio'] = `prisma studio`;
      writeFile(path.join(appDir, '.env'), dbEnv(dbName));
    } else if (appName === 'queue') {
      console.log('Adding queue package...');
      packageJson.dependencies['bullmq'] = '^5';
      packageJson.dependencies['ioredis'] = '^5';
    } else {
      delete packageJson.scripts.dev;
    }
    packageJson.exports['.'] = {
      types: './src/index.ts',
      default: './dist/index.js',
    };
  } else {
    if (type === 'node') {
      packageJson.dependencies['@faker-js/faker'] = '^9';
    }
    packageJson.dependencies['@packages/types'] = 'workspace:^';
    packageJson.dependencies['@packages/db'] = 'workspace:^';
    packageJson.dependencies['@packages/queue'] = 'workspace:^';
    packageJson.dependencies['bullmq'] = '^5';
    packageJson.dependencies['ioredis'] = '^5';
    packageJson.dependencies['@prisma/client'] = '^6';
  }

  if (type === 'nest') {
    writeFile(path.join(appDir, 'src', 'main.ts'), nestMainTs);
    writeFile(path.join(appDir, 'src', 'app.module.ts'), nestAppModuleTs);
    packageJson.dependencies['@nestjs/core'] = '^9';
    packageJson.dependencies['@nestjs/common'] = '^9';
    packageJson.dependencies['@nestjs/platform-express'] = '^9';
    packageJson.dependencies['reflect-metadata'] = '^0.1.13';
    packageJson.dependencies['rxjs'] = '^7';
  } else {
    writeFile(
      path.join(appDir, 'src', 'index.ts'),
      `console.log('Welcome to ${appName}!');`
    );
  }

  writeJsonFile(path.join(appDir, 'package.json'), packageJson);

  console.log(`App '${appName}' of type '${type}' added successfully.`);
};
