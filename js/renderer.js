// renderer.js
import { BLOCK_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field } from './board.js';
import { MINITSPINFLAG, TSPINFLAG } from './input.js';
import { getCurrentTetrimino, getTetriminoDropPosition, ghostTetriminoRow } from './tetrimino.js';

const canvas = document.getElementById('canvas');
const holdCanvas = document.querySelector('#hold-canvas');
const nextCanvases = [
    document.querySelector('#next-canvas-1'),
    document.querySelector('#next-canvas-2'),
    document.querySelector('#next-canvas-3'),
    document.querySelector('#next-canvas-4'),
    document.querySelector('#next-canvas-5')
];
// メインキャンバス
const ctx = canvas.getContext('2d');

// Holdキャンバス
const holdCtx = holdCanvas.getContext('2d');

// Nextキャンバス
const nextCtxs = nextCanvases.map(canvas => canvas.getContext('2d'));

// tSpin effect Canvas
const tSpinEffect = document.getElementById('t-spin-effect');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Hold と Next キャンバスのサイズを設定（例として4x4のグリッドとします）
const SIDE_CANVAS_SIZE = BLOCK_SIZE * 4;
holdCanvas.width = holdCanvas.height = SIDE_CANVAS_SIZE;
nextCanvases.forEach(canvas => {
    canvas.width = canvas.height = SIDE_CANVAS_SIZE;
});

const flashColors = {
    "flash": "#d9e4f1", // パステルブルー
    "flash-interval": "#f2f2f2", // ライトグレー
};

export function drawPlayScreen() {
    ctx.fillStyle = 'rgba(10, 25, 47, 0.7)'; // メインキャンバスの背景を調整
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            if (field[row][col]) {
                drawBlock(col, row, field[row][col]);
            }
        }
    }

    drawGrid();
    const currentTetrimino = getCurrentTetrimino();
    if (currentTetrimino) {
        drawTetrimino(currentTetrimino);
        getTetriminoDropPosition();
        drawGhostTetrimino({...currentTetrimino, row: ghostTetriminoRow});
    }
}

export function drawBlock(x, y, color) {
    if (color === "flash" || color === "flash-interval") {
        ctx.fillStyle = flashColors[color]; // flash用の色
    } else {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#555';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid(strokeStyle='#555') {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;  // Set default line width for grid

    // Draw the regular grid
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    
    // Draw thick line at the specified row
    let thickLineRow = 2, thickLineColor = '#FFFFFF', thickLineWidth = 3;
    ctx.beginPath();  // Start a new path for the thick line
    ctx.moveTo(0, thickLineRow * BLOCK_SIZE);
    ctx.lineTo(PLAY_SCREEN_WIDTH * BLOCK_SIZE, thickLineRow * BLOCK_SIZE);
    ctx.strokeStyle = thickLineColor;
    ctx.lineWidth = thickLineWidth;
    ctx.stroke();

    // Reset to default styles
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;

}

function drawTetrimino(tetrimino) {
    const { shape, color, row, column } = tetrimino;
    shape.forEach((rowShape, r) => {
        rowShape.forEach((cell, c) => {
            if (cell) {
                drawBlock(column + c, row + r, color);
            }
        });
    });
}

export function drawHoldTetrimino(holdTetrimino) {
    clearCanvas(holdCtx, SIDE_CANVAS_SIZE);
    if (holdTetrimino) {
        drawTetriminoOnCanvas(holdCtx, holdTetrimino, SIDE_CANVAS_SIZE / 2, SIDE_CANVAS_SIZE / 2);
    }
}

export function drawNextTetriminos(nextTetriminos) {
    nextCtxs.forEach((ctx, index) => {
        clearCanvas(ctx, SIDE_CANVAS_SIZE);
        if (nextTetriminos[index]) {
            drawTetriminoOnCanvas(ctx, nextTetriminos[index], SIDE_CANVAS_SIZE / 2, SIDE_CANVAS_SIZE / 2);
        }
    });
}

function clearCanvas(ctx, size) {
    ctx.fillStyle = 'rgba(10, 25, 47, 0.7)';
    ctx.fillRect(0, 0, size, size);
}

function drawTetriminoOnCanvas(ctx, tetrimino, centerX, centerY) {
    const { shape, color } = tetrimino;
    const blockSize = Math.min(centerX, centerY) / 3; // テトリミノのサイズを調整
    const offsetX = centerX - (shape[0].length * blockSize) / 2;
    const offsetY = centerY - (shape.length * blockSize) / 2;

    ctx.fillStyle = color;
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                ctx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
            }
        });
    });
}

function drawGhostTetrimino(tetrimino) {
    const { shape, color, row, column } = tetrimino;

    // 塗りつぶしのための透過色を設定
    ctx.fillStyle = color + '80'; // 例: 'rgba(255, 0, 0, 0.5)' のように透過させる
    // 枠線の色
    ctx.strokeStyle = color;
    shape.forEach((rowShape, r) => {
        rowShape.forEach((cell, c) => {
            if (cell) {
                ctx.fillRect((column + c) * BLOCK_SIZE, (row + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect((column + c) * BLOCK_SIZE, (row + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

export function showTSpinEffect(tSpinFlag, deleteRowNum) {
    // tspinの表示文字を取得
    let tSpinType = tSpinFlag === TSPINFLAG ? 'T-SPIN' : 'Mini-T';
    let actionType = ' ';

    if (deleteRowNum > 0) {
        actionType = ['Single', 'Double', 'Triple'][deleteRowNum - 1] || ' ';
    }

    // htmlの要素を取得し、文字を変更
    let tSpinContainer = document.getElementById('t-spin-container');
    let tSpinText = document.getElementById('t-spin-text');
    tSpinText.textContent = tSpinType + ' ' + actionType;

    // エフェクトを表示
    showEffectContainer(tSpinContainer);
}


const tetrisEffect = document.getElementById('tetris-effect');

export function showTetrisEffect() {
  tetrisEffect.style.display = 'block';
  tetrisEffect.style.animation = 'none';
  tetrisEffect.offsetHeight; // リフロー
  tetrisEffect.style.animation = 'fadeInOut 1.5s ease-in-out';
  
  setTimeout(() => {
    tetrisEffect.style.display = 'none';
  }, 1500);
}


export function showComboEffect(comboCount) {
    // htmlの要素を取得し、文字を変更
    let comboContainer = document.getElementById('combo-container');
    let comboText = document.getElementById('combo-text');
    comboText.textContent = String(comboCount) + " Combo";

    // エフェクトを表示
    showEffectContainer(comboContainer);
}

export function showBackToBackEffect() {
    // htmlの要素を取得し、文字を変更
    let backToBackContainer = document.getElementById('back-to-back-container');
    let backToBackText = document.getElementById('back-to-back-text');
    backToBackText.textContent = "Back-To-Back";

    // エフェクトを表示
    showEffectContainer(backToBackContainer);
}

// 新しく追加する関数：エフェクトコンテナを表示し、アニメーションを適用する
function showEffectContainer(container) {
    // 表示
    container.style.display = 'flex';
    
    // アニメーションクラスを追加
    container.classList.remove('slide-in');
    void container.offsetWidth; // リフロー
    container.classList.add('slide-in');
    
    // 2秒後に非表示にする
    setTimeout(() => {
        container.classList.remove('slide-in');
        container.style.display = 'none';
    }, 2000);
}