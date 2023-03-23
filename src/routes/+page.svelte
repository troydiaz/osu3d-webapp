<script lang="ts">
    export let data;

    let { machines } = data;
</script>

<ul>
    {#each machines as machine}
        <li>{machine.name}</li>
    {/each}
</ul>