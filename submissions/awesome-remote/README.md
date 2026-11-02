# Awesome Remote MCP Servers

A pull request to
[punkpeye/awesome-remote-mcp-servers](https://github.com/punkpeye/awesome-remote-mcp-servers)
adds the three lines in [entry.md](entry.md) to the list's Finance section. The
list takes an entry only with a working Glama connector badge, and Glama builds
the connector page from the MCP Registry, so this listing comes after the
registry. Where it stands next to the others:
[submissions/README.md](../README.md).

## Order

Each step depends on the one before it, except the star, which only has to come
before the PR.

1. **Publish to the MCP Registry.** Release as
   [mcp-registry.md](../mcp-registry.md) describes. The `name` in `server.json`,
   `money.smpl/simple-balance`, becomes the Glama slug.

   Check: this prints `200` (it prints `404` today). `npm run check:live` also
   reports whether the entry is published.

   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' 'https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest'
   ```

2. **Wait for Glama's connector page.** Glama imports registry entries on its
   own. On 2026-11-02, entries published to the registry that day were on Glama
   the same day. Don't open the PR until this prints `200` (it prints `404`
   today):

   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' https://glama.ai/mcp/connectors/money.smpl/simple-balance
   ```

   Open it sooner and CI labels the PR `invalid-format` and comments that the
   badge doesn't resolve. CONTRIBUTING: "The badge is required. PRs that add an
   entry without one are not merged." If the page hasn't appeared after a few
   days, read the Glama section of [mcp-registry.md](../mcp-registry.md#glama) before
   listing the server by hand: a listing made by hand can end up under another
   slug, and `npm run check` requires the badge slug to equal the `name` in
   `server.json`.

   Optional: claim the Glama connector and set its OAuth test profile first,
   as [mcp-registry.md](../mcp-registry.md#glama) describes. Until the test profile
   exists, Glama shows an OAuth connector as unhealthy with no tools, and
   CONTRIBUTING says the badge "shows tool definition quality and endpoint
   health". Unconfirmed: whether the badge then shows a low score. CI doesn't
   check the score.

3. **Star the repository** with the GitHub account that will open the PR.
   CONTRIBUTING: "PRs are not merged unless the account opening them has
   starred the repo." The star is public, so it's your call:

   ```bash
   gh api -X PUT user/starred/punkpeye/awesome-remote-mcp-servers
   ```

   Check: `gh api -i user/starred/punkpeye/awesome-remote-mcp-servers | head -1`
   prints `HTTP/2.0 204 No Content`. It prints `HTTP/2.0 404 Not Found` while
   the repository isn't starred.

4. **Open the PR**, as the next sections describe.

## The entry

[entry.md](entry.md) holds the exact three lines. Copy them from the file, not
by retyping:

1. The name, linked to the docs page (CONTRIBUTING wants the product's homepage
   or docs, not a GitHub repository), then the endpoint in backticks, "exactly
   as a user would paste it into a client".
2. Two spaces, then the Glama badge. Its slug is the registry `name`. If
   `server.json` falls back to `io.github.thtmnisamnstr/simple-balance` (see
   [mcp-registry.md](../mcp-registry.md)), change both URLs on this line to
   that slug, and check that connector page instead in step 2 above.
   `npm run check` fails until this line matches `server.json`.
3. Two spaces, the 🔐 marker, ` - `, and one sentence ending in a period.
   CONTRIBUTING allows 120 characters; this one is 99. 🔐 is right because CI
   reads a `401` whose `WWW-Authenticate` contains `resource_metadata` or
   `Bearer` as OAuth, and `/mcp` answers that way.

## Where it goes

In the list's `README.md`, under `### 💰 <a name="finance"></a>Finance`, in
case-insensitive alphabetical order. On 2026-11-02 that put it after Silicon
Floor (README line 2217) and before Skavio USDC Payment Verification & Proof MCP
(line 2220). The README changes every day, so check the neighbors again in your
fork:

```bash
awk '/^### /{f=($0 ~ /name="finance"/)} f && tolower($0) ~ /^- \[s[i-k]/{print NR": "substr($0,1,60)}' README.md
```

A few entries at the end of the section are out of order: `skanfirmy`, for one,
sits after `xupersplit`. Place the entry by the rule, not next to those.

## Open the PR

Run these from the folder that holds your `simple-balance-mcp-connectors`
checkout, after the [Order](#order) steps 1 to 3.

1. Fork, clone and branch:

   ```bash
   gh repo fork punkpeye/awesome-remote-mcp-servers --clone
   cd awesome-remote-mcp-servers
   git switch -c add-simple-balance
   ```

2. Insert the three lines above the entry that should follow Simple Balance.
   That was Skavio on 2026-11-02; change the pattern if the neighbors changed.
   This is macOS `sed`; on Linux, drop the `''`.

   ```bash
   next=$(grep -n '^- \[Skavio USDC' README.md | cut -d: -f1)
   sed -i '' "$((next - 1))r ../simple-balance-mcp-connectors/submissions/awesome-remote/entry.md" README.md
   git diff
   ```

   Check: `git diff` shows three added lines between the Silicon Floor and
   Skavio entries, and no other change.

3. Commit and push:

   ```bash
   git commit -am "Add Simple Balance to Finance"
   git push -u origin add-simple-balance
   ```

4. Open the PR with the command below. Its body fills in the list's PR
   template: **Server**, **Endpoint** and four checkboxes, with the template's
   HTML comment removed, as the comment asks. Each box is true once steps 1 and
   2 of [Order](#order) and the check in step 2 here have passed. The last line
   describes the server, which CONTRIBUTING asks the PR to do.

```bash
gh pr create -R punkpeye/awesome-remote-mcp-servers --base main \
  --head thtmnisamnstr:add-simple-balance \
  --title "Add Simple Balance to Finance" \
  --body-file - <<'EOF'
**Server:** Simple Balance
**Endpoint:** `https://app.smpl.money/mcp`

- [x] The endpoint is public and answers an MCP `initialize` request
- [x] Entry is in the correct category, in alphabetical order
- [x] Entry has its Glama connector badge on the second line
- [x] Auth marker matches what the endpoint actually does

Simple Balance keeps one person's double-entry ledger. Its hosted server reads balances, budgets and reports, and stages or records transactions within the OAuth scopes the person approves. Sign-up is free.
EOF
```

CONTRIBUTING asks automated agents to add `🤖🤖🤖` to the end of the title, which
it says fast-tracks the merge. Add it only if an agent opens the PR for you.

## CI checks

The **Check Submission** workflow runs when the PR is opened, edited or pushed
to. It reads only the README lines the PR adds, and finds an entry by its first
line, using the same pattern `npm run check` applies to entry.md.

| Check | Passes when | If it fails |
| --- | --- | --- |
| Badge | Line 2 is a Glama connector badge | `missing-connector` label and a comment |
| Glama connector | The badge's page, `https://glama.ai/mcp/connectors/<slug>`, answers `200` | `invalid-format` label and a comment |
| Format | Line 3 has an auth marker (🔓, 🔑 or 🔐), no other emoji, and a description ending in a period | `invalid-format` label and a comment |
| Endpoint | An unauthenticated `initialize` POST (protocol `2025-06-18`, 20-second timeout) gets a JSON-RPC result, or any `401` or `403` | `endpoint-unreachable` label and a comment |
| Auth marker | The marker matches what CI read from the response: 🔓 for a JSON-RPC result; for a `401` or `403`, 🔐 when `WWW-Authenticate` contains `resource_metadata` or `Bearer`, and 🔑 otherwise | A comment |
| Duplicate | The endpoint isn't listed yet, ignoring case and a trailing slash | `duplicate` label and a comment |

Check: the PR carries `endpoint-ok` and `has-connector`, and none of the
failure labels:

```bash
gh pr view <number> -R punkpeye/awesome-remote-mcp-servers --json labels --jq '.labels[].name'
```

If a check fails, fix [entry.md](entry.md) first so `npm run check` agrees,
then fix the fork's README and push. The workflow runs again on every push and
on every edit to the PR.

## Review and merge

- The maintainer merges in batches. Over the 1,500 most recently merged PRs,
  the median wait from opening to merge was 2.6 days, 90% merged within about
  10 days, and the longest took 35. On 2026-11-02, 1,702 PRs were open. Every
  merged PR had `endpoint-ok`.
- If a `merge-conflict` label appears, rebase onto the list's `main` and push.
  If the conflict is in our three lines, insert them again as in step 2 of
  [Open the PR](#open-the-pr).

  ```bash
  git fetch upstream
  git rebase upstream/main
  git push --force-with-lease
  ```

- After the merge, a bot comment offers a "server-author" flair in the MCP
  Discord at glama.ai/mcp/discord.
- To change the entry later, open another PR and say it's an edit. CI checks
  only entries whose endpoint isn't listed yet, so an edit gets
  `missing-connector`, plus `duplicate` if it touches the first line.
- Keep `/mcp` answering `401` with its `WWW-Authenticate` challenge, and keep
  the Glama connector: the badge shows readers the endpoint's health.
  `npm run check:live` fails if the challenge changes.

Unconfirmed: when the next batch lands. Batches have come every 1 to 10 days
since the list started on 2026-09-08.

## Sources

- https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/CONTRIBUTING.md
- https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/.github/PULL_REQUEST_TEMPLATE.md
- https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/.github/workflows/check-submission.yml
- https://github.com/punkpeye/awesome-remote-mcp-servers/blob/main/README.md
- https://github.com/punkpeye/awesome-remote-mcp-servers/commits/main
- https://glama.ai/mcp/connectors
- https://glama.ai/mcp/connectors/money.smpl/simple-balance
- https://registry.modelcontextprotocol.io/v0.1/servers?search=hundo
- https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest
