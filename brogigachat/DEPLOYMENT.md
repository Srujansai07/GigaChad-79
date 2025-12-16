# Deployment Guide - BroGigaChad

## Prerequisites
- A [Vercel](https://vercel.com) account.
- A [Supabase](https://supabase.com) project.
- A GitHub repository with this code.

## Steps

### 1. Database Setup
Ensure your Supabase database is ready.
1. Go to your Supabase project settings.
2. Get your `DATABASE_URL` and `DIRECT_URL` from the "Database" section (Connection String -> URI).
3. Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from "API".

### 2. Vercel Deployment
1. Go to the Vercel dashboard and click "Add New..." -> "Project".
2. Import your GitHub repository.
3. In the "Configure Project" screen, expand "Environment Variables".
4. Add the following variables:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Your Supabase Transaction Pooler URL |
| `DIRECT_URL` | Your Supabase Session Pooler URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

5. Click "Deploy".

### 3. Post-Deployment
1. Once deployed, Vercel will build your project.
2. If the build fails due to database issues, ensure your IP is allowed in Supabase or that you've run migrations (`npx prisma db push`) locally first.
3. The cron job defined in `vercel.json` will automatically run daily to reset habits (if implemented).

## Troubleshooting
- **Build Failures**: Check the build logs. Common issues are missing env vars or type errors.
- **Database Connection**: Ensure you are using the correct connection strings (Transaction vs Session pooler).
