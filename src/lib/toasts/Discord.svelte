<script lang="ts">
  import toast_ from 'svelte-french-toast';
  import info from '$lib/images/info.png';
  export let toast: any;
</script>

<span class="relative">
  <img src={info} class="absolute right-0 top-0 -translate-y-1/2 translate-x-1/3 w-10 h-10 min-w-fit rounded-full bg-gray-700 p-1 outline outline-white/25" />
  Hey there, here's a quick tip, if you type in your Discord username under Settings, you'll receive automated
  pings about your prints. Neat!
  <button on:click={() => toast_.dismiss(toast.id)}>Thanks</button>
</span>