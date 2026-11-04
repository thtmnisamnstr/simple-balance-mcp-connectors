# OpenAI plugin directory (ChatGPT and Codex)

ChatGPT and Codex share one plugin directory. A listed plugin works in
ChatGPT (Chat and Work, on the web, desktop and mobile), in Codex in the
ChatGPT desktop app, and from the Codex CLI plugin browser (`/plugins`). The
Codex IDE extension has no plugins.

You upload a ZIP built from [`plugin/`](../plugin/), connect the MCP server,
pass automated checks, and submit for review by people. Approval doesn't
publish anything: you select **Publish plugin**. After that, people find
Simple Balance by exact-name search or a direct link. Placement on the
directory's main pages is OpenAI's choice and can't be requested.

| | |
| --- | --- |
| Portal | [platform.openai.com/plugins](https://platform.openai.com/plugins) (sign-in required) |
| Package | `dist/simple-balance-plugin-<version>.zip`, built from `plugin/` |
| Fee | None in OpenAI's submission, review or guideline pages |
| Review time | Not published. OpenAI doesn't accept requests to expedite. |
| Status of every listing | [submissions/README.md](README.md) |

The portal answers 403 without a sign-in, so the labels below come from
OpenAI's documentation rather than a session. A label can differ slightly.

## Before you start

1. **Organization.** Use an OpenAI Platform organization you control
   personally, not an employer's: the organization owns the listing. Pick or
   create a project with global data residency, because "projects with EU data
   residency cannot submit plugins with MCP servers for review".
2. **Role.** Be an organization Owner, or hold **Apps Management Write**
   (`api.apps.write`). Viewing drafts needs `api.apps.read`. An owner grants
   both at
   [platform.openai.com/settings/organization/people/roles](https://platform.openai.com/settings/organization/people/roles).
3. **Identity verification as Gavin Johnson.** At
   [platform.openai.com/settings/organization/general](https://platform.openai.com/settings/organization/general),
   complete **individual verification** in the name Gavin Johnson. The
   directory shows the verified identity's name whatever `developerName` says
   (`developer_name_defaulted`), and "publishing under an unverified individual
   or business name will result in rejection". Each listing URL also has to
   "identify the same publisher as the submission". Today only
   [smpl.money/privacy](https://smpl.money/privacy/) does, naming Gavin Johnson
   as data controller; the home page, the FAQ and the terms don't name an
   operator. Add his name to the site footer and the terms before you submit
   ([prerequisites.md, item 33](prerequisites.md#33-publisher-named-on-every-listing-url)). Use business verification
   only if a company will publish, and change the privacy policy and the
   manifests' `author` first. Verification takes an original, physical
   government ID and a device that can photograph it, sometimes with a selfie,
   and no fee is mentioned. One person can verify only one organization, so a
   verification you've made for an employer's may block this one
   ([prerequisites.md, item 4](prerequisites.md#4-openai-organization-and-identity-verification)).
4. **App changes.** OpenAI checks that you control the MCP host by fetching a
   token it generates from
   `https://app.smpl.money/.well-known/openai-apps-challenge`, as plain text.
   That path answers 404 today. Ship the route in the app, reading the token
   from configuration, before you start in the portal. Other server items that
   affect this listing, all app changes ([prerequisites.md](prerequisites.md)):
   - Discovery advertises `client_secret_basic`, `client_secret_post` and
     `none`, but registration forces `none`. Whether ChatGPT accepts that
     override is unconfirmed; advertising only `none` removes the question.
   - ChatGPT registers a client by DCR once per connection and reuses it. The
     app prunes clients older than a day that hold no consent and no token, so
     a ChatGPT client whose users all revoked it can be deleted, and its next
     use fails with `invalid_client`.
   - A client that asks for no scope gets the read-only default
     (`openid profile email ledger:read`), and the 401 names no scope to ask
     for.
   - Three tool descriptions read as moving money (item 14), and two refusals
     point to upgrading ([item 34](prerequisites.md#34-upgrade-wording-in-refusals-to-agents)). [Policy notes](#policy-notes) quotes them.

   Check: `npm run check:live` stops warning about `openai-apps-challenge`
   once the route answers 200.
5. **Reviewer account.** Create it as [reviewer-account.md](reviewer-account.md)
   describes. The portal's own connection signs in with it, and so do the
   reviewers and every test below. The **Allow this MCP client?** screen
   doesn't yet say which account is granting
   ([prerequisites.md](prerequisites.md) item 16 adds it), so a browser still
   signed in to your own account at app.smpl.money would grant your own
   ledger, and the test cases would write to it. Sign in as the reviewer from
   a private window, or a browser profile that isn't signed in there.
6. **Testing access.** Full custom MCP support in ChatGPT, write tools
   included, is for Business and Enterprise/Edu on the web. "Pro users can
   connect custom MCP servers with read/fetch permissions." Free, Go and Plus
   aren't mentioned. On Business, only admins and owners can add one. (OpenAI
   Help Center, archived 2026-10-19; the live page refuses automated reads, so
   recheck it.) OpenAI documents no MCP-specific plan limit for Codex. Without
   Business, test the write tools in Codex.

## Test in ChatGPT and Codex first

Reviewers reject a plugin when a test case fails or the server won't accept
their sign-in, and every rejection costs another review round. Run all eight
cases from `plugin.json` in both clients before you upload anything. If your
ChatGPT plan can't run write tools, run cases 4 and 5 in Codex only.

### ChatGPT

1. In a private window, or a browser profile that isn't signed in to
   app.smpl.money ([Before you start](#before-you-start), item 5), open
   [chatgpt.com/plugins](https://chatgpt.com/plugins), select **+**, then
   **Add custom MCP server**.
2. Name it `Simple Balance`. Under **Connection**, set **Server URL** to
   `https://app.smpl.money/mcp`.
3. For authentication, choose **OAuth** and leave the client ID and secret
   empty, so ChatGPT registers itself by DCR. Simple Balance offers no CIMD.
4. Read the risk warning, select **I understand and want to continue**, then
   **Create as a plugin**.
5. Open [chatgpt.com/plugins?view=personal](https://chatgpt.com/plugins?view=personal),
   open **Simple Balance** and select **+** to install it. Sign in as the
   reviewer account. Make checks 1 and 2 below on the
   **Allow this MCP client?** screen, then choose **Allow access**.
6. Start a new chat in Chat or Work, type `@`, pick **Simple Balance** and
   run the cases.

### Codex

1. Add this repository as a marketplace:

   ```bash
   codex plugin marketplace add thtmnisamnstr/simple-balance-mcp-connectors
   ```

   To test changes that aren't on `main` yet, add your checkout instead,
   `~/Documents/Development/simple-balance-mcp-connectors`. Run
   `codex plugin marketplace remove simple-balance` before you switch, because
   both sources carry the name `simple-balance`.

2. Install the plugin, then sign in as the reviewer. `codex plugin add`
   doesn't start sign-in, and Codex stores each sign-in under the server's name
   and URL, so one you made for your own ledger under the name
   `simple-balance` would carry over. Log that one out before you sign in:

   ```bash
   codex plugin add simple-balance@simple-balance
   codex mcp logout simple-balance
   codex mcp login simple-balance --no-browser
   ```

   Open the URL the last command prints in a private window and sign in as the
   reviewer. Copy the full URL the browser ends on, even if the page doesn't
   load, and paste it at the prompt. If you use Codex with your own ledger, run
   the last two commands again when you're done and sign in as yourself.

3. Start a new `codex` session, since plugins load only in a new one. `/mcp`
   lists the tools. Run the cases.

This installs the same `plugin/` folder the listing ships, skill included. The
ChatGPT desktop app shows the marketplace in its Plugins Directory after a
restart.

### What to check

1. **Client name.** The **Allow this MCP client?** screen names the client
   that registered. Write it down: users see the same name under
   **Settings > Connected agents**. The exact names ChatGPT and Codex send are
   unconfirmed.
2. **Scopes requested.** Same screen. It grants every listed scope or none.
   Codex should list all seven (`openid profile email offline_access
   ledger:read ledger:stage ledger:write`): with no scope in the 401, it takes
   them from the server's protected-resource metadata. If the app adds a
   `scope` parameter to its 401 ([prerequisites.md](prerequisites.md)), Codex
   requests exactly those, so keep `ledger:write` in it. For ChatGPT's custom
   server this is unconfirmed: OpenAI documents only that ChatGPT requests the
   advertised OIDC scopes. If no `ledger:` scope appears, that connection gets
   no tools. The listing isn't affected, because the ZIP sets `defaultScopes`
   to all seven.
3. **Account and scopes granted.** Ask
   `Run whoami and list the email and scopes.` Expect the reviewer's email,
   and `ledger:read`, `ledger:stage` and `ledger:write`. If it shows your own
   email, stop: revoke that client under **Settings** > **Connected agents** in
   your own account, and sign in again as the reviewer.
4. **Tool count.** ChatGPT lists the tools on the plugin's page; Codex lists
   them under `/mcp`. Expect 77 with `ledger:write`. Fewer means a narrower
   grant: 42 with `ledger:stage`, 37 with `ledger:read`.
5. **Confirmations.** ChatGPT asks before each of the 40 tools not marked
   read-only and runs the 37 read tools without asking. Don't let it remember
   an approval while you test. Codex follows `default_tools_approval_mode`,
   where `writes` prompts for every tool not marked read-only.
6. **Tool-list size.** With `ledger:write`, `tools/list` is about 497,153
   characters, roughly 124,000 tokens, 46% of it output schemas. With
   `ledger:read` it's about 43,000 tokens. OpenAI documents no limit; one
   unconfirmed community report (January 2026) quotes "All tools (including
   name, description, and input schema) must be less than 5000 tokens". If
   either client fails to list the tools or errors on a call, stop. The fix is
   in the app (smaller output schemas or fewer tools), and review can't pass
   without it.
7. **Returned fields.** Expand each tool call. Every user field in a result has
   to be one the privacy policy discloses, with no internal identifiers such as
   session or request IDs. `whoami` returns the email address, client id and
   plan fields: decide whether each is needed. Reviewers reject undisclosed
   user data.
8. **The eight cases.** Each behaves as its `expected_behavior` says, and no
   negative case calls a write tool. Run case 5 after case 4, because it
   commits the row case 4 staged: a Corner Market purchase dated today. The
   server refuses the same purchase again that day with `DUPLICATE`, so before
   you run cases 4 and 5 again, in the other client or for the recording,
   delete it in the web app or by asking the assistant. A deleted transaction
   doesn't count as a duplicate. Cases 1 and 3 read last month and this month,
   so the sample data has to cover the months around the review date
   ([reviewer-account.md](reviewer-account.md)).

## Record the demo video

Final submission needs a link to a video that shows the main use cases and
tools on the supported platforms. [demo-video.md](demo-video.md) has the shot
list and the steps: three takes (the connection, the eight cases in ChatGPT,
then Codex), recorded with macOS's own screen recorder, hosted as an unlisted
video, and linked from `plugin/plugin.json` as
`extensions["com.openai"].review.demo_recording_url` before you tag the
release. The ZIP then carries the link, so **Review details** shows it
read-only.

Plugins have to work in ChatGPT on mobile, but a custom MCP server can't be
added there ("web only"). Unconfirmed: whether a plugin you created on the web
runs in the mobile app before it's listed. Try `@Simple Balance` in the app
after step 5 of the ChatGPT test.

## Build the ZIP

The release run builds it. After you push the tag (see
[Releasing](../README.md#releasing)), `release.yml` builds the ZIP and attaches
it, with a `SHA256SUMS` file, to the GitHub Release for that tag. Download it
from there:

```bash
gh release download v1.0.1 --repo thtmnisamnstr/simple-balance-mcp-connectors --dir dist
(cd dist && shasum -a 256 -c SHA256SUMS)
```

Check: `simple-balance-plugin-1.0.1.zip: OK`. In the browser, the release page's
**Assets** list has the same file. The run's `openai-plugin-zip` artifact holds
it too, until it expires.

To build it yourself, check out the tag so the ZIP matches the release:

```bash
git checkout v1.0.1
npm ci
npm run check
npm run build:openai
```

That writes `dist/simple-balance-plugin-1.0.1.zip` and lists what it packed.
Don't attach a ZIP to a release by hand: a release with one asset breaks Gemini
CLI installs ([gemini-cli.md](gemini-cli.md#updates-come-from-releases)).

### What's in it

[`scripts/build-openai-zip.mjs`](../scripts/build-openai-zip.mjs) copies
`plugin/`, leaves out every dotfile (`.claude-plugin/`, `.cursor-plugin/`,
`.mcp.json`) and adds OpenAI's auth block to its copy of `mcp.json`.

| Path in the ZIP | What it is |
| --- | --- |
| `plugin.json` | `plugin/plugin.json`: listing text, test cases, commerce declaration, release notes |
| `mcp.json` | `plugin/mcp.json` plus the auth block below |
| `skills/simple-balance/SKILL.md` | The skill, also the onboarding skill |
| `assets/logo.png` | Logo, 512 x 512 PNG |
| `assets/logo.svg` | Composer icon |
| `README.md`, `LICENSE` | Copied from `plugin/` |

The block, added under `mcpServers["simple-balance"]`:

```json
"extensions": {
  "com.openai": {
    "auth": {
      "type": "oauth",
      "client": { "mode": "dcr" },
      "defaultScopes": ["openid", "profile", "email", "offline_access", "ledger:read", "ledger:stage", "ledger:write"]
    }
  }
}
```

It lives only in the ZIP. In the committed `plugin/mcp.json` it would make the
server entry invalid: the Agent Plugins schema closes every server entry and
Codex's loader rejects unknown fields, so a strict client would skip the
server. `defaultScopes` names every scope because the portal's scan sees only
the tools the grant reaches.

Check:

```bash
unzip -l dist/simple-balance-plugin-1.0.1.zip
unzip -p dist/simple-balance-plugin-1.0.1.zip mcp.json
```

Seven entries with `plugin.json` and `mcp.json` at the root, and the auth
block with seven scopes.

## Submit in the portal

1. Sign in at [platform.openai.com/plugins](https://platform.openai.com/plugins)
   and select your organization and the global-residency project.
2. Select **Upload new or existing plugin**, choose the **Developer identity**
   Gavin Johnson, select **Upload plugin** and pick the ZIP. Where the portal
   offers **With MCP** or **Skills only**, choose **With MCP**: **Skills only**
   drops the MCP configuration (`mcp_configuration_excluded`).
   - Expect the warning `developer_name_defaulted`. If `manifest_normalized`
     lists changed fields, confirm only if they're formatting changes.
   - Check: the plugin detail page opens on a draft at version `1.0.1`.
3. Open **Metadata & Skills** and wait for the checks. Skill scans can take up
   to 2 hours. **Issues** lists findings, and **Copy issues** copies them. To
   fix one, change the file, release a new version and select
   **Upload plugin to fix issues**.
   - Check: no blocking issue is left and the skill scan has finished.
4. Open **MCPs**, select `simple-balance`, then **Connect**. In
   **Connect MCP server**:
   - Check that **MCP Server URL** is `https://app.smpl.money/mcp` and
     **Authentication** shows OAuth, DCR and the seven scopes. The portal reads
     these from the ZIP's `mcp.json` and has no editor for them. No
     **OAuth Client Secret** field should appear. Don't choose **Template**,
     which is for per-customer URLs and trusted partners.
   - The portal shows a token and the URL to serve it at. Use the MCP host,
     `https://app.smpl.money`. Put the token in the app's configuration
     ([prerequisites.md](prerequisites.md)) and deploy. Confirm that
     `curl -s https://app.smpl.money/.well-known/openai-apps-challenge` prints
     exactly the token, with no JSON around it, then select **Verify Domain**.
     Leave the route in place afterward: a later **Reconnect** may check it
     again (unconfirmed).
   - Sign out of your own account at app.smpl.money in this browser first
     ([Before you start](#before-you-start), item 5). Then connect and sign in
     as the reviewer account. The consent screen should list all seven scopes;
     choose **Allow access**. If it lists fewer, stop: the scan sees only what
     the grant reaches (37 tools with read access). Compare **Authentication**
     with the ZIP's `mcp.json`. OpenAI warns that an existing client
     registration can lock credential changes, so after a corrected upload,
     check the saved connection before you **Reconnect**.
   - Check: the new client is under **Settings** > **Connected agents** in the
     reviewer account, not yours, and the scan finishes with 77 tools, each
     showing the `readOnlyHint`, `destructiveHint` and `openWorldHint` recorded
     in [tools.json](tools.json).
5. Open **Issues** under **MCPs**. If `justification_required` appears, or
   the portal asks for a justification per tool, paste them from
   [annotation-justifications.md](annotation-justifications.md). Fix server
   findings in the app, deploy, and select **Rescan**. Findings that don't
   block submission go to the review team with it.
6. In **Metadata & Skills**, open **Review information > Review details**:
   - Enter the login URL, email, password and sign-in steps from
     [reviewer-account.md](reviewer-account.md). Credentials go in the portal
     only, never in a file; the ZIP rejects `test_credentials` and
     `reviewer_instructions`.
   - Check that the five positive cases, three negative cases, release notes
     and commerce declaration came in from the ZIP. They're read-only here.
   - Check that the demo recording URL came in from the ZIP and plays in a
     private window.
   - Set country availability. The ZIP leaves `publication.countries` out, so
     the portal's setting applies. This is your decision; the privacy policy
     already covers EEA, UK and US-state users.
   - Select **Save details**.
7. Select **Submit for review**. Read each policy attestation against
   [Policy notes](#policy-notes) before you confirm it. Progress shows under
   **Review status**, and feedback comes by email. To appeal a rejection, reply
   to that email. Only one review can be active: to change the package during
   review, select **Cancel Review** first.
8. When the approval email arrives, open the approved version and select
   **Publish plugin**.
   - Check: searching `Simple Balance` in ChatGPT's Plugins directory finds
     it, and `/plugins` in Codex CLI lists it. Install it from the directory
     and confirm the consent screen lists all seven scopes, which shows the
     ZIP's `defaultScopes` took effect. Unconfirmed:
     `codex plugin add simple-balance@openai-curated-remote` should also
     install it; the marketplace name comes from Codex's source.
   - Email press@openai.com before any announcement.

## Portal fields and where they come from

Paths are under `extensions["com.openai"]` in
[`plugin/plugin.json`](../plugin/plugin.json) unless the row says otherwise.
Fields imported from the ZIP are read-only in the portal: change the file and
upload a new version.

| Portal field | Value | Comes from |
| --- | --- | --- |
| Organization and project | Yours, with global data residency | Portal |
| Developer identity | Gavin Johnson, verified individual | Portal. Overrides `interface.developerName` in the listing. |
| Upload path | **With MCP** | Portal |
| Plugin ZIP | `simple-balance-plugin-1.0.1.zip` | The `v1.0.1` release's assets, or `npm run build:openai` |
| Package name | `simple-balance` | Top-level `name`. It can never change (`plugin_name_mismatch`). |
| Version | `1.0.1` | Top-level `version`. New for every upload, or the portal warns (`plugin_version_unchanged`). |
| Listing text, URLs, starter prompts, brand colors, logo and composer icon | As in `plugin/plugin.json` | `interface.*` |
| Screenshots | None | Not set. Without a UI the portal rejects them (`screenshots_not_allowed`), and the directory no longer shows them. |
| Onboarding skill | `./skills/simple-balance/SKILL.md` | `onboardingSkill` |
| MCP Server URL | `https://app.smpl.money/mcp` | `mcp.json`: `mcpServers["simple-balance"].url` |
| Authentication | OAuth, DCR, seven scopes | The ZIP's `mcp.json`: `mcpServers["simple-balance"].extensions["com.openai"].auth`, added by the build |
| OAuth Client Secret | None | DCR registers a public client |
| Domain verification | The portal's token at `https://app.smpl.money/.well-known/openai-apps-challenge` | App configuration ([prerequisites.md](prerequisites.md)) |
| Tool annotations | Read from the live server | The scan. [tools.json](tools.json) has the expected values. |
| Annotation justifications | Three per tool | [annotation-justifications.md](annotation-justifications.md) |
| Reviewer credentials | Login URL, email, password, sign-in steps | [reviewer-account.md](reviewer-account.md). Portal only. |
| Positive test cases | 5 | `review.test_cases.positive` |
| Negative test cases | 3 | `review.test_cases.negative` |
| Demo recording URL | Your unlisted video | `review.demo_recording_url` ([demo-video.md](demo-video.md)) |
| Commerce | `false`, with a description | `review.commerce`, `review.commerce_description` |
| Release notes | `First release: balances, spending and budget reports, ...` | `publication.release_notes` |
| Countries | Your decision | Portal. `publication.countries` is not set; `[]` would remove every restriction. |
| Translations | None | `publication.translations`, not set |
| Frame domain explanations | None | Asked only when the scan finds a UI that embeds pages |
| Policy attestations | Confirm each | Portal |

## Annotation justifications

OpenAI's docs disagree on whether these are still collected. The plugin
guidelines say "Annotation justifications are no longer required." The
submission-errors page still lists a justification for each value on every
tool among the final-submission requirements, with the error
`justification_required`. [annotation-justifications.md](annotation-justifications.md)
has all three for every tool, and `npm run check` keeps them in step with
[tools.json](tools.json). A justification can't change an annotation: the
portal shows what its scan read from the server.

Every tool uses one of four annotation presets in the app's
`src/server/mcp.ts`, recorded as `kind` in [tools.json](tools.json) (app
0.2.1). All 77 set `openWorldHint` to false and `idempotentHint` to true.

| Preset | Tools | `readOnlyHint` | `destructiveHint` | `openWorldHint` |
| --- | --- | --- | --- | --- |
| Read | 37 | true | false | false |
| Additive | 9 | false | false | false |
| Destructive | 20 | false | true | false |
| Unrecoverable | 11 | false | true | false |

The guidelines back the destructive preset: "Being able to undo an action does
not, by itself, justify setting `destructiveHint` to `false`."
[prerequisites.md, item 37](prerequisites.md#37-annotations-a-reviewer-may-question)
covers the one additive tool a reviewer might read as destructive,
`create_transaction`.

## Policy notes

- **No money movement.** The guidelines bar "Execution of money transfers,
  crypto transfers, or investment trades" and "Unregulated, deceptive, or
  abusive financial services". Simple Balance records entries; it doesn't
  connect to banks and can't move money. The long description says so and
  negative case 1 tests it. Keep that sentence in every version of the
  listing, and describe transfers as recorded entries, never as payments.
  The scan reads tool descriptions too. Three read closest to moving money:
  `create_transaction` ("Directly commit a deposit, withdrawal, or transfer",
  and "separate payments"), `archive_account` ("This moves money in the
  books") and `commit_staged_transactions` ("Committing puts money in the
  books").
  [prerequisites.md](prerequisites.md#14-tool-text-that-reads-as-moving-money)
  item 14 rewords them; ship it before the first submission if you can.
- **No pricing or promotion.** Listing text may not "advertise pricing,
  subscriptions, free trials, discounts, or promotions", and plugins "must not
  display subscription plans, initiate new subscriptions, or promote
  upgrades". That's why the listing never says "free". Keep plans, prices,
  upgrade links and upgrade prompts out of the listing, the skill and tool
  output. A tool may say that a plan limit froze an account or blocks a new
  one, but not point to an upgrade. Two refusals still do: the frozen-account
  one ("or the person upgrades from a browser") and the account-limit one
  ("Only the person who owns it can raise that, from Settings in the
  browser"). [prerequisites.md, item 34](prerequisites.md#34-upgrade-wording-in-refusals-to-agents) removes that
  wording.
- **Commerce stays `false`.** Plugins may sell only physical goods. Digital
  subscriptions can't be sold "directly or indirectly (for example, through
  freemium upsells)". `review.commerce_description` says the plugin sells
  nothing.
- **No ads.** Plugins "must not serve advertisements". The web app's ads for
  free accounts must never reach tool output.
- **Data.** Results return only what the request needs and the privacy policy
  discloses. Tools never ask for card numbers, government IDs or passwords.
- **Naming.** No "MCP" or "Plugin" after the name, and nothing that implies
  OpenAI made or endorses it.

## Updates after publication

| Change | What to do | When users see it |
| --- | --- | --- |
| Tools, descriptions, schemas, annotations, server instructions | Deploy the app. OpenAI scans daily; to scan now, open **MCPs**, the server, **Issues**, then **Rescan**. | Removed tools: at the next scan. New tools: after automated checks pass. Changed tools: the old definition stays live until the new one passes. |
| Tool results and server-only fixes | Deploy the app. | At once, if the published tool contract holds. |
| Listing text, test cases, skill, icons, release notes | New ZIP with a new version: `npm run set-version -- X.Y.Z`, rewrite `publication.release_notes`, merge, tag. On the existing plugin, select **Upload plugin to make changes**, then review and **Publish plugin**. | When you publish the approved version. The current one stays live meanwhile. |

- Keep the server accepting the published schemas until a held update goes
  live, or ChatGPT's calls fail. If a deploy breaks the live contract, roll it
  back rather than wait for review.
- To dispute a finding on a held tool change, select **Appeal** under
  **Issues**. Automatic updates pause until the appeal ends or you select
  **Withdraw appeal**.
- After a tool change, run `npm run sync-tools -- ../simple-balance`, so
  [tools.json](tools.json) and the test-case check match the server.
- The origin `https://app.smpl.money` can never change on this plugin; a new
  origin needs a new plugin and a full review. For the path `/mcp`, the docs
  disagree: the submission page says to contact support, the review page says a
  new version can change it. Ask support first.
- Keep the reviewer account and its sample data working, since later reviews
  use it. If its sign-in details change, update **Review details** with the
  next version.

## Codex marketplace (no review)

The repository is already a Codex marketplace:
[`.agents/plugins/marketplace.json`](../.agents/plugins/marketplace.json)
lists `simple-balance` from `./plugin`, so anyone with Codex
CLI or the ChatGPT desktop app can install it with no OpenAI review, with the
commands in the
[README](../README.md#openai-codex-cli-ide-extension-chatgpt-desktop-app) or
from `/plugins` in Codex CLI. Users start a new session afterward. The Codex
IDE extension has no plugins; there, `codex mcp add` from the same section adds
the server alone.

- This route installs `plugin/mcp.json` as committed, without the auth block.
  Codex finds sign-in by discovery and, while the 401 names no scope, asks for
  the seven scopes the server's protected-resource metadata lists.
- Bump the version with every change to `plugin/`. Users pick it up with
  `codex plugin marketplace upgrade simple-balance`.
- Check: `codex plugin list --marketplace simple-balance --available --json`
  lists `simple-balance` at the version in `plugin/plugin.json`.
- It isn't a listing. People install from it only by adding this repository
  by name; only the submission above puts Simple Balance in OpenAI's plugin
  directory, where people browse.
- No OpenAI review applies, but OpenAI's usage policies do, and workspace
  admins can block plugins.
- A ChatGPT workspace admin can also import this marketplace for the
  workspace, under **Admin** > **Plugins**
  ([Import and sync plugins from GitHub](https://learn.chatgpt.com/docs/enterprise/plugin-management)).
  That doesn't list Simple Balance in the public directory either.

## Sources

- [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission)
- [Plugin submission errors](https://developers.openai.com/plugins/deploy/submission-errors)
- [Remote MCP server review requirements](https://developers.openai.com/plugins/deploy/app-review)
- [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins)
- [Authenticate users](https://developers.openai.com/plugins/build/auth)
- [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [Add custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server)
- [Troubleshooting](https://developers.openai.com/plugins/deploy/troubleshooting)
- [Plugins in ChatGPT and Codex](https://learn.chatgpt.com/docs/plugins)
- [Model Context Protocol in Codex](https://learn.chatgpt.com/docs/extend/mcp)
- [Import and sync plugins from GitHub](https://learn.chatgpt.com/docs/enterprise/plugin-management)
- [Connecting custom MCP servers in ChatGPT, archived 2026-10-19](https://web.archive.org/web/20261019193201/https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)
- [Codex remote marketplace name](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/remote.rs)
- [Simple Balance MCP standard, tool-list size](https://github.com/thtmnisamnstr/simple-balance/blob/main/docs/standards/mcp.md)
- [Community report of a 5,000-token tool limit](https://community.openai.com/t/token-limit-when-connecting-chatgpt-with-external-mcp/1371022)
- [Simple Balance privacy policy](https://smpl.money/privacy/)
