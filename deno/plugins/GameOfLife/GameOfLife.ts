import { Matrix } from '../../class/Matrix.ts';
import { Plugin } from '../../types.d.ts';

interface GameOfLifeCtx {
    seed: Matrix
}

export class GameOfLife implements Plugin {
    name = 'gameoflife';
    init = (): GameOfLifeCtx => {
        const seed = new Matrix({ width: 32, height: 8 });
        seed.fillRandom(80);
        return { seed };
    }

    getNeighbors(matrix: Matrix, x: number, y: number): number {
        let count = 0;
        let cursor = [-1, 1, 0];

        cursor.forEach((cx: number) => {
            cursor.forEach((cy: number) => {
                if (cx === 0 && cy === 0) return;
                let value = matrix.getPixel(x + cx, y + cy);
                if (!value) return;
                count++;
            });
        });

        return count;
    }

    evolution(value: number, neighbors: number): number {
        if (value === 1 && neighbors < 2) return 0;
        if (value === 1 && (neighbors === 2 || neighbors === 3)) return 1;
        if (value === 1 && neighbors > 3) return 0;
        if (value === 0 && neighbors === 3) return 1;
        return 0;
    }

    iterate = (matrix: Matrix, ctx: GameOfLifeCtx) => {
        let result = new Matrix({ width: matrix.width(), height: matrix.height() });

        ctx.seed.getData().forEach((line, y) => {
            line.forEach((pixel, x) => {
                result.setPixel(x, y, this.evolution(pixel, this.getNeighbors(ctx.seed, x, y)));
            });
        });

        if (ctx.seed.equals(result)) {
            result.fillRandom(80);
        }

        ctx.seed = result;
        return [result, ctx];
    }
}
