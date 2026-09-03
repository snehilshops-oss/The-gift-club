-- The Gift Club database
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  person_id text not null check (person_id in ('snehil','khushi','riya','shibam')),
  name text not null,
  price text,
  image_url text,
  url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.gift_claims (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  shopper_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(gift_id)
);

alter table public.gifts enable row level security;
alter table public.gift_claims enable row level security;

-- Everyone in the four-person app can read and manage gifts after signing in.
create policy "signed in users can read gifts" on public.gifts for select to authenticated using (true);
create policy "signed in users can add gifts" on public.gifts for insert to authenticated with check (true);
create policy "signed in users can edit gifts" on public.gifts for update to authenticated using (true) with check (true);
create policy "signed in users can delete gifts" on public.gifts for delete to authenticated using (true);

-- Claims are readable to authenticated users at the database level, but the app
-- deliberately never displays the claimant's identity to the birthday person.
create policy "signed in users can create claims" on public.gift_claims for insert to authenticated with check (shopper_id = auth.uid());
create policy "signed in users can read claims" on public.gift_claims for select to authenticated using (true);
create policy "claim owner can delete own claim" on public.gift_claims for delete to authenticated using (shopper_id = auth.uid());
