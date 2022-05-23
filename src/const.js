
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
    ['e3', 'f3', 'f3', 'g3', 'g3', 'a3', 'a3', 'b3'],
    ['b2', 'c3', 'c3', 'd3', 'd3', 'e3', 'f3', 'f3'],
    ['g2', 'g2', 'a2', 'a2', 'b2', 'c3', 'c3', 'd3'],
    ['d2', 'd2', 'e2', 'f2', 'f2', 'g2', 'g2', 'a2'],
    ['a1', 'a1', 'b1', 'c2', 'c2', 'd2', 'd2', 'e2'],
    ['e1', 'f1', 'f1', 'g1', 'g1', 'a1', 'a1', 'b1'],
];

export const PAGE_TYPE = {
    NEW: 'NEW',
    DETAIL: 'DETAIL',
}