# Reviewer test account

One Simple Balance account at app.smpl.money that every directory's reviewers
sign in to, holding fictional data that matches the eight test cases in
[`plugin/plugin.json`](../plugin/plugin.json). Its email and password go only
into the places under [Hand over the credentials](#hand-over-the-credentials)
and into your password manager, never into a file, commit, issue or pull
request. The OpenAI ZIP rejects `test_credentials` and `reviewer_instructions`,
and `npm run check` fails if `plugin/plugin.json` carries either.

## What the account is

| Property | Why |
| --- | --- |
| An address you control that nobody else reads | Verification and password-reset links go to it. smpl.money's mail runs through Cloudflare Email Routing, so a routed address such as `review@smpl.money` that forwards to you works. |
| Email verified before any submission | app.smpl.money won't sign in an unverified address. OpenAI rejects an account that needs "MFA approval, email or SMS codes, magic links". |
| Password sign-in, Google not connected | Reviewers can't use your Google account. |
| No second factor | The app has none, so there's nothing to turn off. |
| Free plan, two of its three accounts in use | Creating a fourth active account is refused, and a free account that was never upgraded can't have an account frozen. The free place lets a reviewer try `create_account`, and keeps reviewers from the plan-limit refusal, whose text suggests upgrading. |
| Fictional data only | OpenAI asks for sample data, "not a real user's account". |

Don't give the account a plan grant. When a grant ends with more than three
accounts active, all but the oldest three freeze, and a frozen account refuses
every change to what it holds, the test cases' changes included.

## Create the account

1. Create the address and check that mail sent to it reaches you.
2. Open a private browser window and go to https://app.smpl.money/sign-in. A
   private window can't reuse a session you already have there.
3. Under the email form, choose **Create an account**. Enter **Your name**
   `App Review` and the **Email address**. Generate a password of at least 20
   characters (the app's minimum is 12) and enter it in **Password** and
   **Confirm password**. Choose **Create account**.
4. Open the link in the verification email within an hour. It confirms the
   address and doesn't sign you in. If it expires, trying to sign in sends a
   fresh one.
5. Sign in with the email form (**Sign in**), then open **Settings**.
6. Under **Regional defaults**, confirm **Timezone** and set
   **Default account currency or crypto asset** to `USD`, then choose
   **Save preferences**. The app takes both from the browser at the first
   sign-in. "Today", "this month" and "last month" in every test case follow
   this timezone.
7. Under **Sign-in methods**, leave **Google** alone: don't choose
   **Connect Google**.
8. Save the email, password and timezone in your password manager.

Check: sign out, then sign in again with the email and password. You reach
**Overview** without a code or a link. In **Settings**, under
**Sign-in methods**, **Email and password** reads **Ready** and **Google**
reads **Not connected**.

## Connect a client to it

The seed and refresh prompts run in any MCP client whose grant on this account
includes `ledger:write`. These steps use Claude Code, which comes with a paid
Claude plan, and pin the scopes: without `oauth.scopes`, Claude Code lets the
server determine them, and it may get the server's read-only default
([prerequisites.md](prerequisites.md#15-scope-in-the-first-401) item 15).

1. In a terminal:

   ```bash
   mkdir -p ~/sb-review && cd ~/sb-review
   claude mcp add-json simple-balance-review '{"type":"http","url":"https://app.smpl.money/mcp","oauth":{"scopes":"openid profile email offline_access ledger:read ledger:stage ledger:write"}}'
   claude mcp login simple-balance-review --no-browser
   ```

   `add-json` uses the local scope by default, so `simple-balance-review`
   exists in this folder only, and its name keeps it apart from any
   `simple-balance` server you use with your own ledger.
2. Open the URL the last command prints in a private browser window. A window
   signed in to your own account at app.smpl.money would give the grant to your
   own ledger.
3. Sign in as the reviewer with the email form. On **Allow this MCP client?**,
   check that the list includes `ledger:write`, then choose **Allow access**.
4. The browser ends on a `localhost` address, which may not load. Copy the
   whole URL from the address bar and paste it at the terminal's prompt.

Check: in the private window, open **Settings**. Under **Connected agents**, a
new client reads **Read, stage, and commit**.

## Seed the sample data

The prompt below has the client build what the test cases expect, with the
server's own tools: two accounts, seven categories, five monthly budgets and
24 transactions across last month and this month, dated from the day it runs.
Every payee is a generic made-up name. The prompt first checks that it's
connected to the reviewer account, and stops if it isn't.

1. Replace `REVIEWER_EMAIL` with the account's address.
2. Run `claude` in `~/sb-review` and paste the prompt. Claude Code asks before
   each of about 50 tool calls; allowing a tool for the rest of the session
   saves the repeats.
3. Compare its last message with [Check the data](#check-the-data).

```text
Set up sample data in this Simple Balance test account for app reviewers. Every name and amount below is fictional.

Rules for the whole task:
- Use only the tools of the MCP server named simple-balance-review. Create, change or delete nothing that isn't listed here.
- Money is a decimal string such as "86.40", never a JSON number. Every transaction amount is positive; the type says which way the money moved. An opening balance is signed: Credit Card's is "-350.00".
- Choose one run tag now: "rv-", today's date, "-" and four random lowercase letters. Each write's idempotencyKey is "<run tag>-<step id>". Retry a failed call with the same key.
- If a call is refused, or something exists but differs from what's described here, stop and show me. Never send allowDuplicate true.

1. Call whoami. Stop and change nothing unless its email is REVIEWER_EMAIL and its scopes include ledger:write.
2. Call get_preferences and show me the timezone and default currency. Stop if the default currency isn't USD.
3. Call get_financial_summary with no arguments. Its asOf is TODAY. THIS_MONTH is TODAY's calendar month and LAST_MONTH the month before. Below, "L<n>" is day n of LAST_MONTH, and "T<n>" is day n of THIS_MONTH, or TODAY if that day is later than TODAY.

4. Accounts. Call list_accounts with includeArchived true. With create_account, create only the ones missing, in USD, with openingDate L1:
   a1  "Checking", type checking, openingBalance "2400.00"
   a2  "Credit Card", type credit_card, openingBalance "-350.00"
   Create no other account. The free plan keeps three active, and the third place stays free for reviewers.

5. Categories. Call list_categories with includeArchived true. With create_category, create only the ones missing, and restore any of them that is archived with archive_category:
   c1 Groceries, c2 Dining Out, c3 Rent, c4 Utilities, c5 Transportation, c6 Entertainment: kind expense
   c7 Salary: kind income

6. Budgets. Call list_budget_plans. For each row below whose category has no USD monthly plan covering THIS_MONTH, call create_budget_plan with currency USD, periodUnit month, activeFrom L1 and no activeTo:
   b1 Groceries "400.00", b2 Dining Out "50.00", b3 Utilities "175.00", b4 Transportation "120.00", b5 Entertainment "60.00"

7. Transactions. Call create_transaction once per row below, with the account and category ids from steps 4 and 5, notes "Sample data for app review" and allowDuplicate false. For t15, send type transfer with fromAccountId Checking, toAccountId Credit Card and sourceAmount "350.00", and no category.

   step  date  type        account                  payee                  category        amount
   t01   L1    deposit     Checking                 Employer Payroll       Salary          2850.00
   t02   L2    withdrawal  Checking                 Oak Street Apartments  Rent            1450.00
   t03   L4    withdrawal  Credit Card              Hillside Grocery       Groceries       86.40
   t04   L6    withdrawal  Credit Card              Main Street Diner      Dining Out      27.50
   t05   L8    withdrawal  Checking                 City Power & Water     Utilities       96.20
   t06   L9    withdrawal  Credit Card              Corner Market          Groceries       54.75
   t07   L10   withdrawal  Credit Card              Fuel Stop              Transportation  48.00
   t08   L12   withdrawal  Checking                 Home Internet Service  Utilities       65.00
   t09   L14   withdrawal  Credit Card              Streaming Service      Entertainment   15.99
   t10   L15   deposit     Checking                 Employer Payroll       Salary          2850.00
   t11   L18   withdrawal  Credit Card              Hillside Grocery       Groceries       112.30
   t12   L20   withdrawal  Credit Card              Noodle House           Dining Out      46.80
   t13   L22   withdrawal  Credit Card              Downtown Parking       Transportation  18.00
   t14   L25   withdrawal  Credit Card              Corner Market          Groceries       38.60
   t15   L26   transfer    Checking to Credit Card  Credit Card Payment    (none)          350.00
   t16   L27   withdrawal  Credit Card              Neighborhood Cinema    Entertainment   24.00
   t17   T1    deposit     Checking                 Employer Payroll       Salary          2850.00
   t18   T2    withdrawal  Checking                 Oak Street Apartments  Rent            1450.00
   t19   T3    withdrawal  Credit Card              Hillside Grocery       Groceries       63.45
   t20   T4    withdrawal  Credit Card              Main Street Diner      Dining Out      58.20
   t21   T5    withdrawal  Credit Card              Corner Market          Groceries       29.10
   t22   T6    withdrawal  Credit Card              Fuel Stop              Transportation  44.00
   t23   T7    withdrawal  Credit Card              Streaming Service      Entertainment   15.99
   t24   T8    withdrawal  Checking                 City Power & Water     Utilities       92.75

8. Report whoami's plan, accountLimit and accountsUsed; the balances from list_accounts; get_report with report "categories" from L1 to the last day of LAST_MONTH; and get_budget_report for THIS_MONTH.
```

## Check the data

| What | Expected |
| --- | --- |
| `whoami` | `plan` `free`, `accountLimit` 3, `accountsUsed` 2 |
| Checking balance | 7,446.05 |
| Credit Card balance | -683.08, shown as **Amount owed** 683.08 |
| Spending last month | Rent 1,450.00, Groceries 292.05, Utilities 161.20, Dining Out 74.30, Transportation 66.00, Entertainment 39.99 |
| Income last month | Salary 5,700.00 |
| Budgets this month | Groceries 92.55 of 400.00 (307.45 left), Dining Out 58.20 of 50.00 (8.20 over), Utilities 92.75 of 175.00 (82.25 left), Transportation 44.00 of 120.00 (76.00 left), Entertainment 15.99 of 60.00 (44.01 left) |
| Unbudgeted this month | Rent 1,450.00 |

1. Compare the seed's last message with the table.
2. In the private window, open the web app: **Accounts** shows both balances,
   **Reports** with the **Categories** report for last month shows the same
   spending, and **Budgets** shows the same figures for this month. The first
   test case compares its answer with the Reports page, so the two must agree.
3. Run the eight test cases yourself, as OpenAI asks ([openai.md](openai.md)),
   with the fourth and fifth last. After the fifth, Checking reads 7,403.87.
4. Then [refresh](#refresh-before-each-review). The fifth case commits a Corner
   Market purchase dated that day. A reviewer who commits the same purchase on
   the same day is refused with `DUPLICATE`, and within three days the staged
   row is flagged as a likely duplicate.

## Hand over the credentials

| Where | What goes in | Notes |
| --- | --- | --- |
| OpenAI: **Metadata & Skills** > **Review information** > **Review details** | Login URL `https://app.smpl.money/sign-in`, the email and password, no workspace or tenant, and the sign-in steps below. Then **Save details**. | Keep the account and its data for later reviews; OpenAI wants an updated draft if the credentials change. The portal's **MCPs** > **Connect** step signs in with this account too ([openai.md](openai.md)). The labels inside **Review details** are unconfirmed. |
| Claude: the MCP connector form's **Test & launch** step | The email and password in the credential fields, and the reviewer block from [claude-directory.md](claude-directory.md#8-test--launch), checked as that step describes | Sign in with this account in the **Connection** step as well, so the tool sync sees all 77 tools. |
| Docker: the [Share Testing Credentials](https://forms.gle/6Lw3nsvu2d6nFg8e6) form | **Test Credentials (API key, username/password etc.)**: the email and password | Fill it in once the PR exists. [docker/README.md](docker/README.md) has the other fields. |
| Glama | Not this account | Its test profile keeps a standing grant, so Glama gets a separate, empty account. [mcp-registry.md](mcp-registry.md#glama) has the steps and the scope to use. |
| Anyone else | A private channel only, such as a reply to the platform's review email | Never a PR, issue, commit or file. GitHub issues are public. |

Before a portal or a test client connects with this account, sign out of
app.smpl.money in that browser. The consent screen doesn't say which account
is granting, so a session still signed in to your own account grants your own
ledger ([prerequisites.md](prerequisites.md#16-redirect-host-on-the-consent-screen)
item 16).

Sign-in steps for reviewers, for OpenAI's **Review details** or any form that
asks:

```text
Simple Balance signs in with OAuth. When the client opens app.smpl.money, use the "Sign in with your email" form with the email and password provided, not "Continue with Google". Then choose "Allow access" on the "Allow this MCP client?" screen. No code, second factor or email link is needed. The account holds fictional sample data in USD on the free plan: three accounts can be active, and two are in use. "Today", "this month" and "last month" follow the account's timezone, shown under Settings > Regional defaults.
```

## Refresh before each review

The test cases ask about "last month" and "this month", and the seed dates its
rows from the day it runs, so a month later "this month" is empty and "last
month" holds the wrong rows. Whatever a reviewer created or changed stays
behind too. Refresh before each submission or resubmission, at the start of a
month while a review is open, and after you run the fourth and fifth test
cases yourself.

1. If you revoked the seeding client, sign in again from `~/sb-review` with
   `claude mcp login simple-balance-review --no-browser`, in a private window
   as before.
2. Run `claude` in `~/sb-review`, paste the refresh prompt below with
   `REVIEWER_EMAIL` replaced, and approve its deletions. Check the timezone it
   reports against the one you saved.
3. Paste the seed prompt. It picks a new run tag: a key reused from an earlier
   run would return that run's result instead of writing.
4. [Check the data](#check-the-data) again.

```text
Reset the sample data in this Simple Balance test account before a review. Everything in it is fictional, and you have my go-ahead for the deletions below, on this account only.

Rules for the whole task:
- Use only the tools of the MCP server named simple-balance-review.
- Choose a new run tag: "rv-", today's date, "-" and four random lowercase letters. Give each call that takes an idempotencyKey its own, "<run tag>-<step id>-<n>", counting n up from 1 within a step, dry runs included. Retry a failed call with the same key.
- Where a tool offers dryRun, run it with dryRun first, then for real.
- Never revoke a connected agent. If a call is refused or something is unexpected, stop and show me.

1. Call whoami. Stop and change nothing unless its email is REVIEWER_EMAIL and its scopes include ledger:write.
2. Call get_preferences and show me the timezone and default currency.
3. Call list_accounts with includeArchived true. Stop and change nothing if there's no account named Checking with openingBalance "2400.00", or none named Credit Card with openingBalance "-350.00".
4. r1: Page through list_staged_transactions and delete every staged row with delete_staged_transactions.
5. r2: Call preview_bulk_transaction_selection with an empty filter. If it counts any rows, call bulk_delete_transactions with selection mode "filter", the same empty filter, no excluded ids, and the count and fingerprint the preview returned. Deleting posts reversals, so balances and reports ignore those entries.
6. r3: Delete every recurring transaction (list_recurrences, delete_recurrence), every template (list_transaction_templates, bulk_delete_transaction_templates), every standing budget (list_budget_plans, delete_budget_plan) and every single-period budget (list_budget_entries, delete_budget_entry). Skip any kind that has none.
7. r4: Delete each account other than Checking and Credit Card with delete_account, or archive it with archive_account if it has history. Then restore Checking or Credit Card with archive_account if either is archived.
8. r5: Delete each category (list_categories with includeArchived true, delete_category) and each category group (list_category_groups, delete_category_group) whose name starts with "Review". If one is refused because something still refers to it, leave it and report it.
9. Report what you deleted, archived and restored.
```

## After a review

1. In a private window, sign in as the reviewer and open **Settings**.
2. Under **Connected agents**, find the clients the review added: the line
   under each name says when it was approved. For each, choose **Revoke**, then
   **Revoke access**. It loses access at once, including any token it already
   holds.
3. Keep the OpenAI portal's connection, made at **MCPs** > **Connect**, and
   your seeding client if you'll refresh soon. OpenAI's later scans may use the
   portal's connection (unconfirmed), and until
   [prerequisites.md](prerequisites.md) item 13 ships, a revoked client can be
   deleted a day later and then fails with `invalid_client`.
4. Check that the clients you kept are still listed: a reviewer holding
   `ledger:write` can call `revoke_connected_agent`.

Check: **Connected agents** lists only the clients you kept.

Keep the password. Changing or resetting it disconnects every client, the
portal's included, and OpenAI wants an updated draft when credentials change.
If it leaks, change it, reconnect the portal, and update every form above.

## Sources

- OpenAI: [submission](https://developers.openai.com/plugins/deploy/submission)
  (reviewer credentials and **Review details**),
  [guidelines](https://developers.openai.com/plugins/plugin-guidelines) (test
  credentials), [review requirements](https://developers.openai.com/plugins/deploy/app-review)
- Anthropic: [Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)
  (3.D, a testing account with sample data),
  [connector submission](https://claude.com/docs/connectors/building/submission),
  [Claude Code MCP](https://code.claude.com/docs/en/mcp) (`add-json`,
  `oauth.scopes`, `mcp login --no-browser`)
- Docker: [CONTRIBUTING](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md),
  [testing-credentials form](https://forms.gle/6Lw3nsvu2d6nFg8e6)
- Glama: [methodology](https://glama.ai/mcp/methodology) (test profiles)
- Simple Balance: [sign-in options](https://app.smpl.money/api/auth/methods)
  (open registration, verification required, 12-character minimum), and the
  [application source at `5a251d7`](https://github.com/thtmnisamnstr/simple-balance/tree/5a251d7b4d0d0da8e937bcbd4264f2708a39127d):
  tool schemas in `src/server/mcp.ts` and `src/shared/domain.ts`, screen labels
  in `src/client/App.tsx` and `src/client/pages/SettingsPage.tsx`, and the
  duplicate checks in `src/server/services/transactions.ts` and
  `src/server/services/staging.ts`
