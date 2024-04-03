<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
  import { UserCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte'

	export let url: string | null
	export let supabase: SupabaseClient

	let avatarUrl: string | null = null
	let uploading = false
	let files: FileList

	const dispatch = createEventDispatcher()

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

	const uploadAvatar = async () => {
		try {
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${Math.random()}.${fileExt}`

			const { error } = await supabase.storage.from('avatars').upload(filePath, file)

			if (error) {
				throw error
			}

			url = filePath
			console.log('The new filepath is ', url);
			setTimeout(() => {
				dispatch('upload')
			}, 100)
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}

	$: if (url) downloadImage(url)
</script>

<div class="flex flex-col gap-4 justify-between items-center w-full h-full">
	<label for="avatar_url" class="label">
		<span class="label-text">Profile Picture</span>
	</label>
	<div class="w-fit h-full rounded-full">
		{#if avatarUrl}
			<img
				src={avatarUrl}
				alt={avatarUrl ? 'Avatar' : 'No image'}
				class="w-40 h-40 object-cover rounded-full overflow-hidden"
			/>
		{:else}
			<UserCircle class="stroke-1 w-40 h-40" />
		{/if}
	</div>
	<input type="hidden" name="avatar_url" value={url} />

	<div>
		<label class="btn btn-ghost" for="single">
			{uploading ? 'Uploading ...' : 'Upload'}
		</label>
		<input
			hidden
			type="file"
			id="single"
			accept="image/*"
			bind:files
			on:change={uploadAvatar}
			disabled={uploading}
		/>
	</div>
</div>