# Garima

A personal site and work command center: public writing/ideas/thoughts alongside
a private workspace for tasks, projects, college work, and a daily journal.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma + SQLite (local file database)
- NextAuth (Credentials provider), single owner account

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `NEXTAUTH_SECRET` — any random string (used to sign session cookies)
- `OWNER_EMAIL` / `OWNER_PASSWORD` / `OWNER_NAME` — your login. The password is
  **never stored in plaintext** — the seed script hashes it with bcrypt before
  writing to the database. Re-run `npm run db:seed` any time to change it.

```bash
npx prisma migrate dev --name init   # creates prisma/dev.db and applies the schema
npm run db:seed                       # creates/updates your owner account
npm run dev                           # http://localhost:3000
```

Sign in at `/login` with the `OWNER_EMAIL` / `OWNER_PASSWORD` you set.

## Inspecting the database

Run `npm run db:studio` to open Prisma Studio — a local GUI over `prisma/dev.db`
where you can browse every table, including the `User` row (its password is
stored as a bcrypt hash, not plaintext).

## Structure

- `/`, `/writing`, `/ideas`, `/thoughts`, `/now` — public pages (only content
  marked **Public** is shown)
- `/dashboard/*` — private workspace (tasks, projects, journal, ideas, writing,
  thoughts), behind login
- `lib/actions/*` — Next.js Server Actions used for all create/update/delete
  operations
- `prisma/schema.prisma` — data model

## Design principle

Kept intentionally lightweight — not a project-management tool. Tags are plain
comma-separated text, relationships between projects/tasks/ideas/writing/thoughts
are optional, and there's no multi-user support.
