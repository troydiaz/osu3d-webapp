-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger security definer as $$
begin
  insert into public.profiles(user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email');

  insert into public.user_levels(user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email');
  return new;
end
$$ language plpgsql;

-- trigger the function every time a user is created
create or replace trigger
  on_auth_user_created
after
  insert on auth.users for each row
execute
  function public.handle_new_user();
