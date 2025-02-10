import path from 'path';
import {
  createDirIfNotExists,
  writeJsonFile,
  writeFile,
  getPnpmVersion,
  copyCliPackageTemplate,
} from '../utils';
import { addBasePackage } from './addBasePackage';
import { addApp } from './addApp';
import {
  extensionsJson,
  gitignore,
  packageJson,
  pnpmWorkspaceYaml,
  prettierrc,
  readmeMd,
  settingsJson,
  turboJson,
} from '../contents/monorepo';

/**
 * Initializes a new Turbo monorepo.
 * @param monorepoName - The name of the monorepo to initialize.
 */
export const initializeMonorepo = (monorepoName: string): void => {
  const dbName = `${monorepoName.replace(/-/g, '_')}_dev`;

  console.log(`Initializing Turbo monorepo: ${monorepoName}`);
  console.log(`DB name: ${dbName}`);

  const pnpmVersion = getPnpmVersion();

  // Root directory setup
  const rootDir = path.join(process.cwd(), monorepoName);
  createDirIfNotExists(rootDir);

  // Create packages and apps directories
  createDirIfNotExists(path.join(rootDir, 'packages'));
  createDirIfNotExists(path.join(rootDir, 'apps'));

  // Create pnpm-workspace.yaml
  writeFile(path.join(rootDir, 'pnpm-workspace.yaml'), pnpmWorkspaceYaml);

  // Create turbo.json
  writeJsonFile(path.join(rootDir, 'turbo.json'), turboJson);

  // Create root package.json
  writeJsonFile(
    path.join(rootDir, 'package.json'),
    packageJson(monorepoName, pnpmVersion)
  );

  // Create .prettierrc
  writeJsonFile(path.join(rootDir, '.prettierrc'), prettierrc);

  // Create .prettierignore
  writeFile(path.join(rootDir, '.prettierignore'), `pnpm-lock.yaml`);

  //.vscode
  createDirIfNotExists(path.join(rootDir, '.vscode'));
  writeJsonFile(path.join(rootDir, '.vscode', 'settings.json'), settingsJson);
  writeJsonFile(
    path.join(rootDir, '.vscode', 'extensions.json'),
    extensionsJson
  );

  // Add a basic README file
  writeFile(path.join(rootDir, 'README.md'), readmeMd(monorepoName));

  // Create .gitignore file
  writeFile(path.join(rootDir, '.gitignore'), gitignore);

  // Add default packages
  const basePackage = ['eslint-config', 'typescript-config', 'docker'];
  const helperPackage = ['database', 'types', 'queue'];

  basePackage.forEach((pkg) => {
    addBasePackage(pkg, path.join(rootDir, 'packages'), dbName);
  });

  helperPackage.forEach((pkg) => {
    addApp(pkg, 'package', monorepoName);
  });

  const cliRoot = path.resolve(__dirname, '..');
  const monorepoRoot = rootDir;
  console.log('CLI Root:', cliRoot);
  console.log('Monorepo Root:', monorepoRoot);

  copyCliPackageTemplate(
    'database',
    'database',
    monorepoRoot,
    'packages',
    cliRoot
  );
  copyCliPackageTemplate('types', 'types', monorepoRoot, 'packages', cliRoot);
  copyCliPackageTemplate('queue', 'queue', monorepoRoot, 'packages', cliRoot);

  // Add default apps & copy templates
  addApp('web', 'next', monorepoName);
  addApp('worker', 'node', monorepoName);
  addApp('api', 'nest', monorepoName);

  copyCliPackageTemplate('nest', 'api', monorepoRoot, 'apps', cliRoot);
  copyCliPackageTemplate('node', 'worker', monorepoRoot, 'apps', cliRoot);
  copyCliPackageTemplate('next', 'web', monorepoRoot, 'apps', cliRoot);

  console.log(`Turbo monorepo '${monorepoName}' initialized successfully.`);
};
