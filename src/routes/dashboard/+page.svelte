<script lang="ts">
  import type { PageData } from "./$types";
  import { BarChart3, Bot, GraduationCap, Locate, Megaphone, MessageCircle, Play, Star, ThumbsUp } from "lucide-svelte";
  import { MachineStatus } from "$lib/types/models";
  import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import MachineStats from "./MachineStats.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";

  export let data: PageData;
  const { permissions, routeData, session } = data;
  $: newAnnouncements = announcements?.some(a => new Date(a.created_at) > new Date(data.profileData?.last_visit_at ?? 0)) ?? false;
  $: announcements = data.announcements?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  let cancelPrintModal: CancelPrintModal;

  $: activeJobs = routeData.filter(m => m.status === MachineStatus.WORKING && m.print_user_id === session.user.id);
</script>

<svelte:head>
  <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="page">

  <PageHeader name="Hi { (session.user.user_metadata.full_name).split(' ')[0] }" />

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-12">

    <!-- Announcements -->
    <div class="lg:col-span-2 window { newAnnouncements ? 'ring-1 ring-yellow-500/75' : ''}">

      <div class="window-header">
        <Megaphone />
        <span>Announcements</span>
        {#if newAnnouncements}
          <span class="text-yellow-500 w-full text-end font-medium">NEW</span>
        {/if}
      </div>

      
      <div class="window-content flex flex-col gap-8 font-normal pb-2">
        {#each announcements || [] as announce}
          <div class="relative p-4 rounded border border-base-content/50 border-b-0 border-dashed">
            <p class="text-sm italic">
              {announce.body}
            </p>
            <div class="absolute left-0 bottom-0 w-full text-end whitespace-nowrap flex">
              <div class="grow rounded-l border-b border-base-content/50 border-dashed"></div>
              <div class="translate-y-1/2 px-2 font-extralight text-sm">{announce.created_by.full_name}, {formatDistanceToNow(new Date(announce.created_at), { addSuffix: true })}</div>
              <div class="w-4 rounded-r border-b border-base-content/50 border-dashed"></div>
            </div>
          </div>
        {/each}
        {#if !announcements?.length}
          <p class="text-sm italic">
            No announcements. Check back later.
          </p>
        {/if}
      </div>
    </div>

    <!-- Josef -->
    <div class="lg:col-span-2 window">
      <div class="window-header">
        <Bot />
        <span>Josef the Discord Bot</span>
      </div>
      <div class="window-content flex flex-col gap-2 text-sm">
        {#if !data.profileData?.discord}
          <p>
            You haven't added your Discord username yet. Consider adding it in the <a href="/account" class="link link-warning">Settings page</a>. You will get notifications
            about your prints, and your Discord roles will reflect your tier certification level.
          </p>
        {:else}
          <p>
            You've already added your Discord username in the Settings page. Great!
          </p>
        {/if}
      </div>
    </div>

    <!-- My Jobs -->
    {#if activeJobs.length > 0}
      <div class="lg:col-span-4 relative window">

        <div class="window-header">
          <Star />
          <span>My Jobs</span>
        </div>

        <div class="window-content flex gap-8 md:flex-row flex-col">
          {#each activeJobs as job}
            <div class="flex md:flex-col flex-row justify-around md:justify-center items-center gap-4">
              <div class="flex flex-col items-center">
                <div class="text-sm font-extralight">{job.nickname}</div>
                {#if job.done_at}
                  <div class="text-xs font-light opacity-50">{formatDistanceToNowStrict(new Date(job.done_at))} remain</div>
                {/if}
              </div>
              <img src="/{job.model}.png" class="hidden md:block max-h-28" />
              
              <button class="btn btn-outline btn-warning md:btn-sm ring-1 ring-error/10 hover:bg-error/25 px-2"
                on:click={() => cancelPrintModal.launchModal(job)}
              >
                <div class="flex justify-center items-center gap-1">
                  <!-- <Ban size={16} /> -->
                  <div class="text-xs font-normal">Cancel</div>
                </div>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    

    <div class="lg:col-span-3 window">
      <div class="window-header">
        <Locate />
        <div>Quickstart</div>
      </div>
      <div class="window-content flex flex-col md:flex-row gap-4">
        <a href="/print" class="btn dark:btn-neutral h-fit">
          <div class="flex flex-col justify-center items-center gap-2 p-2">
            <Play strokeWidth={1.5} class="h-6 w-6" />
            <div>Start Print</div>
          </div>
        </a>
        <!-- <a href="/" class="btn btn-ghost btn-disabled ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <BarChart3 strokeWidth={1.5} class="h-8" />
            <div>My Stats</div>
          </div>
        </a> -->
        <a href="https://canvas.oregonstate.edu/courses/1877606" target="_blank" class="btn dark:btn-neutral h-fit p-2">
          <div class="flex flex-col justify-center items-center gap-2">
            <GraduationCap strokeWidth={1.5} class="h-6 w-6" />
            <div>Club Canvas</div>
          </div>
        </a>
        <a href="https://discord.gg/CUrEfbWPHy" target="_blank" class="btn dark:btn-neutral h-fit p-2">
          <div class="flex flex-col justify-center items-center gap-2">
            <MessageCircle strokeWidth={1.5} class="h-6 w-6" />
            <div>Club Discord</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Overall machine stats -->
    <MachineStats routeData={routeData} />

  </div>
</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />