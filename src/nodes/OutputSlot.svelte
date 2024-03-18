<script>
    import OutputDragSlot from "./OutputDragSlot.svelte";

    export let color = '#FFFFFF';
    
    export let obj, sim;

    let run = false;

    const start = (event) => {
        run = true;
        event.stopImmediatePropagation();
    };

    const stop = (event) => {
        run = false;
        sim.dragged(obj, event.screenX, event.screenY);
        event.stopImmediatePropagation();
    };
</script>

{#if run}
    <OutputDragSlot {color} {stop} {sim}/>
{:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        on:mousedown={start}
        style:background-color={color}
    />
{/if}

<style>
    div {
        position: absolute;
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
        cursor: grab;
    }
</style>
