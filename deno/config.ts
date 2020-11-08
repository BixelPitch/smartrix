import { parse, version } from './depts.ts';
import { Plugins } from './plugins/Plugins.ts';
import { Plugin } from "./types.d.ts";

const args = parse(Deno.args);

const sanitizeBoolean = (value: string | boolean, fallback: boolean) => {
    if (typeof value === 'boolean') return value;
    if (value === undefined) return fallback;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    return fallback;
};

const sanitizeNumber = (value: string, fallback: number) => {
    if (typeof value === 'boolean') return fallback;
    if (value === undefined) return fallback;
    if (isNaN(parseInt(value))) return fallback;
    return parseInt(value);
};

const sanitizeArray = (value: string, fallback: Array<string>) => {
    if (typeof value === 'boolean') return fallback;
    if (value === undefined) return fallback;
    return value.split(',');
};

if (args.help) {
    console.log(
    `
    --------------------------
    | smartrix version ${version} |
    --------------------------
    Run the main.ts file with the following command:
    deno run --allow-run --allow-net main.ts [options]

    Options are:

    --help          Shows this help screen.
    --host          If you built your smartrix hardware, specify the host ip of your
                    hardware. If you don't specify a host, smartrix runs in offline 
                    mode in your terminal.
    --port          If you changed the default port of your smartrix, you can set it
                    with this flag. Default is 8080. This is usually not required.
    --rate          Sets the refresh rate in ms. Default is 500.
    --alwaysUpdate  Let the display always update on each frame, even if there aren't
                    any changes between frames. Default is unset, so the display/
                    terminal only update if needed.
    --disableLog    Turns off the output on your terminal. Default is unset. Has no
                    effect in offline mode.
    --brightness    Sets the brightness of your smartrix hardware. Has no effect in 
                    offline mode. Specify a value between 0 and 15. Default is 15.
    --rotation      Select the number of frames, which each plugin is displayed. If 
                    you want that every 5 seeconds the plugins rotate, divide 
                    5000 (ms) by the value of "--rate" and set this to the value for
                    rotation. For the default of 500ms the value of rotation should 
                    be 10.
    --plugins       Specify the plugins, which should be enabled at start. If not
                    specified, every plugin is activated. State the value in the form 
                    like this: <plugin1>,<plugin2>

Examples:

deno run --allow-run --allow-net main.ts --plugins clock --rate 100
(Runs smartrix offline, with only the clock plugin activated and at a rate of 100ms)

deno run --allow-run --allow-net main.ts --host 192.168.0.100 --alwaysUpdate --disableLog
(Runs smartrix in online mode, while sending every frame to the hardware and disabling log)


Available plugins:
${Plugins.reduce((prev: string, plugin: Plugin) => {
    return `${prev}- ${plugin.name}\n`;
}, '')}
    `);
    Deno.exit();
}

const config = {
    host:           args.host,
    port:           sanitizeNumber(args.port, 8080),
    rate:           sanitizeNumber(args.rate, 500),
    alwaysUpdate:   sanitizeBoolean(args.alwaysUpdate, false),
    disableLog:     sanitizeBoolean(args.disableLog, false),
    brightness:     sanitizeNumber(args.brightness, 15),
    rotation:       sanitizeNumber(args.rotation, 6),
    plugins:        sanitizeArray(args.plugins, [])
};

export { config };
