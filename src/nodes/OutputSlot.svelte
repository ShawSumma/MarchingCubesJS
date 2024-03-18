<script>
    import OutputDragSlot from "./OutputDragSlot.svelte";

    export let color = '#FFFFFF';
    
    export let obj;

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
    <OutputDragSlot {color} {stop}/>
{:else}
    <div
        class="not"
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
    }
</style>
