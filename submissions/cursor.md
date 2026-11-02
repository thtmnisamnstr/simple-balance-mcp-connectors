# Cursor

Cursor offers three routes. Only the Marketplace takes an application and a review by hand before listing.

| Route | What users get | What it takes |
| --- | --- | --- |
| Cursor Marketplace | The plugin (server and skill) at cursor.com/marketplace and in **Customize** | A publisher application, then Cursor's identity and code review |
| cursor.directory | A community listing of the plugin, its server and its skill, linked to this repository | A sign-in, the repository URL and an automated security scan |
| Install link | The MCP server alone, from the README's **Add to Cursor** badge | Nothing: it's already in the README and needs no listing |

## Test the plugin locally

Do this before you apply. Cursor's submission checklist asks for a plugin that "has been tested locally", and this test is how you learn which scopes Cursor asks for.

1. From the repository root, copy the plugin folder, dot files included:

   ```bash
   mkdir -p ~/.cursor/plugins/local/simple-balance
   cp -R plugin/. ~/.cursor/plugins/local/simple-balance/
   ```

   Copy rather than symlink: Cursor skips a symlink that points outside `~/.cursor/plugins/local`. The `plugin/.` form also copies `.cursor-plugin/` and `.mcp.json`, which `plugin/*` leaves behind.
2. Restart Cursor, or run **Developer: Reload Window**. On Enterprise, local plugins load only when an admin has turned on **Allow Local Plugin Imports**, which is off by default there.
3. Open **Customize** and confirm:
   - The plugin, **Simple Balance**.
   - Its MCP server. Cursor names a plugin's server `plugin-<plugin>-<server>`, so approval prompts show `plugin-simple-balance-simple-balance`.
   - The skill `simple-balance`, under **Agent Decides**. Typing `/simple-balance` in chat runs it.

   `plugin/` holds both a root `plugin.json` (Agent Plugin) and `.cursor-plugin/plugin.json` (Cursor Plugin). Which one Cursor reads when both exist is unconfirmed. Both name the same server and URL, so the server name above holds either way.
4. Sign in when Cursor asks. A browser opens at app.smpl.money: sign in, read the scopes on **Allow this MCP client?** and choose **Allow access**. If sign-in fails, open the **Output** panel (`Cmd+Shift+U`), choose **MCP Logs** and read the error. Unconfirmed: whether the server accepts the RFC 8707 `resource` parameter Cursor sends. A sign-in that completes confirms it.
5. In a new chat, send:

   ```text
   Use the Simple Balance tools to run whoami and list my accounts. Don't change anything.
   ```

   Check: both calls go to `plugin-simple-balance-simple-balance`, and `whoami` lists the granted scopes.
6. In Simple Balance, open **Settings > Connected agents**. Cursor's row shows what it got: **Read, stage, and commit** (`ledger:write`), **Read and queue for review** (`ledger:stage`) or **Read only** (`ledger:read`). **Read only** means Cursor asked for `ledger:read` alone or for no scope at all, which gets the server default, `openid profile email ledger:read`. That's the app prerequisite in [prerequisites.md](prerequisites.md). Which scopes Cursor's dynamic client registration requests is unconfirmed until you run this step.
7. Wait more than an hour, then send another request that calls a tool. An access token lasts 3600 seconds, the Better Auth default the app keeps.

   Check: if the call works without a browser, Cursor used a refresh token, and the **last token** time on **Connected agents** moves forward. If Cursor asks you to sign in again, it holds no refresh token. The server issues one only when `offline_access` is granted, so this is the same scope question as the previous step.

## Ask Cursor about the Premium plan

Publisher Terms 3.1 says you "will not charge Users any fees, whether directly or indirectly, for access to or use of a Plugin". The plugin is free, and Simple Balance's free plan has every feature for up to three active accounts. Premium ($3 a month or $30 a year) removes that limit and the ads. The terms don't say whether a paid plan on the service counts as an indirect fee, and submitting the application accepts the terms, so ask first. The publish page gives this address for questions:

```text
To: marketplace-publishing@cursor.com
Subject: Question before applying: a free plugin for a service with a paid plan

Hello,

I'd like to apply to list the Simple Balance plugin
(https://github.com/thtmnisamnstr/simple-balance-mcp-connectors). It connects
Cursor to Simple Balance (https://smpl.money/), a free budget app and spending tracker.

The plugin is free. Simple Balance's free plan gives you everything it does,
the MCP server included, for three accounts you can use at once. A paid Premium plan
($3 a month or $30 a year) removes that limit and the ads. The plugin sells
nothing and shows no prices.

Does that meet section 3.1 of the Publisher Terms?

Gavin Johnson
gavin@smpl.money
```

Check: keep the reply. If the answer is no, skip the application. cursor.directory and the install link don't depend on it.

## Apply to the Cursor Marketplace

Cursor pins a listing to the commit it reviews, so apply once `main` holds the release you want listed (see [Releasing](../README.md#releasing)). The logo URL below also resolves only after the merge.

1. Sign in at cursor.com with the account that should own the listing. Signed out, the page shows **Sign in to apply** instead of the form.
2. Open [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) (**Become a plugin publisher**) and fill in the form. Type the organization name first: the form copies it into the handle until you edit the handle.

   | Field | Value | Notes |
   | --- | --- | --- |
   | Organization name | `Gavin Johnson` | Required. The publisher name: the `author` in every manifest and the data controller in the privacy policy. |
   | Organization handle | `simple-balance` | Required. A unique namespace in kebab-case. Replace the `gavin-johnson` the form fills in. Whether it can change after approval is unconfirmed, so settle it now. |
   | Contact email | `gavin@smpl.money` | Required. It starts as your Cursor login email. Replace it, or Cursor's follow-up goes to that address. |
   | Logotype URL | `https://raw.githubusercontent.com/thtmnisamnstr/simple-balance-mcp-connectors/main/assets/logo-512.png` | Required. The hint asks for a "1:1 SVG or PNG with background plate", and the mark sits on its own green plate. Before the merge, use `https://smpl.money/favicon.svg`. |
   | Description | The block below this table | Optional. |
   | GitHub repository | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` | Required. The form accepts only `https://github.com/<org>/<repo>`, so a link to `plugin/` is refused. `.cursor-plugin/marketplace.json` at the root points Cursor to `plugin/`, as approved listings such as `naturalpay/agent-plugins` do. |
   | Owner | Read-only | **Individual** and your login email, or **Team** and your team. It follows the account you're signed in with. |
   | Website URL | `https://smpl.money/` | Optional. |

   ```text
   Connects Cursor to Simple Balance (https://smpl.money/), a budget app and spending tracker. The plugin adds one remote MCP server, https://app.smpl.money/mcp (Streamable HTTP; OAuth 2.1 with PKCE and dynamic client registration; no API key), and a skill that tells the agent to queue new transactions for the user to approve unless asked for a specific change. The agent reads the same records the user does, and the user decides how far it goes: reading only (ledger:read), queuing transactions or a bank statement file for approval (ledger:stage), or making the change itself (ledger:write). All 77 tools carry titles and read-only or destructive hints. There's no automatic pull from the user's bank today, and Simple Balance can't move money.
   ```

3. Choose **Submit Application**. That accepts the [Publisher Terms](https://cursor.com/marketplace-publisher-terms), last updated May 6, 2026.

   Check: the page changes to **Thanks for applying** and reads "We've received your submission. We'll follow up at marketplace-publishing@cursor.com once we review your plugin."
4. Answer Cursor's questions by email. Cursor verifies your identity and business legitimacy and reviews the plugin's code. It publishes no timeline and gives no reasons for a rejection. If a reviewer wants to try the server, reply with the account described in [reviewer-account.md](reviewer-account.md). Never put its credentials in the repository.
5. After approval, search for Simple Balance at [cursor.com/marketplace](https://cursor.com/marketplace) and in **Customize**, install it, and repeat the sign-in and **Connected agents** checks from the local test.

   Check: the installed plugin is the listing, not your test copy. A Marketplace install takes precedence over a local copy with the same name.

Approval isn't assured. Cursor says it keeps the marketplace curated and works "with a small group of trusted partners". Still, on 2026-11-02, 107 of the 491 plugins on cursor.com/marketplace came from publishers owned by an individual account (`isUserOwned` in the page's data).

## Publisher Terms that matter

| Section | What it requires | Where Simple Balance stands |
| --- | --- | --- |
| 3.1 | The plugin is free to users, with no direct or indirect fees | Free. Ask about Premium first (above). |
| 3.3 | Only permissive open-source licenses in a plugin; no GPL, AGPL or LGPL | `plugin/LICENSE` is MIT, and `npm run check` fails if it differs from the root `LICENSE`. The app is AGPL-3.0, so never copy its code into `plugin/`. The plugin names the hosted server by URL and holds none of its code. |
| 4.2 | Terms of service and privacy policy visible to users | `plugin/README.md` links https://smpl.money/terms/ and https://smpl.money/privacy/. |
| 4.4 | You support the plugin's users | `plugin/README.md` links the FAQ and info@smpl.money. |
| 4.5 | Accurate descriptions and no unsubstantiated claims | Keep the description to what the server does. |
| 4.6 | Call the product "Cursor", never "Cursor AI" or "Cursor Code" | The manifests, READMEs and listing copy say "Cursor" only (checked 2026-11-02). |
| 4.3 | Report any vulnerability, breach or security incident affecting the plugin or its data to legal@cursor.com, promptly | Nothing to set up. Know the address. |
| 4.7 and 6.3 | Collect only what the plugin needs, don't sell or transfer that data, and don't train models on it | The privacy policy shares data only with the providers that run the service and an assistant the user connects. It doesn't mention model training. |
| 7.2 | Ask for removal in writing at legal@cursor.com | Nothing to set up. |

## Updates

A listing stays on the commit Cursor reviewed; the marketplace's page data records it as `gitRef`. Pushing to `main` changes nothing there. Cursor reviews every update by hand, after you ask it to re-index (Publisher Terms 2.1).

1. Release as usual (see [Releasing](../README.md#releasing)). `npm run set-version` moves `plugin/.cursor-plugin/plugin.json` with the other manifests, because Cursor's own checks fail when the manifests' versions disagree.
2. Get the release commit with `git rev-parse 'vX.Y.Z^{commit}'`, then send the re-index request:

   ```text
   To: marketplace-publishing@cursor.com
   Subject: Re-index request: simple-balance X.Y.Z

   Please re-index the simple-balance plugin from
   https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
   at tag vX.Y.Z (commit <full SHA>).

   What changed: <the release notes from plugin/plugin.json>
   ```

   The terms require the request but don't name a channel. This is the address the publish page gives for questions and the one Cursor's follow-up comes from. Unconfirmed: that Cursor wants re-index requests there. Ask in your first review thread.
3. To try a new version in Cursor before the re-index, uninstall the Marketplace copy first. Otherwise it takes precedence over `~/.cursor/plugins/local/simple-balance`.

Check: once Cursor confirms, reinstall from **Customize** and confirm the change is there.

## Install link

The README's **Add to Cursor** badge (`https://cursor.com/deeplink/mcp-install-dark.svg`) links to:

```text
https://cursor.com/install-mcp?name=simple-balance&config=eyJ1cmwiOiJodHRwczovL2FwcC5zbXBsLm1vbmV5L21jcCJ9
```

`config` is `{"url":"https://app.smpl.money/mcp"}` in base64. The page decodes it and opens Cursor's install link, `cursor://anysphere.cursor-deeplink/mcp/install?name=simple-balance&config=...`, which Cursor documents under MCP install links. It adds the server alone, named `simple-balance`, without the skill. `npm run check` decodes the link and fails if it would install any other URL.

Check: open the link on a computer with Cursor installed. Cursor asks to install `simple-balance`. Sign in as in the local test.

## cursor.directory

cursor.directory is Cursor's community directory, built from `cursor/community-plugins`. There's no application: each submission gets an automated security scan, and admins moderate the queue. It reads the repository from GitHub, so submit after the merge to `main`.

1. Sign in at [cursor.directory](https://cursor.directory) with GitHub or Google.
2. Open [cursor.directory/plugins/new](https://cursor.directory/plugins/new) and stay on the **Auto (GitHub)** tab.
3. Paste `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` and choose **Scan repo**.

   Check: the scan lists two components, the MCP server `simple-balance` (from `plugin/.mcp.json` and `plugin/mcp.json`, merged by name) and the skill `simple-balance`. The scanner reads `.cursor-plugin/marketplace.json` at the root and follows its `source` to `plugin/`, and `plugin/.cursor-plugin/plugin.json` also marks that folder.
4. Correct the fields the scan fills. Because the root marketplace file supplies a name, the scanner takes nothing else from `plugin/.cursor-plugin/plugin.json`: no description, author, keywords or logo.

   | Field | Value | Notes |
   | --- | --- | --- |
   | Logo | Upload `assets/logo-512.png` | Optional, but the scan finds none for a plugin in a subfolder. Images only, 1 MB at most. |
   | Name | `Simple Balance` | The scan fills `simple-balance`, the marketplace's id. |
   | Description | `Budget app and spending tracker. Ask about your accounts, spending and budgets, and queue or record transactions, as far as you allow.` | The scan fills `simple-balance-mcp-connectors plugin for Cursor`. |

5. Choose **Publish Plugin**.

   Check: a notice starting "Submitted! Scanning your plugin now" appears, and the listing page opens with "Scanning your plugin… it will appear publicly once the security agent finishes." Once the scan passes, search cursor.directory for Simple Balance. If the scanner flags the plugin, the page says "Flagged by the security agent", and the listing stays hidden until an admin reviews it.
6. On the listing's edit page (`/plugins/<slug>/edit` in the site's source), add what the scan left out: **Homepage** `https://smpl.money/docs/agents-and-mcp/` and **Keywords** `personal-finance, budgeting, bookkeeping, ledger, double-entry, transactions, csv-import`. The **Repository URL** stays locked to GitHub.

A name or repository that's already listed is refused with "A plugin with this name or repository already exists." Unconfirmed: how a listing picks up later versions of the repository. The edit page has no re-scan control in the site's source.

## Sources

- https://cursor.com/docs/plugins.md
- https://cursor.com/docs/reference/plugins.md
- https://cursor.com/marketplace/publish (field labels, hints and messages from the page's script)
- https://cursor.com/marketplace-publisher-terms
- https://cursor.com/help/security-and-privacy/marketplace-security.md
- https://cursor.com/docs/mcp.md
- https://cursor.com/docs/mcp/install-links.md
- https://github.com/cursor/community-plugins (README, `apps/cursor/src/lib/github-plugin/parse.ts`, `apps/cursor/src/components/forms/plugin-form.tsx`, `apps/cursor/src/components/forms/edit-plugin-form.tsx`)
- https://github.com/naturalpay/agent-plugins/blob/main/.cursor-plugin/marketplace.json
- https://github.com/thtmnisamnstr/simple-balance (`src/client/pages/SettingsPage.tsx` for the **Connected agents** labels, `src/server/auth.ts` with Better Auth 1.6.33's MCP defaults for the token lifetime)
- https://smpl.money/ (plans) and https://smpl.money/privacy/
