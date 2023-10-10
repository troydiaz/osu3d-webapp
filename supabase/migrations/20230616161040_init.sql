create table
  public.user_levels (
    user_id uuid not null,
    level bigint not null default '0'::bigint,
    full_name text null,
    email text null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint user_levels_pkey primary key (user_id),
    constraint user_levels_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

create table
  public.profiles (
    user_id uuid not null,
    updated_at timestamp with time zone not null default now(),
    username text null,
    full_name text null,
    avatar_url text null,
    website text null,
    created_at timestamp with time zone not null default now(),
    email text null,
    constraint profiles_pkey primary key (user_id),
    constraint profiles_username_key unique (username),
    constraint profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint username_length check ((char_length(username) >= 3))
  ) tablespace pg_default;

create table
  public.machine_defs (
    id uuid not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    make text null,
    model text null,
    constraint machine_defs_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.machines (
    id uuid not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    tier bigint not null default '0'::bigint,
    nickname text not null default 'nickname'::text,
    machine_defs_id uuid not null,
    constraint machines_pkey primary key (id),
    constraint machines_machine_defs_id_fkey foreign key (machine_defs_id) references machine_defs (id)
  ) tablespace pg_default;

create table
  public.faults (
    id uuid not null default uuid_generate_v4 (),
    created_at timestamp with time zone not null default now(),
    machine_id uuid not null,
    resolved boolean not null default false,
    resolved_by_user_id uuid null,
    resolved_at timestamp with time zone null,
    created_by_user_id uuid not null,
    description text not null default ''::text,
    constraint faults_pkey primary key (id),
    constraint faults_created_by_user_id_fkey foreign key (created_by_user_id) references profiles (user_id),
    constraint faults_machine_id_fkey foreign key (machine_id) references machines (id),
    constraint faults_resolved_by_user_id_fkey foreign key (resolved_by_user_id) references profiles (user_id)
  ) tablespace pg_default;

create table
  public.prints (
    id uuid not null default uuid_generate_v4 (),
    created_by_user_id uuid not null,
    machine_id uuid not null,
    created_at timestamp with time zone not null default now(),
    done_at timestamp with time zone not null,
    cancelled boolean not null default false,
    cancelled_by_user_id uuid null,
    cancelled_at timestamp with time zone null,
    filament bigint not null default '0'::bigint,
    constraint prints_pkey primary key (id),
    constraint prints_cancelled_by_user_id_fkey foreign key (cancelled_by_user_id) references profiles (user_id),
    constraint prints_created_by_user_id_fkey foreign key (created_by_user_id) references profiles (user_id),
    constraint prints_machine_id_fkey foreign key (machine_id) references machines (id)
  ) tablespace pg_default;