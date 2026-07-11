import { writable } from 'svelte/store';

const DB_NAME = 'drainwise-offline';
const STORE_NAME = 'pending-reports';

export const queuedCount = writable(0);
export const isOnline = writable(true);

const browser = typeof window !== 'undefined';

async function getDB() {
  if (!browser) return null;
  const { openDB } = await import('idb');
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'offline_id' });
      }
    }
  });
}

export async function queueReport(report: any) {
  const db = await getDB();
  if (!db) return null;
  const entry = {
    ...report,
    offline_id: crypto.randomUUID(),
    status: 'queued',
    created_at: new Date().toISOString()
  };
  await db.add(STORE_NAME, entry);
  await updateCount();
  return entry.offline_id;
}

export async function getQueuedReports() {
  const db = await getDB();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

export async function removeQueuedReport(offlineId: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete(STORE_NAME, offlineId);
  await updateCount();
}

async function updateCount() {
  const db = await getDB();
  if (!db) return;
  const all = await db.getAllKeys(STORE_NAME);
  queuedCount.set(all.length);
}

export async function syncQueuedReports(supabase: any) {
  const reports = await getQueuedReports();
  for (const report of reports) {
    const { offline_id, ...payload } = report;
    const { error } = await supabase.from('reports').insert(payload);
    if (!error) {
      await removeQueuedReport(report.offline_id);
    }
  }
}
