# Smart Bookmark App

## Overview
A simple bookmark manager built with Next.js 14+, Supabase, and Tailwind CSS.
Features:
- Google OAuth Login
- Private bookmarks per user
- Real-time updates
- Responsive UI

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- Supabase account

### 2. Supabase Setup
1. Create a new Supabase project.
2. Go to **Authentication > Providers** and enable **Google**.
   - You will need to set up a Google Cloud Project to get Client ID and Secret.
   - Add the Redirect URL: `https://<your-project>.supabase.co/auth/v1/callback` (or similar depending on Supabase version, check their dashboard).
3. Go to **SQL Editor** and run the following script:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using ( auth.uid() = user_id );

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 3. Environment Variables
Rename `.env.local.example` to `.env.local` and update with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally
```bash
npm install
npm run dev
```

## Deployment
Deploy to Vercel and add the environment variables there as well.
Remember to update your Google OAuth Authorized Redirect URIs to include your Vercel deployment URL (e.g., `https://your-app.vercel.app/auth/callback`).

## Challenges & Solutions
- **Real-time updates**: Used Supabase Realtime subscriptions to listen for `INSERT`, `DELETE`, and `UPDATE` events on the `bookmarks` table, allowing the UI to update instantly without refresh.
- **Middleware for Auth**: Implemented Next.js Middleware to manage Supabase sessions and protect routes, ensuring `cookies` are handled correctly for Server Components.
- **Next.js 15 Compatibility**: Updated cookie handling to use `await cookies()` as required by the latest Next.js versions.
