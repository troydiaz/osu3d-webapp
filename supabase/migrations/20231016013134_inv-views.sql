alter table "public"."inv_changes" drop constraint "inv_change_created_by_user_id_fkey";

alter table "public"."inv_changes" drop constraint "inv_change_inv_item_id_fkey";

alter table "public"."inv_items" drop constraint "inv_item_created_by_user_id_fkey";

alter table "public"."inv_categories" drop constraint "inv_categories_created_by_user_id_fkey";

alter table "public"."inv_categories" rename created_by_id to created_by_user_id;

alter table "public"."inv_changes" rename created_by_id to created_by_user_id;

alter table "public"."inv_items" rename created_by_id to created_by_user_id;

alter table "public"."inv_changes" add constraint "inv_changes_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES profiles(user_id) not valid;

alter table "public"."inv_changes" validate constraint "inv_changes_created_by_user_id_fkey";

alter table "public"."inv_changes" add constraint "inv_changes_inv_item_id_fkey" FOREIGN KEY (inv_item_id) REFERENCES inv_items(id) not valid;

alter table "public"."inv_changes" validate constraint "inv_changes_inv_item_id_fkey";

alter table "public"."inv_items" add constraint "inv_items_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES profiles(user_id) not valid;

alter table "public"."inv_items" validate constraint "inv_items_created_by_user_id_fkey";

alter table "public"."inv_categories" add constraint "inv_categories_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES profiles(user_id) not valid;

alter table "public"."inv_categories" validate constraint "inv_categories_created_by_user_id_fkey";

create or replace view "public"."inv_changes_view" as  SELECT inv_changes.id,
    inv_changes.inv_item_id,
    inv_changes.amount,
    inv_changes.created_by_user_id AS created_by_id,
    inv_changes.created_at,
    (sum(inv_changes.amount) OVER (PARTITION BY inv_changes.inv_item_id ORDER BY inv_changes.created_at))::integer AS running_total
   FROM inv_changes
  ORDER BY inv_changes.created_at DESC;


create or replace view "public"."inv_items_view" as  SELECT inv_items.id,
    inv_items.name,
    inv_items.created_at,
    inv_items.created_by_user_id AS created_by_id,
    inv_items.minimum,
    inv_items.inv_category_id,
    COALESCE(( SELECT inv_changes_view.running_total
           FROM inv_changes_view
          WHERE (inv_changes_view.inv_item_id = inv_items.id)
         LIMIT 1), 0) AS current_stock
   FROM inv_items;



