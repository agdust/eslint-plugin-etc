import { ESLint } from "eslint";
import { strict as assert } from "node:assert";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import tseslint from "typescript-eslint";
import plugin = require("../source/index");

describe("plugin", () => {
  it("exposes every rule in source/rules", () => {
    const files = readdirSync(resolve(__dirname, "../source/rules"))
      .map((f) => f.replace(/\.ts$/, ""))
      .sort();
    assert.deepEqual(Object.keys(plugin.rules).sort(), files);
  });

  it("has a doc page for every rule", () => {
    const docs = readdirSync(resolve(__dirname, "../docs/rules"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort();
    assert.deepEqual(Object.keys(plugin.rules).sort(), docs);
  });

  it("recommended config references the plugin object and its own rules", () => {
    const config = plugin.configs.recommended;
    assert.equal(config.plugins.etc, plugin);
    for (const rule of Object.keys(config.rules)) {
      assert.ok(rule.slice("etc/".length) in plugin.rules, rule);
    }
  });

  it("works end-to-end with a flat config", async () => {
    const eslint = new ESLint({
      cwd: resolve(__dirname),
      overrideConfigFile: true,
      overrideConfig: [
        {
          files: ["**/*.tsx"],
          languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
              project: "./tsconfig.json",
              tsconfigRootDir: resolve(__dirname),
            },
          },
        },
        plugin.configs.recommended,
        { rules: { "etc/prefer-less-than": "error" } },
      ] as ESLint.Options["overrideConfig"],
    });
    const [result] = await eslint.lintText(
      "const a = [3, 1, 2];\nexport const b = a.sort();\nexport const c = 2 > 1;\n",
      { filePath: resolve(__dirname, "file.tsx") },
    );
    assert.deepEqual(result?.messages.map((m) => m.ruleId).sort(), [
      "etc/no-assign-mutated-array",
      "etc/prefer-less-than",
    ]);
  });
});
