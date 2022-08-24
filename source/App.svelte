<script>
    import Editor from "./nodes/Editor.svelte";
    import Expr from "./prefab/Expr.svelte";
    import Print from "./prefab/Print.svelte";
    import Fetch from './prefab/Fetch.svelte';
    import Transform from "./prefab/Transform.svelte";
    import Callback from "./prefab/Callback.svelte";
    import {make_sim} from './sim/sim.js';

    let sim = make_sim();

    const options = Object.create(null);
    const op = (name, n, func) => {
        return {
            comp: Transform,
            args: () => {
                const ret = Object.create(null);
                ret.inputs = n;
                ret.outputs = 1;
                ret.fn = (...args) => {
                    return [func(...args)];
                };
                ret.display = name;
                return ret;
            },
        };
    };
    const name = (name, n, func) => {
        options[name] = op(name, n, func);
    }
    options['Delay'] = {
        comp: Callback,
        args: () => {
            const ret = Object.create(null);
            ret.inputs = 2;
            ret.outputs = 1;
            ret.fn = ([ms, value], cb) => {
                setTimeout(() => {
                    cb(value);
                }, ms * 1000);
            };
            ret.display = 'Delay';
            return ret;
        },
    };

    name('Number', 1, (x) => Number(x));
    name('Add', 2, (x, y) => Number(x) + Number(y));
    name('Sub', 2, (x, y) => Number(x) - Number(y));
    name('Mul', 2, (x, y) => Number(x) * Number(y));
    name('Div', 2, (x, y) => Number(x) / Number(y));
    name('Mod', 2, (x, y) => Number(x) % Number(y));
    options['Output'] = {
        comp: Print,
        args: () => {
            return Object.create(null);
        },
    };
    options['Fetch'] = {
        comp: Fetch,
        args: () => {
            return Object.create(null);
        },
    };
    options['Input'] = {
        comp: Expr,
        args: () => {
            return Object.create(null);
        }
    };
</script>

<div class="main">
    <Editor {sim} {options}/>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
