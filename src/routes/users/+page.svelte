
<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { ArrowLeft, Users } from "svelte-heros-v2";
	import UserTable from "$lib/components/tables/UserTable.svelte";
	import { AlertTypeOld, addAlert } from "$lib/stores/alerts";
	import PageHeader from "$lib/components/PageHeader.svelte";
    import ledger from '$lib/images/ledger.png';

    export let data: PageData;
    export let form: ActionData;

    $: if (form) form.success ? addAlert(AlertTypeOld.INFO, 'Great news', 'Successfully commited all changes!') : addAlert(AlertTypeOld.ERROR, 'Uh oh...', 'Error commiting changes to the database...');

    let { session, userLevels } = data;
</script>

<svelte:head>
    <title>Users</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
    <PageHeader name="Users" image={ledger} />
    {#if userLevels}
    <UserTable userLevels={userLevels.map(u => { return { ...u, checked: false, previousLevel: u.level } })} />
    {/if}
</div>