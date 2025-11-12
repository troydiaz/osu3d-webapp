<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { DashboardMachine } from '$lib/types/models';

  export let filaments: { id: string; name: string }[] = [];

  let machineToLog: DashboardMachine | null = null;
  let modalVisible = false;

  let using_personal = false;
  let filament_item_id: string = '';
  let hours = '';
  let grams = '';

  // Derived validity
  $: hoursValid = Number(hours) > 0 && Number(hours) <= 168;
  $: gramsValid = Number(grams) > 0;
  $: optionsValid = using_personal || (!!filament_item_id && filament_item_id !== '');

  // Submit enabled only if everything required is valid
  $: canSubmit = hoursValid && gramsValid && optionsValid;

  // Show “choose filament or personal” prompt once hours & grams are valid but options aren’t
  $: showOptionNudge = hoursValid && gramsValid && !optionsValid;

  export function launchModal(machine: DashboardMachine | null) {
    if (!machine) return;
    machineToLog = machine;
    modalVisible = true;
  }

  // If switching to personal, clear any selected filament
  $: if (using_personal) filament_item_id = '';

  // Close modal + reset state after successful submit
  const handleSubmit: SubmitFunction = ({ form }) => {
    return async ({ result, update }) => {
      if (result.type === 'success') {
        modalVisible = false;
        using_personal = false;
        filament_item_id = '';
        hours = '';
        grams = '';
        form.reset();
      }
      await update();
    };
  };
</script>

<input type="checkbox" id="print-log-modal" class="modal-toggle" bind:checked={modalVisible} />

{#if machineToLog}
  <div class="modal">
    <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
      <form method="POST" action="?/addPrintLog" use:enhance={handleSubmit} class="space-y-4" novalidate>
        <input name="machine_id" type="hidden" value={machineToLog.machine_id} />

        <h3 class="font-bold text-lg mb-2">
          Start a print on {machineToLog?.nickname}
        </h3>

        <!-- Hours -->
        <div class="form-control space-y-1">
          <label for="hours" class="label-text text-base">How long is the print? (hours)</label>
          <input
            id="hours"
            name="hours"
            type="number"
            min="0.01"
            max="168"
            step="0.01"
            placeholder="0"
            class="input input-bordered w-full text-base {hours !== '' && !hoursValid ? 'input-error' : ''}"
            bind:value={hours}
            required
            aria-invalid={hours !== '' && !hoursValid}
          />
        </div>

        <!-- Grams -->
        <div class="form-control space-y-1">
          <label for="grams" class="label-text text-base">How much filament will be used? (grams)</label>
          <input
            id="grams"
            name="grams"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            class="input input-bordered w-full text-base {grams !== '' && !gramsValid ? 'input-error' : ''}"
            bind:value={grams}
            required
            aria-invalid={grams !== '' && !gramsValid}
          />
        </div>

        <!-- Personal filament toggle -->
        <div
          class="flex items-center gap-3 text-base {showOptionNudge
            ? 'ring ring-offset-1 ring-red-500 rounded-md p-2 transition-all'
            : ''}"
        >
          <input
            id="using_personal"
            type="checkbox"
            name="using_personal"
            value="true"
            class="checkbox"
            bind:checked={using_personal}
            aria-describedby="filament-choice-hint"
          />
          <label for="using_personal" class="label-text"> Are you using personal filament? </label>
        </div>

        <!-- Filament select -->
        <div class="form-control space-y-1">
          <label for="filament_item_id" class="label-text text-base">Which filament type?</label>
          <div class={showOptionNudge ? 'ring-2 ring-offset-2 ring-red-500 rounded-md p-1 transition-all' : ''}>
            <select
              id="filament_item_id"
              name="filament_item_id"
              class="select select-bordered w-full text-base"
              disabled={using_personal}
              bind:value={filament_item_id}
              required={!using_personal}
              aria-invalid={!using_personal && showOptionNudge}
              aria-describedby="filament-choice-hint"
            >
              <option value="" disabled>Select filament</option>
              {#each filaments as f}
                <option value={f.id}>{f.name}</option>
              {/each}
            </select>
          </div>

          {#if filaments.length === 0}
            <p class="text-sm opacity-60 mt-1">No filament found.</p>
          {/if}

          {#if using_personal}
            <p class="text-sm opacity-60 mt-1">Grayed out — personal filament selected.</p>
          {/if}

          {#if showOptionNudge}
            <p id="filament-choice-hint" class="text-sm mt-1 text-red-500">
              Choose <b>personal filament</b> or select a <b>club filament</b> to continue.
            </p>
          {/if}
        </div>

        <!-- Actions -->
        <div class="modal-action mt-4">
          <button type="button" class="btn" on:click={() => (modalVisible = false)}> Cancel </button>
          <input type="submit" class="btn btn-warning" value="Submit" disabled={!canSubmit} />
        </div>
      </form>
    </div>
  </div>
{/if}
