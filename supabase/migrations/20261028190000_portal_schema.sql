-- Makadi Heights Community Portal — read-only public schema
-- Visitors (anon / authenticated) may SELECT published rows only.
-- All writes are performed by the project owner through the Supabase Dashboard
-- (postgres / service_role), which are not affected by these restrictions.

-- ---------------------------------------------------------------------------
-- Site settings (shared copy such as the community email and working hours)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  key text primary key,
  value text not null,
  description text
);

-- ---------------------------------------------------------------------------
-- Documents library (metadata only — files stay in Storage bucket makadiheights-data)
-- ---------------------------------------------------------------------------
create table public.documents (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  language text not null,
  storage_path text,              -- object name inside the makadiheights-data bucket
  file_type text,                 -- pdf | docx
  portal_href text,               -- native page/section that presents the content
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Departments
-- ---------------------------------------------------------------------------
create table public.departments (
  id text primary key,
  name text not null,
  summary text,
  responsibilities text[] not null default '{}',
  working_hours text,
  notes text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table public.department_contacts (
  id bigint generated always as identity primary key,
  department_id text not null references public.departments(id) on delete cascade,
  kind text not null check (kind in ('phone', 'email')),
  value text not null,
  label text,
  sort_order int not null default 0,
  unique (department_id, kind, value)
);
create index department_contacts_department_id_idx on public.department_contacts(department_id);

-- ---------------------------------------------------------------------------
-- Commercial directory
-- ---------------------------------------------------------------------------
create table public.business_groups (
  id text primary key,
  name text not null,
  description text,
  sort_order int not null default 0
);

create table public.businesses (
  id text primary key,
  name text not null,
  group_id text not null references public.business_groups(id),
  category text not null,
  area text,
  description text,
  map_url text,
  notes text,
  sort_order int not null default 0,
  is_published boolean not null default true
);
create index businesses_group_id_idx on public.businesses(group_id);

create table public.business_phones (
  id bigint generated always as identity primary key,
  business_id text not null references public.businesses(id) on delete cascade,
  phone text not null,
  label text,
  sort_order int not null default 0,
  unique (business_id, phone)
);
create index business_phones_business_id_idx on public.business_phones(business_id);

-- ---------------------------------------------------------------------------
-- Banking
-- ---------------------------------------------------------------------------
create table public.bank_accounts (
  id text primary key,
  bank_name text not null,
  account_holder text not null,
  currency text not null,
  account_number text not null,  -- text: preserves leading zeros exactly
  iban text,
  swift_code text,
  branch_address text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Shuttle bus
-- ---------------------------------------------------------------------------
create table public.shuttle_stops (
  id text primary key,
  direction text not null check (direction in ('makadi_to_hurghada', 'hurghada_to_makadi')),
  name text not null,
  detail text,
  sort_order int not null default 0
);

create table public.shuttle_trips (
  id text primary key,
  direction text not null check (direction in ('makadi_to_hurghada', 'hurghada_to_makadi')),
  period text not null check (period in ('AM', 'PM')),
  sort_order int not null default 0
);

create table public.shuttle_trip_times (
  trip_id text not null references public.shuttle_trips(id) on delete cascade,
  stop_id text not null references public.shuttle_stops(id) on delete cascade,
  departure text not null,       -- as printed in the source, e.g. '10:30'
  primary key (trip_id, stop_id)
);
create index shuttle_trip_times_stop_id_idx on public.shuttle_trip_times(stop_id);

-- ---------------------------------------------------------------------------
-- Security / emergency contacts
-- department_id links to an existing department so its phone is not duplicated.
-- ---------------------------------------------------------------------------
create table public.emergency_contacts (
  id text primary key,
  service text not null,
  phone text,
  department_id text references public.departments(id),
  availability text,
  is_emergency boolean not null default false,
  sort_order int not null default 0,
  check (phone is not null or department_id is not null)
);
create index emergency_contacts_department_id_idx on public.emergency_contacts(department_id);

-- ---------------------------------------------------------------------------
-- Editorial guideline sections (security guidance, Serenity info, tenant rules…)
-- ---------------------------------------------------------------------------
create table public.content_sections (
  id text primary key,
  page text not null,
  title text not null,
  intro text,
  items text[] not null default '{}',
  tone text not null default 'default' check (tone in ('default', 'notice', 'warning')),
  sort_order int not null default 0,
  is_published boolean not null default true
);
create index content_sections_page_idx on public.content_sections(page);

-- ---------------------------------------------------------------------------
-- Membership packages & prices (base prices are VAT-excluded; 14% applied in app)
-- ---------------------------------------------------------------------------
create table public.membership_packages (
  id text primary key,
  name text not null,
  access text not null check (access in ('beach_and_clubhouse', 'clubhouse_only')),
  people_included int not null check (people_included > 0),
  allows_additional_members boolean not null default false,
  description text,
  source_document_id text references public.documents(id),
  sort_order int not null default 0,
  is_published boolean not null default true
);
create index membership_packages_source_document_id_idx on public.membership_packages(source_document_id);

create table public.membership_prices (
  id bigint generated always as identity primary key,
  package_id text not null references public.membership_packages(id) on delete cascade,
  duration_key text not null,
  duration_label text not null,
  base_price numeric(12, 2) not null check (base_price >= 0),
  additional_member_price numeric(12, 2) check (additional_member_price >= 0),
  sort_order int not null default 0,
  unique (package_id, duration_key)
);
create index membership_prices_package_id_idx on public.membership_prices(package_id);

create table public.day_tickets (
  id text primary key,
  label text not null,
  price numeric(12, 2) not null,
  tax_included boolean not null default true,
  note text,
  sort_order int not null default 0
);

create table public.membership_settings (
  id boolean primary key default true check (id),
  vat_rate numeric(5, 4) not null default 0.14,
  currency text not null default 'EGP',
  reservations_phone text
);

-- ---------------------------------------------------------------------------
-- Penalties
-- ---------------------------------------------------------------------------
create table public.penalties (
  id int primary key,               -- matches the numbering in the source list
  category text not null,
  description text not null,
  amount_egp numeric(12, 2) not null,
  amount_suffix text,               -- e.g. '+' where the source prints "1,000 +"
  qualifier text,                   -- e.g. 'According to law'
  review_note text,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Security: RLS + least-privilege grants
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
  tables text[] := array[
    'site_settings', 'documents', 'departments', 'department_contacts',
    'business_groups', 'businesses', 'business_phones', 'bank_accounts',
    'shuttle_stops', 'shuttle_trips', 'shuttle_trip_times', 'emergency_contacts',
    'content_sections', 'membership_packages', 'membership_prices', 'day_tickets',
    'membership_settings', 'penalties'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated, public', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
  end loop;
end $$;

-- Sequences behind identity columns: no anonymous usage.
revoke all on all sequences in schema public from anon, authenticated, public;

-- Read policies (SELECT only; no INSERT/UPDATE/DELETE policies exist).
create policy "Public read" on public.site_settings for select to anon, authenticated using (true);
create policy "Public read published" on public.documents for select to anon, authenticated using (is_published);
create policy "Public read published" on public.departments for select to anon, authenticated using (is_published);
create policy "Public read" on public.department_contacts for select to anon, authenticated
  using (exists (select 1 from public.departments d where d.id = department_id and d.is_published));
create policy "Public read" on public.business_groups for select to anon, authenticated using (true);
create policy "Public read published" on public.businesses for select to anon, authenticated using (is_published);
create policy "Public read" on public.business_phones for select to anon, authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.is_published));
create policy "Public read published" on public.bank_accounts for select to anon, authenticated using (is_published);
create policy "Public read" on public.shuttle_stops for select to anon, authenticated using (true);
create policy "Public read" on public.shuttle_trips for select to anon, authenticated using (true);
create policy "Public read" on public.shuttle_trip_times for select to anon, authenticated using (true);
create policy "Public read" on public.emergency_contacts for select to anon, authenticated using (true);
create policy "Public read published" on public.content_sections for select to anon, authenticated using (is_published);
create policy "Public read published" on public.membership_packages for select to anon, authenticated using (is_published);
create policy "Public read" on public.membership_prices for select to anon, authenticated
  using (exists (select 1 from public.membership_packages p where p.id = package_id and p.is_published));
create policy "Public read" on public.day_tickets for select to anon, authenticated using (true);
create policy "Public read" on public.membership_settings for select to anon, authenticated using (true);
create policy "Public read" on public.penalties for select to anon, authenticated using (true);

-- Future objects the owner creates in public must be granted explicitly
-- (Supabase's default ACL would otherwise give anon full write privileges).
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated, public;
