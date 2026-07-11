<script>
  import { page } from '$app/stores';
  import { user, profile, isAdmin } from '$lib/stores/auth';
  import { supabase } from '$lib/client/supabase';
  import OfflineIndicator from './OfflineIndicator.svelte';

  let menuOpen = false;

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function isActive(path) {
    return $page.url.pathname.startsWith(path);
  }
</script>

<nav class="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center justify-between h-14">
      <a href="/" class="flex items-center gap-2 font-bold text-lg">
        <span class="text-2xl">🌊</span>
        <span>DrainWise</span>
      </a>

      <div class="hidden md:flex items-center gap-4 text-sm">
        <a href="/" class="hover:text-emerald-200 transition {isActive('/') && !isActive('/admin') ? 'text-emerald-200 underline' : ''}">
          Map
        </a>
        <a href="/report" class="hover:text-emerald-200 transition {isActive('/report') ? 'text-emerald-200 underline' : ''}">
          Report
        </a>
        {#if $isAdmin}
          <a href="/admin" class="hover:text-emerald-200 transition {isActive('/admin') ? 'text-emerald-200 underline' : ''}">
            Admin
          </a>
        {/if}
        {#if $user}
          <button on:click={handleSignOut} class="text-emerald-200 hover:text-white text-xs">
            Sign Out
          </button>
        {:else}
          <a href="/auth" class="bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-500 text-xs font-medium">
            Sign In
          </a>
        {/if}
      </div>

      <button class="md:hidden text-2xl" on:click={() => (menuOpen = !menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
    </div>
  </div>

  {#if menuOpen}
    <div class="md:hidden border-t border-emerald-600 bg-emerald-800">
      <div class="flex flex-col px-4 py-3 gap-3 text-sm">
        <a href="/" on:click={() => (menuOpen = false)}>Map</a>
        <a href="/report" on:click={() => (menuOpen = false)}>Report</a>
        {#if $isAdmin}
          <a href="/admin" on:click={() => (menuOpen = false)}>Admin</a>
        {/if}
        {#if $user}
          <button on:click={handleSignOut} class="text-left text-emerald-300">Sign Out</button>
        {:else}
          <a href="/auth" on:click={() => (menuOpen = false)}>Sign In</a>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<OfflineIndicator />
