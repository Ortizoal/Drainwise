<script>
  import { page } from '$app/stores';
  import { dev } from '$app/environment';
</script>

<div class="max-w-2xl mx-auto px-4 py-12">
  <h1 class="text-2xl font-bold text-gray-900 mb-4">
    {$page.status}
  </h1>
  <p class="text-gray-600 mb-6">{$page.error?.message}</p>
  {#if dev && $page.error?.stack}
    <pre class="text-xs bg-red-50 p-4 rounded-lg overflow-auto max-h-96">{$page.error.stack}</pre>
  {/if}
  <a href="/" class="inline-block mt-6 text-emerald-600 hover:underline">Go home</a>
</div>
