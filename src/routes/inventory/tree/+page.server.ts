import type { InventoryLocation } from "$lib/types/database";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createTree } from "$lib/helpers";

export const load = (async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session)
    throw redirect(303, '/');

  const { data: inventoryLocations } = await supabase
    .from('inv_locations')
    .select(`*`)
    .returns<InventoryLocation[]>();

    if (!inventoryLocations)
      throw error(404, `Resource not found`);

  const tree = createTree(inventoryLocations, 'id', 'parent');

  console.log(tree);

  return { session, tree }
}) satisfies PageServerLoad;

export const actions = {

} satisfies Actions;