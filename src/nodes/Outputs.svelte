<div class="output">
    <slot/>
</div>

<style>
    .output {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 0;
        z-index: -1;
    }
</style>
