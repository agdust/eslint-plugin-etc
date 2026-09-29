# eslint-plugin-etc

Local fork of [cartant/eslint-plugin-etc](https://github.com/cartant/eslint-plugin-etc). 14 TypeScript-specific rules using type-aware analysis.

## Commands

```bash
yarn run dist         # lint + clean + tsc (tsconfig-dist.json)
yarn run test         # mocha -r ts-node/register tests/**/*.ts
yarn run lint         # eslint source + tests
yarn run prettier     # format source and tests
```

Run a single test:
```bash
npx mocha -r ts-node/register -t 5000 tests/rules/no-t.ts
```

## Architecture

TypeScript source in **`source/`** (not `src/`), compiled to `dist/` via `tsconfig-dist.json`. Uses **legacy ESLint plugin format** with `requireindex` for dynamic rule/config loading.

- `source/index.ts` — Auto-discovers rules and configs via `requireindex`
- `source/rules/` — 14 rules, many using TypeScript parser services and type checker
- `source/configs/recommended.ts` — Recommended ruleset
- `source/utils.ts` — Rule creator from `@typescript-eslint/experimental-utils`
- `source/tag.ts` / `source/tslint-tag.ts` — JSDoc/TSLint tag utilities
- Tests in `tests/rules/` using a custom `fromFixture` helper for readable test expectations

## Conventions

- Package manager: **yarn** (not npm)
- Test framework: **Mocha** (not vitest)
- Source directory: **`source/`** (not `src/`)
- ESLint 8 legacy plugin format (not ESLint 9 flat config)
- Key dependency: `@phenomnomnominal/tsquery` for CSS-like TypeScript AST selectors
- Build target: ES2018, CommonJS output
