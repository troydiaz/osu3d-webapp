import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fetchDashboardRouteData } from '$lib/server/machine';

export const load = (async ({ locals: { supabase, getSession, getPermissions } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  const routeData = await fetchDashboardRouteData(supabase);

  const { data: profile } = await supabase
    .from('profiles')
    .select(`email, full_name, discord`)
    .eq('user_id', session.user.id)
    .maybeSingle();

  return { session, routeData, profile };
}) satisfies PageServerLoad;

export const actions = {
  reportFault: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const session = await getSession();

    const description = formData.get('description') as string;
    const machine_id = formData.get('machine_id') as string;
    const print_id = formData.get('print_id') as string;
    const created_by_user_id = session?.user.id;

    if (description === '' || !created_by_user_id) return;

    const result = await supabase
      .from('machine_events')
      .insert({
        event_type: 'FAULT',
        created_by_user_id,
        resolved: false,
        machine_id,
        description,
        print_id: print_id || null
      })
      .select();

    console.log(result);

    if (result.error) throw error(result.status, result.error.message);
  },
  addPrintLog: async ({ request, locals: { supabase, getSession }, url }) => {
    const formData = await request.formData();
    const session = await getSession();

    const machine_id = formData.get('machine_id') as string;
    const printLogHours = Number(formData.get('hours') as string);
    const printLogGrams = Number(formData.get('grams') as string);
    const created_by_user_id = session?.user.id;

    if (printLogHours === 0 || printLogGrams === 0 || !created_by_user_id) return;

    const finishedDate = new Date(Date.now() + 1000 * 60 * 60 * printLogHours);

    await supabase.from('prints').insert({
      created_by_user_id,
      machine_id: machine_id,
      done_at: finishedDate.toISOString(),
      filament: printLogGrams
    });
  },
  cancelPrintLog: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const formData = await request.formData();

    const print_id = formData.get('print_id') as string | null;
    const machine_id = formData.get('machine_id') as string | null;

    const created_by_user_id = session?.user.id;

    if (!print_id || !machine_id || !created_by_user_id) return;

    // Prevent someone from canceling if it's already been canceled
    const { data: safetyCheck } = await supabase.from('prints_view').select('*').eq('id', print_id).maybeSingle();

    if (safetyCheck?.status === 'CANCELED') return;

    await supabase.from('machine_events').insert({
      event_type: 'STOP',
      created_by_user_id,
      resolved: true,
      machine_id,
      print_id
    });
  },

  completePrintLog: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const form = await request.formData();
    const print_id = form.get('print_id') as string | null;
    if (!print_id) return;

    const now = new Date().toISOString();
    const response = await supabase.from('prints').update({ done_at: now }).eq('id', print_id);

    if (response.error) {
      throw error(response.status, response.error.message);
    }
  }
} satisfies Actions;
