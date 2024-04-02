<script lang="ts">
  import { goto } from "$app/navigation";
	import { page } from "$app/stores";

  export let name: string;
  export let url: string;
</script>

<div class="relative rounded-lg group transition active:bg-base-content/20 active:scale-[98%] {$page.url.pathname.startsWith(url) ? 'bg-base-content/10' : 'hover:bg-base-content/10'}">
  <a href={url} class="w-full h-full flex flex-row justify-start items-center transition gap-4 p-3 {$page.url.pathname.startsWith(url) ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}">
    <slot name="icon" />
    <div class="font-semibold">{ name }</div>
  </a>
</div>