<script>
    import { Eval } from "../sim/sim";
    import Ebrew from "./node/Ebrew.svelte";
    import Lines from "./Lines.svelte";
    import Menu from "./Menu.svelte";

    export let sim;

    let menu;

    let pos = null;

    let elements = [];

    const select = (name) => {
        elements.push(
            {
                left: pos[0],
                top: pos[1],
                node: new Eval(sim, name),
            }
        );
        elements = elements;
        pos = null;
    };

    const ctxmenu = (event) => {
        event.preventDefault();
        pos = [event.clientX, event.clientY];
        return false;
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:contextmenu={ctxmenu}>
    <Lines {sim}/>
    {#each elements as {left, top, node}}
        <Ebrew {sim} {left} {top} {node}/>
    {/each}
    <div bind:this={menu}>
        {#if pos != null}
            <Menu {pos} {select}/>
        {/if}
    </div>
</div>

<style>
    .editor {
        width: 100%;
        height: 100%;
        user-select: none;
    }
</style>
