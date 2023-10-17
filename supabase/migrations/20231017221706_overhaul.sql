alter table "public"."prints" drop constraint "prints_machine_event_id_fkey";

drop view if exists "public"."prints_view";

alter table "public"."machine_events" add column "created_at" timestamp with time zone not null default now();

alter table "public"."machine_events" add column "print_id" uuid;

alter table "public"."prints" drop column "machine_event_id";

alter table "public"."machine_events" add constraint "machine_events_print_id_fkey" FOREIGN KEY (print_id) REFERENCES prints(id) not valid;

alter table "public"."machine_events" validate constraint "machine_events_print_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_machine_status(machine_id uuid)
RETURNS machine_status
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  unresolved_fault boolean := exists(
    select
    from
      machine_events me
    where
      event_type = 'FAULT'
      and resolved is not true
      and me.machine_id = get_machine_status.machine_id
  );
  active_print boolean := exists(
    select
    from
      prints pr
      left join machine_events me on pr.id = me.print_id
    where
      done_at > now()
      and pr.machine_id = get_machine_status.machine_id
      and me.id is null
  );
begin
  return case
    when unresolved_fault then 'FAULT'
    when active_print then 'WORKING'
    else 'IDLE'
  end case;
end
$$;

CREATE OR REPLACE FUNCTION public.get_print_status(print_id uuid)
RETURNS print_status
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  _print record;
begin
  select into _print done_at, resolved, event_type from public.prints pr left join machine_events me on pr.id = me.print_id where pr.id = get_print_status.print_id;

  return case
    when _print.event_type = 'FAULT' then 'FAULT'
    when _print.event_type = 'STOP' then 'CANCELED'
    when _print.done_at > now() then 'WORKING'
    else 'SUCCESS'
  end case;
end
$$;

CREATE OR REPLACE FUNCTION public.has_perm(user_id uuid, perm_name text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $$
declare
  perm_value boolean := (public.get_perms(has_perm.user_id)->>perm_name)::boolean;
BEGIN
  return coalesce(perm_value, false);
END
$$;

create or replace view "public"."prints_view" as  SELECT prints.id,
    prints.created_by_user_id,
    prints.machine_id,
    prints.created_at,
    prints.done_at,
    prints.filament,
    get_print_status(prints.id) AS status
   FROM prints;

create policy "Auth users can create machine events"
on "public"."machine_events"
as permissive
for insert
to authenticated
with check ((has_perm(auth.uid(), ('TIER'::text || (( SELECT machines.tier
   FROM machines
  WHERE (machines.id = machine_events.machine_id)
 LIMIT 1))::text)) OR is_admin(auth.uid())));

create policy "Auth users can view machine events"
on "public"."machine_events"
as permissive
for select
to authenticated
using (true);

create policy "Users with machine perms can update faults"
on "public"."machine_events"
as permissive
for update
to authenticated
using ((has_perm(auth.uid(), 'MACHINES'::text) OR is_admin(auth.uid())))
with check ((has_perm(auth.uid(), 'MACHINES'::text) OR is_admin(auth.uid())));



