import { count, ebrew, world } from "./interp";

export const Eval = class {
    constructor(sim, src) {
        this.sim = sim;
        this.element = null;
        this.print = '';
        this.inputs = [];
        this.outputs = [];
        this.src = src;
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

        const {inputs, outputs} = count(this.src);

        while (this.inputs.length < inputs) {
            this.inputs.push(new Input(this));
        }
        this.inputs.length = inputs;

        while (this.outputs.length < outputs) {
            this.outputs.push(new Output(this));
        }
        this.outputs.length = outputs;

        this.counted = this.src;
    }

    eval() {
        const values = [];
        for (const input of this.inputs) {
            values.push(input.value);
        }
        const {outputs, print} = ebrew(this.src, world(values));
        for (const key in this.outputs) {
            this.outputs[key].value = outputs[key];
        }
        this.print = '';
        for (const obj of print) {
            this.print += JSON.stringify(obj, null, 2);
            this.print += '\n';
        }
    }

    update() {
        this.count();
        this.eval();
    }
}

export const Input = class {
    constructor(node) {
        this.node = node;
        this.pair = null;
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

export const Output = class {
    constructor(node) {
        this.node = node;
        this.data = null;
        this.pairs = [];
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
        this.lines = [];
        this.selected = null;
    }

    redraw() {

    }

    select(obj) {
        let input;
        let output;
        if (this.selected instanceof Input && obj instanceof Output) {
            input = this.selected;
            output = obj;
        } else if (this.selected instanceof Output && obj instanceof Input) {
            output = this.selected;
            input = obj;
        } else if (this.selected === null) {
            this.selected = obj;
        } else {
            this.selected = null;
        }
    }
};
