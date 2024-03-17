<script>
    import Editor from "./nodes/Editor.svelte";
    import Ebrew from "./prefab/Ebrew.svelte";
    import {make_sim} from './sim/sim.js';

    let sim = make_sim();

    const options = Object.create(null);
    options.comp = Ebrew;
    options.args = (args) => {
        const ret = Object.create(null);
        ret.source = args;
        return ret;
    };
</script>

<div class="main">
    <Editor {sim} {options}/>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
