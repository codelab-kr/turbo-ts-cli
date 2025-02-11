# turbo-ts-cli-work

This is a monorepo project created with turbo-ts-cli.

## Getting Started

To boot up the project for the first time:


0. Install and build
   ```
   pnpm install 
   pnpm build
   ```


1. Start the development environment:
   ```
   pnpm dev
   ```
   This command will start Docker containers and all the apps.

2. Once Docker is up, create the initial migration and migrate the database:
   ```
   pnpm db:init
   ```

3. Open the web app(next.js): http://localhost:3000

4. Open the api app(nest.js): http://localhost:4000/products

   You can test using `apps/api/api-test.http` file.

    🚀 How to Use

    1️⃣ Open api-test.http in VS Code

    2️⃣ Install REST Client (if not installed)

    3️⃣ Click “Send Request” next to any request
   
    4️⃣ 🎉 Test API instantly!

## Useful Commands

- `pnpm dev`: Start the development environment
- `pnpm build`: Build all packages and apps
- `pnpm check-types`: Run type checking for all packages and apps
- `pnpm db`: Run Prisma commands for the db package
- `pnpm db:reset`: Reset the database and run migrations

## Project Structure

- `apps/`: Contains all the applications
  - `web/`: Next.js web application
  - `worker/`: Node.js worker application
- `packages/`: Contains shared packages
  - `db/`: Database package with Prisma setup
  - `queue/`: Queue package for background jobs
  - `docker/`: Docker configuration for local development
  - `types/`: Shared TypeScript types
  - `eslint-config/`: Shared ESLint configuration
  - `typescript-config/`: Shared TypeScript configuration

## Adding New Apps or Packages

To add a new app or package to the monorepo, use the following command:

```
turbo-ts-cl <name> [--next | --node | --nest | --package ]
```

This will create a new app in the `apps/` directory with the necessary configuration.

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