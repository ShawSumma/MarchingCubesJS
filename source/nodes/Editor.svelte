<script>
    import Lines from "./Lines.svelte";
    import Menu from "./menu/Menu.svelte";
    
    import Ebrew from '../prefab/Ebrew.svelte';

    export let sim;

    export const save = () => {
        const obj = Object.create(null);
        obj.count = sim.count;
        obj.lines = sim.cache;
        obj.from = sim.from;
        obj.calc = sim.node;
        obj.visual = elements;
        return JSON.stringify(obj);
    };

    export const load = (str) => {
        const obj = JSON.parse(str);
        sim.count = obj.count;
        sim.cache = obj.lines;
        sim.from = obj.from;
        sim.node = obj.calc;
        elements = obj.visual;
    };

    let menu;

    let pos = null;

    let elements = [];
    let dom = [];
    let last = null;

    const select = (name) => {
        if (pos == null) {
            return;
        }
        const obj = Object.create(null);
        obj.source = name;
        obj.left = pos[0];
        obj.top = pos[1];
        obj.name = sim.sym();
        elements.push(obj);
        dom.push(null);
        pos = null;
        elements = elements;
    };

    const ctxmenu = (event) => {
        event.preventDefault();
        let index = 0;
        for (const element of dom) {
            if (element != null && element.contains(event.target)) {
                if (last == null || last !== element) {
                    last = element;
                } else {
                    elements.splice(index, 1);
                    element.remove();
                }
                return null;
            }
            index += 1;
        }
        pos = [event.clientX, event.clientY];
        return false;
    };

    const click = (event) => {
        if (event.button === 2) {
            pos = [event.clientX, event.clientY];
        } else {
            if (pos != null && !menu.contains(event.target)) {
                pos = null;
            }
        }
    };
</script>

<div class="editor" on:contextmenu={ctxmenu} on:click={click}>
    <Lines {sim}/>
    {#each elements as element, input}
        <div bind:this={dom[input]}>
            <Ebrew {sim} {...element} bind:left={element.left} bind:top={element.top}/>
        </div>
    {/each}
    <div bind:this={menu}>
        {#if pos != null}
            <Menu {pos} {select}/>
        {/if}
    </div>
</div>

<style>
    .editor {
        width: 100%;
        height: 100%;
    }
</style>
