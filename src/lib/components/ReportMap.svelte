<script>
  import { onMount, onDestroy } from 'svelte';
  import { ACCRA_CENTER, DEFAULT_ZOOM } from '$lib/utils/geo';

  let mapContainer;
  let map;
  let markers = [];
  let L;

  export let reports = [];
  export let interactive = true;
  export function setView(lat, lng, zoom) {
    if (map) map.setView([lat, lng], zoom || DEFAULT_ZOOM);
  }

  function createIcon(severity) {
    const colors = {
      critical: '#dc2626', severe: '#f97316',
      moderate: '#eab308', minor: '#22c55e'
    };
    const color = colors[severity] || '#6b7280';
    return L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8]
    });
  }

  function updateMarkers() {
    if (!map || !reports) return;
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    reports.forEach((r) => {
      const marker = L.marker([r.lat, r.lng], { icon: createIcon(r.severity) })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;font-size:13px;max-width:260px">
            <strong>${r.severity}</strong>
            <p style="margin:6px 0">${r.description}</p>
            <small style="color:#999">${r.upvotes || 0} upvotes</small>
          </div>
        `);
      markers.push(marker);
    });
  }

  onMount(async () => {
    L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

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

    if (reports) updateMarkers();
  });

  onDestroy(() => {
    if (map) {
      markers.forEach((m) => map.removeLayer(m));
      map.remove();
      map = null;
    }
  });

  $: if (L && map && reports) updateMarkers();
</script>

<div bind:this={mapContainer} class="w-full h-full min-h-[300px] rounded-lg"></div>
