-- Journal & Pursuits: initial schema

create extension if not exists pgcrypto;

create type pursuit_status as enum ('ACTIVE', 'ACHIEVED', 'FAILED', 'SKIPPED', 'PASSED');

-- updated_at helper -----------------------------------------------------

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- journal_entries ---------------------------------------------------------
-- One entry per local calendar date. `date` uses DATE semantics (no time
-- component) so the entry always stays on the day the user wrote it.

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_date_unique unique (date)
);

comment on table journal_entries is 'At most one entry per calendar date, enforced by the unique constraint on date.';

create trigger journal_entries_set_updated_at
  before update on journal_entries
  for each row
  execute function set_updated_at();

-- pursuits ------------------------------------------------------------------

create table pursuits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status pursuit_status not null default 'ACTIVE',
  started_at date not null default current_date,
  ended_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pursuits_title_not_blank check (btrim(title) <> '')
);

create index idx_pursuits_status on pursuits (status);

create trigger pursuits_set_updated_at
  before update on pursuits
  for each row
  execute function set_updated_at();

-- pursuit_status_history ----------------------------------------------------
-- Append-only lifecycle log. Never updated or pruned when a pursuit's
-- status changes; every transition (including the initial ACTIVE state)
-- gets its own row.

create table pursuit_status_history (
  id uuid primary key default gen_random_uuid(),
  pursuit_id uuid not null references pursuits (id) on delete cascade,
  status pursuit_status not null,
  note text,
  created_at timestamptz not null default now()
);

create index idx_pursuit_status_history_pursuit_id on pursuit_status_history (pursuit_id);
create index idx_pursuit_status_history_created_at on pursuit_status_history (created_at);

-- Row Level Security ----------------------------------------------------------
-- Single-user app for V1: any authenticated session may manage all rows.
-- Scoping by owner (e.g. a user_id column + auth.uid() checks) can be added
-- later without restructuring these tables.

alter table journal_entries enable row level security;
alter table pursuits enable row level security;
alter table pursuit_status_history enable row level security;

create policy "authenticated users can manage journal_entries"
  on journal_entries for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can manage pursuits"
  on pursuits for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can manage pursuit_status_history"
  on pursuit_status_history for all
  to authenticated
  using (true)
  with check (true);
