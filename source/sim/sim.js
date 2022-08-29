
import {ebrew, world} from './interp.js';

export const make_sim = () => {
    const obj = Object.create(null);
    
    const draws = Object.create(null);

    obj.cache = Object.create(null);
    obj.from = Object.create(null);
    obj.nodes = Object.create(null);

    let lines = [];

    obj.redraw = () => {
        lines = [];
        for (const input of Object.keys(obj.cache)) {
            const output = obj.cache[input];
            const t0 = document.getElementById(input);
            const t1 = document.getElementById(output);
            if (t0 == null || t1 == null) {
                continue;
            }
            lines.push(
                [
                    {
                        x: () => {
                            const val = t0.getBoundingClientRect();
                            return val.left + val.width / 2;
                        },
                        y: () => {
                            const val = t0.getBoundingClientRect();
                            return (val.top + val.bottom) / 2;
                        },
                    },
                    {
                        x: () => {
                            const val = t1.getBoundingClientRect();
                            return val.left + val.width / 2;
                        },
                        y: () => {
                            const val = t1.getBoundingClientRect();
                            return (val.top + val.bottom) / 2;
                        },
                    }
                ]
            );
        }
        for (const key of Object.getOwnPropertySymbols(draws)) {
            draws[key](lines);
        }
    };

    let last = null;
    obj.select = (self, name, type) => {
        const cur = {self, name, type};
        if (last == null) {
            last = cur;
        } else {
            const map = {
                [last.type]: last,
                [cur.type]: cur,
            };
            last = null;
            const input = map[Symbol.for("in")];
            const output = map[Symbol.for("out")];
            if (input == null || output == null) {
                for (const key of Object.keys(obj.cache)) {
                    if ((output != null && obj.cache[key] === output.name) || (input != null && key === input.name)) {
                        delete obj.cache[key];
                    }
                }
            } else {
                if (obj.cache[input.name] == output.name) {
                    delete obj.cache[input.name];
                }
                obj.cache[input.name] = output.name;
            }
            obj.redraw();
        }
    };

    obj.count = 0;
    
    obj.sym = () => {
        return `symbol-${obj.count++}`;
    };

    obj.setDraw = (func) => {
        const sym = Symbol();
        draws[sym] = func;
        return () => {
            delete draws[sym];
        };
    };

    obj.update = Object.create(null);

    obj.run = () => {
        const cache = Object.create(null);

        const calc = (node) => {
            const args = node.in.map(want);
            try {
                var {print, outputs} = ebrew(node.src, world(args));
            } catch (e) {
                return [];
            }
            node.text = print.map((arg) => String(arg)).join('\n');
            return outputs;
        };

        const wantForce = (name) => {
            if (obj.cache[name] != null) {
                return want(obj.cache[name]);
            }
            if (obj.from[name] != null) {
                const node = obj.nodes[obj.from[name]];
                const outputs = calc(node);
                for (const num in outputs) {
                    if (node.out[num] === name) {
                        return outputs[num];
                    }
                }
            }
            return null;
        };

        const want = (name) => {
            if (name in cache) {
                return cache[name];
            } else {
                const res = wantForce(name);
                cache[name] = res;
                return res;
            }
        };

        for (const node of Object.keys(obj.nodes)) {
            calc(obj.nodes[node]);
        }

        for (const name of Object.keys(obj.update)) {
            obj.update[name]();
        }
    };
    
    setInterval(obj.run, 500);

    window.sim = obj;
    
    return obj;
};