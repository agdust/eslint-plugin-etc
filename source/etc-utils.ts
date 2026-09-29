/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 *
 * Helpers vendored from cartant/eslint-etc and cartant/tsutils-etc (MIT),
 * which only support typescript-eslint 5. See THIRD_PARTY_NOTICES.
 */

import { AST_NODE_TYPES, TSESTree as es } from "@typescript-eslint/utils";
import { isObjectFlagSet, isTypeFlagSet } from "ts-api-utils";
import * as ts from "typescript";

export function getParent(node: es.Node): es.Node | undefined {
  return node.parent;
}

export function findParent(
  node: es.Node,
  ...types: string[]
): es.Node | undefined {
  let parent = getParent(node);
  while (parent) {
    if (types.includes(parent.type)) {
      return parent;
    }
    parent = getParent(parent);
  }
  return undefined;
}

export function getLoc(node: ts.Node): es.SourceLocation {
  const sourceFile = node.getSourceFile();
  const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
  const end = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd());
  return {
    start: { line: start.line + 1, column: start.character },
    end: { line: end.line + 1, column: end.character },
  };
}

export const isArrayExpression = (node: es.Node): node is es.ArrayExpression =>
  node.type === AST_NODE_TYPES.ArrayExpression;
export const isCallExpression = (node: es.Node): node is es.CallExpression =>
  node.type === AST_NODE_TYPES.CallExpression;
export const isExpressionStatement = (
  node: es.Node,
): node is es.ExpressionStatement =>
  node.type === AST_NODE_TYPES.ExpressionStatement;
export const isIdentifier = (node: es.Node): node is es.Identifier =>
  node.type === AST_NODE_TYPES.Identifier;
export const isMemberExpression = (
  node: es.Node,
): node is es.MemberExpression => node.type === AST_NODE_TYPES.MemberExpression;
export const isNewExpression = (node: es.Node): node is es.NewExpression =>
  node.type === AST_NODE_TYPES.NewExpression;

/**
 * Whether the type could be (or extend, or implement) a type with the given
 * symbol name, looking through references, unions and intersections.
 */
export function couldBeType(type: ts.Type, name: string): boolean {
  const target =
    isTypeFlagSet(type, ts.TypeFlags.Object) &&
    isObjectFlagSet(type as ts.ObjectType, ts.ObjectFlags.Reference)
      ? (type as ts.TypeReference).target
      : type;
  if (target.symbol?.name === name) {
    return true;
  }
  if (target.isUnionOrIntersection()) {
    return target.types.some((t) => couldBeType(t, name));
  }
  if (target.getBaseTypes()?.some((t) => couldBeType(t, name))) {
    return true;
  }
  return couldImplement(target, name);
}

function couldImplement(type: ts.Type, name: string): boolean {
  const declaration = type.symbol?.valueDeclaration;
  if (!declaration || !ts.isClassDeclaration(declaration)) {
    return false;
  }
  return (declaration.heritageClauses ?? []).some(
    ({ token, types }) =>
      token === ts.SyntaxKind.ImplementsKeyword &&
      types.some((node) => node.expression.getText() === name),
  );
}
