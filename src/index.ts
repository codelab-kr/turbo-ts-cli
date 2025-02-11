import path from 'path';
import fs from 'fs';
import { program } from 'commander';
import inquirer from 'inquirer';
import { initializeMonorepo } from './commands/init/initRepo';
import { addApp } from './commands/add/addApp';

const MONOREPO_MARKER = '.monorepo'; // 파일로 초기화 상태 관리
let monorepoDir = '';

/**
 * Checks if the current directory is a monorepo root.
 */
const isMonorepoInitialized = (): boolean => {
  return fs.existsSync(path.join(process.cwd(), MONOREPO_MARKER));
};

/**
 * Marks the current directory as a monorepo root.
 */
const markAsMonorepo = (): void => {
  fs.writeFileSync(path.join(process.cwd(), MONOREPO_MARKER), '');
};

/**
 * CLI for managing a Turbo-powered monorepo.
 */
program
  .name('turbo-ts-cli')
  .description(
    'CLI for creating and maintaining a Turbo monorepo with batteries included.'
  )
  .version('1.0.0');

/**
 * Default command: Initialize a new Turbo monorepo, or handle dynamic app/package creation.
 */
program
  .argument('[name]', 'Name of the monorepo, app, or package')
  .option('--node', 'Create a Node.js app')
  .option('--next', 'Create a Next.js app')
  .option('--nest', 'Create a Nest.js app')
  .option('--package', 'Create a shared package')
  .action(async (name, options) => {
    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the monorepo, app, or package:',
          validate: (input) => (input ? true : 'Name cannot be empty.'),
        },
      ]);
      name = answers.name;
    }

    const currentDir = process.cwd();

    if (
      !isMonorepoInitialized() &&
      (options.node || options.next || options.nest || options.package)
    ) {
      console.error(
        'Error: Monorepo is not initialized. Please initialize the monorepo first.\nRun "turbo-ts-cli <monorepo-name> && cd <monorepo-name>" then make apps or packages.'
      );
      process.exit(1);
    }

    monorepoDir = path.join(currentDir, name);

    if (options.node) {
      addApp(name, 'node', monorepoDir);
    } else if (options.next) {
      addApp(name, 'next', monorepoDir);
    } else if (options.nest) {
      addApp(name, 'nest', monorepoDir);
    } else if (options.package) {
      addApp(name, 'package', monorepoDir);
    } else {
      // Default: Initialize monorepo
      initializeMonorepo(name);
      process.chdir(monorepoDir); // Change working directory to the new monorepo root
      markAsMonorepo(); // Mark as monorepo root
    }
  });

program.parse(process.argv);
