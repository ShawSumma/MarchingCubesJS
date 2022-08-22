<script>
    import { onDestroy, onMount } from "svelte";

    export let sim;

    let lines = [];

    let unsetDraw;

    onMount(() => {
        unsetDraw = sim.setDraw((data) => {
            lines = data;
        });
    });

    onDestroy(() => {
        unsetDraw();
    });
</script>

<svg viewBox="0 0 {document.body.scrollWidth} {document.body.scrollHeight}">
    {#each lines as line}
        <line x1={line[0].x()} y1={line[0].y()} x2={line[1].x()} y2={line[1].y()}></line>
    {/each}
</svg>

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
        stroke: #FFFFFF;
    }

    svg line {
        stroke-width: 2px;
    }
</style>
