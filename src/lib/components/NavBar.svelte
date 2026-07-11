<script>
  import { page } from '$app/stores';
  import { user, profile, isAdmin } from '$lib/stores/auth';
  import { supabase } from '$lib/client/supabase';
</script>

<nav class="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center justify-between h-14">
      <a href="/" class="flex items-center gap-2 font-bold text-lg">
        <span>DrainWise</span>
      </a>
      <div class="flex items-center gap-4 text-sm">
        <a href="/" class="hover:text-emerald-200 transition">Map</a>
      </div>
    </div>
  </div>
</nav>
