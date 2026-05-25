# AstroKalki Monorepo Structure

This project uses pnpm workspaces to manage multiple packages and applications in a single repository.

## Directory Structure

\`\`\`
.
├── packages/
│   ├── types/                # Shared TypeScript types and schemas
│   ├── utils/                # Shared utility functions
│   ├── api/                  # Shared API utilities and middleware
│   └── ui/                   # Shared UI components and design system
├── app/                      # Next.js application directory
├── components/               # Main application components
├── lib/                      # Application utility functions
├── public/                   # Static assets
├── styles/                   # Global styles
├── __tests__/                # Test files
├── e2e/                      # End-to-end tests (Playwright)
├── pnpm-workspace.yaml       # Workspace configuration
├── package.json              # Root package configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.mjs           # Next.js configuration
\`\`\`

## Getting Started

### Installation

\`\`\`bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies for all packages
pnpm install

# Install a dependency in a specific package
pnpm add lodash --filter @astrokalki/utils
\`\`\`

### Development

\`\`\`bash
# Start development server
pnpm dev

# Start development server with specific port
pnpm dev -- -p 3001

# Build specific package (e.g., types)
pnpm --filter @astrokalki/types build
\`\`\`

**Common Development Commands:**
- `pnpm dev` - Start Next.js dev server with hot reload
- `pnpm build` - Create optimized production build
- `pnpm start` - Start production server (after building)

### Building

\`\`\`bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @astrokalki/types build
\`\`\`

### Testing

\`\`\`bash
# Run all tests with Jest
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run E2E tests with Playwright
pnpm test:e2e

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Run E2E tests with UI
pnpm test:e2e:ui

# Run tests for a specific package
pnpm --filter @astrokalki/utils test
\`\`\`

### Linting and Formatting

\`\`\`bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
\`\`\`

## Package Descriptions

### @astrokalki/types
Shared TypeScript types and schemas for the entire monorepo. Uses Zod for runtime validation.

**Exports:**
- `User`, `UserSchema`
- `Consultation`, `ConsultationSchema`
- `Payment`, `PaymentSchema`
- `Reading`, `ReadingSchema`
- `ApiResponse`, `ApiResponseSchema`

### @astrokalki/utils
Shared utility functions for common operations across packages.

**Exports:**
- Date utilities: `formatDate()`, `getTimeUntil()`
- Validation: `isValidEmail()`, `isValidPhoneNumber()`
- Currency: `formatCurrency()`
- String: `slugify()`, `truncate()`
- Object: `omit()`, `pick()`

### @astrokalki/api
Shared API utilities and middleware.

**Exports:**
- Response builders: `successResponse()`, `errorResponse()`
- Error handling: `handleApiError()`
- `RateLimiter` class for request rate limiting

### @astrokalki/ui
Shared UI components and design system constants.

**Exports:**
- `UI_COLORS` - Color constants
- `UI_SPACING` - Spacing constants
- `BadgeVariants` - Badge style variants
- `ButtonVariants` - Button style variants

## Adding New Packages

1. Create a new directory in `packages/`
2. Create a `package.json` with the appropriate name and configuration
3. Create a `src/` directory with source files
4. Add the package path to `pnpm-workspace.yaml` if needed
5. Reference the package in other packages using `workspace:*` protocol

Example:
\`\`\`bash
mkdir -p packages/auth/src
\`\`\`

## Cross-Package Dependencies

To use one package in another, add it to the dependent package's `package.json`:

\`\`\`json
{
  "dependencies": {
    "@astrokalki/types": "workspace:*",
    "@astrokalki/utils": "workspace:*"
  }
}
\`\`\`

The `workspace:*` protocol tells pnpm to use the local version of the package.

## Dependency Management

### Add a dependency to a specific package
\`\`\`bash
pnpm add axios --filter @astrokalki/utils
\`\`\`

### Add a dev dependency
\`\`\`bash
pnpm add -D @types/node --filter @astrokalki/types
\`\`\`

### Update all dependencies
\`\`\`bash
pnpm update
\`\`\`

### Update a specific package's dependencies
\`\`\`bash
pnpm update --filter @astrokalki/utils
\`\`\`

## Performance Tips

- Use workspace protocols (`workspace:*`) to reference internal packages
- Run `pnpm install` from the root to use the workspace resolver
- Use `pnpm --filter <package>` to run commands only for specific packages
- Leverage pnpm's built-in caching for faster builds

## CI/CD Integration

All npm scripts are inherited from the root `package.json`. CI/CD pipelines should:

1. Install dependencies: `pnpm install`
2. Build: `pnpm build`
3. Test: `pnpm test`
4. Lint: `pnpm lint`

## Environment Setup

### Prerequisites

- **Node.js**: v18.17.0 or higher (check with `node --version`)
- **pnpm**: v8.0.0 or higher (install with `npm install -g pnpm@latest`)

### Initial Setup

1. Clone the repository
2. Install pnpm globally: `npm install -g pnpm`
3. Install dependencies: `pnpm install`
4. Set up environment variables (see `.env.example` or project documentation)
5. Start development: `pnpm dev`

### Verify Installation

\`\`\`bash
# Check versions
node --version    # Should be v18.17.0+
pnpm --version    # Should be v8.0.0+

# Verify workspace setup
pnpm ls -r --depth=0    # Lists all packages in workspace
\`\`\`

## Troubleshooting

### Common Issues

#### 1. **"Cannot find module" errors after installing dependencies**
\`\`\`bash
# Clear node_modules and reinstall
pnpm install --force
pnpm store prune    # Clean pnpm cache
\`\`\`

#### 2. **TypeScript errors in IDE but code compiles**
\`\`\`bash
# Rebuild workspace dependencies
pnpm install
pnpm build

# Restart your IDE/TypeScript language server
\`\`\`

#### 3. **Port 3000 already in use**
\`\`\`bash
# Run on different port
pnpm dev -- -p 3001
\`\`\`

#### 4. **Changes in packages don't reflect in main app**
\`\`\`bash
# Ensure packages are properly built
pnpm --filter @astrokalki/types build
pnpm --filter @astrokalki/utils build
pnpm install    # Reinstall node_modules with updated packages
\`\`\`

#### 5. **pnpm lock file conflicts**
\`\`\`bash
# If pnpm-lock.yaml has conflicts, rebuild it
rm pnpm-lock.yaml
pnpm install
\`\`\`

### Getting Help

- Check package-specific README files in `packages/*/README.md`
- Review TypeScript/Next.js error messages carefully
- Check `.env.example` for required environment variables
- Consult project-specific docs (ARCHITECTURE.md, DEPLOYMENT.md, etc.)

## Common Gotchas

### 1. **Using npm or yarn instead of pnpm**
⚠️ This project uses pnpm exclusively. Using npm or yarn will:
- Create incompatible lock files
- Bypass workspace protocol resolution
- Break dependency linking

✅ Always use `pnpm` commands

### 2. **Forgetting workspace:* protocol**
When adding dependencies between packages in the monorepo:
\`\`\`json
// ❌ Wrong
"dependencies": {
  "@astrokalki/types": "^1.0.0"
}

// ✅ Correct
"dependencies": {
  "@astrokalki/types": "workspace:*"
}
\`\`\`

### 3. **Not updating pnpm-lock.yaml**
The lockfile must be committed. When `package.json` changes:
\`\`\`bash
pnpm install    # This updates pnpm-lock.yaml
\`\`\`

### 4. **Circular dependencies between packages**
Be careful with imports:
- `@astrokalki/types` should not depend on other packages
- `@astrokalki/utils` can depend on `@astrokalki/types`
- `@astrokalki/api` can depend on types and utils
- Main app can depend on all packages

### 5. **Modifying root dependencies without updating all packages**
Root `package.json` dependencies are shared. Changes may affect all packages unexpectedly. Always test with `pnpm test:e2e` after root dependency updates.

### 6. **TypeScript path aliases not resolving**
Ensure `tsconfig.json` paths are correctly configured:
\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@astrokalki/types": ["./packages/types/src/index.ts"],
      "@astrokalki/utils": ["./packages/utils/src/index.ts"]
    }
  }
}
\`\`\`

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm test` | Run Jest tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:e2e:debug` | Debug E2E tests |
| `pnpm test:e2e:ui` | Run E2E tests with UI |

## Best Practices

1. **Always use `pnpm` for package management** - never mix with npm or yarn
2. **Keep packages focused** - each package should have a single responsibility
3. **Use workspace:* protocol** - for internal package dependencies
4. **Run tests before committing** - use `pnpm test && pnpm test:e2e`
5. **Keep dependencies in sync** - run `pnpm install` after pulling changes
6. **Document new packages** - add README to new `packages/` entries
7. **Use TypeScript strict mode** - leverage the type system for better code quality
