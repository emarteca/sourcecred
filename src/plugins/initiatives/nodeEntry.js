// @flow

import {type URL} from "../../core/references";
import {type NodeWeight} from "../../core/weights";
import {type TimestampMs, type TimestampISO} from "../../util/timestamp";

export type NodeEntryField = "DEPENDENCY" | "REFERENCE" | "CONTRIBUTION";

export type NodeEntry = {|
  +key: string,
  +title: string,
  +timestampMs: TimestampMs,
  +contributors: $ReadOnlyArray<URL>,
  +weight: NodeWeight | null,
|};

export type NodeEntryJson = {|
  +key?: string,
  +title: string,
  +timestampIso?: TimestampISO,
  +contributors?: $ReadOnlyArray<URL>,
  +weight?: NodeWeight,
|};
