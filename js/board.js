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
    let fullRows = []
    // 埋まっている行を特定
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        if (field[row].every(cell => cell !== null)) {
            fullRows.push(row);
        }
    }

    if (fullRows.length === 0) return; // 埋まっている行がない場合は処理しない

    
    // Line消去アニメーションを実行


    // 実際に行を消去する
    let newField = field.filter((_, row) => !fullRows.includes(row));

    // 消去した行数分の新しい空の行を追加
    while (newField.length < PLAY_SCREEN_HEIGHT) {
        newField.unshift(new Array(PLAY_SCREEN_WIDTH).fill(null));
    }

    // fieldを更新
    field = newField;

};