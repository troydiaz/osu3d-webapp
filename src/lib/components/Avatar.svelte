<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
  import { UserCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte'

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

<div class="w-full h-full aspect-square">
	{#if avatarUrl}
		<div class="w-fit h-full rounded-full overflow-hidden">
			<img
				src={avatarUrl}
				alt={avatarUrl ? 'Avatar' : 'No image'}
				class="w-full h-full object-cover"
			/>
		</div>
	{:else}
		<UserCircle class="stroke-1 w-full h-full opacity-25" />
	{/if}
</div>