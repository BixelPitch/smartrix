import { Direction, Matrix } from '../../class/Matrix.ts';
import { Plugin } from '../../types.d.ts';
import { digits } from "./Digits.ts";

interface CPUCtx {
    load: number;
}

export class CPU implements Plugin {
    name = 'cpu';
    init = (): CPUCtx => {
        return { load: 0 }
    }

    getLoad = async () => {
        if (Deno.build.os === 'darwin') {
            const run = await Deno.run({
                cmd: [ 'top', '-l', '1' ],
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

    iterate = (useMatrix: any, useContext: any) => {
        const [matrix, setMatrix]: [Matrix, Function] = useMatrix();
        const [context, setContext]: [CPUCtx, Function] = useContext();

        const digitMatrix = new Matrix({ width: 0, height: 8 });

        this.getLoad().then((load) => {
            if (load !== null) setContext({ load });
        });

        context.load.toString().split('').forEach((digit) => {
            digitMatrix.glue(new Matrix({ data: digits[parseInt(digit)] }), Direction.RIGHT);
        });

        digitMatrix.glue(new Matrix({ data: digits[10] }), Direction.RIGHT);

        const width = Math.round(context.load / 100 * 32);
        const background = new Matrix({ height: 8, width, value: 1 });
        
        background.glue(new Matrix({ height: 8, width: 32 - width }), Direction.RIGHT);
        background.place(digitMatrix, 0, 0, true);

        setMatrix(background);
    }
}
