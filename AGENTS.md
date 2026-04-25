# AGENTS.md

This file documents the skills needed to work with this codebase.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Desktop**: Tauri 2 (Rust backend)
- **Styling**: TailwindCSS 4 + Radix UI components
- **State**: Zustand + Dexie (IndexedDB)
- **Editor**: Monaco Editor
- **Testing**: Vitest + Playwright
- **Validation**: Zod 4
- **Package Manager**: pnpm

## Commands

### Development

- `pnpm dev` - Start the Vite dev server on port 61570
- `pnpm tauri dev` - Start the Tauri desktop app with Vite

### Testing

- `pnpm test` - Run unit tests with vitest
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm e2e` - Run end-to-end tests with Playwright
- `pnpm e2e:ui` - Run e2e tests with Playwright UI
- `pnpm e2e:headed` - Run e2e tests in headed mode

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm ts:lint` - Run TypeScript type checking
- `pnpm prettier:fix` - Run Prettier with auto-fix
- `pnpm prettier:check` - Check Prettier formatting

### Pre-commit

The project uses husky for pre-commit hooks which run:

- ESLint on staged files
- Prettier on all files

### Versioning & Releases

- `pnpm commit` - Create a conventional commit using commitizen
- `pnpm release:patch` - Release a patch version
- `pnpm release:minor` - Release a minor version
- `pnpm release:major` - Release a major version

## Code Conventions

### Naming & Structure

- Components use PascalCase: `MyComponent.tsx`
- Hooks use camelCase with `use` prefix: `useSnippets.tsx`
- Utils/providers use camelCase: `snippetUtils.ts`
- Test files use `.test.ts` or `.test.tsx` suffix
- Pages are in `src/components/layout/pages/`

### Styling

- Uses TailwindCSS 4 with `cn()` utility for class merging
- Components use Radix UI primitives wrapped with class-variance-authority
- Theme switching via `useTheme` hook and `ThemeProvider`

### State Management

- Global state via custom store in `src/lib/store/globalState.ts`
- Settings stored in localStorage with migration support
- API providers for snippet operations in `src/lib/providers/`
- Snippet APIs: GitHub (`src/lib/api/github-api.ts`), GitLab (`src/lib/api/gitlab-api.ts`), Local (`src/lib/api/local-api.ts`)

### Testing

- Unit tests co-located with source files using `.test.ts` or `.test.tsx`
- E2E tests in root `e2e/` directory
- Uses `@testing-library/react` for React component testing

### Internationalization

- Translations stored in `public/locales/` as JSON files (en.json, fr.json, es.json, de.json, ru.json, zh.json, ja.json)
- Key structure: `list.viewAsList`, `list.viewByTags`, `list.viewByLanguages`
- Add new keys to all locale files when adding UI text
