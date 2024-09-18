# テトリス実装プロジェクト 開発ワークフローガイドライン

## 目次
1. [プロジェクト計画](#プロジェクト計画)
2. [Issue管理](#issue管理)
3. [開発プロセス](#開発プロセス)
4. [品質管理](#品質管理)
5. [プルリクエスト（PR）](#プルリクエストpr)
6. [リリースプロセス](#リリースプロセス)

## プロジェクト計画

### 機能要件の理解
- 全員でfunctional-requirements.mdを読み合わせ、内容を確認する
- 不明点があれば、チーム内で議論し、必要に応じて詳細化する

### タスク分解
- 機能要件を以下のカテゴリに分類し、Issueとして作成する
  1. 基本ゲームプレイ（1.1 ~ 1.6）
  2. 追加機能（2.1 ~ 2.5）
  3. スコアシステム（3.1 ~ 3.2）
  4. レベルシステム（4.1 ~ 4.2）
  5. UI/UX（5.1 ~ 5.4）
  6. その他の機能（6.1 ~ 6.4）
- 各Issueは2-3日程度で完了できる粒度に分割する

## Issue管理

### Issue作成ガイドライン
- タイトル: `[カテゴリ] 実装する機能名`
  例: `[1.3 基本ゲームプレイ] テトリミノの左右移動実装`
- 説明:
  - 実装する機能の詳細
  - 受け入れ条件（完了の定義）
  - 関連する機能要件の参照

### Issue追跡と優先順位付け
- GitHub Projectsを使用してカンバンボードを作成
- 優先順位:
  1. 基本ゲームプレイ
  2. UI/UX（基本的なもの）
  3. スコアシステム（基本的なもの）
  4. 追加機能
  5. レベルシステム
  6. その他の機能

## 開発プロセス

### ブランチ戦略
- developブランチ: 開発作業の統合ブランチ
- featureブランチ: 各機能の開発用
- debugブランチ: デバッグ用
- refactorブランチ:リファクタリング用
- documentブランチ:document編集用

#### ブランチ命名規則
- フォーマット: `feature/<issue-number>-<short-description>`
- 例: `feature/12-implement-left-right-movement`

### コーディング規約
- インデント: スペース4個
- 変数名: キャメルケース（例: `gameField`, `currentTetrimino`）
- 関数名: キャメルケース（例: `moveLeft()`, `rotateClockwise()`）
- コメント: 複雑なロジックには必ずコメントを付ける

### コミットメッセージガイドライン
- フォーマット: `[動詞] 変更内容の要約`
- 例: `[Add] テトリミノの左右移動機能`

## 品質管理

### テスト方針
- 各機能実装後に手動テストを実施
- テストシナリオをPRのコメントとして記録

### コードレビュー
- PRを作成したら、他の2人にレビューを依頼
- レビューでは以下を確認:
  - コーディング規約の遵守
  - 機能要件との整合性
  - コードの可読性
  - バグの有無

## プルリクエスト（PR）

### PR作成ガイドライン
- タイトル: `[WIP] #<Issue番号> 実装した機能名`
- 説明:
  - 実装した機能の概要
  - テスト結果
  - レビューで特に確認して欲しい点

### PRテンプレート
```markdown
## 概要
<!-- 変更の目的と概要を記述 -->

## 変更内容
<!-- 具体的な変更内容をリストアップ -->

## テスト結果
<!-- 実施したテストとその結果を記述 -->

## レビューポイント
<!-- レビュアーに特に見てほしい点があれば記述 -->

## 関連Issue
<!-- 関連するIssue番号を記述 -->
```

### リリース手順
1. GitHub Pagesにデプロイ

---

注意: このガイドラインは、プロジェクトの進行に応じて適宜更新してください。チーム全員で定期的にレビューし、必要に応じて改善を加えましょう。