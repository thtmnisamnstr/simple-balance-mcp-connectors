## MCP Server Information

**Server Name:** `simple-balance`

**Repository URL:** https://github.com/thtmnisamnstr/simple-balance

**Brief Description:** Simple Balance is a free budget app and spending tracker at https://app.smpl.money. This adds its hosted MCP server, `https://app.smpl.money/mcp` (Streamable HTTP, OAuth 2.1 with dynamic client registration and PKCE). The assistant reads the same records the person does, and the person decides how far it goes: reading only, queuing transactions for them to approve, or making the change itself. There's no automatic pull from a bank today, and Simple Balance can't move money.

## Basic Requirements

- [ ] **Open Source**: Uses acceptable license (Apache-2.0, MIT, BSD-2-Clause, BSD-3-Clause or other permissive license)
  - Left unchecked on purpose. The hosted service's source is public at the repository above under AGPL-3.0, which isn't on this list. This is a `type: remote` entry: Docker builds, ships and runs none of that code. Like the other OAuth remote entries, `server.yaml` has no `source` block, so `task validate` skips the license check. If AGPL-3.0 rules the entry out, please say so here.
- [x] **MCP Compliant**: Implements MCP API specification
  - MCP over Streamable HTTP. An unauthenticated request gets `401` with `WWW-Authenticate: Bearer resource_metadata="https://app.smpl.money/api/auth/.well-known/oauth-protected-resource"` (RFC 9728), whose `resource` is `https://app.smpl.money/mcp`, the same as `remote.url`. The authorization server's RFC 8414 metadata at https://app.smpl.money/.well-known/oauth-authorization-server advertises a registration endpoint (RFC 7591) and PKCE `S256`. Registration takes public clients (`token_endpoint_auth_method: none`) and has no redirect-URI allowlist. 77 tools, each with a title and annotations.
- [x] **Active Development**: Recent commits and maintained
  - The service runs at https://app.smpl.money; see the repository's commit history.
- [ ] **Docker Artifact**: Dockerfile
  - N/A: a remote entry. Docker builds and runs no image for it, and CONTRIBUTING says remote servers "don't require a Dockerfile". The repository's Dockerfile builds the whole self-hosted app (`ghcr.io/thtmnisamnstr/simple-balance`, which needs its own PostgreSQL database), not a standalone MCP server, so it isn't offered as a local entry.
- [x] **Documentation**: Basic README and setup instructions
  - https://smpl.money/docs/agents-and-mcp/, linked from `readme.md`.
- [x] **Security Contact**: Method for reporting security issues
  - GitHub private vulnerability reporting: https://github.com/thtmnisamnstr/simple-balance/security/advisories/new (see `SECURITY.md` in the repository).

## Submitter Checklist

- [ ] This server meets the basic requirements listed above
  - All of them except the permissive license and the Docker artifact, both explained above.
- [x] I understand this will undergo automated and manual review.
- [ ] I have tested the MCP Server using `task validate -- --name simple-balance`
- [ ] I have built the MCP Server using `task build -- --tools simple-balance`
  - For a remote entry this prints `✅ Build skipped for remote server simple-balance`.
- [ ] If the server requires credentials to test it, I have [shared test credentials using this form](https://forms.gle/6Lw3nsvu2d6nFg8e6)

## Files

- `servers/simple-balance/server.yaml`: `type: remote`, `dynamic.tools: true`, a `remote` block and an `oauth` provider, following `servers/linear`.
- `servers/simple-balance/tools.json`: `[]`. Tools are listed only after sign-in, and which ones depends on the granted scopes.
- `servers/simple-balance/readme.md`: the docs link, a short overview and the scopes.

These files are maintained in https://github.com/thtmnisamnstr/simple-balance-mcp-connectors (MIT), whose CI runs this registry's `cmd/validate` and `cmd/catalog` against them.

## Sign-in for reviewers

The consent screen lists the scopes the client requested and grants all of them or none: `ledger:read` reads accounts, transactions and reports; `ledger:stage` also proposes transactions, which change nothing until committed; `ledger:write` also creates, edits and deletes. With all three, 77 tools are listed. A client that requests no scope gets the read-only default, `openid profile email ledger:read`, and 37 tools. From the CLI, `docker mcp oauth authorize simple-balance --scopes "openid profile email offline_access ledger:read ledger:stage ledger:write"` requests every scope. Credentials for a reviewer account with sample data go through the form, not this PR.
