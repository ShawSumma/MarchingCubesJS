<script>
    export let color = '#FFFFFF';
    export let size = 30;
    export const data = null;
    export let sim;

    let name = Symbol();

    let self;

    export let set = (value) => {
        console.log(value);
        sim.set(name, value);
    };

    const click = (event) => {
        event.preventDefault();
        sim.select(self, name, Symbol.for("out"));
    };

    set(null);
</script>

<div
    bind:this={self}
    on:click={click}
    style:background-color={color}
    style:width="{size}px"
    style:height="{size}px"
    style:border-radius="{size / 2}px"
/>
