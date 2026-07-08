# 実装計画：防災Lab 収益化改善（優先施策 1, 2, 4, 5, 6）

この計画は、サイトの収益化（アフィリエイトおよびアドセンス）を最大化するため、ユーザーからご指示いただいた優先度の高い5つの施策を反映するものです。

---

## ユーザー確認・承認事項

> [!IMPORTANT]
> **環境変数の本番設定について**
> 楽天アフィリエイトID自動変換を機能させるため、Vercel等のデプロイ環境にて環境変数 `NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID` を設定いただく必要があります。
> 今回、ローカル環境検証用として [`.env.local`](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/.env.local) ファイル（ダミーID含む）を新規作成/更新します。

---

## 提案する変更内容

### 1. アフィリエイトリンクの特定商品URL化 & ローリングストック誘導 (施策1, 6)
[lib/products.ts](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/lib/products.ts) 内の汎用的な検索結果URL（例: `https://www.amazon.co.jp/s?k=携帯トイレ+防災+100回分`）を、医師監修にふさわしい**具体的なおすすめ商品（ベストセラー・高評価商品など）の個別URL**へ書き換えます。
また、水や食料は定期便購入（ローリングストック）が可能な商品のURLを選択します。

#### [MODIFY] [products.ts](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/lib/products.ts)
*   **携帯トイレ**: Qbit 携帯トイレ 100回分 等の個別URLに変更
*   **モバイルバッテリー**: Anker Power Bank (20000mAh, PSE認証) 等 of 個別URLに変更
*   **LEDランタン**: ジェントス (GENTOS) 乾電池式ランタン 等の個別URLに変更
*   **保存水**: 志布志 of 自然水 2L×24本（長期保存＆定期購入適性）等の個別URLに変更
*   **カセットコンロ**: イワタニ カセットフー 風まるIII + ガス缶セット等の個別URLに変更
*   **非常食**: 尾西食品 アルファ米 14種類セット等の個別URLに変更
*   **防臭袋**: BOS おむつが臭わない袋 LLサイズ 200枚等の個別URLに変更
*   など、全10カテゴリのおすすめ商品を個別リンクにブラッシュアップ。

---

### 2. 楽天アフィリエイトIDの設定 (施策2)
環境変数 `NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID` が正しくロードされるようにローカル設定ファイルを整備します。

#### [NEW] [`.env.local`](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/.env.local)
*   `NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID` を定義（ローカル確認用にダミーID `1400711` または本番アフィリエイトIDを指定可能に設定）

---

### 3. 比較表（ComparisonTable）への購入導線の追加 (施策4)
[components/ComparisonTable.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/components/ComparisonTable.tsx) を拡張し、Propsから渡されたAmazon/楽天のリンクを用いて、テーブルの下に「比較したおすすめ商品を準備する」ためのアフィリエイトボタンエリアを描画します。

#### [MODIFY] [ComparisonTable.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/components/ComparisonTable.tsx)
*   Propsに `amazonUrl?: string` と `rakutenUrl?: string` を追加。
*   テーブルの直下に、クリーンなデザインのアフィリエイトボタン（「Amazonで見る」「楽天で見る」）を表示するコンポーネントを差し込み。

#### [MODIFY] [app/manga/\[slug\]/page.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/app/manga/%5Bslug%5D/page.tsx)
*   `<ComparisonTable comparison={product.comparison} />` 呼び出し時に、`amazonUrl` と `rakutenUrl` を渡すように変更。

#### [MODIFY] [app/articles/\[slug\]/page.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/app/articles/%5Bslug%5D/page.tsx)
*   同上。

---

### 4. Google AdSense（アドセンス）の配置最適化 (施策5)
現在ブログ記事内にしか配置されていないアドセンス広告を、アクセスが多くなるマンガページにも最適配置します。

#### [MODIFY] [app/manga/\[slug\]/page.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/app/manga/%5Bslug%5D/page.tsx)
*   `AdSense` コンポーネントをインポート。
*   4コマ漫画画像のすぐ下（「レスQロボのまとめ」の直前）に `AdSense` スロットを追加。
*   グッズセクションと末尾CTAの間に `AdSense` スロットを追加。

#### [MODIFY] [app/manga/page.tsx](file:///h:/%E3%83%9E%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/031_bousai-lab/app/manga/page.tsx)
*   `AdSense` コンポーネントをインポート。
*   「防災を学ぶ」セクションと「防災グッズを知る」セクションの間に `AdSense` スロットを配置。

---

## 検証計画

### 自動テスト＆ビルド確認
*   `npm run build` を実行し、Next.jsの静的生成/コンパイルにエラーがないことを確認。

### 手動確認項目
*   マンガ詳細ページおよびブログ詳細ページを開き、比較表の下にアフィリエイトボタンが正しく表示され、リンク先URLに `tag=bousailab0c-22` などのAmazonアソシエイトタグや、楽天アフィリエイト自動変換URLが適用されていることを確認する。
*   アフィリエイト監査ページ `/affiliate-audit` にアクセスし、リンクエラーや「タグ未設定」の警告が解消されていることを確認する。
*   マンガ詳細・一覧ページでアドセンス広告枠が正しいレイアウトで埋め込まれていることを確認する。
