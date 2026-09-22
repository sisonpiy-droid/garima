# Idea Revolver

A multi-user personal site and work command center: each account gets a
public writing/ideas/thoughts profile alongside a private workspace for
tasks, projects, college work, and a daily journal.

Live at: https://idea-revolver.vercel.app

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma + Postgres (Neon)
- NextAuth (Credentials provider), open signup with per-account data isolation

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — a Postgres connection string (e.g.
  from Neon, Supabase, or `vercel env pull`)
- `NEXTAUTH_SECRET` — any random string (used to sign session cookies)
- `ADMIN_EMAIL` — the email that automatically becomes an admin account at
  signup (see Roles below)

```bash
npx prisma migrate dev --name init   # applies the schema
npm run dev                           # http://localhost:3000
```

Visit `/signup` to create an account, then sign in at `/login`.

## Roles

- **User** (default): a private workspace (tasks/projects/journal/ideas/
  writing/thoughts) visible only to them, plus a public profile at `/u/[id]`
  showing whatever they've marked Public.
- **Admin**: whoever signs up with the email in `ADMIN_EMAIL` gets this role
  automatically. Admins can open `/admin` to see every account and, per
  account, their **entire** workspace — including private content. This is
  visible to the account holder as a known capability of the app, not a
  hidden backdoor.

## Inspecting the database

Run `npm run db:studio` to open Prisma Studio — a GUI over your Postgres
database where you can browse every table, including the `User` row (its
password is stored as a bcrypt hash, never in plaintext).

## Structure

- `/about`, `/writing`, `/ideas`, `/thoughts`, `/now` — public, platform-wide
  feed of everything marked **Public**, across all accounts
- `/u/[id]` — an individual account's public profile
- `/signup`, `/login` — account creation and sign-in
- `/dashboard/*` — the signed-in user's private workspace; this is the
  "Write" destination after signing in
- `/admin`, `/admin/users/[id]` — admin-only account list and full per-user
  data view
- `lib/actions/*` — Next.js Server Actions used for all create/update/delete
  operations, always scoped to the signed-in user's own data
- `prisma/schema.prisma` — data model

## Design principle

Kept intentionally lightweight — not a project-management tool. Tags are plain
comma-separated text, relationships between projects/tasks/ideas/writing/thoughts
are optional.

## Deploying

Connected to Vercel (`piyushs-projects-396d9e3e/idea-revolver`) with auto-deploy on
push to `main`, backed by a Neon Postgres database provisioned through the
Vercel Marketplace integration.
