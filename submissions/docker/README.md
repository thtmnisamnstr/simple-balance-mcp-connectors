# Docker MCP Catalog

A pull request to [docker/mcp-registry](https://github.com/docker/mcp-registry)
adds Simple Balance to the [Docker MCP Catalog](https://hub.docker.com/mcp) and
to Docker Desktop's MCP Toolkit. This folder holds the entry,
[`servers/simple-balance/`](servers/simple-balance/), laid out as it sits in
Docker's repository, and the PR body, [pull-request.md](pull-request.md). Where
this listing stands next to the others: [submissions/README.md](../README.md).

## Before you start

- **Expect a long wait, or no merge.** No net-new server from outside Docker
  has merged since 2026-04-30 (Okta,
  [#1014](https://github.com/docker/mcp-registry/pull/1014)). Every PR from a
  person merged since then edited, replaced or retooled an existing entry. On
  2026-11-02, 2,336 PRs were open, not counting Docker's pin-update bot. Docker
  publishes no review time, and neither its README nor CONTRIBUTING mentions a
  pause. Submit, but don't hold anything else for it.
- **Docker users don't have to wait for this PR.** Once the MCP Registry
  entry is live ([mcp-registry.md](../mcp-registry.md)), Docker Desktop 4.62 or
  later can add the server from it with
  `docker mcp profile server add <profile-id> --server https://registry.modelcontextprotocol.io/v0/servers/money.smpl%2Fsimple-balance`
  and authorize it in Docker Desktop. Unconfirmed: this route hasn't been
  tested end to end. Check it once the registry entry is live: add the server,
  authorize it, and ask a client connected to the gateway to run `whoami`.
- **Reviewer account.** Have the account from
  [reviewer-account.md](../reviewer-account.md) ready. Its credentials go
  through Docker's form after the PR exists, never in the PR.
- **Scopes.** Until the app change in
  [prerequisites.md](../prerequisites.md#15-scope-in-the-first-401) ships, a
  Docker connection that doesn't pass `--scopes` likely gets read-only access,
  inferred from the open-source gateway's code. See
  [Scopes Docker requests](#scopes-docker-requests).
- **Tools.** The GitHub CLI signed in as `thtmnisamnstr`, Go 1.24 or newer
  (Docker's `go.mod` says `go 1.24.0`) and Node, because Docker's validator
  runs `npx --yes prettier --check`. Docker Desktop is needed only for the
  optional end-to-end test.

## What the entry holds

Docker needs a folder of three files per server. CONTRIBUTING: "Include all
required files (`server.yaml`, `tools.json`, and `readme.md`)".

**`server.yaml`** is the catalog entry.

- `type: remote`: a hosted server. Docker builds and ships no image for it.
- `dynamic.tools: true`: the validator refuses any entry with an `oauth` block
  without it ("server with OAuth must have 'dynamic: tools: true'
  configuration"). It also stops Docker from listing tools anonymously, which
  would hit the `401`.
- `remote.url`: `https://app.smpl.money/mcp`, exactly the `resource` in the
  server's protected-resource metadata, with no trailing slash. Any difference
  and Docker's gateway stops at discovery ("protected resource metadata
  resource ... does not match requested resource ...").
- `oauth`: a provider, secret and env name in the pattern `task remote-wizard`
  writes. It carries no client ID, URLs or scopes, because Docker discovers the
  authorization server and registers its own client when someone connects.
- No `source` block. With `source.project` set, the validator looks up that
  repository's license and rejects any key starting with `gpl`, `agpl` or
  `npl`, and the app's repository is AGPL-3.0. None of the 41 OAuth remote
  entries in the catalog sets `source`. An AGPL submission
  ([#4943](https://github.com/docker/mcp-registry/pull/4943)) was withdrawn
  because of this check.
- `about.title` may not contain `MCP` or `Server`. `about.description` is 86
  characters with no final period: the catalog adds one, and Docker Hub cuts
  the card at about 97 characters. `about.icon` is
  `https://smpl.money/apple-touch-icon.png`, a 180x180 PNG that the validator
  fetches and decodes.
- `meta.category: finance`, the category of five existing entries, Stripe's
  local server among them. The tags include `remote`, as on every remote entry.

**`tools.json`** is `[]`. CONTRIBUTING: "The `tools.json` file is always an
empty array `[]` for remote servers because they use dynamic tool discovery."
Simple Balance lists its tools only after sign-in, and which ones depends on the
granted scopes. Docker's live catalog publishes `tools: []` for every OAuth
remote entry anyway, so don't generate a 77-tool file.

**`readme.md`** is lowercase because Docker's catalog generator reads only
`servers/<name>/readme.md`. CircleCI's `README.md` was ignored until
[#4743](https://github.com/docker/mcp-registry/pull/4743) renamed it. The file
starts with a `Docs:` line, and all of it becomes the body of the Docker Hub
overview page.

`npm run check` fails if `server.yaml` loses any of these rules or disagrees with
the other manifests, if `tools.json` stops being `[]`, or if `readme.md` stops
starting with `Docs:`. It warns if the description passes 97 characters.

## Open the pull request

The `docker` job in [check.yml](../../.github/workflows/check.yml) already runs
Docker's validator and catalog generator against this folder on every PR here,
at docker/mcp-registry commit `c1ff308` (Docker's `main` on 2026-11-02). Docker's
own CI builds those tools from its current `main` when your PR opens, so step 3
runs them again against today's code. To move this repository's pin, change the
`ref:` of the docker/mcp-registry checkout in that job.

Run these from the folder that holds your `simple-balance-mcp-connectors`
checkout, on a commit where `npm run check` passes.

1. Fork, clone and branch:

   ```bash
   gh repo fork docker/mcp-registry --clone
   cd mcp-registry
   git switch -c add-simple-balance
   ```

2. Copy the entry:

   ```bash
   cp -R ../simple-balance-mcp-connectors/submissions/docker/servers/simple-balance servers/
   ```

3. Run Docker's checks. These are the commands behind
   `task validate -- --name simple-balance`, `task build -- --tools simple-balance`
   and `task catalog -- simple-balance` in Docker's `Taskfile.yml`, so you don't
   need Task installed:

   ```bash
   go run ./cmd/validate --name simple-balance
   go run ./cmd/build --tools simple-balance
   go run ./cmd/catalog simple-balance
   ```

   Check:
   - `validate` exits without an error, and its lines include
     `✅ License validation skipped (remote server)`, `✅ Icon is valid` and
     `✅ OAuth dynamic configuration is valid`. A `⚠️ Icon` line means
     smpl.money stopped serving the icon.
   - `build` prints `✅ Build skipped for remote server simple-balance`.
   - `catalog` prints `Catalog written to catalogs/simple-balance/catalog.yaml`.
     Docker's `.gitignore` covers `catalogs/`, so it stays out of the commit.

4. Commit only the entry, and push:

   ```bash
   git add servers/simple-balance
   git commit -m "Add Simple Balance remote MCP server"
   git push -u origin add-simple-balance
   ```

5. Open the PR. Docker squashes an approved PR into one commit named after its
   title.

   ```bash
   gh pr create -R docker/mcp-registry --base main \
     --head thtmnisamnstr:add-simple-balance \
     --title "Add Simple Balance remote MCP server" \
     --body-file ../simple-balance-mcp-connectors/submissions/docker/pull-request.md
   ```

6. On the PR page, check the two boxes for `task validate` and `task build` if
   step 3 passed on this branch. Leave **Open Source**, **Docker Artifact** and
   **This server meets the basic requirements listed above** unchecked: the
   note under each says why. The app's source is AGPL-3.0, which the
   template's list of permissive licenses leaves out. A Docker artifact doesn't
   apply to a remote entry: the app repository's Dockerfile builds the whole
   self-hosted app, not a standalone MCP server.

Check: the PR's **Files changed** tab lists exactly
`servers/simple-balance/readme.md`, `servers/simple-balance/server.yaml` and
`servers/simple-balance/tools.json`.

[pull-request.md](pull-request.md) keeps the headings and checklist wording of
Docker's
[PULL_REQUEST_TEMPLATE.md](https://github.com/docker/mcp-registry/blob/main/.github/PULL_REQUEST_TEMPLATE.md)
verbatim, so they keep Docker's capitalization. It leaves out the template's
front matter (`name`, `about`, `labels` and the rest), as recent PRs that follow
the template do: they start at `## MCP Server Information`.

## Send the reviewer credentials

Docker's reviewers sign in to test a remote OAuth entry. The form asks for the
PR's URL, so fill it in after step 5:
[Docker MCP Catalog Submission - Share Testing Credentials](https://forms.gle/6Lw3nsvu2d6nFg8e6).

| Field | Value |
| --- | --- |
| **Docker MCP Registry PR URL** | The PR's URL, `https://github.com/docker/mcp-registry/pull/<number>` |
| **Your Email Address (in case we need to contact you privately)** | `gavin@smpl.money` |
| **Test Credentials (API key, username/password etc.)** | The reviewer account's email and password, from [reviewer-account.md](../reviewer-account.md) |
| **Additional Details** | The text below |

```text
Remote OAuth server, so there is no API key. Enable simple-balance and authorize it with every scope (CLI: docker mcp oauth authorize simple-balance --scopes "openid profile email offline_access ledger:read ledger:stage ledger:write"), sign in at app.smpl.money with the test account, and choose Allow access. The consent screen grants every requested scope or none. A client that requests no scope gets the read-only default, ledger:read, which lists the 37 read tools; ledger:stage and ledger:write add the staging and write tools, 77 in all. Ask the client to run whoami to see the granted scopes. The account holds sample data only.
```

Google Forms prints "Never submit passwords through Google Forms." at the bottom
of this form, and Docker's form asks for one anyway. That's why only the
reviewer account goes in it, never your own sign-in.

Then check the last box on the PR, **If the server requires credentials to test
it, I have shared test credentials using this form**.

Check: Google shows its confirmation page, and the PR's last box is checked.

## After you submit

- On a first contribution, GitHub holds the **Code and Server Validation** run
  until a maintainer approves it (a submitter reports this in
  [#6117](https://github.com/docker/mcp-registry/issues/6117)). **Trigger
  Security Review** shows as skipped on every PR from a fork; that's expected.
- If CI fails, fix the entry in this repository first, so `npm run check` and
  check.yml keep agreeing with what Docker has, then copy it to the fork again
  and push.
- `@docker/ai-tools-team` owns every path in the registry and reviews the PR.
  Observed waits for new entries: Bright Data's remote entry took 33 days
  ([#945](https://github.com/docker/mcp-registry/pull/945), merged 2026-02-16)
  and Okta's 90 ([#1014](https://github.com/docker/mcp-registry/pull/1014),
  merged 2026-04-30, the last new entry). CircleCI's took seven days
  ([#4686](https://github.com/docker/mcp-registry/pull/4686)), but it replaced
  an existing entry.
- CONTRIBUTING says an approved entry appears within 24 hours. Check: this
  prints `200` (it prints `404` today):

  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://hub.docker.com/mcp/server/simple-balance/overview
  ```

- Later changes go through a new PR, or an issue: Docker's README asks for an
  issue to change or remove an entry.

## What the listing shows

- **Owner `docker`, license `Apache License 2.0`.** Docker's catalog generator
  (`pkg/catalog/tile.go`) writes those two values for every entry that isn't a
  local `type: server`, so the Linear and Stripe remote entries show the same.
  It's Docker's generator, and nothing in `server.yaml` changes it.
- **No tools.** OAuth remote entries publish `tools: []`, so Docker Hub shows
  no tool list, and none of the tools' annotations, destructive hints included.

## Scopes Docker requests

Docker's open-source MCP Gateway picks the scopes it requests from two places:
the `scope` parameter of the `401` challenge, and a `scopes` field in the
protected-resource metadata. It doesn't use `scopes_supported`. Simple Balance
sends neither today: its challenge is
`Bearer resource_metadata="https://app.smpl.money/api/auth/.well-known/oauth-protected-resource"`.
So the gateway registers and authorizes with no scope, and the server grants
its default, `openid profile email ledger:read`. That's the 37 read tools, no
staging or writing, and no `offline_access`. Without `offline_access` the
server issues no refresh token, whatever the gateway's `access_type=offline`
says: Better Auth 1.6.33, which the app uses, ignores `access_type`. So a user
connected this way signs in again each time the one-hour access token expires.

A user can request scopes with
`docker mcp oauth authorize simple-balance --scopes "openid profile email offline_access ledger:read ledger:stage ledger:write"`,
as the reviewer note does. The open-source gateway adds them to the
authorization request, and to its client registration when it registers one.
Docker Desktop receives them too.

For everyone who doesn't pass `--scopes`, the fix is the app change in
[prerequisites.md](../prerequisites.md#15-scope-in-the-first-401), a `scope`
parameter on the `401`. `server.yaml` has no field that could carry scopes.

Unconfirmed: which scopes Docker Desktop's own sign-in requests, and whether it
honors `--scopes`. That code is closed source. Check both with the end-to-end
test below.

## Optional: test in Docker Desktop

CONTRIBUTING's commands, run in the fork after step 3:

```bash
docker mcp catalog import $PWD/catalogs/simple-balance/catalog.yaml
docker mcp server enable simple-balance
docker mcp oauth authorize simple-balance
docker mcp gateway run
```

Sign in with the reviewer account and choose **Allow access**. Connect a client
to the gateway and ask it to run `whoami`: its `scopes` show what Docker's
sign-in got. To check the reviewer note's command, stop the gateway, run the
`authorize` line again with the note's `--scopes` value, start the gateway and
run `whoami` again: all three ledger scopes should be listed. Finish with
`docker mcp catalog reset`.

Unconfirmed: these commands predate Docker Desktop's profiles. Docker's CLI
docs for Docker Desktop 4.62 and later add a server with
`docker mcp profile server add <profile-id> --server file://<path>`, start the
gateway with `docker mcp gateway run --profile <profile-id>`, and authorize
OAuth in Docker Desktop. Neither route has been tested.

## Sources

- https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md
- https://github.com/docker/mcp-registry/blob/main/README.md
- https://github.com/docker/mcp-registry/blob/main/.github/PULL_REQUEST_TEMPLATE.md
- https://github.com/docker/mcp-registry/blob/main/.github/CODEOWNERS
- https://github.com/docker/mcp-registry/blob/main/.github/workflows/ci.yaml
- https://github.com/docker/mcp-registry/blob/main/.github/workflows/security-review-trigger.yaml
- https://github.com/docker/mcp-registry/blob/main/scripts/ci-validation.sh
- https://github.com/docker/mcp-registry/blob/main/Taskfile.yml
- https://github.com/docker/mcp-registry/blob/main/cmd/validate/main.go
- https://github.com/docker/mcp-registry/blob/main/cmd/build/main.go
- https://github.com/docker/mcp-registry/blob/main/pkg/catalog/tile.go
- https://github.com/docker/mcp-registry/pull/945
- https://github.com/docker/mcp-registry/pull/1014
- https://github.com/docker/mcp-registry/pull/1568
- https://github.com/docker/mcp-registry/pull/4686
- https://github.com/docker/mcp-registry/pull/4743
- https://github.com/docker/mcp-registry/pull/4943
- https://github.com/docker/mcp-registry/issues/6117
- https://desktop.docker.com/mcp/catalog/v3/catalog.yaml
- https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/
- https://docs.docker.com/ai/mcp-catalog-and-toolkit/cli/
- https://forms.gle/6Lw3nsvu2d6nFg8e6
- https://github.com/docker/mcp-gateway/blob/main/pkg/oauthdiscovery/discovery.go
- https://github.com/docker/mcp-gateway/blob/main/cmd/docker-mcp/commands/oauth.go (`--scopes`)
- https://github.com/docker/mcp-gateway/blob/main/cmd/docker-mcp/oauth/auth.go
- https://github.com/docker/mcp-gateway/blob/main/pkg/oauth/dcr/manager.go
- https://github.com/docker/mcp-gateway/blob/main/pkg/registryapi/url.go (registry server URLs)
- https://github.com/docker/mcp-gateway-oauth-helpers/blob/main/discovery.go
- https://github.com/docker/mcp-gateway-oauth-helpers/blob/main/types.go
- https://app.smpl.money/.well-known/oauth-protected-resource
- https://github.com/thtmnisamnstr/simple-balance/blob/main/src/server/auth.ts (default scope)
- https://cdn.jsdelivr.net/npm/better-auth@1.6.33/dist/plugins/mcp/index.mjs (refresh tokens only with `offline_access`, one-hour access tokens)
