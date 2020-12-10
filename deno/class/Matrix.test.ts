import { assertEquals } from '../deps.ts';
import { Matrix, Direction } from './Matrix.ts';

Deno.test('if creating a Matrix object works', () => {
    let m = new Matrix({ height: 3, width: 3 });
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if width is returned correctly', () => {
    let m = new Matrix({ height: 3, width: 5 });
    assertEquals(m.width(), 5);
});

Deno.test('if height is returned correctly', () => {
    let m = new Matrix({ height: 4, width: 3 });
    assertEquals(m.height(), 4);
});

Deno.test('if glue function works - direction right', () => {
    let x1 = new Matrix({ height: 2, width: 2 });
    let x2 = new Matrix({ data: [[ 1, 1 ], [ 1, 1 ]] });
    x1.glue(x2, Direction.RIGHT);
    assertEquals(x1.getData(), [
        [ 0, 0, 1, 1 ],
        [ 0, 0, 1, 1 ]
    ]);
});

Deno.test('if glue function works - direction top', () => {
    let x1 = new Matrix({ height: 2, width: 2 });
    let x2 = new Matrix({ data: [[ 1, 1 ], [ 1, 1 ]] });
    x1.glue(x2, Direction.TOP);
    assertEquals(x1.getData(), [
        [ 1, 1 ],
        [ 1, 1 ],
        [ 0, 0 ],
        [ 0, 0 ]
    ]);
});

Deno.test('if glue function works - direction left', () => {
    let x1 = new Matrix({ height: 2, width: 2 });
    let x2 = new Matrix({ data: [[ 1, 1 ], [ 1, 1 ]] });
    x1.glue(x2, Direction.LEFT);
    assertEquals(x1.getData(), [
        [ 1, 1, 0, 0 ],
        [ 1, 1, 0, 0 ]
    ]);
});

Deno.test('if glue function works - direction bottom', () => {
    let x1 = new Matrix({ height: 2, width: 2 });
    let x2 = new Matrix({ data: [[ 1, 1 ], [ 1, 1 ]] });
    x1.glue(x2, Direction.BOTTOM);
    assertEquals(x1.getData(), [
        [ 0, 0 ],
        [ 0, 0 ],
        [ 1, 1 ],
        [ 1, 1 ]
    ]);
});

Deno.test('if grow function works - direction right', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.grow(1, Direction.RIGHT);
    assertEquals(m.getData(), [
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ]);
});

Deno.test('if grow function works - direction top', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.grow(1, Direction.TOP);
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if grow function works - direction left', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.grow(1, Direction.LEFT);
    assertEquals(m.getData(), [
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ]);
});

Deno.test('if grow function works - direction bottom', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.grow(1, Direction.BOTTOM);
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if shrink function works - direction right', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.shrink(1, Direction.RIGHT);
    assertEquals(m.getData(), [
        [ 0, 0 ],
        [ 0, 0 ],
        [ 0, 0 ]
    ]);
});

Deno.test('if shrink function works - direction top', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.shrink(1, Direction.TOP);
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if shrink function works - direction left', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.shrink(1, Direction.LEFT);
    assertEquals(m.getData(), [
        [ 0, 0 ],
        [ 0, 0 ],
        [ 0, 0 ]
    ]);
});

Deno.test('if shrink function works - direction bottom', () => {
    let m = new Matrix({ height: 3, width: 3 });
    m.shrink(1, Direction.BOTTOM);
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if clear works', () => {
    let m = new Matrix({ data: [[ 1, 1 ], [ 1, 1 ]] });
    m.clear();
    assertEquals(m.getData(), [
        [ 0, 0 ],
        [ 0, 0 ]
    ]);
    m.clear(true);
    assertEquals(m.getData(), [
        [ 1, 1 ],
        [ 1, 1 ]
    ]);
});

Deno.test('if setPixel works - positive case', () => {
    let m = new Matrix({ width: 3, height: 3 });
    let res = m.setPixel(0, 0, 1);
    assertEquals(res, true);
    assertEquals(m.getData(), [
        [ 1, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if setPixel works - negative case', () => {
    let m = new Matrix({ width: 3, height: 3 });
    let res = m.setPixel(3, 3, 1);
    assertEquals(res, false);
    assertEquals(m.getData(), [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ]
    ]);
});

Deno.test('if place works', () => {
    let a = new Matrix({ width: 3, height: 3 });
    let b = new Matrix({ width: 3, height: 3 });
    b.clear(true);

    a.place(b, -1, -1, false);
    assertEquals(a.getData(), [
        [ 1,1,0 ],
        [ 1,1,0 ],
        [ 0,0,0 ]
    ]);

    a.clear();
    a.place(b, 2, 2, false);
    assertEquals(a.getData(), [
        [ 0,0,0 ],
        [ 0,0,0 ],
        [ 0,0,1 ]
    ]);

    a.clear(true);
    a.place(b, 0, 0, true);
    assertEquals(a.getData(), [
        [ 0,0,0 ],
        [ 0,0,0 ],
        [ 0,0,0 ]
    ]);
});

Deno.test('if toUint8Array works', () => {
    const m = new Matrix({ data: [
        [ 0,0,0,0,0,0,0,1 ],
        [ 0,0,0,0,0,0,1,0 ],
        [ 0,0,1,0,1,0,0,0 ],
        [ 1,1,0,0,0,0,0,0 ],
    ] });

    const result = [ 1, 2, 40, 192 ];
    assertEquals(m.toUint8Array().every((value, i) => {
        return value === result[i];
    }), true);
});
