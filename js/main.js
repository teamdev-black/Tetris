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

    // 固定されたブロックを描画
    for (let row = 0; row < PLAYSCREENHEIGHT; row++) {
        for (let col = 0; col < PLAYSCREENWIDTH; col++) {
            if (field[row][col]) {
                CANVAS2D.fillStyle = field[row][col];
                CANVAS2D.fillRect(col * BLOCKSIZE, row * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
                CANVAS2D.strokeStyle = '#555';
                CANVAS2D.strokeRect(col * BLOCKSIZE, row * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
            }
        }
    }

    // grid線を描画
    CANVAS2D.strokeStyle = '#555'; // grid-line color
    for (let row = 0; row < PLAYSCREENHEIGHT; row++) {
        for (let col = 0; col < PLAYSCREENWIDTH; col++) {
            CANVAS2D.strokeRect(col * BLOCKSIZE, row * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
        }
    }
};

// フィールドグリッドの初期化
const field = [];
for (let row = 0; row < PLAYSCREENHEIGHT; row++) {
    field[row] = [];
    for (let col = 0; col < PLAYSCREENWIDTH; col++) {
        field[row][col] = null; // 空のセルはnullとする
    }
}

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

// 衝突判定を行うアロー関数
const isCollision = (tetrimino) => {
    const matrix = tetrimino.matrix;
    const row = tetrimino.row;
    const column = tetrimino.column;

    for (let r = 0; r < matrix.length; r++) { // r = 行
        for (let c = 0; c < matrix[r].length; c++) { // c = 列
            if (matrix[r][c]) {
                const x = column + c;
                const y = row + r;

                // テトリミノが左端または右端を超えていないか、下端を超えていないかをチェック
                if (x < 0 || x >= PLAYSCREENWIDTH || y >= PLAYSCREENHEIGHT) {
                    return true; // 衝突あり
                }

                // フィールドグリッドとの衝突をチェック
                if (y >= 0 && field[y][x]) {
                    return true; // 衝突あり
                }
            }
        }
    }
    return false; // 衝突なし
};

// テトリミノを移動または回転させる関数
const moveTetrimino = (newRow, newColumn, newMatrix = null) => {
    const originalRow = currentTetrimino.row;
    const originalColumn = currentTetrimino.column;
    const originalMatrix = currentTetrimino.matrix;

    currentTetrimino.row = newRow;
    currentTetrimino.column = newColumn;
    if (newMatrix) {
        currentTetrimino.matrix = newMatrix;
    }

    if (isCollision(currentTetrimino)) {
        // 衝突した場合は元の位置と形状に戻す
        currentTetrimino.row = originalRow;
        currentTetrimino.column = originalColumn;
        currentTetrimino.matrix = originalMatrix;
        return false; // 移動失敗
    } else {
        return true; // 移動成功
    }
};


// / テトリミノを左に移動させる関数
const shiftLeft = () => {
    moveTetrimino(currentTetrimino.row, currentTetrimino.column - 1);
};

// テトリミノを右に移動させる関数
const shiftRight = () => {
    moveTetrimino(currentTetrimino.row, currentTetrimino.column + 1);
};

// テトリミノを下に移動させるソフトドロップ関数
const shiftDown = () => {
    moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column);
};

// テトリミノの通常落下速度(millisec)
const DROPSPEED = 1000;

// 最後のドロップ時間を記録する変数
let lastDropTime = 0;

// テトリミノを時間経過とともに1行落下させる関数
const normalDrop = (currentTime) => {
    if (currentTime - lastDropTime > DROPSPEED) {
        if (!moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column)) {
            // 移動に失敗した場合（衝突した場合）
            lockTetrimino();
            currentTetrimino = null; // 新しいテトリミノを生成するために現在のテトリミノをクリア
        }
        lastDropTime = currentTime;
    }
};


// テトリミノをフィールドグリッドに固定する関数
function lockTetrimino() {
    const matrix = currentTetrimino.matrix;
    const row = currentTetrimino.row;
    const column = currentTetrimino.column;

    matrix.forEach((rowMatrix, r) => {
        rowMatrix.forEach((cell, c) => {
            if (cell) {
                const x = column + c;
                const y = row + r;
                
                field[y][x] = currentTetrimino.color;
            }
        });
    });
}

function rotateTetrimino() {
    const iTetriminoSize = 4;
    let currentShape = currentTetrimino.matrix;
    let matrixSize = currentShape.length;
    let rotatedShape = [];

    // 回転後の形状を計算
    if (currentTetrimino.name === 'I') {
        rotatedShape = new Array(iTetriminoSize).fill().map(() => new Array(iTetriminoSize).fill(0));
        if (currentShape[1][0] === 1) {
            // 縦長に変更
            for (let i = 0; i < iTetriminoSize; i++) {
                rotatedShape[i][2] = 1;
            }
        } else {
            // 横長に変更
            for (let i = 0; i < iTetriminoSize; i++) {
                rotatedShape[1][i] = 1;
            }
        }
    } else {
        rotatedShape = new Array(matrixSize).fill().map(() => new Array(matrixSize).fill(0));
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                rotatedShape[j][matrixSize - 1 - i] = currentShape[i][j];
            }
        }
    }

    // 回転を試みる
    moveTetrimino(currentTetrimino.row, currentTetrimino.column, rotatedShape);
}


// キーボードイベントハンドラの追加
const handleKeyDown = (e) => {
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
        case "ArrowDown":
            shiftDown();
            break;
    }
}

// ゲームループ関数
// requestAnimationFlameの呼び出しにより現在の時刻:DOMHighResTimeStampがgameLoopに渡される
// それをcurrentTimeとして受け取っている
function gameLoop(currentTime) {  
    drawPlayScreen();
    if (currentTetrimino === null) {
        addNewTetrimino();
        lastDropTime = currentTime;
    } else {
        normalDrop(currentTime);
        drawTetrimino()
    }

    requestAnimationFrame(gameLoop);
}

// 初期化処理
const init = () => {
    document.addEventListener('keydown', handleKeyDown); //初期化処理にキーボードイベントハンドラの追加
    // ブラウザの描画タイミングに合わせて指定された関数を呼び出すWebAPI
    // 描画タイミングは画面のリフレッシュレートに依存
    // ex) 一般的なモニターは60Hz(1000ミリ秒 / 60 = 16.7)なので16.7ミリ秒間隔でgameLoopが呼び出される
    requestAnimationFrame(gameLoop);
};

// 初期化関数の呼び出し
init();
