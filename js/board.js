// board.js
import { PLAY_SCREEN_WIDTH, PLAY_SCREEN_HEIGHT } from './utils.js';
import { drawBlock } from './renderer.js';

export let field = [];
let FLASH_RATE = 150;

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

const flashLines = (fullRows) => {
    return new Promise(resolve => {
        let flashCount = 4; // 点滅回数
        let flashInterval = setInterval(() => {
            fullRows.forEach(row => {
                field[row] = field[row].map(cell => cell === null ? null : (cell === "flash" ? "flash-interval": "flash"))

                // 各セルの状態に応じて描画を行う
                field[row].forEach((cell, col) => {
                    drawBlock(col, row, cell);
                });
            });
            flashCount--;
            if (flashCount === 0) {
                clearInterval(flashInterval);
                resolve(); // 点滅が終わったら次の処理へ
            }
        }, FLASH_RATE);
    });
};

// export const clearFullLines = async() => {
//     let fullRows = []
//     // 埋まっている行を特定
//     for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
//         if (field[row].every(cell => cell !== null)) {
//             fullRows.push(row);
//         }
//     }

//     if (fullRows.length === 0) return; // 埋まっている行がない場合は処理しない

    
//     // Line消去アニメーションを実行
//     await flashLines(fullRows);

//     // 実際に行を消去する
//     let newField = field.filter((_, row) => !fullRows.includes(row));

//     // 消去した行数分の新しい空の行を追加
//     while (newField.length < PLAY_SCREEN_HEIGHT) {
//         newField.unshift(new Array(PLAY_SCREEN_WIDTH).fill(null));
//     }

//     // fieldを更新
//     field = newField;

// };

export const clearFullLines = async () => {
    console.log('Entering clearFullLines');
    let fullRows = [];
    
    // 埋まっている行を特定
    for (let row = PLAY_SCREEN_HEIGHT - 1; row >= 0; row--) {
        if (field[row].every(cell => cell !== null)) {
            fullRows.push(row);
        }
    }

    console.log('Full rows detected:', fullRows);

    if (fullRows.length === 0) {
        console.log('No full rows, exiting clearFullLines');
        return 0;
    }

    // Line消去アニメーションを実行
    await flashLines(fullRows);

    // 実際に行を消去する
    field = field.filter((_, index) => !fullRows.includes(index));
    
    // 新しい空の行を追加
    while (field.length < PLAY_SCREEN_HEIGHT) {
        field.unshift(new Array(PLAY_SCREEN_WIDTH).fill(null));
    }

    console.log('Rows after clearing:', field.length);
    console.log('Cleared lines:', fullRows.length);

    // フィールドの再描画
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            drawBlock(col, row, field[row][col]);
        }
    }

    console.log('Exiting clearFullLines');
    return fullRows.length;
};