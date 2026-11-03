# Annotation justifications

For OpenAI's portal. Final submission of a plugin with an MCP server lists
explicit `readOnlyHint`, `destructiveHint` and `openWorldHint` values on every
tool with a justification for each value, and the portal's
`justification_required` error says the same. The plugin guidelines, on the
other hand, say justifications are no longer required. Which one the portal
follows is unconfirmed, so this page has all of them: three for each tool.
Paste each where the portal asks for it.

- A justification explains a value; it can't change one. The portal shows what
  its scan read from the server. If a value is wrong, fix the app, deploy, and
  rescan.
- The values are the ones the server advertises at app 0.2.1, recorded in
  [tools.json](tools.json). Every tool uses one of four presets, listed in
  [openai.md](openai.md#annotation-justifications).
- `npm run check` fails if a tool in `tools.json` has no section here, if a
  section names a tool the server doesn't have, or if a value here differs
  from `tools.json`. After `npm run sync-tools`, write a section for each new
  tool. The app's `main` already has six that 0.2.1 doesn't:
  `export_ledger_file`, `preview_ledger_file`, `add_ledger_file`,
  `move_ledger_file`, `list_learn_articles` and `get_learn_article`.

## Points a reviewer may question

Each value below follows OpenAI's rules, but these side effects could catch a
strict reading. The justifications mention each one.

- **`create_transaction`** is additive, with `destructiveHint` false. It adds
  an entry and changes none. But the entry changes balances, OpenAI's
  guidelines treat irreversible transactions as destructive, and the tool's
  description says "Directly commit". The entry is a bookkeeping record that
  can be deleted, not a payment.
  [prerequisites.md, item 37](prerequisites.md#37-annotations-a-reviewer-may-question)
  weighs changing it.
- **`create_transaction` and `stage_csv`** restore an archived category the
  entry or file names (`stage_csv` only with `ledger:write`). That changes an
  existing row, though no data is lost.
- **`create_account`** lifts the freeze on frozen accounts when every open
  account fits the plan's limit.
- **`create_recurrence`, `update_recurrence`, `create_transaction_template`
  and `update_transaction_template`** can turn on reminder emails. They go only
  to the account owner's own address, never to a recipient the caller names,
  which is why `openWorldHint` stays false.

## Read tools (37)

### `list_accounts`

- `readOnlyHint` true: Lists the user's accounts and sums each one's postings into a balance, optionally as of a date. It creates, edits and deletes nothing.
- `destructiveHint` false: Read-only: listing accounts and computing their balances cannot delete, overwrite or archive any account or posting.
- `openWorldHint` false: Confined to the signed-in user's private Simple Balance ledger: it reads only their accounts and postings and calls no public site or third-party service.

### `get_account_balances`

- `readOnlyHint` true: Computes one account's beginning, ending, current and future balances by summing its postings over the requested dates. It writes nothing.
- `destructiveHint` false: Read-only: computing one account's balances cannot delete, overwrite or reverse any posting.
- `openWorldHint` false: Reads postings only on an account the signed-in user owns, in their private Simple Balance ledger. It calls no public site or third-party service.

### `list_categories`

- `readOnlyHint` true: Lists the user's income and expense categories with counts of the committed and staged transactions that use each. It creates and changes nothing.
- `destructiveHint` false: Read-only: listing categories and counting their use cannot archive, merge or delete any category.
- `openWorldHint` false: Confined to the signed-in user's private Simple Balance ledger: it reads only their categories, transactions and staged rows, with no outside service involved.

### `list_duplicate_categories`

- `readOnlyHint` true: Finds the user's categories whose names match after normalization and returns them in groups. It only reports; merging is the separate merge_categories tool.
- `destructiveHint` false: Read-only: reporting likely duplicates merges, renames and deletes nothing, so no category is lost.
- `openWorldHint` false: Compares only the signed-in user's own category names in their private Simple Balance ledger. It calls no public site or third-party service.

### `list_payees`

- `readOnlyHint` true: Lists every payee spelling on the user's transactions and staged rows with how many entries carry each, optionally filtered by text. It writes nothing.
- `destructiveHint` false: Read-only: listing payee spellings cannot rename, merge or delete any payee or the transactions that carry it.
- `openWorldHint` false: Derives payees only from the signed-in user's own transactions in their private Simple Balance ledger. It calls no public site or third-party service.

### `list_duplicate_payees`

- `readOnlyHint` true: Groups the user's payee spellings that collide once Unicode form, whitespace and case are normalized. It reports the groups and changes no payee text.
- `destructiveHint` false: Read-only: merging is the separate merge_payees tool, so this call rewrites and deletes nothing.
- `openWorldHint` false: Compares only payee text on the signed-in user's own transactions in their private Simple Balance ledger. No public internet or third party is involved.

### `list_transactions`

- `readOnlyHint` true: Searches the user's committed deposits, withdrawals and transfers and returns one page of results. It creates, edits and deletes nothing.
- `destructiveHint` false: Read-only: searching and paging through transactions cannot delete, overwrite or reverse any entry.
- `openWorldHint` false: Searches only the signed-in user's own committed transactions in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_transaction`

- `readOnlyHint` true: Returns one committed transaction by id with its legs, accounts and category. It changes nothing.
- `destructiveHint` false: Read-only: fetching a transaction cannot delete, overwrite or reverse it.
- `openWorldHint` false: Returns a transaction only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `preview_bulk_transaction_selection`

- `readOnlyHint` true: Counts the committed transactions a filter matches and returns a fingerprint of their ids and versions. It saves no selection and locks no row.
- `destructiveHint` false: Read-only preview: it edits and deletes nothing, and a later bulk write that sends its fingerprint is refused if the matching set has changed.
- `openWorldHint` false: Matches only the signed-in user's own committed transactions in their private Simple Balance ledger. No public internet or third party is involved.

### `get_account`

- `readOnlyHint` true: Returns one account by id with its balance, archived date and frozen flag. It changes nothing.
- `destructiveHint` false: Read-only: fetching an account cannot archive, delete or overwrite it.
- `openWorldHint` false: Returns an account only when the signed-in user owns it, from their private Simple Balance ledger. It calls no public site or third-party service.

### `get_category`

- `readOnlyHint` true: Returns one category by id, including an archived one, so its state can be checked. It changes nothing.
- `destructiveHint` false: Read-only: fetching a category cannot archive, merge, delete or overwrite it.
- `openWorldHint` false: Returns a category only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `whoami`

- `readOnlyHint` true: Returns the user's name and email, the calling client's id, the granted scopes and the plan's account limit. It writes nothing and sends no email.
- `destructiveHint` false: Read-only: reporting identity, scopes and plan limits cannot change the account, the plan or any granted access.
- `openWorldHint` false: Reads only the signed-in user's own profile and plan rows in Simple Balance, plus this connection's granted scopes. No third party is contacted.

### `get_preferences`

- `readOnlyHint` true: Returns the user's timezone, default currency and color theme. When none are saved it returns defaults without saving them.
- `destructiveHint` false: Read-only: reading preferences cannot overwrite them; changing them takes the separate set_preferences tool.
- `openWorldHint` false: Reads only the signed-in user's own preference row in their private Simple Balance account. It calls no public site or third-party service.

### `list_payee_suggestions`

- `readOnlyHint` true: Returns up to 100 existing payee spellings that match the typed text, ranked by how often each is used. It records nothing.
- `destructiveHint` false: Read-only: suggesting spellings cannot rename, merge or delete any payee.
- `openWorldHint` false: Draws suggestions only from the signed-in user's own transactions and staged rows in their private Simple Balance ledger. No outside service is called.

### `list_import_batches`

- `readOnlyHint` true: Lists the user's CSV imports that still have staged rows waiting, with row counts. It imports, commits and discards nothing.
- `destructiveHint` false: Read-only: listing import batches cannot commit, edit or discard any staged row.
- `openWorldHint` false: Reads only the signed-in user's own import batches and staged rows in their private Simple Balance ledger. It calls no public site or third-party service.

### `preview_csv`

- `readOnlyHint` true: Parses CSV text sent in the call and returns its delimiter, headers and first 25 rows. It stages nothing and does not read or write the ledger.
- `destructiveHint` false: Read-only: the text is parsed in memory, so no record can be created, overwritten or deleted.
- `openWorldHint` false: Works only on the CSV text passed in the call. It fetches no URL and calls no public site or third-party service.

### `summarize_own_data`

- `readOnlyHint` true: Counts the user's accounts, transactions, categories, waiting staged rows, recurrences, import batches, payees and connected agents. It changes nothing.
- `destructiveHint` false: Read-only: it only counts records, so nothing is deleted, overwritten or canceled.
- `openWorldHint` false: Counts only the signed-in user's own rows in their private Simple Balance account. It calls no public site or third-party service.

### `list_recurrences`

- `readOnlyHint` true: Lists the user's recurring transaction rules with next due dates worked out at read time and counts of what each proposed. Reading them runs no rule and stages nothing.
- `destructiveHint` false: Read-only: listing recurrences cannot pause, edit or delete a rule, or post or stage any transaction.
- `openWorldHint` false: Reads only the signed-in user's own recurrences and staged rows in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_recurrence`

- `readOnlyHint` true: Returns one recurring rule by id with its next due date and what it has proposed so far. Reading it does not run the rule or stage anything.
- `destructiveHint` false: Read-only: fetching a recurrence cannot change, delete or trigger it.
- `openWorldHint` false: Returns a recurrence only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `list_transaction_templates`

- `readOnlyHint` true: Lists the user's saved transaction templates with usage counts and reminder settings. It records no transaction and sends no reminder.
- `destructiveHint` false: Read-only: listing templates cannot edit or delete any template or the transactions made from one.
- `openWorldHint` false: Reads only the signed-in user's own templates in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_transaction_template`

- `readOnlyHint` true: Returns one saved template by id with its reminder setting. It records no transaction and sends nothing.
- `destructiveHint` false: Read-only: fetching a template cannot edit, delete or apply it.
- `openWorldHint` false: Returns a template only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `preview_bulk_staged_selection`

- `readOnlyHint` true: Counts the staged rows a filter matches and returns a fingerprint of their ids and versions. It saves no selection and locks no row.
- `destructiveHint` false: Read-only preview: it edits, commits and discards nothing, and a later bulk write that sends its fingerprint is refused if the matching set has changed.
- `openWorldHint` false: Matches only the signed-in user's own staged rows in their private Simple Balance ledger. No public internet or third party is involved.

### `list_staged_transactions`

- `readOnlyHint` true: Lists the user's staged rows with any validation issues and likely duplicates. It commits, edits and discards nothing, and staged rows count in no balance.
- `destructiveHint` false: Read-only: reviewing the staged queue cannot commit, change or discard any row.
- `openWorldHint` false: Reads only the signed-in user's own staged rows and transactions in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_staged_transaction`

- `readOnlyHint` true: Returns one staged row by id with its draft and any validation issues. It commits and changes nothing.
- `destructiveHint` false: Read-only: fetching a staged row cannot commit, edit or discard it.
- `openWorldHint` false: Returns a staged row only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `get_financial_summary`

- `readOnlyHint` true: Computes the user's balances, deposits, withdrawals and spending per currency up to today from their postings. It saves no result and changes nothing.
- `destructiveHint` false: Read-only: producing a summary cannot delete, overwrite or reverse any entry.
- `openWorldHint` false: Aggregates only the signed-in user's own accounts and postings in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_staged_duplicate`

- `readOnlyHint` true: Returns a staged row beside the committed transaction or staged row it appears to repeat. It deletes neither side; removing a copy takes a separate tool.
- `destructiveHint` false: Read-only: opening a possible duplicate pair cannot delete, commit or overwrite either row.
- `openWorldHint` false: Compares only the signed-in user's own staged rows and transactions in their private Simple Balance ledger. No public internet or third party is involved.

### `get_report`

- `readOnlyHint` true: Runs one of six reports, such as net worth or cash flow, as database totals over the user's postings for a date range. Nothing is saved or changed.
- `destructiveHint` false: Read-only: running a report cannot delete, overwrite or reverse any entry.
- `openWorldHint` false: Aggregates only the signed-in user's own accounts and postings in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_account_register`

- `readOnlyHint` true: Lists one account's postings in date order with the balance before and after each. It edits nothing.
- `destructiveHint` false: Read-only: listing an account's postings cannot change, delete or reverse any of them.
- `openWorldHint` false: Reads postings only on an account the signed-in user owns, in their private Simple Balance ledger. It calls no public site or third-party service.

### `export_transactions_csv`

- `readOnlyHint` true: Builds CSV text from the user's committed transactions that match the filters and returns it in the reply. It stores no file, sends nothing and changes no record.
- `destructiveHint` false: Read-only: exporting copies data into the reply and cannot delete, overwrite or reverse any transaction.
- `openWorldHint` false: Reads only the signed-in user's own transactions in their private Simple Balance ledger. The CSV goes back to the caller only; nothing is uploaded or sent elsewhere.

### `list_audit_events`

- `readOnlyHint` true: Pages through the user's append-only history of ledger writes, showing whether each came from the browser, an agent or the scheduler. Reading it adds no event.
- `destructiveHint` false: Read-only: the history is append-only and this call cannot edit or delete any event.
- `openWorldHint` false: Reads only the signed-in user's own audit events in their private Simple Balance ledger. It calls no public site or third-party service.

### `list_connected_agents`

- `readOnlyHint` true: Lists the MCP clients the user has authorized, the scopes each holds and whether it has a live token. It revokes and changes nothing.
- `destructiveHint` false: Read-only: revoking access is the separate revoke_connected_agent tool, so this call removes no grant or token.
- `openWorldHint` false: Reads only the signed-in user's own consent and token records in Simple Balance. It does not contact the listed clients or any other outside service.

### `list_category_groups`

- `readOnlyHint` true: Lists the user's category groups with how each is budgeted and how many categories it holds. It changes nothing.
- `destructiveHint` false: Read-only: listing groups cannot rename, regroup or delete any group or category.
- `openWorldHint` false: Reads only the signed-in user's own category groups in their private Simple Balance ledger. It calls no public site or third-party service.

### `list_budget_plans`

- `readOnlyHint` true: Lists the user's standing budgets with the category or group each one covers. It sets and changes nothing.
- `destructiveHint` false: Read-only: listing budgets cannot change or delete any budget.
- `openWorldHint` false: Reads only the signed-in user's own budgets in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_budget_plan`

- `readOnlyHint` true: Returns one standing budget by id, including the version a later change must send. It changes nothing.
- `destructiveHint` false: Read-only: fetching a budget cannot change or delete it.
- `openWorldHint` false: Returns a budget only when it belongs to the signed-in user's private Simple Balance ledger. It calls no public site or third-party service.

### `list_budget_entries`

- `readOnlyHint` true: Lists the user's single-period budget amounts that override a standing budget for one period. It sets and removes nothing.
- `destructiveHint` false: Read-only: listing overrides cannot change or remove any of them.
- `openWorldHint` false: Reads only the signed-in user's own budget entries in their private Simple Balance ledger. It calls no public site or third-party service.

### `get_forecast`

- `readOnlyHint` true: Projects the user's balances forward from their recurrences, and optionally budgets or past averages. The projection is computed per call and is never saved, staged or posted.
- `destructiveHint` false: Read-only: a projection changes no balance and cannot delete or overwrite any record.
- `openWorldHint` false: Uses only the signed-in user's own recurrences, budgets and postings in their private Simple Balance ledger. It calls no outside data source.

### `get_budget_report`

- `readOnlyHint` true: Compares what each budgeted category was allowed with what it spent, period by period and per currency, up to today. It changes no budget or transaction.
- `destructiveHint` false: Read-only: producing the report cannot change, delete or overwrite any budget or transaction.
- `openWorldHint` false: Aggregates only the signed-in user's own budgets and postings in their private Simple Balance ledger. It calls no public site or third-party service.

## Additive tools (9)

### `create_staged_transaction`

- `readOnlyHint` false: Writes data: it inserts one new row into the signed-in user's staged-transaction review queue and records it in the audit log.
- `destructiveHint` false: Additive only: it inserts a new staged row and changes or removes no existing row, and staged rows count in no balance until committed. Resending the same idempotencyKey returns the first result rather than adding a second row.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger in the app's database; it calls no third-party service, fetches no URL and sends nothing to anyone.

### `stage_csv`

- `readOnlyHint` false: Writes data unless dryRun is set: it records an import batch and adds one staged row per CSV row to the signed-in user's review queue.
- `destructiveHint` false: Additive: it adds an import batch and staged rows, which count in no balance until committed, and with ledger:write creates missing categories. Nothing is deleted; its one change to an existing row is unarchiving an archived category the file names.
- `openWorldHint` false: Reads only the CSV text sent in the call and writes only to the signed-in user's own Simple Balance ledger; it fetches no file or URL and calls no outside service.

### `create_category_group`

- `readOnlyHint` false: Writes data: it inserts a new category group into the signed-in user's ledger and records it in the audit log.
- `destructiveHint` false: Additive: it inserts one new group and moves no categories into it. A name matching an existing group is refused rather than overwritten, and no posting or balance changes.
- `openWorldHint` false: Bounded to the signed-in user's own categories and groups in Simple Balance's database; no outside service or recipient is involved.

### `create_budget_plan`

- `readOnlyHint` false: Writes data: it inserts a standing budget for one of the signed-in user's categories or groups.
- `destructiveHint` false: Additive: it inserts a new budget row and writes no postings. A window overlapping an existing budget for the same category or group is refused rather than replacing it, so no existing budget changes.
- `openWorldHint` false: Bounded to the signed-in user's own budgets in Simple Balance's database; it calls no outside service.

### `create_recurrence`

- `readOnlyHint` false: Writes data: it saves a new recurring transaction, and the app's scheduler later adds a staged row to the user's queue on each due date.
- `destructiveHint` false: Additive: it inserts a new recurrence, refuses a duplicate name and changes no existing row. Its later proposals are new staged rows for review that count in no balance until committed.
- `openWorldHint` false: Bounded to the signed-in user's own ledger. With notifyOnCreate on, the only message is an email to the account owner's own address on file, never to a recipient the caller names.

### `create_account`

- `readOnlyHint` false: Writes data: it creates a new account and posts its opening balance against the user's Opening Balances equity account.
- `destructiveHint` false: Additive: it inserts the account and its opening postings, refusing a duplicate name or a full plan. Its only change to existing accounts is marking frozen ones usable again when every open account fits the free plan's limit.
- `openWorldHint` false: Bounded to the signed-in user's own accounts in Simple Balance's database; the institution is a label, so it links to no bank and calls no outside service.

### `create_category`

- `readOnlyHint` false: Writes data: it inserts a new income or expense category into the signed-in user's ledger.
- `destructiveHint` false: Additive: it inserts one new category, and a name matching any existing category, archived ones included, is refused rather than overwritten. No posting or balance changes.
- `openWorldHint` false: Bounded to the signed-in user's own categories in Simple Balance's database; it calls no outside service.

### `create_transaction_template`

- `readOnlyHint` false: Writes data: it saves a new transaction template, and an optional email reminder schedule, in the signed-in user's ledger.
- `destructiveHint` false: Additive: it inserts a new template, refusing a duplicate name, and creates no transaction, posting or category. A category name in the draft stays text until an entry is made from the template.
- `openWorldHint` false: Bounded to the signed-in user's own templates. An optional reminder is emailed only to the account owner's own address on file, never to a recipient the caller names.

### `create_transaction`

- `readOnlyHint` false: Writes data: it records a new committed deposit, withdrawal or transfer with its postings in the signed-in user's ledger, which changes balances.
- `destructiveHint` false: Additive: it inserts a new entry and changes no existing entry, refusing a likely duplicate unless allowDuplicate is set, and moves no real money. Its one change to an existing row is unarchiving a category the draft names.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it records a bookkeeping entry and reaches no bank, payment network or other outside service.

## Destructive tools (20)

### `update_staged_transaction`

- `readOnlyHint` false: Writes data: it replaces the draft on one of the signed-in user's staged rows and records the change in the audit log.
- `destructiveHint` true: Overwrites: the staged draft is replaced whole, clearing omitted fields, and with ledger:write a category nothing else uses is deleted for good. The old draft stays in the audit log for re-entry, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own staged rows and categories in Simple Balance's database; it calls no outside service.

### `bulk_edit_staged_transactions`

- `readOnlyHint` false: Writes data unless dryRun is set: it changes the same fields on many of the signed-in user's staged rows in one call.
- `destructiveHint` true: Overwrites the patched fields, such as payee, notes or category, on every selected staged row, and with ledger:write deletes a category left unused; old values stay in the audit log. dryRun previews, and rows need versions or a preview fingerprint.
- `openWorldHint` false: Bounded to the signed-in user's own staged rows and categories in Simple Balance's database; it calls no outside service.

### `update_category_group`

- `readOnlyHint` false: Writes data: it renames one of the signed-in user's category groups or changes its budgeting policy.
- `destructiveHint` true: Overwrites the group's name or policy, which changes the figure the budget page reports for it; no posting changes. It needs expectedVersion, and the old values stay in the audit log so they can be set back.
- `openWorldHint` false: Bounded to the signed-in user's own category groups in Simple Balance's database; it calls no outside service.

### `update_budget_plan`

- `readOnlyHint` false: Writes data: it changes the amount, window or carry rules of one of the signed-in user's standing budgets.
- `destructiveHint` true: Overwrites the plan's amount, window or rule, changing the budgeted figure for every period it covers, past ones included, and null clears a field. It needs expectedVersion, writes no postings, and old values stay in the audit log.
- `openWorldHint` false: Bounded to the signed-in user's own budgets in Simple Balance's database; it calls no outside service.

### `set_budget_entry`

- `readOnlyHint` false: Writes data: it creates or changes the budget amount for a single period in the signed-in user's ledger.
- `destructiveHint` true: When the period already has an amount, this overwrites it and the old figure survives only in the audit log. That overwrite is refused unless the entry's current expectedVersion is sent, and no posting changes.
- `openWorldHint` false: Bounded to the signed-in user's own budgets in Simple Balance's database; it calls no outside service.

### `update_recurrence`

- `readOnlyHint` false: Writes data: it changes one of the signed-in user's recurring transactions, including its schedule, shape or email notice setting.
- `destructiveHint` true: Overwrites the stored name, schedule or shape (a new shape replaces the old one whole), so every future proposal changes. Rows already proposed are untouched; it needs expectedVersion, and old values stay in the audit log.
- `openWorldHint` false: Bounded to the signed-in user's own recurrences. If notifyOnCreate is on, notices go only to the account owner's own email address on file, never to a recipient the caller names.

### `revoke_connected_agent`

- `readOnlyHint` false: Writes data: it deletes a connected MCP client's access and refresh tokens and its approval for the signed-in user's ledger.
- `destructiveHint` true: Revokes access at once: the named client's tokens and consent for this user are deleted and can't be restored, so the client must be authorized again from a browser. Only this user's grants to that client are touched.
- `openWorldHint` false: Bounded to the signed-in user's own OAuth grants stored by Simple Balance; it contacts no client or outside service, and the client just fails on its next call.

### `update_account`

- `readOnlyHint` false: Writes data: it changes the details of one of the signed-in user's accounts.
- `destructiveHint` true: Overwrites the account's name, type, institution, notes or budget flag, and a new opening balance or date re-posts the opening entry, moving balances. Currency can't change once in use; it needs expectedVersion, and old values stay in the audit log.
- `openWorldHint` false: Bounded to the signed-in user's own accounts in Simple Balance's database; it links to no bank and calls no outside service.

### `archive_account`

- `readOnlyHint` false: Writes data: it archives one of the signed-in user's accounts, or restores an archived one, posting its balance to or from equity.
- `destructiveHint` true: Archiving posts the remaining balance to the Opening Balances equity account and drops the account from balances and pickers, keeping its history. Restoring posts it back when the plan has a free place; both need expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own accounts in Simple Balance's database; it moves no real money and calls no outside service.

### `set_active_accounts`

- `readOnlyHint` false: Writes data: it sets which of the signed-in user's accounts stay usable when their plan limits active accounts.
- `destructiveHint` true: Freezes every account left out, closing it to changes though nothing is deleted. After the one-time choice an account in use can't be swapped out, and a frozen one returns only when archiving or deleting frees a place.
- `openWorldHint` false: Bounded to the signed-in user's own accounts in Simple Balance's database; it changes no billing and calls no outside service.

### `update_category`

- `readOnlyHint` false: Writes data: it changes the name, kind or group of one of the signed-in user's categories.
- `destructiveHint` true: Overwrites the category's name, kind or group, and a kind change that conflicts with existing entries is refused. It needs expectedVersion, writes no postings, and old values stay in the audit log so they can be set back.
- `openWorldHint` false: Bounded to the signed-in user's own categories in Simple Balance's database; it calls no outside service.

### `archive_category`

- `readOnlyHint` false: Writes data: it archives one of the signed-in user's categories, or restores an archived one.
- `destructiveHint` true: Archiving removes the category from the pickers for new entries, while existing entries keep it and no posting or balance changes. Restoring with archived false reverses it, and both need expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own categories in Simple Balance's database; it calls no outside service.

### `set_preferences`

- `readOnlyHint` false: Writes data: it saves the signed-in user's timezone, default currency or color theme.
- `destructiveHint` true: Overwrites the stored preference, and a new timezone changes which day counts as today in every date calculation. There is no version check, and the only way back is setting the old value again, which the audit log keeps.
- `openWorldHint` false: Bounded to the signed-in user's own preferences in Simple Balance's database; it calls no outside service.

### `update_transaction_template`

- `readOnlyHint` false: Writes data: it renames one of the signed-in user's templates or replaces its saved draft or email reminder.
- `destructiveHint` true: Overwrites: a new draft replaces the old one whole, dropping fields left out, and the reminder can be changed or removed. Transactions made from it are untouched; it needs expectedVersion, and old values stay in the audit log.
- `openWorldHint` false: Bounded to the signed-in user's own templates. A reminder, if set, is emailed only to the account owner's own address on file, never to a recipient the caller names.

### `bulk_edit_transaction_templates`

- `readOnlyHint` false: Writes data unless dryRun is set: it changes the same fields on many of the signed-in user's saved templates.
- `destructiveHint` true: Overwrites or clears with null the patched fields on each named template, and a type change drops the account side the new type can't hold. Each template needs its version, dryRun previews, and no posting changes.
- `openWorldHint` false: Bounded to the signed-in user's own templates in Simple Balance's database; it calls no outside service.

### `update_transaction`

- `readOnlyHint` false: Writes data: it replaces one of the signed-in user's committed transactions and appends correcting postings, which changes balances.
- `destructiveHint` true: Overwrites the entry with the new draft, clearing omitted fields, and can delete a category nothing else uses. The old values stay in the audit log so the entry can be edited back, but a deleted category can't be restored; needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it edits a bookkeeping record and reaches no bank or outside service.

### `bulk_delete_transactions`

- `readOnlyHint` false: Writes data unless dryRun is set: it marks many of the signed-in user's committed transactions deleted by posting reversals.
- `destructiveHint` true: Removes the selected entries from balances and reports, though nothing is erased and set_transaction_deleted can restore each one. dryRun previews, and every row needs its version or a preview fingerprint.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it reverses bookkeeping entries and moves no real money.

### `bulk_edit_transactions`

- `readOnlyHint` false: Writes data unless dryRun is set: it changes the same fields on many of the signed-in user's committed transactions and re-posts them.
- `destructiveHint` true: Overwrites the patched fields, such as date, payee, category or notes, on every selected entry, and can delete a category left unused; old values stay in the audit log. dryRun previews, and rows need versions or a preview fingerprint.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it edits bookkeeping records and calls no outside service.

### `set_transaction_deleted`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's committed transactions by posting its reversal, or restores it by posting it again.
- `destructiveHint` true: Deleting removes the entry from balances and reports; calling it again with deleted false reverses that. It needs expectedVersion, and a restore that matches an active entry needs allowDuplicate.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it changes a bookkeeping record and moves no real money.

### `commit_staged_transactions`

- `readOnlyHint` false: Writes data unless dryRun is set: it turns the selected staged rows into committed transactions in the signed-in user's ledger, changing balances.
- `destructiveHint` true: Commits change balances and take the rows out of the review queue for good: the entries can be deleted by reversal, but the rows never return to the queue. dryRun previews, every row needs its version, and duplicates are refused.
- `openWorldHint` false: Bounded to the signed-in user's own Simple Balance ledger; it records bookkeeping entries and reaches no bank or payment network.

## Unrecoverable tools (11)

### `delete_staged_transactions`

- `readOnlyHint` false: Writes data unless dryRun is set: it removes the selected staged rows from the signed-in user's review queue.
- `destructiveHint` true: This cannot be undone: no tool restores a removed staged row, though nothing was posted, so no balance changes. Each row must be named with its version, and dryRun shows the count first.
- `openWorldHint` false: Bounded to the signed-in user's own staged rows in Simple Balance's database; it calls no outside service.

### `delete_category_group`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's category groups.
- `destructiveHint` true: This cannot be undone: the group and any budget set on the group are deleted, while its categories stay and lose the group. No posting or balance changes, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own category groups and budgets in Simple Balance's database; it calls no outside service.

### `delete_budget_plan`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's standing budgets.
- `destructiveHint` true: This cannot be undone: the budget is deleted and the budget page stops comparing spending against it. It wrote no postings, so no balance changes, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own budgets in Simple Balance's database; it calls no outside service.

### `delete_budget_entry`

- `readOnlyHint` false: Writes data: it deletes a single-period budget amount from the signed-in user's ledger.
- `destructiveHint` true: This cannot be undone: the period's override amount is deleted and the period falls back to any standing budget. No posting or balance changes, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own budgets in Simple Balance's database; it calls no outside service.

### `delete_recurrence`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's recurring transactions.
- `destructiveHint` true: This cannot be undone: the recurrence is deleted and proposes nothing more. Rows it already proposed, staged or committed, stay as they are, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own recurrences in Simple Balance's database; it calls no outside service.

### `delete_account`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's accounts that has no history.
- `destructiveHint` true: This cannot be undone: the account and its opening-balance postings are deleted. It is refused if the account is archived or any transaction, staged row, recurrence or template uses it, and it needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own accounts in Simple Balance's database; it closes nothing at a bank and calls no outside service.

### `delete_transaction_template`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's saved transaction templates.
- `destructiveHint` true: This cannot be undone: the template and any reminder set on it are deleted. Transactions already made from it are untouched, and the call needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own templates in Simple Balance's database; it calls no outside service.

### `bulk_delete_transaction_templates`

- `readOnlyHint` false: Writes data unless dryRun is set: it deletes many of the signed-in user's saved templates in one call.
- `destructiveHint` true: This cannot be undone: each named template and its reminder are deleted, while transactions made from them are untouched. Every template must be named with its version, and dryRun shows what would go first.
- `openWorldHint` false: Bounded to the signed-in user's own templates in Simple Balance's database; it calls no outside service.

### `delete_category`

- `readOnlyHint` false: Writes data: it deletes one of the signed-in user's categories that nothing uses.
- `destructiveHint` true: This cannot be undone: the category is deleted along with its budgets and single-period amounts. It is refused while any transaction, staged row, template or recurrence uses it, and it needs expectedVersion.
- `openWorldHint` false: Bounded to the signed-in user's own categories and budgets in Simple Balance's database; it calls no outside service.

### `merge_categories`

- `readOnlyHint` false: Writes data: it refiles everything under the source categories onto the target and deletes the sources in the signed-in user's ledger.
- `destructiveHint` true: This cannot be undone: the sources are deleted after their transactions, split legs, staged rows, templates, recurrences and budgets move to the target. Every category needs its version, and clashing budgets are refused.
- `openWorldHint` false: Bounded to the signed-in user's own categories and the records filed under them in Simple Balance's database; it calls no outside service.

### `merge_payees`

- `readOnlyHint` false: Writes data: it rewrites payee names on the signed-in user's committed and staged rows, templates and recurrences.
- `destructiveHint` true: This cannot be undone: every row using a source spelling is rewritten to the target and no tool reverses it; the old spellings survive only in the audit log. It needs an idempotency key.
- `openWorldHint` false: Bounded to the signed-in user's own payee text in Simple Balance's database; it contacts no payee and calls no outside service.
