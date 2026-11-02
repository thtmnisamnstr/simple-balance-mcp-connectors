# Simple Balance plugin

Connects your AI assistant to [Simple Balance](https://smpl.money/), a budget
app and spending tracker. The plugin holds no code. It adds one remote MCP server,
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

Your assistant reads the same records you do. Ask what you have in each
account, where last month's money went, how a budget is doing, or when you last
paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to
approve, or making the change itself. Nothing it queues counts until you've
looked at it on **Staged**, including the rows of a bank statement file it
brings in for you. Allowed to make changes, it can also record and fix
transactions, split a purchase across categories, and set up budgets,
templates and repeating payments.

There's no automatic pull from your bank today: you download the file your
bank gives you and bring it in, or hand it to the assistant. Simple Balance
keeps track of your money; it can't move it.

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
