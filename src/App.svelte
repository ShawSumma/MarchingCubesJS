<script>
    import Editor from "./nodes/Editor.svelte";
    import { Sim } from "./sim/sim";

    const sim = new Sim();

    const up = () => {
        document.body.style.setProperty('--grab-hand', 'grab');
    };

    const down = () => {
        document.body.style.setProperty('--grab-hand', 'grabbing');
    };
</script>

<svelte:body
    on:mouseup={up}
    on:mousedown={down}
/>

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
