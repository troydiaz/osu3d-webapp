alter table "public"."prints" drop constraint "prints_cancelled_by_user_id_fkey";

alter table "public"."prints" rename "cancelled" to "canceled";

alter table "public"."prints" rename "cancelled_at" to "canceled_at";

alter table "public"."prints" rename "cancelled_by_user_id" to "canceled_by_user_id";

alter table "public"."prints" add constraint "prints_canceled_by_user_id_fkey" FOREIGN KEY (canceled_by_user_id) REFERENCES profiles(user_id) not valid;

alter table "public"."prints" validate constraint "prints_canceled_by_user_id_fkey";