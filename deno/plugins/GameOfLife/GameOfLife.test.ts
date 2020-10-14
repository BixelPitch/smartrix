import { assertEquals } from '../../depts.ts';
import { Matrix } from '../../class/Matrix.ts';
import { GameOfLife } from './GameOfLife.ts';

Deno.test('if get neighbors is working #1', () => {
    let gol = new GameOfLife();
    let m = new Matrix({ data: [
        [ 0, 1, 1 ],
        [ 0, 1, 0 ],
        [ 0, 1, 1 ],
    ] });
    assertEquals(gol.getNeighbors(m, 1, 1), 4);
});

Deno.test('if get neighbors is working #2', () => {
    let gol = new GameOfLife();
    let m = new Matrix({ data: [
        [ 0, 1, 1 ],
        [ 0, 1, 0 ],
        [ 0, 1, 1 ],
    ] });
    assertEquals(gol.getNeighbors(m, 0, 0), 2);
});