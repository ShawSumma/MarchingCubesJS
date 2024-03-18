<div class="input-slot">
    <slot/>
</div>

<style>
    .input-slot {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        transform: translateX(-100%);
        height: 100%;
        width: calc(var(--slot-size) * 0.5);
        outline: none;
    }
</style>
