# Security & Functionality Verification Audit

I have deeply audited the authentication, authorization (RBAC), and feature functionalities. I have found **several critical security vulnerabilities and broken functionalities** that must be fixed immediately.

## 1. Security Vulnerability: Customers Can Become Admins
**Issue:** The Row Level Security (RLS) policy on the `profiles` table allows any user to update their own profile data. Because the `role` column is also in this table, a malicious customer could send a direct API request to Supabase to change their own role to `admin`.
**Fix Needed:** We need a PostgreSQL trigger that intercepts updates to the `profiles` table and rejects any changes to the `role` column unless the user making the request is already an `admin`.

## 2. Broken Feature: Admin Staff Management 
**Issue:** On the `/admin/staff` page, when an admin tries to change another user's role, the database currently silently rejects it. 
**Reason:** The RLS policy for `profiles` only allows users to update *their own* profile. There is no policy allowing admins to update *other* profiles.
**Fix Needed:** We must add an RLS policy (`Admins can update all profiles`) to the `profiles` table.

## 3. Broken Feature: Chef Dashboard Cannot View or Update Orders
**Issue:** The `/kitchen` dashboard loads correctly, but the chef will see an endless loading screen or no orders. Even if they see orders, clicking "Start Preparing" will fail.
**Reason:** The RLS policies on the `orders` table explicitly state:
- `SELECT`: Only the user who placed the order OR an `admin` can view it.
- `UPDATE`: Only the user who placed the order OR an `admin` can update it.
Chefs, Sales, and Delivery roles have **zero permissions** in the database right now.
**Fix Needed:** The `orders` RLS policies must be expanded so that:
- `chef`, `sales`, and `delivery` roles can `SELECT` all orders.
- `chef` can `UPDATE` order status (to Preparing, Ready).
- `delivery` can `UPDATE` order status (to Out for Delivery, Delivered).

## 4. Auth & Signup
**Status: Working as Expected**
The signup flow correctly simulates emails from phone numbers, stores real emails in metadata, and triggers the `handle_new_user` function perfectly. The AuthGuard correctly restricts standard page navigations.

---

### Recommended Action
I will provide you with a SQL script that you can simply copy and paste into your **Supabase SQL Editor** to instantly fix all of these critical database and security flaws.
