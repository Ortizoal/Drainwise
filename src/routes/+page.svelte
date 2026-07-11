<script>
  import { onMount } from 'svelte';
  import { reports, fetchReports, subscribeToReports } from '$lib/stores/reports';
  import ReportMap from '$lib/components/ReportMap.svelte';
  import ReportCard from '$lib/components/ReportCard.svelte';

  let unsubscribe;

  onMount(async () => {
    await fetchReports();
    unsubscribe = subscribeToReports();
  });

  onMount(() => {
    return () => unsubscribe?.();
  });
</script>

<div class="mb-6">
  <h1 class="text-xl font-bold text-gray-900">Drainage Reports</h1>
  <p class="text-sm text-gray-500 mt-1">Click a marker or browse reports below.</p>
</div>

<div class="h-[350px] mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
  <ReportMap reports={$reports} />
</div>

<div class="grid gap-3 md:grid-cols-2">
  {#each $reports as report (report.id)}
    <ReportCard {report} />
  {:else}
    <p class="col-span-full text-center text-gray-400 py-8">No reports yet. Be the first to report!</p>
  {/each}
</div>
