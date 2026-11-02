Docs: https://smpl.money/docs/agents-and-mcp/

Simple Balance is a free budget app and spending tracker. Every account is on one page, and any total you doubt opens into the payments behind it. This hosted server lets an assistant read the same records you do: ask about your accounts, spending and budgets, bring in a bank statement, tidy categories and payees, and queue or record transactions.

You decide how far it goes. Sign-in uses OAuth, and the consent screen lists the scopes the client asked for:

- `ledger:read`: read your accounts, transactions, and reports
- `ledger:stage`: queue transactions for you to approve, without recording them
- `ledger:write`: make the change itself, including creating, editing, and deleting transactions and accounts

Tools outside the granted scopes are left out of the tool list. No connection can delete your account, set a password, or change billing. There's no automatic pull from your bank today, and Simple Balance can't move money.

Create an account at https://app.smpl.money. Privacy policy: https://smpl.money/privacy/
