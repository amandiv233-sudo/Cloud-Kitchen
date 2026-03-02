-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text unique,
  address text,
  avatar_url text,
  role text check(role in ('customer', 'admin', 'chef', 'sales', 'delivery')) default 'customer'
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Categories
alter table public.categories enable row level security;
create policy "Active categories are viewable by everyone" on public.categories for select using (is_active = true or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can insert categories" on public.categories for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can update categories" on public.categories for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can delete categories" on public.categories for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- 3. Menu Items Table
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Menu Items
alter table public.menu_items enable row level security;
create policy "Available items viewable by everyone" on public.menu_items for select using (is_available = true or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can insert menu items" on public.menu_items for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can update menu items" on public.menu_items for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can delete menu items" on public.menu_items for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- 4. Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  items jsonb not null,
  total_amount numeric not null,
  status text check(status in ('Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered')) default 'Placed',
  delivery_address jsonb not null,
  payment_status text check(payment_status in ('Pending', 'Paid', 'Failed')) default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table public.orders enable row level security;
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Users can insert their own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update their own order status" on public.orders for update using (auth.uid() = user_id or auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admins can delete orders" on public.orders for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Set up Realtime
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.menu_items;
alter publication supabase_realtime add table public.orders;

-- 5. Trigger for new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
