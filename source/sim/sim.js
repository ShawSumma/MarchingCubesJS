
export const make_sim = () => {
    const obj = Object.create(null);
    
    const pairs = Object.create(null);
    const cache = Object.create(null);

    const draws = Object.create(null);

    let lines = [];

    obj.redraw = () => {
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
            if (input == null) {
                if (pairs[output.name] != null) {
                    for (const dest of Object.getOwnPropertySymbols(pairs[output.name])) {
                        cache[dest].proxy = null;                     
                    }
                    cache[output.name].notify = [];
                    delete pairs[output.name];
                }
            } else {
                cache[input.name].proxy = cache[output.name];
                cache[output.name].notify.push(input.name);
                cache[input.name].ping();
                if (pairs[output.name] == null) {
                    pairs[output.name] = Object.create(null);
                }
                pairs[output.name][input.name] = map;
            }
            obj.redraw();
        }
    };

    obj.name = (name) => {
        const port = Object.create(null);
        let value = null;
        port.handlers = Object.create(null);
        port.proxy = null;
        port.notify = [];
        port.ping = () => {
            for (const name of port.notify) {
                cache[name].ping();
            }
            for (const sym of Object.getOwnPropertySymbols(port.handlers)) {
                port.handlers[sym]();
            }
        };
        port.set = (arg) => {
            value = arg;
            port.ping();
        };
        port.get = () => {
            if (port.proxy != null) {
                return port.proxy.get();
            } else {
                return value;
            }
        };
        cache[name] = port;
        return port;
    };

    obj.setDraw = (func) => {
        const sym = Symbol();
        draws[sym] = func;
        return () => {
            delete draws[sym];
        };
    };
    
    window.sim = obj;
    
    return obj;
};