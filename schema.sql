-- ============================================================
-- THE GIFT CLUB
-- Fresh database setup
-- ============================================================

-- Remove the old tables and everything inside them.
drop table if exists public.gift_claims cascade;
drop table if exists public.gifts cascade;


-- ============================================================
-- GIFTS
-- ============================================================

create table public.gifts (
  id uuid primary key default gen_random_uuid(),

  person_id text not null
    check (
      person_id in (
        'snehil',
        'khushi',
        'riya',
        'shibam'
      )
    ),

  name text not null,

  image_url text,

  url text,

  notes text,

  created_at timestamptz not null default now()
);


-- ============================================================
-- CLAIMS
-- ============================================================

create table public.gift_claims (
  id uuid primary key default gen_random_uuid(),

  gift_id uuid not null
    references public.gifts(id)
    on delete cascade,

  shopper_id text not null
    check (
      shopper_id in (
        'snehil',
        'khushi',
        'riya',
        'shibam'
      )
    ),

  created_at timestamptz not null default now(),

  unique(gift_id)
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.gifts enable row level security;
alter table public.gift_claims enable row level security;


-- ============================================================
-- GIFTS
-- ============================================================

create policy "public can read gifts"
on public.gifts
for select
to anon, authenticated
using (true);


create policy "public can add gifts"
on public.gifts
for insert
to anon, authenticated
with check (true);


create policy "public can edit gifts"
on public.gifts
for update
to anon, authenticated
using (true)
with check (true);


create policy "public can delete gifts"
on public.gifts
for delete
to anon, authenticated
using (true);


-- ============================================================
-- CLAIMS
-- ============================================================

create policy "public can read claims"
on public.gift_claims
for select
to anon, authenticated
using (true);


create policy "public can create claims"
on public.gift_claims
for insert
to anon, authenticated
with check (true);


create policy "public can remove claims"
on public.gift_claims
for delete
to anon, authenticated
using (true);
