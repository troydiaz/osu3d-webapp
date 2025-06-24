<script lang="ts">
	import { goto } from "$app/navigation";
	import { totalAllChanges, type InventoryItem, getMostRecentChangeDateName, type InventoryCategory } from "$lib/types/models";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { Minus, Plus } from "svelte-heros-v2";
  import { Pencil }    from "svelte-heros-v2";
	import NewChangeMenu from "../menu/NewChangeMenu.svelte";
  import { Trash } from "svelte-heros-v2";

  export let inventory: InventoryItem[] = [];
  export let title: string = 'Untitled';

  let editingId: string | null = null;
  let editedName = "";
  let filterText = '';

  export let allowSearch = false;

  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<!-- Inventory table -->
<div class="flex flex-col gap-4">
  <div class="flex flex-row justify-start items-center">
      <div class="font-thin text-xl md:text-2xl">{title}</div>
      <div class="divider divider-horizontal"></div>
      
      
      {#if allowSearch}
      <div>{inventory.length} Entries</div>
      <div class="divider divider-horizontal"></div>
      <div class="grow relative">
        <input class="input input-sm w-full" type="text" placeholder="Filter by name..." bind:value={filterText} />
        <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 opacity-50" on:click={() => filterText = ''}>Clear</button>
      </div>
      <div class="divider divider-horizontal"></div>
      {:else}
      <div class="grow">{inventory.length} Entries</div>
      {/if}

      <Paginate totalRows={inventory.length} bind:lowerIndex bind:upperIndex />
  </div>
  
  <div class="window !p-0">
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>In Stock</th>
                <th>Lower Threshold</th>
                <th>Last Updated</th>
                <th>Last Updated By</th>
                <th class="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each inventory || [] as item}
            <tr>
              <td class="relative">
                {#if editingId === item.id}
                  <!-- edit mode -->
                  <form method="POST" action="?/updateName" class="flex items-center">
                    <input type="hidden" name="id" value={item.id} />
                    <input
                      name="name"
                      class="input input-sm"
                      bind:value={editedName}
                      on:keydown={(e) => e.key === 'Enter' && e.currentTarget.form?.submit()}
                      on:blur={(e) => e.currentTarget.form?.submit()}
                      autofocus
                    />
                  </form>
                {:else}
                  <!-- display mode -->
                  <span
                    class="cursor-pointer flex items-center"
                    role="button"
                    tabindex="0"
                    on:click={() => {
                      editingId = item.id;
                      editedName = item.name;
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        editingId = item.id;
                        editedName = item.name;
                        e.preventDefault();
                      }
                    }}
                  >
                    {item.name}
                    <Pencil
                      class="ml-1 opacity-0 hover:opacity-100 transition-opacity"
                      style="width:1rem; height:1rem;"
                    />
                </span>
                {/if}
              </td>              
                <td>{item.current_stock}</td>
                <td>
                  {item.minimum}
                </td>
                <td>
                  {getMostRecentChangeDateName(item.changes).date}
                </td>
                <td>
                  {getMostRecentChangeDateName(item.changes).name}
                </td>
                <td class="flex flex-row justify-end gap-2">
                  <NewChangeMenu mode={'add'} itemId={item.id}><button class="btn btn-sm btn-success"><Plus /></button></NewChangeMenu>
                  <NewChangeMenu mode={'subtract'} itemId={item.id}><button class="btn btn-sm btn-error"><Minus /></button></NewChangeMenu>
                  <div class="divider divider-horizontal m-0"></div>
                  <!-- <button class="btn btn-sm btn-primary" on:click={() => goto(`/inventory/${item.id}`)}>Inv</button> -->
                  <button class="btn btn-sm btn-primary" on:click={() => goto(`/inventory/${item.id}`)}>View</button>
                  <form method="POST" action="?/toggleHidden" class="inline">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="hidden" value="true" />
                    <button type="submit" class="btn btn-sm btn-warning" title="Hide this item">
                      <Trash style="width:1rem; height:1rem;" />
                    </button>
                  </form>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
  </div>
</div>