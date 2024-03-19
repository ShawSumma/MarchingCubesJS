<script>
    import InputDragSlot from "./InputDragSlot.svelte";

    export let color = '#FFFFFF';
    
    export let obj, sim;

    let run = false;

    const click = () => {
        obj.select();
    };

    const start = (event) => {
        run = true;
        event.handled = true;
    };

    const stop = (event) => {
        run = false;
        event.handled = true;
    };
</script>

{#if run}
    <InputDragSlot {color} {stop} {sim}/>
{:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
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
        cursor: var(--grab-hand);
    }
</style>
