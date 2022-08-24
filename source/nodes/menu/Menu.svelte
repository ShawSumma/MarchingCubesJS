<script>
    import { onDestroy, onMount } from "svelte";

    export let select;

    export let pos;
    export let sim = null;

    export let options;

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

    const enter = () => {
        for (const opt of options) {
            if (wants(opt.name)) {
                return select(opt);
            }
        }
        return select(null);
    };

    const clear = setInterval(() => {
        find = input.value;
    }, 50);

    onDestroy(() => {
        clearInterval(clear);
    });

    sim;
</script>

<div class="menu" bind:this={self}>
    <div class="body">
        <input bind:this={input} on:enter={() => enter()}/>
        {#key find}
            {#each options as opt}
                {#if wants(opt)}
                <div class="entry">
                    <button on:click={() => select(opt)}>{opt}</button>
                </div>
                {/if}
            {/each}
        {/key}
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
        padding: 1em;
        background-color: 1em;
        background-color: #999999;
    }

    .entry {
        padding-top: 0.5em;
        width: 100%;
    }

    input {
        border: none;
        outline: none;
        font-size: 100%;
        height: 2em;
    }

    button {
        border-radius: 0;
        border: 0;
        height: 2em;
        width: 100%;
    }
</style>
