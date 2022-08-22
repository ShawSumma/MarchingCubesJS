<script>
    import Editor from "./Editor.svelte";
    import Node from "./Node.svelte";

    import Inputs from "./Inputs.svelte";
    import InputSlot from "./InputSlot.svelte";

    import Outputs from "./Outputs.svelte";
    import OutputSlot from "./OutputSlot.svelte";
</script>

<div class="main">
    <Editor>
        <Node width={256} height={196} color='#FF77FF'>
            <Inputs>
                <InputSlot/>
            </Inputs>
            <Outputs>
                <OutputSlot/>
            </Outputs>
        </Node>
    </Editor>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
