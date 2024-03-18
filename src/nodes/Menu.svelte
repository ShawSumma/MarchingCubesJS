<script>
    import { onMount } from "svelte";

    export let select;

    export let pos;

    let self, input;

    let find = '';

    onMount(() => {
        self.style.top = `${pos[1]}px`;
        self.style.left = `${pos[0]}px`;
        input.focus();
    });

    const change = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            select(event.target.innerText);
        }
    }
</script>

<div class="menu" bind:this={self}>
    <div class="body">
        <span class="text" type="text" role="textbox" tabindex="-1" on:keydown={change} bind:this={input} contenteditable/>
    </div>
</div>

<style>
    .menu {
        color: white;
        position: absolute;
        width: max-content;
        height: max-content;
    }

    .body {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: var(--line-size);
        background-color: #CCC;
    }

    .text {
        min-width: 3em;
        padding: var(--line-size);
        color: green;
        background-color: #FFF;
        font-size: var(--font-size);
    }
</style>
