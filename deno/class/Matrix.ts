export enum Direction {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

export class Matrix {
    private data: Array<Array<number>>;

    constructor(x: { width?: number, height?: number, value?: number, data?: Array<Array<number>> }) {
        if (x.data) {
            this.data = x.data;
        } else if (x.width !== undefined && x.height !== undefined) {
            let char = x.value ? x.value.toString() : '0';
            let line = x.width > 0 ? char.repeat(x.width).split('').map((x: string) => parseInt(x)) : [];
            this.data = x.height > 0 ? char.repeat(x.height).split('').map(() => [...line]) : [[]];
        } else {
            throw new Error('Please provide width and height, or data!');
        }
    }

    width(): number {
        return this.height() > 0 ? this.data[0].length : 0;
    }

    height(): number {
        return this.data.length;
    }

    setData(data: Array<Array<number>>): void {
        this.data = data;
    }

    getData(): Array<Array<number>> {
        return this.data;
    }

    glue(m: Matrix, direction: Direction): void {
        if ((direction === Direction.TOP || direction === Direction.BOTTOM) && this.width() !== m.width()) return;
        if ((direction === Direction.LEFT || direction === Direction.RIGHT) && this.height() !== m.height()) return;

        switch(direction) {
            case Direction.TOP:
                this.data = [ ...m.data, ...this.data ];
                break;
            case Direction.BOTTOM:
                this.data = [ ...this.data, ...m.data ];
                break;
            case Direction.RIGHT:
                this.data = this.data.map((line: Array<number>, i: number) => [ ...line,  ...m.data[i] ]);
                break;
            case Direction.LEFT:
                this.data = this.data.map((line: Array<number>, i: number) => [ ...m.data[i], ...line ]);
                break;
        }
    }

    grow(count: number, direction: Direction): void {
        let temp: Matrix;

        if (direction === Direction.TOP || direction === Direction.BOTTOM) {
            temp = new Matrix({ width: this.width(), height: count });
        } else {
            temp = new Matrix({ width: count, height: this.height() });
        }

        this.glue(temp, direction);
    }

    shrink(count: number, direction: Direction): void {
        switch(direction) {
            case Direction.TOP:
                this.data = this.data.slice(count, this.height());
                break;
            case Direction.BOTTOM:
                this.data = this.data.slice(0, this.height() - count);
                break;
            case Direction.RIGHT:
                this.data = this.data.map((line: Array<number>) => line.slice(0, this.width() - count));
                break;
            case Direction.LEFT:
                this.data = this.data.map((line: Array<number>) => line.slice(count, this.width()));
                break;
        }
    }

    clear(inverted?: boolean): void {
        let m = new Matrix({ width: this.width(), height: this.height(), value: inverted ? 1 : 0 });
        this.data = m.data;
    }

    setPixel(x: number, y: number, val: number): boolean {
        if (x < 0 || x >= this.width()) return false;
        if (y < 0 || y >= this.height()) return false;
        this.data[y][x] = val;
        return true;
    }

    getPixel(x: number, y: number): number | null {
        if (x < 0 || x >= this.width()) return null;
        if (y < 0 || y >= this.height()) return null;
        return this.data[y][x];
    }

    print(): void {
        console.log('-'.repeat(this.width() + 2));
        this.data
            .forEach((line: Array<number>) => {
                console.log('|' + line.reduce((prev: string, curr: number) => `${prev}${curr === 0 ? ' ' : 'X'}`, '') + '|');
            });
        console.log('-'.repeat(this.width() + 2));
    }

    equals(m: Matrix) {
        if (this.width() !== m.width()) return false;
        if (this.height() !== m.height()) return false;
        for(let y = 0; y < this.height(); y++) {
            for(let x = 0; x < this.width(); x++) {
                if (this.data[y][x] !== m.data[y][x]) return false;
            }
        }
        return true;
    }

    fillRandom(ratio = 50) {
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                this.setPixel(x, y, Math.floor(Math.random() * 100 / ratio));
            }
        }
    }

    place(m: Matrix, x: number, y: number, invert: boolean = false) {
        m.getData().forEach((line, cy) => {
            line.forEach((pixel, cx) => {
                if (pixel === 1) {
                    const currentPixel = this.getPixel(cx + x, cy + y);
                    if (currentPixel === null) return;
                    const newPixel = invert ? 1 - currentPixel : 1;
                    this.setPixel(cx + x, cy + y, newPixel);
                }
            });
        });
    }
}
