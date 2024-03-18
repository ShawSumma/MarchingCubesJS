<script>
    import Editor from "./nodes/Editor.svelte";
    import { Sim } from "./sim/sim";

    const sim = new Sim();
</script>

<div class="main">
    <Editor {sim}/>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
