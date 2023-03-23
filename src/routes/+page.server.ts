import { supabase } from "../lib/supabaseClient";

export async function load() {
    const { data } = await supabase.from('machines').select();
    return {
        machines: data ?? [],
    };
}