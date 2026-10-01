import { expect, test } from 'vitest'
import { coordinate } from './types';
import type { Board, Coordinate } from './types';
import { createEmptyBoard, neighborsOf } from './board';

const board: Board = createEmptyBoard(3, 3, 0);


test('Test corner counts', () => {
    const neighbors: Coordinate[] = neighborsOf(board, coordinate(0, 0))
    expect(neighbors).toHaveLength(3);
});

test('Test center counts', () => {
    const neighbors: Coordinate[] = neighborsOf(board, coordinate(1, 1));
    expect(neighbors).toHaveLength(8);
});


test('To Contain equal - same shape', () => {
    const array: Coordinate[] = neighborsOf(board, coordinate(0, 1));
    expect(array).toContainEqual(coordinate(0, 0));
});
