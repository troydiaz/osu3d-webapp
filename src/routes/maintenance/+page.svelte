<script lang="ts">
	import CalendarEvents from "$lib/components/CalendarEvents.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import hammer from '$lib/images/hammer.png';

</script>

<svelte:head>
  <title>Maintenance | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
  <PageHeader name="Maintenance" image={hammer} />
</div>

<CalendarEvents />