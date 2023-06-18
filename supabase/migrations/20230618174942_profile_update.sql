alter table public.profiles
  drop column username,
  drop column avatar_url,
  drop column website;

alter table public.profiles
  add column discord text null;