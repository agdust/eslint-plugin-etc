/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ESLintUtils } from "@typescript-eslint/utils";

export interface EtcDocs {
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

export const ruleCreator = ESLintUtils.RuleCreator<EtcDocs>(
  (name) =>
    `https://github.com/agdust/eslint-plugin-etc/tree/main/docs/rules/${name}.md`,
);
