<div class="input-slot">
    <slot/>
</div>

<style>
    .input-slot {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        height: calc(var(--slot-size));
        width: calc(var(--slot-size) * 0.5);
        outline: none;
    }
</style>
