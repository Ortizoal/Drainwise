<script>
  import { severityColor, severityLabel } from '$lib/utils/format';
  export let severity;
</script>

<span
  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {severityColor(severity)}"
>
  {severityLabel(severity)}
</span>
