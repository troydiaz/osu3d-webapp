<script lang="ts">
  import type { DashboardMachine } from '$lib/types/models';
  let selectedMachine: DashboardMachine | null = null;
  let modalVisible = false;

  export function launchModal(machine: DashboardMachine | null) {
    if (!machine) return;
    selectedMachine = machine;
    modalVisible = true;
  }
</script>

<input type="checkbox" id="print-done-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if selectedMachine}
  <div class="modal">
    <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
      <form method="POST" action="?/completePrintLog">
        <div class="flex flex-col gap-4">
          <h3 class="font-bold text-lg">Mark print done on {selectedMachine.nickname}?</h3>
          <input name="print_id" type="hidden" value={selectedMachine.print_id} />
          <input name="machine_id" type="hidden" value={selectedMachine.machine_id} />
          <div>Owner: {selectedMachine.full_name}</div>
          <div>This will record the finish time as now.</div>
          <div class="modal-action">
            <button type="button" class="btn" on:click={() => (modalVisible = false)}>Cancel</button>
            <input type="submit" class="btn btn-success" value="Yes, Done" />
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
