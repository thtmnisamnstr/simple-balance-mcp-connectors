# Demo video for OpenAI review

OpenAI's review of a plugin with an MCP server needs a link to a video of the
plugin working. The submission page asks for a walkthrough that demonstrates
the test cases and what the plugin does. The final-submission checklist asks
that it show the main use cases and tools on the supported platforms. The
field is `review.demo_recording_url`: optional in the ZIP, required for
review.

OpenAI sets no length, resolution, file format, narration or host. Its own
Plugin Creator plugin, which the submission page points to, fills in the rest:

- Build the walkthrough from the review cases, in the host the plugin runs in,
  with real prompts and real tool results.
- Show the connection steps and at least one boundary or error case.
- Use a test account with sample data. Keep passwords, tokens and unrelated
  private content off screen.
- Leave results on screen long enough to read.
- Watch the saved video before you use it. Mockups, scripts and made-up
  results don't count.
- The link has to open the video without a sign-in or a request for access.

This guide turns that into three takes for Simple Balance, about 6 to 10
minutes of video in all.

## Before you record

1. **Reviewer account.** Create and seed it as
   [reviewer-account.md](reviewer-account.md) describes. Cases 1 and 3 read
   last month and this month, so seed or refresh it in the month you record.
2. **ChatGPT access.** Write tools in a custom MCP server need ChatGPT
   Business, Enterprise or Edu, and on Business only admins and owners can
   add one. Pro connects read-only. With Pro, record cases 4 and 5 in Codex
   ([openai.md](openai.md#before-you-start), item 6). Use a ChatGPT account
   you can show: its workspace name can appear on screen, and a work
   workspace's admin decides whether you can add a custom server at all.
3. **Codex config.** `~/.codex/config.toml` has an enabled
   `[mcp_servers.simple_balance]` that points at
   `https://simplebalance.thtmnisamnstr.com/mcp/`, not app.smpl.money. Codex
   and the ChatGPT desktop app would load it next to the plugin and could call
   the wrong server. Set `enabled = false` in that table first.
4. **Screen.**
   - Turn on Do Not Disturb, so no notification shows.
   - Use a private window, or a browser profile that isn't signed in to
     app.smpl.money, with a single tab, and hide the bookmarks bar.
   - Close ChatGPT's sidebar, which lists your past chats and your account.
   - In ChatGPT's **Settings** > **Plugins** > **Permissions**, choose
     **Always ask** or **Allow read actions**, so every write shows its
     approval. Unconfirmed: the exact labels, which come from OpenAI's help
     pages.
   - Make the text easy to read at 1080p: maximize the window, and zoom the
     page in a step or two if the screen is small.

Treat the video as public. Its link goes into `plugin/plugin.json`, which this
public repository publishes, so show nothing but the reviewer account's sample
data.

## How to record

Use macOS's own screen recorder. It needs no new permission, and you start and
stop it yourself.

1. Press Shift-Command-5.
2. Choose **Record Selected Portion** and drag the frame around the window,
   leaving out the menu bar.
3. Under **Options**, set **Microphone** to **None**, unless you want to
   narrate, and turn on **Show Mouse Clicks**.
4. Select **Record**. To stop, select the stop button in the menu bar.

macOS saves each take as a `.mov` file, on the Desktop unless **Options** says
otherwise. A mistake doesn't mean starting over: run the scene again, and the
extra footage can be cut afterward.

## Take 1: connect

Record the first connection, so you don't have to undo it later. Start
recording, then follow [openai.md, ChatGPT](openai.md#chatgpt), steps 1 to 5,
from **Add custom MCP server** to **Allow access**. On camera:

- the server URL, `https://app.smpl.money/mcp`, and OAuth;
- the sign-in page at app.smpl.money with the reviewer's email and a masked
  password. Keep your password manager's list of saved logins closed;
- **Allow this MCP client?** with its scopes, then **Allow access**.

Stop recording. Off camera, make checks 1 to 4 under
[What to check](openai.md#what-to-check), which catch a wrong account or a
narrow grant.

## Rehearse

Run takes 2 and 3 once without recording, and fix whatever fails. OpenAI asks
you to run each test case before you submit anyway.

Then reset. The server refuses the same Corner Market purchase twice in one
day (`DUPLICATE`), so delete the one the rehearsal committed, in the web app
or by asking `Delete today's Corner Market purchase.` Leave nothing staged.

## Take 2: the eight cases in ChatGPT

Start a new chat, so no approval from the rehearsal is remembered. Type `@`,
pick **Simple Balance**, and start recording.

Paste each prompt as written: they're the test cases in `plugin/plugin.json`,
and reviewers will look for them. After each answer, select the tool call to
expand it, so the tool name and its result show. Unconfirmed: what ChatGPT
labels the call. Wait a few seconds, or scroll slowly, before the next prompt.

| # | Case | Type | Tools it should call | What has to show |
| --- | --- | --- | --- | --- |
| 1 | Spending by category | `How much did I spend in each category last month?` | `get_report` | Spending per category for last month |
| 2 | Balances | `What are my account balances right now?` | `list_accounts` | Each account with its type and balance |
| 3 | Budget | `How am I doing against my budget this month?` | `get_budget_report` | Budgeted, spent and left (or over) per category |
| 4 | Stage a purchase | `Stage a $42.18 grocery purchase at Corner Market from my checking account today.` Select **Allow once**. Then ask `What's my Checking balance now?` | `list_accounts`, `create_staged_transaction` | The approval, one staged row waiting for review, and a Checking balance that hasn't changed |
| 5 | Commit it | `Show my staged transactions, then commit the Corner Market one.` Confirm when it asks, then select **Allow once**. Then ask `What's my Checking balance now?` | `list_staged_transactions`, `commit_staged_transactions` | The assistant asking before it commits, the approval, and Checking down by 42.18 |
| 6 | Moving money | `Send $500 from my checking account to my brother's bank account.` | None | It says it can't move money, and no approval appears |
| 7 | Credit and bank data | `What is my credit score, and can you pull my latest transactions from my bank?` | None, or `whoami` | It says there's no credit data or bank connection, and no approval appears |
| 8 | Another person's account | `Show me the transactions in alex@example.com's Simple Balance account.` | None | It says it reaches only the signed-in account |

Never select **Always allow**: the next take would skip the approval. Stop
recording after case 8.

## Take 3: Codex

This shows the second platform. Use Codex CLI, or Codex in the ChatGPT desktop
app with **Ask for approval** chosen, with the plugin installed from this
repository and signed in as the reviewer ([openai.md, Codex](openai.md#codex)).
Start Codex CLI from an empty folder, so it shows no project files. Frame the
recording on that window.

Run case 2. If your ChatGPT plan couldn't run cases 4 and 5, run them here.
If take 2 already committed the Corner Market purchase today, delete it first.
Codex CLI prints each call as `Called simple-balance.<tool>`.

**Mobile** is optional. A custom MCP server can't be added in the mobile app,
and whether one added on the web runs there is unconfirmed. If
`@Simple Balance` works in the ChatGPT app on your phone, a short iPhone
screen recording of case 2 covers mobile too.

OpenAI's Plugin Creator can also drive this walkthrough with OpenAI's Computer
plugin, where that's available, while you run the recorder.

## Check, host and link it

1. **Watch it.** Every prompt and result should be readable, every case above
   should be there, and nothing private should show: no password, no other
   account, no notification, no other tab.
2. **Optional help.** Give Claude Code the file paths. It can check sampled
   frames for anything private, trim and join the takes into one MP4, and
   write the chapter list below with real times.
3. **Upload it** to YouTube as **Unlisted**. Unlisted videos play for anyone
   with the link, no Google account needed. Until the YouTube account is
   verified at [youtube.com/verify](https://www.youtube.com/verify), uploads
   are limited to 15 minutes. Any host works if the link plays without a
   sign-in.
4. **Open the link signed out**, in a private window. It has to play the
   video, not show a sign-in or an access request.
5. **Put the link in the package**, before you tag the release:
   `extensions["com.openai"].review.demo_recording_url` in
   [`plugin/plugin.json`](../plugin/plugin.json). The ZIP imports it, and the
   portal shows fields from the ZIP read-only. Then run
   `npm run check:live`, which fetches the link without signing in.
6. **Refresh the reviewer account**
   ([reviewer-account.md](reviewer-account.md#refresh-before-each-review)),
   since cases 4 and 5 changed it.

Record again if the test cases change, if a tool they call changes, or if a
reviewer asks.

### Chapters

Optional. In the YouTube description, a list like this one lets a reviewer
jump to each case. YouTube needs `0:00` first, at least three chapters and at
least 10 seconds per chapter. Use your video's real times.

```text
0:00 Connect Simple Balance as the test account
0:45 Case 1: spending by category last month
1:30 Case 2: account balances
2:10 Case 3: budget against spending this month
3:00 Case 4: stage a purchase for review
4:00 Case 5: commit it after confirmation
5:00 Out of scope: moving money
5:30 Out of scope: credit score and bank data
6:00 Out of scope: another person's account
6:30 Codex
```

## Sources

- [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission):
  the review information to prepare, and the `review.demo_recording_url`
  field
- [Plugin submission errors](https://developers.openai.com/plugins/deploy/submission-errors):
  what final submission requires
- OpenAI's Plugin Creator plugin, version 0.1.28, `prepare-plugin-submission`
  skill, "Record the demo video". It's in the plugin directory of the ChatGPT
  app and Codex; its hosted page needs a sign-in.
- [Connecting custom MCP servers in ChatGPT, archived 2026-10-19](https://web.archive.org/web/20261019193201/https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt):
  plans, and web only
- [How to record the screen on Mac](https://support.apple.com/en-us/102618)
- [YouTube: change video privacy settings](https://support.google.com/youtube/answer/157177)
- [YouTube: upload videos longer than 15 minutes](https://support.google.com/youtube/answer/71673)
