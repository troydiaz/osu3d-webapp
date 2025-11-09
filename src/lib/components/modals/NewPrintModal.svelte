<script lang="ts">
  import { enhance } from '$app/forms';
  import type { DashboardMachine } from '$lib/types/models';

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
      <!-- NEW FORM BLOCK -->
      <form method="POST" action="?/addPrintLog" use:enhance class="space-y-4">
        <input name="machine_id" type="hidden" value={machineToLog.machine_id} />

        <!-- Title -->
        <h3 class="font-bold text-lg mb-2">Start a print on {machineToLog?.nickname}</h3>

        <!-- Print Hours -->
        <div class="form-control space-y-1">
          <label for="hours" class="label-text text-base">How long is the print? (hours)</label>
          <input
            id="hours"
            name="hours"
            type="number"
            min="0"
            max="168"
            step="0.01"
            placeholder="0"
            class="input input-bordered w-full text-base"
          />
        </div>

        <!-- Print Grams -->
        <div class="form-control space-y-1">
          <label for="grams" class="label-text text-base">How much filament will be used? (grams)</label>
          <input
            id="grams"
            name="grams"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            class="input input-bordered w-full text-base"
          />
        </div>

        <!-- Personal filament -->
        <div class="flex items-center gap-3 text-base">
          <input
            id="using_personal"
            type="checkbox"
            name="using_personal"
            value="true"
            class="checkbox"
            bind:checked={using_personal}
          />
          <label for="using_personal" class="label-text">Are you using personal filament?</label>
        </div>

        <!-- Filament type -->
        <div class="form-control space-y-1">
          <label for="filament_item_id" class="label-text text-base">Which filament type?</label>
          <select
            id="filament_item_id"
            name="filament_item_id"
            class="select select-bordered w-full text-base"
            disabled={using_personal}
            bind:value={filament_item_id}
          >
            <option value="" disabled selected>Select filament</option>
            {#each filaments as f}
              <option value={f.id}>{f.name}</option>
            {/each}
          </select>

          {#if filaments.length === 0}
            <p class="text-sm opacity-60 mt-1">No filament found.</p>
          {/if}
        </div>

        <!-- Actions -->
        <div class="modal-action mt-4">
          <button type="button" class="btn" on:click={() => (modalVisible = false)}>Cancel</button>
          <input type="submit" class="btn btn-warning" value="Submit" />
        </div>
      </form>
    </div>
  </div>
{/if}
