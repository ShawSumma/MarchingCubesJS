<script>
    import { onMount, onDestroy } from "svelte";
    
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    import {count, ebrew, world} from '../sim/interp.js';

    export let sim, left, top;

    export let source;

    let {inputs, outputs} = count(source);

    const make = (n) => {
        let res = [];
        res.length = n;
        return res;
    }

    let values = make(inputs);

    let results = make(outputs);

    let printData = '';

    const sym = Symbol();
    
    const calculate = () => {
        const args = values.map(x => x.get());
        try {
            var {print, outputs} = ebrew(input.innerText, world(args));
        } catch (e) {
            return;
        }
        printData = print.map((arg) => String(arg)).join('\n');
        for (const index in outputs) {
            results[index].set(outputs[index]);
        }
    };

    onMount(() => {
        for (const value of values) {
            value.handlers[sym] = calculate;
        }
        for (const result of results) {
            if (result == null) {
                return;
            }
        }
        calculate();
    });

    onDestroy(() => {
        for (const value of values) {
            delete value.handlers[sym];
        }
    });

    const keyup = () => {
        try {
            const res = count(input.innerText);
            inputs = res.inputs;
            outputs = res.outputs;
            calculate();
        } catch (e) {
            console.error(e);
        }
    };

    let input;
</script>

<Node color={'#999'} {sim} {left} {top}>
    <Inputs>
        {#each make(inputs) as _,i}
            <InputSlot {sim} bind:value={values[i]}/>
        {/each}
    </Inputs>
    <Display>
        <div class="out">
            <span type="text" role="textbox" bind:this={input} on:keyup={keyup} contenteditable>{source}</span>
            <p>{printData}</p>
        </div>
    </Display>
    <Outputs>
        {#each make(outputs) as _,i}
            <OutputSlot {sim} name={Symbol()} bind:value={results[i]}/>
        {/each}
    </Outputs>
</Node>

<style>
    .out {
        width: max-content;
        min-width: 3em;
        padding: 0.5em;
        color: green;
        border-radius: 0.5em;
        background-color: 1em;
        background-color: white;
    }

    span {
        font-size: 150%;
        outline: none;
    }
</style>
