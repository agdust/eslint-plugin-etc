/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 *
 * `fromFixture` vendored from cartant/eslint-etc (MIT), see THIRD_PARTY_NOTICES.
 * A fixture is code with `~~~ [messageId {"data": ...} suggest 0 1]` lines
 * under the reported range.
 */

import type {
  InvalidTestCase,
  SuggestionOutput,
} from "@typescript-eslint/rule-tester";

type Case<M extends string, O extends readonly unknown[]> = Omit<
  InvalidTestCase<M, O>,
  "code" | "errors"
> & { suggestions?: readonly SuggestionOutput<M>[] };

export function fromFixture<M extends string, O extends readonly unknown[]>(
  fixture: string,
  { suggestions, ...rest }: Case<M, O> = {},
): InvalidTestCase<M, O> {
  const errorRegExp =
    /^(?<indent>\s*)(?<error>~+)\s*\[(?<id>\w+)\s*(?<data>.*?)(?:\s*(?<suggest>suggest)\s*(?<indices>[\d\s]*))?\]\s*$/;
  const lines: string[] = [];
  const errors: InvalidTestCase<M, O>["errors"][number][] = [];
  let suggestFound = false;
  for (const line of fixture.split("\n")) {
    const groups = line.match(errorRegExp)?.groups;
    if (!groups) {
      lines.push(line);
      continue;
    }
    const column = groups.indent.length + 1;
    const indices = groups.indices?.trim();
    errors.push({
      column,
      data: JSON.parse(groups.data || "{}") as Record<string, unknown>,
      endColumn: column + groups.error.length,
      endLine: lines.length,
      line: lines.length,
      messageId: groups.id as M,
      ...(suggestions && groups.suggest
        ? {
            suggestions: indices
              ? indices.split(/\s+/).map((index) => suggestions[Number(index)])
              : suggestions,
          }
        : {}),
    });
    if (groups.suggest) {
      suggestFound = true;
    }
  }
  if (suggestions && !suggestFound) {
    throw new Error("Suggestions specified but no 'suggest' annotation found.");
  }
  return { ...rest, code: lines.join("\n"), errors };
}
