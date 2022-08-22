<script>
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    export let sim;

    let set = () => {};
</script>

<Node color={'#999'} sim={sim}>
    <Inputs>
    </Inputs>
    <Display>
        <input type="text" on:change={(e) => set(e.target.value)}/>
    </Display>
    <Outputs>
        <OutputSlot {sim} bind:set={set}/>
    </Outputs>
</Node>

<style>
    input {
        font-family: monospace;
        font-size: 200%;
        color: green;
        width: min-content;
        padding: 1em;
    }

    input:focus {
        outline: none;
    }
</style>
