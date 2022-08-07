import * as Noise from "./noise.js";

export const worldSize = 128;
const div = 20;
const pow = 4;

const worldSize1 = worldSize + 1;

const world = new Float32Array(worldSize1*worldSize1*worldSize1);

world.fill(0xFF);

const gen = (x, y, z) => {
    let ok = Math.sqrt(Math.pow(x-worldSize1/2, 2) + Math.pow(y-worldSize1/2, 2) + Math.pow(z-worldSize1/2, 2));
    let offset = Noise.simplex3D(x/div, y/div, z/div);
    // let offset = 0;
    const res = worldSize1*0.4 + offset * pow - ok;
    if (res <= -1) {
        return -1;
    } else if (res >= 1) {
        return 1;
    } else {
        return res;
    }
};

export const set = (x, y, z, val) => {
    if (val <= -1) {
        val = -1;
    } 
    if (val >= 1) {
        val = 1;
    }
    world[x*worldSize1*worldSize1+y*worldSize1+z] = val;
};

export const get = (x, y, z) => {
    const ret = world[x*worldSize1*worldSize1+y*worldSize1+z];
    if (ret == 0xFF) {
        let val = gen(x, y, z);
        set(x, y, z, val);
        return val;
    } else if (!isNaN(ret)) {
        return ret;
    }
};
