// テトリミノの定義
const TETROMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00FFFF'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#FFFF00'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#800080'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#00FF00'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#FF0000'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#0000FF'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#FFA500'
    }
};

// 1ブロックの大きさ
const BLOCKSIZE = 30;

// フィールドのサイズ
const PLAYSCREENWIDTH = 10;
const PLAYSCREENHEIGHT = 22;

// キャンバスIDの取得
const CANVAS = document.getElementById('canvas');

// 2dコンテキストの取得
const CANVAS2D = CANVAS.getContext('2d');

// キャンバスサイズ（＝プレイ画面のサイズ）
const CANVASWIDTH = BLOCKSIZE * PLAYSCREENWIDTH;
const CANVASHEIGHT = BLOCKSIZE * PLAYSCREENHEIGHT;
CANVAS.width = CANVASWIDTH;
CANVAS.height = CANVASHEIGHT;

// プレイ画面描画処理
const drawPlayScreen = () => {
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

// テトリミノの生成順序
let tetriminoSequence = [];

// 次のテトリミノを取得する関数
function getNextTetrimino() {
    if (tetriminoSequence.length === 0) {
        // 新しい7種のテトリミノをランダム順に生成
        tetriminoSequence = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'].sort(() => Math.random() - 0.5);
    }
    const name = tetriminoSequence.pop();
    const matrix = TETROMINOS[name].shape;
    const color = TETROMINOS[name].color;

    // 初期位置の設定
    const column = PLAYSCREENWIDTH / 2 - Math.ceil(matrix[0].length / 2);
    const row = 0;

    return {
        name: name,     // テトリミノの種類
        matrix: matrix, // 形状
        color: color,   // 色
        row: row,       // 現在の行
        column: column  // 現在の列
    };
}

// 現在のテトリミノを保持する変数
let currentTetrimino = null;

// 新しいテトリミノをゲームに追加する関数
function addNewTetrimino() {
    currentTetrimino = getNextTetrimino();
    drawTetrimino();
}

// テトリミノを描画する関数
function drawTetrimino() {
    if (!currentTetrimino || !currentTetrimino.matrix) {
        console.error('Current tetrimino is not properly initialized');
        return;
    }

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

// ゲームループ関数
function gameLoop() {
    drawPlayScreen();
    if (currentTetrimino === null) {
        addNewTetrimino();
    } else {
        drawTetrimino();
    }
    console.log(currentTetrimino);
    requestAnimationFrame(gameLoop);  // この行を追加

}

// 初期化処理
const init = () => {
    requestAnimationFrame(gameLoop);
};

// 初期化関数の呼び出し
init();
