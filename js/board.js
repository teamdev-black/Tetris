import { PLAY_SCREEN_WIDTH, PLAY_SCREEN_HEIGHT } from './utils.js';

export let field = [];

export function initField() {
    field = Array(PLAY_SCREEN_HEIGHT).fill().map(() => Array(PLAY_SCREEN_WIDTH).fill(null));
}

export function checkCollision(tetrimino) {
    const { shape, row, column } = tetrimino;
    return shape.some((rowShape, r) => 
        rowShape.some((cell, c) => {
            if (cell) {
                const x = column + c;
                const y = row + r;
                return x < 0 || x >= PLAY_SCREEN_WIDTH || y >= PLAY_SCREEN_HEIGHT || (y >= 0 && field[y][x]);
            }
            return false;
        })
    );
}

export const clearFullLines = () => {
    let linesCleared = 0;

    // 1. 完全に埋まった行を検出し，消去するロジック
    for (let row = PLAY_SCREEN_HEIGHT - 1; row >= 0; row--) {
        if (field[row].every(cell => cell !== null)) {
            // 埋まった行を削除
            field.splice(row, 1);
            linesCleared++;
        }
    }

    // 消去した行数分の新しい空の行を追加
    for (let i = 0; i < linesCleared; i++) {
        field.unshift(new Array(PLAY_SCREEN_WIDTH).fill(null));
    }

    return linesCleared;
};