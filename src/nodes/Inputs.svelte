<div class="inputs">
    <slot/>
</div>

<style>
    .inputs {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transform: translateX(-100%);
        height: 100%;
        width: calc(var(--slot-size) * 0.5);
    }
</style>
