# CollegeHub

A production-style college discovery MVP built with Next.js, TypeScript, TailwindCSS, PostgreSQL, Prisma ORM, and REST API routes.

## Architecture

- `src/app`: App Router pages and API routes.
- `src/components`: reusable UI components for cards, navigation, loading, and empty states.
- `src/hooks`: client state hooks for auth and listing data.
- `src/lib`: Prisma, authentication, validation, and centralized error handling.
- `src/services`: typed client API functions.
- `src/types`: shared frontend-safe TypeScript types.
- `prisma`: schema and seed data.

## Features

- College listing with search, city filter, fee filter, pagination, loading, and error states.
- College detail pages with overview, courses, placements, ratings, and reviews.
- Two-college comparison across fees, placements, ratings, and location.
- Cookie-based auth with signup, login, logout, sessions, and favorite colleges.
- Zod validation and centralized API error responses.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` (SQLite is preconfigured for local dev).

3. Create the database and seed data:

   ```bash
   npm run db:setup
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Seeded login:

- Email: `demo@collegehub.dev`
- Password: `password123`

## Deployment Notes

- Use a managed PostgreSQL provider such as Neon, Supabase, Railway, or Render.
- Set `DATABASE_URL` and `JWT_SECRET` in the deployment environment.
- Run `prisma migrate deploy` during production deployment.
- Deploy on Vercel or any Node-compatible platform that supports Next.js.
"# SDE-As" 
