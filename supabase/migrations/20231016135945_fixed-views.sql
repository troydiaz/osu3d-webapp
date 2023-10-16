drop policy "Auth users can create faults" on "public"."faults";

create or replace view "public"."prints_view" with (security_invoker = true) as SELECT prints.id,
    prints.created_by_user_id,
    prints.machine_id,
    prints.created_at,
    prints.done_at,
    prints.canceled,
    prints.canceled_by_user_id,
    prints.canceled_at,
    prints.filament,
    ((prints.done_at < now()) OR (prints.canceled = true)) AS complete,
    ( SELECT machines.tier
           FROM machines
          WHERE (prints.machine_id = machines.id)
         LIMIT 1) AS machine_tier
   FROM prints;


create policy "Auth users with tier perms can update prints"
on "public"."prints"
as permissive
for update
to authenticated
using ((has_perm(auth.uid(), ('TIER'::text || (( SELECT machines.tier
   FROM machines
  WHERE (machines.id = prints.machine_id)
 LIMIT 1))::text)) OR is_admin(auth.uid())))
with check ((has_perm(auth.uid(), ('TIER'::text || (( SELECT machines.tier
   FROM machines
  WHERE (machines.id = prints.machine_id)
 LIMIT 1))::text)) OR is_admin(auth.uid())));


create policy "Auth users can create faults"
on "public"."faults"
as permissive
for insert
to authenticated
with check ((has_perm(auth.uid(), ('TIER'::text || (( SELECT machines.tier
   FROM machines
  WHERE (machines.id = faults.machine_id)
 LIMIT 1))::text)) OR is_admin(auth.uid())));



