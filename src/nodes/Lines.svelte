<script>
    export let sim;

    let n = 0;
    let key = Symbol();
    let linesKey = Symbol();

    const Lines = class {
        constructor() {
            this.lines = Object.create(null);
        }

        add({x1, y1, x2, y2}) {
            const ln = n++;
            this.lines[ln] = {x1, y1, x2, y2};
            linesKey = Symbol();
            return ln;
        }

        move(ln, {x1, y1, x2, y2}) {
            this.lines[ln] = {x1, y1, x2, y2};
            linesKey = Symbol();
        }

        move1(ln, {x, y}) {
            const line = this.lines[ln];
            this.move(ln, {x1: x, y1: y, x2: line.x2, y2: line.y2});
        }

        move2(ln, {x, y}) {
            const line = this.lines[ln];
            this.move(ln, {x1: line.x1, y1: line.y1, x2: x, y2: y});
        }

        remove(ln) {
            delete this.lines[ln];
            linesKey = Symbol();
        }
    };

    sim.lines = new Lines();

    document.body.onresize = () => {
        key = Symbol();
    };
</script>

{#key key}
    <svg viewBox="0 0 {document.body.scrollWidth} {document.body.scrollHeight}">
        {#key linesKey}
            {#each Object.values(sim.lines.lines) as ln, i}
                {#if 'x1' in ln && 'y1' in ln && 'x2' in ln && 'y2' in ln}
                    <line x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}/>
                {/if}
            {/each}
        {/key}
    </svg>
{/key}

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
        stroke: #777;
    }

    svg line {
        stroke-width: 2px;
    }
</style>
