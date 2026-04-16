<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ROwO Auth

ROwO Auth is a student verification portal that links WeChat IDs to verified student identities using multiple verification methods (ADFS, university email, Discord, and manual review).

## What This Project Contains

- A React + Vite frontend for:
  - public verification lookup
  - user verification flows
  - admin/moderator account management
- A Cloudflare Worker backend (`backend/worker.js`) for:
  - verification APIs
  - admin APIs
  - rename token flow
  - email sending and Discord integration

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Cloudflare Worker (JavaScript), D1 database binding (`auth_database`)
- Integrations: AWS SES (email), Discord OAuth/API

## Project Structure

- `src/`: frontend application
- `src/pages/`: main pages and verification/admin flows
- `backend/worker.js`: backend API handler and business logic
- `package.json`: scripts and frontend build-time config
- `.env.example`: environment variable template

## Prerequisites

- Node.js 20+ (recommended)
- npm
- A deployed backend API endpoint (or local Worker endpoint) for frontend calls

## Quick Start (Frontend)

1. Install dependencies:
   - `npm install`
2. Configure frontend API target in `package.json`:
   - `config.api_endpoint`
   - `config.icon_url`
3. Start development server:
   - `npm run dev`
4. Open the local Vite URL shown in terminal.

## Configuration

### Frontend Build-Time Config

The frontend uses constants from `package.json`:

- `config.api_endpoint`: base URL used by all frontend API requests
- `config.icon_url`: icon URL injected into HTML

These values are exposed as `__API_ENDPOINT__` and `__ICON_URL__` at build time.

### Environment Variables

`.env.example` includes:

- `APP_URL`: public URL where the app is hosted

Backend `backend/worker.js` expects runtime bindings/secrets such as:

- Database binding: `auth_database`
- Security: `SENSITIVE_DATA_HASH_SECRET`, `ADFS_JWT_SECRET`
- Email (AWS SES): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SES_FROM_EMAIL`, `SES_FROM_NAME`
- Discord: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `DISCORD_REQUIRED_ROLE_ID`
- Policy/rate-limit options: `EMAIL_SENDS_PER_MINUTE`, `CORS_ALLOW_ORIGINS`, `ALLOWED_EMAIL_DOMAIN`

## Available Scripts

- `npm run dev`: start frontend dev server
- `npm run build`: create production frontend build
- `npm run preview`: preview production build locally
- `npm run lint`: run TypeScript type-check (`tsc --noEmit`)

## API Route Overview

Core verification routes:

- `GET /api/verify/:wechatId`
- `POST /api/adfs/create-code`
- `POST /api/verify/adfs`
- `POST /api/verify/email`
- `POST /api/verify/discord/callback`
- `POST /api/verify/discord/connect`
- `POST /api/verify/manual`

Account rename routes:

- `POST /api/account/rename`
- `POST /api/account/rename/invalidate`

Admin routes:

- `POST /api/admin/login`
- `POST /api/admin/rotate-token`
- `GET /api/admin/accounts`
- `GET /api/admin/stats`
- `GET /api/admin/blacklist`
- `POST /api/admin/batch/verify`
- `POST /api/admin/batch/blacklist`
- `GET|POST /api/admin/accounts/:wechatId/info`
- `PUT|DELETE /api/admin/info/:id`
- `POST /api/admin/accounts/:wechatId/(revoke|unrevoke|manual|blacklist|unblacklist)`

## Security Notes

- Never commit real secrets or tokens.
- Keep admin tokens private and rotate them when exposed.
- Restrict `CORS_ALLOW_ORIGINS` in production (avoid `*` where possible).
- Configure `ALLOWED_EMAIL_DOMAIN` to enforce institutional email domain policy.

## Development and Contribution

1. Create a feature branch.
2. Make focused changes with clear commit messages.
3. Run:
   - `npm run lint`
   - any local verification flows you changed
4. Open a pull request with:
   - change summary
   - test/verification notes
   - any config migration notes

## Troubleshooting

- Frontend cannot reach backend:
  - verify `config.api_endpoint` in `package.json`
  - ensure backend CORS allows your frontend origin
- Email verification fails:
  - check AWS SES credentials, sender identity, and region
- Discord verification fails:
  - check OAuth redirect URI and guild/role related env vars
- Admin panel cannot authenticate:
  - ensure admin token exists in backend data and is sent as Bearer token
