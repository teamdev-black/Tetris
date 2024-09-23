import { PLAY_SCREEN_WIDTH, PLAY_SCREEN_HEIGHT, DROP_SPEED } from './utils.js';
import { initField, field, clearFullLines } from './board.js';
import { addNewTetrimino, moveTetrimino, lockTetrimino, getNextTetrimino, holdTetrimino, setCurrentTetrimino, getCurrentTetrimino, hold, } from './tetrimino.js';
import { drawPlayScreen, drawHoldTetrimino, drawNextTetriminos } from './renderer.js';
import { checkGameOver, handleGameOver } from './score.js';

export let animationId;
let lastDropTime = 0;
let nextTetriminos = [];

export function initGame() {
    initField();

    for (let i = 0; i < 5; i++) {
        nextTetriminos.push(getNextTetrimino());
    }
    setCurrentTetrimino(nextTetriminos.shift());
    nextTetriminos.push(getNextTetrimino());
}

export function gameLoop(currentTime) {
    drawPlayScreen();
    drawHoldTetrimino(holdTetrimino);
    drawNextTetriminos(nextTetriminos);
    
    if (getCurrentTetrimino() === null) {
        setCurrentTetrimino(nextTetriminos.shift());
        nextTetriminos.push(getNextTetrimino());
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
        const currentTetrimino = getCurrentTetrimino();
        if (!moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            lockTetrimino();
            setCurrentTetrimino(null);
        }
        lastDropTime = currentTime;
    }
}

