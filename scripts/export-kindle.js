'use strict';
/**
 * export-kindle.js
 * 防災Lab の全まんが + 対応記事を 1冊の EPUB にまとめる。
 *
 * 実行: node scripts/export-kindle.js
 * 出力: bousai-lab-kindle.epub
 */

const { createCanvas, loadImage } = require('canvas');
const fs   = require('fs');
const path = require('path');
const JSZip = require('jszip');
// gray-matter はバージョンにより default エクスポート形式が異なるため両対応
const grayMatterModule = require('gray-matter');
const matter = grayMatterModule.default || grayMatterModule;
// 表紙画像生成（generate-kindle-cover.js を再利用。sharp が必要）
const { renderCoverJpeg } = require('./generate-kindle-cover');

// ── パス定数 ──────────────────────────────────────────────────────
const ROOT    = path.resolve(__dirname, '..');
const PUBLIC  = path.join(ROOT, 'public');
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');

// ── まんがデータ（lib/manga.ts から転記） ─────────────────────────
const MANGA_LIST = [
  {
    slug: 'earthquake-elevator',
    title: '地震のとき、エレベーターは使っていい？',
    category: 'earthquake',
    emoji: '🏢',
    description: '地震直後のエレベーター使用の危険性をリスとロボが教えてくれます',
    panels: [
      { character: 'riss',  text: 'じしんがきた！エレベーターで逃げよう！' },
      { character: 'robot', text: '待て！エレベーターはだめだ！' },
      { character: 'robot', text: '停電で閉じ込め…余震で急停止…危険がいっぱい' },
      { character: 'riss',  text: 'わかった！階段を使うんだね！覚えた！' },
    ],
    points: [
      '地震直後はエレベーターを使わない',
      '停電・閉じ込めのリスクがある',
      '震度5強以上は点検完了まで使用禁止',
    ],
    articleSlug: 'earthquake-elevator',
  },
  {
    slug: 'blackout-basics',
    title: '停電したとき、まずなにをする？',
    category: 'blackout',
    emoji: '🔦',
    description: '停電直後にやるべき3つの行動をリスとロボが教えてくれます',
    panels: [
      { character: 'riss',  text: '停電した！どうすればいいの？！' },
      { character: 'robot', text: 'まず落ち着け。3つだけやることがある' },
      { character: 'robot', text: '①懐中電灯 ②スマホ充電確認 ③ブレーカー確認' },
      { character: 'riss',  text: '3つだけ覚えればいいんだね！' },
    ],
    points: [
      'まず懐中電灯を確保する',
      'スマホの残量を確認して節約モードに',
      'ブレーカーが落ちていないか確認する',
    ],
    articleSlug: 'blackout-what-to-do',
  },
  {
    slug: 'evacuation-basics',
    title: '避難所ってどんなところ？何を持っていく？',
    category: 'evacuation',
    emoji: '🏃',
    description: '避難所の基本と持ち物をリスとロボがやさしく解説します',
    panels: [
      { character: 'riss',  text: 'ひなんじょって、こわそう…何を持っていけばいいの？' },
      { character: 'robot', text: '怖くない。準備さえすれば大丈夫だ' },
      { character: 'robot', text: '水・食料3日分・薬・貴重品・充電器が最優先' },
      { character: 'riss',  text: 'リュックに入れておけばいいんだね！準備しよう！' },
    ],
    points: [
      '避難所は「一時的な安全場所」だと理解する',
      '持ち物は「水・食料・薬・貴重品・充電器」が最優先',
      '避難所より在宅避難の方が安全な場合もある',
    ],
    articleSlug: 'evacuation-shelter-infection',
  },
  {
    slug: 'product-portable-toilet',
    title: '断水してもトイレは使える！携帯トイレの使い方',
    category: 'goods',
    emoji: '🚽',
    description: '断水時に携帯トイレがなければ大変なことに。リスとロボが使い方を解説します',
    panels: [
      { character: 'riss',  text: '断水した！トイレが流せない…！' },
      { character: 'robot', text: '携帯トイレがあれば大丈夫だ' },
      { character: 'robot', text: '袋セット→用を足す→凝固剤→口を縛る' },
      { character: 'riss',  text: '50回分ストック済み！これで安心！' },
    ],
    points: [
      '断水時は普通のトイレが使えなくなる',
      '携帯トイレは袋+凝固剤で簡単に使える',
      '50回分以上を事前に準備しておく',
    ],
    articleSlug: 'emergency-toilet',
  },
  {
    slug: 'product-mobile-battery',
    title: '充電切れで家族と連絡できなくなる前に',
    category: 'goods',
    emoji: '🔋',
    description: '停電中のスマホ充電問題をモバイルバッテリーで解決。容量の選び方も解説',
    panels: [
      { character: 'riss',  text: '充電切れ…家族に連絡できない！' },
      { character: 'robot', text: 'モバイルバッテリーを渡そう' },
      { character: 'robot', text: '20,000mAh=スマホ5回分。常に満充電で保管' },
      { character: 'riss',  text: '家族と繋がれた！バッテリーは命綱だ！' },
    ],
    points: [
      '停電時はコンセントが使えなくなる',
      '20,000mAh以上のモバイルバッテリーを選ぶ',
      '普段から満充電を習慣にする',
    ],
    articleSlug: 'mobile-battery',
  },
  {
    slug: 'product-led-lantern',
    title: '夜の停電、暗闇の恐怖をLEDランタンで解決',
    category: 'goods',
    emoji: '🏮',
    description: '完全な暗闇でパニックにならないために。家族全員が集まれる明かりを準備しよう',
    panels: [
      { character: 'riss',  text: '停電…何も見えない、こわい…' },
      { character: 'robot', text: 'LEDランタンをつけよう！' },
      { character: 'robot', text: '乾電池式・200ルーメン以上・連続20時間以上' },
      { character: 'riss',  text: '家族みんなが集まれる！安心だ！' },
    ],
    points: [
      '懐中電灯より部屋全体を照らせるランタンが優秀',
      '乾電池式・200lm以上・20時間以上が選ぶ基準',
      '1台は寝室、1台はリビングに常備する',
    ],
    articleSlug: 'blackout-night',
  },
  {
    slug: 'product-water-storage',
    title: '断水しても生き延びる！水の備蓄は21L以上',
    category: 'goods',
    emoji: '💧',
    description: '水の備蓄は最も基本的な防災対策。1人7日分21Lの計算方法を解説します',
    panels: [
      { character: 'riss',  text: '断水した…水が1滴も出ない' },
      { character: 'robot', text: '備蓄水があれば大丈夫だ' },
      { character: 'robot', text: '1人1日2〜3L × 7日 = 最低21L' },
      { character: 'riss',  text: '今日から21本ストック開始！備えあれば憂いなし！' },
    ],
    points: [
      '大災害では断水が数日〜数週間続く',
      '1人1日2〜3L×7日分=21L以上が目標',
      '2Lペットボトルを定期ローリングストック',
    ],
    articleSlug: 'water-storage-necessary',
  },
  {
    slug: 'product-cassette-stove',
    title: 'ガスが止まっても温かい食事を！カセットコンロ',
    category: 'goods',
    emoji: '🔥',
    description: '地震後はガスが止まる。カセットコンロとガス缶12本以上で食事問題を解決',
    panels: [
      { character: 'riss',  text: 'ガスが止まった…温かいものが食べられない' },
      { character: 'robot', text: 'カセットコンロがあれば料理できるぞ！' },
      { character: 'robot', text: 'ガス缶12本以上。お湯・ご飯・缶詰を温める' },
      { character: 'riss',  text: '温かいご飯がこんなに嬉しいとは！必需品だ！' },
    ],
    points: [
      '地震後はガスが数日〜数週間止まる場合がある',
      'カセットガス缶は12本以上ストックする',
      'カセットコンロで3食分の調理が可能',
    ],
    articleSlug: 'earthquake-cooking',
  },
  {
    slug: 'product-portable-power',
    title: '長期停電の最終兵器！ポータブル電源の選び方',
    category: 'goods',
    emoji: '⚡',
    description: '停電3日目でも家電が動く。1000Wh以上のポータブル電源で在宅避難を快適に',
    panels: [
      { character: 'riss',  text: '停電3日目…もう限界だ…' },
      { character: 'robot', text: 'ポータブル電源があれば全部動く！' },
      { character: 'robot', text: '1000Wh以上・AC100V対応。スマホ・扇風機・医療機器まで' },
      { character: 'riss',  text: 'これ1台で全部解決！高くても絶対買うべき！' },
    ],
    points: [
      '長期停電には1000Wh以上のポータブル電源が有効',
      'AC100V対応なら家電がほぼすべて使える',
      '医療機器(CPAP等)の継続使用にも対応可能',
    ],
    articleSlug: 'blackout-longterm',
  },
  {
    slug: 'product-preserved-food',
    title: 'スーパーが空でも困らない！保存食の備え方',
    category: 'goods',
    emoji: '🍱',
    description: '災害直後は食料が手に入らない。7日分の保存食をローリングストックで準備しよう',
    panels: [
      { character: 'riss',  text: 'スーパーに何もない…家族が空腹だ' },
      { character: 'robot', text: '家に7日分の備蓄食がある！' },
      { character: 'robot', text: 'アルファ米・レトルト・缶詰でローリングストック' },
      { character: 'riss',  text: '備蓄があれば焦らない！今日から少しずつ揃えよう！' },
    ],
    points: [
      '災害後はスーパーの棚が数時間で空になる',
      'アルファ米・レトルト・缶詰を7日分以上用意',
      'ローリングストックで賞味期限切れを防ぐ',
    ],
    articleSlug: 'disaster-prep-food-days',
  },
  {
    slug: 'product-cooler-box',
    title: '夏の停電、冷蔵庫の食品を2時間以内に守れ',
    category: 'goods',
    emoji: '🧊',
    description: '真夏の停電は冷蔵庫の食品と薬が危ない。クーラーボックスで2時間以内に移そう',
    panels: [
      { character: 'riss',  text: '停電2時間！冷蔵庫の食べ物が腐る！' },
      { character: 'robot', text: '2時間以内なら冷蔵品を移せるぞ！' },
      { character: 'robot', text: '食品・薬をクーラーボックス+保冷剤で保管' },
      { character: 'riss',  text: '食料も薬も守った！夏の停電はクーラーボックスが必須！' },
    ],
    points: [
      '停電後2時間が冷蔵品の移動タイムリミット',
      'インスリン等の薬の保管にも使える',
      '保冷剤は冷凍庫に常備しておく',
    ],
    articleSlug: 'blackout-refrigerator',
  },
  {
    slug: 'product-odor-bag',
    title: '携帯トイレの臭い問題は防臭袋で完全解決',
    category: 'goods',
    emoji: '🛍️',
    description: '携帯トイレを使った後の処理が不安？防臭袋があれば臭いゼロで衛生的に処理できます',
    panels: [
      { character: 'riss',  text: '携帯トイレを使ったけど…臭いが心配' },
      { character: 'robot', text: '防臭袋に入れれば完全に臭わないぞ！' },
      { character: 'robot', text: '3層構造でにおいゼロ。可燃ゴミとして捨てられる' },
      { character: 'riss',  text: '全然臭わない！これがあれば衛生的に生活できる！' },
    ],
    points: [
      '携帯トイレの廃棄に防臭袋は必須',
      '3層構造の防臭袋は臭いを完全にシャットアウト',
      '可燃ゴミとして処理できるものを選ぶ',
    ],
    articleSlug: 'blackout-toilet',
  },
  {
    slug: 'product-liquid-milk',
    title: '赤ちゃんがいる家庭に液体ミルクは必須備蓄',
    category: 'goods',
    emoji: '🍼',
    description: '断水・停電時でもお湯不要で使える液体ミルク。赤ちゃんがいる家庭の必須備蓄品',
    panels: [
      { character: 'riss',  text: '水がない！哺乳瓶も消毒できない！赤ちゃんが泣いてる！' },
      { character: 'robot', text: '液体ミルクはそのままあげられるぞ！' },
      { character: 'robot', text: 'お湯不要・常温保存・賞味期限1〜2年' },
      { character: 'riss',  text: '赤ちゃんがいる家庭の必需品！ストックしておいて本当によかった！' },
    ],
    points: [
      '液体ミルクはお湯も哺乳瓶の消毒も不要',
      '常温保存で賞味期限は1〜2年のものが多い',
      '0〜1歳の赤ちゃんがいる家庭は必ずストック',
    ],
    articleSlug: 'evacuation-items',
  },
];

const CATEGORY_LABEL = {
  earthquake: '地震が起きたとき',
  blackout:   '停電したとき',
  evacuation: '避難が必要なとき',
  goods:      '防災グッズを知る',
};

// ── ハンドブック構成用の掲載順 ────────────────────────────────────
// 第1章：発災直後の行動（シーン別：地震→停電→避難）
const ACTION_MANGA_ORDER = [
  'earthquake-elevator',
  'blackout-basics',
  'evacuation-basics',
];
// 第3章：備蓄グッズ（優先度順：水→トイレ→衛生→灯り→電源→調理→食料→大型電源→季節→乳幼児）
const GOODS_MANGA_ORDER = [
  'product-water-storage',
  'product-portable-toilet',
  'product-odor-bag',
  'product-led-lantern',
  'product-mobile-battery',
  'product-cassette-stove',
  'product-preserved-food',
  'product-portable-power',
  'product-cooler-box',
  'product-liquid-milk',
];
const mangaBySlug = (slug) => MANGA_LIST.find((m) => m.slug === slug);

// ── 1. 4パネル → 2×2 JPG合成 ─────────────────────────────────────
/**
 * 各パネル (313×418) を 2 列 × 2 行に並べ JPEG Buffer を返す。
 * Kindle 推奨解像度に合わせて出力サイズは 1200×1600 px。
 */
async function combinePanels(manga) {
  const COLS = 2, ROWS = 2;
  const PW = 600, PH = 800;          // 1パネルあたりの描画サイズ
  const W = PW * COLS, H = PH * ROWS; // 1200 × 1600

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');

  // 背景白
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // 枠線 (グリッド)
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth   = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
  ctx.beginPath();
  ctx.moveTo(PW, 0); ctx.lineTo(PW, H);
  ctx.moveTo(0, PH); ctx.lineTo(W, PH);
  ctx.stroke();

  for (let i = 0; i < 4; i++) {
    const imgPath = path.join(PUBLIC, manga.slug, `panel-0${i + 1}.png`);
    // public/manga/{slug}/panel-0N.png
    const fullPath = path.join(PUBLIC, 'manga', manga.slug, `panel-0${i + 1}.png`);

    const col = i % 2;
    const row = Math.floor(i / 2);
    const ox  = col * PW;
    const oy  = row * PH;

    try {
      const img = await loadImage(fullPath);
      // アスペクト比を保ってフィット
      const scale = Math.min(PW / img.width, PH / img.height);
      const dw = img.width  * scale;
      const dh = img.height * scale;
      const dx = ox + (PW - dw) / 2;
      const dy = oy + (PH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
      // 画像がない場合はプレースホルダー
      ctx.fillStyle = '#f0f4ff';
      ctx.fillRect(ox + 4, oy + 4, PW - 8, PH - 8);
      ctx.fillStyle = '#1e40af';
      ctx.font      = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(manga.panels[i].text, ox + PW / 2, oy + PH / 2);
    }

    // パネル番号バッジ
    const bx = ox + 22, by = oy + 22, br = 18;
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font      = `bold ${br}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), bx, by);
  }

  return canvas.toBuffer('image/jpeg', { quality: 0.88 });
}

// ── 2. MDX → プレーン XHTML ───────────────────────────────────────
function loadArticle(articleSlug) {
  const p = path.join(ARTICLES_DIR, `${articleSlug}.mdx`);
  if (!fs.existsSync(p)) return null;

  const raw = fs.readFileSync(p, 'utf-8');
  const { data: fm, content } = matter(raw);

  // JSX コンポーネントタグを除去（<ComponentName ... />、<ComponentName>…</ComponentName>）
  let md = content
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, '')             // 自己閉じ
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '') // 開閉タグ
    .replace(/^import\s+.*from\s+['"].*['"]\s*;?\s*$/gm, '') // import文
    .replace(/^\s*\n/gm, '\n');                            // 連続空行を1行に

  // 基本的な Markdown → XHTML 変換
  const html = md
    // 見出し
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    // 水平線
    .replace(/^---+$/gm, '<hr/>')
    // チェックリスト
    .replace(/^- \[ \] (.+)$/gm, '<li class="check">☐ $1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="check">☑ $1</li>')
    // 番号リスト
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // 箇条書き
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // 太字・斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    // インラインコード
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // リンク（Amazon等のURLは省略して表示テキストのみ）
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 段落
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (/^<(h[1-6]|li|hr|ul|ol|div)/.test(block)) return block;
      // li タグが複数行なら ul でまとめる
      if (block.includes('<li>') || block.includes('<li class=')) {
        return `<ul>${block}</ul>`;
      }
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return { title: fm.title || articleSlug, html };
}

// ── 3. XHTML ページ生成 ───────────────────────────────────────────
function mangaPage(manga, imgFileName, chapterIndex) {
  const catLabel = CATEGORY_LABEL[manga.category] || manga.category;
  const pointsHtml = manga.points
    .map((p, i) => `<li><span class="num">${i + 1}</span>${p}</li>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
  <meta charset="UTF-8"/>
  <title>${manga.title}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
<div class="manga-page">
  <p class="category">${catLabel}</p>
  <h1>${manga.emoji} ${manga.title}</h1>
  <div class="manga-image">
    <img src="../images/${imgFileName}" alt="${manga.title} 4コマ漫画"/>
  </div>
  <div class="points">
    <h2>レスQロボのまとめ</h2>
    <ul class="point-list">
${pointsHtml}
    </ul>
  </div>
</div>
</body>
</html>`;
}

function articlePage(title, html) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
<div class="article-page">
${html}
</div>
</body>
</html>`;
}

// ── 4. EPUB メタデータファイル生成 ───────────────────────────────
function makeContainerXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

function makeOpf(items) {
  const now = new Date().toISOString().slice(0, 10);
  const manifestItems = items.map(it =>
    `    <item id="${it.id}" href="${it.href}" media-type="${it.mediaType}"${it.properties ? ` properties="${it.properties}"` : ''}/>`
  ).join('\n');
  const spineItems = items
    .filter(it => it.spine)
    .map(it => `    <itemref idref="${it.id}"/>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="ja">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">bousai-lab-kindle-${now}</dc:identifier>
    <dc:title>こわがるためではなく、守るための防災――避難所に行かない「在宅避難」まんがガイド</dc:title>
    <dc:creator>くまごろう（現役勤務医師）</dc:creator>
    <dc:language>ja</dc:language>
    <dc:date>${now}</dc:date>
    <dc:description>地震・停電・避難所を、まんがとやさしい解説で学ぼう。武蔵野市在住の現役医師監修。</dc:description>
    <dc:rights>© くまごろう / 防災Lab</dc:rights>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
    <meta name="cover" content="img-cover"/>
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine>
${spineItems}
  </spine>
</package>`;
}

function makeNav(chapters) {
  const items = chapters.map((ch, i) =>
    `      <li><a href="${ch.href}">${ch.label}</a></li>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">
<head><meta charset="UTF-8"/><title>目次</title></head>
<body>
<nav epub:type="toc" id="toc">
  <h1>目次</h1>
  <ol>
${items}
  </ol>
</nav>
</body>
</html>`;
}

function makeNcx(chapters) {
  const points = chapters.map((ch, i) =>
    `  <navPoint id="nav${i + 1}" playOrder="${i + 2}">
    <navLabel><text>${ch.label}</text></navLabel>
    <content src="${ch.href}"/>
  </navPoint>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="bousai-lab-kindle"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>こわがるためではなく、守るための防災――避難所に行かない「在宅避難」まんがガイド</text></docTitle>
  <navMap>
  <navPoint id="nav0" playOrder="1">
    <navLabel><text>表紙</text></navLabel>
    <content src="pages/cover.xhtml"/>
  </navPoint>
${points}
  </navMap>
</ncx>`;
}

function makeCss() {
  return `/* 防災Lab Kindle スタイル */
body {
  font-family: serif;
  line-height: 1.8;
  margin: 0;
  padding: 0;
  color: #1a1a1a;
}

/* 表紙 */
.cover-page {
  text-align: center;
  padding: 2em 1em;
}
.cover-page h1 { font-size: 2em; margin-bottom: 0.3em; }
.cover-page .subtitle { font-size: 1.1em; color: #444; }
.cover-page .author { margin-top: 2em; font-size: 0.95em; }

/* まんがページ */
.manga-page {
  padding: 1em;
  max-width: 800px;
  margin: 0 auto;
}
.manga-page .category {
  font-size: 0.75em;
  color: #1e40af;
  font-weight: bold;
  margin-bottom: 0.3em;
}
.manga-page h1 {
  font-size: 1.4em;
  margin-bottom: 0.8em;
  line-height: 1.4;
}
.manga-image {
  text-align: center;
  margin: 1em 0;
}
.manga-image img {
  max-width: 100%;
  height: auto;
}
.points {
  margin-top: 1.5em;
  padding: 1em;
  background: #f0f9ff;
  border-left: 4px solid #1e40af;
}
.points h2 {
  font-size: 1em;
  color: #1e40af;
  margin-bottom: 0.8em;
}
.point-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.point-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.9em;
}
.point-list li .num {
  display: inline-block;
  min-width: 1.4em;
  height: 1.4em;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 1.4em;
  font-size: 0.85em;
  font-weight: bold;
  flex-shrink: 0;
}

/* 記事ページ */
.article-page {
  padding: 1em;
  max-width: 700px;
  margin: 0 auto;
}
.article-page h1 { font-size: 1.5em; margin-bottom: 0.5em; }
.article-page h2 { font-size: 1.2em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2em; }
.article-page h3 { font-size: 1.05em; }
.article-page p  { margin-bottom: 1em; }
.article-page ul, .article-page ol { padding-left: 1.5em; margin-bottom: 1em; }
.article-page li { margin-bottom: 0.3em; }
.article-page strong { font-weight: bold; }
.article-page code { background: #f1f5f9; padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.9em; }
.article-page hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5em 0; }

/* 散文ページ（はじめに・各章・エピローグ等） */
.prose-page {
  padding: 1.2em;
  max-width: 700px;
  margin: 0 auto;
}
.prose-page .chapter-label {
  font-size: 0.75em;
  color: #1e40af;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin-bottom: 0.3em;
}
.prose-page h1 { font-size: 1.5em; line-height: 1.5; margin-bottom: 0.8em; }
.prose-page h2 { font-size: 1.15em; border-left: 4px solid #1e40af; padding-left: 0.6em; margin: 1.4em 0 0.6em; }
.prose-page h3 { font-size: 1em; color: #334155; margin: 1em 0 0.4em; }
.prose-page p  { margin-bottom: 1em; line-height: 1.9; }
.prose-page ul, .prose-page ol { padding-left: 1.4em; margin-bottom: 1em; }
.prose-page li { margin-bottom: 0.5em; line-height: 1.8; }
.prose-page strong { font-weight: bold; }
.prose-page hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.8em 0; }
.prose-page .note { font-size: 0.8em; color: #888; margin-bottom: 1.5em; }
.prose-page .author-note { font-size: 0.85em; color: #1e40af; font-style: italic; margin-bottom: 0.6em; }
.prose-page .sign { text-align: right; margin-top: 2em; font-size: 0.95em; }

/* フェーズブロック（72時間タイムライン） */
.phase-block { border-radius: 8px; padding: 1em 1.2em; margin-bottom: 1.2em; }
.phase-0 { background: #fef2f2; border-left: 5px solid #dc2626; }
.phase-1 { background: #fffbeb; border-left: 5px solid #d97706; }
.phase-2 { background: #f0fdf4; border-left: 5px solid #16a34a; }
.phase-3 { background: #eff6ff; border-left: 5px solid #2563eb; }
.phase-block h2 { border-left: none; padding-left: 0; font-size: 1.05em; margin: 0 0 0.6em; }

/* チェックリスト */
.check-list { list-style: none; padding: 0; }
.check-list li { padding: 0.4em 0; border-bottom: 1px solid #f1f5f9; }

/* テーブル */
table.timeline, table.carte {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
  margin-bottom: 1.2em;
}
table.timeline th, table.carte th {
  background: #1e40af;
  color: white;
  padding: 0.5em;
  text-align: left;
}
table.timeline td, table.carte td {
  padding: 0.5em;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}
table.timeline tr:nth-child(even) td, table.carte tr:nth-child(even) td {
  background: #f8fafc;
}
`;

}

// ── 新規ページ生成関数 ────────────────────────────────────────────

function xhtml(title, cssPath, bodyContent) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="${cssPath}"/>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

function makePrologue() {
  return xhtml('序章　もし明日、地震が来たら', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">序章（フィクション）</p>
  <h1>もし明日、地震が来たら<br/>——二つの家族の朝</h1>
  <p class="note">※以下は架空のストーリーです。実際の地震に基づくものではありません。</p>

  <p>武蔵野市の朝は、いつも静かに始まる。</p>
  <p>午前6時42分——マンション「グリーンハイツ武蔵野」の4階建ての建物が、突然、縦に大きく揺れた。</p>

  <hr/>
  <h2>303号室：田中家（夫・妻・小学2年生の娘）</h2>

  <p>「ドン！」という衝撃で目が覚めた妻の陽子は、反射的に娘の布団の上に覆いかぶさった。夫の健一はすでに起きていて、枕元の引き出しから<strong>ヘッドライト</strong>を取り出していた。</p>
  <p>「揺れが収まるまで動くな」</p>
  <p>1分ほどで揺れが落ち着いた。停電していた。でも部屋は暗くなかった——健一がヘッドライトを着けたから。</p>
  <p>キッチンへ行くと、食器棚の扉は開いていたが、棚の奥に置いた<strong>転倒防止グッズ</strong>のおかげで割れたものは2枚だけだった。</p>
  <p>陽子はスマホを手に取り、残量を確認した。82%。すぐに<strong>省電力モード</strong>に切り替えた。</p>
  <p>「お水は？」と娘の葉月が聞いた。</p>
  <p>「クローゼットにあるよ。2Lのボトルが14本。7日分ある」と陽子は答えた。</p>
  <p>健一は洗面所に向かった。浴槽にはあらかじめ<strong>緊急用の水が溜めてあった</strong>。トイレには<strong>携帯トイレのセット</strong>が3袋、蓋の裏に貼り付けてあった。</p>
  <p>朝7時。田中家はロールパンとインスタントスープで朝食をとっていた。カセットコンロの炎が小さく揺れていた。</p>

  <hr/>
  <h2>201号室：佐藤家（夫・妻）</h2>

  <p>佐藤隆は、暗闇の中でスマホを探して手を伸ばした。画面をつけようとしたが、手が震えて何度もロックが解除できなかった。</p>
  <p>妻の美咲が「懐中電灯どこ？！」と叫んでいた。</p>
  <p>「引っ越したとき、どこかに入れた気がする……」</p>
  <p>二人は暗闇の中を手探りで進み、割れたグラスを踏んだ。</p>
  <p>トイレに行こうとした美咲が戻ってきた。「水が出ない」</p>
  <p>断水だった。携帯トイレは持っていなかった。ペットボトルの水は冷蔵庫に500mlが1本あるだけだった。</p>
  <p>スマホの充電は37%。モバイルバッテリーを探したが、コード類の箱の中に入れたまま、どこにあるか分からなかった。</p>
  <p>8時になっても、二人はただ途方に暮れていた。</p>

  <hr/>
  <h2>この差は、「知っていたかどうか」だけだった</h2>

  <p>田中家が使ったものは、特別なものではない。どれも近所のホームセンターやネットで買える、数千円のものばかりだ。</p>
  <p>違いは、<strong>「少しだけ先に知っていた」</strong>こと——ただそれだけだった。</p>
  <p>この本を読み終えたとき、あなたは田中家になれる。</p>
</div>`);
}

function makeIntro() {
  return xhtml('はじめに', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">はじめに</p>
  <h1>私が防災を本気で考えた、3つの出来事</h1>

  <h2>① 大家として</h2>
  <p>数年前、私が所有するマンションの入居者から、こう聞かれた。</p>
  <p>「先生、地震のときエレベーターが止まったら、うちの母（82歳）はどうすれば？　3階なんですけど」</p>
  <p>私は答えられなかった。</p>
  <p>建物の耐震性は確認していた。火災保険にも入っていた。でも「その後」——停電でエレベーターが止まった後、断水した後、住民たちがどう生き延びるか——を、一度も考えたことがなかった。</p>
  <p>その夜、私はノートを開いた。大家として、建物の「箱」ではなく「中にいる人の命」を守るために何ができるかを、初めて真剣に考えた。</p>

  <h2>② 父親として</h2>
  <p>地域の自主防災会に誘われて参加した、避難所立ち上げ訓練の夜のことは、今も忘れられない。</p>
  <p>体育館に集まった地域の人たちと、「発災から72時間、行政の支援が来るまでどう動くか」を実際にシミュレーションした。</p>
  <p>そこで初めて知った。</p>
  <ul>
    <li>武蔵野市の指定避難所の収容人数は、市民全員の約3割しかない</li>
    <li>発災直後、トイレが使えなくなることが最も深刻な問題のひとつである</li>
    <li>72時間は、基本的に「自分たちで何とかするしかない」</li>
  </ul>
  <p>家に帰って、子どもたちの顔を見た。この子たちを守れるのは、自分たちだけだ——そう思ったとき、背筋が冷たくなった。</p>

  <h2>③ 医師として</h2>
  <p>勤務医として働く中で、大きな台風や地震の後に外来がどうなるかを、何度も経験してきた。</p>
  <p>「薬が流された」「お薬手帳がどこかに行った」「インスリンが切れそう」——そういう患者さんが、発災の翌日から次々と訪れる。</p>
  <p>避難所でのエコノミークラス症候群、ストレスによる血圧の急上昇、集団生活での感染症の拡大。医療の力が届く前に、多くの人が苦しんでいた。</p>
  <p>私にできることは何か。診察室で一人ひとりに伝えるには、限界がある。だから書くことにした。</p>

  <hr/>
  <p><strong>「こわがるためではなく、守るための防災」</strong></p>
  <p>災害はいつ来るか分からない。でも「少しだけ知っていること」で、結果は大きく変わる。</p>
  <p>この本は、まんがと解説と実践リストで、その「少しだけ」を届けるために書きました。まず次のページから、この3つの出来事をまんがで紹介します。</p>
  <p class="sign">くまごろう<br/>（武蔵野市在住・現役勤務医師・マンションオーナー）</p>
</div>`);
}

function makeChapter1() {
  return xhtml('第1章 発災直後——最初の行動', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第1章</p>
  <h1>発災直後——最初の行動</h1>

  <p>プロローグの田中家と佐藤家を分けたのは、発災直後の「最初の数分」の行動だった。この章では、誰もが直面する3つの場面について、まんがと解説で「最初にとるべき行動」を示す。</p>

  <table class="timeline">
    <tr><th>場面</th><th>最初の行動</th><th>まんが</th></tr>
    <tr><td>🏢 地震が起きた</td><td>エレベーターは使わない。階段で逃げる</td><td>1-1</td></tr>
    <tr><td>🔦 停電した</td><td>灯り→スマホ充電確認→ブレーカーの順で確認</td><td>1-2</td></tr>
    <tr><td>🏃 避難が必要になった</td><td>持ち物5点を確認し、避難所の基本を知る</td><td>1-3</td></tr>
  </table>

  <p>各話は<strong>「まんが → 3つのポイント → 詳しい解説」</strong>の順に並んでいる。時間がなければ、まんがとポイントだけ読み進めても構わない。</p>
</div>`);
}

function makeChapter2() {
  return xhtml('第2章 72時間を生き延びる', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第2章</p>
  <h1>72時間を生き延びる<br/>——医師が見た「発災後」</h1>

  <p>行政の支援が本格的に届くまで、およそ72時間。この間は基本的に「自分たちで何とかするしかない」。まず、医師として、また防災会の訓練を通じて知った「避難所で実際に起きること」から話したい。</p>

  <h2>避難所で実際に多い「体の問題」</h2>

  <h3>エコノミークラス症候群（深部静脈血栓症）</h3>
  <p>狭いスペースに長時間同じ姿勢でいることで、足の血管に血栓ができる。最悪の場合、肺塞栓（肺に血栓が飛ぶ）で命を落とす。阪神・淡路大震災では多数の犠牲者が出た。</p>
  <p><strong>予防：</strong>2時間に1回は立ち上がり、足首を回す。水分をこまめに摂る。</p>

  <h3>感染症の集団発生</h3>
  <p>ノロウイルス、インフルエンザ、新型コロナ——避難所は密閉空間に多数の人が集まるため、感染症が爆発的に広がりやすい。手洗いと換気が最大の予防だが、断水時はそれさえ難しい。</p>

  <h3>持病・薬の問題</h3>
  <p>高血圧・糖尿病・てんかん・精神疾患など、毎日薬が必要な疾患を持つ人にとって、薬の喪失は命に直結する。お薬手帳がなければ、医師も処方できない。</p>

  <h2>だから「在宅避難」が最善策になりえる</h2>
  <p>建物が安全であれば、自宅に留まることが体への負担が最も少ない。避難所のリスクを知った上で、「行かなくて済む準備」をすることが、賢い防災の第一歩だ。</p>
  <p>次のページから、在宅避難の72時間を4つのフェーズに分けて、時間の流れに沿ってやるべきことを示す。</p>
</div>`);
}

function makeChapter2Timeline() {
  return xhtml('在宅避難72時間タイムライン', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第2章</p>
  <h1>在宅避難72時間タイムライン<br/>——「家で生き延びる」具体的な行動</h1>

  <p>大きな地震が起きた後、何が、いつ止まるのか。まず全体像を頭に入れてほしい。</p>

  <table class="timeline">
    <tr><th>時間</th><th>インフラ・行政</th><th>体・生活への影響</th></tr>
    <tr><td>0〜3時間</td><td>電気・ガス・水道が停止／道路が混雑し救急車が来ない</td><td>怪我の処置が自力になる。暗闇でのパニックが起きやすい</td></tr>
    <tr><td>3〜24時間</td><td>コンビニ・スーパーの棚が空になる／断水が続く</td><td>水・食料・トイレ問題が深刻化。慢性疾患の悪化が始まる</td></tr>
    <tr><td>24〜72時間</td><td>行政の支援物資が一部届き始める（量は不足）</td><td>エコノミークラス症候群のリスク。感染症が広がり始める</td></tr>
    <tr><td>72時間以降</td><td>ライフラインの一部復旧が始まる（地域差あり）</td><td>精神的疲労のピーク。持病の管理が限界に近づく</td></tr>
  </table>

  <p>この流れを4つのフェーズに分けて、やるべきことを整理する。</p>

  <div class="phase-block phase-0">
    <h2>フェーズ０：0〜3時間「命を守る」</h2>
    <ul>
      <li>🔦 <strong>すぐに懐中電灯・ヘッドライトをつける</strong>——暗闇でのパニックを防ぐ</li>
      <li>🪟 <strong>ガラスや家具の転倒を確認し、安全な場所へ移動</strong></li>
      <li>📱 <strong>スマホを省電力モードに切り替え、充電残量を確認</strong></li>
      <li>🔥 <strong>ガスの元栓を閉める</strong>——通電火災・ガス漏れを防ぐ</li>
      <li>🚰 <strong>浴槽に水を溜める</strong>（断水前に済ませる）</li>
      <li>📻 <strong>ラジオ・スマホで情報収集</strong>——余震・ライフラインの状況を確認</li>
    </ul>
  </div>

  <div class="phase-block phase-1">
    <h2>フェーズ１：3〜24時間「水・食料・トイレ」</h2>
    <ul>
      <li>💧 <strong>備蓄水を確認</strong>——1人1日3L×人数分を確保</li>
      <li>🚽 <strong>携帯トイレを設置</strong>——断水中は普通のトイレを流してはいけない（配管破損の恐れ）</li>
      <li>🍱 <strong>備蓄食料を確認・調理</strong>——カセットコンロで温かいものを作れると体と心が安定する</li>
      <li>💊 <strong>常備薬・お薬手帳を手元に</strong>——場所を全員が把握しておく</li>
      <li>🔋 <strong>モバイルバッテリーで充電管理</strong>——電池が命綱になる</li>
    </ul>
  </div>

  <div class="phase-block phase-2">
    <h2>フェーズ２：24〜72時間「長期化への対応」</h2>
    <ul>
      <li>🦵 <strong>2時間ごとに立ち上がり、足首を動かす</strong>——エコノミークラス症候群予防</li>
      <li>😷 <strong>手消毒と換気</strong>——感染症予防（断水中は消毒液が代わりになる）</li>
      <li>🛏️ <strong>睡眠を確保</strong>——体の抵抗力を維持するため、8時間を目標に</li>
      <li>📝 <strong>持病の薬の残量を計算</strong>——何日分残っているか把握し、医療救護所に相談する準備を</li>
      <li>🤝 <strong>近隣と声をかけ合う</strong>——一人暮らし・高齢者の安否確認を</li>
    </ul>
  </div>

  <div class="phase-block phase-3">
    <h2>フェーズ３：72時間以降「地域とつながる」</h2>
    <ul>
      <li>📡 <strong>行政からの支援情報を確認</strong>——給水所・配給所・医療救護所の場所</li>
      <li>🏥 <strong>持病がある場合は早めに医療救護所へ</strong>——薬の処方、状態確認</li>
      <li>🗺️ <strong>避難所に行く判断をする</strong>——自宅の安全性・備蓄残量・家族の状態を総合的に判断</li>
      <li>🏘️ <strong>地域の自主防災会・町内会と連携</strong>——情報共有・助け合い</li>
    </ul>
  </div>
</div>`);
}

function makeChapter3() {
  return xhtml('第3章 命を守る備蓄グッズ10', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第3章</p>
  <h1>命を守る備蓄グッズ10<br/>——優先度の高い順に揃える</h1>

  <p>防災グッズは「全部揃えよう」とすると挫折する。医師として、また2つの家族の分かれ道を見てきた経験から、<strong>優先度の高い順</strong>に10個へ絞り込んだ。上から順に揃えてほしい。</p>

  <table class="timeline">
    <tr><th>順位</th><th>グッズ</th><th>目安</th></tr>
    <tr><td>1</td><td>💧 備蓄水</td><td>1人1日2〜3L×7日分（21L以上）</td></tr>
    <tr><td>2</td><td>🚽 携帯トイレ</td><td>1人50回分以上</td></tr>
    <tr><td>3</td><td>🛍️ 防臭袋</td><td>携帯トイレとセットで</td></tr>
    <tr><td>4</td><td>🏮 LEDランタン</td><td>乾電池式・200lm以上</td></tr>
    <tr><td>5</td><td>🔋 モバイルバッテリー</td><td>20,000mAh以上</td></tr>
    <tr><td>6</td><td>🔥 カセットコンロ</td><td>ガス缶12本以上</td></tr>
    <tr><td>7</td><td>🍱 保存食</td><td>7日分・ローリングストック</td></tr>
    <tr><td>8</td><td>⚡ ポータブル電源</td><td>1,000Wh以上（余裕があれば）</td></tr>
    <tr><td>9</td><td>🧊 クーラーボックス</td><td>夏の停電対策・薬の保管</td></tr>
    <tr><td>10</td><td>🍼 液体ミルク</td><td>0〜1歳の子がいる家庭は必須</td></tr>
  </table>

  <h2>予算の目安</h2>
  <ul>
    <li><strong>まず揃える（1〜2万円）：</strong>順位1〜6（水・トイレ・防臭袋・灯り・電池・コンロ）</li>
    <li><strong>次に揃える（1〜3万円）：</strong>順位7＋救急セット・常備薬7日分・ヘッドライト</li>
    <li><strong>余裕があれば（3万円以上）：</strong>順位8〜（ポータブル電源・ソーラーパネル）</li>
  </ul>

  <p>それぞれのグッズについて、「なぜ必要か」「どう選ぶか」「どう使うか」を、まんがと解説で1つずつ紹介する。</p>
</div>`);
}

function makeChapter04() {
  return xhtml('第4章 立場別チェックリスト', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第4章</p>
  <h1>あなたの「立場」別チェックリスト</h1>
  <p>大家として入居者を見ていて感じたのは、「同じマンションでも、家族構成や健康状態で必要な備えがまったく違う」ということだ。自分の立場に合った備えを確認してほしい。</p>

  <h2>① マンション・高層階の方へ</h2>
  <p class="author-note">大家の視点：建物の安全は確認できても、「その後」は住民次第。</p>
  <ul class="check-list">
    <li>☐ エレベーターが止まった場合の階段移動の練習をしている</li>
    <li>☐ 高層階（10階以上）は長周期地震動の揺れが大きいことを知っている</li>
    <li>☐ 断水時の給水タンク・共用部の確認先を知っている</li>
    <li>☐ 管理組合・管理会社の緊急連絡先を知っている</li>
    <li>☐ 近隣住民と顔見知りで、助け合いの話をしたことがある</li>
  </ul>

  <h2>② 乳幼児・子育て世代の方へ</h2>
  <p class="author-note">父親の視点：子どもがいると、避難の時間も荷物も倍になる。</p>
  <ul class="check-list">
    <li>☐ 液体ミルク（0〜1歳）・離乳食の備蓄がある</li>
    <li>☐ 子ども用の薬（解熱剤・下痢止め）を備蓄している</li>
    <li>☐ 避難場所と集合ルールを子どもと一緒に確認した</li>
    <li>☐ 抱っこひも・ベビーカーのどちらで避難するか決めている</li>
    <li>☐ 学校・保育園の災害時引き渡しルールを知っている</li>
  </ul>

  <h2>③ 高齢者・持病がある方へ</h2>
  <p class="author-note">医師の視点：薬が切れることは、症状の悪化だけでなく、命に関わることがある。</p>
  <ul class="check-list">
    <li>☐ 飲んでいる薬を7日分以上、手元に確保している</li>
    <li>☐ お薬手帳をデジタル（スマホ写真）でも保存している</li>
    <li>☐ 医療機器（CPAP・在宅酸素等）の停電時の対応を確認している</li>
    <li>☐ かかりつけ医の連絡先・診察券を防災袋に入れている</li>
    <li>☐ インスリンなど冷蔵保管が必要な薬の停電時対策を知っている</li>
  </ul>

  <h2>④ 一人暮らしの方へ</h2>
  <p class="author-note">地域の視点：一人の場合、誰かに「生存を知らせる手段」が特に重要。</p>
  <ul class="check-list">
    <li>☐ 安否を確認し合える近所の人・友人がいる</li>
    <li>☐ 緊急連絡先（家族・友人）をスマホだけでなくメモしている</li>
    <li>☐ 外出中に被災した場合の帰宅手段・集合場所を決めている</li>
    <li>☐ 備蓄は「一人分」で十分な量があるか計算している</li>
    <li>☐ 地域の自主防災会・町内会に参加している（または連絡先を知っている）</li>
  </ul>
</div>`);
}

function makeChapter05() {
  return xhtml('第5章 わが家の防災カルテ', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">第5章</p>
  <h1>わが家の防災カルテ</h1>
  <p>医師として最も伝えたいのは、「記録することが命を守る」ということだ。このページに書き込んでおくと、いざというときに自分も家族も、医療救護所の医師も助かる。</p>

  <h2>家族の基本情報</h2>
  <table class="carte">
    <tr><th>氏名</th><th>生年月日</th><th>血液型</th><th>アレルギー</th></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td></tr>
  </table>

  <h2>服薬・持病メモ</h2>
  <table class="carte">
    <tr><th>氏名</th><th>病名</th><th>薬の名前</th><th>1日の量</th><th>保管場所</th></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td><td>　</td></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td><td>　</td></tr>
    <tr><td>　</td><td>　</td><td>　</td><td>　</td><td>　</td></tr>
  </table>

  <h2>かかりつけ医・緊急連絡先</h2>
  <table class="carte">
    <tr><th>種別</th><th>名前・機関名</th><th>電話番号</th></tr>
    <tr><td>かかりつけ医</td><td>　</td><td>　</td></tr>
    <tr><td>歯科</td><td>　</td><td>　</td></tr>
    <tr><td>緊急連絡先①</td><td>　</td><td>　</td></tr>
    <tr><td>緊急連絡先②</td><td>　</td><td>　</td></tr>
    <tr><td>職場</td><td>　</td><td>　</td></tr>
    <tr><td>子どもの学校</td><td>　</td><td>　</td></tr>
  </table>

  <h2>わが家の避難ルール</h2>
  <table class="carte">
    <tr><th>項目</th><th>決めた内容</th></tr>
    <tr><td>第一避難場所</td><td>　</td></tr>
    <tr><td>第二避難場所</td><td>　</td></tr>
    <tr><td>家族の集合場所</td><td>　</td></tr>
    <tr><td>連絡がとれない場合の待ち合わせ</td><td>　</td></tr>
    <tr><td>子どもの引き取りルール</td><td>　</td></tr>
  </table>

  <h2>備蓄の確認日</h2>
  <p>年2回（春・秋）に賞味期限と量を確認することをおすすめする。</p>
  <table class="carte">
    <tr><th>品目</th><th>目標量</th><th>現在の量</th><th>確認日</th></tr>
    <tr><td>水（2Lボトル）</td><td>人数×10本</td><td>　</td><td>　</td></tr>
    <tr><td>携帯トイレ</td><td>人数×50回分</td><td>　</td><td>　</td></tr>
    <tr><td>保存食</td><td>人数×7日分</td><td>　</td><td>　</td></tr>
    <tr><td>カセットガス缶</td><td>12本以上</td><td>　</td><td>　</td></tr>
    <tr><td>モバイルバッテリー</td><td>20,000mAh以上</td><td>　</td><td>　</td></tr>
    <tr><td>常備薬</td><td>7日分以上</td><td>　</td><td>　</td></tr>
  </table>
</div>`);
}

function makeEpilogue() {
  return xhtml('エピローグ', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">エピローグ</p>
  <h1>プロローグの続き——その後の田中家と佐藤家</h1>

  <h2>発災から48時間後</h2>

  <p><strong>303号室・田中家：</strong></p>
  <p>水と食料は十分にあった。携帯トイレは家族3人が使っても20回分残っていた。スマホはモバイルバッテリーのおかげで切れることなく、家族全員の安否確認ができた。娘の葉月は「こわかったけど、大丈夫だった」と言った。</p>

  <p><strong>201号室・佐藤家：</strong></p>
  <p>美咲は隣の田中家から水を分けてもらい、なんとかしのいだ。隆は近くのコンビニに並んだが、棚はすでに空だった。2日間、ほぼ何も食べられなかった。「次は絶対に準備する」と、美咲は繰り返した。</p>

  <hr/>
  <h2>田中家が使ったものは、この本のどこかに書いてあった</h2>

  <p>ヘッドライト、携帯トイレ、備蓄水、モバイルバッテリー、カセットコンロ、省電力モードの使い方——田中家の健一が準備していたのは、すべてこの本に書いたものだ。</p>
  <p>特別なサバイバル技術でも、高価な装備でもない。ただ「少しだけ先に知っていた」こと、それだけだった。</p>
  <p>あなたがこの本を最後まで読んだということは、あなたはもう田中家になれる準備ができている。</p>
  <p>残るのは、実際に備えを始めることだけだ。</p>
</div>`);
}

function makeClosing() {
  return xhtml('おわりに', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">おわりに</p>
  <h1>地域で備えることの意味</h1>

  <p>防災会の訓練で出会った、ひとりのお婆さんの話をして、この本を終わりにしたい。</p>
  <p>避難所立ち上げのシミュレーションで、炊き出し担当になったその方は82歳だった。カセットコンロの前に立ち、慣れた手つきでお湯を沸かしながら、こう言った。</p>
  <p>「阪神のとき、お湯一杯でどれだけ人が救われたか。私はそれを見てたから、準備してたの」</p>
  <p>準備していた人が、次に被災した誰かを助ける。そういう連鎖で、地域の防災力は上がっていく。</p>

  <hr/>
  <p>大家として、私はマンションの全入居者に防災リーフレットを配ったことがある。</p>
  <p>反応は様々だった。「もう準備してます」という方もいれば、「初めて考えました」という方もいた。ある一人暮らしの高齢の入居者が「これを見て、息子と話しました。来月、一緒に備蓄を買いに行くことになりました」と言ってくれたとき、やっていよかったと思った。</p>
  <p>医師として、外来でこの本の内容を伝え始めて、「先生に言われた通り、薬を7日分余分に持つようにしました」と報告してくれた患者さんがいる。</p>
  <p>父親として、子どもたちと「地震のときの約束」を作った。避難場所、集合場所、パパとママに連絡できないときにどこに行くか——子どもたちは意外なほど真剣に聞いてくれた。</p>

  <hr/>
  <p>備えることは、自分だけでなく誰かを安心させることでもある。</p>
  <p>この本を読んだあなたが、一つでも備えを始めてくれたなら、それがいつか誰かの命を守ることにつながる。</p>
  <p>こわがるためではなく、守るための防災を。</p>
  <p class="sign">くまごろう</p>
</div>`);
}

function makeAppendix() {
  return xhtml('付録', '../css/style.css', `
<div class="prose-page">
  <p class="chapter-label">付録</p>
  <h1>参考情報・リソース</h1>

  <h2>武蔵野市の防災情報</h2>
  <table class="carte">
    <tr><th>項目</th><th>内容・連絡先</th></tr>
    <tr><td>市の防災ポータル</td><td>武蔵野市 防災情報（市ウェブサイトで検索）</td></tr>
    <tr><td>ハザードマップ</td><td>武蔵野市 洪水・土砂・地震ハザードマップ</td></tr>
    <tr><td>避難所一覧</td><td>武蔵野市指定避難所（市ウェブサイトで最新版を確認）</td></tr>
    <tr><td>武蔵野市防災課</td><td>0422-60-1874</td></tr>
    <tr><td>武蔵野市消防署</td><td>0422-51-0119（緊急時は119）</td></tr>
  </table>

  <h2>備蓄グッズの優先度リスト</h2>
  <p>第3章の冒頭（優先度表・予算の目安）を参照。買い物の際は第3章の表をそのまま持っていけばよい。</p>

  <h2>防災Lab ウェブサイト</h2>
  <p>最新情報・まんがの追加・地域別情報は、防災Lab ウェブサイトで随時更新しています。</p>
  <p><strong>https://bousai-lab.vercel.app</strong></p>
  <p>X（旧Twitter）でも毎日、防災の実用情報を発信しています。</p>
  <p><strong>@zaitaku_bousai</strong></p>
</div>`);
}

function makeCoverPage() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
  <meta charset="UTF-8"/>
  <title>こわがるためではなく、守るための防災――避難所に行かない「在宅避難」まんがガイド</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
  <style type="text/css">
    body { margin: 0; padding: 0; }
    .cover-full { text-align: center; margin: 0; padding: 0; }
    .cover-full img { width: 100%; height: 100%; max-width: 100%; }
  </style>
</head>
<body>
<div class="cover-full">
  <img src="../images/cover.jpg" alt="こわがるためではなく、守るための防災――避難所に行かない「在宅避難」まんがガイド 表紙"/>
</div>
</body>
</html>`;
}

// ── はじめに・おわりに用まんがデータ ─────────────────────────────
const INTRO_CLOSING_MANGA = [
  {
    slug: 'intro-landlord',
    title: '大家として——入居者からの問いに答えられなかった日',
    emoji: '🏢',
    panels: [
      { character: 'riss',  text: 'ねえロボ！大家さんって建物を管理するだけじゃダメ？' },
      { character: 'robot', text: '発災後に入居者が生き延びるか…そこまで考える必要があるぞ！' },
      { character: 'riss',  text: 'エレベーターが止まったら高齢の入居者さんはどうするの？' },
      { character: 'robot', text: 'だから大家こそ"その後"の備えを先頭に立って考えるべきだ！' },
    ],
    points: ['建物の安全だけでなく「発災後の生活」まで考える', '高層階の高齢入居者への配慮が特に重要', '大家・管理組合が防災の中心となれる'],
  },
  {
    slug: 'intro-father',
    title: '父として——防災会で72時間の現実を知った夜',
    emoji: '👨‍👧',
    panels: [
      { character: 'riss',  text: '地域の防災会の訓練に出たら衝撃だったよ…' },
      { character: 'robot', text: '何が衝撃だったんだ？教えてくれ！' },
      { character: 'riss',  text: '避難所の定員…市民全員の3割しかない！どうするの？！' },
      { character: 'robot', text: 'だから"自宅で生き延びる"備えが必要なんだ！' },
    ],
    points: ['避難所の収容人数は市民の約3割に過ぎない', '72時間は基本的に自分たちで対応する必要がある', '自宅で安全に過ごせる備えが最優先'],
  },
  {
    slug: 'intro-doctor',
    title: '医師として——薬を失った患者さんと向き合った話',
    emoji: '🩺',
    panels: [
      { character: 'riss',  text: '先生！発災後の外来に大変な患者さんが続くって本当？' },
      { character: 'robot', text: '薬を流された…お薬手帳がない…そんな方が次々と来るんだ' },
      { character: 'riss',  text: '医師として何ができるの？一人ずつ診るのは限界があるよね' },
      { character: 'robot', text: '「事前に伝えること」だからこの本を書いたんだ！備えが命を守る' },
    ],
    points: ['発災後は「薬の紛失」「お薬手帳なし」が外来に殺到する', '持病がある人の薬の備蓄は命に直結する', '事前に知ること・伝えることが医師にできる最大の防災'],
  },
  {
    slug: 'closing-community',
    title: '地域で備えることの意味——お婆さんの炊き出し',
    emoji: '🤝',
    panels: [
      { character: 'riss',  text: '防災会で82歳のお婆さんが炊き出しを仕切ってたよ！' },
      { character: 'robot', text: '「阪神のときお湯一杯でどれだけ人が救われたか見てたから」だって' },
      { character: 'riss',  text: '備えた人が次に被災した誰かを助けるんだね！素敵だな…' },
      { character: 'robot', text: 'そう！地域の防災力はあなたから始まるんだ！' },
    ],
    points: ['備えた人が、次の被災者を助ける連鎖が生まれる', '地域の「顔が見える関係」が最強の防災ネットワーク', 'あなたの備えが、誰かの命を守ることにつながる'],
  },
];

// ── ページ追加ヘルパー ─────────────────────────────────────────────
function addPage(zip, manifestItems, chapters, id, href, content, label) {
  zip.file(`OEBPS/${href}`, content);
  manifestItems.push({ id, href, mediaType: 'application/xhtml+xml', spine: true });
  if (label) chapters.push({ href, label });
}

// ── 5. メイン処理 ─────────────────────────────────────────────────
async function main() {
  console.log('📚 Kindle EPUB 書き出し開始...\n');

  const zip = new JSZip();

  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', makeContainerXml());
  zip.file('OEBPS/css/style.css', makeCss());

  const manifestItems = [
    { id: 'nav', href: 'nav.xhtml', mediaType: 'application/xhtml+xml', properties: 'nav', spine: true },
    { id: 'ncx', href: 'toc.ncx',  mediaType: 'application/x-dtbncx+xml' },
    { id: 'css', href: 'css/style.css', mediaType: 'text/css' },
  ];
  const chapters = [];

  // まんが1話分（画像合成＋ページ追加）を処理する共通ヘルパー
  async function addMangaSet(manga, pageId, tocLabel) {
    const imgBuf      = await combinePanels(manga);
    const imgFileName = `manga-${manga.slug}.jpg`;
    zip.file(`OEBPS/images/${imgFileName}`, imgBuf);
    manifestItems.push({ id: `img-${manga.slug}`, href: `images/${imgFileName}`, mediaType: 'image/jpeg' });

    const mangaHref = `pages/manga-${pageId}.xhtml`;
    addPage(zip, manifestItems, chapters, `manga-${pageId}`, mangaHref,
      mangaPage(manga, imgFileName, 0), tocLabel);

    const article = manga.articleSlug ? loadArticle(manga.articleSlug) : null;
    if (article) {
      const artHref = `pages/article-${pageId}.xhtml`;
      addPage(zip, manifestItems, chapters, `article-${pageId}`, artHref,
        articlePage(article.title, article.html), `    └ 解説：${article.title}`);
    }
    return !!article;
  }

  // ── 前付け ───────────────────────────────────────────────────────
  console.log('  前付け生成中...');
  console.log('    表紙画像を生成中...');
  const coverJpeg = await renderCoverJpeg();
  zip.file('OEBPS/images/cover.jpg', coverJpeg);
  manifestItems.push({ id: 'img-cover', href: 'images/cover.jpg', mediaType: 'image/jpeg', properties: 'cover-image' });
  addPage(zip, manifestItems, chapters, 'cover', 'pages/cover.xhtml', makeCoverPage(), '表紙');
  addPage(zip, manifestItems, chapters, 'intro', 'pages/intro.xhtml', makeIntro(), 'はじめに');

  // はじめに用まんが3本（大家・父・医師）
  console.log('  はじめに用まんが生成中...');
  for (let i = 0; i < 3; i++) {
    const m = INTRO_CLOSING_MANGA[i];
    process.stdout.write(`    ${m.emoji} ${m.title.slice(0, 20)}... `);
    await addMangaSet(m, `intro-${i + 1}`, `  ${m.emoji} ${m.title}`);
    process.stdout.write('✅\n');
  }

  addPage(zip, manifestItems, chapters, 'prologue', 'pages/prologue.xhtml', makePrologue(), '序章　もし明日、地震が来たら——二つの家族');

  // ── 第1章：発災直後の行動（シーン別まんが3話＋解説） ────────────
  console.log('\n  第1章：発災直後の行動...');
  addPage(zip, manifestItems, chapters, 'ch1', 'pages/chapter1.xhtml', makeChapter1(), '第1章　発災直後——最初の行動');

  for (let i = 0; i < ACTION_MANGA_ORDER.length; i++) {
    const manga = mangaBySlug(ACTION_MANGA_ORDER[i]);
    process.stdout.write(`    [1-${i + 1}] ${manga.title} ...`);
    const hasArticle = await addMangaSet(manga, `1-${i + 1}-${manga.slug}`, `  1-${i + 1}　${manga.emoji} ${manga.title}`);
    process.stdout.write(hasArticle ? ' 記事あり\n' : ' 記事なし\n');
  }

  // ── 第2章：72時間を生き延びる ───────────────────────────────────
  console.log('\n  第2章：72時間タイムライン...');
  addPage(zip, manifestItems, chapters, 'ch2', 'pages/chapter2.xhtml', makeChapter2(), '第2章　72時間を生き延びる');
  addPage(zip, manifestItems, chapters, 'ch2-timeline', 'pages/chapter2-timeline.xhtml', makeChapter2Timeline(), '  在宅避難72時間タイムライン');

  // ── 第3章：命を守る備蓄グッズ10（優先度順まんが10話＋解説） ─────
  console.log('\n  第3章：備蓄グッズ10...');
  addPage(zip, manifestItems, chapters, 'ch3', 'pages/chapter3.xhtml', makeChapter3(), '第3章　命を守る備蓄グッズ10');

  for (let i = 0; i < GOODS_MANGA_ORDER.length; i++) {
    const manga = mangaBySlug(GOODS_MANGA_ORDER[i]);
    process.stdout.write(`    [グッズ${i + 1}/10] ${manga.title} ...`);
    const hasArticle = await addMangaSet(manga, `3-${i + 1}-${manga.slug}`, `  グッズ${i + 1}　${manga.emoji} ${manga.title}`);
    process.stdout.write(hasArticle ? ' 記事あり\n' : ' 記事なし\n');
  }

  // ── 第4・5章／後付け ─────────────────────────────────────────────
  console.log('\n  後付け生成中...');
  addPage(zip, manifestItems, chapters, 'ch04',     'pages/chapter04.xhtml', makeChapter04(), '第4章　立場別チェックリスト');
  addPage(zip, manifestItems, chapters, 'ch05',     'pages/chapter05.xhtml', makeChapter05(), '第5章　わが家の防災カルテ');
  addPage(zip, manifestItems, chapters, 'epilogue', 'pages/epilogue.xhtml',  makeEpilogue(),  'エピローグ　その後の二つの家族');

  // おわりに用まんが（地域の力）
  console.log('  おわりに用まんが生成中...');
  const closingM = INTRO_CLOSING_MANGA[3];
  process.stdout.write(`    ${closingM.emoji} ${closingM.title.slice(0, 20)}... `);
  await addMangaSet(closingM, 'closing', `  ${closingM.emoji} ${closingM.title}`);
  process.stdout.write('✅\n');

  addPage(zip, manifestItems, chapters, 'closing',  'pages/closing.xhtml',   makeClosing(),   'おわりに');
  addPage(zip, manifestItems, chapters, 'appendix', 'pages/appendix.xhtml',  makeAppendix(),  '付録');

  // ── nav / ncx / opf ─────────────────────────────────────────────
  zip.file('OEBPS/nav.xhtml', makeNav(chapters));
  zip.file('OEBPS/toc.ncx',  makeNcx(chapters));
  zip.file('OEBPS/content.opf', makeOpf(manifestItems));

  // ── EPUB 書き出し ────────────────────────────────────────────────
  const outPath = path.join(ROOT, 'bousai-lab-kindle.epub');
  const buf = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
  fs.writeFileSync(outPath, buf);

  const sizeMB = (buf.length / 1024 / 1024).toFixed(2);
  const mangaCount   = chapters.filter(c => c.href.includes('manga-')).length;
  const articleCount = chapters.filter(c => c.href.includes('article-')).length;
  const totalPages   = chapters.length;

  console.log(`\n✅ 完成: ${outPath}`);
  console.log(`   サイズ:  ${sizeMB} MB`);
  console.log(`   総ページ数: ${totalPages}`);
  console.log(`   まんが:  ${mangaCount} 話`);
  console.log(`   記事:    ${articleCount} 件`);
  console.log(`   構成:  はじめに→序章→第1章 発災直後→第2章 72時間→第3章 グッズ10→第4章 チェックリスト→第5章 カルテ→エピローグ→おわりに→付録`);
  console.log('\nKindle Previewer または https://kdp.amazon.co.jp でアップロードできます。');
}

main().catch(err => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
