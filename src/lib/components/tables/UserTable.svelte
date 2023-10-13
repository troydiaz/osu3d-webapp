<script lang="ts">
	import { goto } from "$app/navigation";
	import { PermCategory, PermFlag, getDateAndTime, hasPermission } from "$lib/helpers";
	import type { UserLevel } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { ArrowLongRight, ChevronDown, QuestionMarkCircle } from "svelte-heros-v2";
	    
    export let userLevels: (UserLevel & { checked: boolean, previousLevel: number })[];

    $: selectedUsers = userLevels.filter(f => f.checked && f.previousLevel !== f.level);
    $: adminUsers = userLevels.filter(u => u.level === -1);

    let filterText = '';

    $: filteredUsers = filterText.trim() !== '' ? userLevels.filter(u => u.full_name?.toLowerCase().includes(filterText.toLowerCase().trim()) || u.email?.toLowerCase().includes(filterText.toLowerCase().trim())) : userLevels;

    let lowerIndex: number = 0;
    let upperIndex: number = 0;

    function selectUserId(userId: string) {
        let userIndex = userLevels.findIndex(u => u.user_id === userId);
        if (userIndex !== -1) userLevels[userIndex].checked = userLevels[userIndex].previousLevel !== userLevels[userIndex].level;
    }
</script>

<div class="flex flex-col gap-12">
    <!-- Admins table -->
    <div class="flex flex-col gap-4">
        <div class="flex flex-row justify-start items-center">
            <div class="font-thin text-3xl">Current Administrators</div>
            <div class="tooltip ml-4" data-tip="Please note, admin permissions can ONLY be modified by manipulating the database directly.">
                <QuestionMarkCircle size={'24px'} class="text-blue-600 tooltip" />
            </div>
            <div class="divider divider-horizontal"></div>
            <div>{adminUsers.length} Entries Total</div>
            <div class="grow"></div>
    
        </div>
        <table class="table table-compact min-w-full shadow-lg bg-base-100 outline outline-1 outline-base-content/10 overflow-hidden">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Permission Level</th>
                </tr>
            </thead>
            <tbody>
                {#each adminUsers as user, index}
                <tr>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                        <select value={user.level} class="select select-sm select-bordered bg-white" disabled>
                            <option value={0}>No Permissions (0)</option>
                            <option value={1}>Tier 1 Certified (1)</option>
                            <option value={2}>Tier 2 Certified (2)</option>
                            <option value={3}>Maintenance (3)</option>
                            <option value={-1}>Administrator (-1)</option>
                        </select>
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    
    <!-- Users table -->
    <div class="flex flex-col gap-4">
        <div class="flex flex-row justify-start items-center">
            <div class="font-thin text-3xl">All User Accounts</div>
            <div class="tooltip ml-4" data-tip="Select a new permission level for a user and toggle the checkbox to stage the change for a database commit.">
                <QuestionMarkCircle size={'24px'} class="text-blue-600 tooltip" />
            </div>
            <div class="divider divider-horizontal"></div>
            <div>{userLevels.length} Entries Total</div>
            <div class="divider divider-horizontal"></div>
            <div class="grow relative">
                <input class="input input-sm input-bor w-full bg-base-100 outline outline-1 outline-base-content/10" type="text" placeholder="Filter by name or email..." bind:value={filterText} />
                <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 opacity-50" on:click={() => filterText = ''}>Clear</button>
            </div>
            <div class="divider divider-horizontal"></div>
            <Paginate totalRows={filteredUsers.length} bind:lowerIndex bind:upperIndex />
        </div>
        {#if lowerIndex !== undefined && upperIndex !== undefined}
        <table class="table table-compact min-w-full shadow-lg bg-base-100 outline outline-1 outline-base-content/10 overflow-hidden">
            <thead>
                <tr>
                    <th></th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Joined On <ChevronDown class="inline" size={'16px'} /></th>
                    <th>Last Update</th>
                    <th>Permission Flags</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredUsers.slice(lowerIndex, upperIndex) as user, index}
                <tr class="transition {user.checked ? 'bg-success text-success-content' : 'bg-base-100 outline outline-1 outline-base-content/10 text-neutral-content'}">
                    <td><input type="checkbox" class="checkbox bg-base-100 align-middle disabled:bg-opacity-25" bind:checked={user.checked} disabled={user.level === -1} /></td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{getDateAndTime(user.created_at)}</td>
                    <td>{getDateAndTime(user.updated_at)}</td>
                    <td>
                        <button class="btn btn-sm" on:click={() => goto(`/users/${user.user_id}`)} disabled={hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)}>Edit Flags</button>
                        <!-- <select bind:value={user.level} class="select select-sm text-neutral-content" disabled={user.level === -1} on:change={() => selectUserId(user.user_id)}>
                            <option value={0}>No Permissions (0)</option>
                            <option value={1}>Tier 1 Certified (1)</option>
                            <option value={2}>Tier 2 Certified (2)</option>
                            <option value={3}>Maintenance (3)</option>
                            <option value={-1} disabled>Administrator (-1)</option>
                        </select> -->
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}
    </div>
    
    <!-- Pending changes table -->
    <div class="flex flex-col gap-4">
        <div class="flex flex-row justify-start items-center">
            <div class="font-thin text-3xl">Pending Changes</div>
            <div class="tooltip ml-4" data-tip="This table gives you a preview of all changes that will be made to the database. Click COMMIT to finalize the changes.">
                <QuestionMarkCircle size={'24px'} class="text-blue-600 tooltip" />
            </div>
            <div class="divider divider-horizontal"></div>
            <div>{selectedUsers.length} Entries Total</div>
            <div class="divider divider-horizontal"></div>
            <form id="change-perms-form" method="POST" action="?/changePermsMulti"></form>
            <input type="hidden" form="change-perms-form" name="permArray" value={JSON.stringify(selectedUsers.map(u => { return { id: u.user_id, newPermLevel: u.level } }))} />
            <button class="btn btn-sm btn-success" form="change-perms-form" type="submit" disabled={selectedUsers.length === 0}>Save Changes</button>
            <div class="grow"></div>
        </div>
        <table class="table table-compact min-w-full shadow-lg bg-base-100 outline outline-1 outline-base-content/10 overflow-hidden">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Current Level</th>
                    <th></th>
                    <th>New Level</th>
                </tr>
            </thead>
            <tbody>
                {#each selectedUsers as user, index}
                <tr>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                        <select value={user.previousLevel} class="select select-sm" disabled>
                            <option value={0}>No Permissions (0)</option>
                            <option value={1}>Tier 1 Certified (1)</option>
                            <option value={2}>Tier 2 Certified (2)</option>
                            <option value={3}>Maintenance (3)</option>
                            <option value={-1}>Administrator (-1)</option>
                        </select>
                    </td>
                    <td>
                        <div>
                            <!-- <span class="font-bold text-xl uppercase text-error">will be changed to</span> -->
                            <ArrowLongRight size={'32px'} class="text-success" />
                        </div>
                    </td>
                    <td>
                        <select value={user.level} class="select select-sm" disabled>
                            <option value={0}>No Permissions (0)</option>
                            <option value={1}>Tier 1 Certified (1)</option>
                            <option value={2}>Tier 2 Certified (2)</option>
                            <option value={3}>Maintenance (3)</option>
                            <option value={-1}>Administrator (-1)</option>
                        </select>
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>