// @flow

import {type URL} from "../../core/references";
import {type TimestampMs} from "../../util/timestamp";
import {findDuplicates} from "../../util/findDuplicates";
import {
  type NodeEntry,
  type NodeEntryJson,
  normalizeNodeEntry,
} from "./nodeEntry";

export type EdgeSpec = {|
  +urls: $ReadOnlyArray<URL>,
  +entries: $ReadOnlyArray<NodeEntry>,
|};

// Should be inexact type to as with JSON sources you never know.
export type EdgeSpecJson = $Shape<{
  +urls: $ReadOnlyArray<URL>,
  +entries: $ReadOnlyArray<NodeEntryJson>,
}>;

export function normalizeEdgeSpec(
  spec: ?EdgeSpecJson,
  defaultTimestampMs: TimestampMs
): EdgeSpec {
  const {urls, entries} = spec || {};
  return _validateEdgeSpec({
    urls: urls || [],
    entries: (entries || []).map((x: NodeEntryJson) =>
      normalizeNodeEntry(x, defaultTimestampMs)
    ),
  });
}

export function _validateEdgeSpec(spec: EdgeSpec): EdgeSpec {
  const duplicates = _findDuplicatesByKey(spec.entries);
  if (duplicates.size) {
    const dupeList = Array.from(duplicates)
      .map((e) => JSON.stringify(e))
      .join("\n  ");
    throw new Error(
      `Duplicate entry keys are not allowed, you may need to ` +
        `set keys manually for:\n  ${dupeList}`
    );
  }
  return spec;
}

export function _findDuplicatesByKey(
  entries: $ReadOnlyArray<NodeEntry>
): Set<NodeEntry> {
  const duplicateKeys = findDuplicates(entries.map((e) => e.key));
  return new Set(entries.filter((e) => duplicateKeys.has(e.key)));
}
