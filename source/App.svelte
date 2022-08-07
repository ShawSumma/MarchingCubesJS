<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import * as Cubes from "./cubes.js";
    import {get, set, worldSize} from './world.js';

    import {FlyControls} from './Fly.js'
    import {PointerLockControls} from './Lock.js'
    
    let el;

    onMount(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        el.appendChild(renderer.domElement);

        const csize = 16;

        const ison = (x) => {
            return x <= 0;
        };

        let objs = new Map();

        const maxc = Math.floor(worldSize / csize);

        const reload = (cx, cy, cz) => {
            if (cx < 0 || cy < 0 || cz < 0 || cx >= maxc || cy >= maxc || cz >= maxc) {
                return null;
            }
            let xo = cx * csize;
            let yo = cy * csize;
            let zo = cz * csize;
            let id = `${cx}:${cy}:${cz}`;
            var geometry = new THREE.BufferGeometry();
            {
                const positions = [];

                for (let x = xo; x <= xo+csize; x++) {
                    for (let y = yo; y <= yo+csize; y++) {
                        for (let z = zo; z <= zo+csize; z++) {
                            let n =
                                (+ison(get(x  , y  , z  )) << 0) +
                                (+ison(get(x+1, y  , z  )) << 1) +
                                (+ison(get(x  , y+1, z  )) << 2) +
                                (+ison(get(x+1, y+1, z  )) << 3) +
                                (+ison(get(x  , y  , z+1)) << 4) +
                                (+ison(get(x+1, y  , z+1)) << 5) +
                                (+ison(get(x  , y+1, z+1)) << 6) +
                                (+ison(get(x+1, y+1, z+1)) << 7);
                            for (const i of Cubes.TriangleTable[n]) {
                                const [n1, n2] = Cubes.EdgeVertexIndices[i];
                                let x1 = n1 & 1;
                                let y1 = (n1 >> 1) & 1;
                                let z1 = (n1 >> 2);
                                let x2 = n2 & 1;
                                let y2 = (n2 >> 1) & 1;
                                let z2 = (n2 >> 2);
                                let v1 = get(x+x1, y+y1, z+z1);
                                let v2 = get(x+x2, y+y2, z+z2);
                                let k = -v1 / (v2 - v1);
                                let xo = x1 + k * (x2 - x1);
                                let yo = y1 + k * (y2 - y1);
                                let zo = z1 + k * (z2 - z1);
                                positions.push(x + xo, y + yo, z + zo);
                            }
                        }
                    }
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
                geometry.computeVertexNormals();
            }

            const material = new THREE.MeshLambertMaterial ({ color: 0x557755, wireframe: false, side: THREE.FrontSide });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            if (objs[id] != null) {
                scene.remove(objs[id]);
            }
            objs[id] = cube;
        }

        const skyLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        scene.add(skyLight);

        const ambientLight = new THREE.AmbientLight(0xFFEEEE, 0.5);
        scene.add(ambientLight);
        
        let t = 0;

        let last = new Date();

        camera.lookAt(32, 32, 32);

        const ctrls = new PointerLockControls(camera, document.body);
        const fly = new FlyControls(camera, document.body);

        document.body.addEventListener('click', () => {
            ctrls.lock();
        })

        let md = [false, false, false];

        const frame = () => {
            requestAnimationFrame(frame);
            
            const start = new Date();
            t += start - last;

            fly.update((start - last) * 0.05);

            for (let i = 0; i < 1; i++) {
                if (md[0]) {
                    push(1/15);
                }
                if (md[2]) {
                    push(-1/15);
                }
            }

            renderer.render( scene, camera );
            last = start;
        };

        const dist = (x, y, z, x2, y2, z2) => {
            return Math.sqrt(Math.pow(x-x2, 2) + Math.pow(y-y2, 2) + Math.pow(z-z2, 2));
        }

        const fill = (x1, y1, z1, size, num) => {
            let x = x1|0;
            let y = y1|0;
            let z = z1|0;
            for (let xx = x-size; xx <= x+size; xx++) {
                for (let yy = y-size; yy <= y+size; yy++) {
                    for (let zz = z-size; zz <= z+size; zz++) {
                        const dv = dist(xx, yy, zz, x, y, z) + 1;
                        if (dv < size) {
                            const val = get(xx, yy, zz);
                            const next = val + num / dv;
                            set(xx, yy, zz, next);
                        }
                    }
                }
            }
        };

        const iter = 30;

        const push = (val) => {
            const up = new THREE.Vector3(0, 0, 1);
            up.applyEuler(camera.rotation);
            const pos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
            for (let i = 0; i < worldSize; i+=1) {
                pos.x -= up.x;
                pos.y -= up.y;
                pos.z -= up.z;
                if (ison(get(pos.x|0, pos.y|0, pos.z|0))) {
                    for (let j = 0; j < 1; j++) {
                        pos.x -= up.x * (val<0?-1:1);
                        pos.y -= up.y * (val<0?-1:1);
                        pos.z -= up.z * (val<0?-1:1);
                    }
                    let x = pos.x|0;
                    let y = pos.y|0;
                    let z = pos.z|0;
                    for (let i = 0; i < iter; i++) {
                        fill(pos.x, pos.y, pos.z, csize/2-1, -val/iter);
                    }
                    for (const xo of [-8, 0, 8]) {
                        for (const yo of [-8, 0, 8]) {
                            for (const zo of [-8, 0, 8]) {
                                reload((x+xo)/csize|0, (y+yo)/csize|0, (z+zo)/csize|0);
                            }
                        }
                    }
                    break;
                }
            }
        }

        document.body.addEventListener('mousedown', (event) => {
            md[event.button] = true;
        });

        document.body.addEventListener('mouseup', (event) => {
            md[event.button] = false;
        });

        camera.position.x = worldSize * 1/2;
        camera.position.y = worldSize * 1/2;
        camera.position.z = worldSize * 1/2;
        camera.rotateY(Math.PI);

        {
            let v = worldSize / csize;
            let vv = v * v;
            let vvv = v * v * v;
            let i = 0;
            const more = () => {
                for (let n = 0; n < 100; n++) {
                    reload(i/vv|0, (i/v|0)%v, i%v);
                    i += 1;
                    if (i >= vvv) {
                        return null;
                    }
                }
                setTimeout(more, 0);
            };
            more();
        }
        requestAnimationFrame(frame);
    });
</script>

<div class="main" bind:this={el}>
</div>

<style>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
