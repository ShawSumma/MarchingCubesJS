<script>
    import { onMount } from "svelte";

    export let left=0, top=0, color=`#FFAAFF`;

    export let sim;

    let node, body;

    const update = () => {
        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
        sim.redraw();
    };

    let dragFrom = null;

    export const stopDrag = () => {
        dragFrom = null;
    };

    const dragEnd = () => {
        dragFrom = null;
    };

    const dragBegin = (event) => {
        const target = event.target;
        console.log(target);
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

<svelte:window on:mousemove={dragEvent}/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="node" bind:this={node} on:mousedown={dragBegin} on:mouseup={dragEnd} style:background-color={color}>
    <div class="body" bind:this={body} style:background-color={color}>
        <slot/>
    </div>
</div>

<style>
    .node {
        color: white;
        position: absolute;
        width: max-content;
        height: max-content;
        flex-direction: row;
        justify-content: space-evenly;
        background-color: #CCC;
        z-index: 0;
    }
    
    .body {
        display: flex;
        flex-direction: row;
    }
</style>