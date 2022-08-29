<script>
    import { onMount, onDestroy } from "svelte";
    
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    import {count} from '../sim/interp.js';

    export let sim, left, top;

    export let source;

    export let name;

    let span;
    
    let namesInput = [];
    let namesOutput = [];

    if (sim.nodes[name] == null) {
        sim.nodes[name] = Object.create(null);
        sim.nodes[name].in = namesInput;
        sim.nodes[name].out = namesOutput;
        sim.nodes[name].src = source;
        sim.nodes[name].text = '';
    }

    namesInput = sim.nodes[name].in;
    namesOutput = sim.nodes[name].out;
    source = sim.nodes[name].src;

    const update = () => {
        source = span.innerText;
        sim.nodes[name].src = source;
        try {
            var {inputs, outputs} = count(source);
        } catch (e) {
            console.log(e);
            return;
        }
        while (inputs > namesInput.length) {
            const tmp = `${name}-${namesInput.length}`;
            namesInput.push(tmp);
        }
        while (outputs > namesOutput.length) {
            const tmp = `${name}-${namesOutput.length}`;
            sim.from[tmp] = name;
            namesOutput.push(tmp);
        }
        namesInput.length = inputs;
        namesOutput.length = outputs;
        console.log(namesInput, namesOutput);
    };

    const keyup = () => {
        update();
    };

    let key = Symbol();

    onMount(() => {
        span.innerText = source;
        update();
        sim.update[name] = () => {
            key = Symbol();
        };
    });

    onDestroy(() => {
        delete sim.update[name];
    });
</script>

<Node color={'#999'} {sim} bind:left={left} bind:top={top}>
    <Inputs>
        {#each namesInput as name}
            {#key name}
                <InputSlot {sim} {name}/>
            {/key}
        {/each}
    </Inputs>
    <Display>
        <div class="out">
            <span type="text" role="textbox" bind:this={span} on:keyup={keyup} contenteditable></span>
            {#key key}
                <p>{sim.nodes[name].text}</p>
            {/key}
        </div>
    </Display>
    <Outputs>
        {#each namesOutput as name}
            {#key name}
                <OutputSlot {sim} {name}/>
            {/key}
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
