<script lang="ts">
  import { page } from "$app/stores";
	import { MagnifyingGlass } from "svelte-heros-v2";
</script>

<div class="flex flex-col justify-center items-center gap-12 lg:mt-24 w-full h-full">
  <div class="text-9xl font-thin animate-pulse">{$page.status}</div>
  <div class="text-4xl font-mono">{$page.error?.message}</div>
</div>