# Asli Patta (Next.js Full Stack)

Single Next.js app with **Clerk authentication**, **MongoDB**, and **Cloudinary** image uploads.

## Project structure

```
Asli Patta/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router (pages, API routes, layout)
│   ├── components/      # React UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # DB, auth, services, utilities
│   └── proxy.js         # Clerk auth proxy (route protection)
├── .env.example
├── jsconfig.json        # Path alias: @/* → src/*
├── next.config.mjs
└── package.json
```

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Clerk (auth)
- MongoDB + Mongoose
- Cloudinary

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Configure [Clerk](https://dashboard.clerk.com):
   - Create an application
   - Enable **Email** and/or **Phone** sign-in (your choice)
   - Add webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook signing secret to `CLERK_WEBHOOK_SECRET`

4. Configure **MongoDB Atlas** with a **new database** (fresh start).

5. Configure **Cloudinary** for image uploads.

6. Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin access

Set a user's role to admin in Clerk **Public metadata**:

```json
{ "role": "admin" }
```

Then sign out and sign in again. The user will sync to MongoDB with `role: "admin"`.

## API routes

| Method | Path |
|--------|------|
| GET | `/api/me` |
| GET/POST | `/api/properties` |
| PUT/DELETE | `/api/properties/[id]` |
| POST | `/api/properties/[id]/rate` |
| GET | `/api/dashboard/my-properties` |
| GET | `/api/admin/properties/pending` |
| PUT | `/api/admin/properties/[id]/approve` |
| DELETE | `/api/admin/properties/[id]` |
| POST | `/api/webhooks/clerk` |

## Deploy (Vercel)

1. Set root directory to the repo root (not a `web/` subfolder)
2. Add all env vars from `.env.example`
3. Configure Clerk webhook URL to production domain

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
