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

    CANVAS2D.fillStyle = '#f00';
    CANVAS2D.fillRect(150, 150, BLOCKSIZE, BLOCKSIZE);

    // grid線を描画
    CANVAS2D.strokeStyle = '#555'; // grid-line color
    for (let row = 0; row < PLAYSCREENHEIGHT; row++) {
        for (let col = 0; col < PLAYSCREENWIDTH; col++) {
            CANVAS2D.strokeRect(col * BLOCKSIZE, row * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
        }
    }
};

// 初期化処理
const init = () => {
    drawPlayScreen();
};

// 初期化関数の呼び出し
init();
