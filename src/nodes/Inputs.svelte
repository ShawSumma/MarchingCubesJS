<div class="input">
    <slot/>
</div>

<style>
    .input {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 0;
        z-index: -1;
    }
</style>
