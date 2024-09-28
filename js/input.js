// input.js
import { field } from './board.js';
import { moveLeft, moveRight, moveDown, hardDrop, rotateTetrimino, hold, currentTetrimino, lastSRSPattern, initLastSRSPattern} from './tetrimino.js';
import { PLAY_SCREEN_HEIGHT, PLAY_SCREEN_WIDTH } from './utils.js';

export let lockdownSystem;
export let useSpin = false;
const TSPINFLAG = 1;
const MINITSPINFLAG = 2;

export function initInput() {
    document.addEventListener('keydown', handleKeyDown);
    lockdownSystem = new LockdownSystem();
}

function handleKeyDown(e) {
    let moved = false;
    useSpin = false;
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
            if (moved) useSpin = true;
            break;
        case "Control":
        case "z":
            moved = rotateTetrimino(false);
            if (moved) useSpin = true;
            break;
        case "ArrowDown":
            moved = moveDown();
            break;
        case "Shift":
        case "c":
            hold();
            break;
        case " ": 
            hardDrop();
            lockdownSystem.isLocked = true;
            break;
    }

    if (moved && lockdownSystem.isActive) {
        lockdownSystem.handleMove(currentTetrimino);
    }
}

export function checkTspin() {
    // 対象カウント
    let count = 0;
    // チェック箇所
    const point = [[0, 0], [0, 2], [2, 2], [2, 0],];

    let miniFlag = false; // ミニ用空間チェックを通ったフラグ

    for (let i = 0; i < 4; i++) {
        let blockNum = (i + currentTetrimino.direction) % 4;
        console.log('blockNum: ', blockNum);

        // 周囲の空間チェック
        let y = currentTetrimino.row + point[blockNum][0];
        let x = currentTetrimino.column + point[blockNum][1];
        if (x < 0 || x >= PLAY_SCREEN_WIDTH || y >= PLAY_SCREEN_HEIGHT || y < 0) {
            count++;
            console.log('wall', field[y][x]);
            continue;
        } 
        if (field[y][x]) { 
            count++;
            console.log('mino', field[y][x]);
            continue;
        }
        if (i === 0 || i === 1) {
            // AかBが空白ならminiTspinFlagをTrue
            console.log('blankcheck:', field[y][x]);
            // if(!field[y][x]) {
            miniFlag = true;
            console.log('miniFlag: ', miniFlag);
        }
    }

    // Tスピンチェック
    if (count >= 3 && useSpin) {
        

        // Tスピンミニチェック
        if (miniFlag && lastSRSPattern !== 4) {
            return MINITSPINFLAG; // mini-T-spin
        }
        return TSPINFLAG; // t-spin
    }
            
    initLastSRSPattern();
    return 0;
}


class LockdownSystem {
    constructor() {
        this.LOCKDOWN_DELAY = 500; // 0.5秒
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