<script>
  import { onMount } from 'svelte';
  import { isAdmin, user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  onMount(() => {
    const unsub = isAdmin.subscribe((val) => {
      if (val === false) goto('/auth');
    });
    return unsub;
  });
</script>

<div class="max-w-5xl mx-auto">
  <div class="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
    <h1 class="text-lg font-bold text-gray-900">Admin Dashboard</h1>
    <nav class="flex gap-4 text-sm ml-auto">
      <a href="/admin" class="text-gray-500 hover:text-gray-700">Overview</a>
      <a href="/admin/reports" class="text-gray-500 hover:text-gray-700">Reports</a>
      <a href="/admin/analytics" class="text-gray-500 hover:text-gray-700">Analytics</a>
    </nav>
  </div>
  <slot />
</div>
