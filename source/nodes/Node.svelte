<script>
    import { onMount } from "svelte";

    export let left=0, top=0, color=`#FFAAFF`;

    export let sim;

    let node;


    const update = () => {
        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
        sim.redraw();
    };

    let dragFrom = null;

    const dragEnd = () => {
        dragFrom = null;
    };

    const dragBegin = (event) => {
        dragFrom = [event.clientX, event.clientY];
    };

    const dragEvent = (event) => {
        if (dragFrom == null) {
            return undefined;
        }
        const nextDragFrom = [event.clientX, event.clientY];
        const diff = [nextDragFrom[0] - dragFrom[0], nextDragFrom[1] - dragFrom[1]];
        left += diff[0];
        top += diff[1];
        dragFrom = nextDragFrom;
        update();
    };

    onMount(() => {
        update();
    });
</script>

<svelte:window  on:mousemove={dragEvent}/>
<div class="node" bind:this={node} on:mousedown={dragBegin} on:mouseup={dragEnd} style:background-color={color}>
    <slot/>
</div>

<style>
    .node {
        position: absolute;
        border-radius: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>