import { writable } from 'svelte/store';
import { supabase } from '$lib/client/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const reports = writable<any[]>([]);
export const loading = writable(true);

export async function fetchReports() {
  loading.set(true);
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (data) reports.set(data);
  loading.set(false);
  return { data, error };
}

export function subscribeToReports() {
  const channel = supabase
    .channel('reports-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'reports' },
      (payload: RealtimePostgresChangesPayload<any>) => {
        reports.update((current) => {
          if (payload.eventType === 'INSERT') {
            return [payload.new, ...current];
          }
          if (payload.eventType === 'UPDATE') {
            return current.map((r) =>
              r.id === payload.new.id ? { ...r, ...payload.new } : r
            );
          }
          if (payload.eventType === 'DELETE') {
            return current.filter((r) => r.id !== payload.old.id);
          }
          return current;
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function upvoteReport(reportId: string) {
  const { data: current } = await supabase
    .from('reports')
    .select('upvotes')
    .eq('id', reportId)
    .single();
  if (current) {
    await supabase
      .from('reports')
      .update({ upvotes: current.upvotes + 1 })
      .eq('id', reportId);
  }
}
