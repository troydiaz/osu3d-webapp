<script lang="ts">
	import { page } from "$app/stores";
	import SidebarTooltip from "./SidebarTooltip.svelte";

  export let name: string;
  export let url: string;
  export let image: string;

  $: console.log($page.url.pathname);
</script>

{#key $page.url.pathname}
  <SidebarTooltip activeRoute={$page.url.pathname.startsWith(url)}>
    <li>
      <a href={url} class="group flex-row justify-center items-center bg-gradient-to-b  hover:rounded-r-none outline outline-1 outline-base-content/5 {$page.url.pathname.startsWith(url) ? 'from-blue-300 to-blue-400 dark:from-blue-500 dark:to-blue-600' : 'hover:from-blue-300 hover:to-blue-400 hover:dark:from-blue-500 hover:dark:to-blue-600'}">
        <img src={image} class="w-10 h-10 parent opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow shadow-black transition-all duration-500 ease-in-out {$page.url.pathname.startsWith(url) ? 'opacity-100 scale-110' : 'opacity-50'}" />
      </a>
    </li>
    <div slot="text" class="flex flex-col justify-center items-center h-full">{ name }</div>
  </SidebarTooltip>
  
{/key}

