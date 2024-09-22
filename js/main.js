// テトリミノの定義
const TETRIMINOS = {
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

// 定数
const BLOCK_SIZE = 30;
const PLAY_SCREEN_WIDTH = 10;
const PLAY_SCREEN_HEIGHT = 22;
const CANVAS_WIDTH = BLOCK_SIZE * PLAY_SCREEN_WIDTH;
const CANVAS_HEIGHT = BLOCK_SIZE * PLAY_SCREEN_HEIGHT;
const DROP_SPEED = 1000;

// キャンバス設定
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// ゲーム状態
let field = [];
let currentTetrimino = null;
let tetriminoSequence = [];
let lastDropTime = 0;
let isGameOver = false;

// フィールドの初期化
function initField() {
    field = Array(PLAY_SCREEN_HEIGHT).fill().map(() => Array(PLAY_SCREEN_WIDTH).fill(null));
}

// プレイ画面描画
function drawPlayScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 固定されたブロックを描画
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            if (field[row][col]) {
                drawBlock(col, row, field[row][col]);
            }
        }
    }

    // グリッド線を描画
    drawGrid();
}

// ブロックを描画
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#555';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// グリッド線を描画
function drawGrid() {
    ctx.strokeStyle = '#555';
    for (let row = 0; row < PLAY_SCREEN_HEIGHT; row++) {
        for (let col = 0; col < PLAY_SCREEN_WIDTH; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

// 次のテトリミノを取得
function getNextTetrimino() {
    if (tetriminoSequence.length === 0) {
        tetriminoSequence = Object.keys(TETRIMINOS).sort(() => Math.random() - 0.5);
    }
    const name = tetriminoSequence.pop();
    const { shape, color } = TETRIMINOS[name];
    const column = Math.floor(PLAY_SCREEN_WIDTH / 2) - Math.ceil(shape[0].length / 2);
    const row = 0;

    return { name, shape, color, row, column };
}

// 新しいテトリミノをゲームに追加
function addNewTetrimino() {
    currentTetrimino = getNextTetrimino();
    if (checkCollision(currentTetrimino)) {
        handleGameOver();
    } else {
        drawTetrimino();
    }
}

// テトリミノを描画
function drawTetrimino() {
    if (!currentTetrimino) return;
    const { shape, color, row, column } = currentTetrimino;
    shape.forEach((rowShape, r) => {
        rowShape.forEach((cell, c) => {
            if (cell) {
                drawBlock(column + c, row + r, color);
            }
        });
    });
}

// 衝突判定
function checkCollision(tetrimino) {
    const { shape, row, column } = tetrimino;
    return shape.some((rowShape, r) => 
        rowShape.some((cell, c) => {
            if (cell) {
                const x = column + c;
                const y = row + r;
                return x < 0 || x >= PLAY_SCREEN_WIDTH || y >= PLAY_SCREEN_HEIGHT || (y >= 0 && field[y][x]);
            }
            return false;
        })
    );
}

// テトリミノを移動
function moveTetrimino(newRow, newColumn, newShape = null) {
    const originalTetrimino = { ...currentTetrimino };
    currentTetrimino.row = newRow;
    currentTetrimino.column = newColumn;
    if (newShape) {
        currentTetrimino.shape = newShape;
    }

    if (checkCollision(currentTetrimino)) {
        Object.assign(currentTetrimino, originalTetrimino);
        return false;
    }
    return true;
}

// テトリミノの移動操作
const moveLeft = () => moveTetrimino(currentTetrimino.row, currentTetrimino.column - 1);
const moveRight = () => moveTetrimino(currentTetrimino.row, currentTetrimino.column + 1);
const moveDown = () => moveTetrimino(currentTetrimino.row + 1, currentTetrimino.column);

// テトリミノの通常落下
function normalDrop(currentTime) {
    if (currentTime - lastDropTime > DROP_SPEED) {
        if (!moveDown()) {
            lockTetrimino();
            currentTetrimino = null;
        }
        lastDropTime = currentTime;
    }
}

// テトリミノの落下地点を取得
function getTetriminoDropPosition() {
    let ghostRow = currentTetrimino.row;
    while (!checkCollision({ ...currentTetrimino, row: ghostRow + 1 })) {
        ghostRow++;
    }
    return ghostRow;
}

// ハードドロップ
function hardDrop() {
    const dropRow = getTetriminoDropPosition();
    if (moveTetrimino(dropRow, currentTetrimino.column)) {
        lockTetrimino();
        currentTetrimino = null;
    }
}

// 完全に埋まった行を消去
function clearFullLines() {
    let linesCleared = 0;
    for (let row = PLAY_SCREEN_HEIGHT - 1; row >= 0; row--) {
        if (field[row].every(cell => cell !== null)) {
            field.splice(row, 1);
            field.unshift(Array(PLAY_SCREEN_WIDTH).fill(null));
            linesCleared++;
        }
    }
    return linesCleared;
}

// テトリミノをフィールドに固定
function lockTetrimino() {
    const { shape, row, column, color } = currentTetrimino;
    shape.forEach((rowShape, r) => {
        rowShape.forEach((cell, c) => {
            if (cell) {
                const y = row + r;
                const x = column + c;
                if (y >= 0 && y < PLAY_SCREEN_HEIGHT && x >= 0 && x < PLAY_SCREEN_WIDTH) {
                    field[y][x] = color;
                }
            }
        });
    });
    clearFullLines();
}

// テトリミノを回転
function rotateTetrimino(clockwise = true) {
    const { name, shape } = currentTetrimino;
    let newShape;

    if (name === 'O') return; // O型は回転しない

    const iTetriminoSize = 4;

    if (name === 'I') {
        newShape = Array(iTetriminoSize).fill().map(() => Array(iTetriminoSize).fill(0));
        if (clockwise) {
            if (shape[1][0] === 1) { // 横長の場合
                // 縦長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[i][2] = 1;
                }
            } else { // 縦長の場合
                // 横長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[1][i] = 1;
                }
            }
        } else { // 反時計回り
            if (shape[0][1] === 1 || shape[0][2] === 1) { // 縦長の場合
                // 横長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[2][i] = 1;
                }
            } else { // 横長の場合
                // 縦長に変更
                for (let i = 0; i < iTetriminoSize; i++) {
                    newShape[i][1] = 1;
                }
            }
        } 
    } else {
        newShape = shape.map((row, i) => 
            row.map((_, j) => clockwise ? shape[shape.length - 1 - j][i] : shape[j][shape.length - 1 - i])
        );
    }

    moveTetrimino(currentTetrimino.row, currentTetrimino.column, newShape);
}

// ゲームオーバーチェック
function checkGameOver() {
    return currentTetrimino !== null && checkCollision(currentTetrimino);
}

// ゲームオーバー処理
function handleGameOver() {
    isGameOver = true;
    console.log("Game Over");
    // ここにゲームオーバー時の追加処理を記述
}

// キーボードイベントハンドラ
function handleKeyDown(e) {
    if (!currentTetrimino || isGameOver) return;

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

// ゲームループ
function gameLoop(currentTime) {
    if (!isGameOver) {
        drawPlayScreen();
        if (currentTetrimino === null) {
            addNewTetrimino();
            if (checkGameOver()) {
                handleGameOver();
                return;
            }
            lastDropTime = currentTime;
        } else {
            normalDrop(currentTime);
            drawTetrimino();
        }
        requestAnimationFrame(gameLoop);
    }
}

// 初期化処理
function init() {
    initField();
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);
}

// ゲーム開始
init();