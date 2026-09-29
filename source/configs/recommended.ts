/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import type { TSESLint } from "@typescript-eslint/utils";

export const recommendedRules = {
  "etc/no-assign-mutated-array": "error",
  "etc/no-internal": "error",
} as const satisfies TSESLint.FlatConfig.Rules;
