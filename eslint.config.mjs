import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "build/",
      "tests/modules/",
      "tests/file.tsx",
      "*.config.mjs",
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // The package is CommonJS and rules use `export =`, so `import x = require()` is the idiom.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
