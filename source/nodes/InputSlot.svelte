<script>
    import { onMount } from "svelte";
    
    export let color = '#FFFFFF';
    export let size = 30;
    export const data = null;
    export let sim;

    export let name;

    let self;

    const click = (event) => {
        event.preventDefault();
        sim.select(self, name, Symbol.for("in"));
    };
</script>

<div
    bind:this={self}
    on:click={click}
    id={name}
    style:background-color={color}
    style:width="{size}px"
    style:height="{size}px"
    style:border-radius="{size / 2}px"
/>
