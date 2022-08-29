<script>
    import {onMount, onDestroy} from "svelte";

    import Editor from "./nodes/Editor.svelte";
    import {make_sim} from './sim/sim.js';

    let sim = make_sim();

    let save, load;

    let stop;

    onMount(() => {
        const first = window.localStorage.getItem("sim.state");
        if (first != null) {
            load(first);
            setTimeout(sim.redraw, 10);
        }

        stop = setInterval(() => {
            const res = save();
            window.localStorage.setItem("sim.state", res);
        }, 500);
    });

    onDestroy(() => {
        clearInterval(stop);
    });
</script>

<div class="main">
    <Editor {sim} bind:save={save} bind:load={load}/>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
