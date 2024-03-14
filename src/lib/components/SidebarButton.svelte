<script lang="ts">
	import { page } from "$app/stores";
	import SidebarTooltip from "./SidebarTooltip.svelte";

  export let name: string;
  export let url: string;
  export let image: string;
</script>

<div class="relative">
  <SidebarTooltip activeRoute={$page.url.pathname.startsWith(url)}>
    <li class="group h-14 w-full">
      <!-- Background div for the hover effect -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b rounded-md transition-none from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500 {$page.url.pathname.startsWith(url) ? 'opacity-100 group-hover:rounded-r-none' : 'group-hover:opacity-100 opacity-0 rounded-r-none'}"></div>
      
      <a href={url} class="p-0 py-1 flex-row justify-center items-center">
        <img src={image} alt="Sidebar button" class="w-12 h-12 group-hover:opacity-100 group-hover:scale-110 transition ease-in-out duration-300 {$page.url.pathname.startsWith(url) ? 'drop-shadow opacity-100 scale-105' : 'opacity-75'}" />
      </a>
    </li>
    <div slot="text" class="flex flex-col justify-center items-center h-full drop-shadow-lg shadow-black">{ name }</div>
  </SidebarTooltip>
</div>