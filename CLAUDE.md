# eslint-plugin-etc

Maintained fork of [cartant/eslint-plugin-etc](https://github.com/cartant/eslint-plugin-etc), published as `@agdust/eslint-plugin-etc` (3.x). ESLint 9/10 flat config only, typescript-eslint 8, TypeScript 5.0–6.0. Keeps only the 5 rules without modern equivalents; the README has the migration table for the 9 removed rules.

## Commands

```bash
npm test             # mocha + tsx over tests/**/*.ts
npm run typecheck    # tsc --noEmit (source + tests)
npm run lint         # eslint (flat config: eslint.config.mjs)
npm run build        # tsc -p tsconfig-dist.json -> dist/
```

Run a single test:
```bash
npx mocha --require tsx/cjs --timeout 20000 tests/rules/no-internal.ts
```

## Releasing

Releases go only through `.github/workflows/publish.yaml` (npm Trusted Publishing, stage-only; tokens are disallowed on npm). Bump `version` + `CHANGELOG.md`, commit, push a `vX.Y.Z` tag (only repo admins can create tags), then approve the staged release with 2FA on npmjs.com or `npm stage approve`. The publish job installs no dependencies; keep it that way. `.npmrc` sets a 3-day `min-release-age` and `ignore-scripts=true` (so `prepublishOnly` doesn't run locally). CI workflows are linted by zizmor (`check-workflows.yaml`); pin every action by SHA.

## Architecture

TypeScript source in **`source/`** (not `src/`), compiled to `dist/` (CommonJS).

- `source/index.ts` — Flat-config plugin `{ meta, rules, configs }`; `configs.recommended` references the plugin object itself (via a getter)
- `source/rules/` — 5 rules: `no-assign-mutated-array`, `no-const-enum`, `no-internal`, `prefer-less-than`, `underscore-internal`
- `source/utils.ts` — `ruleCreator` (`ESLintUtils.RuleCreator` with `recommended`/`requiresTypeChecking` docs)
- `source/etc-utils.ts` — helpers vendored from cartant/eslint-etc and tsutils-etc (MIT)
- `source/tag.ts` / `source/tslint-tag.ts` — JSDoc tag utilities (tslint/mimir-derived; tsutils helpers ported at the bottom)
- `tests/rules/` — RuleTester suites using `fromFixture` (`tests/fixture.ts`, vendored): code with `~~~ [messageId]` lines under the reported range
- `tests/utils.ts` — `ruleTester({ types, comments })` on `@typescript-eslint/rule-tester`; lints in-memory code as `tests/file.tsx` (placeholder must exist on disk; `filename` is relative to `tsconfigRootDir`)
- `tests/plugin.ts` — plugin shape, docs coverage, end-to-end flat config test

## Conventions

- Package manager: **npm**
- Test framework: **Mocha** (with `tsx`), not vitest/jest
- Rules use `export =`; import them with `import x = require(...)`
- Third-party code is credited in `THIRD_PARTY_NOTICES`
