import { getCurrentTetrimino } from './tetrimino.js';
import { field } from './board.js';
import { animationId } from './game.js';
import { PLAY_SCREEN_WIDTH } from './utils.js';

export let isGameOver = false;

export function checkGameOver() {
    const currentTetrimino = getCurrentTetrimino();
    if (!currentTetrimino) {
        console.log("Not Null");
        return false;
    }

    // 新しいテトリミノが既存のブロックと重なるかチェック
    for (let row = 0; row < currentTetrimino.shape.length; row++) {
        for (let col = 0; col < currentTetrimino.shape[row].length; col++) {
            if (currentTetrimino.shape[row][col]) {
                const x = currentTetrimino.column + col;
                const y = currentTetrimino.row + row;
                if (y >= 0 && field[y][x]) {
                    return true; // ゲームオーバー
                }
            }
        }
    }

    // ブロックが完全に21段目以上に積み上がったかチェック
    for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
        if (field[0][col] || field[1][col]) {
            return true; // ゲームオーバー
        }
    }

    return false;
}

export function handleGameOver() {
    isGameOver = true;
    console.log("Game Over");
    cancelAnimationFrame(animationId); // アニメーションループを停止
    
    // ゲームオーバー画面を表示
}