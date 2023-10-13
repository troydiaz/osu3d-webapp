import type { InventoryCategory, InventoryItem } from "$lib/types/database";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();

    if (session === null || session === undefined)
        throw redirect(303, '/');

    const { data: inventory } = await supabase
        .from('inv_items')
        .select(`
            *,
            created_by: created_by_id (*),
            changes: inv_changes (
                *,
                created_by: created_by_id (*)
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
    submitNewItem: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const name = formData.get('name') as string;
        const minimum = Number(formData.get('minimum'));
        const inv_category_id = formData.get('inv_category_id') as string;

        let result = await supabase
            .from('inv_items')
            .insert({
                name,
                minimum,
                created_by_id: session!.user.id,
                inv_category_id
            });

        console.log(result);
    },
    submitNewChange: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const mode = formData.get('mode') as 'add' | 'subtract';
        const item_id = formData.get('item_id') as string;
        const amount = Number(formData.get('amount'));

        let result = await supabase
            .from('inv_changes')
            .insert({
                inv_item_id: item_id,
                amount: mode === 'add' ? amount : -amount,
                created_by_id: session!.user.id
            });
    }
} satisfies Actions;