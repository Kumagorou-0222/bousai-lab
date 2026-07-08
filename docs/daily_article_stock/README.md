# 毎日の記事+4コマ漫画 自動ストック生成の運用ガイド

## 全体フロー

```
┌─ GitHub Actions（毎日 05:30 JST・自動）────────────────┐
│ 1. scripts/replenishIdeas.ts                            │
│    アイデアが5件未満なら Claude API で10件自動補充       │
│ 2. scripts/generateArticleDraft.ts --limit 1            │
│    アイデアから記事下書きを1本生成 → content/drafts/     │
│ 3. scripts/validateDraft.ts                             │
│    品質チェック（warning表示のみ）                       │
│ 4. scripts/buildMangaPrompt.ts                          │
│    4コマ漫画用プロンプト → content/drafts/manga-prompts/ │
│ 5. commit & push [skip ci]                              │
└─────────────────────────────────────────────────────────┘
              ↓ ストックが貯まる
┌─ ローカル（週1回など・まとめて）─────────────────────────┐
│ 6. https://bousai-lab.vercel.app/drafts で下書きを確認   │
│ 7. 漫画生成: content/drafts/manga-prompts/<slug>.txt を  │
│    ChatGPT（画像生成）に貼り付け → 生成された画像を       │
│    node scripts/save-comic.js --slug <slug> で保存       │
│    ※Claudeに「ストックの漫画を描いて」と頼めば自動化可    │
│ 8. 公開: npx tsx scripts/publishDraft.ts --slug <slug>   │
│ 9. git commit & push → Vercel 自動デプロイ               │
└─────────────────────────────────────────────────────────┘
```

## 必要な設定（初回のみ）

- GitHub リポジトリの Secrets に `ANTHROPIC_API_KEY` を登録する:
  ```
  gh secret set ANTHROPIC_API_KEY
  ```
  （Anthropic Console https://console.anthropic.com/ で発行したAPIキー）

## 4コマ漫画のスタイル

- キャラクター: 防災リス（リス）とレスQロボ（ロボ）。特徴ロック文は
  `scripts/buildMangaPrompt.ts` の `CHARACTER_LOCK` に固定してある。
- 生成先: `public/manga/<slug>/comic.png`（縦長2:3・4コマ縦一列）
- 記事frontmatterの `mangaImages` が comic.png を参照する
  （save-comic.js が自動更新）

## 手動での実行

```bash
# 記事下書きを1本だけ生成
npx tsx scripts/generateArticleDraft.ts --limit 1

# 特定アイデアで生成
npx tsx scripts/generateArticleDraft.ts --slug burglary-prevention-basics

# アイデア残量の確認・補充
npx tsx scripts/replenishIdeas.ts

# 漫画プロンプトの再生成
npx tsx scripts/buildMangaPrompt.ts --slug <slug>
```

## 防犯カテゴリ

`crime-prevention`（防犯🔒）カテゴリを追加済み（lib/categories.ts）。
アイデアリスト（data/article-ideas.json）には防災と防犯が混在しており、
補充時も防犯が最低3割含まれるようにプロンプトで指示している。
