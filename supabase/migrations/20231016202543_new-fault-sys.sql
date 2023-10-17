create extension if not exists "pg_cron" with schema "extensions";

create type "public"."event_type" as enum ('STOP', 'FAULT');

create type "public"."machine_status" as enum ('IDLE', 'WORKING', 'FAULT');

create type "public"."print_status" as enum ('WORKING', 'SUCCESS', 'CANCELED', 'FAULT');

drop policy "Auth users can create faults" on "public"."faults";

drop policy "Auth users can view faults" on "public"."faults";

drop policy "Users with machine perms can update faults" on "public"."faults";

drop policy "Auth users can log prints" on "public"."prints";

alter table
  "public"."faults" drop constraint "faults_created_by_user_id_fkey";

alter table
  "public"."faults" drop constraint "faults_machine_id_fkey";

alter table
  "public"."faults" drop constraint "faults_resolved_by_user_id_fkey";

alter table
  "public"."prints" drop constraint "prints_canceled_by_user_id_fkey";

drop view if exists "public"."prints_view";

alter table
  "public"."faults" drop constraint "faults_pkey";

drop index if exists "public"."faults_pkey";

drop table "public"."faults";

create table "public"."machine_events" (
  "id" uuid not null default uuid_generate_v4(),
  "machine_id" uuid not null,
  "created_by_user_id" uuid not null,
  "description" text,
  "resolved" boolean not null default false,
  "resolved_by_user_id" uuid,
  "resolved_at" date,
  "event_type" event_type not null
);

alter table
  "public"."machine_events" enable row level security;

alter table
  "public"."prints" drop column "canceled";

alter table
  "public"."prints" drop column "canceled_at";

alter table
  "public"."prints" drop column "canceled_by_user_id";

alter table
  "public"."prints"
add
  column "machine_event_id" uuid;

CREATE UNIQUE INDEX machine_events_pkey ON public.machine_events USING btree (id);

alter table
  "public"."machine_events"
add
  constraint "machine_events_pkey" PRIMARY KEY using index "machine_events_pkey";

alter table
  "public"."machine_events"
add
  constraint "machine_events_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES profiles(user_id) not valid;

alter table
  "public"."machine_events" validate constraint "machine_events_created_by_user_id_fkey";

alter table
  "public"."machine_events"
add
  constraint "machine_events_machine_id_fkey" FOREIGN KEY (machine_id) REFERENCES machines(id) not valid;

alter table
  "public"."machine_events" validate constraint "machine_events_machine_id_fkey";

alter table
  "public"."machine_events"
add
  constraint "machine_events_resolved_by_user_id_fkey" FOREIGN KEY (resolved_by_user_id) REFERENCES profiles(user_id) not valid;

alter table
  "public"."machine_events" validate constraint "machine_events_resolved_by_user_id_fkey";

alter table
  "public"."prints"
add
  constraint "prints_machine_event_id_fkey" FOREIGN KEY (machine_event_id) REFERENCES machine_events(id) not valid;

alter table
  "public"."prints" validate constraint "prints_machine_event_id_fkey";

set
  check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_machine_status(machine_id uuid)
RETURNS machine_status
LANGUAGE plpgsql
SECURITY DEFINER AS 
$$
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
      and me.resolved is not false
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
SECURITY DEFINER AS
$$
declare
  _print record;
begin
  select
    into _print done_at,
    resolved,
    event_type
  from
    public.prints pr
    left join machine_events me on pr.id = me.print_id
  where
    pr.id = get_print_status.print_id;

  return case
    when (
      _print.resolved is not false
      and _print.event_type = 'FAULT'
    ) then 'FAULT'
    when (
      _print.resolved is not false
      and _print.event_type = 'STOP'
    ) then 'CANCELED'
    when (
      _print.done_at > now()
      and coalesce(_print.resolved, true) is true
    ) then 'WORKING'
    else 'SUCCESS'
  end case;
end
$$;

create
or replace view "public"."machines_view" as
SELECT
  machines.id,
  machines.created_at,
  machines.tier,
  machines.nickname,
  machines.machine_defs_id,
  get_machine_status(machines.id) AS status
FROM
  machines;

CREATE OR REPLACE FUNCTION public.has_perm(user_id uuid, perm_name text)
RETURNS boolean
LANGUAGE plpgsql AS $$
declare
  perm_value boolean := (public.get_perms(has_perm.user_id) ->> perm_name) :: boolean;
BEGIN
  return coalesce(perm_value, false);
END
$$;

create
or replace view "public"."prints_view" with (security_invoker = true) as
SELECT
  prints.id,
  prints.created_by_user_id,
  prints.machine_id,
  prints.created_at,
  prints.done_at,
  prints.filament,
  prints.machine_event_id,
  get_print_status(prints.id) AS status
FROM
  prints;

create policy "Auth users can log prints" on "public"."prints" as permissive for
insert
  to authenticated with check (true);