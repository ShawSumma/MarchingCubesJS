<script>
    import { onDestroy } from "svelte";

    export let name;
    
    export let color = '#FFF';
    export let sim;

    export const value = sim.name(name);

    let self;

    const click = (event) => {
        event.preventDefault();
        sim.select(self, name, Symbol.for("in"));
    };

    onDestroy(() => {
        sim.remove(self, name, Symbol.for("in"));
    });
</script>

<div
    bind:this={self}
    on:click={click}
    style:background-color={color}
/>

<style>
    div {
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
    }
</style>
