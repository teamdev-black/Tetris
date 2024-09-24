import { TETRIMINOS, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field, checkCollision, clearFullLines } from './board.js';

let currentTetrimino = null;
export let ghostTetriminoRow = null;
export let holdTetrimino = null;
export let holdCount = 0;
let tetriminoSequence = [];


export function setCurrentTetrimino(tetrimino) {
    currentTetrimino = tetrimino;
}


export function getCurrentTetrimino() {
    return currentTetrimino;
}


export function getNextTetrimino() {
    if (tetriminoSequence.length === 0) {
        tetriminoSequence = Object.keys(TETRIMINOS).sort(() => Math.random() - 0.5);
    }
    const name = tetriminoSequence.pop();
    const { shape, color } = TETRIMINOS[name];
    const { column, row } = getInitialTetriminoPosition(shape);
    // const column = Math.floor(PLAY_SCREEN_WIDTH / 2) - Math.ceil(shape[0].length / 2);
    // const row = 0;

    return { name, shape, color, row, column };
}

export function getInitialTetriminoPosition(shape) {
    const column = Math.floor(PLAY_SCREEN_WIDTH / 2) - Math.ceil(shape[0].length / 2);
    const row = 0;
    return { column, row };
}

export function addNewTetrimino() {
    currentTetrimino = getNextTetrimino();
}

export function moveTetrimino(newRow, newColumn, newShape = null) {
    const originalTetrimino = { ...currentTetrimino };
    currentTetrimino.row = newRow;
    currentTetrimino.column = newColumn;
    if (newShape) {
        currentTetrimino.shape = newShape;
    }

    if (checkCollision(currentTetrimino)) {
        Object.assign(currentTetrimino, originalTetrimino);
        return false;
    }
    return true;
}


// テトリミノの移動操作
export const moveLeft = () => moveTetrimino(currentTetrimino.row, currentTetrimino.column - 1);
export const moveRight = () => moveTetrimino(currentTetrimino.row, currentTetrimino.column + 1);
export const moveDown = () => moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column);

// テトリミノの落下地点を取得
export function getTetriminoDropPosition() {
    ghostTetriminoRow = currentTetrimino.row;
    while (!checkCollision({ ...currentTetrimino, row: ghostTetriminoRow + 1 })) {
        ghostTetriminoRow++;
    }
}

// ハードドロップ
export function hardDrop() {
    if (moveTetrimino(ghostTetriminoRow, currentTetrimino.column)) {
        lockTetrimino();
        currentTetrimino = null;
    }
}

export function hold() {
    if (holdCount > 0) return; // 1回のみホールド可能

    const newHoldTetrimino = { ...currentTetrimino };
    newHoldTetrimino.shape = TETRIMINOS[newHoldTetrimino.name].shape;

    if (holdTetrimino === null) {
        holdTetrimino = newHoldTetrimino;
        currentTetrimino = null; // 新しいテトリミノを生成するトリガー
    } else {
        currentTetrimino = resetTetriminoPosition(holdTetrimino);
        holdTetrimino = newHoldTetrimino;
    }

    holdCount++;
}

function resetTetriminoPosition(tetrimino) {
    const { column, row } = getInitialTetriminoPosition(tetrimino.shape);
    return {
        ...tetrimino,
        column,
        row,
    };
}



function resetHoldCount() {
    holdCount = 0;
}

export function lockTetrimino() {
    const { shape, row, column, color } = currentTetrimino;
    shape.forEach((rowShape, r) => {
        rowShape.forEach((cell, c) => {
            if (cell) {
                const y = row + r;
                const x = column + c;
                if (y >= 0 && y < PLAY_SCREEN_HEIGHT && x >= 0 && x < PLAY_SCREEN_WIDTH) {
                    field[y][x] = color;
                }
            }
        });
    });
    clearFullLines();
    currentTetrimino = null;
    console.log(holdCount);
    resetHoldCount(); // hold回数をリセット
}

export function rotateTetrimino(clockwise = true) {
    const { name, shape } = currentTetrimino;
    let newShape;

    if (name === 'O') return; // O型は回転しない

    const iTetriminoSize = 4;

    if (name === 'I') {
        newShape = Array(iTetriminoSize).fill().map(() => Array(iTetriminoSize).fill(0));
        
        if (clockwise) {
            if (shape[1][0] === 1) { // 横長の場合
                // 縦長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[i][2] = 1;
                }
            } else { // 縦長の場合
                // 横長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[1][i] = 1;
                }
            }
        } else { // 反時計回り
            if (shape[0][1] === 1 || shape[0][2] === 1) { // 縦長の場合
                // 横長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[2][i] = 1;
                }
            } else { // 横長の場合
                // 縦長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[i][1] = 1;
                }
            }
        }
    } else {
        // その他のテトリミノの回転処理
        newShape = shape.map((row, i) => 
            row.map((_, j) => clockwise ? shape[shape.length - 1 - j][i] : shape[j][shape.length - 1 - i])
        );
    }

    moveTetrimino(currentTetrimino.row, currentTetrimino.column, newShape);

}