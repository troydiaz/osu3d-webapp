<script lang="ts">
	  import type { DashboardMachine } from "$lib/types/models";

  let selectedMachine: DashboardMachine | null = null;
  let modalVisible = false;

  export function launchModal(machine: DashboardMachine | null) {
    if (machine === null)
      return;

    selectedMachine = machine;
    modalVisible = true;
  }
</script>

<input type="checkbox" id="cancel-print-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if selectedMachine}
<div class="modal">
  <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
    <form method="POST" action="?/cancelPrintLog">
      <div class="flex flex-col gap-4">
        <!-- Modal Title -->
        <h3 class="font-bold text-lg">Cancel print on {selectedMachine?.nickname}</h3>
        <!-- Print ID  -->
        <input name="print_id" type="hidden" value={selectedMachine.print_id} />
        <!-- Machine ID -->
        <input name="machine_id" type="hidden" value={selectedMachine.machine_id} />
        <!-- Print Hours -->
        <div>Are you sure you want to cancel this print?</div>
        <div>Owner: {selectedMachine.full_name}</div>
        <div>They may be notified of this cancelation.</div>
        <!-- Modal Actions -->
        <div class="modal-action">
          <button type="button" class="btn" on:click={() => modalVisible = false}>Cancel</button>
          <input type="submit" class="btn btn-warning" value="Submit" />
        </div>
      </div>
    </form>
  </div>
</div>
{/if}