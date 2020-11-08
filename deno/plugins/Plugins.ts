import { Clock } from './Clock/Clock.ts';
import { GameOfLife } from './GameOfLife/GameOfLife.ts';
import { CPU } from './Monitor/CPU.ts';

let Plugins = [
    new Clock(),
    new GameOfLife(),
    new CPU()
];

export { Plugins };
