<script lang="ts">
  import type { PageData } from "./$types";
  import { BarChart3, Bot, GraduationCap, Locate, MessageCircle, Play, Star, ThumbsUp } from "lucide-svelte";
  import { MachineStatus } from "$lib/types/models";
  import { formatDistanceToNowStrict } from "date-fns";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import MachineStats from "./MachineStats.svelte";

  export let data: PageData;
  const { permissions, routeData, session } = data;

  let cancelPrintModal: CancelPrintModal;

  $: activeJobs = routeData.filter(m => m.status === MachineStatus.WORKING);
</script>

<svelte:head>
  <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="flex flex-col gap-12 w-full">

  <div>
    <div class="text-2xl font-thin">Good morning, { (session.user.user_metadata.full_name).split(' ')[0] }</div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">

    

    <div class="lg:col-span-2 relative dark:bg-slate-400/10 backdrop-blur-xl rounded-lg ring-1 ring-yellow-500/75 flex flex-col gap-4 p-4">

      <div class="text-xl font-thin flex flex-row items-center gap-4 px-2">
        <span><ThumbsUp strokeWidth={1.5} size={'20pt'} /></span>
        <span>Announcements</span>
        <span class="text-yellow-500 w-full text-end font-medium">NEW</span>
      </div>

      <div class="w-full h-[1px] bg-white/10" />
      <div class="flex flex-col gap-2 text-sm font-extralight">
        <p>
          We will be consolidating tiers 1 & 1.5, tiers 2 & 2.5 at the start of Spring term. If you haven't gotten your tier certs on osu3d.io, please
          do so before the end of the term.
        </p>
        <div class="flex items-center gap-2 font-thin text-sm w-full text-end whitespace-nowrap"><div class="grow h-[1px] w-full bg-white/10" />Stephen Fike | March 14, 2024</div>
        <p>
          Something that's probably important, I don't know.
        </p>
        <div class="flex items-center gap-2 font-thin text-sm w-full text-end whitespace-nowrap"><div class="grow h-[1px] w-full bg-white/10" />Stephen Fike | March 12, 2024</div>
      </div>
    </div>

    <div class="lg:col-span-2 dark:bg-slate-400/10 backdrop-blur-xl rounded-lg ring-1 ring-white/10 flex flex-col gap-4 p-4">
      <div class="text-xl font-thin flex flex-row items-center gap-4 px-2"><span><Bot strokeWidth={1.5} size={'20pt'} /></span>Josef the Discord Bot</div>
      <div class="w-full h-[1px] bg-white/10" />
      <div class="flex flex-col gap-2 text-sm font-extralight">
        <p>
          You've already added your Discord username in the Settings page. Great!
        </p>
      </div>
    </div>

    <div class="lg:col-span-3 dark:bg-slate-400/10 backdrop-blur-xl rounded-lg ring-1 ring-white/10 flex flex-col gap-4 p-4">
      <div class="text-xl font-thin flex flex-row items-center gap-4 px-2"><span><Locate strokeWidth={1.5} size={'20pt'} /></span>Quickstart</div>
      <div class="w-full h-[1px] bg-white/10" />
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <a href="/" class="btn btn-ghost ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <Play />
            <div>Start Print</div>
          </div>
        </a>
        <a href="/" class="btn btn-ghost ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <BarChart3 />
            <div>My Stats</div>
          </div>
        </a>
        <a href="/" class="btn btn-ghost ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <GraduationCap />
            <div>Club Canvas</div>
          </div>
        </a>
        <a href="/" class="btn btn-ghost ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <MessageCircle />
            <div>Club Discord</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Overall machine stats -->
    <MachineStats routeData={routeData} />

    <!-- My Jobs -->
    <div class="lg:col-span-4 relative dark:bg-slate-400/10 backdrop-blur-xl rounded-lg ring-1 ring-white/10 flex flex-col gap-4 p-4">

      <div class="text-xl font-thin flex flex-row items-center gap-4 px-2">
        <Star strokeWidth={1.5} size={'20pt'} />
        <span>My Jobs</span>
      </div>

      <div class="w-full h-[1px] bg-white/10" />
      <div class="flex gap-4">
        {#each activeJobs as job}
          <div class="flex flex-col justify-center items-center gap-1">
            <div class="flex flex-col items-center">
              <div class="text-sm font-extralight">{job.nickname}</div>
              {#if job.done_at}
                <div class="text-xs font-light opacity-50">{formatDistanceToNowStrict(new Date(job.done_at))} remain</div>
              {/if}
            </div>
            <img src="/{job.model}.png" class="max-h-28" />
            
            <button class="btn btn-outline btn-warning btn-xs ring-1 ring-error/10 hover:bg-error/25 px-2"
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
  </div>
</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />