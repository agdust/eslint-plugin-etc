/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ESLintUtils, TSESTree as es } from "@typescript-eslint/utils";
import { includesModifier } from "ts-api-utils";
import { getLoc } from "../etc-utils";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  allowLocal?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids the use of `const enum`.",
      requiresTypeChecking: true,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "`const enum` is forbidden.",
    },
    schema: [
      {
        properties: {
          allowLocal: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-const-enum",
  create: (context) => ({
    TSEnumDeclaration: (node: es.Node) => {
      const [{ allowLocal = false } = {}] = context.options;
      const { esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);
      const enumDeclaration = esTreeNodeToTSNodeMap.get(
        node,
      ) as ts.EnumDeclaration;
      if (
        allowLocal &&
        !includesModifier(
          enumDeclaration.modifiers,
          ts.SyntaxKind.ExportKeyword,
        )
      ) {
        return;
      }
      if (
        !includesModifier(enumDeclaration.modifiers, ts.SyntaxKind.ConstKeyword)
      ) {
        return;
      }
      context.report({
        messageId: "forbidden",
        loc: getLoc(enumDeclaration.name),
      });
    },
  }),
});

export = rule;
