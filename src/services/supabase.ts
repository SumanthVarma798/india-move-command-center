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

export interface DashboardStateRow {
  user_id: string;
  data: AppData;
  updated_at: string;
}

export async function loadRemoteDashboard(userId: string) {
  return supabase.from('dashboard_states').select('data, updated_at').eq('user_id', userId).maybeSingle<Pick<DashboardStateRow, 'data' | 'updated_at'>>();
}

export async function saveRemoteDashboard(userId: string, data: AppData) {
  return supabase
    .from('dashboard_states')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select('updated_at')
    .single<Pick<DashboardStateRow, 'updated_at'>>();
}
