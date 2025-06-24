import type { InventoryCategory, InventoryItem } from "$lib/types/models";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";

export const load = (async ({ locals: { supabase, getSession, getPermissions } }) => {
  const session = await getSession();
  const permissions = await getPermissions();
  
  if (!session || !hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST))
    throw redirect(303, '/');

  const { data: inventory } = await supabase
    .from('inv_items_view')
    .select(`
      *,
      created_by: created_by_user_id (*),
      changes: inv_changes_view (
        *,
        created_by: created_by_user_id (*)
      ),
      inv_category: inv_category_id (*)
    `)
    .returns<InventoryItem[]>();

  const { data: categories } = await supabase
    .from('inv_categories')
    .select('*')
    .returns<InventoryCategory[]>();

  if (inventory === null || categories === null)
    throw error(404, 'Could not fetch resources');

  return { session, inventory, categories }
}) satisfies PageServerLoad;

export const actions = {
  submitNewItem: async (event) => {
    const form = await event.request.formData();
    const name = form.get('name') as string;
    const minimum = Number(form.get('minimum'));
    const inv_category_id = form.get('inv_category_id') as string;
    const session = await event.locals.getSession();

    await event.locals.supabase
      .from('inv_items')
      .insert({ name, minimum, created_by_user_id: session!.user.id, inv_category_id });
  },

  submitNewCategory: async (event) => {
    const form = await event.request.formData();
    const name = form.get('name') as string;
    const session = await event.locals.getSession();

    await event.locals.supabase
      .from('inv_categories')
      .insert({ name, created_by_user_id: session!.user.id });
  },

  submitNewChange: async (event) => {
    const form = await event.request.formData();
    const session = await event.locals.getSession();
    const mode = form.get('mode') as 'add' | 'subtract';
    const item_id = form.get('item_id') as string;
    const amount = Number(form.get('amount'));

    await event.locals.supabase
      .from('inv_changes')
      .insert({
        inv_item_id: item_id,
        amount: mode === 'add' ? amount : -amount,
        created_by_user_id: session!.user.id
      });
  },

  updateName: async (event) => {
    const form = await event.request.formData();
    const id = form.get('id') as string;
    const name = form.get('name') as string;

    await event.locals.supabase
      .from('inv_items')
      .update({ name })
      .eq('id', id);
  },

  toggleHidden: async (event) => {
    const form = await event.request.formData();
    const id = form.get('id') as string;
    const hidden = form.get('hidden') === 'true';

    await event.locals.supabase
      .from('inv_items')
      .update({ hidden } as any)
      .eq('id', id);
  }
} satisfies Actions;