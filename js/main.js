import { initGame, gameLoop } from './game.js';
import { initInput } from './input.js';

// 初期化処理
const init = () => {
    initInput();
    initGame();
    // ブラウザの描画タイミングに合わせて指定された関数を呼び出すWebAPI
    // 描画タイミングは画面のリフレッシュレートに依存
    // ex) 一般的なモニターは60Hz(1000ミリ秒 / 60 = 16.7)なので16.7ミリ秒間隔でgameLoopが呼び出される
    requestAnimationFrame(gameLoop);
};

// 初期化関数の呼び出し
init(); 