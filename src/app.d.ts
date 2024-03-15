// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Permissions } from '$lib/types/models';
import type { Database } from '$lib/types/supabase';
import { SupabaseClient, Session } from '@supabase/supabase-js';
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			getPermissions(): Promise<Permissions | null>;
		}
		interface PageData {
			session: Session | null;
			permissions: Permissions | null;
		}

		// interface Error {}
		// interface Platform {}
	}
}

export {};
