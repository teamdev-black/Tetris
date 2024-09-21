# テトリスプロジェクト ディレクトリ構造（再更新版）

```
tetris/
├── index.html
├── css/
│   ├── style.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── tetromino.js
│   ├── board.js
│   ├── renderer.js
│   ├── input.js
│   ├── score.js
│   └── utils.js
├── assets/
│   ├── images/
│   │   └── tetorimino/
│   │   └── background-image/
│   │   └── bottun/
│   ├── fonts/
│   └── audio/
│       ├── bgm.mp3
│       ├── rotate.wav
│       ├── drop.wav
│       └── clear.wav
├── docs/
│   ├── functional-requirements.md
│   ├── development-workflow.md
│   ├── meeting-notes.md
│   └── directory-structure.md
└── README.md
```

## ディレクトリ構造の説明

### ルートディレクトリ
- `index.html`: メインのHTMLファイル
- `README.md`: プロジェクトの概要、セットアップ手順、および他の重要な情報を記述

### css/
- `style.css`: メインのスタイルシート

### js/
- `main.js`: エントリーポイント。ゲームの初期化と全体の制御を行う
- `game.js`: ゲームのメインロジックを管理
- `tetromino.js`: テトリミノの定義と操作を管理
- `board.js`: ゲームボードの状態を管理
- `renderer.js`: ゲーム画面の描画を担当
- `input.js`: キーボードやタッチ入力の処理を担当
- `score.js`: スコア計算とレベル管理を担当
- `utils.js`: 汎用的な関数や定数を定義

### assets/
- `images/`: 画像ファイルを格納
- `fonts/`: カスタムフォントを使用する場合に格納
- `audio/`: BGMや効果音のオーディオファイルを格納

### docs/
- `functional-requirements.md`: プロジェクトの機能要件書を格納
- `directory-structure.md`: このディレクトリ構造の説明を格納
- `development-workflow.md`: プロジェクトの進め方を記載
- `meeting-notes.md`: プロジェクトの議事録