<script>
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";
    
    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";
    
    import Outputs from "../nodes/Outputs.svelte";
    
    export let sim;

    let value;
</script>

<Node color={'#999'} sim={sim}>
    <Inputs>
        <InputSlot {sim} bind:value={value}/>
    </Inputs>
    <Display>
        <p>{value}</p>
    </Display>   
    <Outputs>
    </Outputs>
</Node>

<style>
    p {
        font-family: monospace;
        font-size: 200%;
        color: green;
        user-select: none;
    }
</style>
