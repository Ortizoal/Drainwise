<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/client/supabase';
  import { reports, fetchReports, subscribeToReports } from '$lib/stores/reports';
  import ReportMap from '$lib/components/ReportMap.svelte';

  let stats = { total: 0, critical: 0, resolved: 0, avgUpvotes: 0 };
  let unsubscribe;

  function computeStats() {
    const r = $reports;
    stats = {
      total: r.length,
      critical: r.filter((x) => x.severity === 'critical').length,
      resolved: r.filter((x) => x.status === 'resolved').length,
      avgUpvotes: r.length ? Math.round(r.reduce((a, b) => a + (b.upvotes || 0), 0) / r.length) : 0
    };
  }

  onMount(async () => {
    await fetchReports();
    unsubscribe = subscribeToReports();
  });

  onMount(() => () => unsubscribe?.());

  $: computeStats();
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-gray-900">{stats.total}</p>
    <p class="text-xs text-gray-500 mt-1">Total Reports</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-red-600">{stats.critical}</p>
    <p class="text-xs text-gray-500 mt-1">Critical</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-green-600">{stats.resolved}</p>
    <p class="text-xs text-gray-500 mt-1">Resolved</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-gray-900">{stats.avgUpvotes}</p>
    <p class="text-xs text-gray-500 mt-1">Avg Upvotes</p>
  </div>
</div>

<div class="h-[250px] rounded-xl overflow-hidden border border-gray-200 mb-6">
  <ReportMap reports={$reports} />
</div>

<div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
  <h2 class="font-semibold text-gray-900 mb-3">Recent Reports</h2>
  <div class="space-y-2">
    {#each $reports.slice(0, 5) as report (report.id)}
      <div class="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
        <span class="truncate max-w-[250px] text-gray-700">{report.description}</span>
        <span class="text-xs text-gray-400">{report.severity} / {report.status}</span>
      </div>
    {/each}
  </div>
</div>
