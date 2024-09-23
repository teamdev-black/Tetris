// main.js
import { initGame, gameLoop } from './game.js';
import { initInput } from './input.js';

function init() {
    initGame();
    initInput();
    requestAnimationFrame(gameLoop);
}

init();