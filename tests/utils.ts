/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { RuleTester } from "@typescript-eslint/rule-tester";
import { after, describe, it } from "mocha";
import { resolve } from "path";

RuleTester.afterAll = after;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

// Relative to tsconfigRootDir (the RuleTester joins them).
const filename = "file.tsx";
const tsconfigRootDir = resolve(__dirname);

export function ruleTester({
  comments = false,
  types = true,
}: { comments?: boolean; types?: boolean } = {}): RuleTester {
  const tester = new RuleTester({
    languageOptions: {
      parserOptions: {
        comment: comments,
        ecmaFeatures: { jsx: true },
        ...(types ? { project: "./tsconfig.json" } : {}),
        tsconfigRootDir,
      },
    },
  });
  const run = tester.run.bind(tester);
  tester.run = (name, rule, { invalid = [], valid = [] }) =>
    run(name, rule, {
      invalid: invalid.map((test) => ({ ...test, filename })),
      valid: valid.map((test) =>
        typeof test === "string"
          ? { code: test, filename }
          : { ...test, filename },
      ),
    });
  return tester;
}
