set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return EXISTS(SELECT * FROM public.user_levels ul WHERE ul.user_id = is_admin.user_id AND ((level >> 28) & 1) = 1);
end
$function$
;


