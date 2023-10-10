create table
  public.inv_categories (
    id uuid not null default uuid_generate_v4 (),
    name text not null,
    created_at timestamp with time zone not null default now(),
    created_by_id uuid not null,
    constraint inv_categories_pkey primary key (id),
    constraint inv_categories_created_by_user_id_fkey foreign key (created_by_id) references profiles (user_id)
  ) tablespace pg_default;

alter table public.inv_items 
  add inv_category_id uuid not null,
  add constraint inv_items_inv_category_id_fkey foreign key (inv_category_id) references inv_categories (id);