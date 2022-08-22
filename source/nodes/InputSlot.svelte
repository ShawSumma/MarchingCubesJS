<script>
    import { onDestroy, onMount } from "svelte";
    
    export let color = '#FFFFFF';
    export let size = 30;
    export const data = null;
    export let sim;

    export const name = Symbol();

    export let value = null;

    let self;

    const click = (event) => {
        event.preventDefault();
        sim.select(self, name, Symbol.for("in"));
    };

    let unsetListen;

    onMount(() => {
        unsetListen = sim.setListen(() => {
            value = sim.get(name);
        });
    });

    onDestroy(() => {
        unsetListen();
    });
</script>

<div
    bind:this={self}
    on:click={click}
    style:background-color={color}
    style:width="{size}px"
    style:height="{size}px"
    style:border-radius="{size / 2}px"
/>
