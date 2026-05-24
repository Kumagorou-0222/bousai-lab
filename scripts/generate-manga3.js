'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 600, H = 750;

// ── ユーティリティ ──────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function speechBubble(ctx, x, y, w, h, tailSide, fill, border) {
  const r = 22, tw = 28, th = 34;
  // 本体
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  // テール
  ctx.save(); ctx.beginPath();
  if (tailSide === 'left') {
    ctx.moveTo(x + 2, y + h / 2 - tw / 2);
    ctx.lineTo(x - th, y + h / 2);
    ctx.lineTo(x + 2, y + h / 2 + tw / 2);
  } else {
    ctx.moveTo(x + w - 2, y + h / 2 - tw / 2);
    ctx.lineTo(x + w + th, y + h / 2);
    ctx.lineTo(x + w - 2, y + h / 2 + tw / 2);
  }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  // 上から塗りつぶして継ぎ目を消す
  ctx.beginPath();
  if (tailSide === 'left') {
    ctx.moveTo(x + 3, y + h / 2 - tw / 2 + 2);
    ctx.lineTo(x + 3, y + h / 2 + tw / 2 - 2);
  } else {
    ctx.moveTo(x + w - 3, y + h / 2 - tw / 2 + 2);
    ctx.lineTo(x + w - 3, y + h / 2 + tw / 2 - 2);
  }
  ctx.strokeStyle = fill; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
}

function drawWrappedText(ctx, text, cx, cy, lineH) {
  const lines = text.split('\n');
  const startY = cy - ((lines.length - 1) * lineH) / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, cx, startY + i * lineH));
}

function drawBadge(ctx, num, bg1, bg2) {
  const bx = W - 58, by = 8, br = 24;
  const grad = ctx.createLinearGradient(bx, by, bx + br * 2, by + br * 2);
  grad.addColorStop(0, bg1); grad.addColorStop(1, bg2);
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10;
  ctx.fillStyle = grad; ctx.beginPath();
  ctx.arc(bx + br, by + br, br, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'white'; ctx.font = 'bold 28px "Yu Gothic"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(num), bx + br, by + br);
}

// 情報ラベル（パネル右下）
function drawInfoLabel(ctx, text, bgColor, textColor) {
  const lh = 34, lw = ctx.measureText(text).width + 32;
  const lx = W - lw - 12, ly = H * 0.82 - lh - 10;
  ctx.fillStyle = bgColor;
  roundRect(ctx, lx, ly, lw, lh, 8); ctx.fill();
  ctx.fillStyle = textColor; ctx.font = 'bold 16px "Yu Gothic"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, lx + lw / 2, ly + lh / 2);
}

// 太陽
function drawSun(ctx, cx, cy, r) {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#FFDD44'; ctx.lineWidth = 3; ctx.globalAlpha = 0.6;
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (r + 6), cy + Math.sin(angle) * (r + 6));
    ctx.lineTo(cx + Math.cos(angle) * (r + 24), cy + Math.sin(angle) * (r + 24));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// 警告三角
function drawWarningTriangle(ctx, cx, cy, size, fillColor, borderColor) {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = borderColor; ctx.lineWidth = 5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.6);
  ctx.lineTo(cx + size * 0.55, cy + size * 0.4);
  ctx.lineTo(cx - size * 0.55, cy + size * 0.4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = borderColor; ctx.font = `bold ${size * 0.55}px "Yu Gothic"`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('!', cx, cy + size * 0.1);
}

// シンプルな建物（マンション正面）
function drawApartment(ctx, x, y, w, h, rows, cols, wallColor, windowColor) {
  ctx.fillStyle = wallColor; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = darken(wallColor, 30); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  // 屋上バンド
  ctx.fillStyle = darken(wallColor, 20); ctx.fillRect(x, y, w, 18);
  // 窓
  const winW = (w - 20) / cols - 8, winH = (h - 30) / rows - 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + 14 + c * (winW + 8);
      const wy = y + 24 + r * (winH + 10);
      ctx.fillStyle = windowColor; ctx.fillRect(wx, wy, winW, winH);
      ctx.strokeStyle = darken(windowColor, 40); ctx.lineWidth = 1.2;
      ctx.strokeRect(wx, wy, winW, winH);
    }
  }
  // エントランス
  const dx = x + (w - 36) / 2, dy = y + h - 52;
  ctx.fillStyle = '#8B6040'; ctx.fillRect(dx, dy, 36, 52);
  ctx.strokeStyle = '#6A4428'; ctx.lineWidth = 2; ctx.strokeRect(dx, dy, 36, 52);
}

function darken(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - amt), g = Math.max(0, ((n >> 8) & 0xFF) - amt), b = Math.max(0, (n & 0xFF) - amt);
  return `rgb(${r},${g},${b})`;
}

// ウイルス粒子
function drawVirus(ctx, cx, cy, r, fillCol, spikes, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = fillCol;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const len = r * 0.45 + (i % 2) * r * 0.15;
    const x2 = cx + Math.cos(angle) * (r + len);
    const y2 = cy + Math.sin(angle) * (r + len);
    ctx.fillStyle = fillCol;
    ctx.beginPath(); ctx.arc(x2, y2, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = fillCol; ctx.lineWidth = r * 0.12;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.lineTo(x2, y2); ctx.stroke();
  }
  ctx.restore();
}

// シンプルな人シルエット
function drawPersonSilhouette(ctx, cx, cy, size, color, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy - size * 0.55, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(cx - size * 0.15, cy - size * 0.34, size * 0.3, size * 0.32);
  ctx.fillRect(cx - size * 0.15, cy - size * 0.02, size * 0.12, size * 0.28);
  ctx.fillRect(cx + size * 0.03, cy - size * 0.02, size * 0.12, size * 0.28);
  ctx.restore();
}

// 走っている人（リュック付き）
function drawRunner(ctx, cx, cy, size, color, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = '#F0C0A0';
  ctx.beginPath(); ctx.arc(cx, cy - size * 0.55, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.1, cy - size * 0.33);
  ctx.lineTo(cx + size * 0.18, cy - size * 0.33);
  ctx.lineTo(cx + size * 0.22, cy + 0.02 * size);
  ctx.lineTo(cx - size * 0.06, cy + 0.02 * size);
  ctx.closePath(); ctx.fill();
  // リュック
  ctx.fillStyle = '#15803D'; ctx.fillRect(cx + size * 0.13, cy - size * 0.33, size * 0.15, size * 0.25);
  // 脚
  ctx.fillStyle = '#374151';
  ctx.fillRect(cx - size * 0.12, cy + 0.02 * size, size * 0.11, size * 0.28);
  ctx.save(); ctx.translate(cx + size * 0.1, cy + 0.02 * size); ctx.rotate(0.45);
  ctx.fillRect(0, 0, size * 0.11, size * 0.28); ctx.restore();
  // 腕
  ctx.strokeStyle = color; ctx.lineWidth = size * 0.08; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy - size * 0.25); ctx.lineTo(cx - size * 0.22, cy - size * 0.05); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + size * 0.15, cy - size * 0.25); ctx.lineTo(cx + size * 0.3, cy - size * 0.42); ctx.stroke();
  ctx.restore();
}

// 雨
function drawRain(ctx, alpha, x0, y0, w, h) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = '#88BBDD'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 30; i++) {
    const rx = x0 + ((i * 41) % w);
    const ry = y0 + ((i * 63) % h);
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 14, ry + 55); ctx.stroke();
  }
  ctx.restore();
}

// チェックマーク（太）
function drawCheck(ctx, cx, cy, size, color) {
  ctx.strokeStyle = color; ctx.lineWidth = size * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = color + '55'; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.38, cy + size * 0.05);
  ctx.lineTo(cx - size * 0.05, cy + size * 0.38);
  ctx.lineTo(cx + size * 0.42, cy - size * 0.32);
  ctx.stroke(); ctx.shadowBlur = 0;
}

// ── メイン描画エンジン ──────────────────────────────────
async function drawPanel({ charImg, charSide, charName, panelNum, numBg1, numBg2,
  bg1, bg2, extraDraw, bubbleFill, bubbleBorder, textColor, msg, infoLabel, infoLabelBg, infoLabelText }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
  bgGrad.addColorStop(0, bg1); bgGrad.addColorStop(1, bg2);
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  if (extraDraw) extraDraw(ctx);

  // レイアウト
  const margin = 22, charSize = 260, gap = 16;
  const bubbleW = W - charSize - margin * 2 - gap;
  const bubbleH = 230;
  const contentY = (H - charSize) / 2 + 8;
  const bubbleY = (H - bubbleH) / 2;

  let charX, bubbleX, tailSide;
  if (charSide === 'left') {
    charX = margin; bubbleX = charX + charSize + gap; tailSide = 'left';
  } else {
    bubbleX = margin; charX = bubbleX + bubbleW + gap; tailSide = 'right';
  }

  // キャラ影＋描画
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.22)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 12;
  ctx.drawImage(charImg, charX, contentY, charSize, charSize); ctx.restore();

  // 吹き出し
  speechBubble(ctx, bubbleX, bubbleY, bubbleW, bubbleH, tailSide, bubbleFill, bubbleBorder);

  // テキスト（最大2行想定、フォント大きめ）
  const chCount = msg.replace(/\n/g, '').length;
  const fontSize = chCount > 18 ? 27 : 32;
  ctx.font = `bold ${fontSize}px "Yu Gothic"`;
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  drawWrappedText(ctx, msg, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2, fontSize * 1.65);

  // キャラ名
  ctx.font = 'bold 17px "Yu Gothic"';
  const nm = ctx.measureText(charName);
  const nbW = nm.width + 22, nbH = 28;
  const nbX = charX + (charSize - nbW) / 2, nbY = contentY + charSize + 8;
  ctx.fillStyle = bubbleBorder + '44'; roundRect(ctx, nbX, nbY, nbW, nbH, 14); ctx.fill();
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(charName, nbX + nbW / 2, nbY + nbH / 2);

  // 情報ラベル
  if (infoLabel) {
    ctx.font = 'bold 16px "Yu Gothic"';
    drawInfoLabel(ctx, infoLabel, infoLabelBg || '#1E3A8A', infoLabelText || 'white');
  }

  drawBadge(ctx, panelNum, numBg1, numBg2);

  ctx.strokeStyle = bubbleBorder; ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  return canvas;
}

const RISS  = { numBg1: '#FF8C00', numBg2: '#FFD000', bubbleFill: '#FFFEF0', bubbleBorder: '#F59E0B', textColor: '#78350F', name: '防災リス' };
const ROBOT = { numBg1: '#1E3A8A', numBg2: '#06B6D4', bubbleFill: '#F0F9FF', bubbleBorder: '#3B82F6', textColor: '#1E40AF', name: 'レスQロボ' };

// ══════════════════════════════════════════════════════════
const ARTICLES = [

  // ── 避難のタイミング ─────────────────────────────────
  {
    slug: 'evacuation-timing',
    panels: [
      // 1: リス 疑問・不安
      {
        char: RISS, charSide: 'left',
        bg1: '#FFFBF0', bg2: '#FFF0C8',
        msg: '警戒レベル4が\n出た…まだ\n大丈夫かな？',
        extraDraw(ctx) {
          // 右半分：室内＋TV警報
          ctx.fillStyle = '#FDF5E0'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 窓（嵐）
          ctx.fillStyle = '#607090'; ctx.fillRect(W * 0.52, 40, 140, 160);
          ctx.strokeStyle = '#404860'; ctx.lineWidth = 5; ctx.strokeRect(W * 0.52, 40, 140, 160);
          ctx.strokeStyle = '#404860'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W * 0.59, 40); ctx.lineTo(W * 0.59, 200); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.52, 120); ctx.lineTo(W * 0.66, 120); ctx.stroke();
          drawRain(ctx, 0.6, W * 0.53, 45, 120, 150);
          // TV
          ctx.fillStyle = '#111'; ctx.fillRect(W * 0.52, H * 0.46, 155, 125);
          ctx.fillStyle = '#CC0000'; ctx.fillRect(W * 0.52 + 4, H * 0.46 + 4, 147, 90);
          ctx.fillStyle = '#FF4444'; ctx.fillRect(W * 0.52 + 4, H * 0.46 + 4, 147, 24);
          ctx.fillStyle = 'white'; ctx.font = 'bold 14px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('緊急警報', W * 0.589, H * 0.46 + 20);
          ctx.font = 'bold 22px "Yu Gothic"'; ctx.fillText('避難指示', W * 0.589, H * 0.46 + 54);
          ctx.font = 'bold 15px "Yu Gothic"'; ctx.fillText('警戒レベル４', W * 0.589, H * 0.46 + 76);
          ctx.font = '12px "Yu Gothic"'; ctx.fillStyle = '#FFAAAA';
          ctx.fillText('ただちに避難を', W * 0.589, H * 0.46 + 96);
          ctx.fillStyle = '#222'; ctx.fillRect(W * 0.57, H * 0.46 + 125, 26, 12);
          ctx.fillRect(W * 0.558, H * 0.46 + 137, 48, 5);
          // 床
          ctx.fillStyle = '#3A2810'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          ctx.fillStyle = '#4A3818'; ctx.fillRect(0, H * 0.82, W, 5);
        },
      },
      // 2: ロボ 結論（レベル4=即避難）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FFF0F0', bg2: '#FFE0E0',
        msg: 'ダメ！レベル4は\n即避難だよ。\n迷うな！',
        infoLabel: 'レベル4：避難指示', infoLabelBg: '#DC2626', infoLabelText: 'white',
        extraDraw(ctx) {
          ctx.fillStyle = '#FFEAEA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 大きな警告三角
          drawWarningTriangle(ctx, W * 0.22, H * 0.38, 140, '#FFDD00', '#DC2626');
          // 集中線
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.18;
          for (let i = 0; i < 22; i++) {
            const angle = (i / 22) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(W * 0.22 + Math.cos(angle) * 75, H * 0.38 + Math.sin(angle) * 75);
            ctx.lineTo(W * 0.22 + Math.cos(angle) * 220, H * 0.38 + Math.sin(angle) * 220);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 「即避難！」
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 34px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('即 避 難 ！', W * 0.24, H * 0.65);
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(20, H * 0.7); ctx.lineTo(W * 0.46, H * 0.7); ctx.stroke();
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
        },
      },
      // 3: ロボ 理由（早め=成功）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#182030', bg2: '#0D1520',
        msg: '「早すぎた」は\n正解！遅れること\nが最大のリスク！',
        extraDraw(ctx) {
          ctx.fillStyle = '#1A2838'; ctx.fillRect(0, 0, W * 0.5, H);
          // 空＋雲
          ctx.fillStyle = '#0A1220'; ctx.fillRect(0, 0, W * 0.5, H * 0.32);
          ctx.fillStyle = '#1A2535';
          [[55, 35, 48, 22],[115, 25, 55, 26],[180, 32, 42, 20]].forEach(([x, y, rx, ry]) => {
            ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
          });
          // 雨
          drawRain(ctx, 0.55, 0, 0, W * 0.5, H);
          // 道路
          ctx.fillStyle = '#252525'; ctx.fillRect(0, H * 0.7, W * 0.5, H * 0.3);
          ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, H * 0.7, W * 0.5, 4);
          // 水たまり
          ctx.fillStyle = 'rgba(70,110,160,0.3)';
          ctx.beginPath(); ctx.ellipse(60, H * 0.78, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(185, H * 0.83, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
          // 走る人
          drawRunner(ctx, 120, H * 0.68, 62, '#2563EB', 1);
          // モーションライン
          ctx.strokeStyle = '#2A3A4A'; ctx.lineWidth = 2; ctx.globalAlpha = 0.7; ctx.setLineDash([12, 9]);
          [H * 0.56, H * 0.62, H * 0.68].forEach(ly => {
            ctx.beginPath(); ctx.moveTo(20, ly); ctx.lineTo(90, ly); ctx.stroke();
          });
          ctx.setLineDash([]); ctx.globalAlpha = 1;
          // 緑ラベル
          ctx.fillStyle = '#0A2A18'; ctx.fillRect(8, 25, 210, 40);
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2; ctx.strokeRect(8, 25, 210, 40);
          ctx.fillStyle = '#4ADE80'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('早め避難 ＝ 正解！', 113, 49);
        },
      },
      // 4: リス 安心・行動
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: 'わかった！\n迷ったら\nすぐ逃げる！',
        extraDraw(ctx) {
          // 空＋草
          const sky = ctx.createLinearGradient(W*0.44, 0, W*0.44, H*0.55);
          sky.addColorStop(0, '#7AC8F0'); sky.addColorStop(1, '#C8ECFF');
          ctx.fillStyle = sky; ctx.fillRect(W*0.44, 0, W*0.56, H*0.55);
          ctx.fillStyle = '#58C030'; ctx.fillRect(W*0.44, H*0.78, W*0.56, H*0.22);
          ctx.fillStyle = '#777'; ctx.fillRect(W*0.44, H*0.7, W*0.56, H*0.08);
          drawSun(ctx, W * 0.9, 52, 32);
          // 避難所建物
          drawApartment(ctx, W*0.5, H*0.12, 172, 300, 3, 2, '#D8E4F0', '#A8D0E8');
          // 避難所サイン
          ctx.fillStyle = '#15803D'; ctx.fillRect(W*0.5, H*0.63, 172, 42);
          ctx.fillStyle = 'white'; ctx.font = 'bold 26px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('避 難 所', W*0.585, H*0.658);
          // チェック
          drawCheck(ctx, W*0.68, H*0.08, 55, '#16A34A');
        },
      },
    ],
  },

  // ── 避難所の感染症対策 ────────────────────────────────
  {
    slug: 'evacuation-shelter-infection',
    panels: [
      // 1: リス 疑問・不安
      {
        char: RISS, charSide: 'left',
        bg1: '#F0EAFF', bg2: '#E0D0FF',
        msg: '避難所って\n病気がうつりやすい\nって本当？',
        extraDraw(ctx) {
          ctx.fillStyle = '#E8E0FA'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 体育館天井
          ctx.fillStyle = '#1A1830'; ctx.fillRect(W*0.44, 0, W*0.56, H*0.14);
          ctx.fillStyle = 'rgba(255,255,220,0.7)';
          [W*0.56, W*0.74, W*0.9].forEach(x => ctx.fillRect(x-22, 15, 44, 10));
          // 床
          ctx.fillStyle = '#C8924A'; ctx.fillRect(W*0.44, H*0.64, W*0.56, H*0.36);
          ctx.strokeStyle = '#A87038'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W*0.44, H*0.82); ctx.lineTo(W, H*0.82); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.7, H*0.64); ctx.lineTo(W*0.7, H); ctx.stroke();
          // 壁
          ctx.fillStyle = '#CCC8E8'; ctx.fillRect(W*0.44, H*0.14, W*0.56, H*0.5);
          // 密集した人々
          const pplPos = [
            [W*0.52, H*0.53],[W*0.61, H*0.51],[W*0.71, H*0.53],[W*0.81, H*0.51],[W*0.91, H*0.52],
            [W*0.56, H*0.64],[W*0.66, H*0.62],[W*0.77, H*0.65],[W*0.88, H*0.63],
          ];
          pplPos.forEach(([px, py]) => drawPersonSilhouette(ctx, px, py, 34, '#5858A0', 0.75));
          // 浮遊する飛沫
          ctx.fillStyle = '#CC66FF'; ctx.globalAlpha = 0.5;
          [[W*0.62,H*0.46],[W*0.74,H*0.44],[W*0.83,H*0.47],[W*0.67,H*0.48]].forEach(([dx,dy]) => {
            ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(dx+14, dy+6, 3.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(dx-9, dy+9, 3, 0, Math.PI*2); ctx.fill();
          });
          ctx.globalAlpha = 1;
        },
      },
      // 2: ロボ 結論（ウイルス危険）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#180828', bg2: '#0F0518',
        msg: '本当だよ。インフル・\nノロ・COVID-19が\n集団感染しやすい。',
        extraDraw(ctx) {
          ctx.fillStyle = '#1E0A2A'; ctx.fillRect(0, 0, W*0.5, H);
          // メインウイルス（大）
          drawVirus(ctx, W*0.24, H*0.4, 72, '#9922BB', 10, 0.85);
          // 小ウイルス
          drawVirus(ctx, W*0.07, H*0.2, 28, '#771AA0', 8, 0.65);
          drawVirus(ctx, W*0.42, H*0.26, 22, '#881ABB', 8, 0.6);
          drawVirus(ctx, W*0.08, H*0.62, 18, '#661898', 7, 0.55);
          drawVirus(ctx, W*0.4, H*0.65, 16, '#771AAA', 7, 0.5);
          // 集中線
          ctx.strokeStyle = '#CC44FF'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.18;
          for (let i = 0; i < 22; i++) {
            const angle = (i/22) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(W*0.24 + Math.cos(angle)*78, H*0.4 + Math.sin(angle)*78);
            ctx.lineTo(W*0.24 + Math.cos(angle)*200, H*0.4 + Math.sin(angle)*200);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 病名リスト
          ['⚠ インフルエンザ', '⚠ ノロウイルス', '⚠ COVID-19'].forEach((d, i) => {
            ctx.fillStyle = '#FF88FF'; ctx.font = 'bold 17px "Yu Gothic"';
            ctx.textAlign = 'left'; ctx.fillText(d, 14, H*0.73 + i*32);
          });
          ctx.fillStyle = '#1E0828'; ctx.fillRect(0, H*0.82, W*0.5, H*0.18);
        },
      },
      // 3: ロボ 理由（予防3箇条）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '手洗い・マスク・\n換気のよい\n場所選びが大事！',
        extraDraw(ctx) {
          ctx.fillStyle = '#E5F0FC'; ctx.fillRect(0, 0, W*0.5, H);
          // 3つのアイコンエリア
          const items = [
            { y: 75,  col: '#2563EB', bg: '#DBEAFE', label: '手洗い・消毒' },
            { y: 278, col: '#16A34A', bg: '#DCFCE7', label: 'マスク着用' },
            { y: 480, col: '#0891B2', bg: '#E0F7FA', label: '換気・場所選び' },
          ];
          items.forEach((item, idx) => {
            roundRect(ctx, 10, item.y, 228, 170, 14);
            ctx.fillStyle = item.bg; ctx.fill();
            ctx.strokeStyle = item.col; ctx.lineWidth = 2.5; ctx.stroke();
            // アイコン描画
            const ic = { cx: 72, cy: item.y + 85 };
            if (idx === 0) {
              // 手洗い：手の形＋水滴
              ctx.fillStyle = '#F0C8A0'; ctx.strokeStyle = '#C8906A'; ctx.lineWidth = 2;
              ctx.fillRect(ic.cx - 18, ic.cy, 36, 22); ctx.strokeRect(ic.cx - 18, ic.cy, 36, 22);
              for (let f = 0; f < 4; f++) {
                ctx.fillRect(ic.cx - 16 + f*10, ic.cy - 30, 8, 34); ctx.strokeRect(ic.cx - 16 + f*10, ic.cy - 30, 8, 34);
              }
              ctx.fillStyle = '#60A8F0'; ctx.globalAlpha = 0.85;
              [[ic.cx-10,ic.cy-44],[ic.cx+4,ic.cy-50],[ic.cx+16,ic.cy-42]].forEach(([wx,wy]) => {
                ctx.beginPath(); ctx.arc(wx, wy, 6, 0, Math.PI*2); ctx.fill();
              });
              ctx.globalAlpha = 1;
            } else if (idx === 1) {
              // マスク：楕円形
              ctx.fillStyle = '#E8F4EE'; ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 3.5;
              ctx.beginPath(); ctx.ellipse(ic.cx, ic.cy, 42, 24, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
              ctx.strokeStyle = '#A8D8B8'; ctx.lineWidth = 1.5;
              [-9, 0, 9].forEach(oy => {
                ctx.beginPath(); ctx.moveTo(ic.cx-33, ic.cy+oy); ctx.lineTo(ic.cx+33, ic.cy+oy); ctx.stroke();
              });
              ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2.5;
              [[-42,-10],[-42,10],[42,-10],[42,10]].forEach(([ox,oy]) => {
                const ex = ic.cx + ox + (ox<0 ? -16 : 16);
                ctx.beginPath(); ctx.moveTo(ic.cx+ox, ic.cy+oy); ctx.lineTo(ex, ic.cy+oy*2); ctx.stroke();
              });
            } else {
              // 換気：窓＋風
              ctx.fillStyle = '#B8D8E8'; ctx.strokeStyle = '#0891B2'; ctx.lineWidth = 3;
              ctx.fillRect(ic.cx-32, ic.cy-30, 64, 58); ctx.strokeRect(ic.cx-32, ic.cy-30, 64, 58);
              ctx.beginPath(); ctx.moveTo(ic.cx, ic.cy-30); ctx.lineTo(ic.cx, ic.cy+28); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(ic.cx-32, ic.cy+1); ctx.lineTo(ic.cx+32, ic.cy+1); ctx.stroke();
              ctx.strokeStyle = '#22C8E8'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.75; ctx.setLineDash([5,4]);
              [[-12,-55],[0,-60],[14,-52]].forEach(([ox,oy]) => {
                ctx.beginPath(); ctx.moveTo(ic.cx+ox-12, ic.cy+oy-12); ctx.lineTo(ic.cx+ox+10, ic.cy+oy); ctx.stroke();
              });
              ctx.setLineDash([]); ctx.globalAlpha = 1;
            }
            ctx.fillStyle = item.col; ctx.font = 'bold 17px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText(item.label, 160, item.y + 88);
          });
          ctx.fillStyle = '#C8E0F8'; ctx.fillRect(0, H*0.82, W*0.5, H*0.18);
        },
      },
      // 4: リス 安心・行動（在宅避難）
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '建物が安全なら\n在宅避難が\n一番安心だね！',
        extraDraw(ctx) {
          const sky = ctx.createLinearGradient(W*0.44, 0, W*0.44, H*0.55);
          sky.addColorStop(0, '#7ACBE8'); sky.addColorStop(1, '#C8EEFF');
          ctx.fillStyle = sky; ctx.fillRect(W*0.44, 0, W*0.56, H*0.55);
          ctx.fillStyle = '#58C030'; ctx.fillRect(W*0.44, H*0.78, W*0.56, H*0.22);
          ctx.fillStyle = '#666'; ctx.fillRect(W*0.44, H*0.7, W*0.56, H*0.08);
          drawSun(ctx, W*0.9, 52, 30);
          drawApartment(ctx, W*0.52, H*0.15, 168, 295, 3, 2, '#D8E8F0', '#A8D4EC');
          drawCheck(ctx, W*0.68, H*0.1, 55, '#16A34A');
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  // ── 在宅避難 ──────────────────────────────────────────
  {
    slug: 'earthquake-zaitaku',
    panels: [
      // 1: リス 疑問・不安（地震）
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF5E0', bg2: '#FFE8B0',
        msg: '地震！\n避難所に行かないと\nいけないの？',
        extraDraw(ctx) {
          ctx.fillStyle = '#FFF0C8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 揺れエフェクト（対角線）
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.35;
          for (let i = 0; i < 10; i++) {
            const yy = 50 + i * 72;
            ctx.beginPath(); ctx.moveTo(W*0.44, yy); ctx.lineTo(W*0.47, yy+22); ctx.lineTo(W*0.51, yy-12); ctx.lineTo(W, yy+8); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // ヒビ割れ壁
          ctx.strokeStyle = '#D97706'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.moveTo(W*0.56, 30); ctx.lineTo(W*0.59, 110); ctx.lineTo(W*0.55, 200); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.8, 50); ctx.lineTo(W*0.77, 140); ctx.lineTo(W*0.81, 210); ctx.stroke();
          ctx.globalAlpha = 1;
          // 建物シルエット（傾き）
          ctx.save(); ctx.translate(W*0.72, H*0.38); ctx.rotate(0.1);
          ctx.fillStyle = '#E0C880';
          ctx.fillRect(-25, -80, 50, 160);
          ctx.strokeStyle = '#C8A840'; ctx.lineWidth = 2; ctx.strokeRect(-25, -80, 50, 160);
          ctx.restore();
          // 落下物
          ctx.save(); ctx.translate(W*0.63, H*0.52); ctx.rotate(-0.3);
          ctx.fillStyle = '#4060A0'; ctx.fillRect(-16, -8, 32, 16); ctx.restore();
          // ！？
          ctx.font = 'bold 60px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillStyle = '#DC2626'; ctx.globalAlpha = 0.8;
          ctx.fillText('!?', W*0.87, H*0.28);
          ctx.globalAlpha = 1;
          // 地震放射線
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.15;
          for (let i = 0; i < 18; i++) {
            const angle = (i/18)*Math.PI*2;
            ctx.beginPath();
            ctx.moveTo(W*0.72 + Math.cos(angle)*28, H*0.38 + Math.sin(angle)*28);
            ctx.lineTo(W*0.72 + Math.cos(angle)*160, H*0.38 + Math.sin(angle)*160);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#2A1808'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      // 2: ロボ 結論（建物安全=在宅避難）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '建物が安全なら\n在宅避難が\n最善だよ。',
        infoLabel: 'RC造・新耐震基準', infoLabelBg: '#15803D', infoLabelText: 'white',
        extraDraw(ctx) {
          const sky = ctx.createLinearGradient(0, 0, 0, H*0.65);
          sky.addColorStop(0, '#6ABDE8'); sky.addColorStop(1, '#B8E0F8');
          ctx.fillStyle = sky; ctx.fillRect(0, 0, W*0.5, H*0.65);
          ctx.fillStyle = '#68C840'; ctx.fillRect(0, H*0.78, W*0.5, H*0.22);
          ctx.fillStyle = '#888'; ctx.fillRect(0, H*0.65, W*0.5, H*0.13);
          // RC造マンション（大きく）
          drawApartment(ctx, 14, H*0.1, 215, H*0.56, 5, 3, '#C8D4E4', '#90C8E8');
          // 屋上強調
          ctx.fillStyle = '#A0ACC8'; ctx.fillRect(8, H*0.1, 228, 20);
          // 耐震ラベル
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(14, H*0.68, 215, 36);
          ctx.fillStyle = 'white'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('✓ RC造・新耐震基準', 121, H*0.68 + 24);
          // チェック
          drawCheck(ctx, 121, H*0.07, 55, '#16A34A');
          ctx.fillStyle = '#C0D4E8'; ctx.fillRect(0, H*0.82, W*0.5, H*0.18);
        },
      },
      // 3: ロボ 理由（7日分備蓄）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FFFBF0', bg2: '#FFF5DC',
        msg: '7日分の備蓄と\n簡易トイレがあれば\n自宅が最強！',
        extraDraw(ctx) {
          ctx.fillStyle = '#F8F0E0'; ctx.fillRect(0, 0, W*0.5, H);
          // 棚支柱
          ctx.fillStyle = '#7A4E2C';
          ctx.fillRect(10, H*0.1, 14, H*0.72);
          ctx.fillRect(W*0.46+10, H*0.1, 14, H*0.72);
          // 棚板（3段）
          const shelves = [H*0.2, H*0.44, H*0.64];
          shelves.forEach(sy => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(10, sy, W*0.46, 13);
            ctx.strokeStyle = '#6A4228'; ctx.lineWidth = 1; ctx.strokeRect(10, sy, W*0.46, 13);
          });
          // 1段目：水ボトル×4
          for (let i = 0; i < 4; i++) {
            const bx = 24 + i * 55, by = shelves[0] - 68;
            ctx.fillStyle = '#B8D8F0'; ctx.fillRect(bx, by, 36, 60);
            ctx.strokeStyle = '#7AB0D0'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 36, 60);
            ctx.fillStyle = '#2563EB'; ctx.fillRect(bx+7, by-11, 22, 13);
            ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 14px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText('水', bx+18, by+38);
          }
          // 2段目：缶詰×4
          for (let i = 0; i < 4; i++) {
            const bx = 24 + i * 55, by = shelves[1] - 60;
            ctx.fillStyle = '#E8C878'; ctx.fillRect(bx, by, 36, 52);
            ctx.strokeStyle = '#C8A050'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 36, 52);
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(bx+6, by, 24, 10);
            ctx.fillStyle = '#7A4A1A'; ctx.font = 'bold 12px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText('缶詰', bx+18, by+35);
          }
          // 3段目：懐中電灯・トイレ・薬・防災袋
          [
            { col: '#334', label: '懐中\n電灯', bx: 24 },
            { col: '#E8D0A0', label: 'トイレ', bx: 79 },
            { col: '#D0E8A0', label: '薬', bx: 134 },
            { col: '#A8C8E8', label: '防災\n袋', bx: 189 },
          ].forEach(it => {
            ctx.fillStyle = it.col; ctx.fillRect(it.bx, shelves[2]-55, 42, 48);
            ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5; ctx.strokeRect(it.bx, shelves[2]-55, 42, 48);
            ctx.fillStyle = '#333'; ctx.font = 'bold 13px "Yu Gothic"';
            ctx.textAlign = 'center';
            it.label.split('\n').forEach((ln, i) => ctx.fillText(ln, it.bx+21, shelves[2]-38 + i*16));
          });
          // 7日分バッジ
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(10, H*0.07, 208, 50);
          ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2.5; ctx.strokeRect(10, H*0.07, 208, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 26px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('７日分 備蓄', 114, H*0.07 + 33);
          ctx.fillStyle = '#EDE0C0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      // 4: リス 安心・行動
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '在宅避難の\n準備を今すぐ\nしておこう！',
        extraDraw(ctx) {
          const sky = ctx.createLinearGradient(W*0.44, 0, W*0.44, H*0.55);
          sky.addColorStop(0, '#7ACEE8'); sky.addColorStop(1, '#C8EEFF');
          ctx.fillStyle = sky; ctx.fillRect(W*0.44, 0, W*0.56, H*0.55);
          ctx.fillStyle = '#58C030'; ctx.fillRect(W*0.44, H*0.76, W*0.56, H*0.24);
          drawSun(ctx, W*0.9, 50, 30);
          // 家（明るい）
          const hx = W*0.52, hy = H*0.18, hw = 170, hh = 285;
          ctx.fillStyle = '#D4E4F0'; ctx.fillRect(hx, hy, hw, hh);
          ctx.strokeStyle = '#9AAAC8'; ctx.lineWidth = 3; ctx.strokeRect(hx, hy, hw, hh);
          // 屋根
          ctx.fillStyle = '#7888AA';
          ctx.beginPath(); ctx.moveTo(hx-10, hy); ctx.lineTo(hx+hw/2, hy-70); ctx.lineTo(hx+hw+10, hy); ctx.closePath();
          ctx.fill(); ctx.strokeStyle = '#5870A0'; ctx.lineWidth = 2.5; ctx.stroke();
          // 窓（2×2、カーテン付き）
          [[hx+20, hy+18], [hx+98, hy+18], [hx+20, hy+100], [hx+98, hy+100]].forEach(([wx,wy]) => {
            ctx.fillStyle = '#A8D4EC'; ctx.fillRect(wx, wy, 52, 44);
            ctx.strokeStyle = '#80B4CC'; ctx.lineWidth = 1.5; ctx.strokeRect(wx, wy, 52, 44);
            ctx.fillStyle = 'rgba(255,200,80,0.22)'; ctx.fillRect(wx, wy, 24, 44);
          });
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(hx+67, hy+200, 46, 70);
          ctx.strokeStyle = '#6A4428'; ctx.lineWidth = 2; ctx.strokeRect(hx+67, hy+200, 46, 70);
          ctx.fillStyle = '#D4A857'; ctx.beginPath(); ctx.arc(hx+108, hy+237, 4, 0, Math.PI*2); ctx.fill();
          // 家族3人
          [hx+38, hx+85, hx+132].forEach((px, i) => {
            drawPersonSilhouette(ctx, px, H*0.73, 28, ['#E85050','#4A90D9','#50C850'][i], 0.9);
          });
          drawCheck(ctx, W*0.68, H*0.1, 55, '#16A34A');
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },
];

// ── 実行 ────────────────────────────────────────────────
async function main() {
  const rissImg  = await loadImage(fs.readFileSync(path.join(__dirname, '../public/img/riss.png')));
  const robotImg = await loadImage(fs.readFileSync(path.join(__dirname, '../public/img/robot.png')));

  for (const article of ARTICLES) {
    const dir = path.join(__dirname, `../public/manga/${article.slug}`);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < article.panels.length; i++) {
      const p = article.panels[i];
      const c = p.char;
      const canvas = await drawPanel({
        charImg:      c === RISS ? rissImg : robotImg,
        charSide:     p.charSide, charName: c.name,
        panelNum:     i + 1, numBg1: c.numBg1, numBg2: c.numBg2,
        bg1: p.bg1, bg2: p.bg2, extraDraw: p.extraDraw || null,
        bubbleFill: c.bubbleFill, bubbleBorder: c.bubbleBorder, textColor: c.textColor,
        msg: p.msg,
        infoLabel: p.infoLabel || null,
        infoLabelBg: p.infoLabelBg || null,
        infoLabelText: p.infoLabelText || null,
      });
      const outPath = path.join(dir, `panel-0${i + 1}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✅ ${article.slug}/panel-0${i + 1}.png`);
    }
  }
  console.log('\n🎉 完了！');
}
main().catch(console.error);
