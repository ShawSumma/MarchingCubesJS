import { Parser, Binding, Ident, Form, Value } from "./parser.js";
import { Compiler } from './compiler.js';

const run = (ast, obj) => {
    const scope = Object.create(null);
    for (const key in obj) {
        // scope[`eb_${key}`] = obj[key];
        scope[key] = obj[key];
    }
    scope.rt_load = (name) => {
        return obj[name];
    };
    scope.rt_str = (arr) => {
        return String.fromCharCode(...arr);
    };
    const js = new Compiler(obj).compile(ast);
    Function('env', js)(scope);
};

export const world = (args) => {
    args = [...args];
    const data = Object.create(null);
    data.__print = [];
    data.__outputs = [];
    data.out = (value) => {
        data.__outputs.push(value);
        return value;
    };
    data.in = () => {
        return args.shift();
    };
    data.print = (value) => {
        data.__print.push(value);
        return value;
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
