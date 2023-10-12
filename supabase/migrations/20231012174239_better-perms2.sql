set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_perm(user_id uuid, perm_name text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
  perm_value boolean := (public.get_perms(has_perm.user_id)->perm_name);
BEGIN
  return coalesce(perm_value, false);
END;
$function$
;

create policy "Users with machine perms can update faults"
on "public"."faults"
as permissive
for update
to authenticated
using (has_perm(auth.uid(), 'MACHINES'::text))
with check (has_perm(auth.uid(), 'MACHINES'::text));



