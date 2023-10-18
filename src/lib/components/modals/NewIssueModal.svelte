<script lang="ts">
	import type { Machine } from "$lib/types/database";

  let machineToReport: Machine | null = null;
  let modalVisible = false;

  export function launchModal(machine: Machine | null) {
    if (machine === null)
      return;

    console.log(machine);

    machineToReport = machine;
    modalVisible = true;
  }
</script>

<input type="checkbox" id="new-machine-issue-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if machineToReport}
<div class="modal">
  <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
    <form method="POST" action="?/reportFault">
      <!-- Modal Title -->
      <h3 class="font-bold text-lg">Report an issue for {machineToReport?.nickname}</h3>
        <!-- Machine ID  -->
        <div class="form-control">
          <input name="machine_id" type="hidden" value={machineToReport.id} />
        </div>
        <!-- Print ID (if in progress) -->
        <input name="print_id" type="hidden" value={machineToReport.prints.find(p => p.status === 'WORKING')?.id ?? null} />
        <!-- Machine Issue Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">What is the issue?</span>
          </label>
          <input name="description" type="text" placeholder="Type here..." class="input input-bordered w-full" autocomplete="off" />
        </div>
      <!-- Modal Actions -->
      <div class="modal-action">
        <button type="button" class="btn" on:click={() => modalVisible = false}>Cancel</button>
        <input type="submit" class="btn btn-warning" value="Submit" />
      </div>
    </form>
  </div>
</div>
{/if}