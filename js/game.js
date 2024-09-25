import { DROP_SPEED } from './utils.js';
import { initField,} from './board.js';
import { isLocking, moveTetrimino, canMoveTetrimino, lockTetrimino, getNextTetrimino, holdTetrimino, setCurrentTetrimino, currentTetrimino, setIsLocking,} from './tetrimino.js';
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
            await normalDrop(currentTime);
        } else {
            await performLock();
        }
    
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// アニメーションを停止する関数
export function stopGameLoop() {
    // requestAnimationFrameを止めるメソッド
    cancelAnimationFrame(animationId);
}

async function normalDrop(currentTime) {
    if (currentTime - lastDropTime > DROP_SPEED) {
        moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column);
        console.log('Normal drop', { currentTetrimino });
        lastDropTime = currentTime;
    }
}

async function performLock() {
    setIsLocking(true);
    await lockTetrimino();
    setIsLocking(false);
    setCurrentTetrimino(null);
}

export async function performHardDrop() {
    if (!isLocking) {
        const droppedRows = hardDrop();
        await performLock();
        return droppedRows;
    }
    return 0;
}

function addNextTetrimino() {
    setCurrentTetrimino(nextTetriminos.shift());
    nextTetriminos.push(getNextTetrimino());
    console.log('Next tetrimino added', {currentTetrimino});
}