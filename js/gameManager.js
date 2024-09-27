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
