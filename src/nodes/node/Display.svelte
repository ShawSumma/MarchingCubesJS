
<script>
    const prevent = (event) => {
        event.stopImmediatePropagation();
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="display">
    <div>
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
        padding: var(--line-size);
        cursor: var(--grab-hand);
    }

    .display-body {
        display: flex;
        cursor: auto;
        flex-direction: column;
        align-content: center;
        gap: var(--line-size);
    }
</style>