import { execSync } from 'child_process';

/** Shell 명령어 실행 */
export const runCommand = (command: string, options: any = {}): void => {
  console.log(`Running command: ${command}`);
  execSync(command, { stdio: 'inherit', ...options });
};

/**
 * 종속성 추가를 위한 공통 실행 함수
 */
export const installDependencies = (deps: string, cwd: string) => {
  if (deps) {
    runCommand(`pnpm add ${deps}`, { cwd });
  }
};

/**
 * 개발 종속성 추가를 위한 공통 실행 함수
 */
export const installDevDependencies = (deps: string, cwd: string) => {
  if (deps) {
    runCommand(`pnpm add -D ${deps}`, { cwd });
  }
};
