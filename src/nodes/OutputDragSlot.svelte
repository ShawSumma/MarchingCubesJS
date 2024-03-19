<script>
    import { onDestroy, onMount } from "svelte";

    export let sim, stop, color;
    let div;

    let x = 0;
    let y = 0;
    let xb = 0;
    let yb = 0;

    let ln = sim.lines.add({});

    const move = (event) => {
        x += event.movementX;
        y += event.movementY;
        sim.lines.move(ln, { 
            x1: xb,
            y1: yb,
            x2: xb + x,
            y2: yb + y,
        });
    };

    onMount(() => {
        const {top, left, bottom, right} = div.getBoundingClientRect();
        xb = (left + right) * 0.5;
        yb = (top + bottom) * 0.5;
        document.body.userSelect = 'none';
    });

    onDestroy(() => {
        sim.lines.remove(ln);
        delete document.body.userSelect;
    });
</script>

<svelte:window 
    on:mouseup={stop}
    on:mousemove={move}
/>

<div
    bind:this={div}
    style:background-color={color}
    style:transform="translate({x}px, {y}px)"
/>

<style>
    div {
        position: absolute;
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
        cursor: var(--grab-hand);
    }
</style>
