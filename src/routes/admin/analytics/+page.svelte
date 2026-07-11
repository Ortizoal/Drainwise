<script>
  import { onMount } from 'svelte';
  import { fetchReports, reports, subscribeToReports } from '$lib/stores/reports';

  let unsubscribe;

  $: severityCounts = {
    critical: $reports.filter((r) => r.severity === 'critical').length,
    severe: $reports.filter((r) => r.severity === 'severe').length,
    moderate: $reports.filter((r) => r.severity === 'moderate').length,
    minor: $reports.filter((r) => r.severity === 'minor').length
  };

  $: statusCounts = {
    submitted: $reports.filter((r) => r.status === 'submitted').length,
    verified: $reports.filter((r) => r.status === 'verified').length,
    in_progress: $reports.filter((r) => r.status === 'in_progress').length,
    resolved: $reports.filter((r) => r.status === 'resolved').length
  };

  $: categoryCounts = {};
  $: {
    const counts = {};
    $reports.forEach((r) => {
      counts[r.drain_category] = (counts[r.drain_category] || 0) + 1;
    });
    categoryCounts = counts;
  }

  $: total = $reports.length;
  $: resolutionRate = total ? Math.round((statusCounts.resolved / total) * 100) : 0;

  onMount(async () => {
    await fetchReports();
    unsubscribe = subscribeToReports();
  });

  onMount(() => () => unsubscribe?.());

  function severityPct(key) {
    return total ? Math.round((severityCounts[key] / total) * 100) : 0;
  }
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-gray-900">{total}</p>
    <p class="text-xs text-gray-500 mt-1">Total</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-emerald-600">{resolutionRate}%</p>
    <p class="text-xs text-gray-500 mt-1">Resolution Rate</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-red-600">{severityCounts.critical + severityCounts.severe}</p>
    <p class="text-xs text-gray-500 mt-1">Urgent (Critical + Severe)</p>
  </div>
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p class="text-2xl font-bold text-blue-600">{statusCounts.submitted + statusCounts.verified}</p>
    <p class="text-xs text-gray-500 mt-1">Unresolved</p>
  </div>
</div>

<div class="grid md:grid-cols-2 gap-4 mb-6">
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <h2 class="font-semibold text-gray-900 mb-3">By Severity</h2>
    <div class="space-y-2">
      {#each ['critical', 'severe', 'moderate', 'minor'] as key}
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="capitalize text-gray-600">{key}</span>
            <span class="text-gray-800 font-medium">{severityCounts[key]} ({severityPct(key)}%)</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              class:bg-red-500={key === 'critical'}
              class:bg-orange-500={key === 'severe'}
              class:bg-yellow-500={key === 'moderate'}
              class:bg-green-500={key === 'minor'}
              style="width: {severityPct(key)}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <h2 class="font-semibold text-gray-900 mb-3">By Status</h2>
    <div class="space-y-2">
      {#each ['submitted', 'verified', 'in_progress', 'resolved'] as key}
        {@const pct = total ? Math.round((statusCounts[key] / total) * 100) : 0}
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="capitalize text-gray-600">{key.replace('_', ' ')}</span>
            <span class="text-gray-800 font-medium">{statusCounts[key]} ({pct}%)</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              class:bg-blue-500={key === 'submitted'}
              class:bg-purple-500={key === 'verified'}
              class:bg-yellow-500={key === 'in_progress'}
              class:bg-green-500={key === 'resolved'}
              style="width: {pct}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
  <h2 class="font-semibold text-gray-900 mb-3">By Drain Category</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    {#each Object.entries(categoryCounts) as [category, count]}
      {@const pct = total ? Math.round((count / total) * 100) : 0}
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <p class="text-lg font-bold text-gray-800">{count}</p>
        <p class="text-xs text-gray-500 capitalize">{category}</p>
        <p class="text-xs text-gray-400">{pct}%</p>
      </div>
    {/each}
  </div>
</div>
