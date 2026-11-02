# Cline

Cline has two marketplaces, and both take submissions on GitHub:

| | Current catalog | Legacy marketplace |
| --- | --- | --- |
| Read by | The Cline 4.x extension (v4.0.0 from 2026-06-26; v4.1.26 is current) | The Cline 3.x extension, and the page at cline.bot/mcp-marketplace |
| How to submit | Pull request to [cline/marketplace](https://github.com/cline/marketplace) adding `registry/mcps/simple-balance/` | Issue form on [cline/mcp-marketplace](https://github.com/cline/mcp-marketplace) |
| What it takes | [`entry.json`](entry.json) and [`icon.png`](icon.png) from this folder | This repository's URL and a 400x400 PNG |
| How Cline installs it | Runs a fixed command: `cline mcp install simple-balance --transport http https://app.smpl.money/mcp` | Reads README.md and llms-install.md from the repository and sets the server up itself |
| Activity (2026-11-02) | 8 PRs merged ever, all by Cline staff, the last on 2026-09-18; 354 open | Last staff closure 2025-12-08; newest entry 2026-03-27 |

Open the pull request. File the legacy issue as well only if you want Cline 3.x
users. Both are public as soon as you create them. Where this listing stands
next to the others: [submissions/README.md](../README.md).

## What's in this folder

| File | What it is |
| --- | --- |
| [`entry.json`](entry.json) | The catalog entry, laid out as `registry/mcps/simple-balance/entry.json` in Cline's repository |
| [`icon.png`](icon.png) | The logo at 400x400, a copy of `assets/logo-400.png`. The catalog republishes it at `https://cline.github.io/marketplace/icons/mcp/simple-balance.png`, and the legacy form asks for this size. |
| `README.md` | This guide |

How the entry is set up:

- `id` `simple-balance` must equal the folder name in Cline's registry.
  `install.args` holds everything after `cline mcp install`:
  `["simple-balance", "--transport", "http", "https://app.smpl.money/mcp"]`, the
  shape Cline's CONTRIBUTING.md gives for a remote OAuth server. There's no
  `install.env`, because sign-in is OAuth in the browser.
- `tags` are `finance` and `productivity`, both ids from Cline's `tags.json`.
  An unknown tag fails their build.
- `verified` and `featured` stay `false`. CONTRIBUTING.md reserves `verified`
  for entries the Cline team has reviewed, and `npm run check` fails if it
  changes.
- `repo` and `license` name this repository and MIT, because it holds the setup
  guide and llms-install.md. Catalog entries more often name the server's source
  repository. If a reviewer asks for that, set `repo` to
  `https://github.com/thtmnisamnstr/simple-balance` and `license` to
  `AGPL-3.0` here, run `npm run check`, and push the same change to the PR.
- The description says "up to 77 tools". `npm run check` fails when that
  disagrees with [tools.json](../tools.json), so after `npm run sync-tools`
  changes the count, update it here and in the PR.
- `$schema` is `../../../schemas/mcp.schema.json`, which resolves inside
  cline/marketplace, not here. `npm run check` validates the entry against a
  copy of that schema pinned by hash.

## Before you submit

1. Release this repository as the [repository README](../../README.md#releasing)
   describes. Until the merge, `main` holds only `LICENSE`, so a reviewer who
   follows the entry's `repo` link, or Cline reading the legacy form's
   repository URL, finds no README.md or llms-install.md.
2. Make sure the `cline` job in [check.yml](../../.github/workflows/check.yml)
   passed. It copies this folder into cline/marketplace at commit `6969aa8`, the
   head of their `main` on 2026-11-02, and runs their own validator,
   `node scripts/generate.mjs --check`. To move the pin, change the `ref:` of
   that checkout.
3. Run the test below.

## Test in Cline

Use the Cline 4.1.26 extension or later in VS Code, and sign in with the test
account from [reviewer-account.md](../reviewer-account.md), so nothing touches
your own books. Nobody has run this end to end yet: each piece was checked
against Cline's source and the server's metadata, and what's unconfirmed is
whether app.smpl.money's token endpoint accepts the RFC 8707 `resource`
parameter that Cline's MCP SDK sends. Step 2 settles it.

1. In the Cline panel, choose **MCP Servers** (the stacked-servers icon in the
   top toolbar), open the **Remote Servers** tab and enter:

   | Field | Value |
   | --- | --- |
   | **Server Name** | `simple-balance` |
   | **Server URL** | `https://app.smpl.money/mcp` |
   | **Transport Type** | **Streamable HTTP** |

   Choose **Add Server**. Keep **Streamable HTTP**: a remote entry with no type
   falls back to SSE, which the server doesn't offer.

2. Choose **Authenticate** next to `simple-balance`. A browser opens at
   app.smpl.money; sign in. The **Allow this MCP client?** screen names `Cline`
   and lists seven scopes, `ledger:write` included, because Cline requests every
   scope the server advertises. It grants all of them or none. Choose
   **Allow access**. The browser returns to
   `http://127.0.0.1:<port>/mcp/oauth/callback` (ports 1456 to 1461), so use a
   browser on the machine running Cline.

   If the app adds a `scope` parameter to its 401
   ([prerequisites.md](../prerequisites.md)), Cline requests exactly the scopes
   it names instead. Without `ledger:write` in that list, Cline connections get
   no write tools.

3. Ask `What are my account balances right now?`

   Check: Cline asks you to approve the `list_accounts` call, and the balances
   match the **Accounts** page at app.smpl.money. In Simple Balance,
   **Settings** > **Connected agents** lists `Cline`.

4. Remove the test connection. Choose **MCP Servers**, open the **Configure**
   tab and choose **Configure MCP Servers**, delete the `simple-balance` entry
   from the JSON, and save. Then revoke `Cline` under **Settings** >
   **Connected agents** in Simple Balance. Cline keeps OAuth tokens, refresh
   tokens included, as plain JSON in
   `~/.cline/data/settings/cline_mcp_settings.json`, so don't leave a test
   entry behind.

5. Test [llms-install.md](../../llms-install.md). In a new Cline task, send:

   ```text
   Set up the MCP server from https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
   ```

   Check: Cline reads llms-install.md, clones and runs nothing, writes a
   `simple-balance` entry with `"type": "streamableHttp"` and an empty
   `autoApprove`, asks you to choose **Authenticate**, then calls `whoami` and
   `list_accounts` and changes nothing. This is the test the legacy form's first
   checkbox asks you to confirm.

6. Remove the connection and revoke `Cline` again, as in step 4.

Optional: the Cline CLI shares the settings file with the extension, so try it
after step 6.

```bash
cline mcp install simple-balance --transport http https://app.smpl.money/mcp --yes
```

Then run `cline mcp`, choose **Authorize OAuth** and pick `simple-balance`.
Afterward, remove it with `cline mcp remove simple-balance` and revoke `Cline`
again.

## What llms-install.md does

[llms-install.md](../../llms-install.md) at the repository root is written for
an agent, not a person. Cline reads it when it sets the server up from the
repository rather than from a catalog command:

- Cline 3.x's one-click install from the legacy marketplace hands the
  repository's README.md and llms-install.md to Cline as its setup
  instructions.
- A request such as the one in step 5 leads Cline to it in any version.
- Cline 4.x catalog installs run the fixed `install.args` command and don't
  read it.

It tells the agent that there's nothing to clone, build or run; never to ask for
an API key or add an `Authorization` header; to set `"type": "streamableHttp"`;
where the settings file is in Cline 4.x and 3.x; that only the person can sign
in; to check with `whoami` and `list_accounts` and change nothing; and to leave
`autoApprove` empty. Its CLI line uses `cline mcp add`, an alias of the
catalog's `cline mcp install`, so both write the same entry.

When the URL, transport or sign-in changes, edit it and run step 5 again.

## Open the pull request

Run these from the folder that holds your `simple-balance-mcp-connectors`
checkout. The fork, the pushed branch and the PR are all public.

1. Fork, clone and branch. `--fork-name` keeps the fork from appearing as a
   bare `thtmnisamnstr/marketplace`:

   ```bash
   gh repo fork cline/marketplace --clone --default-branch-only --fork-name cline-marketplace
   cd cline-marketplace
   git switch -c add-simple-balance
   ```

2. Copy the entry and run Cline's validator, which needs no `npm install`:

   ```bash
   mkdir -p registry/mcps/simple-balance
   cp ../simple-balance-mcp-connectors/submissions/cline/entry.json \
      ../simple-balance-mcp-connectors/submissions/cline/icon.png \
      registry/mcps/simple-balance/
   npm run validate
   ```

   Check: the last line is `Validation passed: 204 entries.` That's the 203 on
   their `main` plus this one, or more if Cline has merged others since. An
   error names a field. Fix it in this repository first, so `npm run check` and
   check.yml keep agreeing with what Cline has, then copy again.

3. Commit only the entry, and push:

   ```bash
   git add registry/mcps/simple-balance
   git commit -m "Add Simple Balance MCP server (remote, OAuth)"
   git push -u origin add-simple-balance
   ```

4. Save the [pull request description](#pull-request-description) to a file
   outside both repositories, such as `~/simple-balance-cline-pr.md`, and
   preview the PR. `--dry-run` prints what would be created and creates nothing:

   ```bash
   gh pr create --repo cline/marketplace --base main \
     --head thtmnisamnstr:add-simple-balance \
     --title "Add Simple Balance MCP server (remote, OAuth)" \
     --body-file ~/simple-balance-cline-pr.md --dry-run
   ```

5. If the preview is right, run the same command without `--dry-run`.

Check: `gh pr list --repo cline/marketplace --author @me` lists the PR, and its
**Files changed** tab shows exactly `registry/mcps/simple-balance/entry.json`
and `registry/mcps/simple-balance/icon.png`.

### Pull request description

Cline's repository has no PR template.

```markdown
## What this adds

`registry/mcps/simple-balance/` (`entry.json` and `icon.png`) for Simple Balance, a free budget app and spending tracker. Install: `cline mcp install simple-balance --transport http https://app.smpl.money/mcp`

## The server

- Remote Streamable HTTP endpoint at `https://app.smpl.money/mcp`. No API key and no `install.env`.
- OAuth 2.1: protected-resource metadata (RFC 9728), authorization-server metadata (RFC 8414), dynamic client registration (RFC 7591) for public clients, and PKCE S256. Registration accepts any redirect URI, so Cline's loopback callback on `127.0.0.1` works as is.
- Scopes `ledger:read`, `ledger:stage` and `ledger:write`. The consent screen lists the requested scopes and grants all of them or none, tools outside the grant are left out of `tools/list`, and the user can revoke the connection at any time.
- 77 tools, each with a title and `readOnlyHint`, `destructiveHint`, `idempotentHint` and `openWorldHint` annotations.
- Simple Balance doesn't connect to banks and can't move money. The free plan covers up to three active accounts.

## The entry

- Tags `finance` and `productivity`. Icon: a 400x400 PNG. `verified` and `featured` are `false`.
- `repo` and `license` point at https://github.com/thtmnisamnstr/simple-balance-mcp-connectors (MIT), which holds the setup guide and `llms-install.md`. The server's source is https://github.com/thtmnisamnstr/simple-balance (AGPL-3.0).
- Maintainer: Gavin Johnson, gavin@smpl.money. Docs: https://smpl.money/docs/agents-and-mcp/

## Validation

`npm run validate` (`node scripts/generate.mjs --check`) passes with this entry.
```

## File the legacy issue (optional)

This reaches only the Cline 3.x extension and the cline.bot page. File it after
test steps 5 and 6, because the form makes you confirm that Cline set the server
up from README.md or llms-install.md alone.

Open https://github.com/cline/mcp-marketplace/issues/new?template=mcp-server-submission.yml
and fill it in:

| Field | Value |
| --- | --- |
| **Title** | `[Server Submission]: Simple Balance`. The form fills in the prefix. |
| **GitHub Repository URL** | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` |
| **Logo Image** | Drag in `submissions/cline/icon.png`, the 400x400 PNG the form asks for. Or paste `https://raw.githubusercontent.com/thtmnisamnstr/simple-balance-mcp-connectors/main/assets/logo-400.png`, which works once this repository is on `main`. |
| **Installation Testing** | Check both boxes: "I have tested that Cline can successfully set up this server using only the README.md and/or llms-install.md file" and "The server is stable and ready for public use" |
| **Additional Information** | The text below |

The legacy README also asks for a reason for adding the server, which the form
has no field for, so the first paragraph covers it:

```text
Lets Cline ask about a person's accounts, spending and budgets in Simple Balance, a free budget app and spending tracker, and queue transactions for them to approve before anything counts. There's no automatic pull from a bank today, and Simple Balance can't move money.

Hosted remote server, so there is nothing to clone or run: Streamable HTTP at https://app.smpl.money/mcp, OAuth 2.1 with dynamic client registration and PKCE, no API key. Cline config: {"type": "streamableHttp", "url": "https://app.smpl.money/mcp"}, then press Authenticate. llms-install.md at the repository root walks Cline through it.

Server source (AGPL-3.0): https://github.com/thtmnisamnstr/simple-balance
Docs: https://smpl.money/docs/agents-and-mcp/
Maintainer: Gavin Johnson, gavin@smpl.money
```

Check: `gh issue list --repo cline/mcp-marketplace --author @me` lists the
issue with the `server-submission` label. Once Cline accepts it, the legacy
catalog includes it:

```bash
curl -s https://api.cline.bot/v1/mcp/marketplace | jq '.[] | select((.githubUrl // "") | test("simple-balance-mcp-connectors")) | {mcpId, name, createdAt}'
```

## After you submit

Expect a long wait, and possibly no answer.

- cline/marketplace was created on 2026-06-17. Eight PRs have merged, all
  opened and merged by Cline staff, the last on 2026-09-18. On 2026-11-02, 354
  were open and 20 closed unmerged. Community PRs such as
  [#277](https://github.com/cline/marketplace/pull/277), a remote OAuth server
  opened on 2026-10-18, show no reviews and no checks: Cline's validate workflow
  hasn't run on them. No review time is published, and the catalog was last
  generated on 2026-09-18.
- The legacy repository has 3,096 open issues. Its last staff closure was on
  2025-12-08 ([#539](https://github.com/cline/mcp-marketplace/issues/539)),
  though its README still says "within a couple of days".
- The legacy criteria weigh GitHub traction, prefer "established organizations
  and developers with verifiable professional backgrounds", and "apply increased
  scrutiny to projects in sensitive domains (such as financial services)".
  Simple Balance is a finance app from an individual maintainer, and neither of
  its repositories has a star yet. The new catalog's bar is "Entries should be
  high quality, maintained, and safe to install."

While you wait:

- Don't open a second PR or issue. To ask about review, post in the `#mcp`
  channel of the [Cline Discord](https://discord.gg/cline), which the legacy
  README names for help.
- If the entry changes while the PR is open, change it here first, then copy it
  and push. After a merge, the same change goes in a new PR.

  ```bash
  cd cline-marketplace
  cp ../simple-balance-mcp-connectors/submissions/cline/entry.json \
     ../simple-balance-mcp-connectors/submissions/cline/icon.png \
     registry/mcps/simple-balance/
  npm run validate
  git commit -am "Update Simple Balance entry"
  git push
  ```

- A release of this repository needs nothing here, because the entry has no
  version field.

Check, after a merge: the published catalog has the entry.

```bash
curl -s https://cline.github.io/marketplace/catalog.json | jq '.entries[] | select(.id=="simple-balance") | {id, icon, command: .install.command}'
```

It shows the icon at
`https://cline.github.io/marketplace/icons/mcp/simple-balance.png` and the
command `cline mcp install simple-balance --transport http https://app.smpl.money/mcp`.
Where the Cline 4.x extension shows catalog entries is unconfirmed; once the
catalog has the entry, look for Simple Balance in the extension's marketplace
view.

## Sources

- https://github.com/cline/marketplace/blob/main/README.md
- https://github.com/cline/marketplace/blob/main/CONTRIBUTING.md
- https://github.com/cline/marketplace/blob/main/schemas/common.schema.json
- https://github.com/cline/marketplace/blob/main/scripts/generate.mjs
- https://github.com/cline/marketplace/blob/main/.github/workflows/validate.yml
- https://github.com/cline/marketplace/pull/277
- https://cline.github.io/marketplace/catalog.json
- https://github.com/cline/cline/blob/v4.1.26/apps/vscode/src/core/controller/marketplace/marketplace-helpers.ts
- https://github.com/cline/cline/blob/v4.1.26/apps/vscode/src/services/mcp/McpOAuthManager.ts
- https://github.com/cline/cline/blob/main/apps/cli/src/main.ts
- https://github.com/cline/cline/blob/v3.38.0/src/core/controller/mcp/downloadMcp.ts
- https://github.com/modelcontextprotocol/typescript-sdk/blob/1.30.0/src/client/auth.ts
- https://docs.cline.bot/mcp/mcp-overview
- https://github.com/cline/mcp-marketplace/blob/main/README.md
- https://github.com/cline/mcp-marketplace/blob/main/.github/ISSUE_TEMPLATE/mcp-server-submission.yml
- https://github.com/cline/mcp-marketplace/issues/539
- https://api.cline.bot/v1/mcp/marketplace
- https://app.smpl.money/.well-known/oauth-protected-resource
