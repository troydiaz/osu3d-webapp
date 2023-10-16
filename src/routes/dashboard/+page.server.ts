import type { Fault, Machine } from '$lib/types/database';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session)
    throw redirect(303, '/');

    const { data: machines } = await supabase
        .from('machines')
        .select(`
            *,
            machine_def: machine_defs_id (*),
            faults (
                *,
                created_by: created_by_user_id (*),
                resolved_by: resolved_by_user_id (*)
            ),
            prints (
                *,
                created_by: created_by_user_id (*),
                canceled_by: canceled_by_user_id (*)
            )
        `)
        .returns<Machine[]>();

    const { data: userLevel } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

  return { session, machines, userLevel };
}) satisfies PageServerLoad;

export const actions = {
    reportFault: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const faultDescription = formData.get('faultDescription') as string;
        const faultMachineId = formData.get('faultMachineId') as string;

        const createdById = session?.user.id;

        if (faultDescription === '' || createdById === undefined)
            return;

        await supabase
            .from('faults')
            .insert({
                machine_id: faultMachineId,
                created_by_user_id: createdById,
                description: faultDescription,
                resolved: false
            })
    },
    addPrintLog: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const machineId = formData.get('machineId') as string;
        const printLogHours = Number(formData.get('printLogHours') as string);
        const printLogGrams = Number(formData.get('printLogGrams') as string);
        const createdById = session?.user.id;

        if (printLogHours === 0 || printLogGrams === 0 || !createdById)
            return;

        const finishedDate = new Date(Date.now() + 1000 * 60 * 60 * printLogHours);

        await supabase
            .from('prints')
            .insert({
                created_by_user_id: createdById,
                machine_id: machineId,
                done_at: finishedDate.toISOString(),
                filament: printLogGrams
            });
    },
    cancelPrintLog: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        const formData = await request.formData();

        const printLogId = formData.get('printLogId') as string;
        const canceledById = session?.user.id;

        if (!printLogId || !canceledById)
            return;

        // Prevent someone from canceling if it's already been canceled
        const { data: safetyCheck } = await supabase
            .from('prints')
            .select('*')
            .eq('id', printLogId)

        if (safetyCheck && safetyCheck.length > 0 && safetyCheck[0].canceled === true)
            return;

        if (safetyCheck)
            console.log(safetyCheck);

        await supabase
            .from('prints')
            .update({
                canceled: true,
                canceled_by_user_id: canceledById,
                canceled_at: new Date().toISOString()
            })
            .eq('id', printLogId)
            .select();
    }
} satisfies Actions;