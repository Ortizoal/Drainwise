<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../app.css';

  onMount(() => {});
</script>

<main class="max-w-4xl mx-auto px-4 py-6">
  <slot />
</main>
