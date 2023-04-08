<script lang="ts">
	import { onMount } from "svelte";
	import { ArrowLeft, ArrowRight } from "svelte-heros-v2";

    export let totalRows: number;
    export let lowerIndex: number;
    export let upperIndex: number;

    let pageSize = 8;
    let currentPage = 1;

    function changePage(newIndex: number) {
        currentPage = newIndex;
        lowerIndex = getLowerIndex();
        upperIndex = getUpperIndex();
    }

    export function getLowerIndex() {
        return pageSize * (currentPage - 1);
    }

    export function getUpperIndex() {
        return pageSize * currentPage > totalRows ? totalRows : pageSize * currentPage;
    }

    $: if (totalRows) {
        changePage(currentPage);
    }
</script>

<div class="flex flex-row items-center self-end">
    <button class="btn btn-sm btn-ghost disabled:bg-transparent" on:click={() => changePage(currentPage - 1)} disabled={lowerIndex === 0}>
        <ArrowLeft class="outline-none" />
    </button>
    <label class="w-36 text-center">Entries {upperIndex === 0 ? 0 : lowerIndex + 1} — {upperIndex}</label>
    <button class="btn btn-sm btn-ghost disabled:bg-transparent" on:click={() => changePage(currentPage + 1)} disabled={upperIndex === totalRows}>
        <ArrowRight class="outline-none" />
    </button>
</div>