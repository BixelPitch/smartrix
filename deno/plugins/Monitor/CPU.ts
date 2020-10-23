import { Direction, Matrix } from '../../class/Matrix.ts';
import { Plugin } from '../../types.d.ts';
import { digits } from "./Digits.ts";

interface CPUCtx {
    load: number;
    loading: boolean;
    firstRun: boolean;
}

export class CPU implements Plugin {
    name = 'cpu';
    init = (): CPUCtx => {
        return {
            load: 0,
            loading: false,
            firstRun: true
        }
    }

    getLoad = async () => {
        if (Deno.build.os === 'darwin') {
            const run = await Deno.run({
                cmd: [ 'top', '-F', '-R', '-l', '1' ],
                stdout: 'piped',
                stderr: 'piped',
            });

            const output = await run.output();
            run.close();
            const decoded = new TextDecoder().decode(output);

            if (!decoded) return null;
            const match = decoded.match(/(\d+\.\d+)\% idle/g);
            if (!match) return null;
            const idle = match.pop();
            if (!idle) return null;

            return Math.round(100 - parseFloat(idle.split('%')[0]));
        }
        return null;
    }

    buildMatrix(load: number): Matrix {
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

    iterate = (useMatrix: any, useContext: any) => {
        const [matrix, setMatrix]: [Matrix, Function] = useMatrix();
        const [context, setContext]: [CPUCtx, Function] = useContext();

        const onGetLoad = (load: number | null) => {
            setContext({
                firstRun: false,
                load: load !== null ? load : context.load,
                loading: false 
            });
        }

        if (context.firstRun) {
            this.getLoad().then(onGetLoad);
        } else if (!context.loading) {
            setContext({
                firstRun: false,
                load: context.load,
                loading: true
            });
            this.getLoad().then(onGetLoad);
        }

        setMatrix(this.buildMatrix(context.load));
    }
}
