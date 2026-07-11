<script>
  import { formatDate, statusBadge, statusLabel, drainCategoryIcon } from '$lib/utils/format';
  import SeverityBadge from './SeverityBadge.svelte';
  import { upvoteReport } from '$lib/stores/reports';

  export let report;

  let upvoting = false;
  async function handleUpvote() {
    if (upvoting) return;
    upvoting = true;
    await upvoteReport(report.id);
    report.upvotes = (report.upvotes || 0) + 1;
    upvoting = false;
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
  <div class="flex items-start justify-between mb-2">
    <SeverityBadge severity={report.severity} />
    <span class="text-xs text-gray-400">{formatDate(report.created_at)}</span>
  </div>

  <p class="text-sm text-gray-800 mb-3 line-clamp-2">{report.description}</p>

  <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
    <span>{drainCategoryIcon(report.drain_category)} {report.drain_category}</span>
    <span class="text-gray-300">|</span>
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded {statusBadge(report.status)}">
      {statusLabel(report.status)}
    </span>
  </div>

  <div class="flex items-center justify-between">
    <button
      on:click={handleUpvote}
      disabled={upvoting}
      class="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-600 transition"
    >
      <span>▲</span>
      <span>{report.upvotes || 0}</span>
    </button>

    <a
      href="/reports/{report.id}"
      class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
    >
      View details →
    </a>
  </div>
</div>
