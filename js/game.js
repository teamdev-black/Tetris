//game.js
import { DROP_SPEED } from './utils.js';
import { initField,clearFullLines} from './board.js';
import { isLocking, moveTetrimino, canMoveTetrimino, lockTetrimino, getNextTetrimino, holdTetrimino, setCurrentTetrimino, currentTetrimino, setIsLocking, initHold} from './tetrimino.js';
import { drawPlayScreen, drawHoldTetrimino, drawNextTetriminos } from './renderer.js';
import { checkGameOver, handleGameOver, updateScore, initScore, initLines, initLevel } from './score.js';
import { initInput, lockdownSystem } from './input.js';

export let animationId;
let lastDropTime = 0;
let nextTetriminos = [];

export function initGame() {
    initInput();
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
        // tetriminoが空の場合,生成する
        addNextTetrimino();
        if (checkGameOver()) {
            handleGameOver();
            return;
        }
        lastDropTime = currentTime;
    } else {
        // 操作中のtetriminoが存在する場合
        if (canMoveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            // 下に1行ドロップできる場合
            await normalDrop(currentTime);
        } else if (lockdownSystem.isLocked) {
                await performLock();
        } else if (!lockdownSystem.isActive) {
                lockdownSystem.startLockdown(currentTetrimino);
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
        console.log('Normal drop', { currentTetrimino, DROP_SPEED });
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
    lockdownSystem.resetLockdown();
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
    lockdownSystem.resetLockdown();
}