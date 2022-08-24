<script>
    import { onMount, onDestroy } from "svelte";
    
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    export let sim, left, top;

    export let inputs=0;
    export let outputs=0;

    export let fn;

    export let display='Custom Node';

    const make = (n) => {
        let res = [];
        res.length = n;
        return res;
    }

    let values = make(inputs);

    let results = make(outputs);

    const sym = Symbol();

    onMount(() => {
        for (const value of values) {
            value.handlers[sym] = () => {
                fn(values.map(x => x.get()), (got) => {
                    if (!Array.isArray(got)) {
                        got = [got];
                    }
                    for (const index in got) {
                        results[index].set(got[index]);
                    }
                });
            };
        }
    });

    onDestroy(() => {
        for (const value of values) {
            delete value.handlers[sym];
        }
    });
</script>

<Node color={'#999'} {sim} {left} {top}>
    <Inputs>
        {#each make(inputs) as _,i}
            <InputSlot {sim} bind:value={values[i]}/>
        {/each}
    </Inputs>
    <Display>
        <p>{display}</p>
    </Display>
    <Outputs>
        {#each make(outputs) as _,i}
            <OutputSlot {sim} bind:value={results[i]}/>
        {/each}
    </Outputs>
</Node>
