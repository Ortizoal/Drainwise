<script>
  import { user } from '$lib/stores/auth';
  import { supabase } from '$lib/client/supabase';
  import { queueReport, isOnline } from '$lib/stores/offline';
  import { compressImage } from '$lib/utils/compress';
  import { isValidGhanaCoord } from '$lib/utils/geo';
  import { goto } from '$app/navigation';

  let description = '';
  let drainCategory = 'roadside';
  let severity = 'moderate';
  let lat = '';
  let lng = '';
  let imageFile = null;
  let imagePreview = null;
  let submitting = false;
  let locationStatus = 'idle';
  let error = '';
  let success = false;

  async function detectLocation() {
    locationStatus = 'detecting';
    error = '';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude.toFixed(7);
        lng = pos.coords.longitude.toFixed(7);
        locationStatus = 'locked';
      },
      () => {
        locationStatus = 'manual';
        error = 'Could not detect location. Enter coordinates manually or use the map.';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      error = 'Image too large. Max 10MB.';
      return;
    }
    imageFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => (imagePreview = ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    error = '';
    submitting = true;

    if (!description.trim()) {
      error = 'Please describe the issue.';
      submitting = false;
      return;
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!latNum || !lngNum || !isValidGhanaCoord(latNum, lngNum)) {
      error = 'Invalid GPS coordinates. Must be within Ghana.';
      submitting = false;
      return;
    }

    let imageUrls = [];
    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const path = `reports/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(path, compressed);
      if (!uploadError) imageUrls = [path];
    }

    const report = {
      user_id: $user?.id,
      lat: latNum,
      lng: lngNum,
      description: description.trim(),
      drain_category: drainCategory,
      severity,
      image_urls: imageUrls
    };

    if ($isOnline && $user) {
      const { error: submitError } = await supabase.from('reports').insert(report);
      if (submitError) {
        error = submitError.message;
        submitting = false;
        return;
      }
      success = true;
      setTimeout(() => goto('/'), 1500);
    } else {
      await queueReport(report);
      success = true;
      setTimeout(() => goto('/'), 1500);
    }

    submitting = false;
  }
</script>

<div class="space-y-4">
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
  {/if}
  {#if success}
    <div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
      {#if $isOnline && $user}
        Report submitted successfully!
      {:else}
        Report saved offline. It will sync when you are back online.
      {/if}
    </div>
  {/if}

  {#if !success}
    {#if !$user}
      <div class="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3">
        You are not signed in. Reports submitted offline will sync after you sign in.
      </div>
    {/if}

    <div>
      <label for="lat" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
      {#if locationStatus === 'idle'}
        <button
          on:click={detectLocation}
          class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-500 transition"
        >
          📍 Detect My Location
        </button>
      {:else if locationStatus === 'detecting'}
        <p class="text-sm text-gray-500">Detecting location...</p>
      {:else if locationStatus === 'locked'}
        <p class="text-sm text-emerald-600">✅ Location locked: {lat}, {lng}</p>
        <button
          on:click={() => (locationStatus = 'manual')}
          class="text-xs text-gray-500 hover:text-gray-700 underline mt-1"
        >
          Edit manually
        </button>
      {/if}
      {#if locationStatus === 'manual'}
        <div class="grid grid-cols-2 gap-2">
          <input id="lat" bind:value={lat} placeholder="Latitude" type="number" step="any"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          <input id="lng" bind:value={lng} placeholder="Longitude" type="number" step="any"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
        </div>
      {/if}
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        id="description"
        bind:value={description}
        rows="3"
        maxlength="500"
        placeholder="Describe the drainage issue..."
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
      ></textarea>
      <p class="text-xs text-gray-400 mt-1">{description.length}/500</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="drain-category" class="block text-sm font-medium text-gray-700 mb-1">Drain Category</label>
        <select id="drain-category" bind:value={drainCategory}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
          <option value="roadside">Roadside</option>
          <option value="residential">Residential</option>
          <option value="market">Market</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label for="severity" class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
        <select id="severity" bind:value={severity}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
          <option value="minor">Minor</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div>
      <label for="photo" class="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
      <input id="photo" type="file" accept="image/*" capture="environment" on:change={handleImage}
        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
      {#if imagePreview}
        <img src={imagePreview} alt="Preview" class="mt-2 w-32 h-32 object-cover rounded-lg" />
      {/if}
    </div>

    <button
      on:click={handleSubmit}
      disabled={submitting}
      class="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {submitting ? 'Submitting...' : $isOnline ? 'Submit Report' : 'Save Offline'}
    </button>
  {/if}
</div>
