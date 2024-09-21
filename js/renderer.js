import { BLOCKSIZE, CANVASWIDTH, CANVASHEIGHT, PLAYSCREENWIDTH, PLAYSCREENHEIGHT } from './utils.js';
import { currentTetrimino } from './tetrimino.js';

const CANVAS = document.getElementById('canvas');
const CANVAS2D = CANVAS.getContext('2d');

CANVAS.width = CANVASWIDTH;
CANVAS.height = CANVASHEIGHT;

export function drawPlayScreen() {
    // ... (プレイ画面描画処理)
    // 背景色を黒に設定
    CANVAS2D.fillStyle = '#000';

    // キャンバスを塗りつぶす
    CANVAS2D.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    // grid線を描画
    CANVAS2D.strokeStyle = '#555'; // grid-line color
    for (let row = 0; row < PLAYSCREENHEIGHT; row++) {
        for (let col = 0; col < PLAYSCREENWIDTH; col++) {
            CANVAS2D.strokeRect(col * BLOCKSIZE, row * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
        }
    }
};



export function drawTetrimino() {
    // ...(現在のテトリミノ描画処理)
    CANVAS2D.fillStyle = currentTetrimino.color;
    for (let row = 0; row < currentTetrimino.matrix.length; row++) {
        for (let column = 0; column < currentTetrimino.matrix[row].length; column++) {
            if (currentTetrimino.matrix[row][column]) {
                const x = (currentTetrimino.column + column) * BLOCKSIZE;
                const y = (currentTetrimino.row + row) * BLOCKSIZE;
                CANVAS2D.fillRect(x, y, BLOCKSIZE, BLOCKSIZE);
                CANVAS2D.strokeRect(x, y, BLOCKSIZE, BLOCKSIZE);
            }
        }
    }
}

