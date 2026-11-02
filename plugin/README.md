# Simple Balance plugin

Connects your AI assistant to your own [Simple Balance](https://smpl.money/)
ledger. The plugin holds no code. It adds one remote MCP server,
`https://app.smpl.money/mcp`, and one skill that tells the assistant how to use
it. The plugin sends requests only to `app.smpl.money`. What the tools return
goes to the assistant you connected, under its provider's terms, and nowhere
else.

The same folder installs in Claude Code, Cursor, OpenAI Codex, the ChatGPT
desktop app, VS Code and GitHub Copilot CLI. In Claude Code:

```text
/plugin install simple-balance --marketplace thtmnisamnstr/simple-balance-mcp-connectors
```

How to add it to each of the others is in the
[repository README](https://github.com/thtmnisamnstr/simple-balance-mcp-connectors#readme).

## What it can do

Read balances, transactions, budgets, reports and forecasts. Propose
transactions, or import a bank statement CSV, into the Staged queue, where
nothing changes a balance until it's committed. With write access, commit
staged rows, record and edit transactions, and manage accounts, categories,
payees, budgets, templates and recurring transactions.

Simple Balance doesn't connect to banks and can't move money. It records what
you enter or import.

## Signing in

Sign in once before first use. On claude.ai, Cowork or Claude Desktop, open the
plugin from **Customize > Plugins**, select its **Connectors** tab and connect
Simple Balance. In Claude Code, run `/mcp`, choose
`plugin:simple-balance:simple-balance` and **Authenticate**. In Codex CLI, run
`codex mcp login simple-balance`. Other clients start sign-in when they first
connect. A browser opens at `app.smpl.money`: sign in, check the scopes the
screen lists, and choose **Allow access**. You don't paste a token or API key
anywhere; your client stores the sign-in itself.

| Scope | What the connection may do |
| --- | --- |
| `ledger:read` | Read accounts, transactions, reports and history |
| `ledger:stage` | Also propose, edit and delete staged transactions, which change no balance until committed |
| `ledger:write` | Also commit, create, edit and delete transactions, accounts, categories and budgets, merge categories and payees, change preferences and revoke connected agents |

The assistant asks for the scopes, and the screen grants all of them or none.
To see or revoke a connection, open **Settings** in Simple Balance and find it
under **Connected agents**. Everything an agent changes appears on
**Activity** with an **Agent** badge.

## Contents

| Path | Read by |
| --- | --- |
| `plugin.json`, `mcp.json` | OpenAI (ChatGPT and Codex), Cursor, VS Code, GitHub Copilot CLI |
| `.claude-plugin/plugin.json`, `.mcp.json` | Claude Code and Claude's plugin directory; `.mcp.json` also through the Cursor manifest |
| `.cursor-plugin/plugin.json` | Cursor and cursor.directory |
| `skills/simple-balance/SKILL.md` | Every client above |
| `assets/` | Directory listings |

## Support

- Help: [frequently asked questions](https://smpl.money/docs/frequently-asked-questions/),
  or email info@smpl.money
- [Privacy policy](https://smpl.money/privacy/)
- [Terms](https://smpl.money/terms/)
- [How the MCP server works](https://smpl.money/docs/agents-and-mcp/)

The plugin is MIT licensed. The Simple Balance application it connects to is
[open source under AGPL-3.0](https://github.com/thtmnisamnstr/simple-balance).
