<script>
    import { onMount } from "svelte";
    import DragSlot from "./DragSlot.svelte";

    export let color = '#FFFFFF';
    
    export let obj, sim;

    let dragDiv, slotDiv;

    let run = false;

    const start = (event) => {
        event.handled = true;
        run = true;
    };

    const stop = (event) => {
        event.handled = true;
        run = false;
        sim.dragged(obj, dragDiv.getBoundingClientRect());
    };

    onMount(() => {
        obj.obj = slotDiv;
    });
</script>

{#if run}
    <DragSlot {color} {stop} {sim} bind:div={dragDiv}/>
{:else}
    <div
        class="fake-slot"
        style:display="none"
    />
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="real-slot"
    bind:this={slotDiv}
    on:mousedown={start}
    style:background-color={color}
    style:height={run ? '0' : 'var(--slot-size)'}
/>

<style>
    .fake-slot {
        width: 0;
        height: var(--slot-size);
    }

    .real-slot {
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
        cursor: var(--grab-hand);
    }
</style>
