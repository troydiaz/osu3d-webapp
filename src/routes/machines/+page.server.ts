import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load = (async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

    const { data: machines } = await supabase
        .from('machines')
        .select(`
            *,
            machine_defs_id (
                *
            )
        `);

    const { data: machineDefs } = await supabase
        .from('machine_defs')
        .select('*');

    return { session, machines, machineDefs }
}) satisfies PageServerLoad;