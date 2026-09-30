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

// RuleTester titles unnamed cases with their full source; collapse it to a
// single truncated line so the mocha spec output stays readable.
const maxNameLength = 80;
function nameFor(code: string): string {
  const line = code.replace(/\s+/g, " ").trim();
  return line.length > maxNameLength
    ? `${line.slice(0, maxNameLength - 1)}…`
    : line;
}

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
      invalid: invalid.map((test) => ({
        name: nameFor(test.code),
        ...test,
        filename,
      })),
      valid: valid.map((test) =>
        typeof test === "string"
          ? { code: test, filename, name: nameFor(test) }
          : { name: nameFor(test.code), ...test, filename },
      ),
    });
  return tester;
}
