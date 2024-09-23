import { moveLeft, moveRight, moveDown, hardDrop, rotateTetrimino } from './tetrimino.js';

export function initInput() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    switch(e.key) {
        case "ArrowLeft": moveLeft(); break;
        case "ArrowRight": moveRight(); break;
        case "ArrowUp":
        case "x": rotateTetrimino(true); break;
        case "Control":
        case "z": rotateTetrimino(false); break;
        case "ArrowDown": moveDown(); break;
        case " ": hardDrop(); break;
    }
}