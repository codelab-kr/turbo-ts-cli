import fs from 'fs-extra'
import path from 'path';

/** 디렉토리가 없으면 생성 */
export const createDirIfNotExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/** JSON 파일 쓰기 */
export const writeJsonFile = (filePath: string, data: Record<string, any>): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/** 일반 파일 쓰기 */
export const writeFile = (filePath: string, content: string): void => {
  fs.writeFileSync(filePath, content);
};

/**
 * Deletes the .git directory if it exists in the specified application directory.
 * @param appDir - The application directory path.
 * @param name - The name of the application.
 */
export const removeGitDirectory = (appDir: string, name: string): void => {
  const gitDir = path.join(appDir, '.git');
  if (fs.existsSync(gitDir)) {
    console.log(`Removing .git directory from ${name} app...`);
    fs.rmSync(gitDir, { recursive: true, force: true });
  }
};

/**
 * Reads a template file from the CLI's templates directory, replaces placeholders, and writes it to the target monorepo package.
 * @param cliRoot - The root directory of the CLI program.
 * @param monorepoRoot - The root directory of the monorepo.
 * 
 */
export const copyTemplate = (
  cliRoot: string,
  templateName: string,
  monorepoRoot: string

): void => {
  const templateDir = path.join(cliRoot, `src/templates/${templateName}`);
  const targetDir = path.join(monorepoRoot);

  console.log(`📂 Template Source (CLI Program): ${templateDir}`);
  console.log(`📂 Target Destination (Monorepo): ${targetDir}`);

  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Template directory not found: ${templateDir}`);
    return;
  }

  // Ensure target directory exists
  fs.ensureDirSync(targetDir);

  // Copy all template files from CLI to the monorepo package directory
  fs.copySync(templateDir, targetDir, { overwrite: true });

  console.log(
    `✅ CLI repo '${monorepoRoot}' created from '${cliRoot}' template.`
  );
};