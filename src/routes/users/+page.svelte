
<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { ArrowLeft } from "svelte-heros-v2";
	import UserTable from "$lib/components/tables/UserTable.svelte";
	import { AlertType, addAlert } from "$lib/stores/alerts";

    export let data: PageData;
    export let form: ActionData;

    $: if (form) form.success ? addAlert(AlertType.INFO, 'Successfully commited all changes!') : addAlert(AlertType.ERROR, 'Error commiting changes to the database...');

    let { session, userLevels } = data;
</script>

<svelte:head>
    <title>osu3d | user manager</title>
</svelte:head>

<div class="flex flex-col space-y-8 lg:my-12 w-full">
    <a href="/dashboard" class="uppercase text-xl w-fit"><ArrowLeft class="inline" /><span class="ml-4 align-middle">Dashboard</span></a>

    <div class="relative overflow-hidden flex flex-row justify-between bg-neutral rounded-2xl p-12 shadow-lg">
        <div class="flex flex-col justify-between items-start space-y-12">
            <div class="flex flex-col space-y-2">
                <span class="text-5xl font-bold">User Manager</span>
                <!-- <span class="text-2xl italic">Promotion?</span> -->
            </div>
            
        </div>
        <!-- <img src="/safety-man.png" class="absolute right-0 -top-8 blur"> -->
    </div>
    <div class="divider"></div>
    {#if userLevels}
    <UserTable userLevels={userLevels.map(u => { return { ...u, checked: false, previousLevel: u.level } })} />
    {/if}
</div>