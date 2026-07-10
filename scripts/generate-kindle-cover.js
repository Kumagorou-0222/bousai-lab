'use strict';
/**
 * Kindle EPUB用の表紙画像（cover.jpg）を生成する。
 *
 * Amazon KDP推奨サイズ：縦横比 1.6:1、長辺2560px以上
 * 実行: node scripts/generate-kindle-cover.js
 * 出力: kindle-export/cover.jpg
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'kindle-export');
const W = 1600;
const H = 2560;

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

function chipsRow(y) {
  const chips = [
    { label: '地震', color: '#FF6B00' },
    { label: '台風', color: '#3A5FFF' },
    { label: '停電', color: '#E69500' },
    { label: '避難', color: '#1E9E50' },
    { label: '備蓄', color: '#8B5CF6' },
  ];
  const chipW = 220;
  const gap = 24;
  const totalW = chips.length * chipW + (chips.length - 1) * gap;
  const startX = W / 2 - totalW / 2;
  return chips
    .map((c, i) => {
      const x = startX + i * (chipW + gap);
      return `<rect x="${x}" y="${y}" width="${chipW}" height="86" rx="43" fill="${c.color}"/>
      <text x="${x + chipW / 2}" y="${y + 56}" text-anchor="middle" font-family="Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif" font-size="34" font-weight="800" fill="white">${esc(c.label)}</text>`;
    })
    .join('\n');
}

function svgCover() {
  const riss = imageDataUri(path.join(ROOT, 'public', 'img', 'riss.png'));
  const robot = imageDataUri(path.join(ROOT, 'public', 'img', 'robot.png'));

  const FONT = 'Yu Gothic, Meiryo, Noto Sans CJK JP, sans-serif';
  const ORANGE = '#FF6B00';
  const YELLOW = '#FFD000';
  const DARK = '#1A1A1A';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFDF5"/>
      <stop offset="55%" stop-color="#FFF3E0"/>
      <stop offset="100%" stop-color="#FFE0B8"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${YELLOW}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${YELLOW}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W - 120}" cy="180" r="420" fill="url(#glow1)"/>
  <circle cx="140" cy="${H - 260}" r="480" fill="url(#glow2)"/>

  <!-- 「家」モチーフの透かし（在宅避難のメッセージを象徴） -->
  <g fill="none" stroke="${ORANGE}" stroke-opacity="0.09" stroke-width="7">
    <polyline points="350,650 800,250 1250,650"/>
    <rect x="400" y="650" width="800" height="1420" />
    <rect x="700" y="1650" width="200" height="420" />
    <circle cx="1000" cy="950" r="70" />
  </g>

  <!-- 外枠 -->
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" rx="0" fill="none" stroke="${ORANGE}" stroke-width="4" stroke-opacity="0.35"/>

  <!-- 監修バッジ -->
  <rect x="${W / 2 - 250}" y="150" width="500" height="76" rx="38" fill="${ORANGE}"/>
  <text x="${W / 2}" y="200" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="white">現役医師監修 × 武蔵野市</text>

  <!-- タイトル -->
  <text x="${W / 2}" y="350" text-anchor="middle" font-family="${FONT}" font-size="78" font-weight="800" fill="${DARK}">こわがるためではなく、</text>
  <text x="${W / 2}" y="470" text-anchor="middle" font-family="${FONT}" font-size="112" font-weight="900" fill="${DARK}">守るための防災</text>

  <!-- サブタイトル -->
  <text x="${W / 2}" y="565" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="800" fill="${ORANGE}">避難所に行かない――「在宅避難」まんがガイド</text>

  <!-- タグライン -->
  <text x="${W / 2}" y="622" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="600" fill="#555555">地震・停電を、自宅で乗り切るための実践ガイド</text>

  <!-- 区切り線 -->
  <line x1="${W / 2 - 220}" y1="670" x2="${W / 2 + 220}" y2="670" stroke="${ORANGE}" stroke-width="4" stroke-opacity="0.5"/>

  <!-- キャラクター背景カード -->
  <rect x="${W / 2 - 560}" y="900" width="480" height="480" rx="48" fill="#FFF9E6" stroke="${YELLOW}" stroke-width="6"/>
  <rect x="${W / 2 + 80}" y="900" width="480" height="480" rx="48" fill="#EFF6FF" stroke="#93C5FD" stroke-width="6"/>

  <image href="${riss}" x="${W / 2 - 520}" y="940" width="400" height="400" preserveAspectRatio="xMidYMid meet"/>
  <image href="${robot}" x="${W / 2 + 120}" y="940" width="400" height="400" preserveAspectRatio="xMidYMid meet"/>

  <!-- ×マーク -->
  <text x="${W / 2}" y="1170" text-anchor="middle" font-family="${FONT}" font-size="80" font-weight="900" fill="${DARK}" opacity="0.35">×</text>

  <!-- キャラ名 -->
  <text x="${W / 2 - 320}" y="1440" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="800" fill="${ORANGE}">防災リス</text>
  <text x="${W / 2 + 320}" y="1440" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="800" fill="#2563EB">レスQロボ</text>

  <!-- 収録内容チップ -->
  ${chipsRow(1620)}

  <text x="${W / 2}" y="1780" text-anchor="middle" font-family="${FONT}" font-size="36" font-weight="800" fill="${DARK}">まんが17話 ＋ 医師解説14記事 収録</text>

  <!-- 帯（下部） -->
  <rect x="0" y="${H - 340}" width="${W}" height="340" fill="${DARK}"/>
  <text x="${W / 2}" y="${H - 230}" text-anchor="middle" font-family="${FONT}" font-size="42" font-weight="800" fill="white">くまごろう（現役勤務医師）監修</text>
  <text x="${W / 2}" y="${H - 170}" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="500" fill="#CCCCCC">大家・父親・医師としての実体験から書いた防災ガイド</text>

  <line x1="${W / 2 - 300}" y1="${H - 130}" x2="${W / 2 + 300}" y2="${H - 130}" stroke="${ORANGE}" stroke-width="2" stroke-opacity="0.6"/>

  <text x="${W / 2}" y="${H - 80}" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="700" fill="${YELLOW}">防災Lab　bousai-lab.vercel.app</text>
</svg>`;
}

async function renderCoverJpeg() {
  return sharp(Buffer.from(svgCover())).jpeg({ quality: 92 }).toBuffer();
}

module.exports = { svgCover, renderCoverJpeg };

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, 'cover.jpg');
  const buf = await renderCoverJpeg();
  fs.writeFileSync(outPath, buf);
  console.log(`✅ 表紙画像を生成しました: ${outPath}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ エラー:', err);
    process.exit(1);
  });
}
