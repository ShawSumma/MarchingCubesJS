<script>
    import { onMount, onDestroy } from "svelte";
    
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    export let sim;

    export let inputs=0;
    export let outputs=0;

    export let fn = (...args) => {return Array(outputs)};

    export let display='Custom Node';

    const make = (n) => {
        let res = [];
        res.length = n;
        return res;
    }

    let values = make(inputs);

    let sets = make(outputs);

    let unsetListen;

    onMount(() => {
        unsetListen = sim.setListen(() => {
            let from = fn(...values);
            if (!Array.isArray(from) && outputs.length === 1) {
                from = [from];
            }
            for (let i = 0; i < from.length; i++) {
                sets[i](from[i]);
            }
        });
    });

    onDestroy(() => {
        unsetListen();
    });
</script>

<Node {sim}>
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
            <OutputSlot {sim} bind:set={sets[i]}/>
        {/each}
    </Outputs>
</Node>
