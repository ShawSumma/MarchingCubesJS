<script>
    import Editor from "./nodes/Editor.svelte";
    import Expr from "./prefab/Expr.svelte";

    import Print from "./prefab/Print.svelte";

    import Lines from "./nodes/Lines.svelte";

    import {make_sim} from './sim/sim.js';

    let sim = make_sim();
</script>

<div class="main">
    <Lines {sim}/>
    <Editor>
        <Expr {sim}/>
        <Print {sim}/>
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
