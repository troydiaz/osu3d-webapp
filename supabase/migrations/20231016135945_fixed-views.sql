
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_perms"("user_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
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
$$;

ALTER FUNCTION "public"."get_perms"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles(user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email');

  insert into public.user_levels(user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email');
  return new;
end
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."has_perm"("user_id" "uuid", "bit_index" integer) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  return EXISTS(SELECT * FROM public.user_levels ul WHERE ul.user_id = has_perm.user_id AND ((level >> bit_index) & 1) = 1);
END;
$$;

ALTER FUNCTION "public"."has_perm"("user_id" "uuid", "bit_index" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."has_perm"("user_id" "uuid", "perm_name" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
declare
  perm_value boolean := (public.get_perms(has_perm.user_id)->perm_name);
BEGIN
  return coalesce(perm_value, false);
END;
$$;

ALTER FUNCTION "public"."has_perm"("user_id" "uuid", "perm_name" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_admin"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return EXISTS(SELECT * FROM public.user_levels ul WHERE ul.user_id = is_admin.user_id AND ((level >> 28) & 1) = 1);
end
$$;

ALTER FUNCTION "public"."is_admin"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_perm"("user_id" "uuid", "bit_index" integer, "value" boolean) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
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
$$;

ALTER FUNCTION "public"."set_perm"("user_id" "uuid", "bit_index" integer, "value" boolean) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."faults" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "machine_id" "uuid" NOT NULL,
    "resolved" boolean DEFAULT false NOT NULL,
    "resolved_by_user_id" "uuid",
    "resolved_at" timestamp with time zone,
    "created_by_user_id" "uuid" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."faults" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."inv_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by_user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."inv_categories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."inv_changes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "inv_item_id" "uuid" NOT NULL,
    "amount" bigint NOT NULL,
    "created_by_user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."inv_changes" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."inv_changes_view" WITH ("security_invoker"='true') AS
 SELECT "inv_changes"."id",
    "inv_changes"."inv_item_id",
    "inv_changes"."amount",
    "inv_changes"."created_by_user_id",
    "inv_changes"."created_at",
    ("sum"("inv_changes"."amount") OVER (PARTITION BY "inv_changes"."inv_item_id" ORDER BY "inv_changes"."created_at"))::integer AS "running_total"
   FROM "public"."inv_changes"
  ORDER BY "inv_changes"."created_at" DESC;

ALTER TABLE "public"."inv_changes_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."inv_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by_user_id" "uuid" NOT NULL,
    "minimum" bigint NOT NULL,
    "inv_category_id" "uuid" NOT NULL
);

ALTER TABLE "public"."inv_items" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."inv_items_view" WITH ("security_invoker"='true') AS
 SELECT "inv_items"."id",
    "inv_items"."name",
    "inv_items"."created_at",
    "inv_items"."created_by_user_id",
    "inv_items"."minimum",
    "inv_items"."inv_category_id",
    COALESCE(( SELECT "inv_changes_view"."running_total"
           FROM "public"."inv_changes_view"
          WHERE ("inv_changes_view"."inv_item_id" = "inv_items"."id")
         LIMIT 1), 0) AS "current_stock"
   FROM "public"."inv_items";

ALTER TABLE "public"."inv_items_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."machine_defs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "make" "text",
    "model" "text"
);

ALTER TABLE "public"."machine_defs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."machines" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tier" bigint DEFAULT '0'::bigint NOT NULL,
    "nickname" "text" DEFAULT 'nickname'::"text" NOT NULL,
    "machine_defs_id" "uuid" NOT NULL
);

ALTER TABLE "public"."machines" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prints" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_by_user_id" "uuid" NOT NULL,
    "machine_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "done_at" timestamp with time zone NOT NULL,
    "canceled" boolean DEFAULT false NOT NULL,
    "canceled_by_user_id" "uuid",
    "canceled_at" timestamp with time zone,
    "filament" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."prints" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."prints_view" WITH ("security_invoker"='true') AS
 SELECT "prints"."id",
    "prints"."created_by_user_id",
    "prints"."machine_id",
    "prints"."created_at",
    "prints"."done_at",
    "prints"."canceled",
    "prints"."canceled_by_user_id",
    "prints"."canceled_at",
    "prints"."filament",
    (("prints"."done_at" < "now"()) OR ("prints"."canceled" = true)) AS "complete",
    ( SELECT "machines"."tier"
           FROM "public"."machines"
          WHERE ("prints"."machine_id" = "machines"."id")
         LIMIT 1) AS "machine_tier"
   FROM "public"."prints";

ALTER TABLE "public"."prints_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
    "discord" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_levels" (
    "user_id" "uuid" NOT NULL,
    "level" bigint DEFAULT '0'::bigint NOT NULL,
    "full_name" "text",
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."user_levels" OWNER TO "postgres";

ALTER TABLE ONLY "public"."faults"
    ADD CONSTRAINT "faults_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."inv_categories"
    ADD CONSTRAINT "inv_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."inv_changes"
    ADD CONSTRAINT "inv_change_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."inv_items"
    ADD CONSTRAINT "inv_item_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."machine_defs"
    ADD CONSTRAINT "machine_defs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."machines"
    ADD CONSTRAINT "machines_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prints"
    ADD CONSTRAINT "prints_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."user_levels"
    ADD CONSTRAINT "user_levels_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."faults"
    ADD CONSTRAINT "faults_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."faults"
    ADD CONSTRAINT "faults_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id");

ALTER TABLE ONLY "public"."faults"
    ADD CONSTRAINT "faults_resolved_by_user_id_fkey" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."inv_categories"
    ADD CONSTRAINT "inv_categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."inv_changes"
    ADD CONSTRAINT "inv_changes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."inv_changes"
    ADD CONSTRAINT "inv_changes_inv_item_id_fkey" FOREIGN KEY ("inv_item_id") REFERENCES "public"."inv_items"("id");

ALTER TABLE ONLY "public"."inv_items"
    ADD CONSTRAINT "inv_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."inv_items"
    ADD CONSTRAINT "inv_items_inv_category_id_fkey" FOREIGN KEY ("inv_category_id") REFERENCES "public"."inv_categories"("id");

ALTER TABLE ONLY "public"."machines"
    ADD CONSTRAINT "machines_machine_defs_id_fkey" FOREIGN KEY ("machine_defs_id") REFERENCES "public"."machine_defs"("id");

ALTER TABLE ONLY "public"."prints"
    ADD CONSTRAINT "prints_canceled_by_user_id_fkey" FOREIGN KEY ("canceled_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."prints"
    ADD CONSTRAINT "prints_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."prints"
    ADD CONSTRAINT "prints_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_levels"
    ADD CONSTRAINT "user_levels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Admins can update non-admins" ON "public"."user_levels" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Auth users can create faults" ON "public"."faults" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_perm"("auth"."uid"(), ('TIER'::"text" || (( SELECT "machines"."tier"
   FROM "public"."machines"
  WHERE ("machines"."id" = "faults"."machine_id")
 LIMIT 1))::"text")) OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users can log prints" ON "public"."prints" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by_user_id"));

CREATE POLICY "Auth users can modify their profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Auth users can view faults" ON "public"."faults" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view inventory categories" ON "public"."inv_categories" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view inventory changes" ON "public"."inv_changes" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view inventory items" ON "public"."inv_items" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view machine definitions" ON "public"."machine_defs" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view machines" ON "public"."machines" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view prints" ON "public"."prints" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users can view user levels" ON "public"."user_levels" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Auth users with inventory access can insert new rows" ON "public"."inv_changes" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with inventory perms can insert categories" ON "public"."inv_categories" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with inventory perms can insert new items" ON "public"."inv_items" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with inventory perms can update existing categories" ON "public"."inv_categories" FOR UPDATE TO "authenticated" USING (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with inventory perms can update existing rows" ON "public"."inv_changes" FOR UPDATE TO "authenticated" USING (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with inventory perms can update items" ON "public"."inv_items" FOR UPDATE TO "authenticated" USING (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (("public"."has_perm"("auth"."uid"(), 'INVENTORY'::"text") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Auth users with tier perms can update prints" ON "public"."prints" FOR UPDATE TO "authenticated" USING (("public"."has_perm"("auth"."uid"(), ('TIER'::"text" || (( SELECT "machines"."tier"
   FROM "public"."machines"
  WHERE ("machines"."id" = "prints"."machine_id")
 LIMIT 1))::"text")) OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (("public"."has_perm"("auth"."uid"(), ('TIER'::"text" || (( SELECT "machines"."tier"
   FROM "public"."machines"
  WHERE ("machines"."id" = "prints"."machine_id")
 LIMIT 1))::"text")) OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Users with machine perms can update faults" ON "public"."faults" FOR UPDATE TO "authenticated" USING ("public"."has_perm"("auth"."uid"(), 'MACHINES'::"text")) WITH CHECK ("public"."has_perm"("auth"."uid"(), 'MACHINES'::"text"));

ALTER TABLE "public"."faults" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."inv_categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."inv_changes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."inv_items" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."machine_defs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."machines" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prints" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_levels" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_perms"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_perms"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_perms"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "bit_index" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "bit_index" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "bit_index" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "perm_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "perm_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_perm"("user_id" "uuid", "perm_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."set_perm"("user_id" "uuid", "bit_index" integer, "value" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."set_perm"("user_id" "uuid", "bit_index" integer, "value" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_perm"("user_id" "uuid", "bit_index" integer, "value" boolean) TO "service_role";

GRANT ALL ON TABLE "public"."faults" TO "anon";
GRANT ALL ON TABLE "public"."faults" TO "authenticated";
GRANT ALL ON TABLE "public"."faults" TO "service_role";

GRANT ALL ON TABLE "public"."inv_categories" TO "anon";
GRANT ALL ON TABLE "public"."inv_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."inv_categories" TO "service_role";

GRANT ALL ON TABLE "public"."inv_changes" TO "anon";
GRANT ALL ON TABLE "public"."inv_changes" TO "authenticated";
GRANT ALL ON TABLE "public"."inv_changes" TO "service_role";

GRANT ALL ON TABLE "public"."inv_changes_view" TO "anon";
GRANT ALL ON TABLE "public"."inv_changes_view" TO "authenticated";
GRANT ALL ON TABLE "public"."inv_changes_view" TO "service_role";

GRANT ALL ON TABLE "public"."inv_items" TO "anon";
GRANT ALL ON TABLE "public"."inv_items" TO "authenticated";
GRANT ALL ON TABLE "public"."inv_items" TO "service_role";

GRANT ALL ON TABLE "public"."inv_items_view" TO "anon";
GRANT ALL ON TABLE "public"."inv_items_view" TO "authenticated";
GRANT ALL ON TABLE "public"."inv_items_view" TO "service_role";

GRANT ALL ON TABLE "public"."machine_defs" TO "anon";
GRANT ALL ON TABLE "public"."machine_defs" TO "authenticated";
GRANT ALL ON TABLE "public"."machine_defs" TO "service_role";

GRANT ALL ON TABLE "public"."machines" TO "anon";
GRANT ALL ON TABLE "public"."machines" TO "authenticated";
GRANT ALL ON TABLE "public"."machines" TO "service_role";

GRANT ALL ON TABLE "public"."prints" TO "anon";
GRANT ALL ON TABLE "public"."prints" TO "authenticated";
GRANT ALL ON TABLE "public"."prints" TO "service_role";

GRANT ALL ON TABLE "public"."prints_view" TO "anon";
GRANT ALL ON TABLE "public"."prints_view" TO "authenticated";
GRANT ALL ON TABLE "public"."prints_view" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."user_levels" TO "anon";
GRANT ALL ON TABLE "public"."user_levels" TO "authenticated";
GRANT ALL ON TABLE "public"."user_levels" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
