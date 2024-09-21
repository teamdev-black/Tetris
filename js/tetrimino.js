import { PLAYSCREENWIDTH } from './utils.js';

// テトリミノの通常落下速度(millisec)
export const DROPSPEED = 1000;

// 現在のテトリミノを保持する変数
export let currentTetrimino = null;

const TETROMINOS = {
    // ... (テトリミノの定義)
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
        color: '#FFFF00'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#800080'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#00FF00'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#FF0000'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#0000FF'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#FFA500'
    }
};


// テトリミノの生成順序
let tetriminoSequence = [];

// 次のテトリミノを取得する関数
export function getNextTetrimino() {
    if (tetriminoSequence.length === 0) {
        // 新しい7種のテトリミノをランダム順に生成
        tetriminoSequence = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'].sort(() => Math.random() - 0.5);
    }
    const name = tetriminoSequence.pop();
    const matrix = TETROMINOS[name].shape;
    const color = TETROMINOS[name].color;

    // 初期位置の設定
    const column = PLAYSCREENWIDTH / 2 - Math.ceil(matrix[0].length / 2);
    const row = 0;

    return {
        name: name,     // テトリミノの種類
        matrix: matrix, // 形状
        color: color,   // 色
        row: row,       // 現在の行
        column: column  // 現在の列
    };
}

// 新しいテトリミノをゲームに追加する関数
export function addNewTetrimino() {
    currentTetrimino = getNextTetrimino();
    // drawTetrimino();
}

// / テトリミノを左に移動させる関数
export function shiftLeft() {
    currentTetrimino.column--;
}

// テトリミノを右に移動させる関数
export function shiftRight() {
    currentTetrimino.column++;
}

export function rotateTetrimino() {
    const iTetriminoSize = 4;
    
    // 現在のテトリミノの形状を取得
    let currentShape = currentTetrimino.matrix;
    
    // 現在の形状の大きさ（matrixSize x matrixSize）を取得
    let matrixSize = currentShape.length;
    
    // 新しい空の配列を作成（回転後の形状を格納するため）
    let rotatedShape = [];
    
    // 新しい形状の配列を0で初期化
    for (let i = 0; i < matrixSize; i++) {
        let newRow = [];
        for (let j = 0; j < matrixSize; j++) {
            newRow.push(0);
        }
        rotatedShape.push(newRow);
    }
    
    // I型テトリミノの場合は特別な回転を行う
    if (currentTetrimino.name === 'I') {
        // I型テトリミノが横長の場合
        if (currentShape[1][0] === 1) {
            // 縦長に変更
            for (let i = 0; i < iTetriminoSize; i++) {
                rotatedShape[i][2] = 1;
            }
        } else {
            // 横長に変更
            for (let i = 0; i < iTetriminoSize; i++) {
                rotatedShape[1][i] = 1;
            }
        }
    } else {
        // I型以外のテトリミノの回転
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                // 90度回転の計算：新しい位置 = [j][matrixSize-1-i]
                rotatedShape[j][matrixSize - 1 - i] = currentShape[i][j];
            }
        }
    }

    // 回転後の形状を現在のテトリミノに設定
    currentTetrimino.matrix = rotatedShape;
}