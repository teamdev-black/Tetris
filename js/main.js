import { initGame, gameLoop, stopGameLoop } from './game.js';
import { initInput } from './input.js';
import { setupGameScreens,setupModalEventListeners } from './gameManager.js';
import { loadSounds,playBGM,stopBGM} from './audio.js';

// スタートボタンを押すことで実行される関数の集まり。
function startGame() {
    initGame();
    gameLoop();
    playBGM();
}
function stopGame() {
    stopGameLoop();
    stopBGM();  // BGMを停止
}

function init() {
    setupGameScreens(startGame, stopGameLoop);
    setupModalEventListeners();
    loadSounds();
}

init();
