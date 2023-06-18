<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, InformationCircle } from 'svelte-heros-v2';
	import type { PageData, ActionData } from "./$types.js";

	export let data: PageData;
	export let form: ActionData;

	let { session, profile } = data;

	let profileForm: any;
	let loading = false;

	let full_name: string | null = profile?.full_name || null;
	let discord: string | null = profile?.discord || null;

	function handleSubmit() {
			loading = true;
			return async() => {
					loading = false;
			}
	}
</script>

<div class="flex flex-col space-y-8 lg:my-12 w-full">
	<a href="/dashboard" class="uppercase text-xl w-fit"><ArrowLeft class="inline" /><span class="ml-4 align-middle">Dashboard</span></a>
	<div class="relative overflow-hidden flex flex-row justify-between rounded-2xl p-12 shadow-lg bg-neutral">
			<div class="flex flex-col justify-between items-start space-y-12">
					<div class="flex flex-col space-y-2">
							<span class="text-5xl font-bold">Account Settings</span>
							<!-- <span class="text-2xl italic"></span> -->
					</div>
					
			</div>
			<!-- <img src="/safety-man.png" class="absolute right-0 -top-8 blur"> -->
	</div>
	<div class="divider"></div>

	

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
			use:enhance={handleSubmit}
			bind:this={profileForm}
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
				<input id="full_name" name="full_name" type="text" class="input w-full max-w-xs" value={form?.full_name ?? full_name} />
			</div>
	
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label">
					<span class="label-text">Discord username</span>
				</label>
				<input id="discord" name="discord" type="text" class="input w-full max-w-xs" value={form?.discord ?? discord} />
			</div>
	
			<div >
				<button
					type="submit"
					class="btn"
					disabled={loading}
				>Save</button>
			</div>
		</form>
	</div>
</div>