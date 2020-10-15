export interface Plugin {
    name: string;
    iterate(useMatrix: Function, useContext: Function): void;
    init(): any;
}
