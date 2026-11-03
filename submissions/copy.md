# Listing copy

The canonical copy for Simple Balance's listings. Where a string already lives
in a manifest, the manifest is the source: change it there, run
`npm run check`, and copy it from there. Counts are JavaScript string lengths, the measure
`scripts/check.mjs` uses, so a line break counts as one character.

Every guide pastes these strings rather than writing its own, so a reader
meets the same product in every directory.

Check: when a form shows a character counter, it should match the count given
here. A count that is higher by the number of line breaks means the form counts
each break as two characters. The long description fits 2,000 even then.

## Messaging

The listings reuse the lines that [smpl.money](https://smpl.money/) and the
application's README already use, so somebody who arrives from a directory
reads what the site told them.

| Line | Where it comes from |
| --- | --- |
| Free budget app and spending tracker | The site's title, tab and social card (`titleTagline` in simple-balance-web `src/content/home.ts`) |
| Every account is on one page, and any total you doubt opens into the payments behind it | The site description: "your accounts on one page ... and totals you can follow back to the payments behind them" |
| Your assistant reads the same records you do | The homepage's assistant section: "Connect an AI assistant to Simple Balance and it reads the same records you do." |
| You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself | The same section: "You decide how far it goes: reading only, or allowed to queue things up for you to approve, or allowed to make the change itself." |
| Settings lists what each assistant can do, and cuts an assistant off when you want it gone | The same section, word for word |
| Nothing it queues counts until you've looked at it | The homepage import card: "Nothing counts until you've looked at it" |
| There's no automatic pull from your bank today: you download the file your bank gives you and bring it in | The import card, and rule 1.4 of the site's `docs/standards/content.md` |
| Free gives you everything Simple Balance does, for three accounts you can use at once | The homepage's plans section, word for word |

The site's content standard also sets these, and the listings follow them:

- **Category words first.** "Budget app" and "spending tracker" are what people
  search for, so every listing says them before anything else.
- **Plain words.** Ledger, double-entry, bookkeeping, posting, staged and
  commit stay out of user-facing copy unless the sentence says what they mean.
  Technical text (scopes, tool names, agent instructions) keeps the app's own
  words.
- **The bank sentence goes after the value, in the present tense.** Never lead
  with it, and never promise there will never be a connection.
- **"Free" stays out of OpenAI's listing**, which bars pricing claims. Everywhere
  else it's in the tagline, because it's true of every feature.
- **No em dashes in copy**, contractions where a person would use them, and
  American English.

## Names

| Name | Value | Where it goes |
| --- | --- | --- |
| Product name and display name | `Simple Balance` | Every name or display name field: OpenAI `displayName` (30 at most), Claude server name (100), MCP.so name (2 to 120), MCP Market server name (80), `server.json` `title`, Docker `about.title`, Cline `name`, the Claude and Cursor manifests' `displayName` |
| Slug | `simple-balance` | Plugin and marketplace name, the server key in every MCP config, Gemini extension name, Cline `id`, Docker folder and `name`, Cursor organization handle, Claude Directory URL slug |
| Plugin install id | `simple-balance@simple-balance` | Claude Code and Codex, once the marketplace is added |
| MCP Registry name | `money.smpl/simple-balance` | `server.json` `name`, the Glama connector page and badge, mcpservers.org's **Official MCP Registry Name** |
| Publisher | `Gavin Johnson` | Every author, developer, owner, company or provider field. The privacy policy names him as data controller, so the listing and the policy name the same publisher. |
| Author and publisher email | `gavin@smpl.money` | Every author, owner, maintainer or publisher-contact field, and anything signed with Gavin Johnson's name |
| Contact | `info@smpl.money` | Every other contact or support email field |

- Keep the product name alone, with no "MCP", "MCP Server" or "Plugin" after
  it. Docker's `about.title` may not contain `MCP` or `Server`.
- The Claude Directory slug can't change once the listing is published, and
  the plugin `name` must never change, or OpenAI refuses the next upload.
- If you fall back to `io.github.thtmnisamnstr/simple-balance`, change
  `server.json`'s `name` and the two Glama URLs in
  `submissions/awesome-remote/entry.md`, as [mcp-registry.md](mcp-registry.md)
  describes. Every place this file shows the registry name changes with it.

## Taglines and one-liners

| Tightest limit | Text | Characters | Used by |
| --- | --- | --- | --- |
| 30 | `Budget and spending tracker` | 27 | OpenAI subtitle: `interface.shortDescription` in `plugin/plugin.json` |
| 55, unconfirmed | `Free budget app and spending tracker` | 36 | Claude Directory, only if the portal asks for a short tagline, as [claude-directory.md](claude-directory.md) says. Also in the GitHub **About** description, which [gemini-cli.md](gemini-cli.md#1-set-the-about-fields-and-topics) sets. |
| About 97 | `Free budget app and spending tracker: ask about your money, and queue or record transactions` | 92 | Docker Hub and Docker Desktop: `about.description` in `submissions/docker/servers/simple-balance/server.yaml`. Docker adds the period. |
| 100 | `Free budget app and spending tracker: ask about your money, and queue or record transactions.` | 93 | MCP Registry: `description` in `server.json`, which Glama, GitHub's registry and the directories that import from the registry show. Also MCP.Directory's **Short Description**, the Cline `tagline` (without the period), and line 3 of `submissions/awesome-remote/entry.md` (120 at most). |
| 200 | `Budget app and spending tracker. Ask about your accounts, spending and budgets, and queue or record transactions, as far as you allow.` | 134 | `description` in `plugin/plugin.json`, both plugin manifests and every marketplace entry. Also Claude Directory's **One-liner**, Cursor's **Description**, and awesome-copilot's **Short description**. It has no price in it, because the same file goes to OpenAI. |
| None published | `Ask Gemini CLI about your accounts, spending and budgets in Simple Balance, the free budget app and spending tracker, and queue or record transactions as far as you allow. Signs in with OAuth; no API key.` | 204 | Gemini CLI gallery card: `description` in `gemini-extension.json` |

- Docker's catalog adds a final period only when the field has none (`addDot`
  in Docker's `pkg/catalog/tile.go`), so the card ends in one period either
  way. `npm run check` fails if the field ends in one, so leave it off.
- The 200-row description must be the same in every manifest and marketplace
  entry, or `npm run check` fails. Change all of them together.

## Descriptions

The long description is `interface.longDescription` in `plugin/plugin.json`,
which OpenAI shows. It names no plan or price, because OpenAI's guidelines bar
advertising "pricing, subscriptions, free trials, discounts, or promotions".
The other three say "free" and end on the plans line, for every directory but
OpenAI.

### Short, 322 characters

For a field that wants a few sentences, or an email asking a directory to list
the server.

```text
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Connect your AI assistant and it reads the same records you do. You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself.
```

### Medium, 1,107 characters

For a description or overview field of about 1,000 characters.

```text
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and recurring transactions.

There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.

Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Free gives you everything Simple Balance does, for three accounts you can use at once.
```

### Long, 1,360 characters

For a description field of 2,000 characters or more, outside OpenAI.

```text
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and recurring transactions.

There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.

Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Everything an assistant changes shows on Activity. Deleting a transaction can be undone, but deleting anything else, or merging categories or payees, is permanent. Each currency keeps its own totals instead of being blended.

Free gives you everything Simple Balance does, for three accounts you can use at once. Sign up at app.smpl.money.
```

### Long for OpenAI, 1,294 characters

`interface.longDescription` in `plugin/plugin.json`, imported read-only from
the ZIP. Change it there, not here.

```text
Simple Balance is a budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and recurring transactions.

There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.

Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Everything an assistant changes shows on Activity. Deleting a transaction can be undone, but deleting anything else, or merging categories or payees, is permanent. Each currency keeps its own totals instead of being blended.

Requires a Simple Balance account at app.smpl.money.
```

### Capability lines

From `interface.capabilities` in `plugin/plugin.json` (OpenAI allows 20, at
most 120 characters each). Use them for any features field.

| Line | Characters |
| --- | --- |
| `See where your money goes` | 25 |
| `Check how a budget is doing` | 27 |
| `Queue transactions for you to approve` | 37 |
| `Bring in a bank statement file` | 30 |
| `Record and fix transactions` | 27 |

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
Not today. There's no automatic pull from your bank: you download the file your bank gives you and bring it in, or hand it to your assistant to bring in. Nothing in it counts until you've looked at it.

Can my assistant move money or pay someone?
No. Simple Balance keeps track of your money; it can't move it, and it has no connection to a bank or card.

Can the assistant change my records without asking?
You decide how far it goes when you connect it. With ledger:read it only reads. With ledger:stage it can also queue transactions for you to approve, and nothing it queues counts until you've looked at it; it can also edit or delete rows waiting on Staged, including imported ones, and a deleted one can't be restored. Only ledger:write lets it make the change itself. Everything an assistant changes shows on Activity with an Agent badge.

What can an assistant never do?
Delete your Simple Balance account, set a sign-in password or change anything about billing. Those happen only when you're signed in at app.smpl.money in a browser.

How do I disconnect an assistant?
Settings lists what each assistant can do, and cuts an assistant off when you want it gone: find it under Connected agents, choose Revoke, then Revoke access. What it already recorded stays.

How do I connect it?
Add https://app.smpl.money/mcp as a remote MCP server, with no API key or header. Your assistant opens a browser, where you sign in to Simple Balance and approve what it asked for.
```

| Question | Question characters | Answer characters |
| --- | --- | --- |
| Does Simple Balance connect to my bank? | 39 | 201 |
| Can my assistant move money or pay someone? | 43 | 107 |
| Can the assistant change my records without asking? | 51 | 438 |
| What can an assistant never do? | 31 | 164 |
| How do I disconnect an assistant? | 33 | 190 |
| How do I connect it? | 20 | 180 |

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
| `Where did my money go last month?` | `get_report` | Categorized transactions dated last month | Starter prompt 1 |
| `How much did I spend in each category last month?` | `get_report` | Categorized transactions dated last month | Positive test 1 |
| `What day did I pay the electric bill last month?` | `list_payees`, `list_transactions` | A utility payment last month (the seed's City Power & Water) | Starter prompt 2, and the homepage's own example |
| `What are my account balances right now?` | `list_accounts` | At least one account | Positive test 2 |
| `How am I doing against my budget this month?` | `get_budget_report` | A budget covering this month | Positive test 3 |
| `What's my net worth today?` | `get_report` | At least one account | |
| `What will my checking balance be at the end of next month?` | `get_forecast` | A Checking account. The answer is a projection, and the assistant should call it one. | |

### Stage

| Prompt | Tools | Needs | In `plugin.json` |
| --- | --- | --- | --- |
| `Add a $42.18 grocery purchase on checking for me to approve.` | `create_staged_transaction` | A Checking account and a Groceries category | Starter prompt 3 |
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
| Claude Code marketplace in this repository | `category`, `tags` | `finance`; `budget-app`, `spending-tracker`, `budgeting`, `personal-finance`, `mcp` | `.claude-plugin/marketplace.json` |
| Cursor Marketplace and cursor.directory | `category`, `tags` | `integrations`; `finance`, `budget-app`, `spending-tracker`, `mcp` | `plugin/.cursor-plugin/plugin.json` |
| Docker MCP Catalog | `meta.category`, `meta.tags` | `finance`; `finance`, `personal-finance`, `budgeting`, `budget-app`, `spending-tracker`, `remote` | `submissions/docker/servers/simple-balance/server.yaml` |
| Cline | `tags` | `finance`, `productivity` | `submissions/cline/entry.json` |
| MCP.so | **Category**, **Tags** | Finance & Commerce; the tags in [directories.md](directories.md) | The edit page after submitting |
| mcpservers.org | **Category** | Finance | The submit form |
| MCP Market | **Categories** (1 to 3) | Productivity & Workflow, Analytics & Monitoring | The submit form |
| MCP.Directory | None | Assigned automatically. It has a Finance category. | |
| Awesome Remote MCP Servers | Section | Finance | Where the entry goes in the list |
| awesome-copilot | **Keywords** | The plugin keywords plus `mcp`, as [vscode-copilot.md](vscode-copilot.md) gives them | The external plugin issue form |
| Gemini CLI gallery | Repository topic | `gemini-cli-extension` | This repository's **About** settings |
| MCP Registry, Glama, PulseMCP | None | | |

- The plugin keywords are `budget-app, spending-tracker, budgeting, personal-finance, transactions, csv-import, double-entry`,
  the `keywords` in `plugin/plugin.json` and both plugin manifests. The first
  two are the searches the site's title is written for. Use them for
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
| Transfer money, send money, move money, as something it does | Claude's review criteria reject connectors that "Transfer money, cryptocurrency, or other financial assets", and OpenAI prohibits "Execution of money transfers". Simple Balance moves nothing, and an automated scan judges the wording. | "Keeps track of your money; it can't move it." Stating the limit is fine. |
| Make payments, pay bills, as something it does | The same rules. The payments a person made are fine to talk about: the site's own line is "the payments behind them". | "Record a payment", "when you last paid the electric bill" |
| Repeating or scheduled payments | Reads as the connector paying on a schedule. The site and the app call the feature recurring transactions. | "Recurring transactions" |
| Syncs, connects to your bank, link your accounts, automatically updated, real time, live balances | False today, and banned by rule 1.4 of the site's content standard. | "There's no automatic pull from your bank today: you download the file your bank gives you and bring it in." |
| Ledger, double-entry, bookkeeping, posting, staged, commit, CSV, in user-facing copy | The site keeps accounting and operations words off its pages unless the sentence explains them (rule 1.3). Scopes, tool names and agent instructions keep the app's words. | Budget app and spending tracker; queue for you to approve; make the change itself; a bank statement file |
| Free trial, prices, upgrades | There's no trial, and OpenAI bars advertising "pricing, subscriptions, free trials, discounts, or promotions". | Outside OpenAI only: "Free gives you everything Simple Balance does, for three accounts you can use at once." |
| Best | A comparison nobody can check. OpenAI bars comparisons and unverifiable claims in subtitles and descriptions. | Say what it does. |
| Easy, simply, just, seamlessly, effortless, unlock, empower | Says nothing a reader can check, and the site's content standard bans them (rule 1.1). | Name the step: "add the URL and sign in". |
| Official, or endorsed by Anthropic or OpenAI | Anthropic's Directory Terms bar any statement that suggests "partnership with, sponsorship by, or endorsement by Anthropic". OpenAI says plugins "should not imply that they are made or endorsed by OpenAI". | Simple Balance's own server |
| An em dash | The site keeps them out of its copy (rule 1.5). | A period, a colon or a comma |

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
- https://github.com/thtmnisamnstr/simple-balance-web/blob/main/src/content/home.ts
- https://github.com/thtmnisamnstr/simple-balance-web/blob/main/docs/standards/content.md
