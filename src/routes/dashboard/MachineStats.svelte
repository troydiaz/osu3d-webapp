<script lang="ts">
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import { Layers } from "lucide-svelte";

  export let routeData: DashboardMachine[];

  $: activeJobCount = routeData.filter(m => m.status === MachineStatus.WORKING).length;
  $: activeFaultCount = routeData.filter(m => m.status === MachineStatus.FAULT).length;
  $: activeIdleCount = routeData.filter(m => m.status === MachineStatus.IDLE).length;
</script>

<div class="col-span-1 dark:bg-slate-400/10 backdrop-blur-xl rounded-lg ring-1 ring-white/10 flex flex-col gap-4 p-4">
  <div class="text-xl font-thin flex flex-row items-center gap-4 px-2"><span><Layers strokeWidth={1.5} size={'20pt'} /></span>Printer Status</div>
  <div class="w-full h-[1px] bg-white/10" />
  <div class="flex justify-around items-center h-full">

    <div class="flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin">{ activeJobCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="text-xs font-light opacity-50">Active</div>
      </div>
    </div>

    <div class="relative flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin">{ activeIdleCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="shrink text-xs font-light opacity-50">Idle</div>
      </div>
    </div>

    <div class="relative flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin text-error">{ activeFaultCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="shrink text-xs font-light opacity-50">Fault</div>
      </div>
    </div>
    
  </div>
</div>