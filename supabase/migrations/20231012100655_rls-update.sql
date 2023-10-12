drop policy "All may access basic tables" on "public"."faults";

drop policy "All may access basic tables" on "public"."inv_categories";

drop policy "All may access basic tables" on "public"."inv_changes";

drop policy "All may access basic tables" on "public"."inv_items";

drop policy "All may access basic tables" on "public"."machine_defs";

drop policy "All may access basic tables" on "public"."machines";

drop policy "All may access basic tables" on "public"."prints";

drop policy "All may access basic tables" on "public"."profiles";

drop policy "All users can access user levels" on "public"."user_levels";

drop policy "Auth users can modify their profile" on "public"."profiles";

create policy "Auth users can view faults"
on "public"."faults"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view inventory categories"
on "public"."inv_categories"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view inventory changes"
on "public"."inv_changes"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view inventory items"
on "public"."inv_items"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view machine definitions"
on "public"."machine_defs"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view machines"
on "public"."machines"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view prints"
on "public"."prints"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can view profiles"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Admins can update non-admins"
on "public"."user_levels"
as permissive
for update
to authenticated
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));


create policy "Auth users can view user levels"
on "public"."user_levels"
as permissive
for select
to authenticated
using (true);


create policy "Auth users can modify their profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



