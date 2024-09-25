// main.js
import { initGame, gameLoop } from './game.js';
import { initInput } from './input.js';
import { checkScoreElement } from './score.js';


function init() {
    checkScoreElement(); 
    initGame();
    initInput();
    requestAnimationFrame(gameLoop);
}

init();