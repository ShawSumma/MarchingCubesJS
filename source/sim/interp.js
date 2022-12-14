import { Parser, Binding, Ident, Form, Value } from "./ebrew.js";

const run = (ast, scope) => {
    if (ast instanceof Form) {
        switch(ast.form) {
            case 'call': {
                return run(ast.args[0], scope)(...ast.args.slice(1).map((arg) => run(arg, scope)));
            }
            case 'lambda': {
                const params = ast.args[0].args;
                return (...args) => {
                    const subscope = Object.create(scope);
                    for (const index in params) {
                        subscope[params[index]] = args[index];
                    }
                    return run(ast.args[1], subscope);
                };
            }
            default: {
                console.error(ast.form);
                throw new Error('bad ast form');
            }
        }
    }
    if (ast instanceof Ident) {
        return scope[ast.repr];
    }
    if (ast instanceof Value) {
        if (typeof ast.repr === 'bigint') {
            return Number(ast.repr);
        } else {
            return ast.repr;
        }
    }
    throw new Error('bad ast type');
};

export const world = (args) => {
    args = [...args];
    const data = Object.create(null);
    data.__print = [];
    data.__outputs = [];
    data.out = (value) => {
        data.__outputs.push(value);
    };
    data.in = () => {
        return args.shift();
    };
    data.print = (value) => {
        data.__print.push(value);
    };
    data.add = (y, x) => {
        return y + x;
    };
    data.sub = (y, x) => {
        return y - x;
    };
    data.mul = (y, x) => {
        return y * x;
    };
    data.div = (y, x) => {
        return y / x;
    };
    data.mod = (y, x) => {
        return y % x;
    };
    data.pow = (y, x) => {
        return Math.pow(y, x);
    };
    data.do = (x, y) => {
        return y;
    };
    data.let = (x, y) => {
        return y(x);
    }
    return data;
};

const install = (layer) => {
    layer['out'] = new Binding(new Ident('out'), [], [new Binding(new Ident('value'))]);
    layer['in'] = new Binding(new Ident('in'), [], []);
    layer['print'] = new Binding(new Ident('print'), [], [new Binding(new Ident('value'))]);
    layer['add'] = new Binding(new Ident('add'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['sub'] = new Binding(new Ident('sub'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['mul'] = new Binding(new Ident('mul'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['div'] = new Binding(new Ident('div'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['mod'] = new Binding(new Ident('mod'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['pow'] = new Binding(new Ident('pow'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['do'] = new Binding(new Ident('do'), [], [new Binding(new Ident('lhs')), new Binding(new Ident('rhs'))]);
    layer['let'] = new Binding(new Ident('let'), [new Ident('name')], [new Binding(new Ident('value')), new Binding(new Ident('in'), [], [new Binding(new Ident('name'))], ['name'])], ['name']);
}

export const ebrew = (src, scope) => {
    const parser = new Parser(src);
    install(parser.defs[0]);
    const node = parser.readExprMatch(new Binding(null));
    run(node, scope);
    return {
        outputs: scope.__outputs,
        print: scope.__print,
    };
};

export const count = (src) => {
    const parser = new Parser(src);
    install(parser.defs[0]);
    let root
    try {
        root = parser.readExprMatch(new Binding(null));
    } catch (e) {
        root = null;
    }
    let inputs = 0;
    let outputs = 0;
    const collect = (node) => {
        if (node instanceof Ident) {
            if (node.repr === 'in') {
                inputs += 1;
            }
            if (node.repr === 'out') {
                outputs += 1;
            }
        }
        if (node instanceof Form) {
            for (const arg of node.args) {
                collect(arg);
            }
        }
    };

    collect(root);
    return {inputs, outputs};
};
