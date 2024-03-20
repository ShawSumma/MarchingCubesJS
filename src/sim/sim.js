import { count, ebrew, world } from "./interp";

const mid = (p1) => {
    const x = (p1.left + p1.right) * 0.5;
    const y = (p1.bottom + p1.top) * 0.5;
    return {x, y};
};

const dist = (p1, p2) => {
    const x1 = (p1.left + p1.right) * 0.5;
    const y1 = (p1.bottom + p1.top) * 0.5;
    const x2 = (p2.left + p2.right) * 0.5;
    const y2 = (p2.bottom + p2.top) * 0.5;
    const a = (x1-x2);
    const b = (y1-y2);
    return Math.sqrt(a*a + b*b);
};

const minDist1 = (p1) => {
    return (p1.width + p1.height) * 0.25;
};

const minDist2 = (p1, p2) => {
    return minDist1(p1) + minDist1(p2);
};

export const Eval = class {
    constructor(sim, src) {
        this.sim = sim;
        this.element = null;
        this.print = '';
        this.inputs = [];
        this.outputs = [];
        this.src = src;
        this.ping = () => {};
        count();
    }

    write(str) {
        this.print += str;
    }

    writeln(str) {
        this.write(str);
        this.write('\n');
    }

    count() {
        if (this.src === this.counted) {
            return;
        }

        try {
            let {inputs, outputs} = count(this.src);

            while (this.inputs.length < inputs) {
                this.inputs.push(new Input(this));
            }
            while (this.inputs.length > inputs) {
                this.inputs.pop().remove();
            }

            while (this.outputs.length < outputs) {
                this.outputs.push(new Output(this));
            }
            while (this.outputs.length > outputs) {
                this.outputs.pop().remove();
            }
            this.outputs.length = outputs;

            this.counted = this.src;
        } catch (e) {
            console.error(e);
        }
    }

    eval() {
        const values = [];
        for (const input of this.inputs) {
            values.push(input.value);
        }
        let print = [];
        let outputs = [];
        let i = 0;
        const lazy = (value) => {
            this.print += JSON.stringify(value, null, 2);
            this.print += '\n';
        };
        try {
            const res = ebrew(this.src, world(values));
            print = res.print;
            outputs = res.outputs;
        } catch (e) {
            console.error(e);
        } finally {
            for (const key in this.outputs) {
                this.outputs[key].value = outputs[key];
            }
            this.print = '';
            for (const obj of print) {
                this.print += JSON.stringify(obj);
                this.print += '\n';
            }
            this.ping();
        }
    }

    update() {
        this.count();
        this.eval();
    }
}

export const Bounded = class {
    constructor(node) {
        this.node = node;
        this.obj = document.createElement('div');
    }

    bounds() {
        return this.obj.getBoundingClientRect();
    }
};

export const Input = class extends Bounded {
    constructor(node) {
        super(node);
        this.output = null;
        this.node.sim.addInput(this);
    }

    bounds() {
        return this.obj.getBoundingClientRect();
    }

    update() {
        this.node.eval();
    }

    remove() {
        this.pair = null;
        this.node.sim.removeInput(this);
    }

    set pair(val) {
        if (this.output != null) {
            this.output.unpair(this);
        }
        if (val != null) {
            val.pair(this);
        }
        this.output = val;
        this.update();
    }

    get pair() {
        return this.output;
    }

    get value() {
        if (this.pair != null) {
            return this.pair.value;
        }
        return null;
    }

    eval() {
        this.node.update();
    }
};

export const Output = class extends Bounded {
    constructor(node) {
        super(node);
        this.data = null;
        this.pairs = [];
        this.node.sim.addOutput(this);
    }

    pair(value) {
        this.pairs.push(value);
    }

    unpair(value) {
        const index = this.pairs.indexOf(value);
        this.pairs.splice(index, 1);
    }

    update() {
        for (const input of this.pairs) {
            input.update();
        }
    }

    remove() {
        for (const pair of this.pairs) {
            pair.pair = null;
        }
        this.pairs = [];
        this.node.sim.removeOutput(this);
    }

    bounds() {
        return this.obj.getBoundingClientRect();
    }

    get value() {
        return this.data; 
    }

    set value(n) {
        this.data = n;
        for (const input of this.pairs) {
            input.update();
        }
    }
}

export const Sim = class {
    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.pairLines = [];
        this.lines = null;
    }

    addInput(input) {
        this.inputs.push(input);
    }

    addOutput(outputs) {
        this.outputs.push(outputs);
    }

    removeInput(input) {
        const index = this.inputs.indexOf(input);
        this.inputs.splice(index, 1);
    }

    removeOutput(output) {
        const index = this.outputs.indexOf(output);
        this.outputs.splice(index, 1);
    }

    updateLines() {
        for (const ln of this.pairLines) {
            this.lines.remove(ln);
        }
        this.pairLines = [];
        for (const input of this.inputs) {
            if (input.pair == null) {
                continue;
            }
            const start = mid(input.bounds());
            const stop = mid(input.pair.bounds());
            const ln = this.lines.add({
                x1: start.x,
                y1: start.y,
                x2: stop.x,
                y2: stop.y,
            });
            this.pairLines.push(ln);
        }
    }

    update() {
        this.updateLines();
    }

    dragged(obj, point) {
        if (obj instanceof Output) {
            let got = null;
            for (const input of this.inputs) {
                if (got == null || dist(point, input.bounds()) < dist(point, got.bounds())) {
                    got = input;
                }
            }
            if (got != null) {
                const bounds = got.bounds();
                if (dist(point, bounds) < minDist2(point, bounds)) {
                    if (got.pair === obj) {
                        got.pair = null;
                    } else {
                        got.pair = obj;
                    }
                }
            }
        }
        if (obj instanceof Input) {
            obj.pair = null;
            let got = null;
            for (const output of this.outputs) {
                if (got == null || dist(point, output.bounds()) < dist(point, got.bounds())) {
                    got = output;
                }
            }
            if (got != null) {
                const bounds = got.bounds();
                if (dist(point, bounds) < minDist2(point, bounds)) {
                    obj.pair = got;
                }
            }
        }

        this.updateLines();
    }
};
