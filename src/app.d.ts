// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { UserPermissions, UserProfile } from '$lib/types/models';
import type { Database } from '$lib/types/supabase';
import { SupabaseClient, Session } from '@supabase/supabase-js';
declare global {
  
  // Populated by Vite
  const __APP_NAME__: string;
  const __APP_VERSION__: string;

  namespace App {
    
    interface Locals {
      supabase: SupabaseClient<Database>;
      getSession(): Promise<Session | null>;
      getPermissions(): Promise<UserPermissions | null>;
      getUserProfile(): Promise<UserProfile | null>;
    }
    interface PageData {
      session: Session | null;
      permissions: UserPermissions | null;
    }

    // interface Error {}
    // interface Platform {}
  }
}

export {};
