<script>
  import { supabase } from '$lib/client/supabase';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let loading = false;
  let error = '';
  let sent = false;

  async function sendMagicLink() {
    error = '';
    loading = true;
    if (!email.trim() || !email.includes('@')) {
      error = 'Enter a valid email address.';
      loading = false;
      return;
    }
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim()
    });
    if (err) {
      error = err.message;
    } else {
      sent = true;
    }
    loading = false;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  $: if ($user) goto('/');
</script>

<div class="max-w-sm mx-auto mt-12">
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold text-gray-900">Sign In</h1>
    <p class="text-sm text-gray-500 mt-1">
      {sent ? 'Check your inbox for the magic link.' : 'Enter your email to receive a magic link.'}
    </p>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
  {/if}

  {#if sent}
    <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-4 mb-4">
      Magic link sent to <strong>{email}</strong>. Click it to sign in.
    </div>
    <button
      on:click={() => { sent = false; email = ''; }}
      class="w-full text-sm text-gray-500 hover:text-gray-700"
    >
      ← Use a different email
    </button>
  {:else}
    <input
      bind:value={email}
      placeholder="you@example.com"
      type="email"
      class="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none mb-4"
    />
    <button
      on:click={sendMagicLink}
      disabled={loading || !email.trim()}
      class="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
    >
      {loading ? 'Sending...' : 'Send Magic Link'}
    </button>
  {/if}
</div>
