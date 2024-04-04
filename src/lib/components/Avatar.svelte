<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
  import { UserCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition';

	export let url: string | null
	export let supabase: SupabaseClient

	let avatarUrl: string | null = null

	const downloadImage = async (path: string) => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path)

			if (error) {
				throw error
			}

			const url = URL.createObjectURL(data)
			avatarUrl = url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}

	$: if (url) downloadImage(url)
</script>

<div class="avatar w-16 h-16">
	{#if avatarUrl}
		<div class="w-16 rounded-full ring-2 ring-base-content ring-offset-base-100 ring-offset-2" transition:fly={{ y: 10, duration: 500 }}>
			<img
				src={avatarUrl}
				alt={avatarUrl ? 'Avatar' : 'No image'}
			/>
		</div>
	{:else if !url}
		<UserCircle class="stroke-1 w-16 h-16" />
	{/if}
</div>