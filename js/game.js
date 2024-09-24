import { DROP_SPEED } from './utils.js';
import { initField,} from './board.js';
import { isLocking, moveTetrimino, canMoveTetrimino, lockTetrimino, getNextTetrimino, holdTetrimino, setCurrentTetrimino, currentTetrimino,} from './tetrimino.js';
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

export async function gameLoop(currentTime) {
    
    drawPlayScreen();
    drawHoldTetrimino(holdTetrimino);
    drawNextTetriminos(nextTetriminos);
    
    if (!isLocking && currentTetrimino === null) {
        console.log('Adding next tetrimino');
        addNextTetrimino();
        if (checkGameOver()) {
            handleGameOver();
            return;
        }
        lastDropTime = currentTime;
    } else if (currentTetrimino !== null ) {
        if (canMoveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            normalDrop(currentTime);
        } else {
            lockTetrimino();
        }
    
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

async function normalDrop(currentTime) {
    if (currentTime - lastDropTime > DROP_SPEED) {
        moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column);
        console.log('Normal drop', { currentTetrimino });
        lastDropTime = currentTime;
    }
}

function addNextTetrimino() {
    setCurrentTetrimino(nextTetriminos.shift());
    nextTetriminos.push(getNextTetrimino());
    console.log('Next tetrimino added', {currentTetrimino});
}