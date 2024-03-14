<script lang="ts">
  import type { ITreeItem } from "$lib/helpers";
  import type { InventoryLocation } from "$lib/types/models";
  import { MagnifyingGlass, Pencil, Plus, Trash } from "svelte-heros-v2";

  export let node: ITreeItem<InventoryLocation>;
</script>

{#if node.children.length > 0}
  <li>
    <details open>
      <summary class="group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
        { node.name }
        <div class="opacity-0 group-hover:opacity-100 transition-all">
          <button class="btn btn-square btn-sm btn-ghost text-info"><Plus /></button>
          <button class="btn btn-square btn-sm btn-ghost text-info"><MagnifyingGlass /></button>
          <button class="btn btn-square btn-sm btn-ghost text-error"><Trash /></button>
        </div>
      </summary>
      <ul>
        {#each node.children as child}
          <svelte:self node={child} />
        {/each}
      </ul>
    </details>
  </li>
{:else}
  <li><div class="flex justify-between group">
    <div class="flex gap-2 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
      { node.name }
    </div>
    <div class="opacity-0 group-hover:opacity-100 transition-opacity">
      <button class="btn btn-square btn-sm"><Plus /></button>
      <button class="btn btn-square btn-sm"><MagnifyingGlass /></button>
      <button class="btn btn-square btn-sm hover:btn-error"><Trash /></button>
    </div>
  </div></li>
{/if}