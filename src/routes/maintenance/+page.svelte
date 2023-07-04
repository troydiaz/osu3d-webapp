<script lang="ts">
	import CalendarEvents from "$lib/components/CalendarEvents.svelte";
	import { ArrowLeft, Calendar, ClipboardDocument } from "svelte-heros-v2";

</script>

<div class="flex flex-col gap-12 lg:my-12 w-full">
  <div class="relative overflow-hidden flex flex-row justify-between items-center gap-4 bg-neutral rounded-2xl p-8 shadow-lg">
    <a href="/maintenance/log" class="btn btn-outline text-xl font-light">
      <ClipboardDocument /><span>Maintenance Log</span>
    </a>

    <div class="grow"></div>
    <div class="flex flex-row justify-center items-center">
      <span class="text-5xl font-thin pr-6">Maintenance Events</span>
      <Calendar size={'64px'} strokeWidth={'1px'} />
    </div>
  </div>
</div>

<CalendarEvents />