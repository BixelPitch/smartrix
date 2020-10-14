import { parse } from './depts.ts';
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
