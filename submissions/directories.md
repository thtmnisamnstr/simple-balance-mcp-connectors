# Web-form directories

Four MCP directories take Simple Balance through a web form. PulseMCP is paused and Smithery is closed, so neither needs anything now. [cursor.md](cursor.md) covers cursor.directory, and [README.md](README.md) indexes every other listing.

| Directory | Cost | Account | Depends on | Step in the order of work |
| --- | --- | --- | --- | --- |
| [MCP.so](#mcpso) | Free queue with no published wait, or $39 one-time | MCP.so account, signed in with GitHub | This repository merged to `main` | 9, with the other web forms |
| [MCP Servers](#mcp-servers-mcpserversorg) | Free (review within 2 weeks), or $39 one-time (24 hours) | None; a contact email | The MCP Registry entry | 6, after the registry entry is live |
| [MCP.Directory](#mcpdirectory) | Free | None; claims go by email | The MCP Registry entry, then up to 2 weeks for auto-discovery | 6, after the registry entry is live |
| [MCP Market](#mcp-market) | $69 one-time; no free option for a remote server | None to submit; an email | Your decision (recommendation: skip it) | 9, if at all |
| [PulseMCP](#pulsemcp) | Free | None | The MCP Registry entry, and PulseMCP reopening | No action |
| [Smithery](#smithery) | n/a | None possible | n/a | No action (closed) |

The steps are those of the [order of work](README.md#order-of-work). The release workflow publishes the MCP Registry entry: see [mcp-registry.md](mcp-registry.md).

## Text used by several forms

Both come from [copy.md](copy.md#taglines-and-one-liners), so these listings say what every other one does.

Short description, 139 characters. MCP.so, MCP Servers and MCP Market use it; MCP Market's limit is 200. It's the plugin manifests' description with "Free" in front, which every directory but OpenAI may say.

```text
Free budget app and spending tracker. Ask about your accounts, spending and budgets, and queue or record transactions, as far as you allow.
```

One-line description, 93 characters, for MCP.Directory's 100-character field. It's the `description` in `server.json`, so a listing built from the MCP Registry and one built from the form say the same thing.

```text
Free budget app and spending tracker: ask about your money, and queue or record transactions.
```

To see whether the MCP Registry entry is live:

```bash
curl -s -o /dev/null -w '%{http_code}\n' 'https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest'
```

`200` means published and `404` means not yet; `npm run check:live` prints the same status. If `server.json` has moved to the fallback name `io.github.thtmnisamnstr/simple-balance`, use that name in the command and in the MCP Servers form.

## MCP.so

- Cost: a free submission waits in a review queue with no published time. $39 one-time publishes it at once without review, with a Verified badge, featured placement and a dofollow link. The badge is bought, not a security review, so don't describe it as one. Recommendation: free.
- Account: an MCP.so account. Sign in with GitHub: MCP.so accepts a claim on a listing only from a GitHub account that owns the listing's repository.
- The submit form takes only the endpoint and a name. Everything else goes on an edit page afterward.
- Submit once this repository is on `main`: the overview links its README.

### Submit

1. At https://mcp.so/sign-in, choose **Sign in with GitHub** and use the account that owns `thtmnisamnstr/simple-balance`.
2. Open https://mcp.so/submit?type=remote-server (the **Remote Server** tab) and fill:

   | Field | Value |
   | --- | --- |
   | Remote endpoint URL | `https://app.smpl.money/mcp` |
   | Name | `Simple Balance` |

3. Choose **Pay and submit automatically**. The form offers only the $39 option: the button creates the submission, then opens a Stripe checkout.
4. To stay free, leave the checkout through the back link at the top left of the Stripe page, which returns you to MCP.so. Don't close the tab instead. To publish at once, pay instead.

   Check: MCP.so says "Payment was not completed. This project is now a free submission queued for review." That notice is the only confirmation of the free queue: the status badge reads **Queued for review** for a free submission and for one still waiting for payment.
5. Open **Settings > My submissions** (https://mcp.so/settings/submissions?type=remote-server), open **Simple Balance**, fill the edit page from the table below and choose **Save changes**. Skip this and the listing has no icon, description, docs link or overview, which also costs it the 10 points MCP.so's quality score gives for those.

   Check: **Changes saved** appears, the status badge reads **Queued for review**, and **Preview** opens the listing page, which only you can see until review.

### Edit page values

| Field | Value |
| --- | --- |
| Name | `Simple Balance` |
| Author name | `Gavin Johnson` |
| Avatar | Upload `assets/logo-512.png` |
| Description | The [short description](#text-used-by-several-forms) |
| Category | **Finance & Commerce** |
| Tags (comma separated) | `budget-app, spending-tracker, budgeting, personal-finance, csv-import, oauth` |
| GitHub URL | `https://github.com/thtmnisamnstr/simple-balance` |
| Website URL | `https://smpl.money/` |
| Docs URL | `https://smpl.money/docs/agents-and-mcp/` |
| Listing type | **Remote Server** |
| Remote endpoint URL | `https://app.smpl.money/mcp` |
| Authentication | **OAuth** |
| Server configuration | The JSON below |
| Screenshots (up to 6) | The six images below, in this order |
| Overview (Markdown) | The overview below |

GitHub URL is the app repository: it holds the server's source, matches `repository` in `server.json`, and is the repository a claim is checked against.

Server configuration:

```json
{
  "mcpServers": {
    "simple-balance": {
      "type": "http",
      "url": "https://app.smpl.money/mcp"
    }
  }
}
```

Screenshots: download these six, then upload them in this order. `import-light.webp` is left out because it shows an empty upload step.

```bash
mkdir -p ~/Downloads/simple-balance-screens && cd ~/Downloads/simple-balance-screens
for n in dashboard staged reports budgets accounts activity; do
  curl -fsSO "https://smpl.money/screenshots/1200/$n-light.webp"
done
```

Overview:

~~~markdown
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and recurring transactions.

## Connect

Add `https://app.smpl.money/mcp` as a remote MCP server (Streamable HTTP), with no token or header. The client reads the OAuth 2.1 configuration from the server, registers itself (dynamic client registration, PKCE S256) and opens a browser, where you sign in to Simple Balance and approve what it asked for.

```json
{
  "mcpServers": {
    "simple-balance": {
      "url": "https://app.smpl.money/mcp"
    }
  }
}
```

Setup for Claude, ChatGPT, Codex, Cursor, VS Code, Gemini CLI, Cline and other clients: https://github.com/thtmnisamnstr/simple-balance-mcp-connectors

## How far it goes

- `ledger:read`: reading only.
- `ledger:stage`: also queue transactions for you to approve on Staged. Nothing queued counts until you've looked at it.
- `ledger:write`: also make the change itself, including creating, editing and deleting.

The consent screen grants every scope the client asked for, or none, and tools outside the grant are left out of the tool list. Every tool has a title and read-only, destructive, idempotent and open-world hints. Deleting your account, setting a password and billing are never reachable over MCP.

## Good to know

- There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.
- Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Everything an assistant changes shows on Activity.
- Each currency keeps its own totals instead of being blended.
- Free gives you everything Simple Balance does, for three accounts you can use at once.
- Docs: https://smpl.money/docs/agents-and-mcp/
- Source (AGPL-3.0): https://github.com/thtmnisamnstr/simple-balance
~~~

### After it's published

- The status reads **Published**, and **View project** opens the listing at `https://mcp.so/servers/<slug>`.
- The page shows the endpoint, **OAuth**, the overview and the screenshots, and no tool list: MCP.so can't list tools behind sign-in, which is why the overview carries the scopes.
- MCP.so re-checks hosted servers every day and scores them out of 100: reachability 25, protocol 15, auth 15, tools 35, listing 10. A sign-in server is scored on its OAuth discovery, and one whose tools MCP.so can't see is scored on the other parts, rescaled to 100. Unconfirmed: whether the protocol part counts against a server that answers 401 before sign-in. Read the breakdown on the listing. Answering `initialize` without sign-in would be an app decision, not a listing fix.

### Edit or claim

- Edit any time, before or after publication, from **Settings > My submissions**.
- To skip the queue later, use the **Skip review** button beside the status on the edit page ($39).
- If someone else lists Simple Balance first, open that listing while signed in with GitHub and choose **Claim**. It moves to **My submissions** if your GitHub account owns its repository.
- When `npm run sync-tools` changes the tool count in [tools.json](tools.json), change the 77 in the overview.
- Don't also open a "Submit Remote MCP Server" issue on github.com/chatmcp/mcpso. That route is slower: in the samples checked, issues took one to six and a half months to be listed.

## MCP Servers (mcpservers.org)

- Cost: free, reviewed within two weeks. Premium is $39 one-time: review within 24 hours, an Official badge with priority in search, and a dofollow link. Recommendation: free.
- Account: none. The approval email goes to the contact email.
- The GitHub list wong2/awesome-mcp-servers takes no pull requests and sends submitters to this form.
- Submit after the MCP Registry entry is live: the form looks up the Registry name and fills the endpoint from it, and the name returns 404 until then. To submit earlier, leave **Official MCP Registry Name** empty; adding it later takes an email.

### Submit

1. Run the registry check under [Text used by several forms](#text-used-by-several-forms). Go on when it prints `200`.
2. Open https://mcpservers.org/submit (no sign-in) and fill:

   | Field | Value |
   | --- | --- |
   | Server Name | `Simple Balance` |
   | Category | **Finance** |
   | Short Description | The [short description](#text-used-by-several-forms) |
   | Repository, Website or Documentation | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` |
   | Official MCP Registry Name (optional) | `money.smpl/simple-balance` |
   | This server supports remote connections | Checked |
   | Remote Server URL | `https://app.smpl.money/mcp` |
   | Authentication (optional) | **OAuth** |
   | Contact Email | `info@smpl.money` |
   | Submission plan | **Free** |

   When you leave the Registry name field, the form looks the name up, checks the remote box and fills **Remote Server URL** from `server.json`. Leave **Authentication** on **Not sure** and the listing shows the endpoint's authentication as unknown.

   Check: the URL the form filled is `https://app.smpl.money/mcp`. If an error icon appears in the Registry name field instead, the name isn't published: clear the field rather than submit a name that doesn't resolve.
3. Choose **Submit**. (Premium shows **Submit & Pay ($39)** and goes to checkout.)

   Check: the page says Simple Balance was submitted successfully and that an email follows once it's approved.
4. Watch `info@smpl.money` for the approval email.

### After it's approved

- Find the listing under https://mcpservers.org/remote-mcp-servers or by searching the site for Simple Balance. Check the name, the **Finance** category, the endpoint `https://app.smpl.money/mcp`, OAuth and the repository link.
- Unconfirmed: where the logo comes from. The form has no logo field. If the listing shows the wrong image, ask for a fix.
- Unconfirmed: whether a free listing gets the Official badge. Reviewers can set it, and Premium also sells it.

### Edit

There's no self-serve editing. Email `contact@mcpservers.org` with the listing's URL and the change. Reviewers can change the name, description, link, endpoint, transport, authentication and category.

## MCP.Directory

- Cost: free.
- Account: none. Claiming a listing, which gives it a verified badge and gives you edit access, is done by email to `hello@mcp.directory`.
- MCP.Directory says it adds servers from the MCP Registry on its own. Wait for that first: a listing it adds that way starts from `server.json`, which carries the endpoint, while the form builds the listing from a GitHub repository, and this one holds no server code. Auto-discovery is patchy, though. Two spot checks on November 2, 2026 found 13 servers that are in the MCP Registry but not on MCP.Directory, so plan on needing the form.

### Route 1: wait, then claim

1. One week after the MCP Registry entry goes live, search the directory's API:

   ```bash
   curl -s 'https://mcp.directory/api/v1/servers?q=simple%20balance'
   curl -s 'https://mcp.directory/api/v1/servers?q=smpl'
   ```

   `"total":0` means it isn't listed. Search again at two weeks.
2. If it's listed, send the [claim email](#claim-email) from `info@smpl.money`.
3. If it still isn't listed after two weeks, use route 2.

### Route 2: the form

1. If the repository's **About** box on GitHub is still empty, fill it, because the form pulls the description from GitHub. On https://github.com/thtmnisamnstr/simple-balance-mcp-connectors, choose the gear beside **About**, set these and choose **Save changes**:

   | Field | Value |
   | --- | --- |
   | Description | `Plugin and directory listings that connect Simple Balance, a free budget app and spending tracker, to AI assistants over MCP` |
   | Website | `https://smpl.money/docs/agents-and-mcp/` |
   | Topics | `mcp`, `mcp-server`, `remote-mcp`, `budget-app`, `spending-tracker`, `personal-finance`, `oauth` |

2. Open https://mcp.directory/submit (no sign-in) and fill:

   | Field | Value |
   | --- | --- |
   | GitHub Repository URL | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors` |
   | npm Package (optional) | Leave empty |
   | PyPI Package (optional) | Leave empty |
   | Short Description (optional) | The [one-line description](#text-used-by-several-forms) |
   | Your Email (optional) | `info@smpl.money` |

   Leave **Short Description** empty and MCP.Directory writes one from the README.
3. Choose **Submit for Review**. The page says listings are reviewed and published within 24 hours, and the email address gets a notice when it's live.
4. If it's turned down because the repository holds no server code, submit again with `https://github.com/thtmnisamnstr/simple-balance`, the app repository, which contains the server. This repository goes first because its README shows the endpoint and a client config.

### Check either route

Take the listing's `slug` from the search result, then read the install configs MCP.Directory generated:

```bash
curl -s 'https://mcp.directory/api/v1/servers?q=simple%20balance'
curl -s 'https://mcp.directory/api/v1/servers/<slug>/install-configs'
```

- `name` is `Simple Balance`. Unconfirmed: whether a listing built from the form takes the repository's name instead.
- `shortDescription` is the one-line description, and `transportType` is `["streamable-http"]`.
- Every `configJson` uses `https://app.smpl.money/mcp`, none uses an `sse` transport, and none runs a CLI command into a JSON block. The generator gets this wrong for other servers: Linear's Claude Code entry is `claude mcp add linear --transport sse` followed by JSON. The correct command for each client is in the [repository README](../README.md).
- `toolCount` is `0`. That's expected: the tools sit behind OAuth, and this repository holds no server code.
- After a claim, `publisher.verified` is `true`.

Put anything wrong in the claim email, or fix it yourself once you have edit access. The listing's page is `https://mcp.directory/servers/<slug>`.

### Claim email

To `hello@mcp.directory`, from `info@smpl.money`. Sending as that address needs [prerequisites.md, item 36](prerequisites.md#36-mail-from-gavin-and-infosmplmoney).

```text
Subject: Claim request: Simple Balance (money.smpl/simple-balance)

Hello,

I publish Simple Balance and would like to claim its listing:
https://mcp.directory/servers/<slug>

- MCP Registry name: money.smpl/simple-balance
- Endpoint: https://app.smpl.money/mcp (Streamable HTTP, OAuth with dynamic client registration)
- Server source: https://github.com/thtmnisamnstr/simple-balance
- Setup for each client: https://github.com/thtmnisamnstr/simple-balance-mcp-connectors

I'm writing from info@smpl.money, the support address given at https://smpl.money/docs/frequently-asked-questions/. Please mark the listing verified and give this address edit access.

<corrections from the check, if any>

Thanks,
Gavin Johnson
```

## MCP Market

Recommendation: don't list Simple Balance on MCP Market. The decision is yours. The reasons:

- A remote endpoint can only be a paid listing: $69 one-time. The free queue (four to six weeks on average) and the $29 tier are for GitHub repositories, and a free listing may not carry an endpoint: the site's editor refuses one with "Remote MCP endpoints need a separate paid listing." A free listing of this repository would have to leave out the one thing it's for.
- The terms (last updated March 25, 2026) bind anyone who uses the site. Section 12 has you indemnify Sitka Labs, the operator, against claims arising from "(c) the behavior or actions of any AI system interacting with MCP servers you deploy or connect." The clause has no cap, and the publisher here is you personally, for a server that writes financial records. Sitka Labs caps its own liability at the greater of what you paid it in the previous 12 months or CAD $100, and the terms are governed by British Columbia law.
- There's no finance category, so the listing would sit in general ones.
- Nothing else in this plan depends on it.

If you list it anyway:

1. Open https://mcpmarket.com/submit?source=remote, or https://mcpmarket.com/submit and choose **Remote MCP**. No account is needed.
2. Fill the form:

   | Field | Limit | Value |
   | --- | --- | --- |
   | Server name | 80 characters | `Simple Balance` |
   | MCP endpoint URL | https only | `https://app.smpl.money/mcp` |
   | Short description | 200 characters | The [short description](#text-used-by-several-forms) (139) |
   | Full description | 4,000 characters | The full description below (1,577) |
   | Supports Dynamic Client Registration | Checkbox | Checked |
   | Categories | 1 to 3 | **Productivity & Workflow**, **Analytics & Monitoring** |
   | Provider / company name | 80 characters | `Gavin Johnson` |
   | Website | URL | `https://smpl.money/` |
   | Key features | 3 to 10, 160 characters each | The six below |
   | Use cases | 2 to 10, 200 characters each | The four below |
   | FAQ | 2 to 10; question 200, answer 1,000 characters | The five below |
   | "Try Now" link | Optional URL | `https://app.smpl.money/` |
   | Email | Required | `info@smpl.money` |

3. Choose **Get listed now** and pay $69 at the card checkout.

   Check: the form says listings go live within 24 hours of review, so a day after paying, search https://mcpmarket.com for Simple Balance and confirm the endpoint, the categories and the FAQ.

Unconfirmed: how a remote listing is edited after purchase. Claims run through GitHub (**Continue with GitHub**, the MCP Market GitHub App, and Maintain or Admin access to a repository), and a remote listing has no repository. Ask `support@mcpmarket.com`. Also unconfirmed: where the listing's logo comes from, since the form has no upload.

Full description:

```text
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and recurring transactions.

There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.

Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Free gives you everything Simple Balance does, for three accounts you can use at once.

To connect, add https://app.smpl.money/mcp as a remote MCP server (Streamable HTTP), with no token or header. The client registers itself with dynamic client registration and PKCE, and opens a browser where you sign in to Simple Balance and approve what it asked for.

Docs: https://smpl.money/docs/agents-and-mcp/
Setup for each client: https://github.com/thtmnisamnstr/simple-balance-mcp-connectors
Source (AGPL-3.0): https://github.com/thtmnisamnstr/simple-balance
```

Key features, one per field:

```text
Every account on one page, and any total you doubt opens into the payments behind it
Your assistant reads the same records you do, through up to 77 tools
You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself
Nothing the assistant queues counts until you've looked at it, including a bank statement file it brings in
Sign in with OAuth on Simple Balance's own consent screen: no API key, no header
Settings lists what each assistant can do, and cuts an assistant off when you want it gone
```

Use cases, one per field:

```text
See where your money goes: ask what a category cost you last month, or what a store has cost you this year
Make a budget you'll keep: ask how this month's budget is doing, and set amounts for next month
Bring in a bank statement: hand the assistant the file your bank gives you, then approve the rows it queued
Tidy up: merge duplicate payees and categories, split a purchase across categories, and set up recurring transactions
```

FAQ, one question and answer per pair of fields:

```text
Q: How do I connect Simple Balance to my AI assistant?
A: Add https://app.smpl.money/mcp as a remote MCP server, with no token or header. Your assistant registers itself, then opens a browser where you sign in to Simple Balance and approve what it asked for. Setup steps for each client are at https://github.com/thtmnisamnstr/simple-balance-mcp-connectors.

Q: Can the assistant change my records without my approval?
A: You decide how far it goes when you connect it. With ledger:read it only reads. With ledger:stage it can also queue transactions for you to approve, and nothing it queues counts until you've looked at it; it can also edit or delete rows waiting on Staged, including imported ones, and a deleted one can't be restored. Only ledger:write lets it make the change itself. Settings lists what each assistant can do, and cuts an assistant off when you want it gone.

Q: Does Simple Balance connect to my bank or move money?
A: Not today, and it can't move money. There's no automatic pull from your bank: you download the file your bank gives you and bring it in, or hand it to your assistant. Nothing in it counts until you've looked at it.

Q: What can an assistant never do?
A: Delete your Simple Balance account, set a sign-in password, or change billing. Those happen only when you're signed in at app.smpl.money in a browser, never over MCP.

Q: Is there a free plan?
A: Yes. Free gives you everything Simple Balance does, for three accounts you can use at once. Premium removes the limit and the ads. Plans are listed at https://smpl.money/pricing/.
```

Paste each question and answer without its `Q: ` or `A: ` prefix.

## PulseMCP

Submissions and changes to existing listings have been paused since September 2026: the notice is dated September 3, 2026 and was still up on November 2, 2026. PulseMCP says it will pick up servers from the MCP Registry automatically once it reopens, so publishing there is the only action. Before the pause it ingested registry entries daily and processed them weekly.

1. Check https://www.pulsemcp.com/submit about once a month.
2. A week after it reopens, search pulsemcp.com for Simple Balance. If the listing is missing or wrong, email `hello@pulsemcp.com`, the address the page gave before the pause.

## Smithery

Closed. Smithery, now part of Arcade.dev, shut down its submissions on October 31, 2026, along with its accounts, API, CLI and connection proxy. It remains as a curated, read-only list, and https://smithery.ai/new returns 404. There's nothing to submit, and nothing in this repository or the app should change for it: no `smithery.yaml`, server card or Smithery workflow.

## Sources

- https://mcp.so/submit?type=remote-server (submit form, the $39 option)
- https://mcp.so/assets/submission-editor-DiXOqapp.js (edit-page fields, categories, authentication options; a site script whose file name changes when the site redeploys)
- https://mcp.so/assets/messages-CUwIFg6O.js (free queue, payment notices, claim rule, quality score, **Skip review**; site script)
- https://mcp.so/assets/submission-labels-Dei3Zvt4.js (the same **Queued for review** label for a pending payment and the free queue; site script)
- https://mcp.so/servers/gemina-213490 (an OAuth-only remote listed without tools)
- https://github.com/chatmcp/mcpso/issues/4160 (issue route timing)
- https://mcpservers.org/submit and https://mcpservers.org/assets/submit-DAikdYSi.js (fields, plans, Registry lookup, reviewer fields)
- https://mcpservers.org/llms.txt and https://mcpservers.org/advertise (remote servers page, contact address)
- https://github.com/wong2/awesome-mcp-servers (no pull requests)
- https://mcpmarket.com/submit?source=remote and https://mcpmarket.com/_next/static/immutable/chunks/1hqxytyicz5o0.js (remote form, $69, paid-only rule, limits)
- https://mcpmarket.com/_next/static/immutable/chunks/22l0-om_3qaeg.js (feature, use case and FAQ limits)
- https://mcpmarket.com/terms (sections 11, 12 and 14)
- https://mcp.directory/submit and https://mcp.directory/llms.txt (form, claim address, API)
- https://mcp.directory/api/v1/servers?q=pachca&limit=3 (a registry entry auto-discovery missed)
- https://www.pulsemcp.com/submit and http://web.archive.org/web/20260703000743/https://www.pulsemcp.com/submit (pause notice; ingestion and contact before the pause)
- https://www.smithery.ai/future and https://www.smithery.ai/new (shutdown, 404)
- https://registry.modelcontextprotocol.io/v0.1/servers/money.smpl%2Fsimple-balance/versions/latest (registry status)
- https://smpl.money/pricing/ (free plan)
