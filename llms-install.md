# Installing the Simple Balance MCP server

These instructions are for an AI agent, such as Cline, that has been asked to
set up Simple Balance. Simple Balance (https://smpl.money) is a budget app and
spending tracker at app.smpl.money. Its MCP server is remote.

- Don't clone, build, download or run anything. There is no package and no
  local process.
- Don't ask for an API key, and don't add an `Authorization` header. Sign-in is
  OAuth in the person's browser, and a static `Authorization` header stops
  Cline from starting it.

## Server details

| Setting | Value |
| --- | --- |
| Name | `simple-balance` |
| URL | `https://app.smpl.money/mcp` |
| Transport | Streamable HTTP (`"type": "streamableHttp"`) |
| Auth | OAuth 2.1 with dynamic client registration and PKCE |

Always set `"type": "streamableHttp"`. Without it, Cline falls back to the
legacy SSE transport, which this server doesn't offer.

## Steps

1. Find the MCP settings file and read it before editing, so no existing server
   is lost.
   - Cline 4.x (VS Code, JetBrains and the CLI share one file):
     `~/.cline/data/settings/cline_mcp_settings.json`, or
     `%USERPROFILE%\.cline\data\settings\cline_mcp_settings.json` on Windows.
     `CLINE_MCP_SETTINGS_PATH` moves it when set.
   - Cline 3.x in VS Code: `settings/cline_mcp_settings.json` inside the
     extension's global storage folder (`saoudrizwan.claude-dev`).
   - The person can also open the file from **MCP Servers > Configure >
     Configure MCP Servers**.
2. Add this entry inside `mcpServers`, keeping every other server as it is.
   Leave `autoApprove` empty: several tools change or delete financial records.

   ```json
   {
     "mcpServers": {
       "simple-balance": {
         "type": "streamableHttp",
         "url": "https://app.smpl.money/mcp",
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

   Instead of editing the file, the person can use **MCP Servers > Remote
   Servers**: Server Name `simple-balance`, Server URL
   `https://app.smpl.money/mcp`, Transport Type **Streamable HTTP**, then
   **Add Server**. In the Cline CLI, this command writes the same entry:

   ```bash
   cline mcp add simple-balance https://app.smpl.money/mcp --transport http --yes
   ```

3. Ask the person to sign in. Only they can do this step.
   - VS Code or JetBrains: press **Authenticate** next to `simple-balance`.
   - CLI: run `cline mcp`, choose **Authorize OAuth**, then pick
     `simple-balance`.

   A browser opens at app.smpl.money. The person signs in, and an
   **Allow this MCP client?** screen names the client and lists the scopes it
   asked for. They choose **Allow access**. The browser then returns to a
   `http://127.0.0.1` address on the machine running Cline, so the sign-in has
   to finish in a browser on that machine.
4. Check the connection by calling `whoami`, then `list_accounts`, and tell the
   person what you found. Don't create, change or delete anything as part of
   the installation.

## After installation

- Follow the instructions the server sends when it connects. Money is an exact
  decimal string such as `"12.50"`. Prefer `create_staged_transaction`, which
  the person reviews before `commit_staged_transactions`, unless they asked for
  a specific change.
- A tool missing from the list is outside what the person approved.
- To disconnect, the person revokes Cline under **Settings > Connected agents**
  at https://app.smpl.money, then removes `simple-balance` from the MCP
  settings.
- Docs: https://smpl.money/docs/agents-and-mcp/. Support: info@smpl.money.
