/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import type { TSESLint } from "@typescript-eslint/utils";
import { recommendedRules } from "./configs/recommended";
import noAssignMutatedArray = require("./rules/no-assign-mutated-array");
import noConstEnum = require("./rules/no-const-enum");
import noInternal = require("./rules/no-internal");
import preferLessThan = require("./rules/prefer-less-than");
import underscoreInternal = require("./rules/underscore-internal");

const rules = {
  "no-assign-mutated-array": noAssignMutatedArray,
  "no-const-enum": noConstEnum,
  "no-internal": noInternal,
  "prefer-less-than": preferLessThan,
  "underscore-internal": underscoreInternal,
};

const plugin = {
  meta: { name: "@agdust/eslint-plugin-etc" },
  rules,
  // A getter: `configs` (below) references `plugin`, so it is created after it.
  get configs(): typeof configs {
    return configs;
  },
};

// Configs reference the exported plugin object itself: ESLint rejects two
// different objects registered under the same plugin name.
const configs = {
  recommended: {
    name: "etc/recommended",
    plugins: { etc: plugin },
    rules: recommendedRules,
  },
} satisfies Record<string, TSESLint.FlatConfig.Config>;

export = plugin;
