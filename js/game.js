import { DROPSPEED, currentTetrimino, addNewTetrimino } from './tetrimino.js';
import { drawPlayScreen, drawTetrimino } from './renderer.js';

let lastDropTime = 0;

export function initGame() {
    // ゲームの初期化処理
}

export function gameLoop(currentTime) {
    // ゲームループ関数
    // requestAnimationFlameの呼び出しにより現在の時刻:DOMHighResTimeStampがgameLoopに渡される
    // それをcurrentTimeとして受け取っている
    drawPlayScreen();
    if (currentTetrimino === null) {
        addNewTetrimino();
        lastDropTime = currentTime;
    } else {
        normalDrop(currentTime);
        drawTetrimino();
    }

    requestAnimationFrame(gameLoop);
}

function normalDrop(currentTime) {
    // ...(テトリミノを1行落下させる関数)
    // 現在時刻が最終ドロップ時刻よりもDROPSPEED経過していれば落下
    if (currentTime - lastDropTime > DROPSPEED) {
        currentTetrimino.row++;
        lastDropTime = currentTime;
    }
}