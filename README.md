# @agdust/eslint-plugin-etc

[![NPM version](https://img.shields.io/npm/v/@agdust/eslint-plugin-etc.svg)](https://www.npmjs.com/package/@agdust/eslint-plugin-etc)

TypeScript-related ESLint rules from [`eslint-plugin-etc`](https://github.com/cartant/eslint-plugin-etc) by Nicholas Jamieson, which is no longer maintained and supports only ESLint 8.

This maintained fork supports **ESLint 9 and 10 (flat config only)**, typescript-eslint 8 and TypeScript 5.0–6.0. It keeps only the rules that have **no modern equivalent**. For the rules that were removed, see [Migrating from eslint-plugin-etc 2.x](#migrating-from-eslint-plugin-etc-2x).

# Install

```sh
npm install --save-dev @agdust/eslint-plugin-etc typescript-eslint eslint typescript
```

Most rules need type information, so set up [typed linting](https://typescript-eslint.io/getting-started/typed-linting) and add the plugin to `eslint.config.js`:

```js
import etc from "@agdust/eslint-plugin-etc";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  etc.configs.recommended,
  {
    rules: {
      "etc/prefer-less-than": "error",
    },
  },
];
```

# Rules

Rules marked with ✅ are in `recommended`, 🔧 have fixers, and 💭 need type information.

| Rule | Description | ✅ | 🔧 | 💭 |
| --- | --- | --- | --- | --- |
| [`no-assign-mutated-array`](docs/rules/no-assign-mutated-array.md) | Forbids the assignment of returned, mutated arrays (`sort`, `reverse`, `fill`). | ✅ | | 💭 |
| [`no-const-enum`](docs/rules/no-const-enum.md) | Forbids the use of `const enum`. Constant enums are [not compatible with isolated modules](https://ncjamieson.com/dont-export-const-enums/). | | | 💭 |
| [`no-internal`](docs/rules/no-internal.md) | Forbids the use of `@internal` APIs. | ✅ | | 💭 |
| [`prefer-less-than`](docs/rules/prefer-less-than.md) | Forbids greater-than comparisons. | | 🔧 | |
| [`underscore-internal`](docs/rules/underscore-internal.md) | Forbids `@internal` APIs that are not prefixed with underscores. | | | 💭 |

# Migrating from eslint-plugin-etc 2.x

- Replace `eslint-plugin-etc` with `@agdust/eslint-plugin-etc`, and `extends: ["plugin:etc/recommended"]` with `etc.configs.recommended` in a flat config. The `etc/` rule prefix is unchanged.
- These rules were removed because maintained equivalents exist:

| Removed rule | Use instead |
| --- | --- |
| `etc/no-commented-out-code` | [`sonarjs/no-commented-code`](https://sonarsource.github.io/rspec/#/rspec/S125/javascript) |
| `etc/no-deprecated` | [`@typescript-eslint/no-deprecated`](https://typescript-eslint.io/rules/no-deprecated) |
| `etc/no-enum` | `no-restricted-syntax` with `TSEnumDeclaration`, or [`@agdust/eslint-plugin-total-functions`](https://www.npmjs.com/package/@agdust/eslint-plugin-total-functions) `total-functions/no-enums` |
| `etc/no-foreach` | [`unicorn/no-for-each`](https://github.com/sindresorhus/eslint-plugin-unicorn) |
| `etc/no-implicit-any-catch` | [`@typescript-eslint/use-unknown-in-catch-callback-variable`](https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable) |
| `etc/no-misused-generics` | [`@typescript-eslint/no-unnecessary-type-parameters`](https://typescript-eslint.io/rules/no-unnecessary-type-parameters) |
| `etc/no-t` | [`@typescript-eslint/naming-convention`](https://typescript-eslint.io/rules/naming-convention) with `{ selector: "typeParameter", format: ["PascalCase"], custom: { regex: "^.{2,}$", match: true } }` |
| `etc/prefer-interface` | [`@typescript-eslint/consistent-type-definitions`](https://typescript-eslint.io/rules/consistent-type-definitions) `["error", "interface"]` |
| `etc/throw-error` | [`@typescript-eslint/only-throw-error`](https://typescript-eslint.io/rules/only-throw-error) + [`@typescript-eslint/prefer-promise-reject-errors`](https://typescript-eslint.io/rules/prefer-promise-reject-errors) |

- `recommended` now contains `no-assign-mutated-array` and `no-internal`. The removed `no-deprecated` and `no-implicit-any-catch` are covered by the replacements above.
