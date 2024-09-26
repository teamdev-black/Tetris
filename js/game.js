//game.js
import { DROP_SPEED } from './utils.js';
import { initField,clearFullLines} from './board.js';
import { isLocking, moveTetrimino, canMoveTetrimino, lockTetrimino, getNextTetrimino, holdTetrimino, setCurrentTetrimino, currentTetrimino, setIsLocking, initHold} from './tetrimino.js';
import { drawPlayScreen, drawHoldTetrimino, drawNextTetriminos } from './renderer.js';
import { checkGameOver, handleGameOver, updateScore, initScore, initLines, initLevel } from './score.js';

export let animationId;
let lastDropTime = 0;
let nextTetriminos = [];

export function initGame() {
    initField();
    initHold();
    initNext();
    initScore();
    initLevel();
    initLines();
}

export function initNext(){
    nextTetriminos = [];
    for (let i = 0; i < 5; i++) {
        nextTetriminos.push(getNextTetrimino());
    }
    addNextTetrimino(); // 初期テトリミノを設定
}

export async function gameLoop(currentTime) {
    drawPlayScreen();
    drawHoldTetrimino(holdTetrimino);
    drawNextTetriminos(nextTetriminos);
    
    if (currentTetrimino === null) {
        console.log('Adding next tetrimino');
        addNextTetrimino();
        if (checkGameOver()) {
            handleGameOver();
            return;
        }
        lastDropTime = currentTime;
    } else {
        if (canMoveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            await normalDrop(currentTime);
        } else if (!isLocking) {
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

    const clearedLines = await lockTetrimino();
    if (clearedLines > 0) {
        updateScore(clearedLines);
    } 

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