# Listing copy

The canonical copy for Simple Balance's listings. Where a string already lives
in a manifest, the manifest is the source: change it there, run
`npm run check`, and copy it from there. Counts are JavaScript string lengths, the measure
`scripts/check.mjs` uses, so a line break counts as one character.

Some guides carry text written for one directory. Paste theirs in that
directory:

| Directory | Text | Where |
| --- | --- | --- |
| OpenAI | Listing copy, starter prompts, capabilities and test cases | `plugin/plugin.json`. The portal imports it read-only from the ZIP, so there's nothing to retype. |
| Claude Directory, MCP connector | One-liner, short tagline, description, use cases | [claude-directory.md](claude-directory.md) |
| Cursor Marketplace and cursor.directory | **Description** fields | [cursor.md](cursor.md) |
| Docker MCP Catalog | Pull request **Brief Description** | [docker/pull-request.md](docker/pull-request.md) |
| MCP.so, MCP Servers, MCP.Directory, MCP Market | Descriptions, overview, tags, features, use cases, FAQ | [directories.md](directories.md) |
| awesome-copilot | **Short description**, **Keywords** | [vscode-copilot.md](vscode-copilot.md) |
| This repository's GitHub **About** box | Description, website, topics | [gemini-cli.md](gemini-cli.md), which uses the values [directories.md](directories.md) gives |

The rest of this file holds what they share: the strings already in the
manifests, the names, scopes, prompts, categories, links and logos, and house
versions of the one-liner and descriptions for any form no guide covers.

Check: when a form shows a character counter, it should match the count given
here. A count that is higher by the number of line breaks means the form counts
each break as two characters. The long description fits 2,000 even then.

## Names

| Name | Value | Where it goes |
| --- | --- | --- |
| Product name and display name | `Simple Balance` | Every name or display name field: OpenAI `displayName` (30 at most), Claude server name (100), MCP.so name (2 to 120), MCP Market server name (80), `server.json` `title`, Docker `about.title`, Cline `name`, the Claude and Cursor manifests' `displayName` |
| Slug | `simple-balance` | Plugin and marketplace name, the server key in every MCP config, Gemini extension name, Cline `id`, Docker folder and `name`, Cursor organization handle, Claude Directory URL slug |
| Plugin install id | `simple-balance@simple-balance` | Claude Code and Codex, once the marketplace is added |
| MCP Registry name | `money.smpl/simple-balance` | `server.json` `name`, the Glama connector page and badge, mcpservers.org's **Official MCP Registry Name** |
| Publisher | `Gavin Johnson` | Every author, developer, owner, company or provider field. The privacy policy names him as data controller, so the listing and the policy name the same publisher. |
| Contact | `info@smpl.money` | Every contact or support email field |

- Never add "MCP", "MCP Server" or "Plugin" to the name. OpenAI's guidelines
  say not to, `npm run check` fails a display name that ends in MCP or Plugin,
  and Docker's `about.title` may not contain `MCP` or `Server`.
- The Claude Directory slug can't change once the listing is published, and
  the plugin `name` must never change, or OpenAI refuses the next upload.
- If you fall back to `io.github.thtmnisamnstr/simple-balance`, change
  `server.json`'s `name` and the two Glama URLs in
  `submissions/awesome-remote/entry.md`, as [mcp-registry.md](mcp-registry.md)
  describes. Every place this file shows the registry name changes with it.

## Taglines and one-liners

| Tightest limit | Text | Characters | Used by |
| --- | --- | --- | --- |
| 30 | `Track spending and budgets` | 26 | OpenAI subtitle: `interface.shortDescription` in `plugin/plugin.json` |
| 55, unconfirmed | `Your personal ledger: balances, budgets and reports` | 51 | Claude Directory, only if the portal asks for a tagline of 55 characters or fewer, as [claude-directory.md](claude-directory.md) says |
| About 97 | `Read balances, budgets and reports, and stage or record transactions in Simple Balance` | 86, or 87 with the period Docker adds | Docker Hub and Docker Desktop: `about.description` in `submissions/docker/servers/simple-balance/server.yaml` |
| 100 | `Personal double-entry ledger: read balances, budgets and reports, and stage or record transactions.` | 99 | MCP Registry: `description` in `server.json`, which Glama and the other directories that import from the registry show. Also MCP.Directory's **Short Description** (100 at most), and line 3 of `submissions/awesome-remote/entry.md` for Awesome Remote MCP Servers (120 at most). |
| 120 | `Your personal ledger: ask about balances, spending and budgets, and stage transactions to review` | 96 | Cline marketplace: `tagline` in `submissions/cline/entry.json` |
| 200 | `Read balances, budgets and reports, and stage or record transactions in your Simple Balance ledger at app.smpl.money.` | 117 | `description` in `plugin/plugin.json`, both plugin manifests and every marketplace entry. Also Claude Directory's **One-liner**, per [claude-directory.md](claude-directory.md), and cursor.directory's **Description**, per [cursor.md](cursor.md). |
| 200 | `Read balances, spending, budgets and reports in your Simple Balance ledger, stage new transactions for your review, and record the ones you approve. It doesn't connect to banks or move money.` | 191 | Any field of about 200 characters that no guide covers. MCP.so, MCP Servers, MCP Market and awesome-copilot have their own text in their guides. |
| None published | `Read balances, budgets and reports, and stage or record transactions in your Simple Balance ledger at app.smpl.money. Signs in with OAuth; no API key.` | 150 | Gemini CLI gallery card: `description` in `gemini-extension.json` |

- Docker's catalog adds a final period only when the field has none (`addDot`
  in Docker's `pkg/catalog/tile.go`), so the card ends in one period either
  way. `npm run check` fails if the field ends in one, so leave it off.
- The 117-character description must be the same in every manifest and
  marketplace entry, or `npm run check` fails. Change all of them together.

## Descriptions

None of the three names a plan or a price, so each is safe for OpenAI, whose
guidelines bar advertising "pricing, subscriptions, free trials, discounts, or
promotions". Outside OpenAI you may add this sentence (62 characters):

```text
Simple Balance's free plan covers up to three active accounts.
```

### Short, 322 characters

For a form that wants a few sentences and has no text of its own in its guide,
such as a description field with no stated limit or an email asking a directory
to list the server.

```text
Simple Balance is a double-entry ledger for one person's money. Its MCP server lets an AI assistant answer questions about your balances, spending, budgets and reports, and propose transactions that wait for your review before they count. It records what you enter or import, and it doesn't connect to banks or move money.
```

### Medium, 1,063 characters

For a description or overview field of about 1,000 characters that no guide
covers.

```text
Simple Balance is a double-entry ledger for one person's money, kept in your own account at app.smpl.money. Its MCP server, at https://app.smpl.money/mcp, gives an AI assistant the ledger the web app uses.

Ask about balances, spending by category, income and expenses, net worth, budgets against actual spending, and balances projected from your recurring transactions. Have the assistant propose transactions, or import a bank statement CSV, into the staging queue, where nothing changes a balance until it's committed. With write access, it can commit what you approved, record and edit transactions, and manage accounts, categories, payees, budgets and recurring transactions.

You approve each connection on Simple Balance's own consent screen, which lists the scopes the assistant asked for. Tools outside the grant don't appear. Everything an assistant changes shows on Activity with an Agent badge, and you can revoke it under Settings > Connected agents.

Simple Balance doesn't connect to banks and can't move money. It records what you enter or import.
```

### Long, 1,968 characters

For a description field of 2,000 characters or more that no guide covers. It
fits a 2,000 limit even with each line break counted twice.

```text
Simple Balance is a double-entry ledger for one person's money, kept in your own account at app.smpl.money. Its MCP server, at https://app.smpl.money/mcp, gives an AI assistant the ledger the web app uses.

Ask about balances, spending by category, income and expenses, net worth, cash flow, budgets against actual spending, and balances projected from your recurring transactions. Every figure traces back to the entries behind it. Amounts are exact decimals, and totals are reported separately for each currency, never converted.

Have the assistant propose transactions, or import a bank statement CSV, into the staging queue. A staged row appears in no balance or report until it's committed, and an import flags rows that look like duplicates before they count.

With write access, the assistant can commit what you approved, record and edit transactions, split one across categories, change many at once after previewing them, merge duplicate categories or payees, and manage accounts, budgets, templates and recurring transactions.

Sign-in is OAuth in your browser, with no API key. Simple Balance's own consent screen names the assistant and lists the scopes it asked for: read, stage or write. Tools outside the grant don't appear. Every tool carries read-only and destructive hints, which clients use to decide when to ask you first. Everything an assistant changes shows on Activity with an Agent badge, and you can revoke a connection under Settings > Connected agents.

Deleting a transaction posts a reversal that you can undo. Deleting other records, and merging categories or payees, is permanent. No connection can delete your Simple Balance account, set a sign-in password or change anything about billing. Those happen only in a signed-in browser session.

Simple Balance doesn't connect to banks and can't move money. It records what you enter or import, and it isn't financial, tax, accounting or legal advice.

Requires a Simple Balance account.
```

### Capability lines

From `interface.capabilities` in `plugin/plugin.json` (OpenAI allows 20, at
most 120 characters each). Use them for a features field that no guide covers.

| Line | Characters |
| --- | --- |
| `Read balances, reports and budgets` | 34 |
| `Stage transactions for review` | 29 |
| `Import bank statement CSV files` | 31 |
| `Record and edit transactions` | 28 |

## What the connection can and cannot do

Within the scopes the person approves (see [Scopes](#scopes)), an assistant
can:

- With `ledger:read`: read accounts and balances, an account's register,
  transactions, categories and payees, budgets and the budget report, the six
  reports (net worth, income and expense, categories, cash flow, balance sheet,
  trial balance), the forecast, staged rows, recurring transactions, templates,
  preferences, connected agents and the activity history, and export
  transactions as CSV.
- With `ledger:stage`, also: propose transactions, import a CSV into
  **Staged**, and fix or delete staged rows. A staged row is in no balance or
  report until it's committed.
- With `ledger:write`, also: commit staged rows; record, edit, split, delete
  and restore transactions, one at a time or in bulk; manage accounts,
  categories, payees, budgets, recurring transactions, templates and
  preferences; and revoke connected agents.

Whatever its scopes, no MCP connection can do these three things. They happen
only in a signed-in browser session at app.smpl.money:

1. Delete the Simple Balance account.
2. Set a sign-in password.
3. Anything to do with billing.

Simple Balance itself, and so any connection to it:

- Doesn't move money, make payments or contact a bank. It records what you
  enter or import.
- Can't pull transactions from a bank, and holds no credit data.
- Reaches only the books of the account that signed in.
- Isn't advice. Its terms say it "is not financial, tax, accounting or legal
  advice".

Deleting a transaction posts a reversal that can be undone. Every other delete,
and merging categories or payees, is permanent. Everything an agent changes
shows on **Activity** with an **Agent** badge, and the person revokes a
connection under **Settings** > **Connected agents**.

### Answers for FAQ fields

For a form that asks for questions and answers and has none in its guide. Each
fits MCP Market's limits, a question of at most 200 characters and an answer of
at most 1,000. Paste each question and its answer into their own fields.

```text
Does Simple Balance connect to my bank?
No. Download a statement from your bank as a CSV file and import it, or give it to your assistant to import. Imported rows wait on Staged, and none of them counts until it's committed.

Can my assistant move money or pay someone?
No. Simple Balance records transactions. It can't send, receive or move money, and it has no connection to a bank or card.

Can the assistant change my records without asking?
That depends on the scopes you approve. With ledger:read it only reads. With ledger:stage it can also propose transactions, which wait on Staged and count in no balance or report until you commit them, and it can edit or delete rows on Staged, including imported ones. A deleted staged row can't be restored. Only ledger:write lets it change the books. Everything an assistant changes shows on Activity with an Agent badge.

What can an assistant never do?
Delete your Simple Balance account, set a sign-in password or change anything about billing. Those happen only in a signed-in browser session at app.smpl.money.

How do I disconnect an assistant?
In Simple Balance, open Settings, find it under Connected agents, choose Revoke, then Revoke access. It loses access at once, and what it already recorded stays.

How do I connect it?
Add https://app.smpl.money/mcp as a remote MCP server, with no API key or header. Your assistant opens a browser, where you sign in to Simple Balance and approve the scopes it asked for.
```

| Question | Question characters | Answer characters |
| --- | --- | --- |
| Does Simple Balance connect to my bank? | 39 | 184 |
| Can my assistant move money or pay someone? | 43 | 122 |
| Can the assistant change my records without asking? | 51 | 423 |
| What can an assistant never do? | 31 | 160 |
| How do I disconnect an assistant? | 33 | 161 |
| How do I connect it? | 20 | 186 |

## Scopes

The consent screen text is quoted from
[smpl.money/docs/agents-and-mcp](https://smpl.money/docs/agents-and-mcp/). Tool
counts come from [tools.json](tools.json) (application 0.2.1), and each scope
includes the tools of the scopes above it.

| Scope | Consent screen says | Settings shows | Tools listed |
| --- | --- | --- | --- |
| `openid` | Confirm who you are | | 0 |
| `profile` | See your name | | 0 |
| `email` | See your email address | | 0 |
| `offline_access` | Keep working without asking you again | | 0 |
| `ledger:read` | Read your accounts, transactions, and reports | Read only | 37 |
| `ledger:stage` | Propose transactions for you to review, without recording them | Read and queue for review | 42 (37 + 5) |
| `ledger:write` | Create, edit, and delete transactions and accounts | Read, stage, and commit | 77 (37 + 5 + 35) |

- The client decides which scopes to request, and the screen grants all of them
  or none. Tools outside the grant don't appear in the tool list.
- A client that requests no scope gets the server default
  `openid profile email ledger:read`, so it sees only the 37 read tools. That's
  an app prerequisite, not something this repository fixes: see
  [prerequisites.md](prerequisites.md).
- The OpenAI ZIP requests all seven scopes: `npm run build:openai` adds them to
  its copy of `mcp.json` only.
- By annotation, the 77 tools are 37 read-only, 9 additive and 31 destructive,
  11 of which can't be undone. When the app's tools change,
  `npm run sync-tools` refreshes [tools.json](tools.json); update the counts
  here from it.

## Example prompts

Each prompt needs the data in its Needs column, which the reviewer account in
[reviewer-account.md](reviewer-account.md) must hold. Every prompt in the read,
stage and write tables is under 128 characters and contains no `@`, so any of
them fits OpenAI's starter prompt rules or a use-case field. The Claude
Directory's policy asks for at least three working examples, and
[claude-directory.md](claude-directory.md) uses the five positive tests.

The Tools column names the tools a prompt is for. The assistant may call
`whoami`, `list_accounts` or `list_categories` first to find names and ids.

Check: run a prompt against the reviewer account before you paste it into a
form, and confirm the answer uses that account's data.

### Read

| Prompt | Tools | Needs | In `plugin.json` |
| --- | --- | --- | --- |
| `How much did I spend in each category last month?` | `get_report` | Categorized transactions dated last month | Starter prompt 1, positive test 1 |
| `What are my account balances right now?` | `list_accounts` | At least one account | Positive test 2 |
| `How am I doing against my budget this month?` | `get_budget_report` | A budget covering this month | Starter prompt 2, positive test 3 |
| `What's my net worth today?` | `get_report` | At least one account | |
| `What will my checking balance be at the end of next month?` | `get_forecast` | A Checking account. The answer is a projection, and the assistant should call it one. | |

### Stage

| Prompt | Tools | Needs | In `plugin.json` |
| --- | --- | --- | --- |
| `Stage a $42.18 grocery purchase from my checking account today.` | `create_staged_transaction` | A Checking account and a Groceries category | Starter prompt 3 |
| `Stage a $42.18 grocery purchase at Corner Market from my checking account today.` | `create_staged_transaction` | A Checking account and a Groceries category | Positive test 4 |
| `Here's my checking account statement as CSV. Stage it, and show me any row that looks like a duplicate.` | `preview_csv`, `stage_csv`, `list_staged_transactions`, `get_staged_duplicate` | A Checking account, and the statement's text pasted with the prompt | |

The first two stage the same purchase. Run one of them, or the second may be
flagged as a repeat of the first. Neither changes the Checking balance.

### Write

| Prompt | Tools | Needs | In `plugin.json` |
| --- | --- | --- | --- |
| `Show my staged transactions, then commit the Corner Market one.` | `list_staged_transactions`, `commit_staged_transactions` | The row the Corner Market prompt staged | Positive test 5 |
| `Set my Groceries budget for this month to $400.` | `set_budget_entry` | A Groceries category | |
| `Delete the $42.18 Corner Market purchase, then restore it.` | `list_transactions`, `set_transaction_deleted` | The transaction the commit prompt recorded | |

The assistant should ask before it commits or deletes. The delete posts a
reversal, and the restore posts it back, so the account ends where it started.

### Out of scope

The three negative tests in `plugin/plugin.json`. The assistant should call no
write tool for any of them.

| Prompt | Expected |
| --- | --- |
| `Send $500 from my checking account to my brother's bank account.` | It explains that Simple Balance records transactions and can't move money or contact a bank. |
| `What is my credit score, and can you pull my latest transactions from my bank?` | It explains there's no credit data and no bank connection, and may suggest importing a statement CSV. |
| `Show me the transactions in alex@example.com's Simple Balance account.` | It explains that the connection reaches only the signed-in account's own books. |

## Categories and tags

| Directory | Field | Value | Set in |
| --- | --- | --- | --- |
| OpenAI (ChatGPT and Codex) | `interface.category` | `Finance` | `plugin/plugin.json` |
| Codex marketplace in this repository | `category` | `Finance` | `.agents/plugins/marketplace.json` |
| Claude Directory, MCP connector | **Categories** (1 to 5) | Financial services, Productivity, Data & analytics | The portal, per [claude-directory.md](claude-directory.md) |
| Claude Directory, plugin bundle | None | The portal reads `plugin/.claude-plugin/plugin.json` and `plugin/README.md` | |
| Claude Code marketplace in this repository | `category`, `tags` | `finance`; `personal-finance`, `budgeting`, `bookkeeping`, `ledger`, `mcp` | `.claude-plugin/marketplace.json` |
| Cursor Marketplace and cursor.directory | `category`, `tags` | `integrations`; `finance`, `budgeting`, `mcp` | `plugin/.cursor-plugin/plugin.json` |
| Docker MCP Catalog | `meta.category`, `meta.tags` | `finance`; `finance`, `personal-finance`, `budgeting`, `accounting`, `remote` | `submissions/docker/servers/simple-balance/server.yaml` |
| Cline | `tags` | `finance`, `productivity` | `submissions/cline/entry.json` |
| MCP.so | **Category**, **Tags** | Finance & Commerce; the tags in [directories.md](directories.md) | The edit page after submitting |
| mcpservers.org | **Category** | Finance | The submit form |
| MCP Market | **Categories** (1 to 3) | Productivity & Workflow, Analytics & Monitoring | The submit form |
| MCP.Directory | None | Assigned automatically. It has a Finance category. | |
| Awesome Remote MCP Servers | Section | Finance | Where the entry goes in the list |
| awesome-copilot | **Keywords** | The plugin keywords plus `mcp`, as [vscode-copilot.md](vscode-copilot.md) gives them | The external plugin issue form |
| Gemini CLI gallery | Repository topic | `gemini-cli-extension` | This repository's **About** settings |
| MCP Registry, Glama, PulseMCP | None | | |

- The plugin keywords are `personal-finance, budgeting, bookkeeping, ledger, double-entry, transactions, csv-import`,
  the `keywords` in `plugin/plugin.json` and both plugin manifests. Use them for
  a free-text tag field that no guide covers.
- MCP Market has no Finance category. Productivity & Workflow and Analytics &
  Monitoring are the nearest of its 20.
- The Claude labels are those claude.com/marketplace shows for the category ids
  `financial-services`, `productivity` and `data-analytics`. The portal is
  behind a login, so its picker's labels are unconfirmed: pick the ones that
  match.
- This repository's GitHub **About** description, website and topics are set
  once, by step 1 of [gemini-cli.md](gemini-cli.md). The Gemini gallery finds
  extensions by the `gemini-cli-extension` topic, and MCP.Directory builds its
  listing from the repository.

## Links and contacts

| Field | Value |
| --- | --- |
| Website | `https://smpl.money/` |
| App, sign-up, and MCP Market's **Try Now** link | `https://app.smpl.money/` |
| MCP server URL | `https://app.smpl.money/mcp` |
| Documentation and homepage | `https://smpl.money/docs/agents-and-mcp/` |
| Support URL | `https://smpl.money/docs/frequently-asked-questions/`. Its "How do I get help?" section says to email info@smpl.money. There's no support page: `https://smpl.money/support/` returns 404. |
| Support and contact email | `info@smpl.money` |
| Privacy policy | `https://smpl.money/privacy/` |
| Terms | `https://smpl.money/terms/` |
| Security reports | `https://github.com/thtmnisamnstr/simple-balance/security/advisories/new`, GitHub private vulnerability reporting, as the app's `SECURITY.md` says |
| Server source, AGPL-3.0 | `https://github.com/thtmnisamnstr/simple-balance` |
| Plugin, manifests and setup guide, MIT | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` |
| Publisher | Gavin Johnson |

A form that asks for the server's source gets the app repository, as
`server.json` and the Docker pull request do. A form that asks for the plugin,
the install guide or a repository whose README it shows gets this one: the
Cline entry, Cursor's form, mcpservers.org and MCP.Directory.

## Logos and screenshots

| File | What it is | Use it for |
| --- | --- | --- |
| `assets/logo.svg` | The site's mark, square (`viewBox="0 0 64 64"`) | The source of the PNGs. Its copy `plugin/assets/logo.svg` is OpenAI's `composerIcon`. |
| `assets/logo-512.png` | 512 x 512 PNG, a green rounded square with transparent corners | Claude connector icon, MCP.so **Avatar**, and Cursor's **Logotype URL** as the raw URL below. Its copy `plugin/assets/logo.png` is OpenAI's `logo`, the Claude plugin's `icon`, the Cursor plugin's `logo`, and the optional logo upload on cursor.directory. |
| `assets/logo-400.png` | 400 x 400 PNG | Cline's legacy form, which asks for a 400 x 400 PNG. Its copy `submissions/cline/icon.png` is the Cline catalog icon. |

For a form that wants a URL:

| URL | What it is | Used by |
| --- | --- | --- |
| `https://raw.githubusercontent.com/thtmnisamnstr/simple-balance-mcp-connectors/main/assets/logo-512.png` | `assets/logo-512.png` on `main` | Cursor **Logotype URL**, and any form that takes a logo URL. It works only after this branch is merged to `main`. |
| `https://smpl.money/favicon.svg` | The same mark, served as `image/svg+xml` | `server.json` `icons` |
| `https://smpl.money/apple-touch-icon.png` | 180 x 180 PNG | `server.json` `icons`, Docker `about.icon` |
| `https://smpl.money/favicon-48.png` | 48 x 48 PNG | `server.json` `icons` |

Check: open the raw URL in a private window before you paste it. A 404 means
`main` doesn't have the file yet, and a listing that fetches it gets no logo.

The brand colors are `#176B4B` and, for dark mode, `#58C795`: `brandColor` and
`brandColorDark` in `plugin/plugin.json`. Only OpenAI asks for them.

Screenshots of the web app: seven WebP images, 1200 x 750, at
`https://smpl.money/screenshots/1200/<name>-light.webp`, where `<name>` is
`dashboard`, `accounts`, `reports`, `budgets`, `import`, `staged` or
`activity`.

| Directory | Screenshots |
| --- | --- |
| MCP.so | Up to 6 images, each 10 MB at most: `dashboard`, `staged`, `reports`, `budgets`, `accounts` and `activity`, in the order [directories.md](directories.md) gives. Leave out `import`: it shows an empty upload step. |
| OpenAI | None. A server with no UI gets `screenshots_not_allowed`, and `npm run check` fails if `plugin/plugin.json` has screenshots. |
| Claude Directory | None. Carousel screenshots are for MCP Apps only, and Simple Balance has none. |
| Every other directory | No screenshot field |

## Words to avoid

| Avoid | Why | Write instead |
| --- | --- | --- |
| Transfer money, send money, move money, as something it does | Claude's review criteria reject connectors that "Transfer money, cryptocurrency, or other financial assets", and OpenAI prohibits "Execution of money transfers". Simple Balance moves nothing, and an automated scan judges the wording. | Record a transaction. "Doesn't move money" is fine: it states the limit. |
| Payment | Reads as making or processing payments, which the same rules cover. Nothing in Simple Balance pays anyone. | Purchase, expense, transaction |
| Bank sync, connects to your bank, bank feeds | False. Statements come in as CSV files the person downloads and imports. | Import a bank statement CSV |
| Free trial | There's no trial, and OpenAI bars advertising "pricing, subscriptions, free trials, discounts, or promotions". | Outside OpenAI only: "Simple Balance's free plan covers up to three active accounts." |
| Best | A comparison nobody can check. OpenAI bars comparisons and unverifiable claims in subtitles and descriptions. | Say what it does. |
| Easy, and simply, just or seamlessly | Says nothing a reader can check, and the house style rules them out. | Name the step: "add the URL and sign in". |
| Official, or endorsed by Anthropic or OpenAI | Anthropic's Directory Terms bar any statement that suggests "partnership with, sponsorship by, or endorsement by Anthropic". OpenAI says plugins "should not imply that they are made or endorsed by OpenAI". | Simple Balance's own server |

## Sources

- https://developers.openai.com/plugins/plugin-guidelines
- https://developers.openai.com/plugins/deploy/submission-errors
- https://developers.openai.com/plugins/deploy/submission
- https://claude.com/docs/connectors/building/submission
- https://claude.com/docs/connectors/building/review-criteria
- https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
- https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms
- https://claude.com/marketplace/connectors/pocketsmith-complete-access
- https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json
- https://github.com/docker/mcp-registry/pull/1568
- https://github.com/docker/mcp-registry/blob/main/pkg/catalog/tile.go
- https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/CONTRIBUTING.md
- https://github.com/cline/marketplace/blob/main/schemas/common.schema.json
- https://github.com/cline/marketplace/blob/main/tags.json
- https://mcp.so/submit?type=remote-server
- https://mcpservers.org/submit
- https://mcpmarket.com/submit?source=remote
- https://mcp.directory/submit
- https://glama.ai/mcp/connectors
- https://cursor.com/marketplace/publish
- https://github.com/github/awesome-copilot/blob/main/.github/ISSUE_TEMPLATE/external-plugin.yml
- https://geminicli.com/docs/extensions/releasing/
- https://smpl.money/docs/agents-and-mcp/
- https://github.com/thtmnisamnstr/simple-balance/blob/main/src/server/auth.ts
- https://smpl.money/docs/frequently-asked-questions/
- https://smpl.money/terms/
- https://smpl.money/
