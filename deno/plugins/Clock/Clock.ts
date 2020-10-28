import { Matrix, Direction } from '../../class/Matrix.ts';
import { Plugin } from '../../types.d.ts';
import { Digits } from './Digits.ts';

interface ClockCtx {
    dots: boolean;
}

export class Clock implements Plugin {
    name = 'clock';
    init = (): ClockCtx => {
        return { dots: false };
    }

    iterate = (matrix: Matrix, context: ClockCtx) => {
        let date = new Date();
        let dateString = '';
        let result = new Matrix({ width: 0, height: 8 });

        if (date.getHours() < 10) dateString += ' ';
        dateString += date.getHours().toString();

        if (date.getMinutes() < 10) dateString += '0';
        dateString += date.getMinutes().toString();

        dateString.split('').forEach((digit) => {
            result.glue(new Matrix({ data: this.getFigure(digit) }), Direction.RIGHT);
        });

        if (context.dots) {
            result.setPixel(15, 2, 1);
            result.setPixel(16, 2, 1);
            result.setPixel(15, 3, 1);
            result.setPixel(16, 3, 1);
            result.setPixel(15, 5, 1);
            result.setPixel(16, 5, 1);
            result.setPixel(15, 6, 1);
            result.setPixel(16, 6, 1);
        }

        return [ result, context ];
    }

    backgroundTask = (context: ClockCtx) => {
        const promise = new Promise<ClockCtx>((resolve) => {
            resolve({ dots: !context.dots });
        });

        return [ promise, 1000 ];
    }

    getFigure(digit: string): Array<Array<number>> {
        if (digit === ' ') return new Matrix({ width: 8, height: 8 }).getData();
        return Digits[parseInt(digit)];
    }
}
