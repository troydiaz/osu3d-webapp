create table
  public.inv_items (
    id uuid not null default uuid_generate_v4 (),
    name text not null,
    created_at timestamp with time zone not null default now(),
    created_by_id uuid not null,
    minimum bigint not null,
    constraint inv_item_pkey primary key (id),
    constraint inv_item_created_by_user_id_fkey foreign key (created_by_id) references profiles (user_id)
  ) tablespace pg_default;

create table
  public.inv_changes (
    id uuid not null default uuid_generate_v4 (),
    inv_item_id uuid not null,
    amount bigint not null,
    created_by_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint inv_change_pkey primary key (id),
    constraint inv_change_inv_item_id_fkey foreign key (inv_item_id) references inv_items (id),
    constraint inv_change_created_by_user_id_fkey foreign key (created_by_id) references profiles (user_id)
  ) tablespace pg_default;