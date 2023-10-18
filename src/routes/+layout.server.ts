import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (async ({ locals: { supabase, getSession } }) => {
    return {
        session: getSession(),
    };
}) satisfies LayoutServerLoad;