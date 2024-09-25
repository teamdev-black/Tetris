import { getCurrentTetrimino } from './tetrimino.js';
import { field } from './board.js';
import { animationId } from './game.js';
import { PLAY_SCREEN_WIDTH } from './utils.js';

let score = 0;
let level = 1;
let linesCleared = 0;

export let isGameOver = false;

export function getScore() {
    return score;
}

export function getLevel() {
    return level;
}

export function updateScore(clearedLines) {
    if (clearedLines === 0) {
        return;
    }

    const scoreIncrement = calculateScoreIncrement(clearedLines);
    score += scoreIncrement;
    linesCleared += clearedLines;

    checkLevelUp();
    updateScoreDisplay();
    updateLevelDisplay();
}



function calculateScoreIncrement(clearedLines) {
    const baseScores = {
        1: 100,  // Single
        2: 300,  // Double
        3: 500,  // Triple
        4: 800   // Tetris
    };

    const baseScore = baseScores[clearedLines] || 0;
    return baseScore * level;
}

function checkLevelUp() {
    const newLevel = Math.floor(linesCleared / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
        console.log('Level up! New level:', level);
    }
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function updateLevelDisplay() {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = level;
    }
}

export function checkGameOver() {
    const currentTetrimino = getCurrentTetrimino();
    if (!currentTetrimino) {
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