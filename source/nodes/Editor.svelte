<script>
    import Lines from "./Lines.svelte";
    import Menu from "./Menu.svelte";
    
    export let sim, options;

    let menu;

    let pos = null;

    let elements = [];
    let dom = [];
    let last = null;

    const select = (name) => {
        const obj = Object.create(null);
        obj.comp = options.comp;
        obj.args = options.args(name);
        obj.left = pos[0];
        obj.top = pos[1];
        elements.push(obj);
        dom.push(null);
        pos = null;
        elements = elements;
    };

    const ctxmenu = (event) => {
        event.preventDefault();
        for (const element of dom) {
            if (element != null && element.contains(event.target)) {
                if (last == null || last !== element) {
                    last = element;
                } else {
                    element.remove();
                }
                return null;
            }
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
            <svelte:component this={element.comp} sim={sim} left={element.left} top={element.top} {...element.args}></svelte:component>
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
