import { BLOCK_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';
import { field } from './board.js';
import { currentTetrimino } from './tetrimino.js';

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
    }
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#555';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid() {
    ctx.strokeStyle = '#555';
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
