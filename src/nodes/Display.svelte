
<script>
    const prevent = (event) => {
        event.stopImmediatePropagation();
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="display">
    <div class="display-no-drag">
        <div class="display-body" on:mousedown={prevent} on:mouseup={prevent}>
            <slot/>
        </div>
    </div>
</div>

<style>
    .display {
        display: flex;
        flex-direction: column;
        align-content: center;
        cursor: grab;
    }

    .display-no-drag {
        padding: var(--line-size);
        gap: var(--line-size);
    }

    .display-body {
        cursor: auto;
    }
</style>