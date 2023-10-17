import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { fetchAllMachines } from "$lib/server/machine";

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  const machines = await fetchAllMachines(supabase);

  return { session, machines }
}) satisfies PageServerLoad;