import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fetchDashboardRouteData } from '$lib/server/machine';

// Strong typing for filament rows
type FilamentRow = {
  inv_item_id: string;
  name: string;
  spool_grams: number | null;
  grams_left: number;
};

export const load = (async ({ locals: { supabase, getSession, getPermissions } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  const routeData = await fetchDashboardRouteData(supabase);

  const { data: profile } = await supabase
    .from('profiles')
    .select(`email, full_name, discord`)
    .eq('user_id', session.user.id)
    .maybeSingle();

  // Typed fetch for filament options
  const { data: filaments, error: filErr } = (await (supabase as any)
    .from('filament_grams_view')
    .select('inv_item_id,name,spool_grams,grams_left')
    .order('name', { ascending: true })) as { data: FilamentRow[]; error: any };

  if (filErr) throw error(500, filErr.message);

  return { session, routeData, profile, filaments };
}) satisfies PageServerLoad;

export const actions = {
  reportFault: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const session = await getSession();

    // const using_personal = formData.get('using_personal') === 'true';
    // const filament_item_id = (formData.get('filament_item_id') as string) || null;

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

  addPrintLog: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const session = await getSession();
    const created_by_user_id = session?.user.id;
    if (!created_by_user_id) return;

    const machine_id = String(formData.get('machine_id') ?? '');
    const printLogHours = Number(formData.get('hours') ?? 0);
    const printLogGrams = Number(formData.get('grams') ?? 0);
    const using_personal = String(formData.get('using_personal') ?? 'false') === 'true';
    const filament_item_id = (formData.get('filament_item_id') as string) || null;

    if (printLogHours === 0 || printLogGrams === 0) return;

    // Business rule: if not personal, filament_item_id must be present
    if (!using_personal && !filament_item_id) {
      return fail(400, { message: 'Choose a filament type or mark as personal.' });
    }

    const finishedDate = new Date(Date.now() + 1000 * 60 * 60 * printLogHours).toISOString();

    // Insert print
    const { error: insErr } = await supabase.from('prints').insert({
      created_by_user_id,
      machine_id,
      done_at: finishedDate,
      filament: printLogGrams,
      using_personal,
      filament_item_id: using_personal ? null : filament_item_id
    });
    if (insErr) throw error(insErr.code === '23503' ? 400 : 500, insErr.message);

    if (!using_personal && filament_item_id && printLogGrams > 0) {
      const { error: rpcErr } = await supabase.rpc('decrement_spool_grams', {
        p_item_id: filament_item_id,
        p_used: Math.trunc(printLogGrams) 
      });
      if (rpcErr) throw error(500, rpcErr.message);
    }
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
