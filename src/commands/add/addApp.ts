import path from 'path';
import { addPackageJson } from './addPackageJson';
import { addDependencies } from './addDependencies';

export const addApp = (appName: string, type: string, monorepoRoot: string) => {
  const category = type === 'package' ? 'packages' : 'apps';
  const appDir = path.join(monorepoRoot, category, appName);
  addPackageJson(appDir, type, appName);
  addDependencies(appDir, type, appName);
};
