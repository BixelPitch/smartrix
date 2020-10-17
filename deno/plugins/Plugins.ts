import { Clock } from './Clock/Clock.ts';
import { GameOfLife } from './GameOfLife/GameOfLife.ts';
import { CPU } from './Monitor/CPU.ts';
import { config } from '../config.ts';

let plugins = [
    new Clock(),
    new GameOfLife(),
    new CPU()
];

if (config.plugins.length > 0) {
    [ ...plugins ].forEach((plugin) => {
        if (!config.plugins.includes(plugin.name)) {
            plugins = plugins.filter(x => x.name !== plugin.name);
        }
    });
}

export { plugins };
