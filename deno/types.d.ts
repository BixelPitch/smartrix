export interface Plugin {
    name: string;
    iterate: Function;
    init: Function;
}
