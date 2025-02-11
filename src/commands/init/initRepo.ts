import path from 'path';
import { copyTemplate } from '../../utils';
import { addDependencies } from '../add/addDependencies';
import { addPackageJson } from '../add/addPackageJson';

/**
 * Turbo 모노레포 초기화 함수
 * @param monorepoName - 생성할 모노레포 이름
 */
export const initializeMonorepo = (monorepoName: string): void => {
  const dbName = `${monorepoName.replace(/-/g, '_')}_dev`;
  console.log(`🚀 Initializing Turbo monorepo: ${monorepoName}`);
  console.log(`🛢️  Database name: ${dbName}`);

  const cliRoot = path.resolve(__dirname, '..');
  const monorepoRoot = path.join(process.cwd(), monorepoName);

  // 📁 공통 템플릿 복사
  copyTemplate(cliRoot, 'monorepo', monorepoRoot);

  // 🎯 앱 및 패키지 목록
  const projects = {
    packages: ['eslint', 'tsconfig', 'database', 'queue', 'auth-common'],
    apps: {
      next: ['front'],
      nest: ['api', 'auth'],
      node: ['worker'],
    },
  };

  // 📦 패키지 추가
  projects.packages.forEach((packageName) => {
    const packageDir = path.join(monorepoRoot, 'packages', packageName);

    addPackageJson(packageDir, 'package', packageName);
    addDependencies(packageDir, 'package', packageName);

    // tsconfig, eslint, docker는 공통 템플릿 제외
    if (
      !['tsconfig', 'eslint', 'docker', 'database', 'queue'].includes(
        packageName
      )
    ) {
      copyTemplate(cliRoot, 'common', packageDir);
    }
  });

  // 🏗️ 앱 추가
  Object.entries(projects.apps).forEach(([type, appNames]) => {
    appNames.forEach((appName) => {
      const appDir = path.join(monorepoRoot, 'apps', appName);

      // Next.js는 package.json 자동 생성됨
      if (type !== 'next') {
        addPackageJson(appDir, type, appName);
        copyTemplate(cliRoot, 'common', appDir);
      }

      addDependencies(appDir, type, appName);

      // 특정 앱 타입에 대한 템플릿 적용
      if (
        (type === 'next' && appName === 'front') ||
        (type === 'nest' && appName === 'api')
      ) {
        copyTemplate(cliRoot, type, appDir);
      }
    });
  });

  console.log(`✅ Turbo monorepo '${monorepoName}' initialized successfully.`);
};
