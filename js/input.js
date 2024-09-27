// input.js
import { moveLeft, moveRight, moveDown, hardDrop, rotateTetrimino, hold, currentTetrimino } from './tetrimino.js';

export let lockdownSystem;

export function initInput() {
    document.addEventListener('keydown', handleKeyDown);
    lockdownSystem = new LockdownSystem();
}

function handleKeyDown(e) {
    let moved = false;
    switch(e.key) {
        case "ArrowLeft": 
            moved = moveLeft();
            break;
        case "ArrowRight":
            moved = moveRight();
            break;
        case "ArrowUp":
        case "x": 
            moved = rotateTetrimino(true);
            break;
        case "Control":
        case "z":
            moved = rotateTetrimino(false);
            break;
        case "ArrowDown":
            moved = moveDown();
            break;
        case "Shift":
        case "c":
            hold();
            // lockdownSystem.isLocked = true;
            break;

        case " ": hardDrop(); break;
    }

    if (moved && lockdownSystem.isActive) {
        lockdownSystem.handleMove(currentTetrimino);
    }
}

class LockdownSystem {
    constructor() {
        this.LOCKDOWN_DELAY = 2000; // 0.5秒
        this.MAX_MOVES = 15;
        this.timer = null;
        this.moveCount = 0;
        this.lowestY = 0;
        this.isLocked = false;  // true -> Lockする
        this.isActive = false;  // LockDown開始 -> ture
    }

    startLockdown(tetrimino) {
        console.log("Start LockDown")
        this.resetLockdown();
        this.lowestY = this.getLowestY(tetrimino);
        console.log("Start LowestY:", this.lowestY);
        this.startTimer();
        this.isActive = true;
    }

    resetLockdown() {
        clearTimeout(this.timer);
        this.moveCount = 0;
        this.isLocked = false;
        this.isActive = false;
    }

    handleMove(tetrimino) {
        if (this.isLocked) return false;

        const currentLowestY = this.getLowestY(tetrimino);

        console.log(currentLowestY, this.lowestY);
        
        if (currentLowestY > this.lowestY) {
            this.resetLockdown();
            this.lowestY = currentLowestY;
        } else {
            this.moveCount++;
        }

        console.log("moveCount: ",this.moveCount );

        if (this.moveCount >= this.MAX_MOVES) {
            this.lock();
            return false;
        }

        this.startTimer();
        return true;
    }

    startTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.lock(), this.LOCKDOWN_DELAY);
    }

    lock() {
        this.isLocked = true;
        this.isActive = false;
    }

    getLowestY(tetrimino) {
        const { shape, row } = tetrimino;
        let lowestY = row;
        // pattern1: ミノの入っている部分を最下行とする場合
        for (let r = shape.length - 1; r >= 0; r--) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    return lowestY + r;
                }
            }
        }
        return lowestY;
        // pattern2: ミノの定義されているShapeの最下行を常に返す場合
        // return lowestY + shape.length - 1
    }
}