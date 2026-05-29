import { createClient } from '@supabase/supabase-js';
import type { AppData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://xqnswyjujcfxwpgjrjct.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_roGAc63KzOxXPmUxUKc15g_4jbogH9E';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: window.sessionStorage,
  },
});

export async function loadSharedDashboard(password: string) {
  return supabase.rpc('get_shared_dashboard', { shared_password: password });
}

export async function saveSharedDashboard(password: string, data: AppData) {
  return supabase.rpc('save_shared_dashboard', { shared_password: password, dashboard_data: data });
}
