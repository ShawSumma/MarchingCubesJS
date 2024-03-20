<script>
    export let sim;

    let n = 0;
    export let key = 0;
    export let linesKey = 0;

    const hasAll = (obj) => {
        return obj.x1 != null
            && obj.y1 != null
            && obj.x2 != null
            && obj.y2 != null;
    };
    
    const values = (obj) => {
        const ret = Object.values(obj);
        return ret.filter(hasAll);
    };

    const Lines = class {
        constructor() {
            this.lines = Object.create(null);
        }

        add({x1, y1, x2, y2}) {
            const ln = n++;
            this.lines[ln] = {x1, y1, x2, y2};
            linesKey += 1;
            return ln;
        }

        move(ln, {x1, y1, x2, y2}) {
            this.lines[ln] = {x1, y1, x2, y2};
            linesKey += 1;
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
            linesKey += 1;
        }
    };

    sim.lines = new Lines();

    document.body.onresize = () => {
        key += 1;
    };
</script>

{#key key}
    <svg viewBox="0 0 {document.body.scrollWidth} {document.body.scrollHeight}">
        {#key linesKey}
            {#each values(sim.lines.lines) as ln, i}
                <path
                    d="M {ln.x1} {ln.y1} C {(ln.x2 + ln.x1)*0.5} {ln.y1} {(ln.x2 + ln.x1)*0.5} {ln.y2} {ln.x2} {ln.y2}"
                />
            {/each}
        {/key}
    </svg>
{/key}

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }

    path {
        stroke: white;
        stroke-width: 2px;
        fill: none;
    }
</style>
