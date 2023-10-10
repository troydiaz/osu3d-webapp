-- Anonymous access

alter table public.user_levels enable row level security;
create policy "All users can access user levels"
on public.user_levels for select
using (true);

-- Authenticated insert

alter table public.faults enable row level security;
create policy "All may access basic tables"
on public.faults for select
to authenticated
using (true);

alter table public.inv_categories enable row level security;
create policy "All may access basic tables"
on public.inv_categories for select
to authenticated
using (true);

alter table public.inv_changes enable row level security;
create policy "All may access basic tables"
on public.inv_changes for select
to authenticated
using (true);

alter table public.inv_items enable row level security;
create policy "All may access basic tables"
on public.inv_items for select
to authenticated
using (true);

alter table public.machine_defs enable row level security;
create policy "All may access basic tables"
on public.machine_defs for select
to authenticated
using (true);

alter table public.machines enable row level security;
create policy "All may access basic tables"
on public.machines for select
to authenticated
using (true);

alter table public.prints enable row level security;
create policy "All may access basic tables"
on public.prints for select
to authenticated
using (true);

alter table public.profiles enable row level security;
create policy "All may access basic tables"
on public.profiles for select
to authenticated
using (true);

create policy "Auth users can create faults"
on public.faults for insert
to authenticated
with check (auth.uid() = created_by_user_id);

create policy "Auth users can modify their profile"
on public.profiles for update
to authenticated
using(auth.uid() = user_id);

create policy "Auth users can log prints"
on public.prints for insert
to authenticated
with check (auth.uid() = created_by_user_id);