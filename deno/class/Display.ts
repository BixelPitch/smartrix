import { Plugin } from '../types.d.ts';
import { Matrix } from './Matrix.ts';
import { config } from '../config.ts'; 
import { Plugins } from '../plugins/Plugins.ts';
import { Clock } from '../plugins/Clock/Clock.ts';
import { EventEmitter } from '../deps.ts';

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
    private event: EventEmitter;
    private cost: number;
    private brightness: number;

    constructor() {
        this.matrix = new Matrix({ height: 8, width: 32 });
        this.callback = noop;
        this.timeout = config.rate;
        this.contexts = new Map();
        this.stopped = true;
        this.ticks = 0;
        this.pluginPointer = 0;
        this.event = new EventEmitter();
        this.registerEventListeners();
        this.cost = 0;
        this.brightness = 15;

        let plugins = Plugins;

        if (config.plugins.length > 0) {
            [ ...plugins ].forEach((plugin) => {
                if (!config.plugins.includes(plugin.name)) {
                    plugins = plugins.filter(x => x.name !== plugin.name);
                }
            });
        }
        
        this.plugins = plugins.length > 0 ? plugins : [ new Clock() ];
    }

    private registerEventListeners() {
        this.event.on('iteration', () => {
            const startTime = Date.now();
            let oldMatrix = new Matrix({ data: this.matrix.getData() });

            // run the iteration
            const [matrix, context] = this.getCurrentPlugin().iterate(new Matrix({ data: this.matrix.getData() }), this.contexts.get(this.getCurrentPlugin().name));
            this.matrix = matrix;
            this.contexts.set(this.getCurrentPlugin().name, context);

            this.ticks++;
            if (this.ticks % config.rotation === config.rotation - 1) this.iteratePluginPointer();

            this.cost = Date.now() - startTime;

            // call the callback function if the matrix has changed or alwaysUpdate is set
            if (config.alwaysUpdate) {
                this.callback();
            } else {
                if (!oldMatrix.equals(this.matrix)) this.callback();
            }

            if (!this.stopped) {
                setTimeout(() => this.event.emit('iteration'), this.timeout);
            }
        });

        this.event.on('backgroundTask', (plugin: Plugin) => {
            if (!this.stopped && plugin.backgroundTask) {
                const [promise, timeout] = plugin.backgroundTask(this.contexts.get(plugin.name));

                promise
                    .then((context: any) => {
                        this.contexts.set(plugin.name, context);
                        if (timeout <= 0) {
                            this.event.emit('backgroundTask', plugin);
                        }
                    })
                    .catch((e: Error) => console.error(e));

                if (timeout > 0) {
                    setTimeout(() => {
                        this.event.emit('backgroundTask', plugin);
                    }, timeout);
                }
            }
        });
    }

    setBrightness(brightness: number) {
        if (brightness < 0) this.brightness = 0;
        if (brightness > 15) this.brightness = 15
        this.brightness = brightness;
    }

    print() {
        this.matrix.print();
    }

    getCost(): number {
        return this.cost;
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

    serialize(): Uint8Array {
        let serializedMatrix = this.matrix.toUint8Array();
        return new Uint8Array([ this.brightness, ...serializedMatrix ]);
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

        this.plugins.forEach((plugin) => {
            this.contexts.set(plugin.name, plugin.init());

            if (plugin.backgroundTask) {
                this.event.emit('backgroundTask', plugin);
            }
        });

        this.event.emit('iteration');
    }
}
