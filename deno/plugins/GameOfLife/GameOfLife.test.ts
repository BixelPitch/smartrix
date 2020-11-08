import { assertEquals } from '../../deps.ts';
import { Matrix } from '../../class/Matrix.ts';
import { GameOfLife } from './GameOfLife.ts';

Deno.test('if get neighbors is working', () => {
    let gol = new GameOfLife();
    let m = new Matrix({ data: [
        [ 0, 1, 1 ],
        [ 0, 1, 0 ],
        [ 0, 1, 1 ],
    ] });
    assertEquals(gol.getNeighbors(m, 1, 1), 4);
    assertEquals(gol.getNeighbors(m, 0, 0), 2);
});
