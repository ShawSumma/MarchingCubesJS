<div class="display">
    <div class="entry">
        <slot/>
    </div>
</div>

<style>
    .display {
        position: relative;
        align-self: center;
        flex-direction: column;
        align-content: center;
        width: auto;
    }

    .entry {
        display: flex;
        width: auto;
        flex-direction: column;
    }
</style>