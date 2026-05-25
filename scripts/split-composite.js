'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const ARTICLES = [
  'earthquake-zaitaku',
  'evacuation-timing',
  'evacuation-shelter-infection',
];

// 画像のピクセルデータを走査して、最も白い横ライン（パネル間の余白）の y 座標を返す
// searchFrom〜searchTo の範囲内で探す（デフォルト: 30%〜70%）
function findHorizontalSplit(ctx, W, H) {
  const data = ctx.getImageData(0, 0, W, H).data;
  const searchFrom = Math.floor(H * 0.30);
  const searchTo   = Math.floor(H * 0.70);

  let bestY = Math.floor(H / 2);
  let bestScore = -1;

  for (let y = searchFrom; y < searchTo; y++) {
    let totalBrightness = 0;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avg = totalBrightness / W;
    if (avg > bestScore) {
      bestScore = avg;
      bestY = y;
    }
  }

  return bestY;
}

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

  // 一度 canvas に描画してピクセルデータを取得
  const tempCanvas = createCanvas(W, H);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0);

  const splitY = findHorizontalSplit(tempCtx, W, H);
  const topH    = splitY;
  const bottomH = H - splitY;

  console.log(`📐 ${slug}: ${W}x${H} → 横分割 y=${splitY} (上${topH}px / 下${bottomH}px)`);

  const panels = [
    { srcX: 0,      srcY: 0,      srcW: panelW,  srcH: topH,    num: 1 },
    { srcX: panelW, srcY: 0,      srcW: panelW,  srcH: topH,    num: 2 },
    { srcX: 0,      srcY: splitY, srcW: panelW,  srcH: bottomH, num: 3 },
    { srcX: panelW, srcY: splitY, srcW: panelW,  srcH: bottomH, num: 4 },
  ];

  for (const { srcX, srcY, srcW, srcH, num } of panels) {
    const canvas = createCanvas(srcW, srcH);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    const outPath = path.join(dir, `panel-0${num}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`  ✅ panel-0${num}.png (${srcW}x${srcH})`);
  }
}

async function main() {
  for (const slug of ARTICLES) {
    await splitComposite(slug);
  }
  console.log('\n🎉 分割完了！');
}

main().catch(console.error);
