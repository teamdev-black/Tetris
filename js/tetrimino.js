//tetrimino.js
import { TETRIMINOS, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field, checkCollision, clearFullLines, getFullLines } from './board.js';
import { playSound } from './audio.js';
import { checkTspin, useSpin } from './input.js'
import { showTSpinEffect, showTetrisEffect } from './renderer.js'

export let currentTetrimino = null;
export let ghostTetriminoRow = null;
export let holdTetrimino = null;
export let holdCount = 0;
export let isLocking = false;
export let lastSRSPattern = 0;
let tetriminoSequence = [];

export function initHold(){
    holdTetrimino = null;
    holdCount = 0;
}

export function setCurrentTetrimino(tetrimino) {
    currentTetrimino = tetrimino;
}


export function getCurrentTetrimino() {
    return currentTetrimino;
}

export function setIsLocking(bool) {
    isLocking = bool;
}

export function getNextTetrimino() {
    if (tetriminoSequence.length === 0) {
        tetriminoSequence = Object.keys(TETRIMINOS).sort(() => Math.random() - 0.5);
    }
    const name = tetriminoSequence.pop();
    const { shape, color } = TETRIMINOS[name];
    const { column, row } = getInitialTetriminoPosition(shape);
    const direction = 0; // 初期向きは0

    return { name, shape, color, direction, row, column };
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

export function canMoveTetrimino(newRow, newColumn, shape = null) {
    const tetriminoToCheck = {
        ...currentTetrimino,
        row: newRow,
        column: newColumn,
        shape: shape || currentTetrimino.shape
    };
    return !checkCollision(tetriminoToCheck);
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
    moveTetrimino(ghostTetriminoRow, currentTetrimino.column);
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

export async function lockTetrimino() {
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
    playSound('land');

    const fullRows = getFullLines(); // 消去する行を抽出
    // T-spin判定
    let tSpinFlag = 0;
    if (currentTetrimino.name === 'T' && useSpin) {
        tSpinFlag = checkTspin();
        console.log(tSpinFlag === 2 ? 'mini-T-spin' : (tSpinFlag === 1 ? 't-spin' : 'no-t-spin'));
    }

    if (fullRows.length === 4) {
        // tetris animation
        showTetrisEffect();
    } else if (tSpinFlag > 0) {
        showTSpinEffect(tSpinFlag, fullRows.length);
    }
    const clearedLines = await clearFullLines(fullRows); // Line消去アニメーション
    resetHoldCount();
    return clearedLines;  // 追加：クリアした行数を返す
}



export function rotateTetrimino(clockwise = true) {
    // 通常の回転を試す
    if (normalRotation(clockwise)) {
        playSound('rotate');  // 回転成功時に効果音を再生
        currentTetrimino.direction = getRotateDirection(clockwise);
        return true;
    }

    if (currentTetrimino.name === 'O') return false; // O型はsrsしない

    // superRotationを試す
    if (superRotation(clockwise)) {
        playSound('rotate');  // 回転成功時に効果音を再生
        currentTetrimino.direction = getRotateDirection(clockwise);
        return true;
    }

    // どちらも回転できない場合: false
    return false;
}

function getRotateDirection(clockwise) {
    return clockwise ?  (currentTetrimino.direction + 1) % 4 : ((currentTetrimino.direction - 1) % 4 + 4) % 4;
}

function normalRotation(clockwise) {
    const { name, shape } = currentTetrimino;


    let newShape = getNormalRotationShape(name, shape, clockwise);

    let moved = moveTetrimino(currentTetrimino.row, currentTetrimino.column, newShape);
    return moved;
}

function getNormalRotationShape(name, shape, clockwise) {
    let newShape;
    if (name === 'I') {
        
        let newDirection = getRotateDirection(clockwise);
        newShape = getIShape(newDirection);
        console.log(newShape)
    } else {
        // その他のテトリミノの回転処理
        newShape = shape.map((row, i) => 
            row.map((_, j) => clockwise ? shape[shape.length - 1 - j][i] : shape[j][shape.length - 1 - i])
        );
    }
    return newShape;
}

function getIShape(direction) {
    switch (direction) {
        case 0:
            return [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
            ];
            break;
        case 1:
            return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
            ];
            break;
        case 2:
            return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
            ];
            break;
        case 3:
            return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
            ];
            break;
    }
}


function superRotation(clockwise) {
    // 回転前のミノの向き
    let currentDirection = currentTetrimino.direction;
    // 回転後のミノの向きを取得
    let newShape = getNormalRotationShape(currentTetrimino.name, currentTetrimino.shape, clockwise);
    let newDirection = getRotateDirection(clockwise);

    let movex = 0;  // X座標移動量
    let movey = 0;  // Y座標移動量
    // Iミノ以外
    if (currentTetrimino.name !== 'I') {
        // 1. 軸を左右に動かす
        // 0が90度（B）の場合は左，-90度（D）の場合は右へ移動
        // 0が0度（A），180度（C）の場合は回転した方向の逆へ移動
        switch (newDirection) {
            case 1: // 右向き
                movex = -1;
                break;
            case 3: // 左向き
                movex = 1;
                break;
            case 0: // 上向き
            case 2: // 下向き
                switch (currentDirection)
                {
                    case 1: // 回転前が右向き
                        movex = 1;
                        break;
                    case 3: // 回転前が左向き
                        movex = -1;
                        break;
                }
                break;
        }
        lastSRSPattern++;
        if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
            // 2.その状態から軸を上下に動かす
            // 0が90度（B），-90度（D）の場合は上へ移動
            // 0が0度（A），180度（C）の場合は下へ移動
            switch (newDirection) {
                case 1:
                case 3:
                    movey = -1;
                    break;
                case 0:
                case 2:
                    movey = 1;
                    break;
            }
            lastSRSPattern++;
            if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                // 3.元に戻し、軸を上下に2マス動かす
                // 0が90度（B），-90度（D）の場合は下へ移動
                // 0が0度（A），180度（C）の場合は上へ移動
                movex = 0;
                movey = 0;
                switch (newDirection) {
                    case 1:
                    case 3:
                        movey = 2;
                        break;
                    case 0:
                    case 2:
                        movey = -2;
                        break;
                }
                lastSRSPattern++;
                if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                    // 4.その状態から軸を左右に動かす
                    // 0が90度（B）の場合は左，-90度（D）の場合は右へ移動
                    // 0が0度（A），180度（C）の場合は回転した方向の逆へ移動
                    switch (newDirection) {
                        case 1:
                            movex = -1;
                            break;
                        case 3:
                            movex = 1;
                            break;
                        case 0:
                        case 2:
                            switch (currentDirection)
                            {
                                case 1: // 回転前が右向き
                                    movex = 1;
                                    break;
                                case 3: // 回転前が左向き
                                    movex = -1;
                                    break;
                            }
                            break;
                    }
                    lastSRSPattern++;
                    if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                        // 移動失敗
                        return false;
                    }
                }
            }
        }
        // 移動成功
        return true;
    } else { // IミノのSRS
        console.log(currentTetrimino.name, newShape);
        // 1. 2. の動作パターンを保持する変数
        let pattern1, pattern2;
        // 1. 軸を左右に動かす
        switch (newDirection) {
            // 0が90度（1）の場合は右，-90度（3）の場合は左へ移動（枠にくっつく）
            case 1:
                movex = 1;
                break;
            case 3:
                movex = -1;
                break;
            // 0が0度（0），180度（2）の場合は回転した方向の逆へ移動　0度は２マス移動
            case 0:
            case 2:
                switch (clockwise) {
                    case true: // 右回転
                        movex = -1;
                        break;
                    case false: // 左回転
                        movex = 1;
                        break;
                }
                if (newDirection === 0) movex *= 2;
                break;
        }
        pattern1 = movex;
        console.log("Pattern1 try movex:", movex);
        if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
            // 2. 軸を左右に動かす
            switch (newDirection) {
                // 0が90度（1）の場合は左，-90度（D）の場合は右へ移動（枠にくっつく）
                case 1:
                    movex = 1;
                    break;
                case 3:
                    movex = -1;
                    break;
                // 0が0度（A），180度（C）の場合は回転した方向へ移動　180度は２マス移動
                case 0:
                case 2:
                    switch (clockwise) {
                        case true: // 右回転
                            movex = 1;
                            break;
                        case false: // 左回転
                            movex = -1;
                            break;
                    }
                    if (newDirection == 2) movex *= 2;   // 180度は2マス移動
                    break;                    
            }
            pattern2 = movex;
            console.log("Pattern2 try movex:", movex);
            if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                // 3. 軸を上下に動かす
                switch (newDirection) {
                    // 0が90度（1）の場合は1を下，-90度（3）の場合は1を上へ移動
                    case 1:
                        movex = pattern1;
                        movey = +1;
                        break;
                    case 3:
                        movex = pattern1;
                        movey = -1;
                    // 0が0度（0），180度（2）の場合は
                    case 0:
                    case 2:
                        switch (currentDirection) {
                            // 回転前のミノが右半分にある（B）なら1を上へ
                            case 1:
                                movex = pattern1;
                                movey = -1;
                                break;
                            // 回転前のミノが左半分にある（D）なら2を下へ移動
                            case 3:
                                movex = pattern2;
                                movey = 1;
                        }
                        // 左回転なら２マス動かす ??右回転かも? 
                        if (!clockwise) {
                            movey *= 2;
                        }
                }

                if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                    // 4. 軸を上下に動かす
                    switch (newDirection) {
                        // 0が90度（1）の場合は2を上，-90度（3）の場合は2を下へ移動
                        case 1:
                            movex = pattern2;
                            movey = -1;
                            break;
                        case 3:
                            movex = pattern2;
                            movey = 1;
                            break;
                        // 0が0度（A），180度（C）の場合は
                        case 0:
                        case 2:
                            switch (currentDirection) {
                                // 回転前のミノが右半分にある（1）なら2を下へ
                                case 1:
                                    movex = pattern2;
                                    movey = 1;
                                    break;
                                // 回転前のミノが左半分にある（3）なら1を上へ移動
                                case 3:
                                    movex = pattern1;
                                    movey = -1;
                                    break;
                            }
                            // 右回転なら２マス動かす (左回転かも?)
                            if (clockwise) {
                                movey *= 2;
                            }
                    }
                    if (!moveTetrimino(currentTetrimino.row + movey, currentTetrimino.column + movex, newShape)) {
                        return false;
                    }
                }

            }
        }
        return true;
    }
}

export function initLastSRSPattern() {
    lastSRSPattern = 0;
}