<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import type { PageData, ActionData } from "./$types.js";
	import { goto } from '$app/navigation';
	import gear from '$lib/images/gear.png';
	import PageHeader from '$lib/components/PageHeader.svelte';
  import toast from 'svelte-french-toast';
	
  export let data: PageData;
  export let form: ActionData;

  $: if (form) form.success ? toast.success('Saved', { className: ''}) : toast.error('Something went wrong :(');

  let { session, profile, supabase } = data;
  let loading = false;

  let full_name: string | null = profile?.full_name ?? form?.full_name ?? null;
  let discord: string | null = profile?.discord ?? form?.discord ?? null;

  $: unsavedChanges = (discord !== profile?.discord && discord !== form?.discord) ||
    (full_name !== profile?.full_name && full_name !== form?.full_name);

  let pingDisabled = false;

  async function ping() {
    pingDisabled = true;
    await supabase.functions.invoke('discord-pm', {
      body: { username: discord, message: '[OSU3D] Ping! If you can read this, your username is correct.' }
    });
    pingDisabled = false;
    // setTimeout(() => pingDisabled = false, 5000);
  }
</script>

<svelte:head>
  <title>Settings | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
  <PageHeader name="Account Settings" image={gear} />

  <div class="flex flex-col gap-4">
    <div class="font-thin text-xl md:text-2xl px-4 md:px-0">General</div>
    <!-- Account Settings -->
    <div class="window">
      <form
        method="post"
        action="?/update"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            loading = false;
            if (result.type === 'redirect')
              goto(result.location);
            else
              await applyAction(result);
          }
        }}
        class="flex flex-col gap-4"
      >
        <div class="form-control w-full max-w-xs">
          <label for="email" class="label">
            <span class="label-text">Email</span>
          </label>
          <input id="email" type="text" class="input w-full max-w-xs input-bordered" value={session.user.email} disabled />
        </div>
    
        <div class="form-control w-full max-w-xs">
          <label for="email" class="label">
            <span class="label-text">Name</span>
          </label>
          <input autocomplete="off" bind:value={full_name} id="full_name" name="full_name" type="text" class="input input-bordered w-full max-w-xs" />
        </div>
    
        <div class="form-control w-full max-w-xs">
          <label for="email" class="label">
            <span class="label-text">Discord username</span>
          </label>
          <div class="flex gap-4">
              <input autocomplete="off" bind:value={discord} id="discord" name="discord" type="text" class="input input-bordered w-full max-w-xs" />
              <button type="button" class="btn btn-primary w-20" disabled={!discord || discord === '' || pingDisabled} on:click={() => ping()}>
                {#if pingDisabled}
                <span class="loading loading-spinner loading-md"></span>
                {:else}
                <span>Test</span>
                {/if}
              </button>
          </div>
        </div>
    
        <div class="mt-2 flex gap-8 items-center">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={!unsavedChanges || loading}
          >Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</div>