create policy "Auth users with inventory perms can insert new changes"
on "public"."inv_changes"
as permissive
for insert
to authenticated
with check ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())));


create policy "Auth users with inventory perms can update existing changes"
on "public"."inv_changes"
as permissive
for update
to authenticated
using ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())))
with check ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())));


create policy "Auth users with inventory perms can insert new items"
on "public"."inv_items"
as permissive
for insert
to authenticated
with check ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())));


create policy "Auth users with inventory perms can update existing items"
on "public"."inv_items"
as permissive
for update
to authenticated
using ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())))
with check ((has_perm(auth.uid(), 'INVENTORY'::text) OR is_admin(auth.uid())));



