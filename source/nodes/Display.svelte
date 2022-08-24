<div class="display">
    <div class="entry">
        <slot/>
    </div>
</div>

<style>
    .display {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        align-content: center;
        width: 100%;
        flex-shrink: 1;
    }

    .entry {
        display: flex;
        max-width: 80%;
        flex-direction: column;
        padding: 0.5em;
        display: block;
        box-sizing: border-box;
        min-width: max-content;
    }
</style>