-- Create public users table mirroring auth.users
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on users
alter table public.users enable row level security;

create policy "Users can view their own record" on public.users
  for select using (auth.uid() = id);

-- Create products table for premium glassmorphism layouts
create table if not exists public.products (
  id text primary key, -- e.g., 'glass-premium-card', 'glass-premium-dashboard'
  name text not null,
  premium_css_string text not null,
  price numeric(10, 2) not null -- in USD
);

-- Enable RLS on products
alter table public.products enable row level security;

create policy "Anyone can read products" on public.products
  for select using (true);

-- Create purchases table to track purchase history
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  amount_paid numeric(10, 2) not null,
  status text not null, -- e.g., 'completed', 'pending'
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on purchases
alter table public.purchases enable row level security;

create policy "Users can view their own purchases" on public.purchases
  for select using (auth.uid() = user_id);

-- Insert sample premium products
insert into public.products (id, name, premium_css_string, price) values
('glass-premium-card', 'Premium Glassmorphic Credit Card', 'background: rgba(255, 255, 255, 0.07);\nbackdrop-filter: blur(16px) saturate(180%);\n-webkit-backdrop-filter: blur(16px) saturate(180%);\nborder: 1px solid rgba(255, 255, 255, 0.15);\nbox-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\nborder-radius: 16px;\nbackground-image: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%);', 4.99),
('glass-premium-modal', 'Premium Glassmorphic Dashboard Widget', 'background: rgba(15, 23, 42, 0.45);\nbackdrop-filter: blur(24px) saturate(200%);\n-webkit-backdrop-filter: blur(24px) saturate(200%);\nborder: 1px solid rgba(255, 255, 255, 0.1);\nbox-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);\nborder-radius: 24px;\nbackground-image: radial-gradient(at 0% 0%, rgba(255,255,255,0.05) 0px, transparent 50%);', 7.99)
on conflict (id) do update set
  name = excluded.name,
  premium_css_string = excluded.premium_css_string,
  price = excluded.price;

-- Automatically insert user records on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
