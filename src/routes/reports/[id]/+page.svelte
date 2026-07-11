<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/client/supabase';
  import { PUBLIC_SUPABASE_URL } from '$env/static/public';
  import { upvoteReport } from '$lib/stores/reports';
  import { formatDate, severityColor, severityLabel, statusBadge, statusLabel, drainCategoryIcon } from '$lib/utils/format';
  import ReportMap from '$lib/components/ReportMap.svelte';

  let report;
  let loading = true;
  let error = '';
  let upvoting = false;

  async function loadReport() {
    loading = true;
    const { data, error: err } = await supabase
      .from('reports')
      .select('*')
      .eq('id', $page.params.id)
      .single();
    if (err) error = err.message;
    else report = data;
    loading = false;
  }

  async function handleUpvote() {
    if (upvoting || !report) return;
    upvoting = true;
    await upvoteReport(report.id);
    report.upvotes++;
    upvoting = false;
  }

  onMount(() => {
    loadReport();
  });
</script>

{#if loading}
  <p class="text-center text-gray-400 py-12">Loading...</p>
{:else if error}
  <p class="text-center text-red-500 py-12">{error}</p>
{:else if report}
  <div class="max-w-lg mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-900">Report Details</h1>
      <span class="text-xs text-gray-400">{formatDate(report.created_at)}</span>
    </div>

    <div class="h-[200px] mb-4 rounded-xl overflow-hidden border border-gray-200">
      <ReportMap reports={[report]} interactive={false} />
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {severityColor(report.severity)}">
          {severityLabel(report.severity)}
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {statusBadge(report.status)}">
          {statusLabel(report.status)}
        </span>
      </div>

      <p class="text-gray-800">{report.description}</p>

      <div class="flex items-center gap-3 text-sm text-gray-500">
        <span>{drainCategoryIcon(report.drain_category)} {report.drain_category}</span>
        <span>📍 {report.lat}, {report.lng}</span>
      </div>

      {#if report.image_urls?.length}
        <div class="grid grid-cols-2 gap-2">
          {#each report.image_urls as url}
            <img
            src={`${PUBLIC_SUPABASE_URL}/storage/v1/object/public/report-images/${url}`}
            alt=""
            class="rounded-lg w-full h-32 object-cover"
          />
          {/each}
        </div>
      {/if}

      <button
        on:click={handleUpvote}
        disabled={upvoting}
        class="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition mt-2"
      >
        <span class="text-lg">▲</span>
        <span class="font-medium">{report.upvotes || 0} upvotes</span>
      </button>
    </div>

    <a href="/" class="block text-center text-sm text-emerald-600 hover:text-emerald-700 mt-4">
      ← Back to map
    </a>
  </div>
{/if}
