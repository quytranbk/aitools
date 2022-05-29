
export const DEFAULT_BLACKNOTEDURATION = 500;
export const EMPTY_NOTE = 'p';
export const DEFAULT_NEW_FILENAME = 'Untitled.txt';
export const SHEET_TYPE = {
    NOTE: 'NOTE',
    POSITION: 'POSITION',
    KEYBOARD: 'KEYBOARD',
    GUITAR: 'GUITAR',
};
export const TIME_NODE_MAP = [
    {
        num: 256,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 128,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 64,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 32,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 16,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 8,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 4,
        type: 'whole',
        ratioWithBlackNode: 4
    },
    {
        num: 2,
        type: 'half',
        ratioWithBlackNode: 2
    },
    {
        num: 1,
        type: 'quarter',
        ratioWithBlackNode: 1
    },
    {
        num: -2,
        type: 'eighth',
        ratioWithBlackNode: 1/2
    },
    {
        num: -4,
        type: '16th',
        ratioWithBlackNode: 1/4
    },
    {
        num: -8,
        type: '32nd',
        ratioWithBlackNode: 1/8
    },
    {
        num: -16,
        type: '64th',
        ratioWithBlackNode: 1/16
    },
    {
        num: -32,
        type: '128th',
        ratioWithBlackNode: 1/32
    },
    {
        num: -64,
        type: '256th',
        ratioWithBlackNode: 1/64
    },
];

export const SHEET_SIZE = {
    X: 7,
    Y: 3,
};

export const NOTEID_LIST = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

export const KEYBOARD_MATRIX = [
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u'],
];

export const GUITAR_NOTE_MATRIX = [
    ['e3', 'f3', 0.00, 'g3', 0.00, 'a3', 0.00, 'b3', 'c4', 0.00, 'd4', 0.00, 'e4'],
    ['b2', 'c3', 0.00, 'd3', 0.00, 'e3', 'f3', 0.00, 'g3', 0.00, 'a3', 0.00, 'b3'],
    ['g2', 0.00, 'a2', 0.00, 'b2', 'c3', 0.00, 'd3', 0.00, 'e3', 'f3', 0.00, 'g3'],
    ['d2', 0.00, 'e2', 'f2', 0.00, 'g2', 0.00, 'a2', 0.00, 'b2', 'c3', 0.00, 'd3'],
    ['a1', 0.00, 'b1', 'c2', 0.00, 'd2', 0.00, 'e2', 'f2', 0.00, 'g2', 0.00, 'a2'],
    ['e1', 'f1', 0.00, 'g1', 0.00, 'a1', 0.00, 'b1', 'c2', 0.00, 'd2', 0.00, 'd2'],
];

export const PAGE_TYPE = {
    NEW: 'NEW',
    DETAIL: 'DETAIL',
}