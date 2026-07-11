<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/client/supabase';
  import { fetchReports, reports, subscribeToReports } from '$lib/stores/reports';
  import ReportCard from '$lib/components/ReportCard.svelte';
  import TicketBoard from '$lib/components/TicketBoard.svelte';

  let tickets = [];
  let view = 'cards';
  let unsubscribe;

  async function loadTickets() {
    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (data) tickets = data;
  }

  onMount(async () => {
    await fetchReports();
    await loadTickets();
    unsubscribe = subscribeToReports();
  });

  onMount(() => () => unsubscribe?.());

  let filterStatus = '';
  let filterSeverity = '';

  $: filtered = $reports.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterSeverity && r.severity !== filterSeverity) return false;
    return true;
  });
</script>

<div class="flex items-center gap-2 mb-4">
  <button
    on:click={() => (view = 'cards')}
    class="text-sm px-3 py-1.5 rounded-lg {view === 'cards' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}"
  >
    Cards
  </button>
  <button
    on:click={() => (view = 'tickets')}
    class="text-sm px-3 py-1.5 rounded-lg {view === 'tickets' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}"
  >
    Tickets ({tickets.length})
  </button>

  {#if view === 'cards'}
    <select bind:value={filterStatus} class="ml-auto text-xs border border-gray-300 rounded-lg px-2 py-1.5">
      <option value="">All Status</option>
      <option value="submitted">Submitted</option>
      <option value="verified">Verified</option>
      <option value="in_progress">In Progress</option>
      <option value="resolved">Resolved</option>
    </select>
    <select bind:value={filterSeverity} class="text-xs border border-gray-300 rounded-lg px-2 py-1.5">
      <option value="">All Severity</option>
      <option value="critical">Critical</option>
      <option value="severe">Severe</option>
      <option value="moderate">Moderate</option>
      <option value="minor">Minor</option>
    </select>
  {/if}
</div>

{#if view === 'cards'}
  <div class="grid gap-3 md:grid-cols-2">
    {#each filtered as report (report.id)}
      <ReportCard {report} />
    {/each}
  </div>
{:else}
  <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <TicketBoard {tickets} reports={$reports} />
  </div>
{/if}
