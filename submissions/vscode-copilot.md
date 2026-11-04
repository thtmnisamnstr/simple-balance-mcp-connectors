# VS Code and GitHub Copilot

VS Code and Copilot users can install the MCP server and the plugin today without any listing. Two optional listings help users find it.

| Route | What users get | What you do |
| --- | --- | --- |
| Install link, `code --add-mcp`, `copilot mcp add` | The MCP server, from the README | Nothing. Test it once (below). |
| The plugin, straight from this repository | The server and the skill, in VS Code and Copilot CLI | Merge, then test it once (below). |
| VS Code's MCP gallery | A result when searching `@mcp` in VS Code | GitHub's onboarding request, in [mcp-registry.md](mcp-registry.md) |
| awesome-copilot | A listing in Copilot CLI's built-in marketplace, which VS Code also offers | The issue form below |

## Test the MCP server

1. Select the README's **Install in VS Code** badge. Its link, `https://vscode.dev/redirect/mcp/install?name=simple-balance&config=...`, redirects to `vscode:mcp/install`, and VS Code asks to install `simple-balance`. Or run:

   ```bash
   code --add-mcp '{"name":"simple-balance","type":"http","url":"https://app.smpl.money/mcp"}'
   ```

   That writes the server to your VS Code user profile's `mcp.json`. `npm run check` decodes the badge's link and fails if it would install anything else.
2. Run **MCP: List Servers**, select `simple-balance` and choose **Start Server**. Sign in in the browser, read the scopes on **Allow this MCP client?** and choose **Allow access**. If sign-in fails, run **MCP: List Servers** again, select the server and choose **Show Output** to read the error.
3. In an agent session, send:

   ```text
   Use the simple-balance MCP server to run whoami and list my accounts. Do not change anything.
   ```

   Check: expand the tool calls. They came from `simple-balance`, returned without a connection error, and the answer reflects what they returned. That's VS Code's own test for a working server.
4. In Simple Balance, open **Settings > Connected agents** and find VS Code's row. **Read, stage, and commit** means it asked for `ledger:write`. **Read only** means it asked for `ledger:read` alone or for no scope at all, which gets the server default, `openid profile email ledger:read` (see [prerequisites.md](prerequisites.md)). Which scopes VS Code requests is unconfirmed until you look.

Copilot CLI keeps its own list in `~/.copilot/mcp-config.json`, which the README's `copilot mcp add --transport http simple-balance https://app.smpl.money/mcp` writes. If a Copilot Business or Enterprise account can't reach the server, see [Organization policy](#organization-policy).

## Test the plugin

`plugin/` is also an Agent Plugin. VS Code and Copilot CLI read `plugin/plugin.json` first, because it declares the Agent Plugins `$schema`, and then load `plugin/mcp.json` and `plugin/skills/`. Both find the marketplace through `.claude-plugin/marketplace.json`, the fourth marketplace file they look for.

1. In a terminal, install the plugin from its folder with Copilot CLI:

   ```bash
   copilot plugin install thtmnisamnstr/simple-balance-mcp-connectors:plugin
   copilot plugin list
   ```

   That form reads `main`. To try changes that aren't on `main` yet, run `copilot plugin install ./plugin` from the repository root instead.

   Check: `copilot plugin list` shows `simple-balance`. awesome-copilot's install smoke test also installs the plugin with Copilot CLI, so fix any failure here before you submit.

   To install through the marketplace instead:

   ```bash
   copilot plugin marketplace add thtmnisamnstr/simple-balance-mcp-connectors
   copilot plugin install simple-balance@simple-balance
   ```

   The marketplace registers under the name in its `marketplace.json`, `simple-balance`.
2. In VS Code, run **Chat: Open Customizations**, select **Browse**, open the source menu and choose **Configure Marketplaces**. Select **Add Marketplace** and enter `thtmnisamnstr/simple-balance-mcp-connectors`. Back in **Browse**, pick that marketplace, select `simple-balance` and choose **Install**. VS Code asks you to trust the marketplace the first time. To try changes that aren't on `main` yet, run **Chat: Install Plugin from Source** and enter the full path of `plugin/` instead.

   VS Code also lists the plugins Copilot CLI installed, from `~/.copilot/installed-plugins/`. To test the VS Code route on its own, remove the CLI copy first with `copilot plugin uninstall simple-balance`.
3. Run the server checks from the previous section against the plugin's server.

   Check: the plugin's server signs in and answers `whoami`. Unconfirmed: whether a Copilot harness session starts the OAuth sign-in itself. If no browser opens, start the server from **MCP: List Servers** or use a Local session.

## VS Code's MCP gallery

VS Code's MCP server gallery (search `@mcp` in the Extensions view, or run **MCP: Browse MCP Servers**) shows the GitHub MCP Registry at `https://api.mcp.github.com`, not the official MCP Registry. GitHub adds servers to it by hand from the official registry, then syncs their new versions. Publishing `server.json` is the first half and GitHub's onboarding is the second. Both are in [mcp-registry.md](mcp-registry.md).

Check:

```bash
curl -s "https://api.mcp.github.com/v0.1/servers?search=simple-balance"
```

It returns `"servers":[]` until GitHub adds the server, as it did on 2026-11-02. After that, search `@mcp simple balance` in VS Code.

## awesome-copilot

`github/awesome-copilot` publishes the `awesome-copilot` marketplace. It's built into Copilot CLI and can't be removed there, VS Code lists it among its plugin marketplaces, and Copilot CLI updates plugins installed from it at the start of each session in a trusted folder. External plugins join it through an issue form, automated checks and a maintainer's decision. Its docs mention no fee.

### Fit

The maintainers' review guidance names the submissions they usually reject. Three patterns are close to this one: "Thin connectors to paid services that offer little practical Copilot value beyond promoting the service (no usable free path, narrow scope, sales-led framing)"; marketing pushes for brand-new products "(repo days old, 0 stars, few commits)"; and "Free skills as an on-ramp to the vendor's paid/credit-based MCP or connector". The guidance spots the third by a vendor license or author, `mcp add` commands that point at the vendor's API, UTM or referral links, or a README that markets the free content as a funnel. This repository has the first two. Their automation reports the repository's age, stars and forks, checks the contributor's reputation and looks for pricing on the homepage. The same guidance says "Being paid or vendor-backed is not on its own a reason to reject", and that a non-coding use isn't either.

What works in Simple Balance's favor, and is already in the values below:

- Every feature is on the free plan, which is the free path the guidance asks about.
- Nothing paid sits behind the skill, which answers the third pattern. The server and every tool work the same on the free plan, and Premium only lifts the three-account limit and removes the ads ([the app's guide, Plans](https://github.com/thtmnisamnstr/simple-balance/blob/main/docs/guide.md#plans)). The plugin's files link to no pricing page or checkout and carry no UTM or referral links. The reviewer notes say so.
- The wording is neutral and technical, and links go only to docs and source.
- You say plainly that you build Simple Balance. GitHub's guidance on paid services asks, "If the contributor is affiliated with the service, is that clear?"

A rejection closes the issue for good, and trying again takes a new issue that shows the concerns were addressed. If you'd rather not risk the brand-new pattern, wait until this repository has some history.

### Before you open the issue

1. Release `v1.0.1` or later (see [Releasing](../README.md#releasing)): merge to `main`, tag the merge commit, push the tag, and let `release.yml` pass. The tag is the immutable ref the form asks for. `release.yml` creates the GitHub Release for it; don't make one by hand ([gemini-cli.md](gemini-cli.md#updates-come-from-releases)).
2. Get the tag's commit SHA:

   ```bash
   git fetch --tags
   git rev-parse 'v1.0.1^{commit}'
   ```

   The quotes keep zsh from reading `^` and the braces. Check: the output is 40 hexadecimal characters.
3. If `plugin/` changed since you tested it, run the Copilot CLI install from [Test the plugin](#test-the-plugin) again.
4. Optional: lint the skill the way the quality gate does. The gate runs Microsoft's Vally linter (`@microsoft/vally` 0.20.0) on the plugin folder, and its command-line wrapper is `@microsoft/vally-cli`:

   ```bash
   npx --yes @microsoft/vally-cli@0.20.0 lint plugin
   ```

   Unconfirmed: this command wasn't run while writing this guide. If it refuses the path, `vally lint --help` lists the options.

### Fill in the issue form

Open https://github.com/github/awesome-copilot/issues/new?template=external-plugin.yml while signed in to GitHub. The title starts as `[External Plugin]: `. Complete it as `[External Plugin]: simple-balance`.

| Field | Value |
| --- | --- |
| Plugin name | `simple-balance` |
| Short description | The first block below |
| GitHub repository | `thtmnisamnstr/simple-balance-mcp-connectors` |
| Plugin path inside the repository | `plugin`, the folder where the plugin starts, not `plugin/plugin.json` |
| Ref to review | `v1.0.1` |
| Commit SHA to review | The 40-character SHA from the previous section |
| Version | `1.0.1`. It must match `version` in `plugin/plugin.json`. |
| License identifier | `MIT` |
| Author name | `Gavin Johnson` |
| Author URL | `https://smpl.money/` |
| Homepage URL | `https://smpl.money/docs/agents-and-mcp/` |
| Keywords | `budget-app, spending-tracker, budgeting, personal-finance, transactions, csv-import, double-entry, mcp` |
| Additional notes for reviewers | The second block below |
| Submission checklist | Check all four boxes: the repository is public; the ref and SHA are immutable, not a branch; the submission follows the repository's contribution, security and responsible AI policies; the plugin isn't already listed |

Give both the ref and the SHA. The form needs at least one, and with both, the checks also confirm that they name the same commit. Never move or delete the `v1.0.1` tag afterward: the listing records both.

Short description:

```text
Budget app and spending tracker. Ask about your accounts, spending and budgets, and queue or record transactions. Adds Simple Balance's hosted MCP server, which signs in with OAuth (no API key), and a skill that has the agent queue changes for your approval first.
```

Additional notes for reviewers:

```text
I build and run Simple Balance, a free budget app and spending tracker, and I maintain this plugin.

- Contents: an Agent Plugins 1.0.0 manifest (plugin.json), an mcp.json that names one remote server, one skill, a README and the MIT license. Nothing runs locally.
- Server: https://app.smpl.money/mcp, Streamable HTTP, OAuth 2.1 with PKCE and dynamic client registration. The consent screen lists the scopes requested: ledger:read reads, ledger:stage queues transactions for the user to approve, and ledger:write makes the change itself.
- Tools: 77, each with a title and annotations. By scope: 37 ledger:read, 5 ledger:stage and 35 ledger:write. The skill tells the agent to stage entries for review unless asked for a specific change, and to confirm permanent deletes.
- Free path: the free plan gives you everything Simple Balance does, for three accounts you can use at once, so a free account at https://app.smpl.money/ is enough to try every tool. The paid plan only lifts that limit and removes ads; the MCP server and its tools are the same on both. The skill only guides use of the server, and the plugin links to no pricing page or checkout.
- There's no automatic pull from a bank today, and Simple Balance can't move money.
- Docs: https://smpl.money/docs/agents-and-mcp/
- Server source (AGPL-3.0): https://github.com/thtmnisamnstr/simple-balance
```

Never post the reviewer account's credentials in the issue: GitHub issues are public. If a maintainer asks to try the server with sample data, offer to send the account described in [reviewer-account.md](reviewer-account.md) privately.

Submit the issue.

### What happens next

1. Automation adds the `external-plugin` and `awaiting-review` labels.
2. Intake checks the fields. A problem gets the `requires-submitter-fixes` label and a comment that says what to fix. Editing the issue runs intake again. After a fix to the plugin itself, comment `/rerun-intake`; the bot reacts to the comment when it starts.
3. The quality gates run, and any failure blocks the submission:
   - Agent Plugins 1.0.0 compliance of `plugin/plugin.json`: the exact `$schema`, a non-empty `version` and `description`, and no top-level field outside the spec. `npm run check` validates the same file against the same schema.
   - `vally lint` on the plugin folder at your ref and SHA: Agent Skills spec compliance and valid file references in the skill.
   - An install smoke test: Copilot CLI adds a temporary marketplace that holds your entry and installs `simple-balance` from it.
   - Version and ref checks: `1.0.1` matches the manifest at the ref, and the ref and SHA agree.
4. When everything passes, the label changes to `ready-for-review`. A maintainer reviews the plugin and comments `/approve` or `/reject <reason>`. Commands from anyone else are ignored.
5. On `/approve`, the issue gets `approved` and closes, and automation opens a pull request that adds the entry to `plugins/external.json`. The plugin is listed once that pull request merges. On `/reject`, the issue gets `rejected` and closes for good.

Check, once the pull request has merged:

```bash
curl -s https://raw.githubusercontent.com/github/awesome-copilot/main/plugins/external.json | grep -n '"simple-balance"'
copilot plugin marketplace update awesome-copilot
copilot plugin install simple-balance@awesome-copilot
```

The first command prints the entry's line, and the install succeeds.

### Updates and re-review

- The entry pins `v1.0.1` and its SHA, so a new release reaches awesome-copilot users only after the entry changes. That change is a pull request to `github/awesome-copilot` that updates the entry's `version`, `source.ref` and `source.sha` in `plugins/external.json`, and the same quality gates run on it. Unconfirmed: whether you open that pull request or a maintainer does. The contributing guide tells public contributors not to edit that file to add a plugin and says nothing about who updates one, so ask on the approved issue the first time.
- Six months after the approved issue closes, the listing comes up for re-review. A maintainer keeps it, asks for follow-up or removes it.

## Organization policy

- On Copilot Business and Copilot Enterprise, MCP works only after an organization or enterprise admin enables the **MCP servers in Copilot** policy, which is disabled by default. The policy doesn't govern Copilot Free, Pro, Pro+ or Max. The README says this already. Send a Business or Enterprise user who can't reach the server to their admin.
- Admins can also limit which MCP servers VS Code may use (the `chat.mcp.access` setting) and which plugins and marketplaces developers can install. In Copilot CLI, a plugin or marketplace pinned by a managed policy can't be changed locally. Nothing in this repository can change any of these.

## Sources

- https://code.visualstudio.com/docs/agent-customization/mcp-servers.md
- https://code.visualstudio.com/docs/agents/reference/mcp-configuration.md
- https://code.visualstudio.com/docs/agents/run/manage-mcp-servers.md
- https://code.visualstudio.com/docs/agent-customization/agent-plugins.md
- https://code.visualstudio.com/api/extension-guides/ai/mcp
- https://github.com/microsoft/vscode/blob/1.144.0/src/vs/workbench/contrib/chat/common/plugins/AGENTS_PLUGINS.md
- https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference
- https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp
- https://api.mcp.github.com/
- https://github.com/github/awesome-copilot/blob/main/.github/ISSUE_TEMPLATE/external-plugin.yml
- https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md (Adding External Plugins)
- https://github.com/github/awesome-copilot/blob/main/.github/extensions/external-plugin-review-board/review-guidance.md
- https://github.com/github/awesome-copilot/blob/main/eng/external-plugin-quality-gates.mjs
- https://github.com/github/awesome-copilot/discussions/968
- https://www.npmjs.com/package/@microsoft/vally-cli
