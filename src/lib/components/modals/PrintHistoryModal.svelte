<script lang="ts">
	import type { Machine } from "$lib/types/database";
	
  let machineToReview: Machine | null = null;
  let modalVisible = false;

  export function launchModal(machine: Machine | null) {
    if (machine === null)
      return;

    machineToReview = machine;
    modalVisible = true;
  }

  function getDateAndTime(dateString: string | null) {
    if (!dateString) return '-';
    let date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

</script>

<input type="checkbox" id="machine-print-history-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if machineToReview}
<div class="modal lg:ml-80">
    <div class="modal-box w-fit max-w-full">
        <div class="flex flex-col justify-start items-start space-y-4 w-fit">
            <!-- Modal Title -->
            <h3 class="font-bold text-lg">Viewing print history for {machineToReview?.nickname}</h3>
            <!-- Machine Issue Description -->
            <div>
                <table class="table table-compact">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Created By</th>
                            <th>Hours</th>
                            <th>Consumed</th>
                            <th>Canceled</th>
                            <th>Canceled By</th>
                            <th>Canceled At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each machineToReview.prints || [] as print}
                            <tr>
                                <td>{getDateAndTime(print.created_at)}</td>
                                <td>{print.created_by.full_name}</td>
                                <td>
                                    {((new Date(print.done_at).getTime() - new Date(print.created_at).getTime()) / 1000 / 60 / 60).toFixed(2)}
                                </td>
                                <td>{print.filament}g</td>
                                <td>{print.canceled}</td>
                                <td>{print.canceled_by?.full_name ?? '-'}</td>
                                <td>{getDateAndTime(print.canceled_at)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal Actions -->
        <div class="modal-action">
            <label for="machine-print-history-modal" class="btn">Close</label>
        </div>
    </div>
</div>
{/if}