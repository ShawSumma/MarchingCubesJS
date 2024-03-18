<div class="output-slot">
    <slot/>
</div>

<style>
    .output-slot {
        position: relative;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: calc(var(--slot-size) * 0.5);
        outline: none;
    }
</style>
