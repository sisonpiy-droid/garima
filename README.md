# Idea Revolver

A personal site and work command center: public writing/ideas/thoughts alongside
a private workspace for tasks, projects, college work, and a daily journal.

Live at: https://garima-chi.vercel.app

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma + Postgres (Neon)
- NextAuth (Credentials provider), single-owner account with self-serve signup

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — a Postgres connection string (e.g.
  from Neon, Supabase, or `vercel env pull`)
- `NEXTAUTH_SECRET` — any random string (used to sign session cookies)

```bash
npx prisma migrate dev --name init   # applies the schema
npm run dev                           # http://localhost:3000
```

Visit `/signup` to create your account (only one account can ever be created —
signup is disabled once it exists). Then sign in at `/login`.

## Inspecting the database

Run `npm run db:studio` to open Prisma Studio — a GUI over your Postgres
database where you can browse every table, including the `User` row (its
password is stored as a bcrypt hash, never in plaintext).

## Structure

- `/`, `/writing`, `/ideas`, `/thoughts`, `/now` — public pages (only content
  marked **Public** is shown)
- `/signup`, `/login` — account creation and sign-in
- `/dashboard/*` — private workspace (tasks, projects, journal, ideas, writing,
  thoughts), behind login; this is the "Write" destination after signing in
- `lib/actions/*` — Next.js Server Actions used for all create/update/delete
  operations
- `prisma/schema.prisma` — data model

## Design principle

Kept intentionally lightweight — not a project-management tool. Tags are plain
comma-separated text, relationships between projects/tasks/ideas/writing/thoughts
are optional, and there's no multi-user support (one account, enforced at signup).

## Deploying

Connected to Vercel (`piyushs-projects-396d9e3e/garima`) with auto-deploy on
push to `main`, backed by a Neon Postgres database provisioned through the
Vercel Marketplace integration.
