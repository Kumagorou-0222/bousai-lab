'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const ARTICLES = [
  'earthquake-zaitaku',
  'evacuation-timing',
  'evacuation-shelter-infection',
];

async function splitComposite(slug) {
  const dir = path.join(__dirname, `../public/manga/${slug}`);
  const src = path.join(dir, 'composite.png');

  if (!fs.existsSync(src)) {
    console.error(`❌ composite.png が見つかりません: ${src}`);
    return;
  }

  const img = await loadImage(fs.readFileSync(src));
  const W = img.width;
  const H = img.height;
  const panelW = Math.floor(W / 2);
  const panelH = Math.floor(H / 2);

  console.log(`📐 ${slug}: ${W}x${H} → パネル ${panelW}x${panelH}`);

  // 2×2 グリッドの各コマ位置
  const positions = [
    { col: 0, row: 0, num: 1 }, // 左上
    { col: 1, row: 0, num: 2 }, // 右上
    { col: 0, row: 1, num: 3 }, // 左下
    { col: 1, row: 1, num: 4 }, // 右下
  ];

  for (const { col, row, num } of positions) {
    const canvas = createCanvas(panelW, panelH);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, col * panelW, row * panelH, panelW, panelH, 0, 0, panelW, panelH);
    const outPath = path.join(dir, `panel-0${num}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`  ✅ panel-0${num}.png`);
  }
}

async function main() {
  for (const slug of ARTICLES) {
    await splitComposite(slug);
  }
  console.log('\n🎉 分割完了！');
}

main().catch(console.error);
