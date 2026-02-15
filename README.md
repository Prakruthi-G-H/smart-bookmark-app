# 📌 Smart Bookmark App

A production-ready **Smart Bookmark Manager** built using **Next.js (App Router)** and **Supabase**.

This project demonstrates secure authentication using **Google OAuth**, private user data protection using **Row Level Security (RLS)**, and real-time UI updates powered by **Supabase Realtime**.

---

## 🚀 Live Demo


---

## 🛠 Tech Stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime Subscriptions
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## ✨ Features

- 🔐 Google OAuth Login (No email/password authentication)
- 👤 Private bookmarks per user
- ⚡ Real-time updates without page refresh
- 🛡 Secure database access using Row Level Security (RLS)
- 📱 Fully responsive UI
- 🧠 Middleware-based route protection

---

## 🏗 Architecture Overview

- **Client Components** → UI rendering & interaction  
- **Server Components** → Data fetching & authentication handling  
- **Supabase SSR Client** → Secure session management  
- **Middleware** → Route protection and cookie handling  
- **Supabase Realtime** → Instant UI updates on INSERT/DELETE/UPDATE  

---

## 🗄 Database Schema

```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
