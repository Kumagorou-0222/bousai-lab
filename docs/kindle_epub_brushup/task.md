# タスクリスト：Kindle EPUBブラッシュアップ ＆ アフィリエイト仕上げ

## 案① アフィリエイト仕上げ
- `[x]` 未解決ASIN 3件のフォールバック解決確認（`gentos ledランタン 防災`・`カセットコンロ 防災 iwatani` をマップ追加。`bos 防臭袋 防災` はあいまい一致で解決済み）
- `[ ]` ビルド検証（※ローカルnode_modulesがGoogle Drive同期で破損しており未実施。Vercelビルドで代替検証）
- `[ ]` `docs/monetization_improvements/task.md` のチェック状態更新

## 案② EPUBブラッシュアップ
### 構成再編
- `[x]` `scripts/export-kindle.js` を実用ハンドブック型構成に改修
- `[x]` 漫画ページの統一フォーマット化（漫画→要点→解説）
- `[x]` product系漫画10話の優先度順再配列

### 漫画再生成（6話×4パネル＝24枚）
- `[ ]` 6話分のGeminiプロンプト作成（`manga-prompts.md` に追記）
- `[ ]` intro-landlord 再生成（4枚）
- `[ ]` intro-father 再生成（4枚）
- `[ ]` intro-doctor 再生成（4枚）
- `[ ]` closing-community 再生成（4枚）
- `[ ]` earthquake-elevator 再生成（4枚）
- `[ ]` evacuation-basics 再生成（4枚）

### 検証・納品
- `[ ]` EPUB再書き出し（`node scripts/export-kindle.js`）
- `[ ]` 目次・画像・サイズの確認
- `[ ]` `walkthrough.md` 作成
