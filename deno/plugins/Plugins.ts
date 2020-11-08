import { Clock } from './Clock/Clock.ts';
import { GameOfLife } from './GameOfLife/GameOfLife.ts';
import { Monitor } from './Monitor/Monitor.ts';

let Plugins = [
    new Clock(),
    new GameOfLife(),
    new Monitor()
];

export { Plugins };
