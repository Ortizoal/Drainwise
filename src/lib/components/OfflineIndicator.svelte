<script>
  import { onMount, onDestroy } from 'svelte';
  import { isOnline, queuedCount, syncQueuedReports } from '$lib/stores/offline';
  import { supabase } from '$lib/client/supabase';

  let prevOnline = true;

  onMount(() => {
    isOnline.set(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onDestroy(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  async function handleOnline() {
    isOnline.set(true);
    await syncQueuedReports(supabase);
  }

  function handleOffline() {
    isOnline.set(false);
  }
</script>

{#if !$isOnline}
  <div class="bg-amber-500 text-white text-xs text-center py-1.5 px-4 font-medium">
    You are offline. Reports will be saved and submitted when you reconnect.
    {#if $queuedCount > 0}
      ({$queuedCount} pending)
    {/if}
  </div>
{/if}
