import { BLOCK_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field } from './board.js';
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

const ctx = canvas.getContext('2d');
const holdCtx = holdCanvas.getContext('2d');
const nextCtxs = nextCanvases.map(canvas => canvas.getContext('2d'));

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Hold と Next キャンバスのサイズを設定（例として4x4のグリッドとします）
const SIDE_CANVAS_SIZE = BLOCK_SIZE * 4;
holdCanvas.width = holdCanvas.height = SIDE_CANVAS_SIZE;
nextCanvases.forEach(canvas => {
    canvas.width = canvas.height = SIDE_CANVAS_SIZE;
});

export function drawPlayScreen() {
    ctx.fillStyle = '#000';
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

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#555';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid(strokeStyle='#555') {
    ctx.strokeStyle = strokeStyle;
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
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
    ctx.fillStyle = '#000';
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