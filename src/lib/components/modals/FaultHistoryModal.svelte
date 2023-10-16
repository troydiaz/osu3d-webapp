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

<input type="checkbox" id="machine-fault-history-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if machineToReview}
<div class="modal lg:ml-80">
    <div class="modal-box w-fit max-w-full">
        <div class="flex flex-col justify-start items-start space-y-4 w-fit">
            <!-- Modal Title -->
            <h3 class="font-bold text-lg">Viewing fault history for {machineToReview?.nickname}</h3>
            <!-- Machine Issue Description -->
            <div>
                <table class="table table-compact">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Created By</th>
                            <th>Description</th>
                            <th>Resolved</th>
                            <th>Resolved By</th>
                            <th>Resolved At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each machineToReview.faults || [] as fault}
                            <tr>
                                <td>{getDateAndTime(fault.created_at)}</td>
                                <td>{fault.created_by.full_name}</td>
                                <td>
                                    <div class="tooltip before:whitespace-pre-wrap before:content-[attr(data-tip)]" data-tip={fault.description}>
                                        <span class="w-32 max-w-32 truncate inline-block text-start">{fault.description}</span>
                                    </div>
                                </td>
                                <td>{fault.resolved}</td>
                                <td>{fault.resolved_by?.full_name || '-'}</td>
                                <td>{getDateAndTime(fault.resolved_at)}</td>
                                <td>
                                    {#if fault.resolved === false}
                                        <form method="POST" action="?/resolveFault">
                                            <input type="hidden" name="faultId" value={fault.id} />
                                            <button class="btn btn-success btn-sm" type="submit">Resolve</button>
                                        </form>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal Actions -->
        <div class="modal-action">
            <label for="machine-fault-history-modal" class="btn">Close</label>
        </div>
    </div>
</div>
{/if}