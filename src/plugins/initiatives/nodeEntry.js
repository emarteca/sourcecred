// @flow

import {type URL} from "../../core/references";
import {type NodeWeight} from "../../core/weights";
import {type NodeAddressT, NodeAddress} from "../../core/graph";
import {type TimestampMs, type TimestampISO} from "../../util/timestamp";
import * as Timestamp from "../../util/timestamp";
import {type InitiativeId} from "./initiative";
import {nodeEntryTypes} from "./declaration";

export type NodeEntryField = "DEPENDENCY" | "REFERENCE" | "CONTRIBUTION";

export type NodeEntry = {|
  +key: string,
  +title: string,
  +timestampMs: TimestampMs,
  +contributors: $ReadOnlyArray<URL>,
  +weight: NodeWeight | null,
|};

// Should be inexact type to as with JSON sources you never know.
export type NodeEntryJson = $Shape<{
  +key: string,
  +title: string,
  +timestampIso: TimestampISO,
  +contributors: $ReadOnlyArray<URL>,
  +weight: NodeWeight,
}>;

export function addressForNodeEntry(
  field: NodeEntryField,
  id: InitiativeId,
  key: string
): NodeAddressT {
  return NodeAddress.append(nodeEntryTypes[field].prefix, ...id, key);
}

export function normalizeNodeEntry(
  input: NodeEntryJson,
  defaultTimestampMs: TimestampMs
): NodeEntry {
  if (!input.title) {
    throw new TypeError(
      `Title is required for entry node, received ${JSON.stringify(input)}`
    );
  }

  return {
    key: input.key || _titleSlug(input.title),
    title: input.title,
    timestampMs: input.timestampIso
      ? Timestamp.fromISO(input.timestampIso)
      : defaultTimestampMs,
    contributors: input.contributors || [],
    weight: input.weight || null,
  };
}

export function _titleSlug(title: string): string {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-/, "")
    .replace(/-$/, "");
}
