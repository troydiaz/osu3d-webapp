<script lang="ts">
  import CalendarEvents from '$lib/components/CalendarEvents.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import schedule from '$lib/images/schedule.png';
</script>

<svelte:head>
  <title>Maintenance | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
  <PageHeader name="Maintenance" image={schedule} />
</div>

<CalendarEvents />
