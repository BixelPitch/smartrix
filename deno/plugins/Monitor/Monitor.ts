import { Direction, Matrix } from '../../class/Matrix.ts';
import { Plugin } from '../../types.d.ts';
import { digits } from './Digits.ts';

interface MonitorCtx {
    load: number;
}

const executeCommand = (cmd: Array<string>, regex: RegExp): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const run = Deno.run({
            cmd: cmd,
            stdout: 'piped',
            stderr: 'piped',
        });
        
        run.output()
            .then((output) => {
                const decoded = new TextDecoder().decode(output);
                if (!decoded) return reject();
                const match = decoded.match(regex);
                if (!match) return reject();
                const result = match.pop();
                if (!result) return reject();
                resolve(result);
            })
            .finally(() => run.close());
    });
}

const buildMatrix = (load: number): Matrix => {
    const digitMatrix = new Matrix({ width: 0, height: 8 });

    load.toString().split('').forEach((digit) => {
        digitMatrix.glue(new Matrix({ data: digits[parseInt(digit)] }), Direction.RIGHT);
    });

    digitMatrix.glue(new Matrix({ data: digits[10] }), Direction.RIGHT);

    const width = Math.round(load / 100 * 32);
    const background = new Matrix({ height: 8, width, value: 1 });
    
    background.glue(new Matrix({ height: 8, width: 32 - width }), Direction.RIGHT);
    background.place(digitMatrix, 0, 0, true);

    return background;
}

export class Monitor implements Plugin {
    name = 'monitor';

    init = (): MonitorCtx => {
        return { load: 0 };
    }

    iterate = (matrix: Matrix, context: MonitorCtx) => {
        return [ buildMatrix(context.load), context ];
    }

    backgroundTask = () => {
        const promise = new Promise<MonitorCtx>((resolve, reject) => {
            if (Deno.build.os === 'darwin') {
                executeCommand([ 'top', '-F', '-R', '-l', '1' ], /(\d+\.\d+)\% idle/)
                .then((result) => {
                    resolve({
                        load: Math.round(100 - parseFloat(result))
                    })
                })
                .catch(() => reject());
            } else {
                reject();
            }
        });

        return [ promise, 0 ];
    }
}
