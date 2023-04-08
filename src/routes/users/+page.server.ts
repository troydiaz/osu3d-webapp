import type { Fault, Machine, User, UserLevel } from "$lib/types/database";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

    const { data: userLevels } = await supabase
        .from('user_levels')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<UserLevel[]>();
    
    return { session, userLevels };
}) satisfies PageServerLoad;

export const actions = {
    changePermsMulti: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const resolvedById = session?.user.id;
        if (!resolvedById) return { success: false };

        let newPermsList: { id: string, newPermLevel: number, success: boolean }[] = JSON.parse(formData.get('permArray') as string)
            .map((data: { id: string, newPermLevel: number}) => { return { ...data, success: false } });

        for (let permChange of newPermsList) {
            let check = await supabase
                .from('user_levels')
                .select('*')
                .eq('user_id', permChange.id)
                .single();

            console.log('check', check)

            // Do not allow changes to an admin account
            // if (check.data?.level === -1 || permChange.newPermLevel === -1) continue;

            let change = await supabase
                .from('user_levels')
                .update({
                    level: permChange.newPermLevel
                })
                .eq('user_id', permChange.id)
                .single()

            console.log('change', change);

            if (change.status === 200 || change.status === 204) permChange.success = true;
        }

        return {
            success: newPermsList.filter(p => !p.success).length === 0,
        }
    }
} satisfies Actions;

