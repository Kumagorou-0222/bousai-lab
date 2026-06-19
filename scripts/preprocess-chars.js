'use strict';
/**
 * preprocess-chars.js
 * riss.png / robot.png の白背景を透明に変換して上書き保存する
 */
const { createCanvas, loadImage } = require('canvas');
const fs   = require('fs');
const path = require('path');

const IMG = path.resolve(__dirname, '../public/img');

async function removeWhiteBg(srcPath) {
  const img = await loadImage(srcPath);
  const W = img.width, H = img.height;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // 白・近白ピクセルを透明化（エッジはグラデーションで滑らかに）
    const brightness = Math.min(r, g, b);           // 最暗チャンネル
    const saturation = Math.max(r,g,b) - Math.min(r,g,b);
    if (brightness >= 245 && saturation <= 15) {
      data[i+3] = 0;                                // 完全透明
    } else if (brightness >= 210 && saturation <= 30) {
      // エッジ：段階的に半透明
      const t = (brightness - 210) / 35;            // 0→1
      data[i+3] = Math.round(data[i+3] * (1 - t));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  fs.writeFileSync(srcPath, canvas.toBuffer('image/png'));
  console.log(`✅ ${path.basename(srcPath)} → 白背景を透明化 (${W}x${H})`);
}

(async () => {
  await removeWhiteBg(path.join(IMG, 'riss.png'));
  await removeWhiteBg(path.join(IMG, 'robot.png'));
  console.log('\n完了。全漫画を再生成してください。');
})();
