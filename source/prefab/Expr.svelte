<script>
    import Display from "../nodes/Display.svelte";
    import Node from "../nodes/Node.svelte";

    import Inputs from "../nodes/Inputs.svelte";
    import InputSlot from "../nodes/InputSlot.svelte";

    import Outputs from "../nodes/Outputs.svelte";
    import OutputSlot from "../nodes/OutputSlot.svelte";

    export let sim, left, top;

    let value;

    const change = (e) => {
        value.set(e.target.innerText);
    };
</script>

<Node color={'#999'} {sim} {left} {top}>
    <Inputs>
    </Inputs>
    <Display>
        <div class="input">
            &quot;
            <span type="text" role="textbox" on:keyup={change}  contenteditable/>
            &quot;
        </div>
    </Display>
    <Outputs>
        <OutputSlot {sim} bind:value={value}/>
    </Outputs>
</Node>

<style>
    .input {
        width: max(100%, 3em);
        font-size: 200%;
        background-color: white;
        border-radius: 0.5em;
        border: 0;
        width: calc(100% - 0.5em);
        padding: 0.3em;
    }

    span {
        font-family: monospace;
        color: green;
        box-shadow: none;
        padding: 0.2em;
    }

    span:focus {
        outline: none;
    }
</style>
