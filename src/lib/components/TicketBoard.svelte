<script>
  import { supabase } from '$lib/client/supabase';
  import { statusLabel } from '$lib/utils/format';

  export let tickets = [];
  export let reports = [];
  let newNotes = {};

  function findReport(ticketId) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return null;
    return reports.find((r) => r.id === ticket.report_id);
  }

  async function updateStatus(ticketId, status) {
    await supabase.from('tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', ticketId);
    tickets = tickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
  }

  async function addNotes(ticketId) {
    if (!newNotes[ticketId]?.trim()) return;
    await supabase.from('tickets').update({ notes: newNotes[ticketId], updated_at: new Date().toISOString() }).eq('id', ticketId);
    tickets = tickets.map((t) =>
      t.id === ticketId ? { ...t, notes: newNotes[ticketId] } : t
    );
    newNotes[ticketId] = '';
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full text-sm">
    <thead>
      <tr class="text-left border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
        <th class="pb-2 pr-4">Report</th>
        <th class="pb-2 pr-4">Status</th>
        <th class="pb-2 pr-4">Assigned To</th>
        <th class="pb-2 pr-4">Notes</th>
        <th class="pb-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each tickets as ticket (ticket.id)}
        {@const report = findReport(ticket.id)}
        <tr class="border-b border-gray-100">
          <td class="py-3 pr-4 max-w-[200px]">
            <p class="font-medium text-gray-800 truncate">{report?.description || 'Unknown report'}</p>
            <p class="text-xs text-gray-400">{report?.severity} &middot; {report?.drain_category}</p>
          </td>
          <td class="py-3 pr-4">
            <select
              value={ticket.status}
              on:change={(e) => updateStatus(ticket.id, e.target.value)}
              class="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="closed">Closed</option>
            </select>
          </td>
          <td class="py-3 pr-4 text-gray-600">{ticket.assigned_to || '—'}</td>
          <td class="py-3 pr-4 max-w-[150px]">
            {#if ticket.notes}
              <p class="text-gray-600 text-xs truncate">{ticket.notes}</p>
            {/if}
            <div class="flex gap-1 mt-1">
              <input
                bind:value={newNotes[ticket.id]}
                placeholder="Add note..."
                class="w-20 text-xs border border-gray-300 rounded px-1 py-0.5"
              />
              <button
                on:click={() => addNotes(ticket.id)}
                class="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Add
              </button>
            </div>
          </td>
          <td class="py-3">
            <a
              href="/reports/{ticket.report_id}"
              class="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View →
            </a>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" class="py-8 text-center text-gray-400 text-sm">
            No tickets yet. Reports are automatically routed to their district.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
