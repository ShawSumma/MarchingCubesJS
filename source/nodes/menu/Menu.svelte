<script>
    import { onDestroy, onMount } from "svelte";

    export let select;

    export let pos;

    let self, input;

    let find = '';

    const wants = (name) => {
        let re = ['.*'];
        for (const char of find) {
            re.push(char);
            re.push('.*');
        }
        return name.match(new RegExp(re.join(''), 'ig')) != null;
    };

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
        <span type="text" role="textbox" on:keydown={change} bind:this={input} contenteditable/>
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
        padding: 0.5em;
        background-color: 1em;
        background-color: #999999;
    }

    span {
        width: max-content;
        min-width: 3em;
        padding: 0.5em;
        outline: none;
        font-size: 150%;
        color: green;
        background-color: 1em;
        background-color: white;
    }
</style>
