<script>
    import { onMount, onDestroy } from "svelte";
    
    import Display from "./Display.svelte";
    import Node from "./Node.svelte";

    import Inputs from "./Inputs.svelte";
    import InputSlot from "./InputSlot.svelte";

    import Outputs from "./Outputs.svelte";
    import OutputSlot from "./OutputSlot.svelte";

    export let sim, left, top, node;

    let print = '';
    let key = Symbol();

    onMount(() => {
        node.update();
    });

    node.onupdate = () => {
        print = node.print;
        key = Symbol();
    };
</script>

<Node color={'#CCC'} {sim} {left} {top}>
    {#key key}
        {#if node.inputs.length !== 0}
            <Inputs>
                {#each node.inputs as obj}
                    <InputSlot {obj}/>
                {/each}
            </Inputs>
        {/if}
        <Display>
            <div class="entry">
                <span class="text" type="text" role="textbox" tabindex="-1" on:pointerleave={()=>node.update()} contenteditable>{node.src}</span>
            </div>
            {#if print !== ''}
                <div class="entry">
                    <p>{print}</p>
                </div>
            {/if}
        </Display>
        {#if node.outputs.length !== 0}
            <Outputs>
                {#each node.outputs as obj}
                    <OutputSlot {obj}/>
                {/each}
            </Outputs>
        {/if}
    {/key}
</Node>

<style>
    .entry {
        width: max-content;
        color: green;
        background-color: white;
        width: auto;
        padding: var(--line-size);
        min-width: 3em;
    }

    p {
        font-size: var(--font-size);
        margin: 0;
    }

    span {
        font-size: var(--font-size);
    }
</style>
