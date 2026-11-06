# Submissions

Where Simple Balance's MCP server is listed, what each listing still needs, and
the order to work in. Each listing has its own guide with the exact values to
paste. Nothing in this folder submits anything on its own.

## Status

As of 2026-11-03, the MCP Registry lists `money.smpl/simple-balance` 1.0.1,
published from the `v1.0.1` tag, mcptry picked it up from there, and
mcpservers.org has published it. M8ven also lists this repository, which it
found by searching GitHub, though its listing describes the repository rather
than the server. No other directory lists Simple Balance yet.
Each release tag has a GitHub Release carrying the OpenAI ZIP and its
`SHA256SUMS`.

Anyone can install the plugin from this repository by adding it to Claude
Code, claude.ai, Codex or the ChatGPT desktop app as a marketplace by hand, and
the Gemini CLI extension installs from it the same way. None of that is a
listing: nobody finds Simple Balance by browsing Claude's or OpenAI's
directories until the Claude Directory and OpenAI submissions below pass
review.

| Listing | How it gets there | Cost | Waits on | Guide |
| --- | --- | --- | --- | --- |
| MCP Registry | `release.yml` publishes `server.json` on a `v*` tag | Free | Nothing: `1.0.0` and `1.0.1` published 2026-11-03 | [mcp-registry.md](mcp-registry.md) |
| Glama connectors | Imported from the registry; claim it to add a test profile | Free | Glama's import (its page answered 404 on 2026-11-03) | [mcp-registry.md](mcp-registry.md#glama) |
| Awesome Remote MCP Servers | Pull request | Free | Glama's page, a star from your account | [awesome-remote/README.md](awesome-remote/README.md) |
| GitHub MCP Registry and VS Code's gallery | Onboarding request to GitHub | Free | GitHub's curation: [requested](https://github.com/github/github-mcp-server/discussions/1257#discussioncomment-19385092) 2026-11-03 | [mcp-registry.md](mcp-registry.md#github-mcp-registry-and-vs-code) |
| MCP.Directory | Auto-discovery, then claim; or a form | Free | Up to two weeks of auto-discovery, then the form | [directories.md](directories.md#mcpdirectory) |
| mcptry | Imported from the registry; claimed | Free | Nothing: [listed](https://mcptry.com/servers/money.smpl/simple-balance) and claimed 2026-11-03 |
| M8ven | Found this repository by searching GitHub; claiming is optional | Free | Nothing: [listed](https://m8ven.ai/mcp/thtmnisamnstr/simple-balance-mcp-connectors) and graded 2026-11-03, unclaimed | [directories.md](directories.md#m8ven) |
| PulseMCP | Imports from the registry once it reopens | Free | PulseMCP (paused since September) | [directories.md](directories.md#pulsemcp) |
| OpenAI plugins (ChatGPT and Codex) | ZIP upload in the portal, then review | Free; identity verification needs a physical ID | App route, site naming the publisher, reviewer account, test runs (write tools need ChatGPT Business or Codex), demo video, skill scan, policy attestations | [openai.md](openai.md) |
| Codex and ChatGPT desktop, by marketplace URL | Users add this repository as a marketplace by hand. Not a directory listing | Free | Nothing; the OpenAI plugins row is the listing | [openai.md](openai.md#codex-marketplace-no-review) |
| Claude Directory, connector | Portal form, then review | Paid Claude plan | Reviewer account, docs with examples | [claude-directory.md](claude-directory.md) |
| Claude Directory, plugin bundle | Portal, read from this repository | Paid Claude plan | Your submission | [claude-directory.md](claude-directory.md#submit-the-plugin-bundle) |
| Claude Code and claude.ai, by marketplace URL | Users add this repository as a marketplace by hand. Not a directory listing | Free | Nothing; the Claude Directory rows are the listing | [claude-directory.md](claude-directory.md#self-hosted-marketplace) |
| Cursor Marketplace | Publisher application, then review | Free | Cursor's answer on the paid plan | [cursor.md](cursor.md) |
| cursor.directory | Form with the repository URL | Free | Your submission | [cursor.md](cursor.md#cursordirectory) |
| awesome-copilot | Issue form | Free | Your timing: the repository is new and has no stars | [vscode-copilot.md](vscode-copilot.md#awesome-copilot) |
| Gemini CLI extension gallery | Found by topic and manifest | Free | The gallery's next crawl | [gemini-cli.md](gemini-cli.md) |
| Cline catalog | Pull request to `cline/marketplace` | Free | Your pull request | [cline/README.md](cline/README.md) |
| Docker MCP Catalog | Pull request to `docker/mcp-registry` | Free | Reviewer account | [docker/README.md](docker/README.md) |
| MCP.so | Form; free queue or $39 | Free or $39 | Your submission | [directories.md](directories.md#mcpso) |
| MCP Servers (mcpservers.org) | Form; free or $39 | Free or $39 | Nothing: [published](https://mcpservers.org/servers/smpl-money) 2026-11-03. Changes go by email to `contact@mcpservers.org` | [directories.md](directories.md#mcp-servers-mcpserversorg) |
| MCP Market | Form; remote listings only paid | $69 | Your decision | [directories.md](directories.md#mcp-market) |
| Smithery | Closed to submissions on 2026-10-31 | | | [directories.md](directories.md#smithery) |
| Microsoft Copilot | Business verification and certification | | Left out of this round | |

Update the table as listings go live, so it stays the one place to look.

## Order of work

1. **Merge this branch.** Done on 2026-11-03. The Claude Code, claude.ai and
   Codex marketplaces, the Gemini CLI extension, and every form that reads the
   repository depend on it.
2. **Set the repository's About box and topics**, as
   [gemini-cli.md](gemini-cli.md#1-set-the-about-fields-and-topics) gives them.
   Done on 2026-11-03.
3. **Start the application and website changes that block a listing**, in the
   order [prerequisites.md](prerequisites.md#order-of-work) sets. The first is
   the route OpenAI's domain check reads; no OpenAI submission can start without
   it.
4. **Create and seed the reviewer account**
   ([reviewer-account.md](reviewer-account.md)). OpenAI, Claude and Docker need
   it. Glama gets a separate, empty account
   ([mcp-registry.md](mcp-registry.md#glama)). Then **record the OpenAI demo
   video** with it ([demo-video.md](demo-video.md)) and put the link in
   `plugin/plugin.json`, so the ZIP the release builds carries it. If the video
   isn't ready by the `v1.0.0` tag, the next version's ZIP can carry it; upload
   that one.
5. **Publish to the MCP Registry**: the key, the DNS record, the environment
   secret, then the `v1.0.0` tag ([mcp-registry.md](mcp-registry.md)). Done on
   2026-11-03. The same
   tag's run builds the OpenAI ZIP.
6. **Everything that reads the registry**: claim Glama and add its test profile,
   post GitHub's onboarding request, then MCP.Directory, mcpservers.org and,
   once Glama's page exists, the Awesome Remote pull request.
7. **The reviewed directories**: OpenAI, Claude (connector and plugin bundle),
   Cursor, awesome-copilot.
8. **The pull-request catalogs**: Cline and Docker. Both have long review
   queues, so a pull request opened early waits no longer than one opened late.
9. **The web forms**: MCP.so, and MCP Market if you decide to pay for it.

Opening a pull request, filing an issue, starring a repository, changing DNS
or repository settings, and every form submission are yours to do. Each guide
gives the exact command or value.

## Decisions for you

| Decision | Default here | Where it's explained |
| --- | --- | --- |
| Registry name | `money.smpl/simple-balance`, proved by DNS | [mcp-registry.md](mcp-registry.md#the-name) |
| What scopes clients ask for by default | Every scope, set by adding `scope` to the first 401 | [prerequisites.md](prerequisites.md#15-scope-in-the-first-401) |
| MCP Market | Don't list: $69, no finance category, unlimited indemnity | [directories.md](directories.md#mcp-market) |
| MCP.so | The free queue | [directories.md](directories.md#mcpso) |
| Claiming the M8ven listing | Leave it unclaimed, unless you want to change how it describes Simple Balance | [directories.md](directories.md#m8ven) |
| Countries for the OpenAI listing | Set in the portal at submission. The ZIP leaves them out, and the portal's default is undocumented. | [openai.md](openai.md#submit-in-the-portal) |
| OpenAI identity | Individual verification as Gavin Johnson | [openai.md](openai.md#before-you-start) |
| Where the demo video lives | Unlisted on YouTube | [demo-video.md](demo-video.md#check-host-and-link-it) |
| `create_transaction`'s `destructiveHint` | Keep `false` | [prerequisites.md](prerequisites.md#37-annotations-a-reviewer-may-question) |
| A `/support/` page before the first OpenAI ZIP | None; the FAQ stays the support URL | [prerequisites.md](prerequisites.md#31-support-page) |
| The Claude organization that owns both listings | A personal Pro, Max or Ultra account | [claude-directory.md](claude-directory.md#before-you-submit) |
| Claude's documentation URL | Option A, the site's agents page | [claude-directory.md](claude-directory.md#documentation-requirement) |
| Cursor's organization handle | `simple-balance`, settled before you apply | [cursor.md](cursor.md#apply-to-the-cursor-marketplace) |
| Applying to Cursor before it answers about Premium | Wait for the answer | [cursor.md](cursor.md#ask-cursor-about-the-premium-plan) |
| A public star on Awesome Remote | Your call; the list requires it | [awesome-remote/README.md](awesome-remote/README.md) |
| When to file for awesome-copilot | After a release tag, or later once the repository has some history | [vscode-copilot.md](vscode-copilot.md#awesome-copilot) |
| Cline's legacy marketplace issue | Skip it unless you want Cline 3.x users | [cline/README.md](cline/README.md) |
| Glama Boost | Not bought | [mcp-registry.md](mcp-registry.md#glama) |
| Claude's under-18 question | No, though the terms allow accounts from 16 | [claude-directory.md](claude-directory.md) |

## Keeping the listings current

- **A listing's text or files change:** `npm run set-version -- X.Y.Z`, rewrite
  the OpenAI release notes in `plugin/plugin.json`, merge, then tag `vX.Y.Z`. The
  tag republishes the registry entry and builds a new OpenAI ZIP. Uploading that
  ZIP, asking Cursor to re-index, selecting **Publish** on the new version in
  Claude's directory, and updating the awesome-copilot entry stay manual.
- **The application adds, renames or retires a tool:** run
  `npm run sync-tools -- ../simple-balance`, then `npm run check`. It fails when
  an OpenAI test case, the skill, `GEMINI.md` or `llms-install.md` names a tool
  the server no longer has, or when a total such as "all 77 tools" no longer
  matches. Per-scope and per-kind counts (37 read, 5 stage, 35 write; 11 that
  can't be undone) are written by hand: find them with
  `grep -rnE '\b(37|35|11) ' submissions` and update them.
- **Before each review:** refresh the reviewer account's data
  ([reviewer-account.md](reviewer-account.md#refresh-before-each-review)),
  because the test prompts ask about last month and this month.
- **The text every form draws from** is in [copy.md](copy.md).
