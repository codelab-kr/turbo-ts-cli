export const pnpmWorkspaceYaml = `
packages:
  - "apps/*"
  - "packages/*"
`;

export const turboJson = {
  $schema: 'https://turbo.build/schema.json',
  ui: 'tui',
  tasks: {
    build: {
      dependsOn: ['^build'],
      inputs: ['$TURBO_DEFAULT$', '.env*'],
      outputs: ['.next/**', '!.next/cache/**', 'dist/**'],
    },
    'check-types': {
      dependsOn: ['^check-types'],
    },
    dev: {
      cache: false,
      persistent: true,
    },
    lint: {
      dependsOn: ['^lint'],
    },
    test: {
      cache: false,
      persistent: true,
    },
  },
};

export const packageJson = (monorepoName: string, pnpmVersion: string) => ({
  name: monorepoName,
  private: true,
  version: '1.0.0',
  type: 'module',
  packageManager: `pnpm@${pnpmVersion}`, // Dynamically sets the pnpm version
  devDependencies: {
    typescript: '^5',
    turbo: '^2',
    prettier: '^3',
  },
  scripts: {
    build: 'turbo run build',
    'check-types': 'turbo run check-types',
    db: 'pnpm --filter @packages/database',
    'db:init': 'pnpm db migrate dev --name init',
    'db:seed': 'pnpm db seed',
    'db:reset': 'pnpm docker db:reset && pnpm db migrate dev',
    dev: 'turbo run dev',
    docker: 'pnpm --filter @packages/docker',
    format: 'prettier --write .',
    lint: 'turbo run lint',
    test: 'turbo run test',
  },
  engines: {
    node: '>=18',
  },
});

export const prettierrc = {
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
};

// vscode
export const settingsJson = {
  'eslint.workingDirectories': [
    {
      mode: 'auto',
    },
  ],
  'typescript.tsdk': '../node_modules/typescript/lib',
};

export const extensionsJson = {
  recommendations: ['humao.rest-client'],
};

export const gitignore = `
# Dependencies
node_modules

# Builds
.next/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Turbo
.turbo
`;

export const readmeMd = (monorepoName: string) => `
# ${monorepoName}

This is a monorepo project created with turbo-ts-cli.

## Getting Started

To boot up the project for the first time:


0. Install and build
   \`\`\`
   pnpm install 
   pnpm build
   \`\`\`


1. Start the development environment:
   \`\`\`
   pnpm dev
   \`\`\`
   This command will start Docker containers and all the apps.

2. Once Docker is up, create the initial migration and migrate the database:
   \`\`\`
   pnpm db:init
   \`\`\`

3. Open the web app(next.js): http://localhost:3000

4. Open the api app(nest.js): http://localhost:4000/products

   You can test using \`apps/api/api-test.http\` file.

    🚀 How to Use

    1️⃣ Open api-test.http in VS Code

    2️⃣ Install REST Client (if not installed)

    3️⃣ Click “Send Request” next to any request

    4️⃣ 🎉 Test API instantly!

## Useful Commands

- \`pnpm dev\`: Start the development environment
- \`pnpm build\`: Build all packages and apps
- \`pnpm check-types\`: Run type checking for all packages and apps
- \`pnpm db\`: Run Prisma commands for the db package
- \`pnpm db:reset\`: Reset the database and run migrations

## Project Structure

- \`apps/\`: Contains all the applications
  - \`web/\`: Next.js web application
  - \`worker/\`: Node.js worker application
- \`packages/\`: Contains shared packages
  - \`db/\`: Database package with Prisma setup
  - \`queue/\`: Queue package for background jobs
  - \`docker/\`: Docker configuration for local development
  - \`types/\`: Shared TypeScript types
  - \`eslint-config/\`: Shared ESLint configuration
  - \`typescript-config/\`: Shared TypeScript configuration

## Adding New Apps or Packages

To add a new app or package to the monorepo, use the following command:

\`\`\`
cd <your-monorepo>
turbo-ts-cl <name> [--next | --node | --nest | --package ]
\`\`\`

This will create a new app in the \`apps/\` or \`packages/\`  directory with the necessary configuration.

## Learn More

To learn more about the technologies used in this project:

- [Turborepo](https://turbo.build/repo)
- [pnpm](https://pnpm.io)
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs/)
- [BullMQ](https://docs.bullmq.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)
`;
