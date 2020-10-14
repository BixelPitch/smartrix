import { Plugin } from '../types.d.ts';
import { Matrix } from './Matrix.ts';
import { config } from '../config.ts'; 
import { plugins } from '../plugins/Plugins.ts';
import { Clock } from "../plugins/Clock/Clock.ts";

const noop = () => {};

export class Display {
    private matrix: Matrix;
    private callback: Function;
    private timeout: number;
    private contexts: Map<string, any>;
    private plugins: Array<Plugin>;
    private stopped: boolean;
    private ticks: number;
    private pluginPointer: number;

    constructor() {
        this.matrix = new Matrix({ height: 8, width: 32 });
        this.callback = noop;
        this.timeout = config.rate;
        this.contexts = new Map();
        this.plugins = plugins.length > 0 ? plugins : [ new Clock() ];
        this.stopped = true;
        this.ticks = 0;
        this.pluginPointer = 0;
    }

    print() {
        this.matrix.print();
    }

    setTimeout(timeout: number): void {
        this.timeout = timeout;
    }
    
    getTimeout(): number {
        return this.timeout;
    }

    setCallback(cb: Function): void {
        this.callback = cb;
    }

    registerPlugin(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    getTicks(): number {
        return this.ticks;
    }

    serialize() {
        return this.matrix.getData().reduce((p1, c1) => p1.toString() + c1.reduce((p2, c2) => p2 + c2.toString(), ''), '');      
    }

    stop() {
        this.stopped = true;
    }

    iteratePluginPointer(): void {
        if (this.pluginPointer < this.plugins.length - 1) {
            this.pluginPointer++;
        } else {
            this.pluginPointer = 0;
        }
    }

    getCurrentPlugin(): Plugin {
        return this.plugins[this.pluginPointer];
    }

    start() {
        this.stopped = false;

        let loop = async () => {
            if (!this.stopped) {
                setTimeout(() => {
                    // on first run of a plugin, run the initialization function
                    if (!this.contexts.get(this.getCurrentPlugin().name)) {
                        this.contexts.set(this.getCurrentPlugin().name, this.getCurrentPlugin().init());
                    }

                    // run the iteration
                    const [matrix, ctx]: [Matrix, any] = this.getCurrentPlugin().iterate(this.matrix, this.contexts.get(this.getCurrentPlugin().name));

                    // call the callback function if the matrix has changed or alwaysUpdate is set
                    if (config.alwaysUpdate) {
                        this.callback();
                    } else {
                        const oldMatrix = this.matrix;
                        if (!oldMatrix.equals(matrix)) this.callback();
                    }

                    // update the matrix and the context
                    this.matrix = matrix;
                    this.contexts.set(this.getCurrentPlugin().name, ctx);


                    this.ticks++;
                    if (this.ticks % config.rotation === config.rotation - 1) this.iteratePluginPointer();

                    loop();
                }, this.timeout);
            }
        }

        loop();
    }
}
