<div class="outputs">
    <slot/>
</div>

<style>
    .outputs {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: calc(var(--slot-size) * 0.5);
    }
</style>
