set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_perms(user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
  current_perms int8 := (SELECT ul.level from public.user_levels ul where ul.user_id = get_perms.user_id);
BEGIN
  RETURN JSON_BUILD_OBJECT(
    'TIER1', (current_perms >> ((0 * 4) + (0 * 1))) & 1 = 1,
    'TIER2', (current_perms >> ((1 * 4) + (0 * 1))) & 1 = 1,
    'TIER3', (current_perms >> ((2 * 4) + (0 * 1))) & 1 = 1,
    'USERS', (current_perms >> ((3 * 4) + (0 * 1))) & 1 = 1,
    'MACHINES', (current_perms >> ((4 * 4) + (0 * 1))) & 1 = 1,
    'MAINTENANCE', (current_perms >> ((5 * 4) + (0 * 1))) & 1 = 1,
    'INVENTORY', (current_perms >> ((6 * 4) + (0 * 1))) & 1 = 1,
    'ADMIN', (current_perms >> ((7 * 4) + (0 * 1))) & 1 = 1
  );
END
$function$
;

CREATE OR REPLACE FUNCTION public.has_perm(user_id uuid, bit_index integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  return EXISTS(SELECT * FROM public.user_levels ul WHERE ul.user_id = has_perm.user_id AND ((level >> bit_index) & 1) = 1);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_perm(user_id uuid, bit_index integer, value boolean)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
current_perms int8 := (SELECT ul.level from public.user_levels ul where ul.user_id = set_perm.user_id);
BEGIN
IF (((current_perms >> bit_index) & 1 = 1) = value)
THEN
  return false;
END IF;
IF (value)
THEN
  update public.user_levels ul set level = current_perms + 2 ^ bit_index where ul.user_id = set_perm.user_id;
ELSE
  update public.user_levels ul set level = current_perms - 2 ^ bit_index where ul.user_id = set_perm.user_id;
END IF;
return true;
END;
$function$
;


