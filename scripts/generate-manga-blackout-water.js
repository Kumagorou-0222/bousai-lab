'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 600, H = 750;

// ── ユーティリティ ────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

function bubble(ctx, bx, by, bw, bh, tail, fill, border) {
  roundRect(ctx, bx, by, bw, bh, 18);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  if (!tail) return;
  const tw = 22, tl = 30;
  ctx.save(); ctx.beginPath();
  if (tail === 'left')   { ctx.moveTo(bx+2,by+bh/2-tw/2); ctx.lineTo(bx-tl,by+bh/2); ctx.lineTo(bx+2,by+bh/2+tw/2); }
  if (tail === 'right')  { ctx.moveTo(bx+bw-2,by+bh/2-tw/2); ctx.lineTo(bx+bw+tl,by+bh/2); ctx.lineTo(bx+bw-2,by+bh/2+tw/2); }
  if (tail === 'bottom') { ctx.moveTo(bx+bw/2-tw/2,by+bh-2); ctx.lineTo(bx+bw/2,by+bh+tl); ctx.lineTo(bx+bw/2+tw/2,by+bh-2); }
  if (tail === 'br')     { ctx.moveTo(bx+bw-16-tw,by+bh-2); ctx.lineTo(bx+bw+12,by+bh+tl); ctx.lineTo(bx+bw-16,by+bh-2); }
  if (tail === 'bl')     { ctx.moveTo(bx+16,by+bh-2); ctx.lineTo(bx-12,by+bh+tl); ctx.lineTo(bx+16+tw,by+bh-2); }
  if (tail === 'top')    { ctx.moveTo(bx+bw/2-tw/2,by+2); ctx.lineTo(bx+bw/2,by-tl); ctx.lineTo(bx+bw/2+tw/2,by+2); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.strokeStyle = fill; ctx.lineWidth = 5; ctx.beginPath();
  if (tail === 'left')   { ctx.moveTo(bx+3,by+bh/2-tw/2+3); ctx.lineTo(bx+3,by+bh/2+tw/2-3); }
  if (tail === 'right')  { ctx.moveTo(bx+bw-3,by+bh/2-tw/2+3); ctx.lineTo(bx+bw-3,by+bh/2+tw/2-3); }
  if (tail === 'bottom') { ctx.moveTo(bx+bw/2-tw/2+3,by+bh-3); ctx.lineTo(bx+bw/2+tw/2-3,by+bh-3); }
  if (tail === 'br')     { ctx.moveTo(bx+bw-16-tw+2,by+bh-3); ctx.lineTo(bx+bw-18,by+bh-3); }
  if (tail === 'bl')     { ctx.moveTo(bx+18,by+bh-3); ctx.lineTo(bx+16+tw-2,by+bh-3); }
  if (tail === 'top')    { ctx.moveTo(bx+bw/2-tw/2+3,by+3); ctx.lineTo(bx+bw/2+tw/2-3,by+3); }
  ctx.stroke(); ctx.restore();
}

function bubbleText(ctx, msg, bx, by, bw, bh, color) {
  const n = msg.replace(/\n/g,'').length;
  const fs = n > 20 ? 21 : n > 14 ? 25 : 30;
  ctx.font = `bold ${fs}px "Yu Gothic"`;
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = msg.split('\n'), lh = fs * 1.65;
  const sy = by + bh/2 - ((lines.length-1)*lh)/2;
  lines.forEach((ln, i) => ctx.fillText(ln, bx+bw/2, sy+i*lh));
}

function badge(ctx, num, bg1, bg2) {
  const bx = W-56, by = 8, br = 24;
  const g = ctx.createLinearGradient(bx,by,bx+br*2,by+br*2);
  g.addColorStop(0,bg1); g.addColorStop(1,bg2);
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 12;
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx+br,by+br,br,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'white'; ctx.font = 'bold 28px "Yu Gothic"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(num), bx+br, by+br);
}

function drawChar(ctx, img, x, y, size, flip) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.28)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 10;
  if (flip) { ctx.translate(x+size,y); ctx.scale(-1,1); ctx.drawImage(img,0,0,size,size); }
  else ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

function nameTag(ctx, name, cx, y, bg, fg) {
  ctx.font = 'bold 13px "Yu Gothic"'; ctx.textAlign = 'center';
  const nw = ctx.measureText(name).width + 18, nh = 24;
  roundRect(ctx, cx-nw/2, y, nw, nh, 10);
  ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(name, cx, y+15);
}

function speedLines(ctx, cx, cy, n, r1, r2, color, alpha) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 1.8;
  for (let i = 0; i < n; i++) {
    const a = (i/n)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2);
    ctx.stroke();
  }
  ctx.restore();
}

function check(ctx, cx, cy, size, color) {
  ctx.strokeStyle = color; ctx.lineWidth = size*0.17; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = color+'66'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(cx-size*0.38,cy+size*0.05); ctx.lineTo(cx-size*0.05,cy+size*0.38);
  ctx.lineTo(cx+size*0.42,cy-size*0.32);
  ctx.stroke(); ctx.shadowBlur = 0;
}

// ── シーン描画部品 ────────────────────────────────────────

/** キッチン（シンク・蛇口・調理台）*/
function drawKitchen(ctx, opts = {}) {
  const { wallColor = '#D8D0C4', floorColor = '#A89070', counterColor = '#8A9098',
          sinkColor = '#6A7880', tileColor = '#C8C0B8', dark = false } = opts;

  const dim = dark ? 0.35 : 1.0;

  // 床
  const floorGrad = ctx.createLinearGradient(0, H*0.72, 0, H);
  floorGrad.addColorStop(0, dark ? '#3A2810' : floorColor);
  floorGrad.addColorStop(1, dark ? '#201608' : '#786050');
  ctx.fillStyle = floorGrad; ctx.fillRect(0, H*0.72, W, H*0.28);

  // 壁
  ctx.fillStyle = dark ? '#2A2218' : wallColor; ctx.fillRect(0, 0, W, H*0.72);

  // タイル（バックスプラッシュ）
  if (!dark) {
    ctx.strokeStyle = '#B0A898'; ctx.lineWidth = 1;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        const tx = col*60, ty = H*0.38 + row*38;
        if (ty > H*0.72) continue;
        ctx.fillStyle = col%2===row%2 ? '#D0C8BC' : '#C8C0B4';
        ctx.fillRect(tx, ty, 60, 38);
        ctx.strokeRect(tx, ty, 60, 38);
      }
    }
  }

  // キッチンカウンター（前面）
  ctx.fillStyle = dark ? '#2A3038' : counterColor; ctx.fillRect(0, H*0.58, W, H*0.14);
  ctx.strokeStyle = dark ? '#1A2028' : '#6A7880'; ctx.lineWidth = 2; ctx.strokeRect(0, H*0.58, W, H*0.14);

  // シンク
  const sx = W*0.24, sy = H*0.6, sw = 240, sh = 105;
  ctx.fillStyle = dark ? '#404850' : sinkColor; ctx.fillRect(sx, sy, sw, sh);
  ctx.strokeStyle = dark ? '#2A3038' : '#4A5860'; ctx.lineWidth = 3; ctx.strokeRect(sx, sy, sw, sh);
  // シンクの内側（くぼみ）
  ctx.fillStyle = dark ? '#303840' : '#5A6870'; ctx.fillRect(sx+10, sy+10, sw-20, sh-20);
  ctx.strokeStyle = dark ? '#202830' : '#3A4850'; ctx.lineWidth = 1.5; ctx.strokeRect(sx+10, sy+10, sw-20, sh-20);
  // 排水口
  ctx.fillStyle = dark ? '#252D35' : '#4A5060';
  ctx.beginPath(); ctx.arc(sx+sw/2, sy+sh-22, 18, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = dark ? '#1A2228' : '#383E46'; ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i/6)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(sx+sw/2+Math.cos(a)*4, sy+sh-22+Math.sin(a)*4);
    ctx.lineTo(sx+sw/2+Math.cos(a)*16, sy+sh-22+Math.sin(a)*16);
    ctx.stroke();
  }

  // 蛇口（ネック）
  ctx.fillStyle = dark ? '#5A6068' : '#8A9098';
  ctx.fillRect(sx+sw/2-7, sy-72, 14, 72);
  ctx.strokeStyle = dark ? '#3A4048' : '#6A7080'; ctx.lineWidth = 2; ctx.strokeRect(sx+sw/2-7, sy-72, 14, 72);
  // 蛇口ヘッド（横向き）
  ctx.fillStyle = dark ? '#606870' : '#909AA0';
  ctx.fillRect(sx+sw/2-36, sy-80, 72, 14);
  ctx.strokeRect(sx+sw/2-36, sy-80, 72, 14);
  // ハンドル
  ctx.fillStyle = dark ? '#484E58' : '#787E88';
  ctx.fillRect(sx+sw/2-5, sy-106, 10, 28);
  ctx.strokeRect(sx+sw/2-5, sy-106, 10, 28);

  // 窓（右上）
  if (!dark) {
    const wndX = W*0.62, wndY = 24, wndW = 190, wndH = 200;
    ctx.fillStyle = '#90C8F0'; ctx.fillRect(wndX, wndY, wndW, wndH);
    ctx.strokeStyle = '#C8B898'; ctx.lineWidth = 5; ctx.strokeRect(wndX, wndY, wndW, wndH);
    ctx.strokeStyle = '#B0A080'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(wndX+wndW/2, wndY); ctx.lineTo(wndX+wndW/2, wndY+wndH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wndX, wndY+wndH/2); ctx.lineTo(wndX+wndW, wndY+wndH/2); ctx.stroke();
    // 窓の外（空）
    const sky = ctx.createLinearGradient(0, wndY, 0, wndY+wndH);
    sky.addColorStop(0, '#87CEEB'); sky.addColorStop(1, '#E0F4FF');
    ctx.fillStyle = sky; ctx.fillRect(wndX+5, wndY+5, wndW-10, wndH-10);
    ctx.fillStyle = '#C8B898'; ctx.fillRect(wndX+wndW/2-2, wndY, 4, wndH);
    ctx.fillRect(wndX, wndY+wndH/2-2, wndW, 4);
  }
}

/** リアルなペットボトル */
function drawBottle(ctx, x, y, w, h, color = '#B8D8F0', labelText = '水') {
  // ボトル本体
  ctx.fillStyle = color; ctx.globalAlpha = 0.85;
  roundRect(ctx, x, y+h*0.12, w, h*0.88, w*0.12); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#5090B0'; ctx.lineWidth = 2; ctx.stroke();

  // キャップ
  ctx.fillStyle = '#2060A8'; ctx.fillRect(x+w*0.15, y, w*0.7, h*0.14);
  ctx.strokeStyle = '#1040A0'; ctx.lineWidth = 1.5; ctx.strokeRect(x+w*0.15, y, w*0.7, h*0.14);

  // ラベル
  ctx.fillStyle = 'white'; ctx.globalAlpha = 0.9;
  ctx.fillRect(x+4, y+h*0.32, w-8, h*0.36);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#90C0E0'; ctx.lineWidth = 1; ctx.strokeRect(x+4, y+h*0.32, w-8, h*0.36);
  ctx.fillStyle = '#1060A0'; ctx.font = `bold ${Math.max(10, w*0.28)}px "Yu Gothic"`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(labelText, x+w/2, y+h*0.5);

  // 光沢
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x+4, y+h*0.12, w*0.25, h*0.8);
}

/** ポンプの電気系統図 */
function drawPumpDiagram(ctx, x, y, powered) {
  const w = 280, h = 200;
  // 背景パネル
  ctx.fillStyle = powered ? '#E8F0E0' : '#F0E0E0';
  roundRect(ctx, x, y, w, h, 12); ctx.fill();
  ctx.strokeStyle = powered ? '#60A060' : '#C04040'; ctx.lineWidth = 2.5; ctx.stroke();

  // タイトル
  ctx.fillStyle = powered ? '#2A6020' : '#8B0000';
  ctx.font = 'bold 15px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(powered ? '水道ポンプ ▶ 正常稼働' : '水道ポンプ ▶ 停止！', x+w/2, y+24);

  // 電力アイコン → ポンプ → 水道
  const icons = powered
    ? [{ icon: '⚡', label: '電力', x: x+42, ok: true },
       { icon: '⚙️', label: 'ポンプ', x: x+w/2, ok: true },
       { icon: '🚰', label: '水道', x: x+w-42, ok: true }]
    : [{ icon: '⚡', label: '停電', x: x+42, ok: false },
       { icon: '⚙️', label: 'ポンプ', x: x+w/2, ok: false },
       { icon: '🚰', label: '断水', x: x+w-42, ok: false }];

  icons.forEach(({ icon, label, x: ix, ok }) => {
    const iy = y + 100;
    ctx.fillStyle = ok ? '#E8FFE8' : '#FFE8E8';
    roundRect(ctx, ix-26, iy-30, 52, 58, 8); ctx.fill();
    ctx.strokeStyle = ok ? '#4A8040' : '#C04040'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(icon, ix, iy-5);
    ctx.fillStyle = ok ? '#2A6020' : '#8B0000';
    ctx.font = `bold 12px "Yu Gothic"`; ctx.textBaseline = 'middle';
    ctx.fillText(label, ix, iy+26);
    if (!ok) {
      ctx.strokeStyle = '#FF2222'; ctx.lineWidth = 3; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(ix-16, iy-20); ctx.lineTo(ix+16, iy+12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ix+16, iy-20); ctx.lineTo(ix-16, iy+12); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });

  // 矢印（電力→ポンプ→水道）
  const arrows = [[x+68, y+100], [x+w/2+26, y+100]];
  arrows.forEach(([ax, ay]) => {
    ctx.strokeStyle = powered ? '#4A8040' : '#C04040';
    ctx.lineWidth = 2; ctx.setLineDash(powered ? [] : [6, 4]);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax+22, ay); ctx.stroke();
    ctx.setLineDash([]);
    // 矢印ヘッド
    ctx.fillStyle = powered ? '#4A8040' : '#C04040';
    ctx.beginPath(); ctx.moveTo(ax+22, ay-6); ctx.lineTo(ax+32, ay); ctx.lineTo(ax+22, ay+6); ctx.closePath(); ctx.fill();
  });

  // 説明テキスト
  ctx.fillStyle = powered ? '#2A6020' : '#8B0000';
  ctx.font = 'bold 13px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(powered ? '✓ 電力があれば水が出る' : '✗ 停電→ポンプ停止→断水！', x+w/2, y+h-18);
}

// ══════════════════════════════════════════════════════
// Panel 1: 危険発生 — 停電＋断水のしくみ
// ══════════════════════════════════════════════════════
async function panel1(riss) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景：薄暗いキッチン（停電前後の対比）
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2A1E14'); bg.addColorStop(1, '#18100A');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // 暗いキッチンシーン
  drawKitchen(ctx, { dark: true });

  // 停電の雰囲気（暗さのオーバーレイ）
  const darkOverlay = ctx.createRadialGradient(W/2, H/2, 80, W/2, H/2, 420);
  darkOverlay.addColorStop(0, 'rgba(0,0,0,0.15)'); darkOverlay.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = darkOverlay; ctx.fillRect(0, 0, W, H);

  // 「停電→断水」のしくみ図（左上エリア）
  drawPumpDiagram(ctx, 25, 30, false);

  // 蛇口から水が出ない演出（蛇口先端に×）
  const fx = W*0.24 + 120, fy = H*0.58 - 72;
  ctx.strokeStyle = '#FF3333'; ctx.lineWidth = 5; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(fx-18, fy-18); ctx.lineTo(fx+18, fy+18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx+18, fy-18); ctx.lineTo(fx-18, fy+18); ctx.stroke();
  ctx.globalAlpha = 1;

  // 「⚡ 停電！」「💧 断水！」テキスト（右下）
  ctx.save();
  ctx.font = 'bold 34px "Yu Gothic"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#200'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  // 停電
  ctx.fillStyle = '#FF8800';
  ctx.strokeText('⚡ 停電！', W*0.75, H*0.56);
  ctx.fillText('⚡ 停電！', W*0.75, H*0.56);
  // 断水
  ctx.fillStyle = '#4488FF';
  ctx.strokeText('💧 断水！', W*0.75, H*0.66);
  ctx.fillText('💧 断水！', W*0.75, H*0.66);
  ctx.restore();

  // 矢印（停電 → 断水）
  ctx.strokeStyle = '#FFAA44'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W*0.75, H*0.61); ctx.lineTo(W*0.75, H*0.625); ctx.stroke();
  ctx.fillStyle = '#FFAA44';
  ctx.beginPath(); ctx.moveTo(W*0.75-8, H*0.613); ctx.lineTo(W*0.75, H*0.625); ctx.lineTo(W*0.75+8, H*0.613); ctx.closePath(); ctx.fill();

  badge(ctx, 1, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 2: 失敗しそう — 蛇口をひねっても水が出ない
// ══════════════════════════════════════════════════════
async function panel2(riss) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 明るめのキッチン（昼間）
  drawKitchen(ctx, { dark: false });

  // 窓から光が差し込む
  const sunBeam = ctx.createLinearGradient(W*0.62, 24, W*0.62, H*0.5);
  sunBeam.addColorStop(0, 'rgba(255,240,180,0.3)');
  sunBeam.addColorStop(1, 'transparent');
  ctx.fillStyle = sunBeam; ctx.fillRect(W*0.62, 24, 190, H*0.5);

  // 蛇口から水が出ない（大きな×印）
  const fx = W*0.24 + 120, fy = H*0.58 - 55;

  // 蛇口先端のグロー（出るはずの水）
  ctx.fillStyle = 'rgba(100,150,200,0.15)';
  ctx.beginPath(); ctx.arc(fx, fy+30, 35, 0, Math.PI*2); ctx.fill();

  // 大きな赤×
  ctx.save();
  ctx.strokeStyle = '#FF2222'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.shadowColor = '#FF0000'; ctx.shadowBlur = 15;
  ctx.beginPath(); ctx.moveTo(fx-30, fy-10); ctx.lineTo(fx+30, fy+50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx+30, fy-10); ctx.lineTo(fx-30, fy+50); ctx.stroke();
  ctx.restore();

  // 「水なし」ラベル
  ctx.fillStyle = '#CC0000';
  roundRect(ctx, fx-55, fy+55, 110, 32, 8); ctx.fill();
  ctx.fillStyle = 'white'; ctx.font = 'bold 15px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⚠ 水が出ない！', fx, fy+71);

  // 「電気が止まると水も止まる」説明（右上エリア）
  ctx.fillStyle = '#FEF3C7';
  roundRect(ctx, W*0.54, 28, 220, 90, 12); ctx.fill();
  ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#78350F'; ctx.font = 'bold 13px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('マンションの水道ポンプは', W*0.54+110, 55);
  ctx.fillText('電気で動いている！', W*0.54+110, 75);
  ctx.fillText('↓ 停電すると断水する', W*0.54+110, 100);

  // Rissキャラ（左側、困惑）
  drawChar(ctx, riss, 28, H*0.33, 158, false);
  nameTag(ctx, '防災リス', 28+79, H*0.33+158+2, 'rgba(245,158,11,0.8)', '#78350F');

  // 吹き出し
  bubble(ctx, 200, 145, 280, 120, 'bl', '#FFFEF0', '#F59E0B');
  bubbleText(ctx, '水が出ない…\nどうすれば…！', 200, 145, 280, 120, '#78350F');

  badge(ctx, 2, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 3: ロボが止める — 備蓄水が必要！
// ══════════════════════════════════════════════════════
async function panel3(riss, robot) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 少し明るいキッチン（ロボの登場で光が入る感じ）
  drawKitchen(ctx, { dark: false,
    wallColor: '#D0C8BC', floorColor: '#A88868',
    counterColor: '#8A9098', sinkColor: '#6A7880' });

  // ロボ登場のインパクト（右側から）
  speedLines(ctx, W*0.72, H*0.42, 36, 70, 380, '#3B82F6', 0.3);

  // インパクト星
  ctx.save();
  const pts = 8, is = 50;
  ctx.fillStyle = '#FFD700'; ctx.shadowColor = '#FF8C00'; ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i < pts*2; i++) {
    const r2 = i%2===0 ? is : is*0.38;
    const a = (i/(pts*2))*Math.PI*2 - Math.PI/2;
    i===0 ? ctx.moveTo(W*0.7+Math.cos(a)*r2, H*0.18+Math.sin(a)*r2)
          : ctx.lineTo(W*0.7+Math.cos(a)*r2, H*0.18+Math.sin(a)*r2);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();

  // ロボキャラ（右側、ペットボトル持参）
  drawChar(ctx, robot, W*0.44, H*0.15, 175, true);
  nameTag(ctx, 'レスQロボ', W*0.44+87, H*0.15+175+2, 'rgba(59,130,246,0.8)', '#EFF6FF');

  // ロボが持っている水ボトル（右手元）
  drawBottle(ctx, W*0.44+155, H*0.15+95, 44, 88);

  // Rissキャラ（左側・驚き）
  drawChar(ctx, riss, 18, H*0.5, 130, false);
  nameTag(ctx, '防災リス', 18+65, H*0.5+130+2, 'rgba(245,158,11,0.8)', '#78350F');

  // ロボの吹き出し（上部、大きく、目立つ）
  bubble(ctx, 12, 12, W-28, 140, 'bottom', '#F0F9FF', '#3B82F6');
  bubbleText(ctx, '2L×人数×3日分の\n備蓄水が必要だ！\n今すぐ準備せよ！', 12, 12, W-28, 140, '#1E40AF');

  // 「！！」エフェクト
  ctx.font = 'bold 64px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FF3333'; ctx.strokeStyle = '#800'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.strokeText('！！', W*0.28, H*0.36);
  ctx.fillText('！！', W*0.28, H*0.36);

  badge(ctx, 3, '#1E3A8A', '#06B6D4');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 4: リスが行動 — 備蓄水で安心！
// ══════════════════════════════════════════════════════
async function panel4(riss) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 明るい部屋（安心感）
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#F5F0E8'); bg.addColorStop(1, '#EBE4D8');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // 床
  const floor = ctx.createLinearGradient(0, H*0.78, 0, H);
  floor.addColorStop(0, '#8B6040'); floor.addColorStop(1, '#5A3818');
  ctx.fillStyle = floor; ctx.fillRect(0, H*0.78, W, H*0.22);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
  [0.82, 0.87, 0.93].forEach(y => {
    ctx.beginPath(); ctx.moveTo(0,H*y); ctx.lineTo(W,H*y); ctx.stroke();
  });

  // 収納棚（右側）
  ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W*0.42, H*0.04, 230, H*0.74);
  ctx.strokeStyle = '#6A3E1C'; ctx.lineWidth = 3; ctx.strokeRect(W*0.42, H*0.04, 230, H*0.74);
  // 棚板
  [H*0.04+H*0.74*0.33, H*0.04+H*0.74*0.66].forEach(sy => {
    ctx.fillStyle = '#7A4E2C'; ctx.fillRect(W*0.42, sy, 230, 14);
    ctx.strokeStyle = '#5A3018'; ctx.lineWidth = 1.5; ctx.strokeRect(W*0.42, sy, 230, 14);
  });

  // 棚の中のボトル（たっぷり備蓄！）
  const bottleRows = [
    { y: H*0.12, label: '水' },
    { y: H*0.12 + H*0.74*0.33 + 14, label: '水' },
    { y: H*0.12 + H*0.74*0.66 + 14, label: '水' },
  ];
  bottleRows.forEach(({ y, label }) => {
    for (let c = 0; c < 4; c++) {
      drawBottle(ctx, W*0.44 + c*52, y, 42, 72, '#B8D8F0', label);
    }
  });

  // 「2L × 3日分 = 12本！」ラベル（棚の上）
  ctx.fillStyle = '#1E3A8A';
  roundRect(ctx, W*0.42, H*0.78-48, 230, 42, 8); ctx.fill();
  ctx.fillStyle = 'white'; ctx.font = 'bold 15px "Yu Gothic"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('2L × 3日分 備蓄完了！', W*0.42+115, H*0.78-27);

  // 「正常に動く水道」の確認図（左上）
  drawPumpDiagram(ctx, 16, 18, true);

  // Rissキャラ（左下、安心した表情）
  drawChar(ctx, riss, 20, H*0.48, 160, false);
  nameTag(ctx, '防災リス', 20+80, H*0.48+160+2, 'rgba(21,128,61,0.8)', 'white');

  // 吹き出し
  bubble(ctx, 190, 235, 280, 120, 'bl', '#FFFEF0', '#16A34A');
  bubbleText(ctx, '備蓄水があれば\n断水も乗り切れる！', 190, 235, 280, 120, '#14532D');

  // チェックマーク
  check(ctx, W*0.2, H*0.45, 58, '#16A34A');

  badge(ctx, 4, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ── 実行 ─────────────────────────────────────────────────

async function main() {
  const rissImg  = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/riss.png')));
  const robotImg = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/robot.png')));

  const dir = path.join(__dirname,'../public/manga/blackout-water');
  fs.mkdirSync(dir, { recursive: true });

  const panels = [
    await panel1(rissImg),
    await panel2(rissImg),
    await panel3(rissImg, robotImg),
    await panel4(rissImg),
  ];

  panels.forEach((canvas, i) => {
    const out = path.join(dir, `panel-0${i+1}.png`);
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    console.log(`✅ blackout-water/panel-0${i+1}.png`);
  });
  console.log('\n🎉 完了！');
}
main().catch(console.error);
