# Gemini CLI

Nothing gets submitted. The
[Gemini CLI extension gallery](https://geminicli.com/extensions/) builds itself:
a crawler finds public repositories by the `gemini-cli-extension` topic or by
GitHub code search, and lists any whose root `gemini-extension.json` passes
validation. There's no form, no review, no fee and no logo field. Once the files
are on `main`, the extension installs with:

```bash
gemini extensions install https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
```

Where this listing stands next to the others:
[submissions/README.md](README.md).

## What the repository provides

| File | What it does |
| --- | --- |
| [`gemini-extension.json`](../gemini-extension.json) | The manifest: name `simple-balance`, the version every listing shares, the description the gallery card shows, and one server at `https://app.smpl.money/mcp` |
| [`GEMINI.md`](../GEMINI.md) | Context Gemini CLI sends with every prompt while the extension is on: how sign-in starts, `/mcp auth simple-balance`, how to revoke, and the ledger rules worth repeating. The server's own MCP instructions arrive on top of it, so keep it short. |
| `gemini` job in [check.yml](../.github/workflows/check.yml) | Runs `gemini extensions validate .` with Gemini CLI 0.66.0 on every pull request |

Why the manifest looks the way it does:

- `url` with `"type": "http"` selects Streamable HTTP. Gemini CLI deprecated
  `httpUrl` in favor of this form, which it has read since 0.21.0
  (2025-12-16). Supporting older versions would mean going back to `httpUrl`.
- `oauth.enabled: true`. Without it, the first 401 stops at
  `MCP server 'simple-balance' requires authentication using: /mcp auth simple-balance`
  instead of opening the browser.
- No `oauth.scopes`, so Gemini CLI requests every scope the server lists in
  `scopes_supported`: all seven, `ledger:write` included. It reads only
  `resource_metadata` from the 401, so adding a `scope` parameter there (the
  app change in [prerequisites.md](prerequisites.md)) doesn't change what Gemini
  CLI asks for. Gemini CLI asks the user before every MCP tool call, and an
  extension can't set `trust` to turn that off.
- No skill. Gemini CLI loads skills only from `skills/<name>/SKILL.md` at the
  extension root, so `plugin/skills/` never reaches it. `GEMINI.md` carries the
  essentials instead.

`npm run check` fails if the manifest loses `"type": "http"` or
`oauth.enabled: true`, or gains `httpUrl`.

## Before you start

Release 1.0.0 as the [repository README](../README.md#releasing) describes:
merge this branch to `main`, tag the merge commit `v1.0.0` and push the tag.
Until the merge, `main` holds only `LICENSE`, so code search, the crawler and
`gemini extensions install` all come up empty.

## 1. Set the About fields and topics

The topic is what the crawler searches for. This changes the public repository
page, so run it yourself:

```bash
gh repo edit thtmnisamnstr/simple-balance-mcp-connectors \
  --description "Plugin and directory listings that connect Simple Balance, a free budget app and spending tracker, to AI assistants over MCP" \
  --homepage https://smpl.money/docs/agents-and-mcp/ \
  --add-topic gemini-cli-extension,gemini-cli-extensions,mcp,mcp-server,remote-mcp,budget-app,spending-tracker,personal-finance,oauth
```

- `gemini-cli-extension` is the documented topic. Until a fix announced on
  2026-10-23, the crawler searched for `gemini-cli-extensions` instead, so the
  repository carries both.
- The gallery index stores the repository description as `repoDescription` and
  uses it in search. The card itself shows the manifest's `description`.
- The description, the website and the other six topics are the values
  [directories.md](directories.md) gives for the same **About** box, because
  MCP.Directory pulls the description from GitHub. Whichever guide you follow
  first fills the box. `--add-topic` adds to the topics already set, and
  `--description` and `--homepage` replace what's there, so keep the two guides'
  values the same.

Check:

```bash
gh repo view thtmnisamnstr/simple-balance-mcp-connectors \
  --json description,homepageUrl,repositoryTopics \
  --jq '{description, homepageUrl, topics: [.repositoryTopics[]?.name]}'
```

It prints the description, `https://smpl.money/docs/agents-and-mcp/` and the
eight topics. On 2026-11-02 all three were empty.

## 2. Check that code search has indexed the manifest

The crawler also finds repositories through GitHub code search
(`filename:gemini-extension.json path:/`), which indexes new and quiet
repositories lazily.

```bash
gh api 'search/code?q=repo:thtmnisamnstr/simple-balance-mcp-connectors+filename:gemini-extension.json' --jq .total_count
```

Check: it prints `1`. On 2026-11-02, before the merge, it printed `0`. If it
still prints `0` after the merge:

1. Signed in to GitHub, open
   https://github.com/search?q=repo%3Athtmnisamnstr%2Fsimple-balance-mcp-connectors+gemini-extension.json&type=code
2. If GitHub shows "This repository's code is being indexed right now", wait 15
   to 30 minutes.
3. Search again until `gemini-extension.json` appears, then run the command
   again.

## 3. Check the gallery listing

The docs promise a daily crawl and a listing within 24 to 48 hours. In practice
the published index hasn't been rebuilt since 2026-10-16: the open issues
[#29909](https://github.com/google-gemini/gemini-cli/issues/29909) and
[#29817](https://github.com/google-gemini/gemini-cli/issues/29817) report it, and
the scanner fix announced on 2026-10-23 hadn't reached the index by 2026-11-02.
First see whether the index has moved:

```bash
curl -sI https://geminicli.com/extensions.json | grep -i last-modified
```

On 2026-11-02 that printed `last-modified: Fri, 16 Oct 2026 02:36:07 GMT`. Then
look for the listing:

```bash
curl -s https://geminicli.com/extensions.json \
  | jq '.[] | select(.fullName=="thtmnisamnstr/simple-balance-mcp-connectors") | {id, extensionVersion, hasMCP, hasContext, lastUpdated}'
```

Check: it prints one record with `id` `@thtmnisamnstr/simple-balance`, the
current version, and `hasMCP` and `hasContext` both `true`. The card at
https://geminicli.com/extensions/ shows the `thtmnisamnstr` GitHub avatar,
`@thtmnisamnstr/simple-balance`, the manifest description, the version, stars,
the **MCP** and **Context** badges and the license.

- If `last-modified` still says 16 Oct, a missing listing is the gallery's
  problem. Wait.
- If the index was rebuilt more than 48 hours ago and the listing is still
  missing, report it through the **Feedback** link on geminicli.com, with the
  repository URL and the output of steps 2 and 3.
- Unconfirmed: what the crawler checks beyond the manifest, because its rules
  aren't published. A triage bot's comment on
  [#29395](https://github.com/google-gemini/gemini-cli/issues/29395) mentions
  "matching version tags", and the docs say "Once you tag your repository, your
  extension will appear in the gallery" without saying whether that means the
  topic or a git tag. The release tag `v1.0.0` matches `version` in
  gemini-extension.json, which satisfies either reading.

## 4. Test sign-in end to end

Google stopped serving Gemini CLI to free, Google AI Pro and Google AI Ultra
accounts on 2026-06-18 and moved those users to Antigravity CLI. Gemini CLI
still serves paid Gemini API keys and Gemini Code Assist Standard or Enterprise
licenses, so test with one of those. With neither, skip this section: the
listing doesn't depend on it.

Nobody has run this flow against app.smpl.money yet. Each piece was checked
against Gemini CLI's source and the server's metadata, and an unauthenticated
`HEAD /mcp`, which is how Gemini CLI starts discovery, answers 401 with
`resource_metadata`. Still unconfirmed: whether the token endpoint accepts the
RFC 8707 `resource` parameter Gemini CLI sends. Steps 4 to 6 settle it.

1. Check the version: `gemini --version` prints 0.21.0 or later. CI validates
   with 0.66.0.
2. With an API key, set it in the shell you'll start Gemini CLI from. Run the
   command below, paste a paid key from
   https://aistudio.google.com/app/apikey and press Return. Nothing shows
   while you paste, and the key stays out of your shell history. Never put it
   in a file in this repository.

   ```bash
   read -rs GEMINI_API_KEY && export GEMINI_API_KEY
   ```

3. Install from the shell. `gemini extensions install` doesn't run inside an
   interactive `gemini` session.

   ```bash
   gemini extensions install https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
   ```

   If Gemini CLI first asks whether to trust the current workspace, answer
   yes, or run the command from a folder you already trust: declining stops
   the install. The install prompt says
   `Installing extension "simple-balance".`, lists
   `simple-balance (remote)` with `URL: https://app.smpl.money/mcp` and
   `Type: http`, says the extension will append to your context using
   `GEMINI.md`, and repeats Google's warning that it doesn't vet extensions.
   Answer `Y`.

   Check: `gemini extensions list` shows `simple-balance`, and this prints
   `git`:

   ```bash
   jq -r .type ~/.gemini/extensions/simple-balance/.gemini-extension-install.json
   ```

   `github-release` would mean the repository has a GitHub Release. See
   [Updates come from main](#updates-come-from-main).

4. Start `gemini`, and trust the folder if it asks: in an untrusted folder
   Gemini CLI connects no MCP servers, so sign-in never starts. It prints
   `Authentication required for MCP Server: 'simple-balance.'` and asks to
   continue. Accept, and a browser opens at app.smpl.money. Use a browser on the
   machine running Gemini CLI: sign-in returns to
   `http://localhost:<port>/oauth/callback`, which no other machine can reach.
5. Sign in with the test account from [reviewer-account.md](reviewer-account.md),
   so the test never touches your own books. The **Allow this MCP client?**
   screen names `Gemini CLI MCP Client` and lists the seven scopes it asked for,
   `ledger:write` among them. It grants all of them or none. Choose
   **Allow access**.
6. Check:
   - `/mcp list` shows `simple-balance` as connected.
   - Ask `Run whoami and list the scopes this connection has.` The scopes
     include `ledger:read`, `ledger:stage` and `ledger:write`. If only
     `ledger:read` appears, the server applied its read-only default instead of
     the requested scopes, and the stage and write tools are missing.
   - Ask `What are my account balances right now?` Gemini CLI asks before it
     runs `list_accounts`; allow it once. The balances match the **Accounts**
     page at app.smpl.money.
   - In Simple Balance, **Settings** > **Connected agents** lists
     `Gemini CLI MCP Client`.
7. Revoke it there. Gemini CLI registers a new client at every sign-in, so
   there may be more than one entry by that name; revoke each. Then run
   `/mcp auth simple-balance` in `gemini`.

   Check: the browser opens and the consent screen appears again. Revoke that
   client too, and if you're done, run
   `gemini extensions uninstall simple-balance` from the shell. Gemini CLI
   keeps its tokens in `~/.gemini/mcp-oauth-tokens.json`.

Unconfirmed: Antigravity CLI turns installed Gemini extensions into its own
plugins with `agy plugin import gemini`. Nobody has tried it on this extension.
To check, run it after step 3 on a machine with Antigravity CLI and look for
`simple-balance` in its output.

## Updates come from main

This repository publishes no GitHub Releases, on purpose.

- **No release means a git install.** `gemini extensions install` first asks
  GitHub for the repository's Latest release. With none, it clones `main`
  (`git clone --depth 1`), and Gemini CLI then checks for updates by comparing
  the remote `HEAD` with the installed commit (`git ls-remote`). Every push to
  `main` is therefore an update for every Gemini user, README, OpenAI and
  Cursor edits included: Gemini CLI prompts them to update, and installs made
  with `--auto-update` take it without asking. The manifest's `version` is only
  displayed. Keep `main` installable, and merge only when check.yml passes.
- **A release would take over.** Once one exists, new installs download the
  Latest release instead of cloning, and updates follow release tags. If that
  release has exactly one asset, Gemini CLI downloads the asset as the extension
  itself. The OpenAI ZIP has no `gemini-extension.json` at its root, so a
  release carrying only that ZIP breaks `gemini extensions install`, and Gemini
  CLI doesn't fall back to cloning once a download succeeds. That's why
  [release.yml](../.github/workflows/release.yml) leaves the ZIP as the
  workflow artifact `openai-plugin-zip` and creates no release.
- **Tags are fine.** The `vX.Y.Z` tags that start release.yml aren't GitHub
  Releases, and a default install never looks at them.
- **If a release is ever unavoidable**, give it no assets or at least two, and
  keep `version` equal to the tag without its `v`. `npm run set-version` and
  release.yml's tag check already keep those equal.
- Every install downloads the current tree of `main`, so keep large files out
  of it. `dist/` is in `.gitignore`, so the OpenAI ZIP never lands there.

## The name is a first-come claim

`name` in gemini-extension.json, `simple-balance`, becomes the gallery id
`@thtmnisamnstr/simple-balance` and the install folder
`~/.gemini/extensions/simple-balance`. The gallery keeps names unique in a
namespace claims database, and the first repository to claim a name keeps the
listing: in [#29395](https://github.com/google-gemini/gemini-cli/issues/29395) a
maintainer told one publisher that pointing their name at another repository
meant adding `migratedTo` to the first one or deleting its manifest. Keep the
name. Renaming the extension gives up the claim.

Check who holds it:

```bash
curl -s https://geminicli.com/extensions.json | jq '[.[] | select(.extensionName=="simple-balance") | .fullName]'
```

It prints `[]` until the listing appears, then
`["thtmnisamnstr/simple-balance-mcp-connectors"]`. Any other repository there
means someone claimed the name first. In the 2026-10-16 index, nobody had.

## Moving the repository to an organization

The gallery card shows the repository owner's GitHub avatar, today the personal
avatar of `thtmnisamnstr`, and never `assets/logo.svg`. To show the Simple
Balance mark, the repository has to live under a GitHub organization whose
avatar is the mark. To move it:

1. Create the repository under the organization, with the same contents.
2. In this repository's gemini-extension.json, add the new URL, raise the
   version with `npm run set-version`, and merge to `main`:

   ```json
   "migratedTo": "https://github.com/<organization>/simple-balance-mcp-connectors"
   ```

3. Publish no GitHub Release in the new repository either. Existing installs
   are git clones, and Gemini CLI 0.66.0 moves a git clone by cloning the
   `migratedTo` repository's default branch when that repository has no
   release. Gemini's releasing guide says the new repository needs a release,
   but in Gemini CLI's code that holds only for installs made from a release.
   A release there would move every user to release installs, with the risk in
   [Updates come from main](#updates-come-from-main).

An install moves to the new repository on the update after the one that brings
in `migratedTo`, and keeps its settings. The gallery listing stays with this
repository until its manifest carries `migratedTo`.

Check, on a test install: run `gemini extensions update simple-balance` twice,
then:

```bash
jq -r '.source, .type' ~/.gemini/extensions/simple-balance/.gemini-extension-install.json
```

It prints the new repository's URL and `git`.

Other listings name this repository too: `repository` in the plugin manifests,
`repo` in [cline/entry.json](cline/entry.json), and the marketplace commands in
the [repository README](../README.md). A move touches all of them.

## Sources

- https://geminicli.com/docs/extensions/releasing/
- https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/releasing.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/reference.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/authentication.mdx
- https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/mcp/oauth-provider.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/mcp/oauth-utils.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/tools/mcp-client.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/config/config.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/cli/src/config/extension-manager.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/cli/src/config/extensions/github.ts
- https://github.com/google-gemini/gemini-cli/blob/v0.66.0/packages/cli/src/config/extensions/update.ts
- https://github.com/google-gemini/gemini-cli/blob/v0.66.0/packages/cli/src/config/trustedFolders.ts
- https://github.com/google-gemini/gemini-cli/blob/main/packages/cli/src/config/extensions/consent.ts
- https://github.com/google-gemini/gemini-cli/issues/29395
- https://github.com/google-gemini/gemini-cli/issues/29909
- https://github.com/google-gemini/gemini-cli/issues/29817
- https://geminicli.com/extensions.json
- https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/
- https://antigravity.google/docs/cli/gcli-migration
- https://app.smpl.money/.well-known/oauth-authorization-server
