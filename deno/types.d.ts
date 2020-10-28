import { Matrix } from "./class/Matrix.ts";

export interface Plugin {
    name: string;
    iterate(matrix: Matrix, context: any): any;
    init(): any;
    backgroundTask?(context: any): any;
}
