<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import type { PageData, ActionData } from "./$types.js";
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
  import toast from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';
  import ThemePreview from './ThemePreview.svelte';
  import UploadAvatar from './UploadAvatar.svelte';
	
  export let data: PageData;
  export let form: ActionData;

  let profileForm: HTMLFormElement;

  $: if (form) form.success ? toast.success('Saved', { className: ''}) : toast.error('Something went wrong :(');

  let { session, profile, supabase } = data;
  let loading = false;

  let full_name: string | null = profile?.full_name ?? form?.full_name ?? null;
  let discord: string | null = profile?.discord ?? form?.discord ?? null;
  let avatar_url: string | null = profile?.avatar_url ?? form?.avatar_url ?? null;

  $: unsavedChanges = (discord !== profile?.discord && discord !== form?.discord) ||
    (full_name !== profile?.full_name && full_name !== form?.full_name) ||
    (avatar_url !== profile?.avatar_url && avatar_url !== form?.avatar_url);

  let pingDisabled = false;

  async function ping() {
    pingDisabled = true;
    await supabase.functions.invoke('discord-pm', {
      body: { username: discord, message: '[OSU3D] Ping! If you can read this, your username is correct.' }
    });
    pingDisabled = false;
    // setTimeout(() => pingDisabled = false, 5000);
  }

  onMount(() => {
    // Theme swap button
    themeChange(false);
  });
</script>

<svelte:head>
  <title>Settings | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Settings" />

  <div class="window">
      <div class="window-header">Theme</div>
      <div class="window-content flex flex-col gap-4">

         <!-- Account Settings -->
         <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 columns-auto gap-4">
          <ThemePreview theme="light" />
          <ThemePreview theme="dark" />
          <ThemePreview theme="lofi" />
          <ThemePreview theme="black" />
          <ThemePreview theme="fantasy" />
          <ThemePreview theme="sunset" />
          <ThemePreview theme="dim" />
          <ThemePreview theme="winter" />
          <ThemePreview theme="cmyk" />
          <ThemePreview theme="wireframe" />
          <ThemePreview theme="night" />
          <ThemePreview theme="cyberpunk" />
          <ThemePreview theme="coffee" />
          <ThemePreview theme="aqua" />
          <ThemePreview theme="dracula" />
          <ThemePreview theme="synthwave" />
        </div>
      </div>
  </div>

  <form
    method="post"
    action="?/update"
    bind:this={profileForm}
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
  >
    <div class="window">
      <div class="window-header">Personal</div>

      <div class="window-content flex flex-col md:flex-row justify-start items-start gap-4 flex-wrap">

        <div class="flex flex-col gap-4">
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Email</span>
            </label>
            <input id="email" type="text" class="input input-bordered w-full" value={session.user.email} disabled />
          </div>
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Name</span>
            </label>
            <input autocomplete="off" bind:value={full_name} id="full_name" name="full_name" type="text" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Discord username</span>
            </label>
            <div class="flex gap-4">
                <input autocomplete="off" bind:value={discord} id="discord" name="discord" type="text" class="input input-bordered grow" />
                <button type="button" class="btn btn-secondary w-20" disabled={!discord || discord === '' || pingDisabled} on:click={() => ping()}>
                  {#if pingDisabled}
                  <span class="loading loading-spinner loading-md"></span>
                  {:else}
                  <span>Test</span>
                  {/if}
                </button>
            </div>
          </div>
        </div> 

        <div class="px-8">
          <UploadAvatar
              {supabase}
              bind:url={avatar_url}
              on:upload={() => {
                profileForm.requestSubmit();
              }}
            />
        </div>
        
      </div>

      <div class="window-footer flex justify-end">
        <button
          type="submit"
          class="btn btn-primary"
          disabled={!unsavedChanges || loading}
        >
          <div>Save Changes</div>
        </button>
      </div>
    </div>
  </form>
</div>