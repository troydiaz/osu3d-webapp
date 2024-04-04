<script lang="ts">
	import { page } from "$app/stores";

  export let name: string;
  export let url: string;
  export let disabled = false;
</script>

<div class="relative group transition">
  <a href={url} class="btn btn-ghost { disabled ? 'btn-disabled' : '' } flex justify-start items-center gap-4 p-3 {$page.url.pathname.startsWith(url) ? 'btn-active' : ''}">
    <slot name="icon" />
    <div class="font-semibold">{ name }</div>
  </a>
</div>