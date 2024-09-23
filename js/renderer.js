import { BLOCK_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field } from './board.js';
import { currentTetrimino, getTetriminoDropPosition, ghostTetriminoRow } from './tetrimino.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

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