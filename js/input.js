import {currentTetrimino, shiftLeft, shiftRight, rotateTetrimino } from './tetrimino.js';

export function initInput() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    if (!currentTetrimino) return;

    switch(e.key) {

        case "ArrowLeft": //"ArrowLeft"は左矢印キーの識別子になります。
            shiftLeft();
            break;
        case "ArrowRight": //"ArrowRight"は左矢印キーの識別子になります。
            shiftRight();
            break;
        case "ArrowUp": // 追加: 上矢印キーで回転
            rotateTetrimino();
            break;
    }
}