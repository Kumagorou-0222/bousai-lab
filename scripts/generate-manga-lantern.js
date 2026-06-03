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
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.strokeStyle = fill; ctx.lineWidth = 5; ctx.beginPath();
  if (tail === 'left')   { ctx.moveTo(bx+3,by+bh/2-tw/2+3); ctx.lineTo(bx+3,by+bh/2+tw/2-3); }
  if (tail === 'right')  { ctx.moveTo(bx+bw-3,by+bh/2-tw/2+3); ctx.lineTo(bx+bw-3,by+bh/2+tw/2-3); }
  if (tail === 'bottom') { ctx.moveTo(bx+bw/2-tw/2+3,by+bh-3); ctx.lineTo(bx+bw/2+tw/2-3,by+bh-3); }
  if (tail === 'br')     { ctx.moveTo(bx+bw-16-tw+2,by+bh-3); ctx.lineTo(bx+bw-18,by+bh-3); }
  if (tail === 'bl')     { ctx.moveTo(bx+18,by+bh-3); ctx.lineTo(bx+16+tw-2,by+bh-3); }
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
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 12;
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

function speedLines(ctx, cx, cy, n, r1, r2, color, alpha, lw = 1.5) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
  for (let i = 0; i < n; i++) {
    const a = (i/n)*Math.PI*2, jt = (i%3)*0.06;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a+jt)*r1, cy+Math.sin(a+jt)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2);
    ctx.stroke();
  }
  ctx.restore();
}

function check(ctx, cx, cy, size, color) {
  ctx.strokeStyle = color; ctx.lineWidth = size*0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = color+'66'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(cx-size*0.38,cy+size*0.05); ctx.lineTo(cx-size*0.05,cy+size*0.38);
  ctx.lineTo(cx+size*0.42,cy-size*0.32);
  ctx.stroke(); ctx.shadowBlur = 0;
}

// ── シーン部品 ────────────────────────────────────────────

/** リアルな吊り電球（消灯） */
function drawDeadBulb(ctx, cx, cy) {
  ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy-60); ctx.lineTo(cx, cy-14); ctx.stroke();
  ctx.fillStyle = '#2A2A2A';
  ctx.beginPath(); ctx.ellipse(cx, cy, 22, 30, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(cx-9, cy-38, 18, 28);
}

/** 月明かり（窓） */
function drawMoonWindow(ctx, wx, wy, ww, wh) {
  // 窓枠
  ctx.fillStyle = '#4A5870'; ctx.fillRect(wx, wy, ww, wh);
  ctx.strokeStyle = '#2A3040'; ctx.lineWidth = 5; ctx.strokeRect(wx, wy, ww, wh);
  // 窓格子
  ctx.beginPath(); ctx.moveTo(wx+ww/2, wy); ctx.lineTo(wx+ww/2, wy+wh); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(wx, wy+wh*0.45); ctx.lineTo(wx+ww, wy+wh*0.45); ctx.stroke();
  // 月
  ctx.fillStyle = '#E8E060'; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.arc(wx+ww*0.72, wy+wh*0.28, 28, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4A5870';
  ctx.beginPath(); ctx.arc(wx+ww*0.72+14, wy+wh*0.28-6, 26, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  // 月明かりの差し込み（斜め）
  const moonGlow = ctx.createLinearGradient(wx, wy, wx+ww*0.4, wy+wh*1.5);
  moonGlow.addColorStop(0, 'rgba(180,200,255,0.18)');
  moonGlow.addColorStop(1, 'rgba(180,200,255,0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.moveTo(wx, wy); ctx.lineTo(wx+ww, wy); ctx.lineTo(wx+ww*0.15, wy+wh*2.2); ctx.closePath();
  ctx.fill();
}

/** 家具シルエット（ソファ） */
function drawSofaSilhouette(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y+h*0.3, w, h*0.7);          // 座面
  ctx.fillRect(x-h*0.12, y, h*0.22, h);          // 左アーム
  ctx.fillRect(x+w-h*0.12, y, h*0.22, h);        // 右アーム
  ctx.fillRect(x+h*0.22, y, w-h*0.44, h*0.45);   // 背もたれ
}

/** リアルなLEDランタン */
function drawLantern(ctx, cx, cy, size, glowAlpha = 0.9) {
  // グロー（大）
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size*2.8);
  glow.addColorStop(0, `rgba(255,210,80,${glowAlpha*0.5})`);
  glow.addColorStop(0.5, `rgba(255,180,40,${glowAlpha*0.2})`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow; ctx.fillRect(cx-size*3, cy-size*3, size*6, size*6);

  // 本体（ハウジング）
  const s = size;
  // 底面
  ctx.fillStyle = '#5A4020'; ctx.fillRect(cx-s*0.55, cy+s*0.6, s*1.1, s*0.22);
  ctx.strokeStyle = '#3A2810'; ctx.lineWidth = 2; ctx.strokeRect(cx-s*0.55, cy+s*0.6, s*1.1, s*0.22);

  // 発光パネル部（四角形）
  const panelGrad = ctx.createLinearGradient(cx-s*0.5, cy-s*0.6, cx+s*0.5, cy+s*0.6);
  panelGrad.addColorStop(0, '#FFF8C0');
  panelGrad.addColorStop(0.4, '#FFE860');
  panelGrad.addColorStop(1, '#FFA020');
  ctx.fillStyle = panelGrad;
  roundRect(ctx, cx-s*0.5, cy-s*0.6, s*1.0, s*1.22, s*0.1);
  ctx.fill();
  ctx.strokeStyle = '#C87010'; ctx.lineWidth = 3; ctx.stroke();

  // 内側のグリッド線（LEDっぽさ）
  ctx.strokeStyle = 'rgba(200,100,10,0.4)'; ctx.lineWidth = 1.5;
  for (let i = 1; i < 3; i++) {
    const gy = cy - s*0.6 + (s*1.22/3)*i;
    ctx.beginPath(); ctx.moveTo(cx-s*0.5+4, gy); ctx.lineTo(cx+s*0.5-4, gy); ctx.stroke();
  }

  // トップハンドル
  ctx.strokeStyle = '#5A4020'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx-s*0.28, cy-s*0.6);
  ctx.bezierCurveTo(cx-s*0.28, cy-s*1.3, cx+s*0.28, cy-s*1.3, cx+s*0.28, cy-s*0.6);
  ctx.stroke();

  // 中央の輝点
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, s*0.35);
  core.addColorStop(0, 'rgba(255,255,220,0.95)');
  core.addColorStop(1, 'transparent');
  ctx.fillStyle = core; ctx.fillRect(cx-s, cy-s, s*2, s*2);
}

/** スマホ（ライトON・バッテリー低） */
function drawPhone(ctx, px, py, pw, ph, batteryPct) {
  // フレーム
  ctx.fillStyle = '#111'; roundRect(ctx, px, py, pw, ph, 10); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
  // 画面（フラッシュライト状態）
  const screenGlow = ctx.createRadialGradient(px+pw/2, py+ph*0.4, 0, px+pw/2, py+ph*0.4, pw*0.8);
  screenGlow.addColorStop(0, '#FFFFFF');
  screenGlow.addColorStop(0.3, '#E8F0FF');
  screenGlow.addColorStop(1, '#1A1A2A');
  ctx.fillStyle = screenGlow;
  roundRect(ctx, px+4, py+8, pw-8, ph-20, 8); ctx.fill();
  // バッテリー表示（上部）
  const battW = pw - 20, battH = 16;
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; roundRect(ctx, px+10, py+12, battW, battH, 4); ctx.fill();
  const fillColor = batteryPct <= 10 ? '#FF3333' : batteryPct <= 30 ? '#FF8800' : '#44DD44';
  ctx.fillStyle = fillColor;
  roundRect(ctx, px+12, py+14, Math.max(4, (battW-4)*(batteryPct/100)), battH-4, 3); ctx.fill();
  // 端子
  ctx.fillStyle = batteryPct <= 10 ? '#FF3333' : '#888';
  ctx.fillRect(px+10+battW, py+16, 5, battH-8);
  // パーセント
  ctx.fillStyle = 'white'; ctx.font = `bold 11px "Yu Gothic"`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${batteryPct}%`, px+pw/2, py+20);
  // ⚠マーク
  if (batteryPct <= 10) {
    ctx.fillStyle = '#FF3333'; ctx.font = 'bold 22px "Yu Gothic"';
    ctx.fillText('⚠', px+pw/2, py+ph*0.58);
    ctx.fillStyle = '#FF6666'; ctx.font = 'bold 13px "Yu Gothic"';
    ctx.fillText('電池切れ寸前！', px+pw/2, py+ph*0.75);
  }
}

/** 床の月明かり反射 */
function drawMoonReflection(ctx, wx, wy, ww, wh) {
  const refX = wx + ww*0.1;
  const refGrad = ctx.createLinearGradient(refX, H*0.72, refX + ww*0.6, H);
  refGrad.addColorStop(0, 'rgba(180,200,255,0.12)');
  refGrad.addColorStop(1, 'rgba(180,200,255,0)');
  ctx.fillStyle = refGrad;
  ctx.beginPath();
  ctx.moveTo(wx, H*0.72); ctx.lineTo(wx+ww, H*0.72); ctx.lineTo(wx+ww*0.8, H); ctx.lineTo(wx*0.5, H);
  ctx.closePath(); ctx.fill();
}

// ══════════════════════════════════════════════════════
// Panel 1: 危険発生 — 月明かりだけの停電した部屋
// ══════════════════════════════════════════════════════
async function panel1(riss, robot) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // --- 背景：夜の部屋 ---
  // 壁（濃い青グレー）
  const wallGrad = ctx.createLinearGradient(0, 0, W, H);
  wallGrad.addColorStop(0, '#16202E'); wallGrad.addColorStop(1, '#0E1520');
  ctx.fillStyle = wallGrad; ctx.fillRect(0, 0, W, H);

  // 床
  ctx.fillStyle = '#0A0E14'; ctx.fillRect(0, H*0.75, W, H*0.25);
  ctx.fillStyle = '#121820'; ctx.fillRect(0, H*0.75, W, 3);

  // 月明かり窓（右上）
  drawMoonWindow(ctx, W*0.52, 30, 220, 260);

  // 月明かりが床に落ちる
  drawMoonReflection(ctx, W*0.52, 30, 220, 260);

  // 消えた天井ライト（左上）
  drawDeadBulb(ctx, 180, 110);

  // ソファ（暗いシルエット、月明かりで輪郭だけ）
  drawSofaSilhouette(ctx, 30, H*0.55, 200, 110, '#0E1828');
  // 輪郭だけ月の光で少し光る
  ctx.strokeStyle = 'rgba(180,200,255,0.15)'; ctx.lineWidth = 2;
  ctx.strokeRect(30, H*0.55+110*0.3, 200, 110*0.7);

  // テーブル（暗いシルエット）
  ctx.fillStyle = '#0A0E16'; ctx.fillRect(260, H*0.68, 130, 12);
  ctx.fillRect(268, H*0.68+12, 14, 50); ctx.fillRect(368, H*0.68+12, 14, 50);

  // 消えた電化製品（TV）- 暗いシルエット
  ctx.fillStyle = '#080C12'; ctx.fillRect(W*0.54, H*0.38, 170, 110);
  ctx.strokeStyle = 'rgba(180,200,255,0.1)'; ctx.lineWidth = 1.5; ctx.strokeRect(W*0.54, H*0.38, 170, 110);

  // 暗闇の中の星形エフェクト（恐怖感）
  ctx.fillStyle = 'rgba(180,200,255,0.08)';
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    ctx.beginPath(); ctx.arc(180+Math.cos(a)*80, H*0.3+Math.sin(a)*60, 2, 0, Math.PI*2); ctx.fill();
  }

  // 上部テキスト
  ctx.font = 'bold 46px "Yu Gothic"';
  ctx.fillStyle = '#FF6600'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = '#FF4400'; ctx.shadowBlur = 20;
  ctx.strokeStyle = '#1A0A00'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.strokeText('⚡ 停電！！', W/2, H*0.12);
  ctx.fillText('⚡ 停電！！', W/2, H*0.12);
  ctx.shadowBlur = 0;

  // 「真っ暗…」サブテキスト
  ctx.font = 'bold 22px "Yu Gothic"';
  ctx.fillStyle = 'rgba(180,200,255,0.4)'; ctx.shadowBlur = 0;
  ctx.fillText('真っ暗…何も見えない', W/2, H*0.26);

  badge(ctx, 1, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 2: 失敗しそう — スマホライトで代用（電池1%）
// ══════════════════════════════════════════════════════
async function panel2(riss, robot) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 真っ暗な部屋
  ctx.fillStyle = '#080C12'; ctx.fillRect(0, 0, W, H);

  // スマホが作る光のコーン（Rissが持っている想定 → 右寄り）
  const lightX = 250, lightY = H*0.55;
  const coneGrad = ctx.createConicalGradient
    ? null  // fallback
    : null;

  // 複数の放射状グラデーションでコーンを作る
  const phoneGlow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 320);
  phoneGlow.addColorStop(0, 'rgba(240,248,255,0.95)');
  phoneGlow.addColorStop(0.15, 'rgba(220,235,255,0.75)');
  phoneGlow.addColorStop(0.4, 'rgba(180,210,255,0.3)');
  phoneGlow.addColorStop(0.7, 'rgba(120,160,220,0.08)');
  phoneGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = phoneGlow; ctx.fillRect(0, 0, W, H);

  // 方向性のある光のコーン（上向き）
  ctx.save();
  const coneLight = ctx.createRadialGradient(lightX, lightY+30, 0, lightX, lightY-50, 280);
  coneLight.addColorStop(0, 'rgba(240,248,255,0.6)');
  coneLight.addColorStop(1, 'transparent');
  ctx.fillStyle = coneLight;
  ctx.beginPath();
  ctx.moveTo(lightX, lightY+30);
  ctx.lineTo(lightX-200, lightY-280);
  ctx.lineTo(lightX+200, lightY-280);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 光が当たった壁（上部中央）
  const wallHit = ctx.createRadialGradient(lightX, 0, 0, lightX, 0, 280);
  wallHit.addColorStop(0, 'rgba(200,220,255,0.3)');
  wallHit.addColorStop(1, 'transparent');
  ctx.fillStyle = wallHit; ctx.fillRect(lightX-280, 0, 560, 280);

  // 影の部分の家具シルエット（光の外）
  ctx.fillStyle = '#040608';
  drawSofaSilhouette(ctx, 30, H*0.6, 120, 80, '#040608');
  ctx.fillStyle = '#040608'; ctx.fillRect(W*0.62, H*0.4, 150, 100); // タンス

  // スマホ本体（Rissが持っているイメージ、右手元）
  const phoneX = lightX + 30, phoneY = H*0.48;
  drawPhone(ctx, phoneX, phoneY, 90, 155, 1);

  // スマホからの追加グロー
  const phoneCore = ctx.createRadialGradient(phoneX+45, phoneY+60, 0, phoneX+45, phoneY+60, 80);
  phoneCore.addColorStop(0, 'rgba(255,255,255,0.4)');
  phoneCore.addColorStop(1, 'transparent');
  ctx.fillStyle = phoneCore; ctx.fillRect(phoneX-40, phoneY-20, 170, 180);

  // Rissキャラ（光に照らされた顔）
  ctx.save();
  // キャラに暖かい光のオーバーレイ
  drawChar(ctx, riss, 60, H*0.38, 155, false);
  // 光の当たり方（左側が明るい）
  const charLight = ctx.createLinearGradient(60, H*0.38, 60+155, H*0.38);
  charLight.addColorStop(0, 'rgba(200,220,255,0)');
  charLight.addColorStop(0.5, 'rgba(200,220,255,0.08)');
  charLight.addColorStop(1, 'rgba(200,220,255,0.2)');
  ctx.fillStyle = charLight; ctx.fillRect(60, H*0.38, 155, 155);
  ctx.restore();
  nameTag(ctx, '防災リス', 60+77, H*0.38+155+2, 'rgba(245,158,11,0.8)', '#78350F');

  // 吹き出し
  bubble(ctx, 16, 14, 285, 120, 'br', '#FFFEF0', '#F59E0B');
  bubbleText(ctx, 'スマホライトで\nなんとかなるかな♪', 16, 14, 285, 120, '#78350F');

  // 警告エフェクト（電池！）
  ctx.save();
  ctx.font = 'bold 18px "Yu Gothic"';
  ctx.fillStyle = '#FF3333'; ctx.textAlign = 'center'; ctx.globalAlpha = 0.9;
  ctx.strokeStyle = '#600'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.strokeText('電池が…！', phoneX+45, phoneY-12);
  ctx.fillText('電池が…！', phoneX+45, phoneY-12);
  ctx.restore();

  badge(ctx, 2, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 3: ロボが止める — ランタンを持って登場！
// ══════════════════════════════════════════════════════
async function panel3(riss, robot) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景（暗い部屋、でも右からランタンの暖かい光が入りつつある）
  const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
  bgGrad.addColorStop(0, '#070B10');
  bgGrad.addColorStop(0.5, '#12181E');
  bgGrad.addColorStop(1, '#201408');
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#050708'; ctx.fillRect(0, H*0.8, W, H*0.2);

  // ロボが来る方向（右）からのランタン光
  const lanternGlow = ctx.createRadialGradient(W*0.72, H*0.42, 0, W*0.72, H*0.42, 420);
  lanternGlow.addColorStop(0, 'rgba(255,200,80,0.85)');
  lanternGlow.addColorStop(0.2, 'rgba(255,170,50,0.45)');
  lanternGlow.addColorStop(0.5, 'rgba(220,140,30,0.15)');
  lanternGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = lanternGlow; ctx.fillRect(0, 0, W, H);

  // 床への反射（暖色）
  const floorReflect = ctx.createLinearGradient(W*0.45, H*0.8, W, H);
  floorReflect.addColorStop(0, 'rgba(255,180,60,0.12)');
  floorReflect.addColorStop(1, 'transparent');
  ctx.fillStyle = floorReflect; ctx.fillRect(W*0.45, H*0.8, W*0.55, H*0.2);

  // 壁への反射（右側）
  const wallReflect = ctx.createRadialGradient(W, H*0.4, 0, W, H*0.4, 300);
  wallReflect.addColorStop(0, 'rgba(255,180,60,0.2)');
  wallReflect.addColorStop(1, 'transparent');
  ctx.fillStyle = wallReflect; ctx.fillRect(W*0.4, 0, W*0.6, H*0.8);

  // 集中線（ロボ登場のインパクト）
  speedLines(ctx, W*0.68, H*0.42, 36, 65, 350, '#FF8C00', 0.32, 2);

  // インパクト星
  ctx.save();
  ctx.fillStyle = '#FFD000'; ctx.shadowColor = '#FF8800'; ctx.shadowBlur = 15;
  const pts = 8; ctx.beginPath();
  const is = 52;
  for (let i = 0; i < pts*2; i++) {
    const r2 = i%2===0 ? is : is*0.38;
    const a = (i/(pts*2))*Math.PI*2 - Math.PI/2;
    i===0 ? ctx.moveTo(W*0.58+Math.cos(a)*r2, H*0.2+Math.sin(a)*r2)
          : ctx.lineTo(W*0.58+Math.cos(a)*r2, H*0.2+Math.sin(a)*r2);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();

  // ソファシルエット（暗い左側）
  drawSofaSilhouette(ctx, 15, H*0.62, 140, 90, '#050708');

  // Rissキャラ（左側・驚いている、スマホを持ったまま）
  drawChar(ctx, riss, 18, H*0.48, 128, false);
  nameTag(ctx, '防災リス', 18+64, H*0.48+128+2, 'rgba(245,158,11,0.8)', '#78350F');
  // スマホ（Rissの手元）
  ctx.save(); ctx.globalAlpha = 0.7;
  drawPhone(ctx, 18+118, H*0.52, 55, 95, 1);
  ctx.restore();

  // ロボキャラ（右側・ランタン持って颯爽と）
  drawChar(ctx, robot, W*0.46, H*0.16, 172, true);
  nameTag(ctx, 'レスQロボ', W*0.46+86, H*0.16+172+2, 'rgba(59,130,246,0.8)', '#EFF6FF');

  // ランタン（ロボの手元・右上）
  drawLantern(ctx, W*0.46+172-20, H*0.16+110, 42, 0.85);

  // 吹き出し（上）
  bubble(ctx, 14, 14, W-30, 135, 'bottom', '#F0F9FF', '#3B82F6');
  bubbleText(ctx, 'スマホの電池が切れたら\n通信も不能になるぞ！\nLEDランタンを使え！', 14, 14, W-30, 135, '#1E40AF');

  // 「！！」エフェクト
  ctx.font = 'bold 68px "Yu Gothic"';
  ctx.fillStyle = '#FF3333'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#800'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.strokeText('！！', W*0.3, H*0.32);
  ctx.fillText('！！', W*0.3, H*0.32);

  badge(ctx, 3, '#1E3A8A', '#06B6D4');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ══════════════════════════════════════════════════════
// Panel 4: リスが行動 — ランタンで部屋が明るい！
// ══════════════════════════════════════════════════════
async function panel4(riss, robot) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景：ランタンの暖かい光に満たされた部屋
  const bgGrad = ctx.createRadialGradient(W*0.62, H*0.48, 0, W*0.62, H*0.48, 520);
  bgGrad.addColorStop(0, '#FFF0C0');
  bgGrad.addColorStop(0.35, '#F5D880');
  bgGrad.addColorStop(0.65, '#D4A040');
  bgGrad.addColorStop(1, '#5A2A08');
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  // 床（木目調、暖色）
  const floorGrad = ctx.createLinearGradient(0, H*0.78, 0, H);
  floorGrad.addColorStop(0, '#8B5E30'); floorGrad.addColorStop(1, '#5A3818');
  ctx.fillStyle = floorGrad; ctx.fillRect(0, H*0.78, W, H*0.22);
  // 板目
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
  [0.82,0.87,0.92].forEach(y => {
    ctx.beginPath(); ctx.moveTo(0,H*y); ctx.lineTo(W,H*y); ctx.stroke();
  });

  // 壁（暖かい色）
  ctx.fillStyle = '#E8C870'; ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 0, W, H*0.78);
  ctx.globalAlpha = 1;

  // 窓（夜明け前でまだ暗め）
  ctx.fillStyle = '#1A2435'; ctx.fillRect(W*0.52, 30, 195, 200);
  ctx.strokeStyle = '#8B6040'; ctx.lineWidth = 5; ctx.strokeRect(W*0.52, 30, 195, 200);
  ctx.strokeStyle = '#6A4028'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W*0.52+97, 30); ctx.lineTo(W*0.52+97, 230); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.52, 130); ctx.lineTo(W*0.52+195, 130); ctx.stroke();

  // テーブル（ランタン置き場）
  ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W*0.44, H*0.58, 230, 20);
  ctx.strokeStyle = '#6A3E1C'; ctx.lineWidth = 2; ctx.strokeRect(W*0.44, H*0.58, 230, 20);
  ctx.fillStyle = '#7A5030';
  ctx.fillRect(W*0.46, H*0.58+20, 16, 130); ctx.fillRect(W*0.44+198, H*0.58+20, 16, 130);

  // メインランタン（テーブルの上）
  drawLantern(ctx, W*0.62, H*0.43, 56, 1.0);

  // ランタンの影（テーブルに落ちる）
  ctx.save();
  ctx.fillStyle = 'rgba(80,30,0,0.25)';
  ctx.beginPath(); ctx.ellipse(W*0.62, H*0.62, 60, 14, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // 家具（ランタンの光に照らされてリアルに見える）
  // ソファ（暖色に照らされた）
  ctx.fillStyle = '#8B6040'; ctx.fillRect(30, H*0.58, 180, 100);
  ctx.fillStyle = '#A07050'; ctx.fillRect(30, H*0.58, 180, 22);
  ctx.fillRect(25, H*0.58, 16, 108); ctx.fillRect(194, H*0.58, 16, 108);
  ctx.fillStyle = '#604020'; ctx.fillRect(25, H*0.58+22, 185, 78);
  // ソファ光の当たり方
  const sofaLight = ctx.createLinearGradient(30, H*0.58, 30+180, H*0.58);
  sofaLight.addColorStop(0, 'rgba(255,200,80,0)');
  sofaLight.addColorStop(1, 'rgba(255,200,80,0.15)');
  ctx.fillStyle = sofaLight; ctx.fillRect(30, H*0.58, 180, 100);

  // スマホ（バッテリー温存・充電中アイコン）
  ctx.fillStyle = '#111'; roundRect(ctx, W*0.44+240, H*0.44, 60, 105, 8); ctx.fill();
  ctx.fillStyle = '#1A2A18'; roundRect(ctx, W*0.44+244, H*0.44+8, 52, 70, 6); ctx.fill();
  ctx.fillStyle = '#44DD44';
  roundRect(ctx, W*0.44+248, H*0.44+12, 44, 10, 3); ctx.fill();
  ctx.fillStyle = 'white'; ctx.font = 'bold 11px "Yu Gothic"'; ctx.textAlign = 'center';
  ctx.fillText('88%', W*0.44+270, H*0.44+22);
  ctx.fillStyle = '#44FF44'; ctx.font = 'bold 20px "Yu Gothic"';
  ctx.fillText('📱', W*0.44+270, H*0.44+55);
  ctx.fillStyle = '#4ADE80'; ctx.font = 'bold 11px "Yu Gothic"';
  ctx.fillText('温存OK!', W*0.44+270, H*0.44+82);

  // Rissキャラ（くつろいでいる）
  drawChar(ctx, riss, 30, H*0.3, 158, false);
  nameTag(ctx, '防災リス', 30+79, H*0.3+158+2, 'rgba(21,128,61,0.8)', 'white');

  // 吹き出し
  bubble(ctx, 210, 14, 280, 130, 'bl', '#FFFEF0', '#16A34A');
  bubbleText(ctx, 'LEDランタンで\n部屋が明るい！\nスマホも温存できた！', 210, 14, 280, 130, '#14532D');

  // ✓チェック
  check(ctx, W*0.16, H*0.16, 60, '#16A34A');

  // 「スマホ電池温存！」ラベル
  ctx.fillStyle = '#15803D'; roundRect(ctx, 30, H*0.78-42, 250, 36, 10); ctx.fill();
  ctx.fillStyle = 'white'; ctx.font = 'bold 15px "Yu Gothic"'; ctx.textAlign = 'center';
  ctx.fillText('🔋 スマホ電池 88% 温存！', 30+125, H*0.78-18);

  badge(ctx, 4, '#FF8C00', '#FFD000');
  ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W-6, H-6);
  return canvas;
}

// ── 実行 ─────────────────────────────────────────────────

async function main() {
  const rissImg  = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/riss.png')));
  const robotImg = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/robot.png')));

  const dir = path.join(__dirname,'../public/manga/lantern');
  fs.mkdirSync(dir, { recursive: true });

  const panels = [
    await panel1(rissImg, robotImg),
    await panel2(rissImg, robotImg),
    await panel3(rissImg, robotImg),
    await panel4(rissImg, robotImg),
  ];

  panels.forEach((canvas, i) => {
    const out = path.join(dir, `panel-0${i+1}.png`);
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    console.log(`✅ lantern/panel-0${i+1}.png`);
  });

  console.log('\n🎉 完了！');
}
main().catch(console.error);
