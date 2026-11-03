#!/usr/bin/env node
// The committed plugin/mcp.json cannot carry OpenAI's auth block: the Agent
// Plugins schema closes every server entry, and Codex's loader rejects unknown
// fields, so a strict client would skip the server. Only the ZIP's copy gets it.

import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, stat, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PLUGIN = path.join(ROOT, "plugin");

// Every scope the server advertises. ChatGPT's scan lists only the tools the
// grant reaches, and without the ledger scopes it would see none.
const SCOPES = ["openid", "profile", "email", "offline_access", "ledger:read", "ledger:stage", "ledger:write"];

const plugin = JSON.parse(await readFile(path.join(PLUGIN, "plugin.json"), "utf8"));
const mcp = JSON.parse(await readFile(path.join(PLUGIN, "mcp.json"), "utf8"));

const stage = await mkdtemp(path.join(os.tmpdir(), "simple-balance-openai-"));
const included = [];
async function copy(dir) {
  for (const entry of await readdir(path.join(PLUGIN, dir), { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await mkdir(path.join(stage, rel), { recursive: true });
      await copy(rel);
    } else {
      await cp(path.join(PLUGIN, rel), path.join(stage, rel));
      included.push(rel);
    }
  }
}
await copy("");

for (const server of Object.values(mcp.mcpServers)) {
  server.extensions = {
    "com.openai": {
      auth: { type: "oauth", client: { mode: "dcr" }, defaultScopes: SCOPES },
    },
  };
}
await writeFile(path.join(stage, "mcp.json"), `${JSON.stringify(mcp, null, 2)}\n`);

// Fixed timestamps, so the same tree builds the same bytes.
const epoch = new Date("2026-01-01T00:00:00Z");
for (const rel of included) await utimes(path.join(stage, rel), epoch, epoch);

const dist = path.join(ROOT, "dist");
await mkdir(dist, { recursive: true });
const zipPath = path.join(dist, `${plugin.name}-plugin-${plugin.version}.zip`);
await rm(zipPath, { force: true });
included.sort();
// zip writes DOS timestamps in local time, so pin the zone or the bytes differ by machine.
execFileSync("zip", ["-X", "-q", zipPath, "-@"], { cwd: stage, input: included.join("\n"), env: { ...process.env, TZ: "UTC" } });
await rm(stage, { recursive: true, force: true });

const listing = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).trim().split("\n");
const problems = [];
for (const required of ["plugin.json", "mcp.json"]) {
  if (!listing.includes(required)) problems.push(`${required} is not at the root of the ZIP`);
}
if (listing.some((entry) => entry.split("/").some((part) => part.startsWith(".")))) {
  problems.push("a dot file made it into the ZIP");
}
if (listing.length > 5000) problems.push(`${listing.length} entries; OpenAI allows 5,000`);
if (listing.some((entry) => entry.split("/").length > 20)) problems.push("a path is deeper than 20 segments");
const { size } = await stat(zipPath);
if (size > 100 * 1024 * 1024) problems.push(`${size} bytes; OpenAI allows 100 MB`);
if (problems.length) {
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

console.log(`Built ${path.relative(ROOT, zipPath)} (${listing.length} files, ${size} bytes):`);
for (const entry of listing) console.log(`  ${entry}`);
