import { initGame, gameLoop, stopGameLoop } from './game.js';
import { initInput } from './input.js';
import { setupGameScreens,setupModalEventListeners } from './gameManager.js';

// スタートボタンを押すことで実行される関数の集まり。
function startGame() {
    initGame();
    initInput();
    gameLoop();
}

function init() {
    setupGameScreens(startGame, stopGameLoop);
    setupModalEventListeners();
}

init();
