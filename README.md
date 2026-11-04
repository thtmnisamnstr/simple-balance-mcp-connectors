# Simple Balance MCP connectors

[Simple Balance](https://smpl.money/) is a free budget app and spending
tracker. Every account is on one page, and any total you doubt opens into the
payments behind it. Its MCP server connects your AI assistant to the same
records you see at [app.smpl.money](https://app.smpl.money/), and you decide
how far it goes: reading only, queuing transactions for you to approve, or
making the change itself.

This repository holds what it takes to connect that server to AI tools and
list it in their directories: manifests, a plugin, listing copy and the checks
that keep them in agreement.

| | |
| --- | --- |
| Server URL | `https://app.smpl.money/mcp` |
| Transport | Streamable HTTP |
| Sign-in | OAuth 2.1 in your browser. No API key, no header. |
| What it reaches | Your own ledger, within the scopes you approve |
| Docs | [Connecting an AI assistant](https://smpl.money/docs/agents-and-mcp/) |

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=simple-balance&config=eyJ1cmwiOiJodHRwczovL2FwcC5zbXBsLm1vbmV5L21jcCJ9)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect/mcp/install?name=simple-balance&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapp.smpl.money%2Fmcp%22%7D)
[![Add to Claude](https://img.shields.io/badge/Claude-Add_connector-D97757?style=flat-square&logo=claude&logoColor=white)](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Simple%20Balance&connectorUrl=https%3A%2F%2Fapp.smpl.money%2Fmcp)

## How sign-in works

The server lists no tools until you sign in, so sign-in comes first: most
clients open a browser at app.smpl.money when they connect, and the steps below
say where a client needs a nudge. Sign in, read the scopes on the
**Allow this MCP client?** screen, and choose **Allow access**.

| Scope | What the connection may do |
| --- | --- |
| `ledger:read` | Read accounts, transactions, reports and history |
| `ledger:stage` | Also propose, edit and delete staged transactions. A staged row changes no balance until you commit it, and deleting one is permanent. |
| `ledger:write` | Also commit, create, edit and delete transactions, accounts, categories and budgets, merge categories and payees, change preferences and revoke connected agents |

Your assistant decides which scopes to ask for, and the screen grants all of
them or none. A client that asks for none gets `ledger:read`. Claude and Codex
ask for every scope the server offers, `ledger:write` included. Tools outside the grant don't appear in the tool list, so to
check what a connection got, ask the assistant to run `whoami`, or open
**Settings** in Simple Balance and look under **Connected agents**. That's also
where you revoke one. Everything an agent changes shows on **Activity** with an
**Agent** badge.

There's no automatic pull from your bank today: you download the file your
bank gives you and bring it in, or hand it to your assistant. Simple Balance
keeps track of your money; it can't move it.

## Connect your assistant

### Claude (claude.ai, Claude Desktop, mobile)

Use the **Add to Claude** button above, or:

1. Open **Customize > Connectors** at
   [claude.ai/customize/connectors](https://claude.ai/customize/connectors).
2. Choose **+ Add**, then **Add custom connector**.
3. Name it `Simple Balance` and enter `https://app.smpl.money/mcp`. If Claude
   then shows the sign-in settings it found, leave them as they are.
4. Choose **Add**, then sign in when Claude opens Simple Balance.

Turn it on in a chat from **+ > Connectors**. On the free Claude plan you can
add one custom connector. On Team and Enterprise plans, an owner adds it under
**Organization settings > Connectors**. Claude asks for every scope, so the
approval screen lists `ledger:write`. A connector added on claude.ai also
appears in Claude Code when you sign in to Claude Code with the same Claude
subscription.

### Claude Code

```bash
claude mcp add --transport http --scope user simple-balance https://app.smpl.money/mcp
```

Then run `/mcp`, choose `simple-balance` and sign in. Unless you set them,
Claude Code leaves the scopes to the server, which may mean all of them. To
choose, add the server with its scopes pinned instead:

```bash
claude mcp add-json --scope user simple-balance '{"type":"http","url":"https://app.smpl.money/mcp","oauth":{"scopes":"openid profile email offline_access ledger:read ledger:stage ledger:write"}}'
```

Leave out `ledger:write` to keep the assistant to staging. Or install the
plugin, which adds the server and a skill for working in the ledger:

```text
/plugin install simple-balance --marketplace thtmnisamnstr/simple-balance-mcp-connectors
```

Before Claude Code 2.1.275, add the marketplace first:

```text
/plugin marketplace add thtmnisamnstr/simple-balance-mcp-connectors
/plugin install simple-balance@simple-balance
```

Then run `/mcp`, choose `plugin:simple-balance:simple-balance` and
**Authenticate**. On claude.ai, the same marketplace can be added under
**Customize > Plugins > Add > Add marketplace**. Then open the plugin's
**Connectors** tab and connect Simple Balance.

### ChatGPT

1. Open **Plugins** at [chatgpt.com/plugins](https://chatgpt.com/plugins),
   choose **+**, then **Add custom MCP server**.
2. Name it `Simple Balance`. Under **Connection**, enter
   `https://app.smpl.money/mcp`.
3. For authentication, choose **OAuth**, with the client ID and secret left
   empty.
4. Tick **I understand and want to continue**, then **Create as a plugin**.
5. Install it from your plugins, and sign in when ChatGPT asks.
6. In a new chat, type `@` and pick **Simple Balance**.

OpenAI's help center says custom MCP servers are for ChatGPT Business,
Enterprise and Edu, on the web. On Business only an admin or owner can add
one, and on Enterprise and Edu an admin grants permission. On Pro, ChatGPT can
connect one for reading only. Write actions need your confirmation by default.

### OpenAI Codex (CLI, IDE extension, ChatGPT desktop app)

```bash
codex mcp add simple-balance --url https://app.smpl.money/mcp
```

Sign-in starts on its own, asking for every scope the server offers,
`ledger:write` included. To run it again, use
`codex mcp login simple-balance`. To choose the scopes, don't run
`codex mcp add`. Put the server in `~/.codex/config.toml` with its scopes, then
run `codex mcp login simple-balance`:

```toml
[mcp_servers.simple-balance]
url = "https://app.smpl.money/mcp"
scopes = ["openid", "profile", "email", "offline_access", "ledger:read", "ledger:stage"]
```

`codex mcp login --scopes` overrides the list for one sign-in only. On a
computer with no browser, add `--no-browser` and paste the address you end on
back into Codex. In Codex CLI or the ChatGPT desktop app you
can install the plugin instead (the IDE extension has no plugins):

```bash
codex plugin marketplace add thtmnisamnstr/simple-balance-mcp-connectors
codex plugin add simple-balance@simple-balance
codex mcp login simple-balance
```

`codex plugin add` doesn't start sign-in, so the last command does. Installing
from `/plugins` inside `codex` signs in by itself.

### Cursor

Use the **Add to Cursor** button above, or add this to `~/.cursor/mcp.json`
(every project) or `.cursor/mcp.json` (one project):

```json
{
  "mcpServers": {
    "simple-balance": {
      "url": "https://app.smpl.money/mcp"
    }
  }
}
```

Sign in when Cursor asks. Manage it under **Customize > MCPs**.

### VS Code and GitHub Copilot

Use the **Install in VS Code** button above, or add the server to a
workspace-root `.mcp.json`, or to `~/.copilot/mcp-config.json` for every
workspace:

```json
{
  "mcpServers": {
    "simple-balance": {
      "type": "http",
      "url": "https://app.smpl.money/mcp"
    }
  }
}
```

VS Code's older format, in `.vscode/mcp.json`, also works:

```json
{
  "servers": {
    "simple-balance": {
      "type": "http",
      "url": "https://app.smpl.money/mcp"
    }
  }
}
```

On Copilot Business and Enterprise, an administrator has to enable the
**MCP servers in Copilot** policy first. In GitHub Copilot CLI:

```bash
copilot mcp add --transport http simple-balance https://app.smpl.money/mcp
```

To install the plugin, which adds the skill as well as the server, run
`copilot plugin install thtmnisamnstr/simple-balance-mcp-connectors:plugin`, or
in VS Code open **Chat: Open Customizations**, add the marketplace
`thtmnisamnstr/simple-balance-mcp-connectors` and install `simple-balance`.

### Gemini

In the Gemini app, add Simple Balance on the web at gemini.google.com, and it
appears in the phone app too. Google offers custom apps to people in the US
who are 18 or older, with a personal Google account, Gemini in English and
**Keep Activity** on.

1. Open **Settings > Connected Apps** (or **Personal Intelligence >
   Connected Apps**).
2. Under **Custom apps**, choose **Add a custom app**.
3. Enter `https://app.smpl.money/mcp`, choose **Next**, and sign in.

Type `@` in a chat and pick Simple Balance. Gemini asks you to confirm every
write.

### Gemini CLI

Gemini CLI is for Gemini Code Assist Standard and Enterprise, Code Assist for
GitHub, and legacy paid Gemini API or Vertex keys. Free and Google AI Pro or Ultra accounts moved to Antigravity CLI
on June 18, 2026, which this README doesn't cover yet.

Install the extension, which adds the server and a short context file:

```bash
gemini extensions install https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
```

Or add the server alone:

```bash
gemini mcp add --transport http --scope user simple-balance https://app.smpl.money/mcp
```

Start `gemini` in a trusted folder: in an untrusted one it connects no MCP
servers, and `/permissions trust` trusts the folder you're in. With the
extension, it asks to open a browser to sign in. With the server added alone,
run `/mcp auth simple-balance` to sign in, because Gemini CLI opens the
browser by itself only for servers set to `"oauth": {"enabled": true}`, as the
extension's is.

### Cline

In the Cline panel, open **MCP Servers > Remote Servers**. Enter the name
`simple-balance`, the URL `https://app.smpl.money/mcp` and the transport
**Streamable HTTP**, then **Add Server** and **Authenticate**. If you'd rather
have Cline set it up, point it at [llms-install.md](llms-install.md).

### Other clients

Any client that connects to remote MCP servers with OAuth needs only the URL.

| Client | Where to add it |
| --- | --- |
| Windsurf (Devin Desktop) | **Customize > MCPs > This computer**, open the config file (`~/.config/devin/mcp_config.json`), add the Cursor snippet above and **Authenticate**. With Devin CLI: `devin mcp add -s user simple-balance https://app.smpl.money/mcp`, then `devin mcp login simple-balance` |
| Zed | **Settings > AI > MCP Servers > Add Remote Server**, or `"context_servers": {"simple-balance": {"url": "https://app.smpl.money/mcp"}}` in `settings.json` |
| Goose | [Add the extension](https://goose-docs.ai/extension?url=https%3A%2F%2Fapp.smpl.money%2Fmcp&type=streamable_http&id=simple-balance&name=Simple%20Balance&description=Your%20Simple%20Balance%20ledger&timeout=300), or **Extensions > Add custom extension** with type **Streamable HTTP** |
| Mistral Le Chat | **Connectors > Add Connector > Custom MCP Connector**, named `SimpleBalance` |
| Perplexity (Pro, Max or Enterprise) | **Plugins > Add custom > Add MCP connector > Remote**, with OAuth |
| Raycast (Pro) | **Install MCP Server**, transport **HTTP**, OAuth type **Dynamic** |
| Warp | **Settings > Agents > MCP servers > + Add**, with the Cursor snippet above |

## Directory listings

Where Simple Balance is listed, and what each listing still needs, is tracked in
[submissions/README.md](submissions/README.md).

## This repository

| Path | What it is | Read by |
| --- | --- | --- |
| [`plugin/`](plugin/) | One plugin folder, with each vendor's manifest side by side | OpenAI (ChatGPT and Codex), Claude Code, Cursor, VS Code, GitHub Copilot CLI |
| [`server.json`](server.json) | The MCP Registry entry | registry.modelcontextprotocol.io, and the directories that copy it |
| [`gemini-extension.json`](gemini-extension.json), [`GEMINI.md`](GEMINI.md) | The Gemini CLI extension | Gemini CLI and its extension gallery |
| [`.claude-plugin/`](.claude-plugin/), [`.cursor-plugin/`](.cursor-plugin/), [`.agents/plugins/`](.agents/plugins/) | Marketplace files that point at `plugin/` | Claude Code and claude.ai, VS Code and GitHub Copilot CLI (through `.claude-plugin/`), Cursor, Codex and the ChatGPT desktop app |
| [`llms-install.md`](llms-install.md) | Setup steps written for an AI agent | Cline |
| [`submissions/`](submissions/) | Copy, form answers and files for every directory, and what each still needs | The person submitting |
| [`assets/`](assets/) | The logo, as SVG and rendered PNGs | Directory forms |
| [`scripts/`](scripts/) | The checks, the OpenAI ZIP build and version tooling | `npm` |

### Checks

```bash
npm ci
npm run check        # published schemas, cross-file agreement, directory limits, links
npm run check:live   # also probes app.smpl.money and every page the listings link to
npm run build:openai # builds dist/simple-balance-plugin-<version>.zip for OpenAI
```

`npm run check` validates the files that have a published schema (the MCP
Registry, Agent Plugins, Cursor and Cline manifests) and holds every listing
file to the others. It and the ZIP build run on every pull request and push to
`main`, along with each vendor's own validator: Claude Code's `plugin validate`,
Gemini CLI's `extensions validate`, the MCP Registry's `mcp-publisher validate`,
and the Cline and Docker catalog validators. `check:live` runs when you start
the check workflow by hand, and in every release before it publishes.

### Releasing

Every listing carries one version. To release:

1. `npm run set-version -- 1.0.1`, and rewrite the OpenAI release notes in
   `plugin/plugin.json`.
2. Merge the change to `main`, then tag the merge commit `v1.0.1` and push the
   tag. Push one release tag at a time: a third tag waiting behind a running
   release cancels the one queued before it.

The tag runs [`release.yml`](.github/workflows/release.yml): it checks
everything again, probes the live server, publishes `server.json` to the MCP
Registry and builds the OpenAI ZIP as a downloadable artifact. Uploading that
ZIP to OpenAI, asking Cursor to re-index, selecting **Publish** on the new
version in Claude's directory, and updating the awesome-copilot entry stay
manual. See [submissions/README.md](submissions/README.md).

When the application adds, renames or retires a tool, run
`npm run sync-tools -- ../simple-balance` from a checkout of its latest release.

## License

MIT. The Simple Balance application is
[AGPL-3.0](https://github.com/thtmnisamnstr/simple-balance).
