<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { ACCRA_CENTER, DEFAULT_ZOOM } from '$lib/utils/geo';

  let mapContainer;
  let map;
  let markers = [];

  export let reports = [];
  export let interactive = true;
  export function setView(lat, lng, zoom) {
    if (map) map.setView([lat, lng], zoom || DEFAULT_ZOOM);
  }

  function createIcon(severity, isSelected = false) {
    const colors = {
      critical: '#dc2626',
      severe: '#f97316',
      moderate: '#eab308',
      minor: '#22c55e'
    };
    const color = colors[severity] || '#6b7280';
    const size = isSelected ? 22 : 16;
    const border = isSelected ? '4px solid #000' : '3px solid white';
    return L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:0 2px 6px rgba(0,0,0,0.3);transition:all 0.2s"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  function severityForPopup(s) {
    const map = { critical: '🔴 Critical', severe: '🟠 Severe', moderate: '🟡 Moderate', minor: '🟢 Minor' };
    return map[s] || s;
  }

  function statusForPopup(s) {
    const map = { submitted: 'Submitted', verified: 'Verified', in_progress: 'In Progress', resolved: 'Resolved' };
    return map[s] || s;
  }

  $: {
    if (map && reports) {
      markers.forEach((m) => map.removeLayer(m));
      markers = [];
      reports.forEach((r) => {
        const marker = L.marker([r.lat, r.lng], { icon: createIcon(r.severity) })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;font-size:13px;max-width:260px">
              <strong>${severityForPopup(r.severity)}</strong>
              <span style="float:right;font-size:11px;color:#666">${statusForPopup(r.status)}</span>
              <p style="margin:6px 0">${r.description}</p>
              <small style="color:#999">
                ${r.upvotes || 0} upvotes &middot;
                ${new Date(r.created_at).toLocaleDateString('en-GH', { day:'numeric', month:'short' })}
              </small>
            </div>
          `);
        markers.push(marker);
      });
    }
  }

  onMount(() => {
    map = L.map(mapContainer, {
      center: ACCRA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    if (navigator.geolocation && interactive) {
      L.control.locate({ position: 'bottomright', strings: { title: 'Show my location' } }).addTo(map);
    }
  });

  onDestroy(() => {
    if (map) {
      markers.forEach((m) => map.removeLayer(m));
      map.remove();
      map = null;
    }
  });
</script>

<div bind:this={mapContainer} class="w-full h-full min-h-[300px] rounded-lg"></div>
