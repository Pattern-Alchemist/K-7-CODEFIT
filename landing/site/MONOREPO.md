# AstroKalki Monorepo Structure

This project uses pnpm workspaces to manage multiple packages and applications in a single repository.

## Directory Structure

\`\`\`
.
├── apps/
│   ├── web/                  # Main Next.js web application
│   └── worker/               # Background job worker
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Shared utility functions
│   ├── api/                  # Shared API utilities
│   └── ui/                   # Shared UI components
└── pnpm-workspace.yaml       # Workspace configuration
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
# Start development server for the web app
pnpm --filter web dev

# Start worker in development mode
pnpm --filter worker dev

# Run all dev servers
pnpm dev
\`\`\`

### Building

\`\`\`bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @astrokalki/types build
\`\`\`

### Testing

\`\`\`bash
# Run tests for all packages
pnpm test

# Run tests for a specific package
pnpm --filter @astrokalki/utils test

# Run tests in watch mode
pnpm test:watch
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
