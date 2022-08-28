import { Parser, Binding, Ident, Form, Value } from "./ebrew.js";

const run = (ast, scope) => {
    if (ast instanceof Form) {
        switch(ast.form) {
            case 'call': {
                return run(ast.args[0], scope)(...ast.args.slice(1).map((arg) => run(arg, scope)));
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
        return ast.repr;
    }
    throw new Error('bad ast type');
};

export const world = (args) => {
    args = [...args];
    console.log(args);
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
    return data;
};

const install = (layer) => {
    layer['out'] = new Binding('out', [], [new Binding('value')]);
    layer['in'] = new Binding('in', [], []);
    layer['print'] = new Binding('print', [], [new Binding('value')]);
}

export const ebrew = (src, scope) => {
    console.log(scope);
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
    const root = parser.readExprMatch(new Binding(null));
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
