# Publishing to the MCP Registry

| | |
| --- | --- |
| Registry | https://registry.modelcontextprotocol.io (free, no account, no review by hand) |
| Name | `money.smpl/simple-balance` |
| Proof of the name | An Ed25519 key whose public half is a TXT record at the apex of `smpl.money` |
| Published from | [`server.json`](../server.json), by [`release.yml`](../.github/workflows/release.yml) on a `v*` tag |
| Key in CI | Secret `MCP_REGISTRY_PRIVATE_KEY` in the GitHub environment `mcp-registry` |
| Entry | https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest |
| On 2026-11-02 | Not published. No TXT record, no `mcp-registry` environment |

Steps 1 to 4 are one-time setup, and step 4 is optional. Then
[release](#5-release) and [check the entry](#6-check-the-entry). Downstream,
[Glama](#glama),
[GitHub and VS Code](#github-mcp-registry-and-vs-code) and
[MCP.Directory](#mcpdirectory) each need an action from you.
[PulseMCP](#pulsemcp) and the [mirrors](#mirrors-and-graders) need none.

## The name

`money.smpl` is `smpl.money` reversed. The registry checks that a publisher
controls the namespace, and a TXT record on `smpl.money` proves `money.smpl/*`.
It never checks who controls the remote URL, so the name is what shows that
the entry and `app.smpl.money` come from the same publisher. For a remote on
your own domain, the registry's docs suggest DNS or HTTP proof for this reason.
The name also doesn't depend on the GitHub account or on where this repository
lives.

Publish one name, once:

- A name is permanent. Moving to another means setting every version of the
  old one to `deleted` and publishing the new one, and every listing keyed on
  the old name breaks: the Glama URL, GitHub's entry, the awesome-remote badge.
- Each remote URL can belong to only one name that isn't deleted, and the
  registry's terms forbid "repeatedly posting the same or similar MCP servers
  under different names".
- Publish soon. Until then anyone can publish `https://app.smpl.money/mcp`
  under a name of their own, and the registry would refuse ours until its
  maintainers act on an `Abuse report:` issue.

### Fallback: `io.github.thtmnisamnstr/simple-balance`

Use it only if the DNS record can't be set up, and only before the first
publish. It needs no key, record or secret: a GitHub Actions run in a
repository that `thtmnisamnstr` owns proves `io.github.thtmnisamnstr/*` by
itself.

1. In `server.json`, set `"name": "io.github.thtmnisamnstr/simple-balance"`.
2. In `submissions/awesome-remote/entry.md`, line 2, replace
   `money.smpl/simple-balance` with `io.github.thtmnisamnstr/simple-balance` in
   both Glama URLs.
3. Skip steps 1 and 2 and the secret in step 3. `release.yml` reads the
   namespace from `server.json` and runs `mcp-publisher login github-oidc`
   instead, and its publish job already has `id-token: write`. Still create the
   environment, or GitHub creates it on the first run without the tag rule.
4. In the rest of this guide, read `io.github.thtmnisamnstr%2Fsimple-balance`
   for `money.smpl%2Fsimple-balance`, and claim Glama with
   **Claim with GitHub** instead of a DNS record.

Check: `npm run check` passes. It fails while the badge line and `server.json`
name different servers.

## 1. Generate the signing key

Do this once, on your Mac, outside the repository: `.gitignore` doesn't cover
`key.pem`, so a key made inside the repository can end up in a commit. The
system `/usr/bin/openssl` is LibreSSL, which stops with
`Algorithm Ed25519 not found`, so use Homebrew's OpenSSL 3.

```bash
brew install openssl@3                      # skip if it's installed
OPENSSL="$(brew --prefix openssl@3)/bin/openssl"
"$OPENSSL" version                          # OpenSSL 3.x
KEYDIR="$(mktemp -d)"
cd "$KEYDIR"
(umask 077; "$OPENSSL" genpkey -algorithm Ed25519 -out key.pem)
PUBLIC_KEY="$("$OPENSSL" pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"
PRIVATE_KEY="$("$OPENSSL" pkey -in key.pem -noout -text | grep -A3 'priv:' | tail -n +2 | tr -d ' :\n')"
```

`PUBLIC_KEY` goes in the TXT record. `PRIVATE_KEY`, the key's 32-byte seed as
hex, goes in the GitHub secret and in `mcp-publisher login dns`.

Check: `echo "${#PUBLIC_KEY} ${#PRIVATE_KEY}"` prints `44 64`.

Save `key.pem` in your password manager. Keep this terminal open through step
4 (step 3 if you skip the dry run), then delete the file and its directory:
`rm "$KEYDIR/key.pem" && rmdir "$KEYDIR"`. To get the two values back later,
run the `OPENSSL`, `KEYDIR` and `cd` lines, save `key.pem` from the password
manager into that directory, run the `PUBLIC_KEY` and `PRIVATE_KEY` lines, and
delete the file the same way when you're done.

## 2. Add the TXT record in Cloudflare

1. Copy the record: `printf 'v=MCPv1; k=ed25519; p=%s' "$PUBLIC_KEY" | pbcopy`
2. Open https://dash.cloudflare.com, choose the `smpl.money` zone, then
   **DNS > Records**.
3. Choose **Add record** and fill it in:

   | Field | Value |
   | --- | --- |
   | **Type** | `TXT` |
   | **Name** | `@` |
   | **Content** | `v=MCPv1; k=ed25519; p=<PUBLIC_KEY>`, pasted without quotes (Cloudflare adds them) |
   | **TTL** | `Auto` |

4. Choose **Save**.

The record must sit at the apex, `@`. Under a name such as `_mcp-auth`, the
registry doesn't find it and login fails. Keep the two TXT records already on
`smpl.money`: `v=spf1 include:_spf.mx.cloudflare.net ~all` for mail and
`google-site-verification=…` for Google. Add a third record rather than
editing either of them.

Check, within five minutes (Cloudflare's `Auto` TTL is 300 seconds):

```bash
dig TXT smpl.money +short                                       # three records
dig @1.1.1.1 TXT smpl.money +short | grep -F "p=$PUBLIC_KEY"    # the MCPv1 record
```

No output from the second command means the record is missing or holds a
different key.

## 3. Create the `mcp-registry` environment and secret

Do this before the first `v*` tag. The publish job in `release.yml` runs in
the environment `mcp-registry`, and if the environment doesn't exist, GitHub
creates it on that run with no protection rules. Keep the key in the
environment's secrets, not the repository's: an environment secret reaches only
jobs that use the environment, and only after its rules pass.

In the browser:

1. Open
   https://github.com/thtmnisamnstr/simple-balance-mcp-connectors/settings/environments
   and choose **New environment**. Name it `mcp-registry` and choose
   **Configure environment**.
2. In the **Deployment branches** dropdown, choose
   **Selected branches and tags**, then **Add deployment branch or tag rule**.
   Set **Ref type** to **Tag**, enter `v*` and choose **Add rule**. A run from a
   branch then never receives the key.
3. Optional: select **Required reviewers**, add `thtmnisamnstr` and choose
   **Save protection rules**, so each publish waits for your approval. Leave
   **Prevent self-review** off, or you can't approve your own release.
4. Run `printf '%s' "$PRIVATE_KEY" | pbcopy`. Under **Environment secrets**,
   choose **Add Secret**, name it `MCP_REGISTRY_PRIVATE_KEY`, paste the value
   and choose **Add secret**. Then clear the clipboard with
   `pbcopy < /dev/null`.

Or in the terminal, with `gh` signed in as `thtmnisamnstr` and holding the
`repo` scope:

```bash
REPO=thtmnisamnstr/simple-balance-mcp-connectors
gh api -X PUT "repos/$REPO/environments/mcp-registry" \
  -F 'deployment_branch_policy[protected_branches]=false' \
  -F 'deployment_branch_policy[custom_branch_policies]=true'
gh api -X POST "repos/$REPO/environments/mcp-registry/deployment-branch-policies" \
  -f name='v*' -f type=tag
printf '%s' "$PRIVATE_KEY" | gh secret set MCP_REGISTRY_PRIVATE_KEY --env mcp-registry --repo "$REPO"
```

Check:

```bash
gh api "repos/$REPO/environments/mcp-registry" --jq .deployment_branch_policy
gh api "repos/$REPO/environments/mcp-registry/deployment-branch-policies" --jq '.branch_policies[] | {name, type}'
gh secret list --env mcp-registry --repo "$REPO"
```

Expect `custom_branch_policies` true and `protected_branches` false, one rule
`v*` of type `tag`, and a `MCP_REGISTRY_PRIVATE_KEY` row.

## 4. Optional dry run

This tests the record and the key before a tag depends on them. From the
repository root, in the terminal that holds `PRIVATE_KEY`:

```bash
brew install mcp-publisher            # 1.8.7, the version release.yml pins
mcp-publisher validate server.json    # expect: server.json is valid
mcp-publisher login dns --domain smpl.money --private-key "$PRIVATE_KEY"
mcp-publisher logout
```

`validate` sends `server.json` to the registry's validation endpoint and
publishes nothing. `login dns` prints the `Expected proof record:` it derives
from the key. If login fails, compare that line with
`dig TXT smpl.money +short`. Don't run `mcp-publisher publish`: a publish by
hand uses up `1.0.0`, and the tag's run then fails with `already exists`.

Instead of Homebrew, `./scripts/install-mcp-publisher.sh` downloads the same
pinned release into the repository root and checks its Sigstore signature, as
CI does. It needs `cosign` (`brew install cosign`). Run the binary as
`./mcp-publisher`.

## 5. Release

Merge `connectors-setup` into `main` through a pull request, so `check.yml`
runs on it, then tag the merge commit. The first release publishes `1.0.0`,
the version every manifest carries now.

```bash
git switch main
git pull --ff-only
jq -r .version server.json   # 1.0.0
git tag v1.0.0
git push origin v1.0.0
```

Later releases follow [Releasing](../README.md#releasing) in the README:
`npm run set-version -- X.Y.Z`, merge, tag `vX.Y.Z`, and push one release tag
at a time (the README says why). The tag starts
[`release.yml`](../.github/workflows/release.yml):

| Job | What it does | It stops the release when |
| --- | --- | --- |
| `resolve` | Records the commit the tag points at | |
| `check` | Runs `check.yml` on that commit: `npm run check`, Claude Code's `plugin validate`, Gemini CLI's `extensions validate`, `mcp-publisher validate`, and the Cline and Docker validators. Builds the OpenAI ZIP and uploads it as the artifact `openai-plugin-zip` | Any check fails |
| `publish-registry` | In environment `mcp-registry`: runs `npm run check -- --tag=<tag> --live`, installs `mcp-publisher` 1.8.7 after checking its Sigstore signature, logs in (DNS with `MCP_REGISTRY_PRIVATE_KEY` for `money.smpl`, GitHub OIDC for an `io.github.` name), runs `mcp-publisher publish server.json`, then reads the entry back from the registry | The tag isn't `v` plus the manifests' version, a live probe fails, the secret is missing, login fails, or the version exists already |

Downloading the ZIP into `dist/` and uploading it are in
[openai.md](openai.md#build-the-zip). Don't attach it to a GitHub Release:
Gemini CLI installs from a release's only asset, so a release carrying the ZIP
breaks `gemini extensions install`.

### If the release fails

| What the log shows | What to do |
| --- | --- |
| A failure in the `check` job | Nothing was published. Delete the tag (`git push origin :refs/tags/v1.0.0`, then `git tag -d v1.0.0`), merge the fix and tag the new merge commit |
| `the tag is v…, but the manifests say …` | The tag and `server.json` disagree. Delete the tag the same way and tag `v` plus the version |
| `The mcp-registry environment has no MCP_REGISTRY_PRIVATE_KEY secret` | Add the secret to the environment (step 3), then choose **Re-run jobs > Re-run failed jobs** |
| `no MCP public key found in DNS TXT records`, or `… but one was found at "_mcp-auth.smpl.money"` | The record is missing, not visible yet, or under a selector. Recreate it with **Name** `@`, wait five minutes and re-run the failed jobs |
| `signature verification failed` | The TXT record doesn't hold the public half of the secret's key. Compare `dig TXT smpl.money +short` with `PUBLIC_KEY`, fix the record or the secret, and re-run |
| `remote URL https://app.smpl.money/mcp is already used by server …` | Another name claimed the URL first. Open an issue titled `Abuse report: …` at https://github.com/modelcontextprotocol/registry/issues |
| `… already exists` | The version is published already and can't be reused. If only a later step failed, the entry is live: check it (step 6). Otherwise release the next patch version |
| `answers 404` or another live-check failure | `app.smpl.money` or a page a listing links to didn't answer as expected. Fix it and re-run the failed jobs |
| `Canceling since a higher priority waiting request for release exists` | A newer tag's run replaced this one while it waited, so nothing ran and nothing was published for this tag. Once no release is running, re-run it with `gh run rerun <run-id>` |

## 6. Check the entry

```bash
curl -s "https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest" \
  | jq '{name: .server.name, version: .server.version, remote: .server.remotes[0].url, official: ._meta["io.modelcontextprotocol.registry/official"]}'
```

Expect `money.smpl/simple-balance`, `1.0.0`, `https://app.smpl.money/mcp`,
`"status": "active"` and `"isLatest": true`. Send the slash in the name as
`%2F`: an unencoded slash returns 404. The same entry in a browser:
https://registry.modelcontextprotocol.io/?q=money.smpl%2Fsimple-balance.
`npm run check:live` also reports which version is published.

## After the first release

### Versions are immutable

Every publish needs a version this name has never used. The registry refuses a
repeat with `cannot publish duplicate version`, even when the earlier version
was deleted, and a published version can't be edited. To change anything in
`server.json`, release a new version. The highest version becomes the latest
on its own, so older versions need no deprecating.

### Deprecate or remove the listing

Status changes run from your Mac with the key, not from CI. Log in first with
`PRIVATE_KEY` (step 1 shows how to get it back from `key.pem`). The registry's
token lasts five minutes, so run the status command right after.

```bash
mcp-publisher login dns --domain smpl.money --private-key "$PRIVATE_KEY"
mcp-publisher status --status deprecated --message "Use 1.0.1 or later." money.smpl/simple-balance 1.0.0
mcp-publisher status --status deprecated --all-versions --message "The Simple Balance MCP server is retired." money.smpl/simple-balance
```

| Status | Effect |
| --- | --- |
| `deprecated` | Still listed, with the message (500 characters at most) shown as a warning |
| `deleted` | Hidden from default listings, and the remote URL is free for another name. The record is kept, and `--status active` restores it |
| `active` | The normal state. `--message` isn't allowed |

Deprecating a version doesn't move "latest". Deleting it does, to the highest
version left.

### Rotate the key

The registry reads every MCPv1 record on `smpl.money` and accepts a signature
from any of them, so an old and a new key can overlap. The registry's
authentication page also warns that a stale record "will be tried first and
cause verification to fail", but its code (`common.go`) and the same page's
troubleshooting section both try every record.

1. Generate a new key (step 1) in a new terminal.
2. Add a second TXT record at `@` with the new `PUBLIC_KEY` (step 2). Leave the
   old one.
3. Replace the secret:
   `printf '%s' "$PRIVATE_KEY" | gh secret set MCP_REGISTRY_PRIVATE_KEY --env mcp-registry --repo thtmnisamnstr/simple-balance-mcp-connectors`
4. Test the new key: `mcp-publisher login dns --domain smpl.money --private-key "$PRIVATE_KEY"`,
   then `mcp-publisher logout`.
5. Delete the old TXT record, replace `key.pem` in your password manager, then
   delete the new file: `rm "$KEYDIR/key.pem" && rmdir "$KEYDIR"`.

Check: `dig TXT smpl.money +short` shows one MCPv1 record, and its `p=` value
is the new `PUBLIC_KEY`.

### If the key leaks

The key lets whoever holds it publish versions under `money.smpl/` and
`money.smpl.*`, and deprecate or delete the existing ones, for as long as its
TXT record exists.

1. Delete the MCPv1 TXT record in Cloudflare. New logins fail once resolvers
   drop the cached record, within five minutes, and a registry token issued
   before then expires within five minutes too.
2. Generate a new key, add its record and replace the secret (rotation steps 1
   to 3).
3. List every version and every name under the namespace, deleted ones
   included, and compare them with `git tag --list 'v*'`. The first command
   returns every version of `money.smpl/simple-balance` in one response. The
   name list comes a page at a time (30 rows unless `limit` asks for up to
   100), so the loop follows `nextCursor` to the last page and prints one row
   per name, with its latest version and status. Expect at least the
   `money.smpl/simple-balance` row.

   ```bash
   curl -s "https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions?include_deleted=true" \
     | jq -r '.servers[] | [.server.version, ._meta["io.modelcontextprotocol.registry/official"].status, ._meta["io.modelcontextprotocol.registry/official"].publishedAt] | @tsv'
   cursor=""
   while :; do
     page="$(curl -s "https://registry.modelcontextprotocol.io/v0.1/servers?search=money.smpl&include_deleted=true&version=latest&limit=100&cursor=$(jq -rn --arg c "$cursor" '$c | @uri')")"
     printf '%s\n' "$page" | jq -r '.servers[] | [.server.name, .server.version, ._meta["io.modelcontextprotocol.registry/official"].status] | @tsv'
     cursor="$(printf '%s\n' "$page" | jq -r '.metadata.nextCursor // empty')"
     [ -n "$cursor" ] || break
   done
   ```

   To see the versions of another name the loop prints, run the first command
   with that name, its slash written `%2F`.

4. Log in with the new key. Set each version or name you didn't publish to
   `deleted` with
   `mcp-publisher status --status deleted --message "Not published by Simple Balance." <name> <version>`
   (or `--all-versions` for a whole name), and set your own versions back with
   `--status active`. Then replace `key.pem` in your password manager with the
   new one and run `rm "$KEYDIR/key.pem" && rmdir "$KEYDIR"`.
5. If something can't be undone, open an issue at
   https://github.com/modelcontextprotocol/registry/issues.

## Downstream listings

Each of these reads the registry entry, so start them once step 6 shows it
active.

### Glama

Glama lists registry entries as connectors. Its methodology page says it
"ingests and re-publishes everything in the official registry", and on
2026-11-02, remote servers first published to the registry that day were on
Glama the same day. Listing, claiming and health checks are free. **Boost**,
at $49 a month per listing, is optional paid placement.

1. The day after the release, open
   https://glama.ai/mcp/connectors/money.smpl/simple-balance. It answers 404
   until the import. The awesome-remote entry links here; see
   [awesome-remote/README.md](awesome-remote/README.md).

   Check: `curl -s -o /dev/null -w '%{http_code}\n' https://glama.ai/mcp/connectors/money.smpl/simple-balance`
   prints `200`.

   If it still prints `404` a few days after the release, confirm the
   registry entry is active (step 6) and keep waiting rather than adding it
   under **Add Server**. A connector added by hand gets a slug Glama chooses
   (unconfirmed which), while the awesome-remote badge and `npm run check`
   expect `money.smpl/simple-balance`.
2. Expect **Unhealthy** and no tools. Glama's health check connects as a
   client, `/mcp` answers it with 401, and "only healthy connectors are
   indexed" for search. The test profile in step 4 fixes both.
3. Claim the listing. Sign in at https://glama.ai, open the listing and choose
   **Claim ownership**. Glama verifies a domain namespace through its domain
   (`com.example/server` through `example.com`), so expect `smpl.money`, but
   use whichever domain the claim panel names.
   - DNS, which needs no deploy: in Cloudflare, add a TXT record with
     **Name** `_glama-claim` and **Content** the value the panel shows, then
     choose **Check** in Glama.
   - HTTP: serve the JSON the panel shows at
     `https://smpl.money/.well-known/glama.json`. That takes a deploy of the
     website, and whether its static export publishes `.well-known/` files is
     unverified.

   Leave the record in place. Glama re-checks it daily, and when it can't find
   the token it emails you and removes access after seven days.
4. Add a test profile, so Glama can sign in and list the tools:
   1. Create a Simple Balance account at https://app.smpl.money for Glama
      alone, and keep it empty. Don't connect your own ledger or the reviewer
      account in [reviewer-account.md](reviewer-account.md): the profile gives
      Glama a standing grant, and the consent screen grants every requested
      scope or none, so the grant can't be narrowed. app.smpl.money verifies
      each account's email before it signs in, so the account needs an address
      of its own, such as a second routed address at smpl.money.
   2. On the listing, open **Admin > Test Profile** and set
      **Authentication Type** to **OAuth 2.0**. Leave
      **Use localhost redirect URI** off: Glama's own callback registers
      through dynamic client registration.
   3. Before authenticating, expand
      **What Glama sends to your authorization server** and read `scope`.
      What Glama requests, and whether you can change it, is unconfirmed
      until you see it. Where the profile lets you set the scope, use
      `openid profile email offline_access ledger:read`. Read-only is enough
      for a health check, and without `offline_access` the server issues no
      refresh token, so the profile stops working when the one-hour access
      token expires. An empty `scope` gets the server's default,
      `openid profile email ledger:read`, which lacks `offline_access`;
      [prerequisites.md](prerequisites.md#15-scope-in-the-first-401) covers
      that default.
   4. Authenticate, sign in as the Glama account and choose **Allow access**.
   5. Choose **Test Connection**.

   Check: after the next health check the listing reads **Healthy** and lists
   37 tools for a read-only grant (42 with `ledger:stage`, 77 with
   `ledger:write`). Health checks list tools, prompts and resources and never
   call a tool, so nothing is written to the account. If the listing turns
   **Unhealthy** later, authenticate the profile again.
5. Optional: by default a registry release replaces the Glama listing's name,
   description and URL. To keep edits made on Glama, open
   **Manage connector** and turn on
   **Use Glama listing details as the source of truth**.
6. Optional: Glama's site code shows more listing fields after a claim, all
   unconfirmed until you see them: up to three categories (choose Finance), a
   thumbnail (square PNG, JPEG or WebP, at most 2 MB;
   `assets/logo-512.png` fits), an internal support contact, and publisher
   details. For the publisher, the operator is Gavin Johnson, the website
   `https://smpl.money/`, the docs `https://smpl.money/docs/agents-and-mcp/`
   and the privacy policy `https://smpl.money/privacy/`; Simple Balance's own
   developer runs it, so it isn't a third party.

### GitHub MCP Registry and VS Code

GitHub's MCP Registry (https://github.com/mcp, API at
https://api.mcp.github.com) doesn't copy the official registry by itself.
Onboarding a new server is "a manual curation process", and after it, new
versions sync from the official registry with no further request. VS Code's
MCP gallery reads this registry (VS Code 1.144 sets `mcpGallery.serviceUrl` to
`https://api.mcp.github.com`), so onboarding also lists Simple Balance in VS
Code, under the **MCP Gallery** source of its **Browse** page. Install links
and commands work without it; see [vscode-copilot.md](vscode-copilot.md).

1. Wait until step 6 shows the entry active and latest.
2. Confirm GitHub doesn't list it yet:
   `curl -s "https://api.mcp.github.com/v0.1/servers?search=money.smpl" | jq .metadata.count`
   prints `0`.
3. Signed in as `thtmnisamnstr`, open
   https://github.com/github/github-mcp-server/discussions/1257, paste the
   comment below and choose **Comment**. It carries the fields the thread's
   pinned notes ask for. If a later version is live by then, change the
   **Version** row. The discussion was marked answered and closed on
   2026-07-02, but it isn't locked and still gets onboarding requests. Its
   accepted answer, from May 2026, says onboarding is still curated by hand.
   Whether staff act on comments in a closed thread is unconfirmed, so do
   step 4 as well.
4. Send the same text from `gavin@smpl.money` to `partnerships@github.com`,
   subject `GitHub MCP Registry onboarding: money.smpl/simple-balance`.
   GitHub's October 2025 blog post names that address. Whether anyone still
   reads it is unconfirmed. Sending as `gavin@smpl.money` needs
   [prerequisites.md, item 36](prerequisites.md#36-mail-from-gavin-and-infosmplmoney).
5. Every two weeks, run
   `curl -s -o /dev/null -w '%{http_code}\n' "https://api.mcp.github.com/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest"`.
   It prints `200` once Simple Balance is onboarded. Then, in VS Code 1.144 or
   later, run **Chat: Open Customizations**, select **Browse**, choose
   **MCP Gallery** in the source menu and search `Simple Balance`. The
   **GitHub Feed** source that VS Code's docs point to is a different list,
   and organization policy can turn **Browse** off or point the gallery at
   another registry, so trust the API check over what VS Code shows.

GitHub publishes no criteria or turnaround. Requests in the thread have taken
from two weeks to eight months.

```markdown
### Onboarding request: Simple Balance (`money.smpl/simple-balance`)

Simple Balance is published to the official MCP Registry, and its entry is active and latest. Please add it to github.com/mcp.

| Field | Value |
| --- | --- |
| Registry name | [`money.smpl/simple-balance`](https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest), namespace verified by a DNS TXT record on `smpl.money` |
| Version | `1.0.0`, status `active`, `isLatest: true` |
| Remote endpoint | `https://app.smpl.money/mcp` (Streamable HTTP) |
| Auth | OAuth 2.1, discovered from the 401 `WWW-Authenticate` header (RFC 9728 and RFC 8414 metadata). Dynamic client registration, PKCE S256 and a consent screen on every grant. Scopes: `ledger:read`, `ledger:stage`, `ledger:write` |
| Repository | https://github.com/thtmnisamnstr/simple-balance |
| License | AGPL-3.0 |
| Docs | https://smpl.money/docs/agents-and-mcp/ |
| What it does | Connects an assistant to Simple Balance, a free budget app and spending tracker: ask about your accounts, spending and budgets, bring in a bank statement file, and queue or record transactions, as far as the person allows. 77 tools, each with a title and annotations. Tools outside the granted scopes are left out of `tools/list`. There's no automatic pull from a bank today, and it can't move money. |

Lookup: `curl -s "https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest"`
```

### MCP.Directory

MCP.Directory's submit page says it adds servers "via auto-discovery from the
official MCP Registry", but on 2026-11-02 its search found none of 11 remote
servers without a repository that were published to the registry in early
October, so plan on the form. [directories.md](directories.md#mcpdirectory)
has the form values, the **About** settings the form reads, the claim email and
the checks.

1. One to two weeks after the release, look for a listing:

   ```bash
   curl -s "https://mcp.directory/api/v1/servers?q=simple%20balance" \
     | jq -r '.servers[] | "\(.name)  https://mcp.directory/servers/\(.slug)"'
   ```

   Try `q=smpl` too.
2. If it's listed, claim it for a verified badge and edit access: email
   `hello@mcp.directory` from `info@smpl.money`, so the sender's domain matches
   the endpoint's, with the [claim email](directories.md#claim-email).
3. If it isn't listed, submit https://mcp.directory/submit with
   **GitHub Repository URL** `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors`,
   as [route 2](directories.md#route-2-the-form) describes. If the review turns
   that repository down for holding no server code, submit
   `https://github.com/thtmnisamnstr/simple-balance`, which holds the server's
   source.

Check: the lookup in step 1 finds the listing. Then claim it as in step 2.

### PulseMCP

Paused. Since September 2026 its submit page has said: "We are not accepting
new MCP server or client submissions right now, and we are not making changes
to existing listings." It says it will pick up servers from the official
registry "automatically once we are back", so the registry entry is all you
can do for now. The monthly check and the contact for a wrong listing are in
[directories.md](directories.md#pulsemcp).

### Mirrors and graders

Nothing to do. The sites on the registry's
[community projects](https://github.com/modelcontextprotocol/registry/blob/main/docs/community-projects.md)
page read the registry API and pick the entry up themselves, among them
ProtocolProbe, MCP Bench, MCP Registry UI, TeamSpark's registry browser,
PlugVet, polygraph, PulseFeed Drift Watch and MCP Verify. Graders that probe
the endpoint without a token get a 401 with OAuth discovery, which is the
expected answer.

Optional, a day after the release: look Simple Balance up at
https://protocolprobe.com, and enter `https://app.smpl.money/mcp` at
https://mcpverify.ai to see its grade.

Smithery shut down its submissions on 2026-10-31, so it needs nothing either
(see [directories.md](directories.md#smithery)).

## Open questions

- Registry: it is still a preview, where "breaking changes or data resets may
  occur before general availability". After a reset, check the entry (step 6)
  and release again if it's gone.
- GitHub: whether partnerships@github.com is still read; the curation criteria
  and turnaround; how github.com/mcp shows a name outside `io.github.` (its
  page data prefixes such names, as in `io.github.com.supabase/mcp`, while the
  API keeps the original).
- VS Code: what feeds the **GitHub Feed** source on the Browse page is
  undocumented.
- Glama: the scope its test profile requests (visible only after claiming);
  whether its health checks run often enough to keep the seven-day refresh
  token alive; whether its redirect check registers a new OAuth client each
  time; whether its crawler lists this repository as a server that never
  builds (if so, claim it as `thtmnisamnstr` and ask Glama to remove it).
- MCP.Directory: how often auto-discovery runs and which entries it takes;
  whether a repository without server code passes review; whether it reads the
  endpoint from the README or from `server.json`.
- PulseMCP: when it reopens, and whether its partner API keeps syncing from
  the registry in the meantime.
- HTTP proof instead of DNS: unverified whether the static export of
  `smpl.money` serves `/.well-known/` files. It matters only if the TXT record
  is dropped.

## Sources

- MCP Registry docs:
  [authentication](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx),
  [remote servers](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/remote-servers.mdx),
  [GitHub Actions](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/github-actions.mdx),
  [versioning](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/versioning.mdx),
  [FAQ](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/faq.mdx),
  [terms](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/terms-of-service.mdx),
  [CLI](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md),
  [API](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/official-registry-api.md),
  [community projects](https://github.com/modelcontextprotocol/registry/blob/main/docs/community-projects.md)
- MCP Registry code:
  [`common.go`](https://github.com/modelcontextprotocol/registry/blob/main/internal/api/handlers/v0/auth/common.go)
  (every published key is tried),
  [`registry_service.go`](https://github.com/modelcontextprotocol/registry/blob/main/internal/service/registry_service.go)
  (duplicate versions, latest after a status change),
  [`jwt.go`](https://github.com/modelcontextprotocol/registry/blob/main/internal/auth/jwt.go)
  (five-minute tokens)
- GitHub Actions:
  [managing environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments),
  [environments API](https://docs.github.com/en/rest/deployments/environments),
  [deployment branch policies API](https://docs.github.com/en/rest/deployments/branch-policies)
- Cloudflare:
  [TTL](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/),
  [record types](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/)
- Glama: [FAQ](https://glama.ai/mcp/faq),
  [methodology](https://glama.ai/mcp/methodology),
  [advertise](https://glama.ai/advertise); Better Auth's MCP plugin
  [token defaults](https://unpkg.com/better-auth@1.6.33/dist/plugins/mcp/index.mjs)
- GitHub MCP Registry and VS Code:
  [discussion #1257](https://github.com/github/github-mcp-server/discussions/1257),
  [GitHub blog, October 2025](https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/),
  [VS Code 1.105 release notes](https://github.com/microsoft/vscode-docs/blob/main/release-notes/v1_105.md),
  [VS Code 1.144 release notes](https://github.com/microsoft/vscode-docs/blob/main/release-notes/v1_144.md),
  [VS Code MCP servers](https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/mcp-servers.md),
  VS Code 1.144's
  [`customizationMarketplaceSources.ts`](https://github.com/microsoft/vscode/blob/1.144.0/src/vs/platform/customizationMarketplace/common/customizationMarketplaceSources.ts)
  (the **Browse** sources)
- [MCP.Directory submit page](https://mcp.directory/submit),
  [PulseMCP submit page](https://www.pulsemcp.com/submit),
  [Smithery](https://smithery.ai/future)
