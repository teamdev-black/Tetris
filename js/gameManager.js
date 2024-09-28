import { pauseGame, resumeGame } from './game.js';
import { playBGM, stopBGM } from './audio.js';

// ゲームスタート、ゲームやり直しの関数
export function setupGameScreens(startGameFunction, stopGameFunction,) {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');

    

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        startGameFunction(); // ゲームを開始
        playBGM(); // BGMを再生

    });

    homeButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        stopGameFunction(); // ゲームを停止・リセット
        stopBGM(); // BGMを停止

    });
}

// モーダルウィンドウの表示関数
const controlBtn = document.querySelector('#control-btn');
const modal = document.querySelector('#controlsModal');
const closeBtn = document.querySelector('.close-btn');

function showControls() {
    modal.style.display = 'block';
}

function hideControls() {
    modal.style.display = 'none';
}

export function setupModalEventListeners() {
    controlBtn.addEventListener('click', () => {
        showControls();
        pauseGame();  // ゲームを一時停止
    });

    closeBtn.addEventListener('click', () => {
        hideControls();
        resumeGame();  // ゲームを再開
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideControls();
            resumeGame();  // ゲームを再開
        }
    });
}