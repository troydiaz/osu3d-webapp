<script lang="ts">
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import { Layers } from "lucide-svelte";

  export let routeData: DashboardMachine[];

  $: activeJobCount = routeData.filter(m => m.status === MachineStatus.WORKING).length;
  $: activeFaultCount = routeData.filter(m => m.status === MachineStatus.FAULT).length;
  $: activeIdleCount = routeData.filter(m => m.status === MachineStatus.IDLE).length;
</script>

<div class="col-span-1 window">
  <div class="header">
    <span><Layers strokeWidth={1.5} class="h-8" /></span>
    <span>Printer Status</span>
  </div>
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