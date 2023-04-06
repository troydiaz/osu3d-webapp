import type { Actions, LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (async ({ locals: { getSession } }) => {
    return {
        session: getSession()
    };
}) satisfies LayoutServerLoad;