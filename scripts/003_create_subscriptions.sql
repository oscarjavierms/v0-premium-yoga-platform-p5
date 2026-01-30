-- Create subscriptions table for managing user subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('active', 'expired', 'cancelled', 'trial')),
  plan_type text not null check (plan_type in ('founder', 'monthly', 'annual')),
  amount_paid decimal(10, 2),
  currency text default 'USD',
  stripe_subscription_id text unique,
  stripe_customer_id text,
  trial_ends_at timestamp with time zone,
  current_period_start timestamp with time zone not null default now(),
  current_period_end timestamp with time zone not null,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Policies: Users can only view their own subscriptions
create policy "subscriptions_select_own" 
  on public.subscriptions 
  for select 
  using (auth.uid() = user_id);

-- Admins can view all subscriptions (for admin dashboard)
create policy "subscriptions_select_admin" 
  on public.subscriptions 
  for select 
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- Only service role can insert/update/delete subscriptions (for Stripe webhooks)
create policy "subscriptions_insert_service" 
  on public.subscriptions 
  for insert 
  with check (false); -- Will be handled by service role

create policy "subscriptions_update_service" 
  on public.subscriptions 
  for update 
  using (false); -- Will be handled by service role

create policy "subscriptions_delete_service" 
  on public.subscriptions 
  for delete 
  using (false); -- Will be handled by service role

-- Index for faster lookups
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_stripe_subscription_id on public.subscriptions(stripe_subscription_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to automatically update updated_at
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();

-- Add has_active_subscription to profiles for easier access
alter table public.profiles 
  add column if not exists has_active_subscription boolean default false;

-- Function to check and update subscription status
create or replace function public.update_profile_subscription_status()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update the profile's has_active_subscription flag
  update public.profiles
  set has_active_subscription = (
    select exists(
      select 1 from public.subscriptions
      where subscriptions.user_id = new.user_id
      and subscriptions.status = 'active'
      and subscriptions.current_period_end > now()
    )
  )
  where id = new.user_id;
  
  return new;
end;
$$;

-- Trigger to update profile subscription status when subscription changes
create trigger subscriptions_update_profile_status
  after insert or update or delete on public.subscriptions
  for each row
  execute function public.update_profile_subscription_status();
