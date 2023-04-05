import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
    return {
        session: getSession()
    };
};