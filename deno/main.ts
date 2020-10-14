import { Display } from './class/Display.ts';
import { config } from './config.ts';

const encoder = new TextEncoder();
const display = new Display();

const print = async () => {
    const animation = [ 'ooo', 'Ooo', 'oOo', 'ooO' ];
    const clear = Deno.run({ cmd: ['clear'] });
    await clear.status();
    clear.close();
    console.log(`mode: ${config.host ? `online (${config.host}:${config.port})` : 'offline'}`);
    console.log(`rate: ${config.rate} ms`);
    console.log(`tick: ${display.getTicks()} ${animation[display.getTicks() % animation.length]}`);
    display.print();
}

let callback = print;

if (config.host) {
    console.log(`connecting to ${config.host}:${config.port}`);
    const conn = await Deno.connect({ hostname: config.host, port: config.port });
    console.log('connected!');

    console.log(`setting brightness to ${config.brightness}`);
    if (config.brightness != 15) await conn.write(encoder.encode('BRIG#' + display.serialize() + ';'));

    callback = async () => {
        await conn.write(encoder.encode('DATA#' + display.serialize() + ';'));
        if (!config.disableLog) print();
    };
}

display.setCallback(callback);
display.start();
