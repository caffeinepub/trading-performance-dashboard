# Trading Performance Dashboard

## Current State
No existing code. Building from scratch.

## Requested Changes (Diff)

### Add
- Public homepage with large metric cards: Overall PnL, Win Ratio, Total Trades, Monthly PnL
- XAUUSD section: TradingView Lightweight chart + stats (scalps, wins, losses, weekly PnL)
- USOIL section: TradingView Lightweight chart + stats (scalps, wins, losses, weekly PnL)
- Client Accounts page (public, view-only): account name, capital, profit/loss, status badge
- Admin login page at /admin/login using Internet Identity
- Admin panel with three tabs:
  - Performance tab: edit Overall PnL, Win Ratio, Total Trades, Monthly PnL + save
  - Instruments tab: edit XAUUSD and USOIL stats and chart data
  - Accounts tab: add, edit, delete client accounts
- Portfolio summary section showing total scalps per week
- Mandatory disclaimer footer on public site
- Backend: store performance metrics, instrument stats, chart data, and client accounts in stable storage
- Admin authorization via Internet Identity principal check

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select authorization component
2. Generate Motoko backend with:
   - Performance metrics (overallPnL, winRatio, totalTrades, monthlyPnL, lastUpdated)
   - Instrument stats per symbol (scalps, wins, losses, weeklyPnL, chartData)
   - Client accounts (id, name, capital, pnl, status)
   - Admin-only update functions
3. Frontend:
   - App.tsx routing: "/" public home, "/accounts" client list, "/admin/login", "/admin"
   - Public home: hero stats, XAUUSD section, USOIL section, portfolio summary
   - TradingView Lightweight Charts for XAUUSD and USOIL
   - Admin panel with login gate and three-tab edit interface
   - Disclaimer footer
