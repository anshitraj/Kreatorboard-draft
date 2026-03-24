# Kreatorboard

## Overview

Kreatorboard is a blockchain-native creator operating system — a full-stack, automation-first platform for web3 creators and micro-influencers. It is a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite (TailwindCSS v4, shadcn/ui, React Query)
- **Database**: PostgreSQL + Drizzle ORM (Replit built-in Postgres)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Wallet**: WalletConnect / Reown AppKit (EVM-first architecture)

## Structure

```text
kreatorboard-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   │   └── src/routes/     # auth, profile, integrations, social, inbox, calendar, payments, discovery, sync, admin
│   └── kreatorboard/       # React + Vite frontend
│       └── src/pages/      # Landing, Onboarding, Dashboard, Integrations, Inbox, Calendar, Payments, Profile, Admin, Discover, PublicProfile
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/     # users, creator_profiles, integrations, social_accounts, collaborations, calendar, payments, services_portfolio, sync_jobs
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Product Features

### Core Modules
1. **Multi-step onboarding** — handle reservation, integration connect, auto dashboard generation
2. **Dashboard overview** — connected platforms, metrics, inbox preview, calendar summary, payment preview
3. **Integrations page** (/dashboard/integrations) — 8 integration cards: Gmail, Google Calendar, Discord, Telegram, X/Twitter, Cal.com, Wallet, Website
4. **Collaboration CRM** (/dashboard/inbox) — request pipeline, notes thread, status management
5. **Calendar** (/dashboard/calendar) — event sync from Google Calendar / Cal.com
6. **Payments** (/dashboard/payments) — crypto wallet connection, payment request generation
7. **Profile editor** (/dashboard/profile) — niches, ecosystems, services, portfolio
8. **Public creator profile** (/c/:handle) — shareable public page
9. **Creator discovery** (/discover) — browse public creators, filter by niche/ecosystem
10. **Admin panel** (/admin) — users, sync health, integration overview

### Integration Architecture
- **Gmail**: OAuth with push notification architecture (credentials needed)
- **Google Calendar**: OAuth with watch channels (credentials needed)
- **Discord**: OAuth2 identity + guild data
- **Telegram**: Bot-based integration
- **X/Twitter**: 3 modes (API, CSV import, public link)
- **Wallet**: WalletConnect/Reown AppKit, SIWE signature verification
- **Cal.com**: Manual booking link + API key mode
- **Website/RSS**: Metadata import + link detection

### Data Integrity Rules
- No fake/demo data
- No hallucinated metrics
- Estimated metrics always labeled with source badge and tooltip
- All metrics show data freshness timestamps
- Wallet balances never displayed (only address)

## Authentication

Uses Replit Auth (x-replit-user-id and x-replit-user-name headers). Auto-creates user record on first auth. Role system: creator (default), admin, founder.

## Database Schema

Tables: users, creator_profiles, integrations, wallets, social_accounts, metric_snapshots, collaborations, collaboration_notes, calendar_events, payment_requests, creator_services, portfolio_items, sync_jobs

## API Routes

All routes under `/api`:
- `GET /auth/me` — current user
- `GET/PATCH /profile` — creator profile
- `POST /profile/onboarding` — onboarding steps
- `POST /profile/generate-dashboard` — trigger automation
- `GET /profile/public/:handle` — public profile
- `GET/POST /profile/services` — services management
- `GET/POST /profile/portfolio` — portfolio items
- `GET /integrations` — all integration statuses
- `POST /integrations/:provider/connect` — start OAuth / connect
- `POST /integrations/:provider/disconnect` — disconnect
- `POST /integrations/:provider/sync` — trigger sync
- `POST /integrations/wallet/connect` — wallet + SIWE verification
- `GET /integrations/wallet` — connected wallets
- `GET /social` — social accounts
- `GET /social/metrics` — metrics snapshot
- `GET /inbox` — collaboration inbox (paginated)
- `GET/PATCH /inbox/:id` — collaboration detail
- `POST /inbox/request` — public collaboration request
- `GET /calendar/events` — calendar events
- `GET /calendar/summary` — calendar summary
- `GET /payments/wallets` — payment wallets
- `GET/POST /payments/requests` — payment requests
- `GET/PATCH /payments/requests/:id` — payment request detail
- `GET /discovery/creators` — public creator discovery
- `GET /sync/jobs` — sync job history
- `GET /admin/users` — admin users list
- `GET /admin/sync-health` — sync health overview
- `GET /admin/integrations` — admin integration records

## Root Scripts

- `pnpm run build` — typecheck + recursive build
- `pnpm run typecheck` — full TS check
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client
- `pnpm --filter @workspace/db run push` — push schema to DB

## Design System

- Dark premium fintech theme (deep dark background, vibrant purple-blue primary, electric teal accent)
- Glassmorphism cards (.glass-card utility)
- Glow text effects for headings
- Interactive card hover effects
- Inter font (body) + Outfit font (headings)
- Recharts for analytics
- Framer Motion for transitions
