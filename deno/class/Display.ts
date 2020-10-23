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
        const useMatrix = () => {
            const setMatrix = (matrix: Matrix) => this.matrix = matrix;
            return [new Matrix({ data: this.matrix.getData() }), setMatrix];
        }

        const buildUseContext = (pluginName: string) => {
            const useContext = () => {
                const setContext = (context: any) => this.contexts.set(pluginName, context);
                return [this.contexts.get(pluginName), setContext];
            }
            return useContext;
        }

        this.stopped = false;

        let loop = () => {
            if (!this.stopped) {
                setTimeout(() => {
                    // on first run of a plugin, run the initialization function
                    if (!this.contexts.get(this.getCurrentPlugin().name)) {
                        this.contexts.set(this.getCurrentPlugin().name, this.getCurrentPlugin().init());
                    }

                    let oldMatrix = new Matrix({ data: this.matrix.getData() });

                    // run the iteration
                    this.getCurrentPlugin().iterate(useMatrix, buildUseContext(this.getCurrentPlugin().name));

                    // call the callback function if the matrix has changed or alwaysUpdate is set
                    if (config.alwaysUpdate) {
                        this.callback();
                    } else {
                        if (!oldMatrix.equals(this.matrix)) this.callback();
                    }

                    this.ticks++;
                    if (this.ticks % config.rotation === config.rotation - 1) this.iteratePluginPointer();

                    loop();
                }, this.timeout);
            }
        }

        loop();
    }
}
