<script lang="ts">
	import { getActivePrintJob, type Machine, type Print } from "$lib/types/database";

  let selectedMachine: Machine | null = null;
  let printToCancel: Print | null = null;
  let modalVisible = false;

  export function launchModal(machine: Machine | null) {
    if (machine === null)
      return;

    printToCancel = getActivePrintJob(machine);
    selectedMachine = machine;
    modalVisible = true;
  }
</script>

<input type="checkbox" id="cancel-print-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if printToCancel}
<div class="modal">
  <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
    <form method="POST" action="?/cancelPrintLog">
        <div class="flex flex-col gap-4">
          <!-- Modal Title -->
          <h3 class="font-bold text-lg">Cancel print on {selectedMachine?.nickname}</h3>
          <!-- Machine ID  -->
          <input name="printLogId" type="hidden" class="input input-bordered w-full input-disabled" value={printToCancel.id} />
          <!-- Print Hours -->
          <div>Are you sure you want to cancel this print?</div>
          <div>Owner: {printToCancel.created_by.full_name}</div>
          <div>They may be notified of this cancelation.</div>
          <!-- Modal Actions -->
          <div class="modal-action">
          <label for="cancel-print-modal" class="btn">No</label>
          <input type="submit" class="btn btn-warning" value="Yes" />
        </div>
      </div>
    </form>
  </div>
</div>
{/if}