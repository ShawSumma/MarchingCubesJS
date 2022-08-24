<script>
    import { onDestroy, onMount } from "svelte";
    
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";
    
    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";
    
    import Outputs from "../nodes/Outputs.svelte";
    
    export let sim, left, top;

    let value;

    let str;

    const sym = Symbol();

    onMount(() => {
        value.handlers[sym] = () => {
            str = String(value.get());
        };
    });

    onDestroy(() => {
        delete value.handlers[sym];
    })
</script>

<Node color={'#999'} sim={sim} {left} {top}>
    <Inputs>
        <InputSlot {sim} bind:value={value}/>
    </Inputs>
    <Display>
        <iframe src={str} title={str}/>
    </Display>
    <Outputs>
    </Outputs>
</Node>

<style>
    iframe {
        width: 640px;
        height: 480px;
    }
</style>
