<script lang="ts">
	import { page } from "$app/stores";
	import SidebarTooltip from "./SidebarTooltip.svelte";

  export let name: string;
  export let url: string;
  export let image: string;
</script>

<div class="relative hover:drop-shadow-md shadow-black">
  <SidebarTooltip activeRoute={$page.url.pathname.startsWith(url)}>
    <li class="group border border-base-content/5 hover:border-transparent rounded-md transition-all duration-1000 ease-in-out">
      <a href={url} class="h-[58px] p-0 py-1 flex-row justify-center rounded-md group-hover:rounded-r-none items-center bg-gradient-to-b transition-colors duration-100 {$page.url.pathname.startsWith(url) ? 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500' : 'group-hover:from-blue-300 group-hover:to-blue-400 group-hover:dark:from-blue-400 group-hover:dark:to-blue-500'}">
        <img src={image} alt="Sidebar button" class="w-12 h-12 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out {$page.url.pathname.startsWith(url) ? 'drop-shadow rotate-3 opacity-100 scale-110' : 'opacity-50'}" />
      </a>
    </li>
    <div slot="text" class="flex flex-col justify-center items-center h-full drop-shadow-lg shadow-black">{ name }</div>
  </SidebarTooltip>
</div>

