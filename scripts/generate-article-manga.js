/**
 * 汎用4コマ漫画画像生成スクリプト
 *
 * 記事・下書きの frontmatter（manga.panels）から4コマ漫画 comic.png を生成し、
 * public/manga/<slug>/comic.png に保存。frontmatter の mangaImages を更新する。
 *
 * generate-hazard-manga.js を全カテゴリ対応に汎用化したもの。
 * ハードコードされたメタ情報に依存せず、frontmatter のみから生成できる。
 *
 * 実行例:
 *   node scripts/generate-article-manga.js --slug hazard-map --slug disaster-insurance
 *   node scripts/generate-article-manga.js --drafts        # 下書き全件（画像未生成のみ）
 *   node scripts/generate-article-manga.js --missing       # 公開記事で画像が存在しないもの
 *   node scripts/generate-article-manga.js --force --slug x  # 既存画像を上書き
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
const DRAFTS_DIR = path.join(ROOT, 'content', 'drafts');
const OUT_ROOT = path.join(ROOT, 'public', 'manga');
const W = 900;
const H = 1200;

// カテゴリ表示名（lib/categories.ts と同期させること）
const CATEGORY_LABELS = {
  earthquake: '地震',
  typhoon: '台風',
  blackout: '停電',
  evacuation: '避難',
  'disaster-prep': '備蓄・準備',
  'heavy-rain': '豪雨',
  flood: '浸水・洪水',
  tsunami: '津波',
  landslide: '土砂災害',
  volcano: '火山・降灰',
  'crime-prevention': '防犯',
};

const chars = {
  riss: {
    label: '防災リス',
    color: '#F59E0B',
    img: imageDataUri(path.join(ROOT, 'public', 'img', 'riss.png')),
  },
  robot: {
    label: 'レスQロボ',
    color: '#2563EB',
    img: imageDataUri(path.join(ROOT, 'public', 'img', 'robot.png')),
  },
};

function imageDataUri(file) {
  const ext = path.extname(file).slice(1);
  return `data:image/${ext};base64,${fs.readFileSync(file).toString('base64')}`;
}

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function wrapText(text, maxChars, maxLines = 4) {
  const charsArr = Array.from(String(text));
  const lines = [];
  let line = '';
  for (const ch of charsArr) {
    if (line.length >= maxChars) {
      if (lines.length === maxLines - 1) {
        // 最終行が埋まったら省略記号で打ち切る
        lines.push(line.slice(0, maxChars - 1).replace(/[。、！!？?\s]+$/, '') + '…');
        return lines;
      }
      lines.push(line);
      line = '';
    }
    line += ch;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function textLines(text, x, y, options = {}) {
  const {
    maxChars = 16,
    maxLines = 4,
    size = 26,
    weight = 800,
    color = '#111827',
    lineHeight = Math.round(size * 1.45),
    anchor = 'middle',
  } = options;
  const lines = wrapText(text, maxChars, maxLines);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  return lines.map((line, i) => (
    `<text x="${x}" y="${startY + i * lineHeight}" text-anchor="${anchor}" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`
  )).join('');
}

function pill(text, x, y, fill, width = 160) {
  return `<rect x="${x}" y="${y}" width="${width}" height="36" rx="18" fill="${fill}"/>
  <text x="${x + width / 2}" y="${y + 24}" text-anchor="middle" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="17" font-weight="800" fill="white">${esc(text)}</text>`;
}

function bubble(text, x, y, w, h, color) {
  const len = Array.from(String(text)).length;
  const size = len > 42 ? 19 : len > 30 ? 21 : 24;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="white" stroke="${color}" stroke-width="3"/>
    <path d="M${x + w * 0.45} ${y + h} L${x + w * 0.55} ${y + h + 20} L${x + w * 0.65} ${y + h} Z" fill="white" stroke="${color}" stroke-width="3"/>
    ${textLines(text, x + w / 2, y + h / 2 + 6, { maxChars: 13, maxLines: 5, size })}
  </g>`;
}

function character(name, x, y, size, mirror = false) {
  const img = chars[name].img;
  const transform = mirror ? `transform="translate(${x + size} ${y}) scale(-1 1)"` : `transform="translate(${x} ${y})"`;
  return `<g ${transform}>
    <image href="${img}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>
  </g>`;
}

// ============ 背景 ============

function roomBg(x, y, w, h, opts = {}) {
  const { dark = false } = opts;
  const wall = dark ? '#3B3A55' : '#FFEFD5';
  const floor = dark ? '#2A2940' : '#C4B5A5';
  const windowFill = dark ? '#1E293B' : '#7DD3FC';
  const extra = dark
    ? `<circle cx="${x + w - 70}" cy="${y + 60}" r="22" fill="#FDE68A" opacity="0.9"/>`
    : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.68}" fill="${wall}"/>
    <rect x="${x}" y="${y + h * 0.68}" width="${w}" height="${h * 0.32}" fill="${floor}"/>
    <rect x="${x + w - 105}" y="${y + 38}" width="70" height="88" fill="${windowFill}" stroke="#7C2D12" stroke-width="3"/>
    <rect x="${x + 34}" y="${y + 176}" width="58" height="92" fill="${dark ? '#475569' : '#86EFAC'}"/>
    ${dark ? '' : `<circle cx="${x + 63}" cy="${y + 156}" r="36" fill="#16A34A"/>`}
    ${extra}`;
}

function roadBg(x, y, w, h, water = false) {
  const rain = water ? Array.from({ length: 18 }, (_, i) => {
    const rx = x + 20 + i * 24;
    const ry = y + 20 + (i % 5) * 28;
    return `<line x1="${rx}" y1="${ry}" x2="${rx - 18}" y2="${ry + 70}" stroke="#0EA5E9" stroke-opacity="0.55" stroke-width="4"/>`;
  }).join('') : '';
  const flood = water ? `<rect x="${x}" y="${y + h * 0.64}" width="${w}" height="${h * 0.36}" fill="#0E7490" opacity="0.46"/>` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#E0F2FE"/>
    ${rain}
    <rect x="${x}" y="${y + h * 0.58}" width="${w}" height="${h * 0.42}" fill="#9CA3AF"/>
    <line x1="${x + w / 2}" y1="${y + h * 0.61}" x2="${x + w / 2}" y2="${y + h}" stroke="#FACC15" stroke-width="6" stroke-dasharray="18 16"/>
    ${flood}`;
}

function townBg(x, y, w, h) {
  // 防犯・避難向け：住宅街の背景
  return `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.7}" fill="#DBEAFE"/>
    <rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" fill="#9CA3AF"/>
    <rect x="${x + 24}" y="${y + h * 0.34}" width="110" height="${h * 0.36}" fill="#FDE68A" stroke="#92400E" stroke-width="3"/>
    <path d="M${x + 14} ${y + h * 0.34} L${x + 79} ${y + h * 0.18} L${x + 144} ${y + h * 0.34} Z" fill="#DC2626"/>
    <rect x="${x + 56}" y="${y + h * 0.5}" width="34" height="${h * 0.2}" fill="#78350F"/>
    <rect x="${x + w - 150}" y="${y + h * 0.28}" width="96" height="${h * 0.42}" fill="#E5E7EB" stroke="#475569" stroke-width="3"/>
    <rect x="${x + w - 132}" y="${y + h * 0.34}" width="24" height="24" fill="#93C5FD"/>
    <rect x="${x + w - 90}" y="${y + h * 0.34}" width="24" height="24" fill="#93C5FD"/>`;
}

function tsunamiBg(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#CFFAFE"/>
    <path d="M${x} ${y + 280} C${x + 130} ${y + 160}, ${x + 245} ${y + 335}, ${x + w} ${y + 238} V${y + h} H${x} Z" fill="#0EA5E9"/>
    <path d="M${x} ${y + 286} Q${x + 95} ${y + 130}, ${x + 215} ${y + 286} V${y + h} H${x} Z" fill="#65A30D"/>`;
}

function volcanoBg(x, y, w, h) {
  const ash = Array.from({ length: 28 }, (_, i) => `<circle cx="${x + 20 + (i * 53) % 390}" cy="${y + 30 + (i * 37) % 220}" r="${3 + (i % 4)}" fill="#374151" opacity="0.42"/>`).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F3F4F6"/>
    ${ash}
    <path d="M${x + 255} ${y + 320} L${x + 340} ${y + 125} L${x + 420} ${y + 320} Z" fill="#6B7280"/>
    <rect x="${x}" y="${y + 318}" width="${w}" height="44" fill="#9CA3AF"/>`;
}

function landslideBg(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ECFCCB"/>
    <path d="M${x + 220} ${y + h} L${x + w} ${y + 80} V${y + h} Z" fill="#65A30D"/>
    <path d="M${x + 270} ${y + h} L${x + w} ${y + 180} V${y + h} Z" fill="#A16207"/>`;
}

function scene(category, rect) {
  const { x, y, w, h } = rect;
  switch (category) {
    case 'typhoon':
    case 'heavy-rain':
      return roadBg(x, y, w, h, true);
    case 'flood':
      return roadBg(x, y, w, h, true);
    case 'tsunami':
      return tsunamiBg(x, y, w, h);
    case 'volcano':
      return volcanoBg(x, y, w, h);
    case 'landslide':
      return landslideBg(x, y, w, h);
    case 'blackout':
      return roomBg(x, y, w, h, { dark: true });
    case 'evacuation':
    case 'crime-prevention':
      return townBg(x, y, w, h);
    default:
      // earthquake / disaster-prep / その他 → 室内
      return roomBg(x, y, w, h);
  }
}

// ============ パネル・全体 ============

function panelSvg(article, panelData, i, rect) {
  const speaker = panelData.character === 'robot' ? 'robot' : 'riss';
  const other = speaker === 'riss' ? 'robot' : 'riss';
  const numColor = i === 3 ? '#16A34A' : i === 1 ? '#0284C7' : '#F97316';
  const line = panelData.message || '';
  const bg = scene(article.category, rect);
  const charsSvg = i === 3
    ? `${character('riss', rect.x + 72, rect.y + 196, 138)}${character('robot', rect.x + 244, rect.y + 180, 144)}`
    : `${character(speaker, rect.x + 54, rect.y + 194, 134)}${character(other, rect.x + 264, rect.y + 188, 128, true)}`;
  return `<g>
    <clipPath id="clip-${article.slug}-${i}"><rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" rx="8"/></clipPath>
    <g clip-path="url(#clip-${article.slug}-${i})">${bg}${charsSvg}</g>
    <rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" rx="8" fill="none" stroke="#334155" stroke-width="2"/>
    <circle cx="${rect.x + 28}" cy="${rect.y + 28}" r="18" fill="${numColor}"/>
    <text x="${rect.x + 28}" y="${rect.y + 36}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="900" fill="white">${i + 1}</text>
    ${bubble(line, rect.x + 62, rect.y + 30, 300, 140, chars[speaker].color)}
  </g>`;
}

function svgFor(article) {
  const badge = `${article.emoji || '📖'} ${CATEGORY_LABELS[article.category] || '防災'}`;
  const conclusion = article.conclusion || article.description || '';
  const points = article.points.slice(0, 3);
  const panels = [
    { x: 64, y: 272, w: 378, h: 380 },
    { x: 458, y: 272, w: 378, h: 380 },
    { x: 64, y: 668, w: 378, h: 380 },
    { x: 458, y: 668, w: 378, h: 380 },
  ];
  const footer = points.length >= 2
    ? `<rect x="64" y="1080" width="${W - 128}" height="66" rx="10" fill="#FFF7ED" stroke="#FECACA" stroke-width="1.5"/>
      ${pill('覚えよう', 82, 1096, '#EF4444', 108)}
      ${points.map((p, i) => {
        const px = 220 + i * 205;
        const fill = ['#2563EB', '#16A34A', '#F97316'][i];
        return `<circle cx="${px}" cy="1114" r="15" fill="${fill}"/>
          <text x="${px}" y="1120" text-anchor="middle" font-family="Arial" font-size="16" font-weight="900" fill="white">${i + 1}</text>
          <text x="${px + 23}" y="1120" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="17" font-weight="800" fill="#334155">${esc(wrapText(p, 9, 1)[0])}</text>`;
      }).join('')}`
    : `<text x="${W / 2}" y="1118" text-anchor="middle" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="17" font-weight="700" fill="#94A3B8">防災Lab — bousai-lab.vercel.app</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#FFFDF7"/>
    <rect x="36" y="34" width="${W - 72}" height="${H - 68}" rx="16" fill="white" stroke="#E5E7EB" stroke-width="1.5"/>
    ${pill(badge, W / 2 - 90, 44, '#EF4444', 180)}
    ${textLines(article.title, W / 2, 128, { maxChars: 24, maxLines: 2, size: 30, weight: 900, lineHeight: 40 })}
    <text x="${W / 2}" y="178" text-anchor="middle" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="17" font-weight="700" fill="#64748B">くまごろう（現役勤務医）　|　${esc(article.date)}</text>
    <rect x="64" y="190" width="${W - 128}" height="72" rx="10" fill="#FFF7ED" stroke="#EF4444" stroke-width="2"/>
    ${textLines(`結論：${conclusion}`, 92, 228, { maxChars: 39, maxLines: 2, size: 18, weight: 800, color: '#B91C1C', anchor: 'start' })}
    ${article.panels.slice(0, 4).map((p, i) => panelSvg(article, p, i, panels[i])).join('')}
    ${footer}
  </svg>`;
}

// ============ 記事読み込み ============

function loadArticle(slug) {
  for (const dir of [ARTICLES_DIR, DRAFTS_DIR]) {
    const file = path.join(dir, `${slug}.mdx`);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = matter(raw);
    return buildArticle(file, raw, parsed, slug);
  }
  return null;
}

function buildArticle(file, raw, parsed, slug) {
  const d = parsed.data;
  return {
    file,
    raw,
    slug,
    title: d.title || slug,
    description: d.description || '',
    conclusion: d.conclusion || '',
    emoji: d.emoji || '',
    date: d.date || new Date().toISOString().slice(0, 10),
    category: String(d.category || 'disaster-prep'),
    panels: d.manga?.panels || [],
    points: (d.reasons || []).map((r) => r.title).filter(Boolean),
  };
}

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const file = path.join(dir, name);
      const raw = fs.readFileSync(file, 'utf8');
      return buildArticle(file, raw, matter(raw), name.replace(/\.mdx$/, ''));
    });
}

function hasComicImage(slug) {
  return fs.existsSync(path.join(OUT_ROOT, slug, 'comic.png'));
}

// frontmatter の mangaImages を comic.png へ更新（既存参照を置き換え）
function upsertMangaImage(article) {
  const block = `mangaImages:\n  - "/manga/${article.slug}/comic.png"`;
  let next = article.raw;
  if (/^mangaImages:/m.test(next)) {
    next = next.replace(/mangaImages:\r?\n(?:  - .+\r?\n)+/m, `${block}\n`);
  } else {
    next = next.replace(/^manga:\s*$/m, `${block}\nmanga:`);
  }
  if (next !== article.raw) fs.writeFileSync(article.file, next, 'utf8');
}

// ============ メイン ============

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const slugs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) slugs.push(args[++i]);
  }

  let targets = [];
  if (slugs.length > 0) {
    for (const slug of slugs) {
      const a = loadArticle(slug);
      if (!a) { console.warn(`[skip] ${slug} — MDXが見つかりません`); continue; }
      targets.push(a);
    }
  } else if (args.includes('--drafts')) {
    targets = listDir(DRAFTS_DIR).filter((a) => force || !hasComicImage(a.slug));
  } else if (args.includes('--missing')) {
    targets = listDir(ARTICLES_DIR).filter((a) => a.panels.length >= 4 && !hasComicImage(a.slug));
  } else {
    console.log('使い方: --slug <slug> | --drafts | --missing [--force]');
    return;
  }

  targets = targets.filter((a) => {
    if (a.panels.length < 4) { console.warn(`[skip] ${a.slug} — manga.panels が4コマ未満`); return false; }
    if (!force && hasComicImage(a.slug)) { console.log(`[skip] ${a.slug} — 画像あり（--force で上書き）`); return false; }
    return true;
  });

  if (targets.length === 0) { console.log('生成対象がありません。'); return; }

  for (const article of targets) {
    const outDir = path.join(OUT_ROOT, article.slug);
    fs.mkdirSync(outDir, { recursive: true });
    await sharp(Buffer.from(svgFor(article))).png().toFile(path.join(outDir, 'comic.png'));
    upsertMangaImage(article);
    console.log(`✅ generated public/manga/${article.slug}/comic.png`);
  }
  console.log(`done ${targets.length} comics`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
