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

function speechBubble(ctx, x, y, w, h, tailSide, fillColor, borderColor) {
  const r = 18, tw = 22, th = 28;
  roundRect(ctx, x, y, w, h, r);
  ctx.save(); ctx.beginPath();
  if (tailSide === 'left') {
    ctx.moveTo(x, y + h / 2 - tw / 2);
    ctx.lineTo(x - th, y + h / 2);
    ctx.lineTo(x, y + h / 2 + tw / 2);
  } else {
    ctx.moveTo(x + w, y + h / 2 - tw / 2);
    ctx.lineTo(x + w + th, y + h / 2);
    ctx.lineTo(x + w, y + h / 2 + tw / 2);
  }
  ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill(); ctx.restore();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor; ctx.fill();
  ctx.strokeStyle = borderColor; ctx.lineWidth = 3; ctx.stroke();
}

function drawText(ctx, text, cx, cy, lineH) {
  const lines = text.split('\n');
  const startY = cy - ((lines.length - 1) * lineH) / 2;
  lines.forEach((line, i) => ctx.fillText(line, cx, startY + i * lineH));
}

function drawBadge(ctx, num, bg1, bg2) {
  const bx = W - 56, by = 10, br = 22;
  const grad = ctx.createLinearGradient(bx, by, bx + br * 2, by + br * 2);
  grad.addColorStop(0, bg1); grad.addColorStop(1, bg2);
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8;
  ctx.fillStyle = grad; ctx.beginPath();
  ctx.arc(bx + br, by + br, br, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'white'; ctx.font = 'bold 26px "Yu Gothic"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(num), bx + br, by + br);
}

// シンプルな走っている人（頭・体・足）
function drawRunningPerson(ctx, cx, cy, size, bodyColor) {
  // 頭
  ctx.fillStyle = '#F0C8A0';
  ctx.beginPath(); ctx.arc(cx, cy - size * 0.55, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#C8906A'; ctx.lineWidth = 2; ctx.stroke();
  // 体（前傾）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.1, cy - size * 0.35);
  ctx.lineTo(cx + size * 0.18, cy - size * 0.35);
  ctx.lineTo(cx + size * 0.22, cy + size * 0.02);
  ctx.lineTo(cx - size * 0.06, cy + size * 0.02);
  ctx.closePath(); ctx.fill();
  // リュック
  ctx.fillStyle = '#15803D';
  ctx.fillRect(cx + size * 0.14, cy - size * 0.34, size * 0.16, size * 0.26);
  ctx.strokeStyle = '#0F5C2A'; ctx.lineWidth = 1.5; ctx.strokeRect(cx + size * 0.14, cy - size * 0.34, size * 0.16, size * 0.26);
  // 左脚（後ろ）
  ctx.fillStyle = '#1E40AF';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.06, cy + 0.02 * size);
  ctx.lineTo(cx + size * 0.04, cy + 0.02 * size);
  ctx.lineTo(cx - size * 0.02, cy + size * 0.28);
  ctx.lineTo(cx - size * 0.14, cy + size * 0.28);
  ctx.closePath(); ctx.fill();
  // 右脚（前、蹴り上げ）
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.04, cy + 0.02 * size);
  ctx.lineTo(cx + size * 0.14, cy + 0.02 * size);
  ctx.lineTo(cx + size * 0.32, cy + size * 0.22);
  ctx.lineTo(cx + size * 0.22, cy + size * 0.26);
  ctx.closePath(); ctx.fill();
  // 腕
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy - size * 0.28); ctx.lineTo(cx - size * 0.22, cy - size * 0.08); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + size * 0.15, cy - size * 0.28); ctx.lineTo(cx + size * 0.3, cy - size * 0.42); ctx.stroke();
}

// シンプルな立っている人
function drawPerson(ctx, cx, cy, size, bodyColor) {
  ctx.fillStyle = '#F0C8A0';
  ctx.beginPath(); ctx.arc(cx, cy - size * 0.5, size * 0.18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#C8906A'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(cx - size * 0.12, cy - size * 0.32, size * 0.24, size * 0.3);
  ctx.fillStyle = '#374151';
  ctx.fillRect(cx - size * 0.12, cy - size * 0.02, size * 0.1, size * 0.22);
  ctx.fillRect(cx + size * 0.02, cy - size * 0.02, size * 0.1, size * 0.22);
}

// チェックマーク
function drawCheck(ctx, cx, cy, size, color) {
  ctx.strokeStyle = color; ctx.lineWidth = size * 0.14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.38, cy + size * 0.05);
  ctx.lineTo(cx - size * 0.08, cy + size * 0.35);
  ctx.lineTo(cx + size * 0.42, cy - size * 0.35);
  ctx.stroke();
}

// 雨（斜め線）
function drawRain(ctx, alpha, count = 40) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#9BC8E8'; ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i++) {
    const x = ((i * 43) % (W + 60)) - 30;
    const y = ((i * 67) % H);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 70); ctx.stroke();
  }
  ctx.restore();
}

// 集中線（速度線）
function drawSpeedLines(ctx, cx, cy, count, minR, maxR, color, alpha) {
  ctx.save(); ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * minR, cy + Math.sin(angle) * minR);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.stroke();
  }
  ctx.restore();
}

// ── メイン描画エンジン ──────────────────────────────────
async function drawPanel({ charImg, charSide, charName, panelNum, numBg1, numBg2,
  bg1, bg2, extraDraw, bubbleFill, bubbleBorder, textColor, msg }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景グラデーション
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, bg1); bgGrad.addColorStop(1, bg2);
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  if (extraDraw) extraDraw(ctx);

  // レイアウト
  const margin = 24, charSize = 255, gap = 18;
  const bubbleW = W - charSize - margin * 2 - gap;
  const bubbleH = 220;
  const contentY = (H - charSize) / 2 + 10;
  const bubbleY = (H - bubbleH) / 2;

  let charX, bubbleX, tailSide;
  if (charSide === 'left') {
    charX = margin; bubbleX = charX + charSize + gap; tailSide = 'left';
  } else {
    bubbleX = margin; charX = bubbleX + bubbleW + gap; tailSide = 'right';
  }

  // キャラ影
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
  ctx.drawImage(charImg, charX, contentY, charSize, charSize); ctx.restore();

  // 吹き出し
  speechBubble(ctx, bubbleX, bubbleY, bubbleW, bubbleH, tailSide, bubbleFill, bubbleBorder);

  // テキスト
  const fontSize = msg.replace(/\n/g, '').length > 20 ? 26 : 30;
  ctx.font = `bold ${fontSize}px "Yu Gothic"`;
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  drawText(ctx, msg, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2, fontSize * 1.7);

  // キャラ名バッジ
  ctx.font = 'bold 17px "Yu Gothic"';
  const nm = ctx.measureText(charName);
  const nbW = nm.width + 22, nbH = 28;
  const nbX = charX + (charSize - nbW) / 2, nbY = contentY + charSize + 8;
  ctx.fillStyle = bubbleBorder + '33'; roundRect(ctx, nbX, nbY, nbW, nbH, 14); ctx.fill();
  ctx.fillStyle = textColor; ctx.textAlign = 'center';
  ctx.fillText(charName, nbX + nbW / 2, nbY + nbH / 2);

  drawBadge(ctx, panelNum, numBg1, numBg2);

  // 外枠
  ctx.strokeStyle = bubbleBorder; ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  return canvas;
}

const RISS  = { numBg1: '#FF8C00', numBg2: '#FFD000', bubbleFill: '#FFFEF0', bubbleBorder: '#F59E0B', textColor: '#78350F', name: '防災リス' };
const ROBOT = { numBg1: '#1E3A8A', numBg2: '#06B6D4', bubbleFill: '#F0F9FF', bubbleBorder: '#3B82F6', textColor: '#1E40AF', name: 'レスQロボ' };

// ── パネル定義 ───────────────────────────────────────────

const ARTICLES = [
  // ══════════════════════════════════════════════════════════
  // 避難のタイミング
  // ══════════════════════════════════════════════════════════
  {
    slug: 'evacuation-timing',
    panels: [
      // Panel 1: リス、TVで警報を見て不安
      {
        char: RISS, charSide: 'left',
        bg1: '#1A2535', bg2: '#0D1520',
        msg: '警戒レベル4が\n出た…まだ\n大丈夫かな？',
        extraDraw(ctx) {
          // 部屋の壁（右側）
          ctx.fillStyle = '#232F42'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 窓（雨）
          ctx.fillStyle = '#1E3850'; ctx.fillRect(W * 0.5, 35, 140, 165);
          ctx.strokeStyle = '#445566'; ctx.lineWidth = 5; ctx.strokeRect(W * 0.5, 35, 140, 165);
          ctx.strokeStyle = '#445566'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W * 0.57, 35); ctx.lineTo(W * 0.57, 200); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.5, 117); ctx.lineTo(W * 0.64, 117); ctx.stroke();
          // 雨（窓の外）
          ctx.strokeStyle = '#6AAFCC'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.65;
          for (let i = 0; i < 10; i++) {
            const rx = W * 0.51 + (i % 3) * 40 + 8;
            const ry = 48 + Math.floor(i / 3) * 45;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 9, ry + 35); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // テレビ（薄型）
          ctx.fillStyle = '#111118'; ctx.fillRect(W * 0.5, H * 0.46, 165, 130);
          ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.5, H * 0.46, 165, 130);
          // テレビ画面（赤い警報）
          ctx.fillStyle = '#BB0000'; ctx.fillRect(W * 0.5 + 5, H * 0.46 + 5, 155, 100);
          // 点滅ライン
          ctx.fillStyle = '#FF2222'; ctx.fillRect(W * 0.5 + 5, H * 0.46 + 5, 155, 22);
          ctx.fillStyle = 'white'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('緊急警報', W * 0.577, H * 0.46 + 20);
          ctx.font = 'bold 22px "Yu Gothic"';
          ctx.fillText('避難指示', W * 0.577, H * 0.46 + 52);
          ctx.font = 'bold 15px "Yu Gothic"';
          ctx.fillText('警戒レベル４', W * 0.577, H * 0.46 + 76);
          ctx.font = '12px "Yu Gothic"'; ctx.fillStyle = '#FFCCCC';
          ctx.fillText('ただちに避難してください', W * 0.577, H * 0.46 + 96);
          // TVスタンド
          ctx.fillStyle = '#222'; ctx.fillRect(W * 0.568, H * 0.46 + 130, 28, 14);
          ctx.fillRect(W * 0.556, H * 0.46 + 144, 50, 5);
          // 床
          ctx.fillStyle = '#2A1C10'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          ctx.fillStyle = '#3A2A18'; ctx.fillRect(0, H * 0.82, W, 4);
        },
      },
      // Panel 2: ロボ、警戒レベル一覧を示す
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FDFCF8', bg2: '#FFF5E0',
        msg: 'ダメ！レベル4は\n即避難だ。\n迷うな！',
        extraDraw(ctx) {
          ctx.fillStyle = '#F8F4EC'; ctx.fillRect(0, 0, W * 0.5, H);
          // 警戒レベル5段ボード
          const bars = [
            { n: 5, text: '緊急安全確保', color: '#6B21A8', y: 68,  bh: 65 },
            { n: 4, text: '避難指示 ★',    color: '#DC2626', y: 148, bh: 105, highlight: true },
            { n: 3, text: '高齢者等避難', color: '#EA580C', y: 268, bh: 65 },
            { n: 2, text: '大雨注意報',   color: '#D97706', y: 348, bh: 65 },
            { n: 1, text: '早期注意情報', color: '#16A34A', y: 428, bh: 65 },
          ];
          bars.forEach(b => {
            const bw = b.highlight ? 225 : 195;
            // 背景バー
            ctx.fillStyle = b.highlight ? b.color : b.color + '28';
            ctx.fillRect(12, b.y, bw, b.bh);
            if (b.highlight) {
              // 強調枠
              ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 4;
              ctx.strokeRect(10, b.y - 2, bw + 4, b.bh + 4);
              // 速度線（右から）
              ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.25;
              for (let i = 0; i < 6; i++) {
                const ly = b.y + 15 + i * 13;
                ctx.beginPath(); ctx.moveTo(bw + 12, ly); ctx.lineTo(bw + 60, ly); ctx.stroke();
              }
              ctx.globalAlpha = 1;
            }
            // テキスト
            ctx.fillStyle = b.highlight ? 'white' : b.color;
            ctx.font = `bold ${b.highlight ? 20 : 16}px "Yu Gothic"`;
            ctx.textAlign = 'left';
            ctx.fillText(`Lv${b.n}：${b.text}`, 20, b.y + b.bh / 2 + 7);
          });
          // 矢印 + 即避難！
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 28px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('→ 即 避 難 ！', W * 0.24, 548);
          // 区切り線
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(12, 540); ctx.lineTo(W * 0.47, 540); ctx.stroke();
          ctx.fillStyle = '#E8E0D0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      // Panel 3: ロボ、雨の中を逃げるシーン
      {
        char: ROBOT, charSide: 'right',
        bg1: '#182230', bg2: '#0E1520',
        msg: '「早すぎた」は\n成功。遅れること\nが最大のリスク。',
        extraDraw(ctx) {
          ctx.fillStyle = '#1A2A3A'; ctx.fillRect(0, 0, W * 0.5, H);
          // 暗い空
          const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
          skyGrad.addColorStop(0, '#0A1218'); skyGrad.addColorStop(1, '#1A2A3A');
          ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W * 0.5, H * 0.35);
          // 雨雲（シンプルな楕円群）
          ctx.fillStyle = '#1A2535';
          [[60, 38, 48, 22],[118, 28, 55, 26],[180, 35, 44, 20],[230, 32, 40, 18]].forEach(([x, y, rx, ry]) => {
            ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
          });
          // 雨（画面全体）
          drawRain(ctx, 0.55, 35);
          // 道路
          ctx.fillStyle = '#2A2A2A'; ctx.fillRect(0, H * 0.7, W * 0.5, H * 0.3);
          ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, H * 0.7, W * 0.5, 6);
          // 水たまり（楕円）
          ctx.fillStyle = 'rgba(80,130,180,0.3)';
          ctx.beginPath(); ctx.ellipse(55, H * 0.78, 32, 9, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(185, H * 0.82, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
          // 走っている人
          drawRunningPerson(ctx, 120, H * 0.68, 60, '#2563EB');
          // 動線（モーションライン）
          ctx.strokeStyle = '#334455'; ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
          ctx.setLineDash([14, 10]);
          for (let i = 0; i < 3; i++) {
            const ly = H * 0.58 + i * 22;
            ctx.beginPath(); ctx.moveTo(25, ly); ctx.lineTo(95, ly); ctx.stroke();
          }
          ctx.setLineDash([]); ctx.globalAlpha = 1;
          // 「早め＝成功！」ラベル
          ctx.fillStyle = '#0F3020'; ctx.fillRect(10, 28, 200, 38);
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2; ctx.strokeRect(10, 28, 200, 38);
          ctx.fillStyle = '#4ADE80'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('早め避難 ＝ 成功！', 110, 52);
        },
      },
      // Panel 4: リス、避難所に到着して安心
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: 'わかった！\n迷ったら\nすぐ逃げる！',
        extraDraw(ctx) {
          // 空
          const skyGrad = ctx.createLinearGradient(W * 0.44, 0, W * 0.44, H * 0.5);
          skyGrad.addColorStop(0, '#87CEEB'); skyGrad.addColorStop(1, '#C8EAFF');
          ctx.fillStyle = skyGrad; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.5);
          // 地面・道路
          ctx.fillStyle = '#7EC850'; ctx.fillRect(W * 0.44, H * 0.78, W * 0.56, H * 0.22);
          ctx.fillStyle = '#888'; ctx.fillRect(W * 0.44, H * 0.7, W * 0.56, H * 0.08);
          // 避難所建物
          ctx.fillStyle = '#D8E4F0'; ctx.fillRect(W * 0.5, H * 0.12, 175, 310);
          ctx.strokeStyle = '#A0B4C8'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.5, H * 0.12, 175, 310);
          // 屋上バンド
          ctx.fillStyle = '#B0C4DC'; ctx.fillRect(W * 0.5, H * 0.12, 175, 18);
          // 床区切り線
          ctx.strokeStyle = '#C0CCD8'; ctx.lineWidth = 1.5;
          [H * 0.26, H * 0.4, H * 0.53].forEach(y => {
            ctx.beginPath(); ctx.moveTo(W * 0.5, y); ctx.lineTo(W * 0.5 + 175, y); ctx.stroke();
          });
          // 窓（2列×3行）
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
              ctx.fillStyle = '#A8D8F0';
              ctx.fillRect(W * 0.52 + col * 78, H * 0.16 + row * (H * 0.14), 52, 40);
              ctx.strokeStyle = '#88B4C8'; ctx.lineWidth = 1.5;
              ctx.strokeRect(W * 0.52 + col * 78, H * 0.16 + row * (H * 0.14), 52, 40);
              // 窓枠
              ctx.beginPath(); ctx.moveTo(W * 0.52 + col * 78 + 26, H * 0.16 + row * (H * 0.14));
              ctx.lineTo(W * 0.52 + col * 78 + 26, H * 0.16 + row * (H * 0.14) + 40); ctx.stroke();
            }
          }
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.598, H * 0.56, 48, 68);
          ctx.strokeStyle = '#6A4428'; ctx.lineWidth = 2; ctx.strokeRect(W * 0.598, H * 0.56, 48, 68);
          ctx.fillStyle = '#D4A857'; ctx.beginPath(); ctx.arc(W * 0.64, H * 0.597, 4, 0, Math.PI * 2); ctx.fill();
          // 避難所サイン（緑）
          ctx.fillStyle = '#15803D'; ctx.fillRect(W * 0.5, H * 0.64, 175, 42);
          ctx.fillStyle = 'white'; ctx.font = 'bold 26px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('避 難 所', W * 0.587, H * 0.666);
          // 大きなチェックマーク
          drawCheck(ctx, W * 0.67, H * 0.08, 55, '#16A34A');
          // 光のエフェクト（チェックまわり）
          ctx.strokeStyle = '#86EFAC'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.55;
          [[W * 0.72, H * 0.02, W * 0.78, -H * 0.01],
           [W * 0.74, H * 0.07, W * 0.82, H * 0.07],
           [W * 0.72, H * 0.12, W * 0.79, H * 0.16]].forEach(([x1,y1,x2,y2]) => {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          });
          ctx.globalAlpha = 1;
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 避難所の感染症対策
  // ══════════════════════════════════════════════════════════
  {
    slug: 'evacuation-shelter-infection',
    panels: [
      // Panel 1: リス、密集した体育館を見て不安
      {
        char: RISS, charSide: 'left',
        bg1: '#2A2018', bg2: '#1A1510',
        msg: '避難所って\n病気がうつりやすい\nって本当？',
        extraDraw(ctx) {
          // 体育館の床（右側）
          ctx.fillStyle = '#C8924A'; ctx.fillRect(W * 0.44, H * 0.62, W * 0.56, H * 0.38);
          // 床のライン
          ctx.strokeStyle = '#A87040'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W * 0.44, H * 0.82); ctx.lineTo(W, H * 0.82); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.7, H * 0.62); ctx.lineTo(W * 0.7, H); ctx.stroke();
          // 天井
          ctx.fillStyle = '#1E1C18'; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.15);
          // 蛍光灯
          ctx.fillStyle = 'rgba(255,255,240,0.7)';
          [W * 0.56, W * 0.74, W * 0.92].forEach(x => { ctx.fillRect(x - 25, 18, 50, 8); });
          // 天井から壁
          ctx.fillStyle = '#2A2820'; ctx.fillRect(W * 0.44, H * 0.15, W * 0.56, H * 0.47);
          // 人々（シンプルな人形：○頭＋四角体）
          const people = [
            [W*0.53, H*0.55],[W*0.63, H*0.52],[W*0.74, H*0.54],[W*0.84, H*0.51],[W*0.93, H*0.53],
            [W*0.57, H*0.66],[W*0.67, H*0.64],[W*0.78, H*0.67],[W*0.88, H*0.65],
          ];
          people.forEach(([px, py]) => {
            drawPerson(ctx, px, py, 34, '#4A6080');
          });
          // 飛沫（点）
          ctx.globalAlpha = 0.55;
          const droplets = [[W*0.62,H*0.48],[W*0.74,H*0.47],[W*0.82,H*0.49],[W*0.67,H*0.5],[W*0.78,H*0.5]];
          droplets.forEach(([dx, dy]) => {
            ctx.fillStyle = '#88CCEE';
            ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(dx + 12, dy + 5, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(dx - 8, dy + 8, 2.5, 0, Math.PI * 2); ctx.fill();
          });
          ctx.globalAlpha = 1;
        },
      },
      // Panel 2: ロボ、ウイルス警告
      {
        char: ROBOT, charSide: 'right',
        bg1: '#1A0808', bg2: '#0F0505',
        msg: '本当だ。インフル・\nノロ・COVID-19が\n集団感染しやすい。',
        extraDraw(ctx) {
          ctx.fillStyle = '#200A0A'; ctx.fillRect(0, 0, W * 0.5, H);
          // メインウイルス（大）
          const drawVirus = (ctx, cx, cy, r, col, spikes, alpha) => {
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,100,100,0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            for (let i = 0; i < spikes; i++) {
              const angle = (i / spikes) * Math.PI * 2;
              const x1 = cx + Math.cos(angle) * r;
              const y1 = cy + Math.sin(angle) * r;
              const len = r * 0.4 + (i % 3) * 5;
              const x2 = cx + Math.cos(angle) * (r + len);
              const y2 = cy + Math.sin(angle) * (r + len);
              ctx.fillStyle = col;
              ctx.beginPath(); ctx.arc(x2, y2, 7, 0, Math.PI * 2); ctx.fill();
              ctx.strokeStyle = col; ctx.lineWidth = 3;
              ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            }
            ctx.restore();
          };
          drawVirus(ctx, W * 0.24, H * 0.42, 68, '#881818', 10, 0.85);
          drawVirus(ctx, W * 0.08, H * 0.22, 28, '#660C0C', 8, 0.65);
          drawVirus(ctx, W * 0.42, H * 0.28, 24, '#770E0E', 8, 0.6);
          drawVirus(ctx, W * 0.1,  H * 0.62, 20, '#550A0A', 7, 0.55);
          drawVirus(ctx, W * 0.42, H * 0.65, 18, '#660C0C', 7, 0.5);
          // 集中線（ウイルスから）
          drawSpeedLines(ctx, W * 0.24, H * 0.42, 20, 75, 180, '#FF2222', 0.2);
          // 感染症リスト
          const diseases = ['インフルエンザ', 'ノロウイルス', 'COVID-19'];
          diseases.forEach((d, i) => {
            ctx.fillStyle = '#FF4444'; ctx.font = 'bold 17px "Yu Gothic"';
            ctx.textAlign = 'left'; ctx.fillText(`⚠ ${d}`, 12, H * 0.72 + i * 32);
          });
          ctx.fillStyle = '#2A0808'; ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
        },
      },
      // Panel 3: ロボ、予防3箇条（手洗い・マスク・換気）
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '手洗い・マスク・\n換気のよい\n場所選びが大事。',
        extraDraw(ctx) {
          ctx.fillStyle = '#E5F0FC'; ctx.fillRect(0, 0, W * 0.5, H);
          // 3つのアイコン（縦並び）
          const items = [
            {
              y: 80, color: '#2563EB', bg: '#DBEAFE',
              label: '手洗い・消毒',
              draw(ctx, cx, cy) {
                // 手の形（シンプル）
                ctx.fillStyle = '#F0C8A0'; ctx.strokeStyle = '#C8906A'; ctx.lineWidth = 2.5;
                // 手首
                ctx.fillRect(cx - 18, cy, 36, 22); ctx.strokeRect(cx - 18, cy, 36, 22);
                // 指（4本）
                for (let i = 0; i < 4; i++) {
                  const fx = cx - 16 + i * 10;
                  ctx.fillRect(fx, cy - 28, 8, 32); ctx.strokeRect(fx, cy - 28, 8, 32);
                }
                // 水滴
                ctx.fillStyle = '#60A8F0'; ctx.globalAlpha = 0.8;
                [[cx - 8, cy - 42],[cx + 5, cy - 48],[cx + 16, cy - 40]].forEach(([wx, wy]) => {
                  ctx.beginPath(); ctx.arc(wx, wy, 5, 0, Math.PI * 2); ctx.fill();
                });
                ctx.globalAlpha = 1;
              },
            },
            {
              y: 280, color: '#16A34A', bg: '#DCFCE7',
              label: 'マスク着用',
              draw(ctx, cx, cy) {
                // マスク形
                ctx.fillStyle = '#E8F4EE'; ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 38, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // マスクのひも（左右）
                ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(cx - 38, cy - 8); ctx.lineTo(cx - 52, cy - 20); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - 38, cy + 8); ctx.lineTo(cx - 52, cy + 20); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 38, cy - 8); ctx.lineTo(cx + 52, cy - 20); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 38, cy + 8); ctx.lineTo(cx + 52, cy + 20); ctx.stroke();
                // ヒダ線
                ctx.strokeStyle = '#A8D8B8'; ctx.lineWidth = 1.5;
                [-8, 0, 8].forEach(oy => {
                  ctx.beginPath(); ctx.moveTo(cx - 30, cy + oy); ctx.lineTo(cx + 30, cy + oy); ctx.stroke();
                });
              },
            },
            {
              y: 480, color: '#0891B2', bg: '#E0F7FA',
              label: '換気・場所選び',
              draw(ctx, cx, cy) {
                // 窓枠
                ctx.fillStyle = '#B8D8E8'; ctx.strokeStyle = '#0891B2'; ctx.lineWidth = 3;
                ctx.fillRect(cx - 30, cy - 28, 60, 55); ctx.strokeRect(cx - 30, cy - 28, 60, 55);
                ctx.beginPath(); ctx.moveTo(cx, cy - 28); ctx.lineTo(cx, cy + 27); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - 30, cy + 1); ctx.lineTo(cx + 30, cy + 1); ctx.stroke();
                // 空気の流れ
                ctx.strokeStyle = '#22C8E8'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.7;
                ctx.setLineDash([6, 5]);
                [[-15, cy - 50],[-5, cy - 55],[10, cy - 48]].forEach(([ox, ay]) => {
                  ctx.beginPath(); ctx.moveTo(cx + ox - 10, ay - 15); ctx.lineTo(cx + ox + 10, ay); ctx.stroke();
                  ctx.beginPath(); ctx.moveTo(cx + ox + 10, ay); ctx.lineTo(cx + ox + 6, ay - 8); ctx.moveTo(cx + ox + 10, ay); ctx.lineTo(cx + ox + 4, ay + 7); ctx.stroke();
                });
                ctx.setLineDash([]); ctx.globalAlpha = 1;
              },
            },
          ];
          items.forEach(item => {
            // 背景パネル
            ctx.fillStyle = item.bg; ctx.strokeStyle = item.color; ctx.lineWidth = 2.5;
            roundRect(ctx, 12, item.y, 220, 165, 12); ctx.fill(); ctx.stroke();
            // 左のアイコンエリア
            item.draw(ctx, 68, item.y + 82);
            // ラベル
            ctx.fillStyle = item.color; ctx.font = 'bold 17px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText(item.label, 160, item.y + 90);
          });
          ctx.fillStyle = '#C8E0F8'; ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
        },
      },
      // Panel 4: リス、在宅避難が安心
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '建物が安全なら\n在宅避難が\n一番安心だね！',
        extraDraw(ctx) {
          // 空（晴れ）
          const skyGrad = ctx.createLinearGradient(W * 0.44, 0, W * 0.44, H * 0.5);
          skyGrad.addColorStop(0, '#7AC8F0'); skyGrad.addColorStop(1, '#C0E8FF');
          ctx.fillStyle = skyGrad; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.5);
          // 太陽
          ctx.fillStyle = '#FFD700';
          ctx.beginPath(); ctx.arc(W * 0.88, 55, 32, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#FFDD00'; ctx.lineWidth = 3; ctx.globalAlpha = 0.5;
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(W * 0.88 + Math.cos(angle) * 38, 55 + Math.sin(angle) * 38);
            ctx.lineTo(W * 0.88 + Math.cos(angle) * 58, 55 + Math.sin(angle) * 58);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 地面
          ctx.fillStyle = '#68C840'; ctx.fillRect(W * 0.44, H * 0.78, W * 0.56, H * 0.22);
          // 家（RC造）
          ctx.fillStyle = '#D8E4F0'; ctx.fillRect(W * 0.52, H * 0.2, 170, 260);
          ctx.strokeStyle = '#A0B4C8'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.52, H * 0.2, 170, 260);
          // 屋根
          ctx.fillStyle = '#8090A8';
          ctx.beginPath();
          ctx.moveTo(W * 0.5, H * 0.2);
          ctx.lineTo(W * 0.607, H * 0.12);
          ctx.lineTo(W * 0.714, H * 0.2);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#607080'; ctx.lineWidth = 2; ctx.stroke();
          // 窓（2×2）
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
              ctx.fillStyle = '#A0CCEC';
              ctx.fillRect(W * 0.55 + col * 72, H * 0.24 + row * (H * 0.14), 48, 42);
              ctx.strokeStyle = '#88AAC8'; ctx.lineWidth = 1.5;
              ctx.strokeRect(W * 0.55 + col * 72, H * 0.24 + row * (H * 0.14), 48, 42);
            }
          }
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.596, H * 0.52, 44, 60);
          ctx.strokeStyle = '#6A4428'; ctx.lineWidth = 2; ctx.strokeRect(W * 0.596, H * 0.52, 44, 60);
          // 大きなチェックマーク
          drawCheck(ctx, W * 0.67, H * 0.14, 60, '#16A34A');
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 在宅避難
  // ══════════════════════════════════════════════════════════
  {
    slug: 'earthquake-zaitaku',
    panels: [
      // Panel 1: リス、地震でパニック
      {
        char: RISS, charSide: 'left',
        bg1: '#2A1A10', bg2: '#1A100A',
        msg: '地震！\n避難所に行かないと\nいけないの？',
        extraDraw(ctx) {
          // 揺れる部屋の背景
          ctx.fillStyle = '#2A2018'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 壁のひび割れ
          ctx.strokeStyle = '#C8A060'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.moveTo(W * 0.52, 30); ctx.lineTo(W * 0.55, 100); ctx.lineTo(W * 0.52, 180); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.78, 60); ctx.lineTo(W * 0.74, 150); ctx.lineTo(W * 0.78, 230); ctx.stroke();
          ctx.globalAlpha = 1;
          // 揺れの速度線（対角）
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
          for (let i = 0; i < 10; i++) {
            const yy = 60 + i * 70;
            ctx.beginPath(); ctx.moveTo(W * 0.44, yy); ctx.lineTo(W * 0.47, yy + 20); ctx.lineTo(W * 0.5, yy - 10); ctx.lineTo(W, yy + 8); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 棚が傾いている
          ctx.save();
          ctx.translate(W * 0.72, H * 0.35); ctx.rotate(0.18);
          ctx.fillStyle = '#6A4428'; ctx.fillRect(-15, -80, 30, 160);
          ctx.fillRect(-35, -80, 70, 12);
          ctx.restore();
          // 落下物（本・缶）
          ctx.save();
          ctx.translate(W * 0.63, H * 0.55); ctx.rotate(-0.3);
          ctx.fillStyle = '#3A5080'; ctx.fillRect(-18, -10, 36, 20);
          ctx.restore();
          ctx.save();
          ctx.translate(W * 0.82, H * 0.48); ctx.rotate(0.4);
          ctx.fillStyle = '#C84040'; ctx.fillRect(-8, -12, 16, 24);
          ctx.restore();
          // 地震エフェクト（放射線）
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.2;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(W * 0.72 + Math.cos(angle) * 30, H * 0.4 + Math.sin(angle) * 30);
            ctx.lineTo(W * 0.72 + Math.cos(angle) * 140, H * 0.4 + Math.sin(angle) * 140);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 床
          ctx.fillStyle = '#1E140C'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      // Panel 2: ロボ、耐震OK建物を指し示す
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '建物が安全なら\n在宅避難が\n最善だ。',
        extraDraw(ctx) {
          // 晴れた空（左半分）
          const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
          skyGrad.addColorStop(0, '#6ABDE8'); skyGrad.addColorStop(1, '#B8E0F8');
          ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W * 0.5, H * 0.65);
          ctx.fillStyle = '#68C840'; ctx.fillRect(0, H * 0.78, W * 0.5, H * 0.22);
          ctx.fillStyle = '#888'; ctx.fillRect(0, H * 0.65, W * 0.5, H * 0.13);
          // RC造マンション（立体感あり）
          // 建物本体
          ctx.fillStyle = '#C8D4E4'; ctx.fillRect(20, H * 0.12, 210, H * 0.54);
          ctx.strokeStyle = '#909EB4'; ctx.lineWidth = 3; ctx.strokeRect(20, H * 0.12, 210, H * 0.54);
          // 屋上
          ctx.fillStyle = '#A0ACC8'; ctx.fillRect(12, H * 0.1, 226, 20);
          ctx.strokeStyle = '#808AAA'; ctx.lineWidth = 2; ctx.strokeRect(12, H * 0.1, 226, 20);
          // 横の床区切り線（5階）
          ctx.strokeStyle = '#A8B4C4'; ctx.lineWidth = 1.5;
          for (let floor = 1; floor < 5; floor++) {
            const fy = H * 0.12 + floor * (H * 0.54 / 5);
            ctx.beginPath(); ctx.moveTo(20, fy); ctx.lineTo(230, fy); ctx.stroke();
          }
          // 窓（4列×5行）
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
              const wx = 30 + col * 65;
              const wy = H * 0.14 + row * (H * 0.54 / 5) + 6;
              ctx.fillStyle = row === 2 && col === 1 ? '#FFE888' : '#90C8E8';
              ctx.fillRect(wx, wy, 46, 36);
              ctx.strokeStyle = '#7AB0D0'; ctx.lineWidth = 1;
              ctx.strokeRect(wx, wy, 46, 36);
              // 窓枠の縦線
              ctx.beginPath(); ctx.moveTo(wx + 23, wy); ctx.lineTo(wx + 23, wy + 36); ctx.stroke();
            }
          }
          // エントランス
          ctx.fillStyle = '#9A8060'; ctx.fillRect(82, H * 0.12 + H * 0.54 - 58, 66, 58);
          ctx.strokeStyle = '#7A6040'; ctx.lineWidth = 2; ctx.strokeRect(82, H * 0.12 + H * 0.54 - 58, 66, 58);
          // 「新耐震」ラベル
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(20, H * 0.68, 210, 36);
          ctx.fillStyle = 'white'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('✓ RC造・新耐震基準', 125, H * 0.68 + 24);
          // 大きなチェック
          drawCheck(ctx, 125, H * 0.08, 55, '#16A34A');
          ctx.fillStyle = '#C0D4E8'; ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
        },
      },
      // Panel 3: ロボ、7日分備蓄棚
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FFFBF0', bg2: '#FFF5DC',
        msg: '7日分の備蓄と\n簡易トイレがあれば\n自宅が最強。',
        extraDraw(ctx) {
          ctx.fillStyle = '#F8F0E0'; ctx.fillRect(0, 0, W * 0.5, H);
          // 棚板（3段）
          const shelfY = [H * 0.2, H * 0.42, H * 0.62];
          shelfY.forEach(y => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(10, y, W * 0.46, 12);
            ctx.strokeStyle = '#6A4228'; ctx.lineWidth = 1.5; ctx.strokeRect(10, y, W * 0.46, 12);
            // 棚の側面（影）
            ctx.fillStyle = '#6A4228'; ctx.fillRect(10, y + 12, 6, 60);
            ctx.fillRect(W * 0.46 + 10, y + 12, 6, 60);
          });
          // 棚支柱（両側）
          ctx.fillStyle = '#7A4E2C'; ctx.fillRect(10, H * 0.1, 14, H * 0.72);
          ctx.fillRect(W * 0.46 + 8, H * 0.1, 14, H * 0.72);
          // 段ごとのアイテム
          // 1段目：水ボトル
          for (let i = 0; i < 4; i++) {
            const bx = 24 + i * 52;
            const by = shelfY[0] - 65;
            // ボトル形
            ctx.fillStyle = '#B8D8F0'; ctx.fillRect(bx, by, 34, 58);
            ctx.strokeStyle = '#7AA8D0'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 34, 58);
            // キャップ
            ctx.fillStyle = '#2563EB'; ctx.fillRect(bx + 7, by - 10, 20, 12);
            // ラベル
            ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 13px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText('水', bx + 17, by + 36);
          }
          // 2段目：缶詰
          for (let i = 0; i < 4; i++) {
            const cx2 = 24 + i * 52;
            const cy2 = shelfY[1] - 58;
            ctx.fillStyle = '#E8C878'; ctx.fillRect(cx2, cy2, 34, 50);
            ctx.strokeStyle = '#C8A058'; ctx.lineWidth = 2; ctx.strokeRect(cx2, cy2, 34, 50);
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(cx2 + 5, cy2, 24, 8);
            ctx.fillStyle = '#7A4A1A'; ctx.font = 'bold 11px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText('缶詰', cx2 + 17, cy2 + 32);
          }
          // 3段目：懐中電灯・トイレ・薬
          const items3 = [
            { color: '#444', label: '🔦', bx: 24 },
            { color: '#E8D0A0', label: 'トイレ', bx: 76 },
            { color: '#D0E8A0', label: '薬', bx: 128 },
            { color: '#A8C8E8', label: '防災袋', bx: 180 },
          ];
          items3.forEach(it => {
            ctx.fillStyle = it.color;
            ctx.fillRect(it.bx, shelfY[2] - 54, 40, 46);
            ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
            ctx.strokeRect(it.bx, shelfY[2] - 54, 40, 46);
            ctx.fillStyle = '#444'; ctx.font = 'bold 12px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText(it.label, it.bx + 20, shelfY[2] - 24);
          });
          // 「7日分」バッジ
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(12, H * 0.08, 195, 46);
          ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2; ctx.strokeRect(12, H * 0.08, 195, 46);
          ctx.fillStyle = 'white'; ctx.font = 'bold 24px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('７日分 備蓄', 109, H * 0.08 + 31);
          ctx.fillStyle = '#EDE0C0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      // Panel 4: リス、自宅で安心
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '在宅避難の\n準備を今すぐ\nしておこう！',
        extraDraw(ctx) {
          // 空（晴れ）
          const skyGrad = ctx.createLinearGradient(W * 0.44, 0, W * 0.44, H * 0.5);
          skyGrad.addColorStop(0, '#7ACAE8'); skyGrad.addColorStop(1, '#C0EAFF');
          ctx.fillStyle = skyGrad; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.5);
          // 太陽と光線
          ctx.fillStyle = '#FFD700';
          ctx.beginPath(); ctx.arc(W * 0.9, 50, 30, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#FFDD44'; ctx.lineWidth = 3; ctx.globalAlpha = 0.6;
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(W * 0.9 + Math.cos(angle) * 36, 50 + Math.sin(angle) * 36);
            ctx.lineTo(W * 0.9 + Math.cos(angle) * 56, 50 + Math.sin(angle) * 56);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 地面
          ctx.fillStyle = '#58C030'; ctx.fillRect(W * 0.44, H * 0.76, W * 0.56, H * 0.24);
          // RC造の家（正面）
          ctx.fillStyle = '#D4E0F0'; ctx.fillRect(W * 0.52, H * 0.18, 172, 290);
          ctx.strokeStyle = '#9AACCA'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.52, H * 0.18, 172, 290);
          // 屋上
          ctx.fillStyle = '#8898B0'; ctx.fillRect(W * 0.5, H * 0.16, 178, 22);
          // 窓（2×3）
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
              const wx = W * 0.55 + col * 76;
              const wy = H * 0.22 + row * (H * 0.14);
              ctx.fillStyle = '#A8D0E8';
              ctx.fillRect(wx, wy, 50, 44);
              ctx.strokeStyle = '#80B0CC'; ctx.lineWidth = 1.5;
              ctx.strokeRect(wx, wy, 50, 44);
              // カーテン（安心感の演出）
              ctx.fillStyle = 'rgba(255,200,100,0.25)';
              ctx.fillRect(wx, wy, 22, 44);
            }
          }
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.6, H * 0.55, 46, 68);
          ctx.strokeStyle = '#6A4428'; ctx.lineWidth = 2; ctx.strokeRect(W * 0.6, H * 0.55, 46, 68);
          ctx.fillStyle = '#D4A857'; ctx.beginPath(); ctx.arc(W * 0.643, H * 0.59, 4, 0, Math.PI * 2); ctx.fill();
          // 家族（シンプルな3人）
          [W * 0.57, W * 0.66, W * 0.75].forEach((px, i) => {
            drawPerson(ctx, px, H * 0.72, 30, ['#E85050', '#4A90D9', '#50C850'][i]);
          });
          // ✅
          drawCheck(ctx, W * 0.68, H * 0.1, 55, '#16A34A');
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },
];

// ── 実行 ─────────────────────────────────────────────

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
        charSide:     p.charSide,
        charName:     c.name,
        panelNum:     i + 1,
        numBg1:       c.numBg1,
        numBg2:       c.numBg2,
        bg1:          p.bg1,
        bg2:          p.bg2,
        extraDraw:    p.extraDraw || null,
        bubbleFill:   c.bubbleFill,
        bubbleBorder: c.bubbleBorder,
        textColor:    c.textColor,
        msg:          p.msg,
      });

      const outPath = path.join(dir, `panel-0${i + 1}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✅ ${article.slug}/panel-0${i + 1}.png`);
    }
  }
  console.log('\n🎉 全パネル生成完了！');
}

main().catch(console.error);
