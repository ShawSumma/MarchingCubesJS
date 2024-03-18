<script>
    import InputDragSlot from "./InputDragSlot.svelte";
    import DragSlot from "./OutputDragSlot.svelte";

    export let color = '#FFFFFF';
    
    export let obj, sim;

    let run = false;

    const click = () => {
        obj.select();
    };

    const start = (event) => {
        run = true;
        event.stopImmediatePropagation();
    };

    const stop = (event) => {
        run = false;
        event.stopImmediatePropagation();
    };
</script>

{#if run}
    <InputDragSlot {color} {stop} lines={sim.lines}/>
{:else}
    <div
        on:mousedown={start}
        style:background-color={color}
    />
{/if}

<style>
    div {
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
    }
</style>
