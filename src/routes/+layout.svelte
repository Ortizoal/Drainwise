<script>
  import { onMount } from 'svelte';
  import { initAuth } from '$lib/stores/auth';
  import '../app.css';
  import NavBar from '$lib/components/NavBar.svelte';

  onMount(() => initAuth());
</script>

<NavBar />
<main class="max-w-4xl mx-auto px-4 py-6">
  <slot />
</main>
