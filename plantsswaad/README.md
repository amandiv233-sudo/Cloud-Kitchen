# PlanetsSwaad — Cloud Kitchen App

Welcome to the PlanetsSwaad full-stack monorepo! This repository contains the Web Customer App, the Web Admin Dashboard, and the cross-platform Mobile App, all sharing a strictly-typed Supabase backend and Zustand state management.

## 🏗️ Project Structure

This is a Turborepo monorepo:
*   `apps/web`: Next.js 14 Web Application (Customer UI + Admin Dashboard).
*   `apps/mobile`: Expo React Native Mobile App.
*   `packages/shared`: Shared Supabase types, client instantiation, and Zustand stores.
*   `supabase/`: Contains the SQL migrations and seed data.

## 🚀 Setup Instructions

### 1. Database Initialization
You need a Supabase project. Either create one at [Supabase.com](https://supabase.com) or use the local `supabase-cli`.
1.  Run the SQL script `supabase/migrations/20240101000000_initial_schema.sql` in your Supabase SQL Editor.
2.  Run the SQL script `supabase/seed.sql` to populate the `categories` and `menu_items` tables with the initial PlanetsSwaad menu.
3.  Ensure Realtime is enabled for `categories`, `menu_items`, and `orders`.

### 2. Environment Variables
1.  Copy `.env.example` to `.env.local` in the root (or inside `apps/web` and `apps/mobile` individually depending on your run environment).
2.  Fill in the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase Dashboard -> Project Settings -> API.

### 3. Install Packages & Run
Assuming Node.js (v20+) is installed:
```bash
# From the root directory:
npm install

# To start the Next.js Web App (Customer & Admin):
npm run dev --workspace=web

# To start the Expo Mobile App:
npm run start --workspace=mobile
```

## 🎨 Design & Features Included

*   **Earth & Nature Theme**: Custom Tailwind configuration mimicking fresh organic greens (`#468f71`) and warm earthen tones.
*   **Customer Web UI**: Fully responsive, featuring 3D perspective category scrolling and glassy UI cards, located at `http://localhost:3000`.
*   **Admin Dashboard**: Protected layouts with mocked overview statistics, located at `http://localhost:3000/admin`.
*   **Mobile Experience**: Built-in React Navigation mapped out across 5 primary tabs (Home, Menu, Cart, Orders, Profile) mirroring the web flow.
*   **Global State**: Integrated `useCartStore` utilizing Zustand inside `@plantsswaad/shared`, synchronized cleanly across the entire monorepo.

## 🔒 Next Steps for Production
1. Configure an external Phone SMS provider via Supabase Auth for live OTP logins.
2. Update the Razorpay Component logic with live keys once approved.
3. Replace the placeholder images with signed URLs directly fetched from a Supabase Storage bucket.
