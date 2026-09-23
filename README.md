# Idea Revolver

A personal site and work command center for one person (Garima): a public
writing/ideas/thoughts profile alongside a private workspace for tasks,
projects, college work, and a daily journal. There's also an admin account
that can see everything, including private content, so the owner isn't the
only person who can help maintain it.

Live at: https://idea-revolver.vercel.app

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma + Postgres (Neon)
- NextAuth (Credentials provider)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — a Postgres connection string (e.g.
  from Neon, Supabase, or `vercel env pull`)
- `NEXTAUTH_SECRET` — any random string (used to sign session cookies)
- `ADMIN_EMAIL` — the one email allowed to hold the admin role (see Roles below)

```bash
npx prisma migrate dev --name init   # applies the schema
npm run dev                           # http://localhost:3000
```

There is no public signup. The account matching `ADMIN_EMAIL` is the admin;
sign in at `/login` once it exists (create it directly in the database or
via `prisma studio` the first time). From `/admin`, the admin can create the
one owner account (Garima's) — there's a form there when no owner exists yet.

## Roles

- **Owner** (role `USER`, at most one ever exists): the private workspace
  (tasks/projects/journal/ideas/writing/thoughts) and the public profile at
  `/about` are both hers. Whatever she marks Public is what shows up on
  `/about`, `/writing`, `/ideas`, `/thoughts`, and `/now`.
- **Admin**: the account matching `ADMIN_EMAIL`. Can open `/admin` to see the
  owner's **entire** workspace, including private content. This is visible to
  the owner as a known capability of the app, not a hidden backdoor.

There is intentionally no open registration — `/api/signup` only works for an
admin session, and only until the one owner account exists.

## Inspecting the database

Run `npm run db:studio` to open Prisma Studio — a GUI over your Postgres
database where you can browse every table, including the `User` row (its
password is stored as a bcrypt hash, never in plaintext).

## Structure

- `/about`, `/writing`, `/ideas`, `/thoughts`, `/now` — the owner's public
  profile and feed (only content marked **Public** is shown)
- `/login` — sign-in (no public signup)
- `/dashboard/*` — the owner's private workspace; this is the "Write"
  destination after signing in
- `/admin`, `/admin/users/[id]` — admin-only: create the owner account if it
  doesn't exist yet, and view her full workspace, including private content
- `lib/actions/*` — Next.js Server Actions used for all create/update/delete
  operations, scoped to the signed-in user's own data
- `prisma/schema.prisma` — data model (still keyed by `userId` under the
  hood, even though there's only ever one real owner)

## Design principle

Kept intentionally lightweight — not a project-management tool, and not a
public community platform. Tags are plain comma-separated text, and
relationships between projects/tasks/ideas/writing/thoughts are optional.

## Deploying

Connected to Vercel (`piyushs-projects-396d9e3e/idea-revolver`) with auto-deploy on
push to `main`, backed by a Neon Postgres database provisioned through the
Vercel Marketplace integration.
