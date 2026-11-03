# Prerequisites outside this repository

What the listings depend on that this repository can't change: the
application, the website, DNS, GitHub settings and accounts. The table below
is the order to work in, starting with what blocks a submission. Items keep
their numbers when new ones are added, so follow the rows rather than the
numbers. Required means a submission can't go in, or fails review, without it.
Recommended means a likely failure or review risk that no platform has
confirmed. Optional improves a listing.

Code locations are at
[simple-balance](https://github.com/thtmnisamnstr/simple-balance/tree/5a251d7b4d0d0da8e937bcbd4264f2708a39127d)
`5a251d7` (main, 0.2.1) and
[simple-balance-web](https://github.com/thtmnisamnstr/simple-balance-web/tree/297ac536074b65c6f5ec994f23f37deb3dcc6f35)
`297ac53`. Verified means checked in that source, or live with a read-only
request (`GET`, `OPTIONS`, `dig` or `gh api`) on 2026-11-02.

## Order of work

| # | Item | Where | Needed by | Need | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | [Registry TXT record](#1-registry-txt-record) | DNS | MCP Registry, and every directory that reads it | Required | Missing |
| 2 | [Registry publishing environment and secret](#2-registry-publishing-environment-and-secret) | GitHub | MCP Registry | Required | Missing |
| 3 | [Reviewer test account](#3-reviewer-test-account) | Accounts | OpenAI, Claude, Docker | Required | Not created |
| 4 | [OpenAI organization and identity verification](#4-openai-organization-and-identity-verification) | Accounts | OpenAI | Required | Unknown |
| 5 | [OpenAI domain-verification route](#5-openai-domain-verification-route) | App | OpenAI | Required | Missing |
| 6 | [Paid Claude plan](#6-paid-claude-plan) | Accounts | Claude connector and plugin | Required | Unknown |
| 7 | [Claude setup, examples and troubleshooting in the docs](#7-claude-setup-examples-and-troubleshooting-in-the-docs) | Website | Claude connector | Required | Missing |
| 33 | [Publisher named on every listing URL](#33-publisher-named-on-every-listing-url) | Website | OpenAI | Required | Privacy page only |
| 8 | [Demo recording](#8-demo-recording) | Accounts | OpenAI | Required | Not recorded |
| 9 | [Cursor account](#9-cursor-account) | Accounts | Cursor Marketplace | Required | Unknown |
| 10 | [Star on the Awesome Remote repository](#10-star-on-the-awesome-remote-repository) | GitHub | Awesome Remote | Required | Not starred |
| 11 | [Checks that need a live sign-in](#11-checks-that-need-a-live-sign-in) | Clients | OpenAI, Claude; others recommended | Required | Not run |
| 12 | [Token endpoint advertises only `none`](#12-token-endpoint-advertises-only-none) | App | OpenAI | Recommended | 3 methods |
| 13 | [Keep DCR clients that were ever authorized](#13-keep-dcr-clients-that-were-ever-authorized) | App | OpenAI | Recommended | Pruned |
| 14 | [Tool text that reads as moving money](#14-tool-text-that-reads-as-moving-money) | App | Claude, OpenAI | Recommended | 4 texts |
| 34 | [Upgrade wording in refusals to agents](#34-upgrade-wording-in-refusals-to-agents) | App | OpenAI | Recommended | 2 messages |
| 37 | [Annotations a reviewer may question](#37-annotations-a-reviewer-may-question) | App | OpenAI | Recommended | Decide |
| 15 | [`scope` in the first 401](#15-scope-in-the-first-401) | App | Docker, Claude Code, Glama | Recommended | No scope |
| 16 | [Redirect host on the consent screen](#16-redirect-host-on-the-consent-screen) | App | Claude, OpenAI | Recommended | Not shown |
| 17 | [Revoke the presented refresh token](#17-revoke-the-presented-refresh-token) | App | Claude | Recommended | Not revoked |
| 18 | [`annotations.title` on every tool](#18-annotationstitle-on-every-tool) | App | Claude | Recommended | Not set |
| 19 | [Bounded tool results](#19-bounded-tool-results) | App | Claude Code, Claude | Recommended | Unbounded |
| 35 | [Stored write responses in the privacy policy](#35-stored-write-responses-in-the-privacy-policy) | Website | Claude, OpenAI | Recommended | Not named |
| 29 | [Tool output fields](#29-tool-output-fields) | App | OpenAI | Recommended | Not audited |
| 36 | [Mail from gavin@ and info@smpl.money](#36-mail-from-gavin-and-infosmplmoney) | Accounts | Every listing's review contact | Recommended | Untested |
| 20 | [Glama account and test profile](#20-glama-account-and-test-profile) | Accounts | Glama | Recommended | Not set up |
| 21 | [Glama claim record](#21-glama-claim-record) | DNS | Glama | Recommended | Missing |
| 22 | [Gemini CLI topic and the About fields](#22-gemini-cli-topic-and-the-about-fields) | GitHub | Gemini CLI, MCP.Directory | Recommended | Empty |
| 23 | [Smaller `tools/list`](#23-smaller-toolslist) | App | OpenAI | Required if 11 fails | Untested |
| 24 | [First 512 characters of the server instructions](#24-first-512-characters-of-the-server-instructions) | App | OpenAI | Optional | Not reordered |
| 25 | [UserInfo endpoint](#25-userinfo-endpoint) | App | ChatGPT Enterprise workspaces | Optional | Missing |
| 26 | [CORS on `OPTIONS /mcp`](#26-cors-on-options-mcp) | App | Browser-hosted clients | Optional | Missing |
| 27 | [Client ID metadata documents](#27-client-id-metadata-documents) | App | Claude, Codex, VS Code | Optional | Not advertised |
| 28 | [Rate-limit rules for Anthropic's traffic](#28-rate-limit-rules-for-anthropics-traffic) | App | Claude | Optional | Defaults |
| 30 | [Anonymous `initialize`](#30-anonymous-initialize) | App | MCP.so, Glama | Optional | 401 only |
| 31 | [`/support/` page](#31-support-page) | Website | OpenAI, Claude, Cursor | Optional | Missing |
| 32 | [HTTP proof file for the registry](#32-http-proof-file-for-the-registry) | Website | MCP Registry, without DNS | Optional | Missing |

## Application

[thtmnisamnstr/simple-balance](https://github.com/thtmnisamnstr/simple-balance).
A change reaches app.smpl.money after an app release and its rollout to
production. Ship 5, 12 and 13 before the first OpenAI submission, and 14 to 19
and 34 in the same release if you can.

### 5. OpenAI domain-verification route

Required for OpenAI. In the portal's **MCPs** > **Connect** step, OpenAI
generates a token and checks that the MCP host serves it as plain text at
`/.well-known/openai-apps-challenge`: the exact token, not JSON. Until it
answers, the tool scan and the submission can't run.

- Change: answer `GET /.well-known/openai-apps-challenge` with the value of a
  new `SB_OPENAI_APPS_CHALLENGE` setting as `text/plain`, and 404 while it's
  unset. Register the route in `src/server/api.ts` above the catch-all at line
  1049, which answers every other `.well-known` path with 404 JSON, and read
  the setting in the `values` object of `src/server/config.ts` (lines
  313-345). A new setting's name starts with `SB_`
  (`docs/standards/operations.md`, "Naming"), or
  `tests/deploy-settings-naming.test.ts` fails.
- Also: pass it to every process that runs the server, or the container never
  sees it. Add `SB_OPENAI_APPS_CHALLENGE: ${SB_OPENAI_APPS_CHALLENGE:-}` to the
  `app` service's `environment:` in `deploy/compose/single/compose.yml`, and to
  `x-app-config` in `deploy/compose/compose.distributed.yml`, which the server
  and the scheduler both merge. Add the name to `SERVER_SETTINGS` in
  `deploy/pulumi/common/app-settings.ts` (lines 35-79).
  `tests/env-example.test.ts` and `tests/app-settings.test.ts` fail without
  these.
- Then: apply the changed compose file on the production machine before you
  roll out the new image. When the portal shows the token, set
  `SB_OPENAI_APPS_CHALLENGE=<token>` in production's settings and apply them.
- Check: `curl -sS https://app.smpl.money/.well-known/openai-apps-challenge`
  prints the token and nothing else, and `npm run check:live` stops warning
  about it.
- Parent domain: OpenAI's submission page now allows the MCP host or "an
  eligible parent domain" without saying which parents qualify. The portal
  shows the exact URL during setup. Serving the token from app.smpl.money
  avoids the question.

Status: verified missing. The live `GET` returns 404
`{"error":"not_found","error_description":"No metadata is published here"}`.

### 12. Token endpoint advertises only `none`

Recommended for OpenAI. Registration makes every client public: it forces
`token_endpoint_auth_method` to `none` (`src/server/api.ts:721`). Discovery
still advertises `client_secret_basic`, `client_secret_post` and `none`.
Whether ChatGPT accepts a registration response that overrides the method it
asked for is unconfirmed (item 11's ChatGPT sign-in shows it); advertising what
registration does removes the question, and `none` stays listed for clients
that look for it.

- Change: return `token_endpoint_auth_methods_supported: ["none"]` from
  `authorizationServerMetadata` (`src/server/api.ts:1006-1016`; the response
  is built at line 1015). Better Auth's own copy of the document, at
  `/api/auth/.well-known/oauth-authorization-server`, lists all three methods
  too; item 25 has it answer from the same handler.

Status: verified live:
`["client_secret_basic","client_secret_post","none"]`.

### 13. Keep DCR clients that were ever authorized

Recommended for OpenAI. ChatGPT registers a client once per connection and
reuses it, and OpenAI's troubleshooting page says to restore those credentials
rather than create a new client. Revoking under **Connected agents** deletes a
client's consents and tokens (`revokeConnectedApp`,
`src/server/services/connected-apps.ts:147-192`). `pruneAbandonedClients`
(lines 261-283, run from `src/server/api.ts:731-740` at most every 10 minutes)
then deletes any anonymous client older than a day that has neither. A revoked
ChatGPT client disappears, and its next sign-in fails with `invalid_client`.

- Change: keep a client that has ever held consent or a token, for example with
  a timestamp set at its first consent, because revoking deletes the rows the
  sweep looks for.

Status: verified in source.

### 14. Tool text that reads as moving money

Recommended for Claude and OpenAI. Claude's review criteria don't accept
connectors that "Transfer money, cryptocurrency, or other financial assets",
OpenAI's guidelines ban "Execution of money transfers", and both scan tool text
automatically. Three tool descriptions in `src/server/mcp.ts`, and one
input-schema description in `src/shared/domain.ts` that `tools/list` publishes
for four tools, could read that way:

| Tool | Where | Text today |
| --- | --- | --- |
| `create_transaction` | `mcp.ts:1976` | "Directly commit a deposit, withdrawal, or transfer." and "...only once you are satisfied the two really are separate payments." |
| `archive_account` | `mcp.ts:1638` | "This moves money in the books, so confirm it with the person first." |
| `commit_staged_transactions` | `mcp.ts:2066` | "Committing puts money in the books" |
| `create_transaction`, `update_transaction`, `create_recurrence`, `update_recurrence` | `domain.ts:637`, `652`, `3000` and `3015` (`fromAccountId`) | "A transfer's two sides must differ, so moving money within one account is refused." |

- Change: say that these record bookkeeping entries and move no real money,
  for example "Records a deposit, withdrawal or transfer in the person's
  ledger. It's a bookkeeping entry and moves no real money." Say
  "transactions" instead of "payments", as [copy.md](copy.md#words-to-avoid)
  does, and "A transfer's two accounts must differ." in the schema text.
- Unconfirmed: whether either scan flags today's wording. The OpenAI portal's
  **Issues** list and Claude's review feedback would say.

Status: verified text.

### 34. Upgrade wording in refusals to agents

Recommended for OpenAI, whose guidelines say plugins "must not display
subscription plans, initiate new subscriptions, or promote upgrades", though
they may explain "that a certain feature is not available with the user's
current plan or entitlement". The skill tells the assistant to relay a frozen
account's reason, and two refusals written for agents point at a bigger plan:

| Refusal | Where | Text today |
| --- | --- | --- |
| A frozen account | `src/server/services/accounts.ts:864` | "...or the person upgrades from a browser." |
| The plan's account limit, from `create_account` | `src/server/services/accounts.ts:736-737` | "Only the person who owns it can raise that, from Settings in the browser." |

- Change: keep the limit and what frees a place, archiving or deleting an
  account in use, and drop the way to a bigger plan. MCP sends these agent
  messages in place of the browser's (`src/server/mcp.ts:293`), so the
  browser's own wording at `src/shared/domain.ts:3662-3663` and `4019` can
  stay.

Status: verified in source.

### 37. Annotations a reviewer may question

Recommended for OpenAI. Every tool's annotations follow OpenAI's rules, and
[annotation-justifications.md](annotation-justifications.md#points-a-reviewer-may-question)
explains the side effects a strict reviewer could catch. One is worth deciding
before the first submission: `create_transaction` is additive, so its
`destructiveHint` is false. It adds a committed entry and changes none, but
the entry changes balances, OpenAI's guidelines treat irreversible transactions
as destructive, and the description opens "Directly commit".
`commit_staged_transactions`, which posts the same kind of entry from the
review queue, is destructive because the staged rows leave the queue for good.

- Decide: keep `false`, the default here. The tool overwrites and deletes
  nothing and moves no money, and item 14's rewording says so. If a review
  flags it, appeal or change it then. The alternative is `true`, which costs
  little in ChatGPT, since it asks before every write anyway, but makes Codex
  ask before every call. That needs an app release, a rescan and
  `npm run sync-tools`, and its justification here changes too.
- Also: `create_transaction_template`'s description says a category name
  creates the category when nothing matches. The tool stores the name as text,
  and the category is created only when an entry is made from the template
  (`src/server/services/transaction-templates.ts:734-787`). Correct the
  description, so the scan reads what the tool does.

Status: decide.

### 15. `scope` in the first 401

Recommended. An unauthenticated call to `/mcp` gets a 401 whose
`WWW-Authenticate` names only `resource_metadata`. A client that takes its
scopes from that challenge, or sends none, gets Better Auth's default,
`openid profile email ledger:read` (`src/server/auth.ts:277`): the 37 read
tools and no refresh token, because refresh tokens need `offline_access`.

- Docker's open-source gateway reads only the challenge's `scope` or a `scopes`
  field in the protected-resource metadata, so Docker users likely connect
  read-only (inferred from Docker's code, untested).
- Claude Code, with no `oauth.scopes` pinned, "doesn't request the full
  `scopes_supported` catalog", so it may get the read-only default too, and so
  may this repository's plugin, whose `.mcp.json` pins nothing. Item 11
  confirms it.
- The MCP 2025-11-25 authorization spec says servers SHOULD include `scope` in
  `WWW-Authenticate`.

Change: in `mcpTransport` (`src/server/api.ts:1124-1134`, where the 401 from
`withMcpAuth` is rewrapped), set `WWW-Authenticate` to
`Bearer resource_metadata="…", scope="…"`. The value is a product decision:

- `openid profile email offline_access ledger:read ledger:stage ledger:write`
  matches what spec-following clients request today. Recommended: those
  clients, claude.ai among them, request what a challenge names, so a narrower
  value makes Claude's tool sync see fewer than 77 tools. The cost: the consent
  screen grants all of a request or none of it, so every client that follows
  the challenge gets write access, and the site's advice to ask for
  `ledger:stage` (`content/docs/agents-and-mcp.md:77-80` in simple-balance-web)
  works only in clients that let a person set the scopes.
- `openid profile email offline_access ledger:read ledger:stage` relies on the
  existing step-up to `ledger:write` (`src/server/mcp.ts:2086` and
  `2103-2174`). It's the behavior change the comment at
  `src/server/api.ts:960-987` deferred.

Status: verified live: `www-authenticate: Bearer
resource_metadata="https://app.smpl.money/api/auth/.well-known/oauth-protected-resource"`.

### 16. Redirect host on the consent screen

Recommended for Claude and OpenAI. Claude's authentication guide asks servers
to display the redirect URI's hostname on the consent screen, and the MCP
authorization spec makes it a MUST for metadata-document clients. With open
registration and no redirect allowlist, any client can call itself "Claude",
and the screen names only the client. It doesn't name the signed-in account
either, so in a browser still signed in to your own account at app.smpl.money,
a portal or test client you connect for the reviewer account is granted your
own ledger.

- Change: return the redirect host from `GET /api/auth/oauth2/consent-request`
  (`src/server/api.ts:878-915`). The stored request that `pendingConsent`
  parses (lines 840-867) already holds `redirectURI`. Return the signed-in
  account's email too, from the session the route reads at line 879. Show both
  in `OAuthConsent` (`src/client/App.tsx:646-737`) beside the sentence at lines
  702-705, with a note when the host is a loopback address, which means a
  client on the person's own machine.

Status: verified: the endpoint returns `clientId`, `clientName` and `scopes`
only.

### 17. Revoke the presented refresh token

Recommended for Claude. Claude's authentication guide asks a server that
rotates public clients' refresh tokens to return the new one "in the same
response that invalidates the old one". Better Auth 1.6.33's refresh grant
writes a new token row and leaves the presented refresh token valid until its
own expiry, seven days after it was issued.

- Change: after a successful `refresh_token` grant, delete the row holding the
  presented token in the `/api/auth/mcp/token` wrapper
  (`src/server/api.ts:763-781`), or upgrade Better Auth if a later version does
  it.

Status: verified in `better-auth@1.6.33` `dist/plugins/mcp/index.mjs` (the
refresh branch creates a row and deletes none) and in the wrapper, which only
re-signs tokens.

### 18. `annotations.title` on every tool

Recommended for Claude. The Claude portal flags tools missing a title or
annotations. Simple Balance sets `Tool.title`, and the shared annotation
objects (`src/server/mcp.ts:345-369`) carry no `title`. Which field the portal
reads is unconfirmed until its **Tools** step shows any flags; setting both
costs nothing.

- Change: copy each tool's `title` into its annotations inside the
  `registerTool` wrapper (`src/server/mcp.ts:626-657`) by passing a new
  object:
  `register(name, { ...config, annotations: { ...config.annotations, title: config.title } }, measured)`.
  The presets are shared (37 registrations pass `readAnnotations`, and
  `unrecoverableAnnotations` is `destructiveAnnotations`), so assigning
  `config.annotations.title` would give every tool on a preset the last title
  registered. Doing it in the wrapper keeps every registration's
  `annotations: <preset>` form, which this repository's
  `scripts/sync-tools.mjs` parses.

Status: verified.

### 19. Bounded tool results

Recommended for Claude. Claude Code caps a tool result at 25,000 tokens
(`MAX_MCP_OUTPUT_TOKENS`) and claude.ai at about 150,000 characters, and the
directory policy asks for frugal output.

- `export_transactions_csv` returns the whole filtered set
  (`src/server/mcp.ts:1069-1092`).
- `get_account_register` allows up to 10,000 postings
  (`src/server/mcp.ts:1057-1068`; `MAX_REGISTER_ENTRIES` at
  `src/shared/domain.ts:2046`).
- Every result is sent twice, as `structuredContent` and as a JSON text copy
  (`toolResult`, `src/server/mcp.ts:258-272`).

Change: page or cap the first two. Status: verified in source.

### 23. Smaller `tools/list`

Required only if the ChatGPT check in item 11 fails. At `ledger:write`,
`tools/list` is 497,153 characters, about 124,000 tokens, and 46% of it is
output schemas (`docs/standards/mcp.md:570-580`, held by
`tests/mcp-measurements.test.ts`). OpenAI documents no limit. A January 2026
community post quotes "All tools (including name, description, and input
schema) must be less than 5000 tokens" (unconfirmed).

- Change if needed: slim the output schemas
  (`src/server/mcp-output-schemas.ts`) or split tools (`src/server/mcp.ts`).

Status: measured by the app; untested in ChatGPT.

### 24. First 512 characters of the server instructions

Optional, for OpenAI, whose MCP server guide says: "Keep the most important
details in the first 512 characters." Today those characters end at "Reading
is free. Writing is not:". The staging guidance, the scope sentence and the
delete warning come after, and the instructions never say that Simple Balance
moves no money.

- Where: the `instructions` array, `src/server/mcp.ts:573-609`.

Status: verified, counted from the source.

### 25. UserInfo endpoint

Optional. OpenAI's guide for bringing a Claude plugin over says an OAuth plugin
should expose a UserInfo endpoint that returns `email` and
`email_verified: true`. Its authentication guide says the endpoint "is required
for workspace domain restrictions", which ChatGPT Enterprise workspaces use to
keep a corporate identity from linking the plugin outside the organization.
`src/server/api.ts:1010-1014` deletes `userinfo_endpoint` from discovery
because Better Auth's MCP plugin never registers the route.

- Change: add the route, for example `GET /api/auth/mcp/userinfo` for the
  bearer token's user, and stop deleting the field. Register it above the
  `/api/auth/*` catch-all at line 959, or Better Auth answers first, and accept
  only the audience-bound JWT, through `unwrapMcpAccessToken`, never the opaque
  token (lines 795-800 say why). Above the catch-all too, answer Better Auth's
  own `/api/auth/.well-known/oauth-authorization-server` with
  `authorizationServerMetadata`, the way line 958 does for the
  protected-resource document.

Status: verified live: the root discovery documents omit `userinfo_endpoint`,
and `/api/auth/mcp/userinfo` answers 404. Better Auth's
`/api/auth/.well-known/oauth-authorization-server`, served through the
catch-all, still advertises that endpoint, all three token auth methods and no
ledger scopes. Standard discovery reads the root documents instead.

### 26. CORS on `OPTIONS /mcp`

Optional. A browser-hosted client sends a preflight first. Today
`OPTIONS /mcp` gets the same 401 as any unauthenticated call, with no
`Access-Control-Allow-Origin`, so a browser can't call `/mcp`. Desktop clients
aren't affected. Whether VS Code for the Web calls remote servers from the
browser is unconfirmed; adding the server at vscode.dev would show it.

- Where: the `/mcp` routes at `src/server/api.ts:1070-1071`; answer `OPTIONS`
  before `mcpTransport`.

Status: verified live.

### 27. Client ID metadata documents

Optional, later. MCP 2026-07-28 deprecates dynamic client registration in favor
of Client ID Metadata Documents. Claude's recommended option,
**Use Claude's published identity**, works only when the metadata advertises
`client_id_metadata_document_supported`, and Codex and VS Code use a metadata
document when it's advertised.

- Where: the MCP plugin in `src/server/auth.ts:266-293` and the metadata at
  `src/server/api.ts:1006-1016`. The app pins `better-auth` 1.6.33
  (`package.json`) and uses its `mcp` plugin. Better Auth publishes CIMD
  support as `@better-auth/cimd`, from 1.7.0, and its npm peer dependencies
  are Better Auth 1.7 and the `@better-auth/oauth-provider` plugin, so
  adopting it means upgrading and adding that plugin. Whether it works with
  the app's `mcp` plugin is unconfirmed.

Status: verified not advertised.

### 28. Rate-limit rules for Anthropic's traffic

Optional, later. Better Auth's rate limiter is on in production, stored in the
database, and counts per client address (`src/server/auth.ts:127-131`).
Anthropic sends its outbound requests from 160.79.104.0/21, so registrations,
token exchanges and refreshes for every claude.ai user come from one address
range and count against the same few limits. The app sets no rules of its own,
and the MCP plugin in 1.6.33 adds none, so `/mcp/register` and `/mcp/token`
get Better Auth's documented default: 100 requests per 10 seconds for each
address.

- Change, once traffic warrants: per-path rules for `/mcp/token` and
  `/mcp/register`.

Status: verified enabled.

### 29. Tool output fields

Recommended before the first OpenAI submission. OpenAI's review page lists
undisclosed user data in tool results among its common rejection reasons, and
asks plugins to drop internal identifiers, timestamps and internal account IDs
a request doesn't need. `whoami` returns the person's name and email, the
client id, the plan, the account limit and the scopes
(`src/server/mcp.ts:812-843`).

- Change: check each returned field against https://smpl.money/privacy/, and
  drop what no request needs. [openai.md, What to check](openai.md#what-to-check)
  item 7 checks the results in ChatGPT.

Status: not audited.

### 30. Anonymous `initialize`

Optional, and a product and security decision. Every unauthenticated request
gets 401 (`withMcpAuth` gates `mcpTransport`, `src/server/api.ts:1073-1135`).
Checkers that don't sign in can't complete `initialize`: MCP.so scores
protocol at 15 of 100 points, and Glama's health check needs a test profile
(item 20). Awesome Remote's CI accepts the 401 as OAuth.

Status: verified live.

## Website

[thtmnisamnstr/simple-balance-web](https://github.com/thtmnisamnstr/simple-balance-web),
a static export that Netlify publishes from `out/` (`netlify.toml`).

### 7. Claude setup, examples and troubleshooting in the docs

Required for the Claude connector by its publish date. Claude's directory
policy asks for public documentation of setup, usage and troubleshooting (3.C)
and at least three working example prompts (3.E); the review criteria accept a
help article. The listing's documentation URL is
https://smpl.money/docs/agents-and-mcp/, built from
`content/docs/agents-and-mcp.md`:

- Lines 45-53: the JSON sample has no `"type"`. Claude Code reads an entry with
  a `url` and no `type` as a stdio server and skips it, so a reader who pastes
  the sample into `.mcp.json` gets no server. Add a Claude Code block, the
  `claude mcp add` command from the [README](../README.md#claude-code), and say
  that a JSON entry for Claude Code needs `"type": "http"`. Whether every other
  client accepts `"type": "http"` in the generic sample is unconfirmed, so a
  separate block is the safer edit.
- After line 80, the end of "Connecting one": a Claude section with the
  custom-connector steps from the [README](../README.md#claude-claudeai-claude-desktop-mobile);
  at least three example prompts, such as the three `defaultPrompt` entries in
  `plugin/plugin.json`; and troubleshooting for the browser not opening, a tool
  missing because it's outside the grant, reconnecting with a wider scope,
  revoking a connection and a frozen account.
- Line 6: update `updated:`.

[claude-directory.md](claude-directory.md) has the alternative of pointing the listing at this
repository's README instead. Status: verified at `297ac53`: no Claude section,
no example prompts, no troubleshooting.

### 33. Publisher named on every listing URL

Required for OpenAI: "Public URLs must be accessible and identify the same
publisher as the submission." The publisher is the identity verified in item
4, Gavin Johnson, and the listing's four URLs come from `plugin/plugin.json`.
Only https://smpl.money/privacy/ names him, as data controller. The home page
(`websiteURL`), the FAQ (`supportURL`) and the terms (`termsOfServiceURL`)
don't, and the terms' Contact section reads only "info@smpl.money."

- Change: add a footer line naming him as the operator, in the `footer-legal`
  block of `src/components/site-footer.tsx` (lines 27-31), which every page
  carries. Name him in the terms' opening paragraph or their Contact section
  too (`terms` in `src/content/legal.ts`, lines 864-869 or 1139-1142), from
  the `operator` constant the privacy policy already uses (lines 23-27), and
  bump `legalUpdated` (line 21).
- Check: `curl -s https://smpl.money/terms/ | grep -c 'Gavin Johnson'` prints
  1 or more, and so do https://smpl.money/ and
  https://smpl.money/docs/frequently-asked-questions/.

Status: verified live: all three print 0, and the privacy policy prints 1.

### 35. Stored write responses in the privacy policy

Recommended for Claude and OpenAI. Every create, commit and bulk write stores
a copy of its response, so a retried request gets the same answer
(`docs/deployment.md:76`; the `idempotency_record` table,
`src/server/db/schema.ts:897-917`). The copies are deleted with the account,
and until then they're kept unless the deployment sets
`IDEMPOTENCY_RETENTION_HOURS`. https://smpl.money/privacy/ doesn't mention
them, while the data-handling answer in
[claude-directory.md](claude-directory.md#7-data-handling) does, and OpenAI's
review requirements suggest a policy that "explicitly discloses all categories
of personal data you collect, process, or return and why".

- Change: describe them under "What the application collects", after
  **Operational records.** (`src/content/legal.ts:172-174`), and say how long
  they're kept under "Where it is held, and for how long" (line 622). Bump
  `legalUpdated` (line 21).

Status: verified: the policy names server logs, the history of changes and
billing requests, and not these copies.

### 31. `/support/` page

Optional. OpenAI's `supportURL`, Claude's support contact and Cursor's
Publisher Terms (4.4, end-user support) need a support channel. The listings
use https://smpl.money/docs/frequently-asked-questions/, whose "How do I get
help?" section (`content/docs/frequently-asked-questions.md:119-121`) gives
info@smpl.money. A `/support/` page would read as support at a glance.

- Where: a new `src/app/support/page.tsx`, beside `src/app/privacy/` and
  `src/app/terms/`.
- Then: change `supportURL` in `plugin/plugin.json` and `supportUrl` in
  `plugin/.claude-plugin/plugin.json`. A changed OpenAI listing needs a new ZIP
  and a new review, so decide before the first OpenAI submission.

Status: verified: https://smpl.money/support/ answers 404.

### 32. HTTP proof file for the registry

Optional, and only if the TXT record (item 1) can't be used. The registry also
accepts `https://smpl.money/.well-known/mcp-registry-auth` answering 200 with
the same `v=MCPv1; k=ed25519; p=<PUBLIC_KEY>` line. It doesn't follow
redirects, reads at most 4,096 bytes and waits 10 seconds.

- Where: `public/.well-known/mcp-registry-auth`, and optionally a `[[headers]]`
  rule in `netlify.toml` for `Content-Type: text/plain`.
- Also: [`release.yml`](../.github/workflows/release.yml) logs in with
  `mcp-publisher login dns`; this proof needs `login http`.
- Unconfirmed: whether the static export (`output: "export"` in
  `next.config.mjs`) copies `public/.well-known/` into `out/`. After a deploy,
  check with
  `curl -sS -A 'mcp-registry/1.0' -H 'Accept: text/plain' https://smpl.money/.well-known/mcp-registry-auth`.

Status: verified 404.

## DNS

smpl.money, on Cloudflare (`ada.ns.cloudflare.com`, `zahir.ns.cloudflare.com`,
verified).

### 1. Registry TXT record

Required for the MCP Registry, and through it for every listing that reads the
registry. Steps: [mcp-registry.md](mcp-registry.md#1-generate-the-signing-key),
steps 1 and 2.

Status: verified missing. The apex holds only `google-site-verification=…` and
`v=spf1 include:_spf.mx.cloudflare.net ~all`. The fallback name,
`io.github.thtmnisamnstr/simple-balance`, needs no DNS.

### 21. Glama claim record

Recommended, once the connector page exists: claiming unlocks the test profile
(item 20). Steps: [mcp-registry.md](mcp-registry.md#glama), step 3. The
alternative to the record is a `glama.json` file: on app.smpl.money it needs a
route above the catch-all at `src/server/api.ts:1049`, and on smpl.money a
`public/.well-known/glama.json` in simple-balance-web.

Status: verified missing for `_glama-claim.smpl.money` and
`_glama-claim.app.smpl.money`.

## GitHub settings

This repository and the `thtmnisamnstr` account.

### 2. Registry publishing environment and secret

Required for the MCP Registry: the `publish-registry` job in
[`release.yml`](../.github/workflows/release.yml) logs in with the secret
`MCP_REGISTRY_PRIVATE_KEY` from the environment `mcp-registry`. Steps:
[mcp-registry.md](mcp-registry.md#3-create-the-mcp-registry-environment-and-secret),
step 3.

Status: verified missing: the repository has no environments
(`gh api repos/thtmnisamnstr/simple-balance-mcp-connectors/environments`).

### 10. Star on the Awesome Remote repository

Required for the Awesome Remote pull request: its CONTRIBUTING file says PRs
aren't merged unless the account opening them has starred the repository.
Steps: [awesome-remote/README.md](awesome-remote/README.md#order), step 3.

Status: verified not starred by `thtmnisamnstr`
(`gh api user/starred/punkpeye/awesome-remote-mcp-servers` answers 404).

### 22. Gemini CLI topic and the About fields

Recommended for Gemini CLI's gallery, whose crawler finds extensions by the
`gemini-cli-extension` topic, and for MCP.Directory, which reads the
repository's description. Steps:
[gemini-cli.md](gemini-cli.md#1-set-the-about-fields-and-topics), step 1.

Status: verified empty: no description, no homepage, no topics.

## Accounts and recordings

### 3. Reviewer test account

Required for OpenAI, whose reviewers need "a fully featured demo account that
includes sample data"; for Claude, whose policy (3.D) asks for "a standard
testing account with sample data"; and for Docker, whose reviewers get
credentials through a Google Form. Every portal that connects to the server
itself, such as OpenAI's **MCPs** > **Connect** and Claude's **Connection**
step, should sign in with it too, so its scan sees all 77 tools and none of
your own ledger. [reviewer-account.md](reviewer-account.md) covers creating,
seeding and handing it over.

Status: not created.

### 4. OpenAI organization and identity verification

Required for OpenAI: "Publishing under an unverified individual or business
name will result in rejection." Steps: [openai.md](openai.md#before-you-start),
steps 1 to 3.

Verification needs an original, physical government ID and a device that can
photograph it, and sometimes a selfie. Scans, screenshots and digital IDs are
refused, and no fee is mentioned. A person can verify only one organization, so
if you've verified another one, such as an employer's, this one may be blocked
(OpenAI Help Center, archived 2026-10-12; recheck it on the settings page).

Status: unknown.

### 6. Paid Claude plan

Required for both Claude directory listings: "Anyone on a paid Claude plan can
submit." Steps: [claude-directory.md](claude-directory.md#before-you-submit),
step 2.

Status: unknown.

### 8. Demo recording

Required for OpenAI: final submission needs "a demo-recording URL that shows
the main use cases and tools across supported platforms". Steps:
[demo-video.md](demo-video.md). It needs the reviewer account (item 3), a
ChatGPT plan that runs write tools or Codex for the write cases, and an
unlisted video host. Recording runs the fourth and fifth test cases, so
[refresh the reviewer account](reviewer-account.md#refresh-before-each-review)
afterward.

Status: not recorded.

### 36. Mail from gavin@ and info@smpl.money

Recommended for every listing. `gavin@smpl.money` is the contact on the
Claude, Cursor and Docker submissions, and the guides send mail as it or as
`info@smpl.money`: MCP.Directory, for one, wants mail from the endpoint's
domain. smpl.money's mail goes through Cloudflare Email Routing, which
forwards what it receives but doesn't send as these addresses. SPF allows only
Cloudflare's routing servers, and there's no DMARC record.

- Check: from an outside mailbox, send a message to each address and confirm
  it arrives.
- Change: to send as them, add a sending service for smpl.money, such as your
  mail provider's send-as feature, and publish its SPF include and DKIM
  records. Send a test to an outside mailbox and confirm the headers show SPF
  and DKIM passing. A DMARC record, starting at `p=none`, helps delivery.

Status: verified DNS (MX, SPF, no `_dmarc`); delivery untested.

### 9. Cursor account

Required for the Cursor Marketplace, whose publisher form needs a signed-in
Cursor account. Steps: [cursor.md](cursor.md#apply-to-the-cursor-marketplace).

Status: unknown.

### 20. Glama account and test profile

Recommended for Glama. Without a test profile, the OAuth-only connector fails
Glama's health check, shows **Unhealthy**, lists no tools and stays out of
Glama's search. The profile needs a separate, empty Simple Balance account, not
the reviewer account. Steps: [mcp-registry.md](mcp-registry.md#glama), step 4,
which also gives the scope to use.

Status: the connector page answers 404 until the registry entry exists
(verified).

## Clients

### 11. Checks that need a live sign-in

Required before the OpenAI and Claude submissions, recommended before the
others. OpenAI says to run each test case with the test account before
submitting, and Claude's form asks you to confirm you ran every tool. These
need a real account and `POST` requests, so none has been run. Use the
reviewer account, from a browser that isn't signed in to your own account at
app.smpl.money (item 16), then revoke each client under **Settings** >
**Connected agents**. The platform guides have the steps.

| Client | Check | What it settles |
| --- | --- | --- |
| ChatGPT, **Add custom MCP server** | The consent screen lists `ledger:write`, all 77 tools load, and the eight test cases behave | Whether the 124,000-token `tools/list` loads (item 23) and the `resource` parameter ChatGPT sends is accepted |
| Claude Code, `claude mcp add` with no `oauth.scopes` | `whoami` lists `ledger:write` | Whether Claude Code gets the read-only default (item 15) |
| claude.ai custom connector | It connects and every tool runs | Claude's limits: discovery, registration and token answers within 10 seconds, refresh within 30 |
| Cursor | Sign-in succeeds, **Connected agents** shows **Read, stage, and commit**, and it still works after the one-hour access token expires | The RFC 8707 `resource` parameter, the scopes Cursor asks for, and refresh |
| Gemini CLI | The extension signs in and lists tools | The `resource` parameter |
| Cline 4.1.26 | **Authenticate** works, the consent screen names Cline, and refresh works | End-to-end OAuth |
| Docker | Which scopes the consent screen lists | Whether Docker's gateway sends none (item 15) |
| Codex plugin install | `whoami` lists the ledger scopes | If not, the fallback is `codex mcp login simple-balance --scopes openid,profile,email,offline_access,ledger:read,ledger:stage,ledger:write` |

Which ChatGPT plans can add a custom MCP server with write tools is
unconfirmed; [openai.md](openai.md#before-you-start) quotes OpenAI's Help
Center on it.

## Not needed

- Smithery: it shut down submissions on 2026-10-31, so app.smpl.money needs no
  server card or `/.well-known/mcp-config` for it.
- PulseMCP: submissions have been paused since September 2026. It picks up the
  registry entry (item 1) when it reopens.
- A Claude Desktop extension: the directory no longer takes local servers
  packaged as MCPB, and this server is remote.

## Sources

- OpenAI: [submission](https://developers.openai.com/plugins/deploy/submission),
  [submission errors](https://developers.openai.com/plugins/deploy/submission-errors),
  [review requirements](https://developers.openai.com/plugins/deploy/app-review),
  [MCP server guide](https://developers.openai.com/plugins/build/mcp-server),
  [authentication](https://developers.openai.com/plugins/build/auth),
  [troubleshooting](https://developers.openai.com/plugins/deploy/troubleshooting),
  [Claude plugin guide](https://developers.openai.com/plugins/guides/submit-claude-plugin),
  [guidelines](https://developers.openai.com/plugins/plugin-guidelines),
  [5,000-token report](https://community.openai.com/t/token-limit-when-connecting-chatgpt-with-external-mcp/1371022)
- Anthropic: [authentication](https://claude.com/docs/connectors/building/authentication),
  [limits](https://claude.com/docs/connectors/building/index),
  [review criteria](https://claude.com/docs/connectors/building/review-criteria),
  [publishing](https://claude.com/docs/directory/publish),
  [Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy),
  [Claude Code MCP](https://code.claude.com/docs/en/mcp),
  [IP addresses](https://platform.claude.com/docs/en/api/ip-addresses)
- MCP: [authorization, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization),
  [changelog, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog),
  [registry authentication](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx)
- Directories: [Docker gateway scopes](https://github.com/docker/mcp-gateway-oauth-helpers/blob/main/types.go),
  [Glama FAQ](https://glama.ai/mcp/faq),
  [Glama methodology](https://glama.ai/mcp/methodology),
  [Cursor publisher form](https://cursor.com/marketplace/publish),
  [Cursor Publisher Terms](https://cursor.com/marketplace-publisher-terms),
  [Gemini CLI releasing](https://geminicli.com/docs/extensions/releasing/),
  [Awesome Remote contributing](https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/CONTRIBUTING.md),
  [Smithery](https://www.smithery.ai/future),
  [PulseMCP](https://www.pulsemcp.com/submit)
- Better Auth: [1.6.33 `dist/plugins/mcp/index.mjs`](https://cdn.jsdelivr.net/npm/better-auth@1.6.33/dist/plugins/mcp/index.mjs),
  [rate limits](https://better-auth.com/docs/concepts/rate-limit),
  [`@better-auth/cimd`](https://www.npmjs.com/package/@better-auth/cimd)
