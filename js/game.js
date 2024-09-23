import { PLAY_SCREEN_WIDTH, PLAY_SCREEN_HEIGHT, DROP_SPEED } from './utils.js';
import { initField, field, clearFullLines } from './board.js';
import { currentTetrimino, addNewTetrimino, moveTetrimino, lockTetrimino } from './tetrimino.js';
import { drawPlayScreen } from './renderer.js';
import { checkGameOver, handleGameOver } from './score.js';

export let animationId;
let lastDropTime = 0;

export function initGame() {
    initField();
}

export function gameLoop(currentTime) {
    drawPlayScreen();
    if (currentTetrimino === null) {
        addNewTetrimino();
        if (checkGameOver()) {
            handleGameOver();
            return;
        }
        lastDropTime = currentTime;
    } else {
        normalDrop(currentTime);
    }
    animationId = requestAnimationFrame(gameLoop);
}

function normalDrop(currentTime) {
    if (currentTime - lastDropTime > DROP_SPEED) {
        if (!moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            lockTetrimino();
        }
        lastDropTime = currentTime;
    }
}