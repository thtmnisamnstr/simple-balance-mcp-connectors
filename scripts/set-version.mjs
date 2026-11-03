#!/usr/bin/env node
// Every listing moves together: OpenAI refuses an upload whose version it has
// seen, the registry refuses a version it holds, and Cursor's checks fail when
// its manifests disagree.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FILES = [
  "plugin/plugin.json",
  "plugin/.claude-plugin/plugin.json",
  "plugin/.cursor-plugin/plugin.json",
  "server.json",
  "gemini-extension.json",
];

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("Usage: npm run set-version -- <major.minor.patch>");
  process.exit(1);
}

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  const before = await readFile(file, "utf8");
  if (JSON.parse(before).version === undefined) throw new Error(`${rel} has no top-level version`);
  // The first "version" key in each of these files is the top-level one.
  const after = before.replace(/^(\s*"version":\s*")[^"]*(")/m, `$1${version}$2`);
  if (JSON.parse(after).version !== version) throw new Error(`${rel}: could not set the version`);
  await writeFile(file, after);
  console.log(`${rel}: ${JSON.parse(before).version} -> ${version}`);
}

console.log(
  "\nNext: rewrite extensions[\"com.openai\"].publication.release_notes in plugin/plugin.json,\n" +
    `run npm run check, commit, merge, and tag the merge v${version}.`,
);
