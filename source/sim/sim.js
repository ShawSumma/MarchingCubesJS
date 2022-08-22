
export const make_sim = () => {
    const obj = Object.create(null);
    
    const cache = Object.create(null);
    const pairs = Object.create(null);

    const draws = Object.create(null);
    const listens = Object.create(null);

    let lines = [];

    const reline = () => {
        lines = [];
        for (const src of Object.getOwnPropertySymbols(pairs)) {
            for (const dest of Object.getOwnPropertySymbols(pairs[src])) {
                const map = pairs[src][dest];
                const input = map[Symbol.for("in")];
                const output = map[Symbol.for("out")];
                const t0 = output.self;
                const t1 = input.self;
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
        }
        obj.redraw();
    };

    obj.redraw = () => {
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
            last = null;''
            const input = map[Symbol.for("in")];
            const output = map[Symbol.for("out")];
            if (input == null) {
                delete pairs[output.name];
                reline();
            }
            if (output != null) {
                if (pairs[output.name] == null) {
                    pairs[output.name] = Object.create(null);
                }
                if (pairs[output.name][input.name] != null) {
                    delete pairs[output.name][input.name];
                } else {
                    pairs[output.name][input.name] = map;
                }
                reline();
            }
        }
    };
    obj.set = (name, value) => {
        cache[name] = value;
        obj.redraw();
    };
    obj.get = (name) => {
        return cache[name];
    };
    obj.setDraw = (func) => {
        const sym = Symbol();
        draws[sym] = func;
        return () => {
            delete draws[sym];
        };
    };
    obj.setListen = (func) => {
        const sym = Symbol();
        listens[sym] = func;
        return () => {
            delete listens[sym];
        };
    };
    obj.tick = () => {
        for (const src of Object.getOwnPropertySymbols(pairs)) {
            for (const dest of Object.getOwnPropertySymbols(pairs[src])) {
                cache[dest] = cache[src];
            }
        }
        for (const key of Object.getOwnPropertySymbols(listens)) {
            listens[key](lines);
        }
    };
    setInterval(() => {
        obj.tick();
    }, 100);
    return obj;
};