/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ESLintUtils, TSESTree as es } from "@typescript-eslint/utils";
import { findParent, isIdentifier } from "../etc-utils";
import * as ts from "typescript";
import { getTagsFromDeclaration } from "../tslint-tag";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Forbids internal APIs that are not prefixed with underscores.",
      requiresTypeChecking: true,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Internal APIs not prefixed with underscores are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "underscore-internal",
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);

    function checkDeclaration(identifier: es.BindingName, tsNode: ts.Node) {
      const tags = getTagsFromDeclaration("internal", tsNode);
      if (tags.length > 0) {
        context.report({
          messageId: "forbidden",
          node: identifier,
        });
      }
    }

    return {
      "ClassDeclaration[id.name=/^[^_]/]": (node: es.ClassDeclaration) => {
        if (node.id) {
          checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "PropertyDefinition[key.name=/^[^_]/]": (node: es.PropertyDefinition) => {
        if (isIdentifier(node.key)) {
          checkDeclaration(node.key, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "FunctionDeclaration[id.name=/^[^_]/]": (
        node: es.FunctionDeclaration,
      ) => {
        if (node.id) {
          checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "MethodDefinition[key.name=/^[^_]/]": (node: es.MethodDefinition) => {
        if (isIdentifier(node.key)) {
          checkDeclaration(node.key, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "TSEnumDeclaration[id.name=/^[^_]/]": (node: es.TSEnumDeclaration) => {
        checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
      },
      "TSEnumMember[id.name=/^[^_]/]": (node: es.TSEnumMember) => {
        if (isIdentifier(node.id)) {
          checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "TSInterfaceDeclaration[id.name=/^[^_]/]": (
        node: es.TSInterfaceDeclaration,
      ) => {
        checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
      },
      "TSMethodSignature[key.name=/^[^_]/]": (node: es.TSMethodSignature) => {
        if (isIdentifier(node.key)) {
          checkDeclaration(node.key, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "TSPropertySignature[key.name=/^[^_]/]": (
        node: es.TSPropertySignature,
      ) => {
        if (isIdentifier(node.key)) {
          checkDeclaration(node.key, esTreeNodeToTSNodeMap.get(node));
        }
      },
      "TSTypeAliasDeclaration[id.name=/^[^_]/]": (
        node: es.TSTypeAliasDeclaration,
      ) => {
        checkDeclaration(node.id, esTreeNodeToTSNodeMap.get(node));
      },
      "VariableDeclarator[id.name=/^[^_]/]": (node: es.VariableDeclarator) => {
        checkDeclaration(
          node.id,
          esTreeNodeToTSNodeMap.get(
            findParent(node, "VariableDeclaration") as es.VariableDeclaration,
          ),
        );
      },
    };
  },
});

export = rule;
