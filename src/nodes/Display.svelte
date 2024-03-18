<div class="display">
    <slot/>
</div>

<style>
    .display {
        position: relative;
        align-self: center;
        flex-direction: column;
        align-content: center;
        display: flex;
        flex-direction: column;
        padding: var(--line-size);
        gap: var(--line-size);
    }
</style>