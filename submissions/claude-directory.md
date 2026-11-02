# Claude directory

Anthropic's directory (claude.ai/directory, also shown at claude.com/marketplace)
takes two listings for Simple Balance, both submitted from one paid Claude
organization in the developer portal at https://claude.ai/directory/manage:

| Listing | Comes from | Review |
| --- | --- | --- |
| MCP connector | A 10-step form in the portal | Automated policy scan, then listed as **Community** by default. Some submissions also get a person's review first; the card shows which path yours takes ([After you submit the connector](#after-you-submit-the-connector)). |
| Plugin bundle | The `plugin/` folder on `main` of this repository | Validation and a security scan on every version, and a person reviews a new listing |

The self-hosted plugin marketplace in this repository needs no submission: see
[Self-hosted marketplace](#self-hosted-marketplace). Anthropic documents no
submission fee, but free Claude accounts can't submit. Pro, the cheapest plan
that can, costs $20 a month billed monthly or $17 a month billed annually.

## Before you submit

1. Merge this branch to `main`. The plugin bundle is read from `main`, the
   marketplace install works only from `main`, and the raw logo URL below
   resolves only after the merge.
2. Choose the Claude organization that will own both listings: a personal Pro,
   Max or Ultra account you control, not an employer's Team or Enterprise
   organization. A listing belongs to the organization it was submitted from,
   the first organization to submit a repository folder owns that plugin
   listing, and the two listings can be paired only when both come from the
   same organization.
3. Create the reviewer account, as [reviewer-account.md](reviewer-account.md)
   describes. Its credentials go into the portal's **Test & launch** step and
   nowhere else.
4. Get the public documentation live, as the next section describes. It must be
   live by the publish date.
5. Test the server as a custom connector, as
   [Test as a custom connector](#test-as-a-custom-connector) describes. The
   portal asks you to confirm that you ran every tool.

## Documentation requirement

The Software Directory Policy requires documentation of how the software works,
what it's for and how to troubleshoot it (3.C), and at least three working
example prompts or use cases (3.E). Anthropic's connector checklist makes public
documentation "required by your publish date". A help article is enough, and
you can share docs privately during review.

https://smpl.money/docs/agents-and-mcp/ falls short today. It explains scopes,
staging and revoking, but has no Claude setup steps, no example prompts and no
troubleshooting, and its JSON sample has no `"type"`, which Claude Code rejects.
Pick one:

| Option | Documentation URL | What it needs |
| --- | --- | --- |
| A. Update the site page (recommended, because every manifest already links to it) | `https://smpl.money/docs/agents-and-mcp/` | The page changes in [prerequisites.md](prerequisites.md) |
| B. Use this repository's README | `https://github.com/thtmnisamnstr/simple-balance-mcp-connectors#readme` | It has the Claude setup steps. Add the five prompts from [Use cases](#4-use-cases) and a troubleshooting section, and point `documentationUrl` in `plugin/.claude-plugin/plugin.json` at it too |

Either way, the troubleshooting section should cover signing in again, a tool
missing from the list (it's outside the grant), a frozen account refusing
changes, and revoking a connection.

Check: open the URL in a private window and find the Claude steps, at least
three example prompts, and the troubleshooting section.

## Test as a custom connector

In claude.ai:

1. Open the prefilled dialog:
   https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Simple%20Balance&connectorUrl=https%3A%2F%2Fapp.smpl.money%2Fmcp
   Or go to **Customize > Connectors**, choose **+ Add**, then
   **Add custom connector**, and enter the name `Simple Balance` and the URL
   `https://app.smpl.money/mcp`.
2. Select **Continue**, check the auth settings Claude detected, and select
   **Continue** again. Under **Authentication**, choose **Sign in now**. Under
   **OAuth client**, choose **Register automatically**:
   **Use Claude's published identity** needs a Client ID Metadata Document,
   which the server doesn't advertise. Leave **Request headers** empty.
3. Select **Add**, then **Connect**. Sign in at app.smpl.money with the reviewer
   account and choose **Allow access**. Auth settings can't be edited after
   adding, so if one is wrong, remove the connector and add it again.
4. In a new chat, turn the connector on from **+ > Connectors** and ask:

   ```text
   Run whoami and list the scopes this connection has.
   ```

   Check: the scopes include `ledger:read`, `ledger:stage` and `ledger:write`.
   When the server's 401 names no scope, Claude requests every scope the server
   advertises. If the app later adds a `scope` parameter to that 401 (see
   [prerequisites.md](prerequisites.md)), Claude requests exactly those, so keep
   `ledger:write` in it, or the portal syncs fewer than 77 tools.
5. Run every tool against the reviewer account; [tools.json](tools.json) lists
   all 77. For the 11 that can't be undone, which the reviewer block under
   [Test & launch](#8-test--launch) names, first create throwaway records whose
   names start with "Review" and run the tools on those. Then refresh the
   account ([reviewer-account.md](reviewer-account.md#refresh-before-each-review))
   before you submit.

In Claude Code:

```bash
claude mcp add --transport http --scope user simple-balance https://app.smpl.money/mcp
```

Run `/mcp`, choose `simple-balance`, then **Authenticate**, sign in and choose
**Allow access**. Ask Claude to run `whoami`.

Check: note the scopes. Unless `oauth.scopes` is set, Claude Code doesn't
request the server's full scope list, so it may get only the server default
`openid profile email ledger:read` until the app names scopes in its 401. That's
an app prerequisite ([prerequisites.md](prerequisites.md)), not something this
repository fixes. This check is how you confirm what Claude Code gets.

## Submit the MCP connector

Open https://claude.ai/directory/manage, select **Submit new**, and under
**What would you like to submit?** choose **MCP connector**. The form saves your
progress in the browser as you move between steps.

### 1. Connection

| Field | Value |
| --- | --- |
| **Users connect to different URLs** | Leave it unselected: everyone uses one URL. A listing that uses **Multiple URLs** or **URL pattern** can be published only once it's Verified. |
| Server URL | `https://app.smpl.money/mcp`, or choose the custom connector you added while testing |

Sign in with the reviewer account and choose **Allow access**. The server lists
only the tools a grant reaches, so a connection without `ledger:write` syncs
fewer tools.

### 2. Tools

The tools sync from the server, and there's nothing to type.

Check: the step shows 77 tools with none flagged for a missing title or
annotation:

| Annotation | Tools |
| --- | --- |
| Read-only (`readOnlyHint: true`) | 37 |
| Write, additive (`destructiveHint: false`) | 9 |
| Write, destructive (`destructiveHint: true`) | 31 |

By scope, that's 37 `ledger:read`, five `ledger:stage` and 35 `ledger:write`
tools. There are no prompts, resources or MCP Apps.

If tools are flagged for a missing title: the server sets each tool's top-level
`title` but not `annotations.title`, and which one the portal reads is
unconfirmed. Setting both is a change to `src/server/mcp.ts` in
[thtmnisamnstr/simple-balance](https://github.com/thtmnisamnstr/simple-balance).

### 3. Listing

| Field | Limit | Value |
| --- | --- | --- |
| Server name | 100 characters | `Simple Balance` |
| One-liner | 200 characters | Below, 117 characters |
| Description | 2,000 characters | Below, 1,498 characters |
| Categories | 1 to 5 | Financial services, Productivity, Data & analytics |
| Documentation URL | | The URL you chose under [Documentation requirement](#documentation-requirement) |
| Privacy policy URL | | `https://smpl.money/privacy/` |
| Support contact | | `info@smpl.money`. If it wants a URL: `https://smpl.money/docs/frequently-asked-questions/`, whose "How do I get help?" answer gives that address. There's no `/support` page. |
| Icon | Unpublished | `assets/logo-512.png` |
| URL slug | Permanent once published | `simple-balance` |

Anthropic's docs list these fields in prose, so the portal's exact labels may
differ.

One-liner. It matches the description in every plugin manifest, as
[copy.md](copy.md#taglines-and-one-liners) gives it:

```text
Budget app and spending tracker. Ask about your accounts, spending and budgets, and queue or record transactions, as far as you allow.
```

If the portal asks for a tagline of 55 characters or fewer instead (one
third-party guide describes one, and Anthropic's listing-edit page mentions a
tagline), use the site's own, at 36 characters:

```text
Free budget app and spending tracker
```

Description. Anthropic can't edit it, so the card shows exactly what you
paste. It's the long description from [copy.md](copy.md#descriptions):

```text
Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. Once it's connected, your assistant reads the same records you do: ask what you have in each account, where last month's money went, how a budget is doing, or when you last paid the electric bill.

You decide how far it goes: reading only, queuing transactions for you to approve, or making the change itself. Nothing it queues counts until you've looked at it, including the rows of a bank statement file it brings in for you. Allowed to make changes, it can also record and fix transactions, split a purchase across categories, and set up budgets, templates and repeating payments.

There's no automatic pull from your bank today: you download the file your bank gives you and bring it in, or hand it to the assistant. Simple Balance keeps track of your money; it can't move it.

Settings lists what each assistant can do, and cuts an assistant off when you want it gone. Everything an assistant changes shows on Activity. Deleting a transaction can be undone, but deleting anything else, or merging categories or payees, is permanent. Each currency keeps its own totals instead of being blended.

Free gives you everything Simple Balance does, for three accounts you can use at once. Sign up at app.smpl.money.
```

"Simple Balance keeps track of your money; it can't move it" keeps the listing
clear of the money-movement exclusion, as [Policy risks](#policy-risks)
explains.

Categories: on the public directory these are `financial-services` (shown as
"Financial services"), `productivity` and `data-analytics` (shown as "Data &
analytics"). Whether the portal uses the same labels is unconfirmed, so pick
the ones that match.

Icon: upload `assets/logo-512.png`, a 512 x 512 PNG. Anthropic publishes no icon
size or format and the portal is behind a login, so the size is unconfirmed.
Check what the upload control asks for. If it wants a URL, use
https://raw.githubusercontent.com/thtmnisamnstr/simple-balance-mcp-connectors/main/assets/logo-512.png
which works once this branch is on `main`.

Slug: `simple-balance` makes the listing URL
`https://claude.ai/directory/connectors/simple-balance`. One Anthropic page says
you receive the slug when the submission is approved, so check it on the
**Approved** card before you select **Publish**. It can't change afterward.

Leave out carousel screenshots: they're for MCP Apps only, and Simple Balance
has none. If the portal shows **Allowed link URIs**, leave it empty, because
the server never opens links.

### 4. Use cases

Primary use cases. Each prompt works against the reviewer account:

```text
1. Spending by category: "How much did I spend in each category last month?" (get_report)
2. Budget against actual: "How am I doing against my budget this month?" (get_budget_report)
3. Account balances: "What are my account balances right now?" (list_accounts)
4. Stage a purchase for review: "Stage a $42.18 grocery purchase at Corner Market from my checking account today." (list_accounts, create_staged_transaction) The Checking balance doesn't change until the row is committed.
5. Commit after review: "Show my staged transactions, then commit the Corner Market one." (list_staged_transactions, commit_staged_transactions) Claude asks before committing, and the Checking balance then drops by 42.18.
```

These are the five positive test cases in `plugin/plugin.json`, so OpenAI's
reviewers and Anthropic's run the same prompts against the same account. The
commit prompt needs the staged row, so it comes after the staging prompt.

The prompts use relative dates. On the day a reviewer runs them, the account
needs transactions in the previous calendar month and a budget for the current
one, or the first two prompts come back empty. Check the account again if the
review runs into a new month.

What users need before connecting:

```text
A Simple Balance account at https://app.smpl.money. The free plan keeps up to three accounts active; any others are frozen and refuse changes from Claude, as they do in the web app.
```

Reads or writes: **Both**.

### 5. Company

| Field | Value |
| --- | --- |
| Company name | `Gavin Johnson` |
| Website | `https://smpl.money/` |
| Primary contact for review updates | `gavin@smpl.money` |

Gavin Johnson is the publisher on every listing, and the privacy policy names
him as data controller, so the listing and the policy identify the same
publisher. Anthropic emails the primary contact when a reviewer needs anything.

### 6. Authentication

In the **How users authenticate** section:

| Field | Value |
| --- | --- |
| **Authentication requirement** | **Always required**. Every tool needs a signed-in user, and the server answers an unauthenticated request with 401. |
| **Authentication methods** | **OAuth sign-in** |
| **OAuth client** | Enter nothing: no client ID and no secret |

With no client entered, Claude registers itself through dynamic client
registration (DCR) at `https://app.smpl.money/api/auth/mcp/register`. It would
use a Client ID Metadata Document, which Anthropic prefers for high-traffic
listings, only if the server advertised
`client_id_metadata_document_supported: true`, which it doesn't
([prerequisites.md](prerequisites.md#27-client-id-metadata-documents)). Leave
**Anthropic-held client credentials** alone: they need a confidential client and
secret created for Claude, and the server has none, because DCR registers
public clients only (`token_endpoint_auth_method` is forced to `none`). The
exact label of the "no client" choice is unconfirmed.

The server has no redirect allowlist, so DCR registers whichever redirect
Claude sends. If one is ever added, it must accept
`https://claude.ai/api/mcp/auth_callback` exactly, the one hosted callback
Anthropic's docs give (Claude on the web, Desktop, mobile and Cowork), and
Claude Code's loopback redirect on any port at both
`http://localhost:<port>/callback` and `http://127.0.0.1:<port>/callback`.

### 7. Data handling

| Question | Answer |
| --- | --- |
| Underlying API | Your own (first-party). The MCP server and the ledger are one application at app.smpl.money. |
| Personal health data | **No** |
| Sponsored content | **No**. Tool results carry no advertising. |

Policy 4.C bars advertising and sponsored content. The web app shows Google
AdSense on the free plan, but no ad reaches a tool result. Keep it that way, or
this answer becomes false.

If the step has a free-text box for what is collected and where it goes
(Anthropic's docs list only the three questions above), paste:

```text
The connector reads and writes the signed-in person's own ledger at app.smpl.money (accounts, balances, transactions, payees, categories, budgets, notes and imported statement files), within the scopes they approved on Simple Balance's consent screen. Every tool call goes to app.smpl.money and nowhere else, and the server never reads Claude's chat history, memory or files. The application is hosted on Oracle Cloud Infrastructure in the United States. The server doesn't log tool arguments. Server logs include IP addresses and request paths and are kept for a short time, as the privacy policy says. Changes to the ledger are recorded in the person's Activity history, as changes made in the web app are. Each create, commit or bulk write also stores a copy of its response, so a retried request gets the same answer; those copies are deleted with the account. Ledger data is kept until the person deletes their account, and backups are kept as the privacy policy's Backups section describes. Privacy policy: https://smpl.money/privacy/
```

The backups sentence points at the privacy policy's Backups paragraph, so
before you paste, check that the paragraph accounts for every copy of the
database you keep.

### 8. Test & launch

1. Paste the reviewer instructions below into the setup and access
   instructions.
2. Type the reviewer account's email and password into the portal's credential
   fields. They never go in this repository.
3. Confirm that you ran every tool. Do this only after step 5 of
   [Test as a custom connector](#test-as-a-custom-connector).

```text
Simple Balance is a budget app and spending tracker. This connector reaches only the signed-in account's own records at app.smpl.money.

1. Connect the Simple Balance connector. Claude opens the Simple Balance sign-in page at app.smpl.money.
2. Sign in with the email and password given in this form. The account has no second factor.
3. On "Allow this MCP client?", choose Allow access. Ask Claude to run whoami to see the granted scopes: with ledger:write, all 77 tools are offered.
4. The account is on the free plan, which keeps three accounts active; two are in use, so create_account has room for one more. Its sample data supports the five use cases in this submission; run use case 4 before use case 5.
5. Deleting a transaction (set_transaction_deleted, bulk_delete_transactions) posts a reversal, and set_transaction_deleted restores it. These 11 tools can't be undone: delete_staged_transactions, delete_category_group, delete_budget_plan, delete_budget_entry, delete_recurrence, delete_account, delete_transaction_template, bulk_delete_transaction_templates, delete_category, merge_categories, merge_payees. Please run them only on records you create first, with names starting "Review".
6. revoke_connected_agent with your own client id disconnects you. Reconnect to continue.
7. Everything the connector changes is listed on the Activity page at app.smpl.money with an Agent badge. We reset the account before each review.

Simple Balance doesn't connect to banks and can't move money. It records what the person enters or imports.
```

Before you paste, check the block against [reviewer-account.md](reviewer-account.md):
the second-factor sentence, the "Review" record names and the reset promise
must match the account you built. Edit the block, not the account, if they
differ.

### 9. Compliance

All seven acknowledgments are required. Confirm each one holds before you
select it:

| Acknowledgment | Why it holds |
| --- | --- |
| Directory guidelines | You've read the Software Directory Policy and Terms. All 77 tools have a title and `readOnlyHint` or `destructiveHint`, the longest name is 34 characters (the limit is 64), and reads and writes are separate tools. |
| First-party API usage | The connector calls only Simple Balance's own API at app.smpl.money. |
| Financial transactions | It records the transactions a user enters or imports, in their own account. It doesn't transfer money or financial assets, initiate payments or connect to bank accounts. The terms say: "It is a record-keeping tool. It is not financial, tax, accounting or legal advice, it does not file anything on your behalf, and it does not move money." |
| AI media generation | It generates no images, video or audio. |
| Prompt injection | Tool descriptions say what each tool does. Ledger text, such as payees, notes and imported rows, is treated as data. |
| Conversation data collection | Tools receive only their own arguments. The server never logs tool arguments and never reads chat history, memory or files. What a tool writes is kept as [Data handling](#7-data-handling) describes. |
| Public documentation | The documentation URL from step 3, live by the publish date. |

### 10. Review and submit

Read every quality warning, such as very short answers: the portal shares them
with the reviewers. Fix them or accept them, then submit.

### After you submit the connector

1. Follow the status on the connector's card in the portal:
   - **In review**: Anthropic acts next, and emails the primary contact if it
     needs anything.
   - **Changes requested** or **Not approved**: select **View feedback**, fix
     what it names, and resubmit.
   - **Approved**: cleared but not live. Check the slug, then select
     **Publish**. Editing the listing before you publish sends it back for
     another review.
   - **Published**: live, with the **Community** label.

   Anthropic's docs also say the scan lists a connector as Community "with no
   action from you". Which of the two paths a submission takes is unconfirmed,
   so act on whatever the card says. Review time isn't fixed.
2. If nothing moves, email `mcp-review@anthropic.com` with the listing name, the
   organization you submitted from and the status the card shows.
3. Anthropic may escalate the listing to Verified review on its own, in which a
   reviewer tests each tool. There's no application for it.

Check: https://claude.ai/directory/connectors/simple-balance shows the listing
with a **Connect** button. From a Claude account that never added the custom
connector, connect from the listing: it appears as a named connector rather
than under **Custom**. Afterward, the connector's **Overview** and **Usage**
tabs in the portal show a health badge and calls by tool. The metrics are in
beta and update daily, and **Degraded** means request errors above 5%.

Then add the listing URL to the README and the docs page. Keep the README's
custom-connector link as well: `npm run check` fails if the README has no
`add-custom-connector` link.

## Submit the plugin bundle

Submit the connector first, from the same organization.

From the repository root, run the checks CI runs:

```bash
npm run check
npx --yes @anthropic-ai/claude-code@2.1.316 plugin validate . --strict
npx --yes @anthropic-ai/claude-code@2.1.316 plugin validate ./plugin --strict --profile directory
```

1. Open https://claude.ai/directory/manage, select **Submit new**, and choose
   **Plugin bundle**.
2. If the portal shows **GitHub isn't connected for this Claude organization**,
   select **Connect GitHub** and connect a GitHub account that can push to the
   repository. The portal checks push access before it lets you create or
   submit, and a GitHub connection made in another Claude organization doesn't
   count.
3. On the **Source** step:

   | Field | Value |
   | --- | --- |
   | **Repository** | `thtmnisamnstr/simple-balance-mcp-connectors` |
   | **Plugin path** | `plugin` |
   | **Branch or tag** | `main` |

   The repository and plugin path can't change after you submit. Another
   folder would be a new submission.
4. Select **Validate**. Fix anything marked **Blocking**, push the fix to
   `main`, and select **Re-validate**: a result applies to one commit. A
   **Policy hold** lets you submit, and a reviewer reads that version first.
   Warnings and notes need no fix.

   Check: no finding is **Blocking**. The local directory profile passes with
   the Agent Plugins files `plugin/plugin.json` and `plugin/mcp.json` in the
   folder. Whether the portal's fuller validator accepts them too is
   unconfirmed, and this step is what shows it.
5. On **Listing details**, check what the portal read. It comes from the files,
   so change the files, not the form, then validate again:

   | Listing field | Read from | Value |
   | --- | --- | --- |
   | Name | `plugin/.claude-plugin/plugin.json` `name` | `simple-balance` |
   | Display name | `displayName` | `Simple Balance` |
   | Short description | `description` | Same as the connector's one-liner |
   | Description | `plugin/README.md` | The whole README |
   | Author | `author` | Gavin Johnson, `gavin@smpl.money` |
   | Icon | `icon` | `./assets/logo.png`, the 512 x 512 copy of `assets/logo-512.png`. Size rules are unpublished. |
   | Documentation | `documentationUrl` | `https://smpl.money/docs/agents-and-mcp/` |
   | Support | `supportUrl` | `https://smpl.money/docs/frequently-asked-questions/` |
   | Privacy policy | `privacyPolicyUrl` | `https://smpl.money/privacy/` |
   | Terms | `termsOfServiceUrl` | `https://smpl.money/terms/` |
   | License | `license`, and `plugin/LICENSE` | MIT |

   The README says data goes to and comes from `app.smpl.money` and nowhere
   else. Keep that sentence: the security scan fails plugins for "Sends data to
   an undisclosed destination".
6. On **Data handling**, answer the four questions. Whether each is a yes/no
   control or free text is unconfirmed; use the first word for a yes/no:

   | Question | Answer |
   | --- | --- |
   | Reads or stores personal data | Yes. The plugin stores nothing. Its connector reads and writes the user's own financial ledger at app.smpl.money (accounts, transactions, payees, categories, budgets, notes) within the OAuth scopes the user approves. |
   | Sends data to services other than its declared connectors | No. Its only endpoint is the declared connector `https://app.smpl.money/mcp`. It has no hooks, scripts or local servers. |
   | How long it keeps data | The plugin keeps none. Simple Balance keeps ledger data until the user deletes their account, and keeps backups as its privacy policy describes (https://smpl.money/privacy/). |
   | Intended for people under 18 | No. The terms allow accounts from 16 ("You must be at least 16 to hold an account", https://smpl.money/terms/), so people aged 16 and 17 can sign up. Keep No only if you accept that, or raise the terms' minimum age to 18 first. |

7. On **Compliance**, check that the contact email is `gavin@smpl.money`, then
   read and select all four acknowledgments. Anthropic doesn't publish their
   wording.
8. On **Review and submit**, set **How new versions reach the directory** to
   **GitHub push webhook** (the default) and turn on
   **Auto-publish passing versions**. Select **Submit for review**.
9. On **Plugin submitted for review**, select **Set up push updates**. It needs
   admin access to the repository on GitHub. To do it later, open the plugin
   from **Submissions** and select **Set up** under **Updates** on the
   **Settings** tab.

   Check: after your next push to `main`, the plugin's **Versions** tab lists
   the new commit without your selecting **Check for new commits**.

An organization can create 10 submissions in any 24 hours, drafts and
withdrawn submissions included.

### After you submit the plugin

The status moves through **Scanning**, **In review** (a person reviews every new
listing), **Approved** and **Published**.

- **Needs changes**: the plugin's page names what to change. Push a fix, then
  select **Check for new commits**. If the submission was rejected, select
  **Resubmit for review** on the **Review** tab instead. A first submission
  that fails the security scan is rejected.
- **Approved**: not installable yet. Select **Publish**. By default that asks
  an Anthropic reviewer, who then publishes it.
- **Not live yet**: marked published but not listed. Anthropic acts next.
- To ask for help, open the plugin's menu and select **Get help** or
  **Contact Anthropic**, or email `directory@anthropic.com`.

Check: **Customize > Plugins > Discover** in claude.ai lists Simple Balance, and
its **Connectors** tab shows the server. In Claude Code 2.1.287 or later,
`/plugin directory` lists it too, and a plugin added on claude.ai reaches Claude
Code as `simple-balance@synced`.

## Pair the listings

Once both listings come from the same organization, the portal lets you pair
the plugin with the connector. Anthropic's docs don't say where the control is,
so look on each listing's page in the portal (unconfirmed). Both point at
`https://app.smpl.money/mcp`, so a person who has both sees one set of tools,
and Claude Code matches plugins and connectors by endpoint.

## Updates and delisting

| | MCP connector | Plugin bundle |
| --- | --- | --- |
| Tool changes | Deploy the app. There's no resubmission, but the tool names shown on the listing change only through a listing edit. | The skill names tools. If one it names is renamed or removed, update `plugin/skills/simple-balance/SKILL.md` and release a new version. |
| Listing changes | Edit in the portal, and a reviewer approves the edit. The slug is locked, and renaming affects existing users. | Edit `plugin/.claude-plugin/plugin.json` or `plugin/README.md` and release a new version |
| New versions | Not applicable | Merge to `main` with the version raised (`npm run set-version`). Each commit is scanned, and a version that fails or is held leaves the published one live. |
| Help | `mcp-review@anthropic.com` | The plugin's menu in the portal, or `directory@anthropic.com` |
| Delisting | Email `mcp-review@anthropic.com` | **Delist plugin** in the plugin's menu or **Settings** tab, and **Relist plugin** to bring it back |

- Keep the server URL fixed. If the listing's URL changes, existing users'
  connections keep working but show under **Custom** instead of as the
  directory connector, until they remove and re-add it.
- When `npm run sync-tools` adds, renames or removes a tool, submit a listing
  edit with the new tool names.
- Policy 3.H: tell Anthropic about material changes, such as adding bank sync.
  They may be re-reviewed.
- Never change the plugin's `name`.
- The directory follows `main`, not tags. A plugin version that passes goes
  live when it's published, which can be before you tag the release; the tag
  drives only the MCP Registry and the OpenAI ZIP. Auto-publish applies only
  once Anthropic's publish setting for the plugin allows it.

## Self-hosted marketplace

`.claude-plugin/marketplace.json` makes this repository a plugin marketplace.
It works as soon as this branch is on `main`, with no submission and no review.
Anthropic doesn't review third-party marketplaces.

Claude Code 2.1.275 or later installs it in one step:

```text
/plugin install simple-balance --marketplace thtmnisamnstr/simple-balance-mcp-connectors
```

Earlier versions add the marketplace first:

```text
/plugin marketplace add thtmnisamnstr/simple-balance-mcp-connectors
/plugin install simple-balance@simple-balance
```

In claude.ai and Cowork: **Customize > Plugins > Add > Add marketplace**, enter
`thtmnisamnstr/simple-balance-mcp-connectors`, add Simple Balance, and connect
the server from the plugin's **Connectors** tab. It shows as a custom connector
until the directory connector is listed.

To test before merging, from the repository root:

```bash
claude plugin marketplace add ./
claude plugin install simple-balance@simple-balance
```

Start `claude`, run `/mcp`, authenticate `plugin:simple-balance:simple-balance`,
ask Claude to run `whoami`, then remove the test marketplace with
`claude plugin marketplace remove simple-balance`.

Check: after the merge, the one-step install works in a fresh session, and
`/mcp` lists `plugin:simple-balance:simple-balance`.

Installed copies update when the user runs
`claude plugin update simple-balance@simple-balance`. Auto-update is off by
default for third-party marketplaces.

## Policy risks

Software Directory Policy 4.A excludes "Software that transfers money or other
financial assets, or executes financial transactions autonomously on behalf of
users, without human-in-the-loop safeguards", and Anthropic's connector
checklist rejects connectors that "Transfer money, cryptocurrency, or other
financial assets". Simple Balance only keeps records, and the directory already
lists an Anthropic-verified personal-finance connector with write tools
(PocketSmith Complete Access). The risk is wording that an automated scan reads
as money movement.

The listing copy in this guide stays clear of it:

- It says what happens to records: "stage or record transactions", import "into
  the Staged queue", "commit only the rows you approve".
- It states the limit twice, in the description and in the financial
  transactions acknowledgment: a record-keeping tool that doesn't connect to
  banks or move money, and isn't financial, tax or legal advice. The
  acknowledgment quotes the terms.
- It mentions banks and moving money only to deny them. There's no "payment",
  "send money" or "sync your bank", and no "transfer", even though Simple
  Balance records transfers between accounts. [copy.md](copy.md) lists the
  words to avoid in every listing.
- It names the human-in-the-loop safeguards: staged rows change no balance until
  committed, Claude asks before destructive tools, every change is on Activity,
  and the connection can be revoked.
- It never calls the connector official or implies Anthropic endorses it, which
  the Directory Terms forbid.

Three tool descriptions on the server read closest to moving money:
`create_transaction` ("Directly commit a deposit, withdrawal, or transfer", and
"separate payments" at its end), `archive_account` ("This moves money in the
books") and `commit_staged_transactions` ("Committing puts money in the
books"). The `fromAccountId` field that `create_transaction`,
`update_transaction`, `create_recurrence` and `update_recurrence` publish also
says "moving money within one account is refused". Whether the scan flags any
of it is unconfirmed. Reword all of it before you submit, as
[prerequisites.md](prerequisites.md#14-tool-text-that-reads-as-moving-money)
item 14 describes.

Other policy points:

- The Usage Policy (the version effective November 12, 2026) treats
  personalized investment recommendations and advice on an individual's taxes
  as high-risk finance, which needs a qualified human in the loop and a
  disclosure. Summaries and analysis that stop short of such a recommendation
  are excluded, and so is carrying out a decision the person already made.
  Simple Balance offers neither kind of advice: the plugin's skill tells Claude
  to suggest a qualified professional for tax, investment or legal decisions,
  and the description says it isn't financial, tax or legal advice.
- Policy 4.C: no advertising in tool results (see
  [Data handling](#7-data-handling)).
- The Directory Terms require a channel for security vulnerability reports.
  The app's `SECURITY.md` routes them to GitHub private vulnerability
  reporting.

## Sources

- https://claude.com/docs/directory/publish
- https://claude.com/docs/connectors/building/submission
- https://claude.com/docs/connectors/building/review-criteria
- https://claude.com/docs/connectors/building/authentication
- https://claude.com/docs/connectors/building/directory-vs-custom
- https://claude.com/docs/connectors/building/managing-your-listing
- https://claude.com/docs/connectors/building/after-publishing
- https://claude.com/docs/directory/submission-status
- https://claude.com/docs/plugins/submit
- https://claude.com/docs/plugins/pre-submission-checklist
- https://claude.com/docs/plugins/platform-support
- https://claude.com/docs/plugins/overview
- https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
- https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms
- https://www.anthropic.com/legal/aup
- https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp
- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/plugins/publish
- https://code.claude.com/docs/en/discover-plugins
- https://code.claude.com/docs/en/plugins/anthropic-marketplaces
- https://claude.com/pricing
- https://claude.com/marketplace/connectors/pocketsmith-complete-access
- https://smpl.money/terms/
- https://smpl.money/privacy/
- https://smpl.money/docs/agents-and-mcp/
- https://app.smpl.money/.well-known/oauth-protected-resource
- https://app.smpl.money/.well-known/oauth-authorization-server
