/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ESLintUtils, TSESTree as es } from "@typescript-eslint/utils";
import {
  couldBeType,
  getParent,
  isArrayExpression,
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
} from "../etc-utils";
import { ruleCreator } from "../utils";

const mutatorRegExp = /^(fill|reverse|sort)$/;
const creatorRegExp = /^(concat|entries|filter|keys|map|slice|splice|values)$/;

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids the assignment of returned, mutated arrays.",
      recommended: true,
      requiresTypeChecking: true,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Assignment of mutated arrays is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-assign-mutated-array",
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program } =
      ESLintUtils.getParserServices(context);
    const typeChecker = program.getTypeChecker();
    const couldBeArray = (node: es.Node) =>
      couldBeType(
        typeChecker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(node)),
        "Array",
      );
    return {
      [`CallExpression > MemberExpression[property.name=${mutatorRegExp.toString()}]`]:
        (memberExpression: es.MemberExpression) => {
          const callExpression = getParent(
            memberExpression,
          ) as es.CallExpression;
          const parent = getParent(callExpression);
          if (parent && !isExpressionStatement(parent)) {
            if (
              couldBeArray(memberExpression.object) &&
              mutatesReferencedArray(callExpression)
            ) {
              context.report({
                messageId: "forbidden",
                node: memberExpression.property,
              });
            }
          }
        },
    };

    function isNewArray(node: es.Expression): boolean {
      if (isArrayExpression(node)) {
        return true;
      }
      if (isNewExpression(node)) {
        return true;
      }
      if (isCallExpression(node)) {
        const { callee } = node;
        if (isIdentifier(callee) && callee.name === "Array") {
          return true;
        }
        if (
          isMemberExpression(callee) &&
          isIdentifier(callee.object) &&
          callee.object.name === "Array"
        ) {
          return true;
        }
      }
      return false;
    }

    function mutatesReferencedArray(
      callExpression: es.CallExpression,
    ): boolean {
      if (isMemberExpression(callExpression.callee)) {
        const memberExpression = callExpression.callee;
        const { object, property } = memberExpression;
        if (isIdentifier(property) && creatorRegExp.test(property.name)) {
          return false;
        }
        if (isNewArray(object)) {
          return false;
        }
        if (isCallExpression(object)) {
          return mutatesReferencedArray(object);
        }
      }
      return true;
    }
  },
});

export = rule;
