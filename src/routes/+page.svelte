<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ supabase } = data);

  // @ts-ignore
  const appName = __NAME__;

  // @ts-ignore
  const appVersion = __VERSION__;

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${data.url}/auth/callback`
      }
    });
  }
</script>

<svelte:head>
    <title>OSU 3D</title>
</svelte:head>

<div class="min-h-screen w-full">
    <div class="flex flex-col justify-center items-center gap-8 p-12 md:gap-12 w-full h-full md:max-w-screen-sm mx-auto">
      <img src="osu3d.svg" class="w-32 h-32">
      <div class="text-base-content">
          <div class="font-thin text-xl md:text-3xl text-center">3D Printing and<br>Additive Manufacturing Club</div>
          <div class="divider w-full max-w-sm mx-auto my-2 md:my-4"></div>
          <div class="font-light text-xl md:text-3xl text-center">Oregon State University</div>
      </div>
      <button on:click={() => signIn()} class="bg-orange-400 text-white rounded-lg px-4 py-2 text-xl">SIGN IN WITH GOOGLE</button>
      <!-- <div class="grow"></div> -->
      <div class="text-xs p-2 rounded-lg bg-base-100 outline outline-1 outline-base-content/10 mt-8">
          <div class="text-sm text-center">Notice</div>
          <div class="divider m-0"></div>
            User authentication is handled by Google through Social Sign On (SSO).
            Only your account name and email address is recorded by this system.
          <a href="/privacy-policy" class="link-hover link-warning">View our privacy policy.</a>
      </div>
    </div>
    <div class="absolute bottom-0 footer py-2 footer-center text-sm text-base-content">
            {appName} {appVersion}
    </div>
</div>