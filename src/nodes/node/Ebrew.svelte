<script>
    import { onMount } from "svelte";
    
    import Display from "./Display.svelte";
    import Node from "./Node.svelte";

    import Slot from "../slot/Slot.svelte";
    import Slots from "../slot/Slots.svelte";

    export let sim, left, top, node;

    export let key = 0;

    let span;
    
    let src = node.src;

    let str = '';

    const update = (event) => {
        src = span.innerText;
        node.src = span.innerText;
        node.update();
    };

    node.ping = () => {
        str = node.print;
        key += 1;
    };

    onMount(() => {
        update();
    });
</script>

<Node color={'#CCC'} {sim} {left} {top}>
    {#key key}
        {#if node.inputs.length !== 0}
            <Slots>
                {#each node.inputs as obj}
                    <Slot {obj} {sim}/>
                {/each}
            </Slots>
        {/if}
    {/key}
    <Display>
        <div class="entry">
            <span
                type="text"
                role="textbox"
                bind:this={span}
                on:keyup={update}
                tabindex="-1"
                contenteditable
            >
                {src}
            </span>
        </div>
        {#if str !== ''}
            <div class="entry">
                <p>{str}</p>
            </div>
        {/if}
    </Display>
    {#key key}
        {#if node.outputs.length !== 0}
            <Slots>
                {#each node.outputs as obj}
                    <Slot {obj} {sim}/>
                {/each}
            </Slots>
        {/if}
    {/key}
</Node>

<style>
    .entry {
        color: green;
        background-color: white;
        width: auto;
        padding: var(--line-size);
        min-width: 3em;
        min-height: 1em;
    }

    p {
        font-size: var(--font-size);
        margin: 0;
        min-height: 100%;
    }

    span {
        font-size: var(--font-size);
        min-height: 100%;
    }
</style>
