<script lang="ts">
  import { enhance } from '$app/forms';
  import type { DashboardMachine } from '$lib/types/models';

  // Provided by +page.server.ts load()
  export let filaments: { id: string; name: string }[] = [];

  let machineToLog: DashboardMachine | null = null;
  let modalVisible = false;

  let using_personal = false;
  let filament_item_id: string | null = null;

  export function launchModal(machine: DashboardMachine | null) {
    if (!machine) return;
    machineToLog = machine;
    modalVisible = true;
  }

  $: if (using_personal) filament_item_id = null;
</script>

<input type="checkbox" id="print-log-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if machineToLog}
  <div class="modal">
    <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
      <form method="POST" action="?/addPrintLog" use:enhance>
        <h3 class="font-bold text-lg">Start a print on {machineToLog?.nickname}</h3>

        <input name="machine_id" type="hidden" value={machineToLog.machine_id} />

        <!-- Hours -->
        <div class="form-control">
          <label class="label" for="hours"><span class="label-text">How long is the print? (hours)</span></label>
          <input
            id="hours"
            name="hours"
            type="number"
            min="0"
            max="168"
            step="0.01"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Grams -->
        <div class="form-control">
          <label class="label" for="grams"
            ><span class="label-text">How much filament will be used? (grams)</span></label
          >
          <input id="grams" name="grams" type="number" min="0" step="1" class="input input-bordered w-full" />
        </div>

        <!-- Personal filament -->
        <label class="flex items-center gap-3 mt-2" for="using_personal">
          <input
            id="using_personal"
            type="checkbox"
            name="using_personal"
            bind:checked={using_personal}
            value="true"
            class="checkbox"
          />
          <span>Are you using personal filament?</span>
        </label>

        <!-- Filament type -->
        <div class="form-control">
          <label class="label" for="filament_item_id"><span class="label-text">Which filament type?</span></label>
          <select
            id="filament_item_id"
            name="filament_item_id"
            disabled={using_personal}
            bind:value={filament_item_id}
            class="select select-bordered w-full"
          >
            <option value="" disabled selected>Select filament</option>
            {#each filaments as f}
              <option value={f.id}>{f.name}</option>
            {/each}
          </select>

          {#if filaments.length === 0}
            <p class="text-sm opacity-60 mt-1">No filament found.</p>
          {/if}

          {#if using_personal}
            <p class="text-sm opacity-60 mt-1">Grayed out — personal filament selected.</p>
          {/if}
        </div>

        <div class="modal-action">
          <button type="button" class="btn" on:click={() => (modalVisible = false)}>Cancel</button>
          <input type="submit" class="btn btn-warning" value="Submit" />
        </div>
      </form>
    </div>
  </div>
{/if}
