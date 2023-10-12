<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { Cog6Tooth, InformationCircle } from 'svelte-heros-v2';
  import type { PageData, ActionData } from "./$types.js";
	import { goto } from '$app/navigation';
	import { AlertTypeOld, addAlert } from '$lib/stores/alerts.js';

  export let data: PageData;
  export let form: ActionData;

  $: if (form) form.success ? addAlert(AlertTypeOld.INFO, 'Good news', 'Changes saved successfully') : addAlert(AlertTypeOld.ERROR, 'Uh oh', 'There was an issue saving your settings');

  let { session, profile } = data;

  let loading = false;

  let full_name: string | null = profile?.full_name ?? form?.full_name ?? null;
  let discord: string | null = profile?.discord ?? form?.discord ?? null;

  $: unsavedChanges = (discord !== profile?.discord && discord !== form?.discord) ||
    (full_name !== profile?.full_name && full_name !== form?.full_name);

  const pingChannel = data.supabase.channel('discord-ping-channel').subscribe();
  let pingDisabled = false;

  function ping() {
    pingDisabled = true;

    pingChannel.send({
      type: 'broadcast',
      event: 'discord-ping',
      payload: { discord }
    });

    setTimeout(() => pingDisabled = false, 5000);
  }
</script>

<div class="flex flex-col gap-12 lg:my-12 w-full">
  <div class="relative overflow-hidden flex flex-row justify-between items-center rounded-2xl p-8 shadow-lg bg-neutral">
    <div class="grow"></div>
    <span class="text-5xl font-thin pr-6">Account Settings</span>
    <Cog6Tooth size={'64px'} strokeWidth={'1px'} />
  </div>

  <div class="flex flex-col gap-4">
    <div class="font-thin text-3xl">General</div>
    <!-- Account Settings -->
    <div class="bg-neutral rounded-2xl p-8 w-full">
      <div class="flex flex-row items-center gap-4 bg-info p-4 rounded-2xl">
        <InformationCircle class="text-info-content inline" size={'36px'} />
        <div class="inline text-info-content">
          Updating your Discord username will allow you to receive pings about your prints.
          Your server Role will also be updated accordingly.
        </div>
      </div>
      <div class="divider"></div>
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
          <input id="email" type="text" class="input w-full max-w-xs" value={session.user.email} disabled />
        </div>
    
        <div class="form-control w-full max-w-xs">
          <label for="email" class="label">
            <span class="label-text">Name</span>
          </label>
          <input autocomplete="off" bind:value={full_name} id="full_name" name="full_name" type="text" class="input w-full max-w-xs" />
        </div>
    
        <div class="form-control w-full max-w-xs">
          <label for="email" class="label">
            <span class="label-text">Discord username</span>
          </label>
          <div class="flex gap-4">
              <input autocomplete="off" bind:value={discord} id="discord" name="discord" type="text" class="input w-full max-w-xs" />
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