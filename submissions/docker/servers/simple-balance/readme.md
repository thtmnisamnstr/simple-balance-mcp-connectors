Docs: https://smpl.money/docs/agents-and-mcp/

Simple Balance keeps one person's double-entry ledger. This hosted server lets an assistant read your accounts, budgets and reports, import bank statements, tidy categories and payees, and stage or record transactions. It doesn't connect to banks and can't move money.

Sign-in uses OAuth. The consent screen lists the scopes the client asked for:

- `ledger:read`: read your accounts, transactions, and reports
- `ledger:stage`: propose transactions for you to review, without recording them
- `ledger:write`: create, edit, and delete transactions and accounts

Tools outside the granted scopes are left out of the tool list. No connection can delete your account, set a password, or change billing.

Create an account at https://app.smpl.money. Privacy policy: https://smpl.money/privacy/
