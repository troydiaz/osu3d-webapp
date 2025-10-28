<script lang="ts">
  import type { PageData } from './$types';
  import { Bot, GraduationCap, Locate, Megaphone, MessageCircle, Play, Star, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { MachineStatus, Announcement } from '$lib/types/models';
  import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
  import CancelPrintModal from '$lib/components/modals/CancelPrintModal.svelte';
  import MachineStats from './MachineStats.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  export let data: PageData;
  const { permissions, routeData, session } = data;
  $: newAnnouncements =
    announcements?.some((a) => new Date(a.created_at) > new Date(data.profileData?.last_visit_at ?? 0)) ?? false;

  const DEFAULT_ANNOUNCEMENT: Announcement = {
    id: 0,
    body: '',
    created_at: new Date().toISOString(),
    created_by_user_id: '',
    created_by: {
      avatar_url: null,
      created_at: new Date().toISOString(),
      discord: null,
      email: null,
      full_name: '',
      last_visit_at: null,
      updated_at: new Date().toISOString(),
      user_id: ''
    }
  };

  let annIdx = 0;
  $: announcements = data.announcements?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) ?? [];

  $: annTotal = announcements.length;
  $: if (annIdx >= annTotal) annIdx = 0;

  // type Announcement = typeof announcements[number];
  let currentAnn: Announcement = DEFAULT_ANNOUNCEMENT;
  $: currentAnn = annTotal > 0 ? announcements[annIdx] : DEFAULT_ANNOUNCEMENT;

  function prevAnn() { if (!annTotal) return; annIdx = (annIdx - 1 + annTotal) % annTotal; }
  function nextAnn() { if (!annTotal) return; annIdx = (annIdx + 1) % annTotal; }

  let cancelPrintModal: CancelPrintModal;

  $: activeJobs = routeData.filter((m) => m.status === MachineStatus.WORKING && m.print_user_id === session.user.id);
</script>

<svelte:head>
  <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
  <div class="page">
    <PageHeader name="Hi {session.user.user_metadata.full_name.split(' ')[0]}" />

    <div class="grid grid-cols-4 md:gap-12">
      <!-- Announcements -->
      <div class="col-span-4 lg:col-span-2 window {newAnnouncements ? 'ring-1 ring-yellow-500/75' : ''}">
        <div class="window-header">
          <Megaphone />
          <span>Announcements</span>
          {#if newAnnouncements}
            <span class="text-yellow-500 w-full text-end font-medium">NEW</span>
          {/if}
      
          <!-- pager controls -->
          <div class="ml-auto flex items-center gap-1">
            <div class="text-xs opacity-60 tabular-nums">{annTotal ? annIdx + 1 : 0}/{annTotal}</div>
            <button class="btn btn-ghost btn-xs" on:click={prevAnn} disabled={annTotal <= 1} aria-label="Previous">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button class="btn btn-ghost btn-xs" on:click={nextAnn} disabled={annTotal <= 1} aria-label="Next">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      
        <div class="window-content flex flex-col gap-8 font-normal pb-2">
          {#if annTotal > 0}
            {#key currentAnn?.id}
              <div class="relative p-4 rounded border border-base-content/50 border-b-0 border-dashed">
                <p class="text-sm italic">{currentAnn.body}</p>
                <div class="absolute left-0 bottom-0 w-full text-end whitespace-nowrap flex">
                  <div class="grow rounded-l border-b border-base-content/50 border-dashed"></div>
                  <div class="translate-y-1/2 px-2 font-extralight text-sm">
                    {currentAnn.created_by.full_name},
                    {formatDistanceToNow(new Date(currentAnn.created_at), { addSuffix: true })}
                  </div>
                  <div class="w-4 rounded-r border-b border-base-content/50 border-dashed"></div>
                </div>
              </div>
            {/key}
          {:else}
            <p class="text-sm italic">No announcements. Check back later.</p>
          {/if}
        </div>
      </div>
    
      <!-- Josef -->
      <div class="col-span-4 lg:col-span-2 window">
        <div class="window-header">
          <Bot />
          <span>Josef the Discord Bot</span>
        </div>
        <div class="window-content flex flex-col gap-2 text-sm">
          {#if !data.profileData?.discord}
            <p>
              You haven't added your Discord username yet. Consider adding it in the <a
                href="/account"
                class="link link-warning">Settings page</a
              >. You will get notifications about your prints, and your Discord roles will reflect your tier
              certification level.
            </p>
          {:else}
            <p>You've already added your Discord username in the Settings page. Great!</p>
          {/if}
        </div>
      </div>

      <!-- My Jobs -->
      {#if activeJobs.length > 0}
        <div class="col-span-4 lg:col-span-4 window">
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
                    <div class="text-xs font-light opacity-50">
                      {formatDistanceToNowStrict(new Date(job.done_at))} remain
                    </div>
                  {/if}
                </div>
                <img src="/{job.model}.png" alt="{job.model} printer" class="hidden md:block max-h-28" />
                <button class="btn btn-ghost md:btn-sm" on:click={() => cancelPrintModal.launchModal(job)}>
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

      <div class="col-span-4 lg:col-span-2 window">
        <div class="window-header">
          <Locate />
          <div>Quickstart</div>
        </div>
        <div class="window-content flex justify-center items-center h-full">
          <a href="/print" class="btn btn-xs btn-link h-fit">
            <div class="flex flex-col justify-center items-center gap-2">
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
          <a href="https://canvas.oregonstate.edu/courses/1877606" target="_blank" class="btn btn-xs btn-link h-fit">
            <div class="flex flex-col justify-center items-center gap-2">
              <GraduationCap strokeWidth={1.5} class="h-6 w-6" />
              <div>Club Canvas</div>
            </div>
          </a>
          <a href="https://discord.gg/B2VXatfzAF" target="_blank" class="btn btn-xs btn-link h-fit">
            <div class="flex flex-col justify-center items-center gap-2">
              <MessageCircle strokeWidth={1.5} class="h-6 w-6" />
              <div>Club Discord</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Overall machine stats -->
      <MachineStats {routeData} />
    </div>
  </div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />
