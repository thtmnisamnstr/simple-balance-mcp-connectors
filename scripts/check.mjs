#!/usr/bin/env node
// node scripts/check.mjs              offline checks (schemas are cached)
// node scripts/check.mjs --live       also probe app.smpl.money and every URL the listings cite
// node scripts/check.mjs --tag=v1.2.3 also require the tag to equal the manifests' version

import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Ajv from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const TAG = args.find((arg) => arg.startsWith("--tag="))?.slice("--tag=".length);

const failures = [];
const warnings = [];
const notes = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);
const note = (message) => notes.push(message);

const abs = (rel) => path.join(ROOT, rel);
const readText = (rel) => readFile(abs(rel), "utf8");
async function readJson(rel) {
  try {
    return JSON.parse(await readText(rel));
  } catch (error) {
    fail(rel, `does not parse as JSON (${error.message})`);
    return null;
  }
}
async function exists(rel) {
  try {
    await lstat(abs(rel));
    return true;
  } catch {
    return false;
  }
}
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

const files = {
  plugin: "plugin/plugin.json",
  mcp: "plugin/mcp.json",
  claudeMcp: "plugin/.mcp.json",
  claudePlugin: "plugin/.claude-plugin/plugin.json",
  cursorPlugin: "plugin/.cursor-plugin/plugin.json",
  claudeMarketplace: ".claude-plugin/marketplace.json",
  cursorMarketplace: ".cursor-plugin/marketplace.json",
  codexMarketplace: ".agents/plugins/marketplace.json",
  server: "server.json",
  gemini: "gemini-extension.json",
  cline: "submissions/cline/entry.json",
  dockerServer: "submissions/docker/servers/simple-balance/server.yaml",
  dockerTools: "submissions/docker/servers/simple-balance/tools.json",
  dockerReadme: "submissions/docker/servers/simple-balance/readme.md",
  awesome: "submissions/awesome-remote/entry.md",
  readme: "README.md",
};

const json = {};
for (const [key, rel] of Object.entries(files)) {
  if (!rel.endsWith(".json")) continue;
  if (!(await exists(rel))) {
    fail(rel, "is missing");
    continue;
  }
  json[key] = await readJson(rel);
}

const NAME = json.plugin?.name;
const VERSION = json.plugin?.version;
const URL_ = json.mcp?.mcpServers?.[NAME]?.url;
const REGISTRY_NAME = json.server?.name;
const DISPLAY_NAME = json.plugin?.extensions?.["com.openai"]?.interface?.displayName;
if (!NAME || !VERSION || !URL_ || !REGISTRY_NAME || !DISPLAY_NAME) {
  console.error("The reference files are unreadable, so nothing else can be checked.");
  for (const line of failures) console.error(`  ✗ ${line}`);
  process.exit(1);
}

// Pinned by hash as well as URL, so an upstream edit to a published schema
// fails here instead of silently changing what the listings are checked against.

const pins = JSON.parse(await readFile(path.join(ROOT, "scripts", "schemas.json"), "utf8"));
const cacheDir = path.join(ROOT, "node_modules", ".cache", "connector-schemas");

// raw.githubusercontent.com rate-limits shared CI runners by address, so a
// token is sent there when one is set, and a 429 or 5xx is retried.
async function fetchSchema(url) {
  const headers = {};
  if (process.env.GITHUB_TOKEN && new URL(url).hostname === "raw.githubusercontent.com") {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === 4) throw new Error(`HTTP ${response.status}`);
    const after = Number(response.headers.get("retry-after"));
    const wait = Number.isFinite(after) && after > 0 ? Math.min(after, 30) * 1000 : 2000 * 2 ** (attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

async function schema(key) {
  const pin = pins[key];
  const cached = path.join(cacheDir, `${key}.json`);
  try {
    const body = await readFile(cached);
    if (sha256(body) === pin.sha256) return JSON.parse(body.toString("utf8"));
  } catch {}
  let body;
  try {
    body = await fetchSchema(pin.url);
  } catch (error) {
    fail("scripts/schemas.json", `could not fetch ${key} from ${pin.url} (${error.message})`);
    return null;
  }
  if (sha256(body) !== pin.sha256) {
    fail(
      "scripts/schemas.json",
      `${key} at ${pin.url} no longer matches its pinned hash. Read what changed upstream, update the listing if it must, then update the pin.`,
    );
    return null;
  }
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cached, body);
  return JSON.parse(body.toString("utf8"));
}

function validator(schemaJson, referenced) {
  const draft2020 = String(schemaJson.$schema ?? "").includes("2020-12");
  const ajv = draft2020
    ? new Ajv2020({ allErrors: true, strict: false })
    : new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const other of referenced) ajv.addSchema(other);
  return ajv.compile(schemaJson);
}

async function validate(key, rel, data) {
  if (!data) return;
  const schemaJson = await schema(key);
  const referenced = await Promise.all((pins[key].requires ?? []).map(schema));
  if (!schemaJson || referenced.includes(null)) return;
  const check = validator(schemaJson, referenced);
  if (!check(data)) {
    for (const error of check.errors ?? []) {
      fail(rel, `${error.instancePath || "(root)"} ${error.message} (${key} schema)`);
    }
  }
}

await validate("registry-server", files.server, json.server);
await validate("agent-plugin", files.plugin, json.plugin);
await validate("agent-mcp", files.mcp, json.mcp);
await validate("cursor-plugin", files.cursorPlugin, json.cursorPlugin);
await validate("cursor-marketplace", files.cursorMarketplace, json.cursorMarketplace);
await validate("cline-mcp", files.cline, json.cline);

function onlyServer(rel, config, expectedType) {
  const servers = Object.entries(config?.mcpServers ?? {});
  if (servers.length !== 1) return fail(rel, `must define exactly one MCP server, found ${servers.length}`);
  const [key, server] = servers[0];
  if (key !== NAME) fail(rel, `server key is "${key}", expected "${NAME}"`);
  if (server.url !== URL_) fail(rel, `server URL is ${server.url}, expected ${URL_}`);
  if (server.type !== expectedType) {
    fail(rel, `server type is ${JSON.stringify(server.type)}, expected "${expectedType}"`);
  }
  if (server.headers && Object.keys(server.headers).length) {
    fail(rel, "carries headers; sign-in is OAuth, and OpenAI rejects headers on submission");
  }
}

onlyServer(files.mcp, json.mcp, "streamable-http");
// Claude Code reads a url entry with no type as stdio and drops it at load.
onlyServer(files.claudeMcp, json.claudeMcp, "http");
onlyServer(files.gemini, json.gemini, "http");
if (json.gemini?.mcpServers?.[NAME]?.httpUrl) fail(files.gemini, "uses httpUrl, which Gemini CLI deprecated for url plus type");
if (json.gemini?.mcpServers?.[NAME]?.oauth?.enabled !== true) {
  fail(files.gemini, "needs oauth.enabled: true, or a 401 stops at '/mcp auth' instead of starting sign-in");
}

const remotes = json.server?.remotes ?? [];
if (remotes.length !== 1 || remotes[0].type !== "streamable-http" || remotes[0].url !== URL_) {
  fail(files.server, `remotes must be exactly one streamable-http entry for ${URL_}`);
}
if (json.server?.packages) fail(files.server, "lists packages; this server is remote only");

const versioned = {
  [files.claudePlugin]: json.claudePlugin?.version,
  [files.cursorPlugin]: json.cursorPlugin?.version,
  [files.server]: json.server?.version,
  [files.gemini]: json.gemini?.version,
};
for (const [rel, version] of Object.entries(versioned)) {
  if (version !== VERSION) fail(rel, `version is ${version}, but plugin/plugin.json says ${VERSION}`);
}
if (!/^\d+\.\d+\.\d+$/.test(VERSION)) fail(files.plugin, `version ${VERSION} is not plain semver`);
if (TAG !== undefined && TAG !== `v${VERSION}`) {
  fail(files.plugin, `the tag is ${TAG}, but the manifests say ${VERSION}; tags are v<version>`);
}

const named = {
  [files.claudePlugin]: json.claudePlugin?.name,
  [files.cursorPlugin]: json.cursorPlugin?.name,
  [files.gemini]: json.gemini?.name,
  [files.cline]: json.cline?.id,
};
for (const [rel, name] of Object.entries(named)) {
  if (name !== NAME) fail(rel, `name is ${name}, expected ${NAME}`);
}

const displayNames = {
  [files.claudePlugin]: json.claudePlugin?.displayName,
  [files.cursorPlugin]: json.cursorPlugin?.displayName,
  [files.server]: json.server?.title,
  [files.cline]: json.cline?.name,
};
for (const [rel, displayName] of Object.entries(displayNames)) {
  if (displayName !== DISPLAY_NAME) fail(rel, `display name is ${displayName}, expected ${DISPLAY_NAME}`);
}

const shared = ["description", "homepage", "repository", "license"];
for (const field of shared) {
  for (const key of ["claudePlugin", "cursorPlugin"]) {
    if (json[key] && json[key][field] !== json.plugin[field]) {
      fail(files[key], `${field} differs from plugin/plugin.json`);
    }
  }
}
for (const key of ["claudePlugin", "cursorPlugin"]) {
  const author = json[key]?.author;
  if (author && (author.name !== json.plugin.author?.name || author.email !== json.plugin.author?.email)) {
    fail(files[key], "author differs from plugin/plugin.json");
  }
}

function marketplaceEntry(rel, marketplace, source) {
  const entries = marketplace?.plugins ?? [];
  const entry = entries.find((plugin) => plugin.name === NAME);
  if (!entry) return fail(rel, `has no entry named ${NAME}`);
  if (entries.length !== 1) fail(rel, `lists ${entries.length} plugins, expected 1`);
  const resolved = typeof entry.source === "string" ? entry.source : entry.source?.path;
  if (path.normalize(resolved ?? "") !== path.normalize(source)) {
    fail(rel, `source is ${JSON.stringify(entry.source)}, expected the plugin folder`);
  }
  if (entry.description !== undefined && entry.description !== json.plugin.description) {
    fail(rel, "the plugin's description differs from plugin/plugin.json");
  }
}
marketplaceEntry(files.claudeMarketplace, json.claudeMarketplace, "plugin");
marketplaceEntry(files.cursorMarketplace, json.cursorMarketplace, "plugin");
marketplaceEntry(files.codexMarketplace, json.codexMarketplace, "plugin");

// From OpenAI's submission error reference. The portal enforces these only
// after an upload.

const openai = json.plugin?.extensions?.["com.openai"];
const ui = openai?.interface ?? {};
const OPENAI_CATEGORIES = [
  "Productivity", "Creativity", "Developer Tools", "Business & Operations", "Data & Analytics",
  "Communication", "Education & Research", "Security", "Finance", "Healthcare", "Travel",
  "Entertainment", "Other",
];
function text(rel, label, value, max, { line = false } = {}) {
  if (typeof value !== "string" || value.length === 0) return fail(rel, `${label} is missing`);
  if (value.length > max) fail(rel, `${label} is ${value.length} characters; the limit is ${max}`);
  if (line && /\n/.test(value)) fail(rel, `${label} must be one line`);
}
text(files.plugin, "description", json.plugin.description, 1024);
text(files.plugin, "author.name", json.plugin.author?.name, 120);
text(files.plugin, "interface.displayName", ui.displayName, 30, { line: true });
text(files.plugin, "interface.shortDescription", ui.shortDescription, 30, { line: true });
text(files.plugin, "interface.longDescription", ui.longDescription, 4000);
text(files.plugin, "interface.developerName", ui.developerName, 80, { line: true });
if (!OPENAI_CATEGORIES.includes(ui.category)) fail(files.plugin, `interface.category ${ui.category} is not one OpenAI offers`);
for (const field of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
  const value = ui[field];
  if (typeof value !== "string" || !value.startsWith("https://") || value.length > 1024) {
    fail(files.plugin, `interface.${field} must be an https URL of at most 1,024 characters`);
  }
}
const prompts = ui.defaultPrompt ?? [];
if (prompts.length > 3) fail(files.plugin, "interface.defaultPrompt holds more than 3 prompts");
const normalizedPrompts = prompts.map((prompt) => String(prompt).normalize("NFKC").replace(/\s+/g, " ").trim());
if (new Set(normalizedPrompts).size !== prompts.length) fail(files.plugin, "interface.defaultPrompt repeats a prompt");
for (const prompt of prompts) {
  text(files.plugin, "a default prompt", prompt, 128, { line: true });
  if (/(^|\s)@[\w.-]+/.test(prompt)) fail(files.plugin, `default prompt "${prompt}" contains an @mention, which OpenAI rejects`);
}
for (const capability of ui.capabilities ?? []) text(files.plugin, "a capability", capability, 120, { line: true });
if ((ui.capabilities ?? []).length > 20) fail(files.plugin, "interface.capabilities holds more than 20 entries");
if (ui.screenshots) fail(files.plugin, "interface.screenshots is set; OpenAI rejects screenshots for a server with no UI");

function luminance(hex) {
  const channel = (offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
for (const [field, against] of [["brandColor", "#ffffff"], ["brandColorDark", "#212121"]]) {
  const color = ui[field];
  if (color === undefined) continue;
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) fail(files.plugin, `interface.${field} must be #RRGGBB`);
  else if (contrast(color, against) < 2) fail(files.plugin, `interface.${field} is under 2:1 contrast against ${against}`);
}

const cases = openai?.review?.test_cases ?? {};
if ((cases.positive ?? []).length !== 5) fail(files.plugin, "review.test_cases.positive must hold exactly 5 cases");
for (const testCase of cases.positive ?? []) {
  for (const field of ["description", "prompt", "tools_triggered", "expected_behavior"]) {
    if (!testCase[field]) fail(files.plugin, `a positive test case is missing ${field}`);
  }
}
if ((cases.negative ?? []).length !== 3) fail(files.plugin, "review.test_cases.negative must hold exactly 3 cases");
for (const testCase of cases.negative ?? []) {
  for (const field of ["description", "prompt"]) {
    if (!testCase[field]) fail(files.plugin, `a negative test case is missing ${field}`);
  }
}
for (const field of ["test_credentials", "reviewer_instructions"]) {
  if (openai?.review?.[field]) fail(files.plugin, `review.${field} is set; OpenAI takes these in the portal and rejects them in the ZIP`);
}
const DEMO_URL = openai?.review?.demo_recording_url;
if (DEMO_URL === undefined) {
  warn(files.plugin, "review.demo_recording_url is not set; OpenAI's review needs it (see submissions/demo-video.md)");
} else if (typeof DEMO_URL !== "string" || !DEMO_URL.startsWith("https://")) {
  fail(files.plugin, "review.demo_recording_url must be an https URL");
}

const toolList = JSON.parse(await readText("submissions/tools.json"));
const knownTools = new Set(toolList.tools.map((tool) => tool.name));
if (toolList.count !== toolList.tools.length) fail("submissions/tools.json", "count disagrees with the list");
for (const testCase of cases.positive ?? []) {
  for (const tool of String(testCase.tools_triggered).split(/,\s*/)) {
    if (!knownTools.has(tool)) fail(files.plugin, `test case "${testCase.description}" names ${tool}, which the server does not have`);
  }
}
const notTools = new Set(["offline_access"]);
for (const rel of ["plugin/skills/simple-balance/SKILL.md", "GEMINI.md", "llms-install.md"]) {
  for (const [, name] of (await readText(rel)).matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)) {
    if (!knownTools.has(name) && !notTools.has(name)) fail(rel, `tells the model to use ${name}, which the server does not have`);
  }
}

const HINTS = ["readOnlyHint", "destructiveHint", "openWorldHint"];
const justificationsFile = "submissions/annotation-justifications.md";
const justified = new Map();
let justifiedTool = null;
for (const { line } of proseLines(await readText(justificationsFile))) {
  const section = line.match(/^### `([a-z_]+)`$/);
  if (section) {
    justifiedTool = section[1];
    if (justified.has(justifiedTool)) fail(justificationsFile, `has two sections for ${justifiedTool}`);
    justified.set(justifiedTool, {});
    continue;
  }
  if (/^#{1,3} /.test(line)) justifiedTool = null;
  const hint = justifiedTool && line.match(/^- `(\w+Hint)` (true|false): \S/);
  if (!hint) continue;
  const entry = justified.get(justifiedTool);
  if (!HINTS.includes(hint[1]) || hint[1] in entry) fail(justificationsFile, `${justifiedTool} has an unexpected or repeated ${hint[1]} line`);
  entry[hint[1]] = hint[2] === "true";
}
for (const tool of toolList.tools) {
  const entry = justified.get(tool.name);
  if (!entry) {
    fail(justificationsFile, `has no section for ${tool.name}`);
    continue;
  }
  for (const hint of HINTS) {
    if (!(hint in entry)) fail(justificationsFile, `${tool.name} has no ${hint} justification`);
    else if (entry[hint] !== tool.annotations[hint]) {
      fail(justificationsFile, `${tool.name} justifies ${hint} ${entry[hint]}, but the server advertises ${tool.annotations[hint]}`);
    }
  }
}
for (const name of justified.keys()) {
  if (!knownTools.has(name)) fail(justificationsFile, `has a section for ${name}, which the server does not have`);
}

const pluginFiles = [];
async function walk(dir) {
  for (const entry of await readdir(abs(dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) fail(rel, "is a symlink; Claude's directory refuses symlinks in a plugin");
    else if (entry.isDirectory()) await walk(rel);
    else pluginFiles.push(rel);
  }
}
await walk("plugin");
if (pluginFiles.length > 512) fail("plugin", `holds ${pluginFiles.length} files; Claude's directory allows 512`);
for (const rel of pluginFiles) {
  if (path.basename(rel) === ".DS_Store") fail(rel, "is a Finder file; delete it");
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(rel);
  const size = (await lstat(abs(rel))).size;
  if (!isImage && size > 256 * 1024) fail(rel, "is over 256 KiB, the limit for a non-image file in Claude's directory");
  if (size > 5 * 1024 * 1024) fail(rel, "is over 5 MiB, OpenAI's limit for an icon");
}
const pluginReadmeWords = proseLines(await readText("plugin/README.md"))
  .flatMap((entry) => entry.line.split(/\s+/))
  .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
if (pluginReadmeWords < 40) fail("plugin/README.md", "has fewer than 40 words; Claude's directory requires 40");
if ((await readFile(abs("plugin/LICENSE"))).compare(await readFile(abs("LICENSE"))) !== 0) {
  fail("plugin/LICENSE", "differs from the repository LICENSE");
}

const skillDirs = (await readdir(abs("plugin/skills"), { withFileTypes: true })).filter((entry) => entry.isDirectory());
if (skillDirs.length === 0) fail("plugin/skills", "holds no skill; OpenAI rejects a public plugin without one");
for (const dir of skillDirs) {
  const rel = `plugin/skills/${dir.name}/SKILL.md`;
  if (!(await exists(rel))) {
    fail(rel, "is missing");
    continue;
  }
  const front = (await readText(rel)).match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) {
    fail(rel, "has no YAML front matter");
    continue;
  }
  const name = front[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = front[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== dir.name) fail(rel, `front-matter name is ${name}, but the folder is ${dir.name}`);
  text(rel, "description", description, 1024);
  if (`${NAME}:${dir.name}`.length > 64) fail(rel, `${NAME}:${dir.name} is over 64 characters`);
}
const onboarding = openai?.onboardingSkill;
if (onboarding && !(await exists(path.join("plugin", onboarding)))) {
  fail(files.plugin, `onboardingSkill ${onboarding} does not exist`);
}

const iconRefs = [
  [files.plugin, ui.logo],
  [files.plugin, ui.composerIcon],
  [files.claudePlugin, json.claudePlugin?.icon],
  [files.cursorPlugin, json.cursorPlugin?.logo],
];
for (const [rel, ref] of iconRefs) {
  if (!ref) {
    fail(rel, "names no icon");
    continue;
  }
  const target = path.normalize(path.join("plugin", ref));
  if (!target.startsWith(`plugin${path.sep}`)) fail(rel, `icon ${ref} leaves the plugin folder, which OpenAI rejects`);
  else if (!(await exists(target))) fail(rel, `icon ${ref} does not exist`);
}

async function pngSize(rel) {
  const buffer = await readFile(abs(rel));
  if (buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}
for (const [rel, side] of [["assets/logo-400.png", 400], ["assets/logo-512.png", 512]]) {
  const size = await pngSize(rel);
  if (!size || size[0] !== side || size[1] !== side) fail(rel, `must be a ${side}x${side} PNG`);
}
const viewBox = (await readText("assets/logo.svg")).match(/viewBox="([\d.\s-]+)"/)?.[1].trim().split(/\s+/).map(Number);
if (!viewBox || viewBox[2] !== viewBox[3] || viewBox[2] < 48) {
  fail("assets/logo.svg", "needs a square viewBox of at least 48, which OpenAI requires of an SVG icon");
}
for (const [copy, original] of [
  ["plugin/assets/logo.svg", "assets/logo.svg"],
  ["plugin/assets/logo.png", "assets/logo-512.png"],
  ["submissions/cline/icon.png", "assets/logo-400.png"],
]) {
  if (sha256(await readFile(abs(copy))) !== sha256(await readFile(abs(original)))) {
    fail(copy, `differs from ${original}; copy it again`);
  }
}

text(files.server, "description", json.server.description, 100);
const awesome = (await readText(files.awesome)).trimEnd().split("\n");
if (awesome.length !== 3) fail(files.awesome, "must be exactly three lines");
else {
  const [first, badge, summary] = awesome;
  const entry = first.match(/^-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s+`(https?:\/\/[^`\s]+)`\s*$/);
  if (!entry || entry[1] !== DISPLAY_NAME || entry[3] !== URL_) fail(files.awesome, "line 1 must name the server and its endpoint");
  const glama = `https://glama.ai/mcp/connectors/${REGISTRY_NAME}`;
  if (!badge.startsWith("  [![") || !badge.includes(`${glama}/badges/score.svg`) || !badge.endsWith(`(${glama})`)) {
    fail(files.awesome, `line 2 must be the Glama badge for ${REGISTRY_NAME}, the name in server.json`);
  }
  const description = summary.match(/^ {2}(🔓|🔑|🔐) - (.+)$/u)?.[2];
  if (!description) fail(files.awesome, "line 3 must be two spaces, an auth marker, ' - ' and a sentence");
  else {
    if (!description.endsWith(".")) fail(files.awesome, "line 3 must end with a period");
    if (description.length > 120) fail(files.awesome, `line 3 is ${description.length} characters; the list allows 120`);
  }
}

const dockerYaml = await readText(files.dockerServer);
const yamlValue = (key) =>
  dockerYaml.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"))?.[1].trim().replace(/^"(.*)"$/, "$1");
for (const [index, line] of dockerYaml.split("\n").entries()) {
  const value = line.match(/^\s*(?:- )?[\w.-]+:\s+(.+)$/)?.[1];
  if (value && !/^["']/.test(value) && /:\s/.test(value)) {
    fail(`${files.dockerServer}:${index + 1}`, "has an unquoted value containing \": \", which YAML reads as a mapping; quote it");
  }
}
if (yamlValue("name") !== NAME) fail(files.dockerServer, `name must be ${NAME}, the folder name`);
if (yamlValue("type") !== "remote") fail(files.dockerServer, "type must be remote");
if (yamlValue("url") !== URL_) fail(files.dockerServer, `remote.url must be ${URL_}, exactly the protected resource`);
if (yamlValue("transport_type") !== "streamable-http") fail(files.dockerServer, "remote.transport_type must be streamable-http");
if (!/^dynamic:\n\s+tools: true$/m.test(dockerYaml)) fail(files.dockerServer, "an OAuth server needs dynamic.tools: true");
if (/^source:/m.test(dockerYaml)) fail(files.dockerServer, "sets source, which makes Docker check the AGPL app repo's license");
if (!/^oauth:\n {2}- provider: simple-balance\n {4}secret: simple-balance\.personal_access_token\n {4}env: SIMPLE_BALANCE_PERSONAL_ACCESS_TOKEN$/m.test(dockerYaml)) {
  fail(files.dockerServer, "needs the oauth provider block, or Docker never starts sign-in");
}
if (yamlValue("category") !== "finance") fail(files.dockerServer, "meta.category must be finance");
if (yamlValue("title") !== DISPLAY_NAME) fail(files.dockerServer, `about.title must be ${DISPLAY_NAME}`);
const dockerDescription = yamlValue("description") ?? "";
if (dockerDescription.endsWith(".")) fail(files.dockerServer, "about.description gets its period from the catalog; leave it off");
if (dockerDescription.length > 97) warn(files.dockerServer, "about.description is over 97 characters and will be cut short on Docker Hub");
if ((await readText(files.dockerTools)).trim() !== "[]") fail(files.dockerTools, "must be [] for an OAuth remote server");
if (!(await readText(files.dockerReadme)).startsWith("Docs: https://")) fail(files.dockerReadme, "must start with a Docs: line");

if (json.cline) {
  if (!json.cline.install?.args?.includes(URL_)) fail(files.cline, `install.args must include ${URL_}`);
  if (json.cline.verified !== false) fail(files.cline, "verified is Cline's to set; leave it false");
  if (!(await exists(path.join("submissions/cline", json.cline.icon ?? "")))) fail(files.cline, "icon does not exist");
}

for (const rel of [...(await markdownFiles(".")), files.cline, files.plugin]) {
  for (const match of (await readText(rel)).matchAll(/\b(?:all|up to) (\d+) tools\b|(?<![#\w-])(\d+)-tool\b/g)) {
    const counted = Number(match[1] ?? match[2]);
    if (counted !== toolList.count) fail(rel, `says "${match[0]}"; the server has ${toolList.count} tools`);
  }
}

const readme = await readText(files.readme);
const links = readme.match(/https:\/\/[^\s)"'>\]]+/g) ?? [];
const decoded = { cursor: 0, vscode: 0, claude: 0 };
for (const link of links) {
  const url = new URL(link.replaceAll("&amp;", "&"));
  try {
    if (url.hostname === "cursor.com" && url.pathname === "/install-mcp") {
      const config = JSON.parse(Buffer.from(url.searchParams.get("config"), "base64").toString("utf8"));
      if (url.searchParams.get("name") !== NAME || config.url !== URL_) fail(files.readme, `Cursor link installs ${config.url}`);
      decoded.cursor++;
    } else if (url.hostname === "vscode.dev" && url.pathname === "/redirect/mcp/install") {
      const config = JSON.parse(url.searchParams.get("config"));
      if (url.searchParams.get("name") !== NAME || config.url !== URL_ || config.type !== "http") {
        fail(files.readme, `VS Code link installs ${JSON.stringify(config)}`);
      }
      decoded.vscode++;
    } else if (url.hostname === "claude.ai" && url.searchParams.get("modal") === "add-custom-connector") {
      if (url.searchParams.get("connectorUrl") !== URL_) fail(files.readme, `Claude link adds ${url.searchParams.get("connectorUrl")}`);
      decoded.claude++;
    }
  } catch (error) {
    fail(files.readme, `could not decode ${link} (${error.message})`);
  }
}
for (const [client, count] of Object.entries(decoded)) {
  if (count === 0) fail(files.readme, `has no ${client} install link`);
}

async function markdownFiles(dir) {
  const found = [];
  for (const entry of await readdir(abs(dir), { withFileTypes: true })) {
    if ([".git", "node_modules", "dist"].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await markdownFiles(rel)));
    else if (entry.name.endsWith(".md")) found.push(rel);
  }
  return found;
}
// A fence closes only on its own marker, at least as long, so a ``` block
// pasted inside a ~~~ block does not end it.
function proseLines(markdown) {
  const lines = markdown.split("\n");
  let fence = null;
  return lines.map((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length && !line.trim().slice(marker.length).trim()) fence = null;
      return null;
    }
    if (marker) {
      fence = marker;
      return null;
    }
    return { line, number: index + 1, next: lines[index + 1] ?? "" };
  }).filter(Boolean);
}
for (const rel of await markdownFiles(".")) {
  for (const { line, number, next } of proseLines(await readText(rel))) {
    const isHeading = /^#{1,6} /.test(line);
    const isTableHeader = line.startsWith("|") && /^\|[\s:|-]+\|$/.test(next);
    if ((isHeading || isTableHeader) && line.includes("—")) fail(`${rel}:${number}`, "has an em dash in a heading or table header");
  }
}
for (const rel of [...Object.values(files), ...(await markdownFiles("."))]) {
  if ((await exists(rel)) && (await readText(rel)).includes("simplebalance.money")) {
    fail(rel, "names simplebalance.money; the domain is smpl.money");
  }
}

const outsideFences = (markdown) => proseLines(markdown).map((entry) => entry.line);
// GitHub's heading ids: images and tags dropped, links reduced to their text,
// emphasis underscores removed, ASCII letters lowercased, everything but
// letters, digits, marks, underscores, hyphens and spaces dropped, then each
// space to a hyphen, with -1, -2 on repeats.
const anchorCache = new Map();
async function anchorsOf(rel) {
  if (anchorCache.has(rel)) return anchorCache.get(rel);
  const ids = new Set();
  const seen = new Map();
  for (const line of outsideFences(await readText(rel))) {
    for (const explicit of line.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) ids.add(explicit[1]);
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const base = heading[1]
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/(^|[^\p{L}\p{N}_])_+([^_]+?)_+(?![\p{L}\p{N}_])/gu, "$1$2")
      .replace(/[A-Z]/g, (letter) => letter.toLowerCase())
      .replace(/[^\p{L}\p{N}\p{M}_ -]/gu, "")
      .replace(/ /g, "-");
    const repeat = seen.get(base) ?? 0;
    seen.set(base, repeat + 1);
    ids.add(repeat ? `${base}-${repeat}` : base);
  }
  anchorCache.set(rel, ids);
  return ids;
}
for (const rel of await markdownFiles(".")) {
  for (const line of outsideFences(await readText(rel))) {
    const prose = line.replace(/`[^`]*`/g, "");
    for (const match of prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("<")) continue;
      const [file, anchor] = target.split("#");
      const linked = decodeURIComponent(file);
      const resolved = file ? path.normalize(linked.startsWith("/") ? linked.slice(1) : path.join(path.dirname(rel), linked)) : rel;
      if (!(await exists(resolved))) {
        fail(rel, `links to ${target}, which does not exist`);
      } else if (anchor && resolved.endsWith(".md") && !(await anchorsOf(resolved)).has(decodeURIComponent(anchor))) {
        fail(rel, `links to ${target}, but ${resolved} has no heading with that anchor`);
      }
    }
  }
}

if (LIVE) {
  const get = (url, init) => fetch(url, { redirect: "follow", ...init });

  const challenge = await get(URL_, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  const authenticate = challenge.headers.get("www-authenticate") ?? "";
  if (challenge.status !== 401 || !authenticate.includes("resource_metadata=")) {
    fail(URL_, `answers an unauthenticated request with ${challenge.status} and "${authenticate}"; clients need 401 with resource_metadata to find sign-in`);
  }

  const origin = new URL(URL_).origin;
  const resource = await (await get(`${origin}/.well-known/oauth-protected-resource`)).json().catch(() => null);
  if (resource?.resource !== URL_) fail(`${origin}/.well-known/oauth-protected-resource`, `resource is ${resource?.resource}, expected ${URL_}`);
  const server = await (await get(`${origin}/.well-known/oauth-authorization-server`)).json().catch(() => null);
  if (!server?.registration_endpoint) fail(`${origin}/.well-known/oauth-authorization-server`, "advertises no registration_endpoint, so no client can register itself");
  if (!server?.code_challenge_methods_supported?.includes("S256")) fail(`${origin}/.well-known/oauth-authorization-server`, "does not advertise PKCE S256");
  for (const scope of ["ledger:read", "ledger:stage", "ledger:write", "offline_access"]) {
    if (!server?.scopes_supported?.includes(scope)) fail(`${origin}/.well-known/oauth-authorization-server`, `does not advertise ${scope}`);
  }

  const openaiChallenge = await get(`${origin}/.well-known/openai-apps-challenge`);
  if (openaiChallenge.status !== 200) {
    warn(`${origin}/.well-known/openai-apps-challenge`, `answers ${openaiChallenge.status}; OpenAI's domain verification needs it (see submissions/prerequisites.md)`);
  }

  const pages = new Set([
    ui.websiteURL, ui.supportURL, ui.privacyPolicyURL, ui.termsOfServiceURL,
    json.plugin.homepage, json.plugin.repository, json.server.websiteUrl, json.server.repository?.url,
    json.claudePlugin?.documentationUrl, json.claudePlugin?.supportUrl,
    json.cline?.homepage, json.cline?.repo, yamlValue("icon"), DEMO_URL,
  ].filter(Boolean));
  for (const page of pages) {
    const response = await get(page).catch((error) => ({ status: error.message }));
    if (response.status !== 200) fail(page, `answers ${response.status}`);
  }
  // A private or deleted YouTube video still answers 200; its player status says whether it plays signed out.
  if (DEMO_URL && /(^|\.)(youtube\.com|youtu\.be)$/.test(new URL(DEMO_URL).hostname)) {
    const page = await get(DEMO_URL).then((response) => response.text()).catch(() => "");
    if (!/"playabilityStatus":\{"status":"OK"/.test(page)) {
      warn(DEMO_URL, "YouTube doesn't report this video as playable without a sign-in; open it in a private window");
    }
  }
  for (const icon of json.server.icons ?? []) {
    const response = await get(icon.src).catch((error) => ({ status: error.message, headers: new Headers() }));
    const type = response.headers.get("content-type")?.split(";")[0];
    if (response.status !== 200) fail(files.server, `icon ${icon.src} answers ${response.status}`);
    else if (type !== icon.mimeType) fail(files.server, `icon ${icon.src} is served as ${type}, not ${icon.mimeType}`);
  }

  const encoded = encodeURIComponent(REGISTRY_NAME);
  const listing = await get(`https://registry.modelcontextprotocol.io/v0.1/servers/${encoded}/versions/latest`);
  if (listing.status === 200) {
    const published = (await listing.json())?.server?.version;
    note(`MCP Registry: ${REGISTRY_NAME} is published at ${published}${published === VERSION ? "" : `; this tree is ${VERSION}`}.`);
  } else {
    note(`MCP Registry: ${REGISTRY_NAME} is not published yet (HTTP ${listing.status}).`);
  }
}

for (const line of notes) console.log(`  · ${line}`);
for (const line of warnings) console.log(`  ! ${line}`);
for (const line of failures) console.log(`  ✗ ${line}`);
const summary = `${NAME} ${VERSION} at ${URL_}, registry name ${REGISTRY_NAME}`;
if (failures.length) {
  console.log(`\n${failures.length} problem${failures.length === 1 ? "" : "s"} in ${summary}.`);
  process.exit(1);
}
console.log(`All listing files agree: ${summary}.${LIVE ? " Live checks passed." : ""}`);
