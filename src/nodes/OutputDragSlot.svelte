<script>
    export let stop, color;

    let x = 0;
    let y = 0;

    const move = (event) => {
        x += event.movementX;
        y += event.movementY;
    };
</script>

<svelte:window 
    on:mouseup={stop}
    on:mousemove={move}
/>

<div
    class="drag"
    style:background-color={color}
    style:transform="translate({x}px, {y}px)"
/>

<style>
    div {
        position: absolute;
        width: var(--slot-size);
        height: var(--slot-size);
        border-radius: calc(var(--slot-size) * 0.5);
    }
</style>
