import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/client/supabase';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const profile = writable<any>(null);
export const isAdmin = derived(profile, ($profile) =>
  $profile?.role === 'admin' || $profile?.role === 'super_admin'
);

export async function initAuth() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    user.set(data.session.user);
    await loadProfile(data.session.user.id);
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      user.set(session.user);
      await loadProfile(session.user.id);
    } else {
      user.set(null);
      profile.set(null);
    }
  });
}

async function loadProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (data) profile.set(data);
}
