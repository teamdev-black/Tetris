//utils.js
export const BLOCK_SIZE = 30;
export const PLAY_SCREEN_WIDTH = 10;
export const PLAY_SCREEN_HEIGHT = 22;
export const CANVAS_WIDTH = BLOCK_SIZE * PLAY_SCREEN_WIDTH;
export const CANVAS_HEIGHT = BLOCK_SIZE * PLAY_SCREEN_HEIGHT;


// テトリミノの定義
export const TETRIMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00FFFF'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#ffd54f'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#7e57c2'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#66bb6a'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#ff8a65'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#5c6bc0'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#ffa726'
    }
};