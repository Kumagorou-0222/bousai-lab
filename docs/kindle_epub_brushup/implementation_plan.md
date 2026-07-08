# 実装計画：Kindle出版に向けたEPUBブラッシュアップ ＆ アフィリエイト仕上げ

## 背景

- 副業としてKindle出版（案②）とアフィリエイト収益最大化（案①）を進める。
- 現状のEPUB（`bousai-lab-kindle.epub`）は4コマ漫画の品質にバラつきがあり、構成も読み物型で実用性に欠ける。
- ユーザー決定事項：
  - 漫画は **Geminiで再生成**（gemini-manga-4komaスキル使用）
  - 構成は **実用ハンドブック型に再構成**

## 現状分析

### 漫画の品質調査結果（EPUB掲載17話）

| 区分 | スラッグ | 品質 | 対応 |
|------|---------|------|------|
| 本編11話 | blackout-basics, product-*（10話） | 627×627・Gemini製・高品質 | **維持** |
| 低解像度2話 | earthquake-elevator (313×418), evacuation-basics (233×320) | Gemini製だが低解像度 | **再生成** |
| 導入・結び4話 | intro-landlord, intro-father, intro-doctor, closing-community | 600×750・Canvas自動描画・低品質（文字重なり・構図破綻） | **再生成** |

→ **再生成対象：6話 × 4パネル = 24枚**

### 案①アフィリエイトの残作業

- `lib/affiliateLinks.ts`（ASINマップ・楽天ROOMマップ）実装済み
- `components/ComparisonTable.tsx` ボタン追加済み、マンガページAdSense配置済み、`.env.local` 設定済み
- 残り：未解決ASIN 3件の解決確認、`npm run build` 検証、旧task.mdの更新

## 変更内容

### 1. 案①仕上げ

- `amazon_asins.csv` の空ASIN 3件（BOS防臭袋・Gentosランタン・イワタニコンロ）がフォールバック（あいまい一致）で個別商品URLに解決されるか検証。解決されない場合はマップにキーを追加。
- `npm run build` でビルド検証。
- `docs/monetization_improvements/task.md` のチェックボックスを実態に合わせて更新。

### 2. 漫画6話の再生成（Gemini／Claude-in-Chrome経由）

- 既存高品質11話とスタイル統一：チビキャラ「リス」（黄色ヘルメットのリス）＋「Q」（青白ロボット）、正方形、白背景、右上に数字バッジ、日本語吹き出し。
- セリフは `scripts/export-kindle.js` の `MANGA_LIST` / `INTRO_CLOSING_MANGA` の既存データを使用。
- `manga-prompts.md` の既存プロンプト形式に従い、6話分のプロンプトを追記。
- Chrome上のGeminiで1パネルずつ生成 → `public/manga/<slug>/panel-01〜04.png` を差し替え。
- 前提：ChromeでGeminiにログイン済みであること（作業開始時に確認）。

### 3. EPUB構成の実用ハンドブック型への再編（`scripts/export-kindle.js` 改修）

**新構成：**

| 順序 | 章 | 内容 |
|------|-----|------|
| 1 | 表紙 | 現行維持 |
| 2 | はじめに | 「3つの顔」（大家・父・医師）の導入漫画3話＋動機。プロローグ（フィクション）は簡潔化して統合 |
| 3 | 第1章 発災直後——最初の行動 | シーン別（地震：earthquake-elevator／停電：blackout-basics／避難：evacuation-basics）漫画＋要点＋解説 |
| 4 | 第2章 72時間を生き延びる | 現行第3章のタイムラインを前方へ移動 |
| 5 | 第3章 命を守る備蓄グッズ10 | product系漫画10話を優先度順（水→トイレ→電源→…）に再配列。漫画→要点→解説記事の統一フォーマット |
| 6 | 第4章 立場別チェックリスト | 現行維持・重複整理 |
| 7 | 第5章 わが家の防災カルテ | 現行維持（書き込み式） |
| 8 | おわりに | closing-community漫画＋結びの文章 |
| 9 | 付録 | 現行維持 |

**改善ポイント：**
- 「読む順＝行動する順」（直後の行動 → 72時間 → 備蓄 → 家族別 → 記録）に再配列
- 各漫画ページを「漫画 → 3つの要点 → 詳しい解説」の統一フォーマットに
- 章間の重複記述を排除

### 4. EPUB再書き出しと検証

- `node scripts/export-kindle.js` で再生成
- 目次構造・画像・サイズを確認

## 検証計画

- `npm run build`（案①）
- EPUB再生成が正常完了し、全17話の漫画が高品質版に置き換わっていることを確認
- 再生成した24枚のパネル画像の解像度・スタイル一貫性を目視確認

## 実行順序

1. 案①仕上げ（ビルド検証まで）
2. `export-kindle.js` の構成再編（画像差し替え前でも作業可能）
3. 漫画6話の再生成（Chrome＋Gemini）
4. EPUB再書き出し・検証・`walkthrough.md` 作成
