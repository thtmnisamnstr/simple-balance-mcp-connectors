#!/usr/bin/env node
// Reads the tool list from a checkout of the application, because the server
// only lists its tools to a signed-in client.

import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const app = path.resolve(process.argv[2] ?? path.join(ROOT, "..", "simple-balance"));
const source = await readFile(path.join(app, "src", "server", "mcp.ts"), "utf8");

const tiers = new Map([...source.matchAll(/\[\s*"([a-z_]+)",\s*"(ledger:(?:read|stage|write))"\s*\]/g)].map((m) => [m[1], m[2]]));

const presets = {};
for (const match of source.matchAll(/const (\w+Annotations) = \{([^}]+)\}/g)) {
  const hints = {};
  for (const hint of match[2].matchAll(/(\w+Hint):\s*(true|false)/g)) hints[hint[1]] = hint[2] === "true";
  const complete = ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"].every((hint) => typeof hints[hint] === "boolean");
  if (match[2].includes("...") || !complete) {
    throw new Error(`Could not read ${match[1]} in src/server/mcp.ts: expected all four hints as literals`);
  }
  presets[match[1]] = hints;
}
for (const match of source.matchAll(/const (\w+Annotations) = (\w+Annotations);/g)) {
  presets[match[1]] = presets[match[2]];
}

const tools = [];
for (const chunk of source.split("registerTool(").slice(1)) {
  const name = chunk.match(/"([a-z_]+)"/)?.[1];
  const head = chunk.slice(0, 6000);
  const title = head.match(/title:\s*"([^"]+)"/)?.[1];
  const preset = head.match(/annotations:\s*(\w+)/)?.[1];
  if (!name || !title || !presets[preset] || !tiers.has(name)) {
    throw new Error(`Could not read the registration of ${name ?? "a tool"} in src/server/mcp.ts`);
  }
  tools.push({ name, title, scope: tiers.get(name), kind: preset.replace(/Annotations$/, ""), annotations: presets[preset] });
}

const commit = execFileSync("git", ["-C", app, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const version = JSON.parse(await readFile(path.join(app, "package.json"), "utf8")).version;
const out = { appVersion: version, appCommit: commit, count: tools.length, tools };
await writeFile(path.join(ROOT, "submissions", "tools.json"), `${JSON.stringify(out, null, 2)}\n`);

const byScope = Object.groupBy(tools, (tool) => tool.scope);
console.log(
  `submissions/tools.json: ${tools.length} tools from simple-balance ${version} (${commit.slice(0, 7)}): ` +
    Object.entries(byScope).map(([scope, list]) => `${list.length} ${scope}`).join(", "),
);
