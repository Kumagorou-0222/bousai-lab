'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 600, H = 750;

// ── ユーティリティ ──────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// 吹き出し（左向き三角テイル）
function speechBubble(ctx, x, y, w, h, tailSide, fillColor, borderColor) {
  const r = 18;
  const tw = 22, th = 28;
  roundRect(ctx, x, y, w, h, r);
  ctx.save();
  ctx.beginPath();
  if (tailSide === 'left') {
    ctx.moveTo(x, y + h / 2 - tw / 2);
    ctx.lineTo(x - th, y + h / 2);
    ctx.lineTo(x, y + h / 2 + tw / 2);
  } else {
    ctx.moveTo(x + w, y + h / 2 - tw / 2);
    ctx.lineTo(x + w + th, y + h / 2);
    ctx.lineTo(x + w, y + h / 2 + tw / 2);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();
}

// 縦書き風セリフ折り返し
function drawText(ctx, text, cx, cy, maxW, lineH) {
  const lines = text.split('\n');
  const total = lines.length;
  const startY = cy - ((total - 1) * lineH) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, cx, startY + i * lineH);
  });
}

// 地震エフェクト（放射線）
function drawQuakeLines(ctx, cx, cy, count, len, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * 30;
    const y1 = cy + Math.sin(angle) * 30;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

// 速度線（左から右へ）
function drawSpeedLines(ctx, y, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 12; i++) {
    const yy = y + (i - 6) * 22;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, yy);
    ctx.lineTo(W * 0.4, yy + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }
  ctx.restore();
}

// パネル番号バッジ
function drawBadge(ctx, num, bg1, bg2) {
  const bx = W - 56, by = 10, br = 22;
  const grad = ctx.createLinearGradient(bx, by, bx + br * 2, by + br * 2);
  grad.addColorStop(0, bg1);
  grad.addColorStop(1, bg2);
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(bx + br, by + br, br, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 26px "Yu Gothic"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(num), bx + br, by + br);
}

// 大きな絵文字をシーン要素として描画
function drawSceneEmoji(ctx, emoji, x, y, size, alpha = 0.18) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

// ── メイン描画エンジン ──────────────────────────────
// charSide: 'left' | 'right'  キャラクターの配置
async function drawPanel({
  charImg, charSide, charName,
  panelNum, numBg1, numBg2,
  bg1, bg2,                    // 背景グラデーション
  sceneEmojis,                 // [{emoji, x, y, size, alpha}]
  extraDraw,                   // (ctx) => void  追加描画
  quake,                       // bool: 地震エフェクト
  bubbleFill, bubbleBorder,
  textColor,
  msg,
}) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── 背景 ──
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, bg1);
  bgGrad.addColorStop(1, bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // シーン絵文字（背景演出）
  for (const e of (sceneEmojis || [])) {
    drawSceneEmoji(ctx, e.emoji, e.x, e.y, e.size, e.alpha ?? 0.18);
  }

  // 追加描画（地面・壁・道路など）
  if (extraDraw) extraDraw(ctx);

  // 地震エフェクト
  if (quake) {
    drawQuakeLines(ctx, W * 0.5, H * 0.45, 20, 280, '#F59E0B');
    // 揺れ線（斜め）
    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 8; i++) {
      const yy = 100 + i * 80;
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(40, yy + 15);
      ctx.lineTo(80, yy - 10);
      ctx.lineTo(120, yy + 20);
      ctx.lineTo(W, yy + 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── レイアウト計算 ──
  const margin = 24;
  const charSize = 260;
  const gap = 20;
  const bubbleW = W - charSize - margin * 2 - gap;
  const bubbleH = 220;
  const contentY = (H - charSize) / 2 + 10;
  const bubbleY = (H - bubbleH) / 2;

  let charX, bubbleX, tailSide;
  if (charSide === 'left') {
    charX    = margin;
    bubbleX  = charX + charSize + gap;
    tailSide = 'left';
  } else {
    bubbleX  = margin;
    charX    = bubbleX + bubbleW + gap;
    tailSide = 'right';
  }

  // ── キャラクター影 ──
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.drawImage(charImg, charX, contentY, charSize, charSize);
  ctx.restore();

  // ── 吹き出し ──
  speechBubble(ctx, bubbleX, bubbleY, bubbleW, bubbleH, tailSide, bubbleFill, bubbleBorder);

  // ── セリフテキスト ──
  const fontSize = msg.replace(/\n/g, '').length > 20 ? 26 : 30;
  ctx.font = `bold ${fontSize}px "Yu Gothic"`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawText(ctx, msg, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2, bubbleW - 30, fontSize * 1.7);

  // ── キャラクター名 ──
  ctx.font = 'bold 18px "Yu Gothic"';
  const nm = ctx.measureText(charName);
  const nbW = nm.width + 24, nbH = 30;
  const nbX = charX + (charSize - nbW) / 2;
  const nbY = contentY + charSize + 6;
  ctx.fillStyle = bubbleBorder + '33';
  roundRect(ctx, nbX, nbY, nbW, nbH, 15);
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(charName, nbX + nbW / 2, nbY + nbH / 2);

  // ── パネル番号 ──
  drawBadge(ctx, panelNum, numBg1, numBg2);

  // ── 外枠 ──
  ctx.strokeStyle = bubbleBorder;
  ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  return canvas;
}

// ── パネル定義 ───────────────────────────────────────

const RISS  = { numBg1: '#FF8C00', numBg2: '#FFD000', bubbleFill: '#FFFEF0', bubbleBorder: '#F59E0B', textColor: '#78350F', name: '防災リス' };
const ROBOT = { numBg1: '#1E3A8A', numBg2: '#06B6D4', bubbleFill: '#F0F9FF', bubbleBorder: '#3B82F6', textColor: '#1E40AF', name: 'レスQロボ' };

const ARTICLES = [
  {
    slug: 'kids-earthquake-rules',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '地震が来たとき、\n子どもはどうすれば\nいいの？',
        quake: true,
        sceneEmojis: [
          { emoji: '🏫', x: W * 0.75, y: H * 0.35, size: 120 },
          { emoji: '📚', x: W * 0.65, y: H * 0.72, size: 70, alpha: 0.25 },
        ],
        extraDraw(ctx) {
          // 床
          ctx.fillStyle = '#D4B483'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          // 黒板
          ctx.fillStyle = '#2D6A3F'; ctx.fillRect(W * 0.5, 40, W * 0.45, 100);
          ctx.strokeStyle = '#1A4228'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.5, 40, W * 0.45, 100);
          ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.font = '18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('防災の授業', W * 0.72, 98);
          // 机
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.5, H * 0.78, 150, 14);
          ctx.fillRect(W * 0.52, H * 0.78 + 14, 12, 40);
          ctx.fillRect(W * 0.68, H * 0.78 + 14, 12, 40);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: 'まず机の下に入れ。\n頭を守り、揺れが\n収まるまで動くな。',
        quake: true,
        sceneEmojis: [
          { emoji: '🪑', x: W * 0.25, y: H * 0.65, size: 130, alpha: 0.25 },
          { emoji: '⚠️', x: W * 0.22, y: H * 0.25, size: 80, alpha: 0.22 },
        ],
        extraDraw(ctx) {
          // 机の底面（上から見た視点）
          ctx.fillStyle = '#8B5E3C';
          ctx.fillRect(20, H * 0.3, W * 0.48, 16);
          // 机の脚
          ctx.fillRect(28, H * 0.3 + 16, 14, 90);
          ctx.fillRect(W * 0.44, H * 0.3 + 16, 14, 90);
          // 机の下：影
          const grad = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.6);
          grad.addColorStop(0, 'rgba(0,0,0,0.12)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(20, H * 0.3 + 16, W * 0.48, 100);
          // 床
          ctx.fillStyle = '#D4B483'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '机の下がないときは\nどうするの？',
        quake: true,
        sceneEmojis: [
          { emoji: '🏫', x: W * 0.72, y: H * 0.3, size: 100, alpha: 0.15 },
          { emoji: '❓', x: W * 0.78, y: H * 0.6, size: 90, alpha: 0.25 },
        ],
        extraDraw(ctx) {
          // 廊下の壁
          ctx.fillStyle = '#E8DCC8'; ctx.fillRect(W * 0.45, 0, W * 0.55, H);
          ctx.fillStyle = '#C8B898'; ctx.fillRect(W * 0.45, 0, 4, H);
          // 窓
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(W * 0.55, 60, 100, 120);
          ctx.strokeStyle = '#999'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.55, 60, 100, 120);
          ctx.beginPath(); ctx.moveTo(W * 0.55 + 50, 60); ctx.lineTo(W * 0.55 + 50, 180); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.55, 120); ctx.lineTo(W * 0.55 + 100, 120); ctx.stroke();
          // 床
          ctx.fillStyle = '#B8A888'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: 'かばんで頭を守り、\n柱に近づいて\nしゃがめ。',
        sceneEmojis: [
          { emoji: '🎒', x: W * 0.22, y: H * 0.35, size: 110, alpha: 0.35 },
          { emoji: '✅', x: W * 0.3, y: H * 0.7, size: 80, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          // 柱（左側）
          ctx.fillStyle = '#C8B89A';
          ctx.fillRect(20, 0, 70, H);
          ctx.fillStyle = '#B0A080';
          ctx.fillRect(20, 0, 6, H);
          ctx.fillRect(84, 0, 6, H);
          // 壁
          ctx.fillStyle = '#EDE0CC'; ctx.fillRect(90, 0, W * 0.45, H);
          // 床
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'kids-shelter-basics',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#F0F9FF', bg2: '#DBEAFE',
        msg: '避難所ってどんな\n場所なの？\n行ったことない…',
        sceneEmojis: [
          { emoji: '🏫', x: W * 0.72, y: H * 0.38, size: 150, alpha: 0.3 },
          { emoji: '🚶', x: W * 0.65, y: H * 0.72, size: 70, alpha: 0.2 },
        ],
        extraDraw(ctx) {
          // 青空
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, H * 0.5);
          // 地面
          ctx.fillStyle = '#7EC850'; ctx.fillRect(0, H * 0.78, W, H * 0.22);
          // 道路
          ctx.fillStyle = '#999'; ctx.fillRect(W * 0.45, H * 0.72, W * 0.55, 50);
          // 建物（体育館）
          ctx.fillStyle = '#D0D8E8';
          ctx.fillRect(W * 0.5, H * 0.28, W * 0.46, 160);
          ctx.fillStyle = '#A0ACC8';
          ctx.fillRect(W * 0.5, H * 0.28, W * 0.46, 14); // 屋根帯
          // 「避難所」看板
          ctx.fillStyle = '#2B7A4B'; ctx.fillRect(W * 0.54, H * 0.28 + 20, 110, 36);
          ctx.fillStyle = 'white'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('避難所', W * 0.54 + 55, H * 0.28 + 42);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#E0EEFF',
        msg: '学校の体育館や\n公民館が多い。\n大勢で過ごす場所だ。',
        sceneEmojis: [
          { emoji: '🏟️', x: W * 0.25, y: H * 0.38, size: 130, alpha: 0.22 },
          { emoji: '👨‍👩‍👧‍👦', x: W * 0.28, y: H * 0.68, size: 80, alpha: 0.28 },
        ],
        extraDraw(ctx) {
          // 体育館の床（線コート）
          ctx.fillStyle = '#D4A56A'; ctx.fillRect(0, H * 0.7, W * 0.48, H * 0.3);
          ctx.strokeStyle = '#C08840'; ctx.lineWidth = 2;
          // センターライン
          ctx.beginPath(); ctx.moveTo(W * 0.24, H * 0.7); ctx.lineTo(W * 0.24, H); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H * 0.82); ctx.lineTo(W * 0.48, H * 0.82); ctx.stroke();
          // 人々（小さな丸）
          ctx.fillStyle = 'rgba(100,100,200,0.3)';
          [[60,H*0.55],[120,H*0.6],[80,H*0.65],[160,H*0.58],[30,H*0.72]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI*2); ctx.fill();
          });
          // 天井の蛍光灯
          ctx.fillStyle = 'rgba(200,220,255,0.4)';
          [80, 200, 320].forEach(x => { ctx.fillRect(x, 15, 60, 10); });
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: 'ご飯やトイレは\nどうなるの？',
        sceneEmojis: [
          { emoji: '🍱', x: W * 0.7, y: H * 0.35, size: 110, alpha: 0.35 },
          { emoji: '🚽', x: W * 0.72, y: H * 0.65, size: 90, alpha: 0.28 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W * 0.45, 0, W * 0.55, H);
          ctx.fillStyle = '#D4B898'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          // 仕切り壁
          ctx.fillStyle = '#C8B898'; ctx.fillRect(W * 0.45, 0, 4, H);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '食事は配給、\nトイレは共用。\n不便でも安全な場所だ。',
        sceneEmojis: [
          { emoji: '🤝', x: W * 0.25, y: H * 0.4, size: 120, alpha: 0.25 },
          { emoji: '❤️', x: W * 0.3, y: H * 0.68, size: 70, alpha: 0.25 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.48, H);
          ctx.fillStyle = '#D4B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          // 配給トレー
          ctx.fillStyle = 'rgba(255,200,100,0.3)'; ctx.fillRect(30, H * 0.55, 130, 80);
          ctx.strokeStyle = '#C08840'; ctx.lineWidth = 2; ctx.strokeRect(30, H * 0.55, 130, 80);
        },
      },
    ],
  },

  {
    slug: 'earthquake-car',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '運転中に地震！\nどうすれば\nいいの！？',
        quake: true,
        sceneEmojis: [
          { emoji: '🚗', x: W * 0.72, y: H * 0.55, size: 160, alpha: 0.35 },
          { emoji: '💥', x: W * 0.58, y: H * 0.3, size: 80, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          // 道路
          ctx.fillStyle = '#555'; ctx.fillRect(0, H * 0.72, W, H * 0.28);
          ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.setLineDash([40, 30]); ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(0, H * 0.86); ctx.lineTo(W, H * 0.86); ctx.stroke();
          ctx.setLineDash([]);
          // ひび割れ
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.72); ctx.lineTo(W * 0.54, H * 0.8); ctx.lineTo(W * 0.5, H * 0.9); ctx.stroke();
          ctx.globalAlpha = 1;
          // ダッシュボード枠
          ctx.fillStyle = '#333'; ctx.fillRect(W * 0.44, 50, W * 0.54, 80);
          ctx.fillStyle = '#555'; ctx.fillRect(W * 0.44 + 4, 54, W * 0.54 - 8, 72);
          // ハンドル
          ctx.strokeStyle = '#222'; ctx.lineWidth = 10; ctx.globalAlpha = 0.35;
          ctx.beginPath(); ctx.arc(W * 0.7, 200, 55, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.7, 145); ctx.lineTo(W * 0.7, 255); ctx.stroke();
          ctx.globalAlpha = 1;
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '慌てるな。\nゆっくり減速して\n路肩に寄れ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 道路（俯瞰）
          ctx.fillStyle = '#666'; ctx.fillRect(0, H * 0.6, W * 0.5, H * 0.4);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.setLineDash([30, 20]); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.6); ctx.lineTo(W * 0.25, H); ctx.stroke();
          ctx.setLineDash([]);
          // 車（上から）路肩に寄せる
          ctx.fillStyle = '#4A90D9'; ctx.fillRect(80, H * 0.62, 60, 100);
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(88, H * 0.65, 44, 50);
          // 矢印（→ 路肩へ）
          ctx.fillStyle = '#16A34A'; ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(160, H * 0.72); ctx.lineTo(220, H * 0.72);
          ctx.lineTo(210, H * 0.65); ctx.moveTo(220, H * 0.72);
          ctx.lineTo(210, H * 0.79);
          ctx.lineWidth = 5; ctx.strokeStyle = '#16A34A'; ctx.stroke();
          ctx.globalAlpha = 1;
          // 草（路肩）
          ctx.fillStyle = '#7EC850'; ctx.fillRect(0, H * 0.6, 20, H * 0.4);
          ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '急ブレーキはNG。\n橋やトンネルの\n手前で停車しろ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 道路
          ctx.fillStyle = '#666'; ctx.fillRect(0, H * 0.65, W * 0.5, H * 0.35);
          // 橋（赤×）
          ctx.fillStyle = '#8B7355';
          ctx.fillRect(30, H * 0.5, 80, H * 0.17);
          ctx.fillRect(28, H * 0.45, 14, 100);
          ctx.fillRect(96, H * 0.45, 14, 100);
          ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 8; ctx.globalAlpha = 0.75;
          ctx.beginPath(); ctx.moveTo(20, H * 0.42); ctx.lineTo(120, H * 0.62); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(120, H * 0.42); ctx.lineTo(20, H * 0.62); ctx.stroke();
          ctx.globalAlpha = 1;
          // 停車OK（グリーン）
          ctx.fillStyle = 'rgba(22,163,74,0.2)'; ctx.fillRect(0, H * 0.65, 50, H * 0.35);
          ctx.font = 'bold 26px serif'; ctx.fillStyle = '#16A34A';
          ctx.textAlign = 'center'; ctx.fillText('✅', 25, H * 0.78);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '鍵をつけたまま\n車を離れるのも\n忘れずだね！',
        sceneEmojis: [
          { emoji: '🚗', x: W * 0.72, y: H * 0.52, size: 140, alpha: 0.35 },
          { emoji: '🔑', x: W * 0.7, y: H * 0.72, size: 70, alpha: 0.4 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#555'; ctx.fillRect(0, H * 0.78, W, H * 0.22);
          ctx.fillStyle = '#7EC850'; ctx.fillRect(0, H * 0.78, W, 10);
          // 矢印（歩いて離れる）
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 4; ctx.setLineDash([8, 6]);
          ctx.beginPath(); ctx.moveTo(W * 0.52, H * 0.72); ctx.lineTo(W * 0.38, H * 0.72); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#16A34A'; ctx.font = '28px serif';
          ctx.textAlign = 'center'; ctx.fillText('→', W * 0.35, H * 0.7 + 10);
        },
      },
    ],
  },

  {
    slug: 'earthquake-highrise',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '高層マンションで\n地震！すぐ逃げないと\nいけない？',
        quake: true,
        sceneEmojis: [
          { emoji: '🏢', x: W * 0.72, y: H * 0.45, size: 180, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          // 空
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.7);
          // ビル群（背景）
          [[W * 0.5, 80, 80, 380], [W * 0.65, 20, 70, 440], [W * 0.82, 60, 80, 400]].forEach(([x, y, w, h]) => {
            ctx.fillStyle = '#A0B4CC'; ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = '#8090A8'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
            // 窓
            for (let wy = y + 20; wy < y + h - 20; wy += 35) {
              for (let wx = x + 10; wx < x + w - 10; wx += 28) {
                ctx.fillStyle = wy % 70 === 20 ? '#FFE566' : '#B8D4EE';
                ctx.fillRect(wx, wy, 18, 22);
              }
            }
          });
          // 揺れ線
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 3; ctx.globalAlpha = 0.3;
          for (let i = 0; i < 6; i++) {
            ctx.beginPath(); const yy = 100 + i * 100;
            ctx.moveTo(W * 0.44, yy); ctx.lineTo(W * 0.46, yy + 15); ctx.lineTo(W * 0.5, yy - 10); ctx.lineTo(W, yy + 8); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // 地面
          ctx.fillStyle = '#888'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '揺れている間は\n動くな。\n高層は揺れが長い。',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 部屋（高層）窓から夜景
          ctx.fillStyle = '#1A2A4A'; ctx.fillRect(0, 0, W * 0.5, H * 0.6);
          // 窓
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(20, 40, 160, 200);
          // 窓の向こうのビル群
          ctx.fillStyle = '#2A3A5A';
          [[30, 80, 40, 160], [90, 60, 35, 180], [145, 90, 30, 150]].forEach(([x, y, w, h]) => {
            ctx.fillRect(x, y, w, h);
          });
          // 揺れ矢印
          ctx.strokeStyle = '#F87171'; ctx.lineWidth = 5; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.moveTo(60, H * 0.5); ctx.lineTo(140, H * 0.5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(50, H * 0.5); ctx.lineTo(70, H * 0.44); ctx.moveTo(50, H * 0.5); ctx.lineTo(70, H * 0.56); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(150, H * 0.5); ctx.lineTo(130, H * 0.44); ctx.moveTo(150, H * 0.5); ctx.lineTo(130, H * 0.56); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#B8C8D8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '高層は長周期地震動で\n5分以上揺れることも\nある。',
        sceneEmojis: [
          { emoji: '⏱️', x: W * 0.25, y: H * 0.38, size: 120, alpha: 0.35 },
        ],
        extraDraw(ctx) {
          // 波形グラフ（長周期）
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 4; ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(20, H * 0.55);
          for (let x = 0; x < W * 0.5; x += 2) {
            const amp = 60 * Math.exp(-x / (W * 1.2));
            ctx.lineTo(x, H * 0.55 + Math.sin(x / 18) * amp);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
          // 5分ラベル
          ctx.fillStyle = '#EFF6FF'; ctx.fillRect(20, H * 0.65, 170, 44);
          ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2; ctx.strokeRect(20, H * 0.65, 170, 44);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('5分以上 継続', 105, H * 0.65 + 26);
          ctx.fillStyle = '#D0D8E8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '揺れが収まったら\n階段で。エレベーターは\n絶対ダメだ！',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 階段
          ctx.fillStyle = '#C8B898';
          for (let i = 0; i < 6; i++) {
            ctx.fillRect(W * 0.48 + i * 24, H * 0.42 + i * 36, 24 + (5 - i) * 24, 36);
          }
          // 階段の影
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          for (let i = 0; i < 6; i++) {
            ctx.fillRect(W * 0.48 + i * 24, H * 0.42 + i * 36, 24 + (5 - i) * 24, 5);
          }
          // エレベーター（×）
          ctx.fillStyle = '#888'; ctx.fillRect(W * 0.46, 50, 70, 160);
          ctx.fillStyle = '#AAA'; ctx.fillRect(W * 0.46 + 2, 52, 34, 156);
          ctx.fillStyle = '#BBB'; ctx.fillRect(W * 0.46 + 36, 52, 32, 156);
          ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 8; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(W * 0.44, 40); ctx.lineTo(W * 0.44 + 80, 220); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.44 + 80, 40); ctx.lineTo(W * 0.44, 220); ctx.stroke();
          ctx.globalAlpha = 1;
          // 地面
          ctx.fillStyle = '#999'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'earthquake-sleep',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#1A2A4A', bg2: '#0F1A30',
        msg: '寝てるときに地震！\nどうしたらいい！？',
        quake: true,
        sceneEmojis: [
          { emoji: '💤', x: W * 0.72, y: H * 0.28, size: 90, alpha: 0.3 },
          { emoji: '🌙', x: W * 0.58, y: H * 0.18, size: 70, alpha: 0.4 },
        ],
        extraDraw(ctx) {
          // 部屋（暗い）
          ctx.fillStyle = '#2A3A5A'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 窓（夜）
          ctx.fillStyle = '#1A1A2E'; ctx.fillRect(W * 0.52, 50, 120, 140);
          ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.52, 50, 120, 140);
          // 月と星
          ctx.fillStyle = '#FFD700'; ctx.font = '30px serif';
          ctx.textAlign = 'center';
          ctx.fillText('★', W * 0.62, 90); ctx.fillText('★', W * 0.7, 110); ctx.fillText('★', W * 0.58, 130);
          // 布団
          ctx.fillStyle = '#E8D0B0'; ctx.fillRect(0, H * 0.7, W * 0.5, H * 0.12);
          ctx.fillStyle = '#F8E8C8'; ctx.fillRect(0, H * 0.82, W * 0.5, H * 0.18);
          // 棚から落ちるもの
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.47, 180, 80, 14);
          ctx.fillStyle = '#D4945A'; ctx.fillRect(W * 0.49, 195, 14, 50);
          ctx.font = '22px serif'; ctx.fillText('📚', W * 0.56, 280);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#1E2840', bg2: '#141E32',
        msg: '布団から出るな。\n枕で頭を守れ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 暗い部屋
          ctx.fillStyle = '#252F48'; ctx.fillRect(0, 0, W * 0.5, H);
          // 布団とリス（小さく）
          ctx.fillStyle = '#8090A8'; ctx.fillRect(20, H * 0.55, 170, 80);
          ctx.fillStyle = '#A0B0C8'; ctx.fillRect(20, H * 0.55, 170, 20); // 枕
          // 頭を守るアイコン
          ctx.font = '40px serif'; ctx.textAlign = 'center';
          ctx.fillText('🛌', 105, H * 0.5);
          // 赤×（逃げる）
          ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 4; ctx.globalAlpha = 0.65;
          ctx.beginPath(); ctx.moveTo(20, H * 0.3); ctx.lineTo(80, H * 0.4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(80, H * 0.3); ctx.lineTo(20, H * 0.4); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.font = '22px serif'; ctx.fillText('🏃', 50, H * 0.29);
          ctx.fillStyle = '#8090A8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#1E2840', bg2: '#141E32',
        msg: '暗闇で動くと\nガラスで足を切るぞ。\n収まるまで待て。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#252F48'; ctx.fillRect(0, 0, W * 0.5, H);
          // ガラスの破片
          ctx.fillStyle = 'rgba(150,200,255,0.5)';
          [[30,H*0.72,25,8],[70,H*0.75,18,6],[50,H*0.78,22,7],[100,H*0.7,15,5],[20,H*0.8,20,6]].forEach(([x,y,w,h]) => {
            ctx.save(); ctx.translate(x+w/2,y+h/2); ctx.rotate(Math.random()*0.8-0.4);
            ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
          });
          ctx.strokeStyle = 'rgba(150,200,255,0.3)'; ctx.lineWidth = 1;
          [[15,H*0.68,60,H*0.82],[80,H*0.65,30,H*0.75]].forEach(([x1,y1,x2,y2]) => {
            ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
          });
          // ⚠️
          ctx.font = '50px serif'; ctx.textAlign = 'center';
          ctx.fillText('⚠️', W * 0.24, H * 0.45);
          ctx.fillStyle = '#8090A8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#1A2A4A', bg2: '#0F1A30',
        msg: '枕元にスリッパと\n懐中電灯を置いておけば\n安心だね！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#2A3A5A'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 枕元セット
          const bx = W * 0.5, by = H * 0.38;
          // 懐中電灯
          ctx.fillStyle = '#FFD700'; ctx.font = '55px serif';
          ctx.textAlign = 'center'; ctx.fillText('🔦', bx + 40, by);
          // スリッパ
          ctx.fillText('🩴', bx + 110, by + 20);
          // 光の演出
          const grd = ctx.createRadialGradient(bx + 40, by - 20, 5, bx + 40, by - 20, 120);
          grd.addColorStop(0, 'rgba(255,220,0,0.25)');
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.7);
          // チェック
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.fillText('✅ 枕元セット完了！', bx + 70, by + 80);
          ctx.fillStyle = '#1A2A4A'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
          ctx.fillStyle = '#E8D0B0'; ctx.fillRect(0, H * 0.72, W * 0.5, H * 0.1);
        },
      },
    ],
  },

  {
    slug: 'evacuation-dvt',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#F5F5F5', bg2: '#E8E8E8',
        msg: '避難所でじっとして\nいるけど、足が\nむくんできた…',
        sceneEmojis: [
          { emoji: '😰', x: W * 0.7, y: H * 0.3, size: 80, alpha: 0.25 },
        ],
        extraDraw(ctx) {
          // 体育館の床
          ctx.fillStyle = '#D4A56A'; ctx.fillRect(W * 0.44, H * 0.7, W * 0.56, H * 0.3);
          ctx.strokeStyle = '#C08840'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W * 0.44, H * 0.85); ctx.lineTo(W, H * 0.85); ctx.stroke();
          // 周囲の人々（座っている）
          ctx.fillStyle = 'rgba(100,100,180,0.3)';
          [[W*0.52, H*0.62],[W*0.65, H*0.65],[W*0.78, H*0.6],[W*0.88, H*0.63]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI*2); ctx.fill();
          });
          // むくみエフェクト
          ctx.font = '30px serif'; ctx.textAlign = 'center';
          ctx.fillText('💧', W * 0.62, H * 0.55); ctx.fillText('💧', W * 0.72, H * 0.52);
          ctx.fillStyle = '#B0B0B0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: 'エコノミークラス\n症候群の危険信号だ。\nすぐ動け。',
        sceneEmojis: [
          { emoji: '🚨', x: W * 0.25, y: H * 0.3, size: 110, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W * 0.5, H);
          // 血栓イメージ（血管断面）
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 5; ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.ellipse(W * 0.24, H * 0.58, 45, 20, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#DC2626'; ctx.globalAlpha = 0.3;
          ctx.beginPath(); ctx.ellipse(W * 0.24, H * 0.58, 30, 13, 0, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.font = '20px "Yu Gothic"'; ctx.fillStyle = '#DC2626';
          ctx.textAlign = 'center'; ctx.fillText('血栓リスク！', W * 0.24, H * 0.68);
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '同じ姿勢で血流が\n悪くなる。足首を\n動かして水を飲め。',
        sceneEmojis: [
          { emoji: '💧', x: W * 0.3, y: H * 0.68, size: 80, alpha: 0.35 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F4F8'; ctx.fillRect(0, 0, W * 0.5, H);
          // 足首回し図
          ctx.font = '60px serif'; ctx.textAlign = 'center';
          ctx.fillText('🦶', W * 0.15, H * 0.35);
          // 回転矢印
          ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 4; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.arc(W * 0.15, H * 0.42, 35, -Math.PI*0.8, Math.PI*0.8); ctx.stroke();
          ctx.globalAlpha = 1;
          // 水ボトル
          ctx.font = '55px serif'; ctx.fillText('💧', W * 0.3, H * 0.55);
          ctx.fillStyle = '#3B82F6'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.fillText('水分補給！', W * 0.24, H * 0.68);
          ctx.fillStyle = '#D0E8F8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '足首を動かして\n水を飲む。これだけで\n全然違う！',
        sceneEmojis: [
          { emoji: '✅', x: W * 0.72, y: H * 0.35, size: 100, alpha: 0.35 },
          { emoji: '💪', x: W * 0.68, y: H * 0.65, size: 80, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 元気エフェクト
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 3; ctx.globalAlpha = 0.4;
          [[W*0.55, H*0.25],[W*0.7, H*0.2],[W*0.82, H*0.3],[W*0.62, H*0.18]].forEach(([x, y]) => {
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 20, y - 30); ctx.stroke();
            ctx.beginPath(); ctx.arc(x + 20, y - 35, 5, 0, Math.PI*2); ctx.fill();
          });
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'musashino-shelters',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '地震が来たら\nどこの避難所に\n行けばいいの？',
        sceneEmojis: [
          { emoji: '🗺️', x: W * 0.72, y: H * 0.42, size: 150, alpha: 0.3 },
          { emoji: '❓', x: W * 0.62, y: H * 0.25, size: 70, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          // 地図背景
          ctx.fillStyle = '#C8D8B8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 街区
          [[W*0.48,60,80,80],[W*0.62,50,90,60],[W*0.78,80,70,100],
           [W*0.5,180,60,70],[W*0.68,160,80,90],[W*0.85,160,60,80],
           [W*0.52,300,100,70],[W*0.72,290,80,80]].forEach(([x,y,w,h]) => {
            ctx.fillStyle = '#B0C0A8'; ctx.fillRect(x,y,w,h);
            ctx.strokeStyle = '#90A080'; ctx.lineWidth = 1; ctx.strokeRect(x,y,w,h);
          });
          // 道路
          ctx.fillStyle = '#D8D0C0';
          ctx.fillRect(W * 0.44, 140, W * 0.56, 20);
          ctx.fillRect(W * 0.44, 270, W * 0.56, 20);
          ctx.fillRect(W * 0.67, 0, 20, H * 0.8);
          // ピン（避難所）
          ctx.font = '22px serif'; ctx.textAlign = 'center';
          [[W*0.55, 120],[W*0.72, 100],[W*0.84, 145],[W*0.58, 240],[W*0.78, 230]].forEach(([x,y]) => {
            ctx.fillText('📍', x, y);
          });
          ctx.fillStyle = '#B8C8D8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '自宅が安全なら\n在宅避難が基本だ。\nまず確認しろ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 家（安全）
          ctx.fillStyle = '#E8D8B0';
          ctx.beginPath(); ctx.moveTo(60, H*0.38); ctx.lineTo(170, H*0.25); ctx.lineTo(280, H*0.38); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#D4C090'; ctx.fillRect(80, H*0.38, 180, 140);
          // 窓
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(100, H*0.42, 50, 50); ctx.fillRect(200, H*0.42, 50, 50);
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(155, H*0.48, 40, 70);
          // ✅
          ctx.font = '42px serif'; ctx.textAlign = 'center';
          ctx.fillText('✅', W * 0.24, H*0.34);
          ctx.fillStyle = '#C8D8B8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '武蔵野市の避難所は\n学校・公民館が\n中心だ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 地図（武蔵野市）
          ctx.fillStyle = '#C8D8B8'; ctx.fillRect(0, 0, W * 0.5, H);
          ctx.strokeStyle = '#D8D0C0'; ctx.lineWidth = 12;
          ctx.beginPath(); ctx.moveTo(0, H*0.35); ctx.lineTo(W*0.5, H*0.35); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.6); ctx.lineTo(W*0.5, H*0.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.22, 0); ctx.lineTo(W*0.22, H); ctx.stroke();
          // 42か所ラベル
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(20, 40, 170, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 22px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('42か所', 105, 72);
          // ピン
          ctx.font = '20px serif';
          [[60,H*0.25],[120,H*0.2],[170,H*0.3],[80,H*0.5],[150,H*0.48],
           [50,H*0.7],[130,H*0.72],[W*0.18,H*0.15]].forEach(([x,y]) => {
            ctx.fillText('📍', x, y);
          });
          ctx.fillStyle = '#B0C0A8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '事前に経路を\n確認しておくんだね！\n今すぐやる！',
        sceneEmojis: [
          { emoji: '👟', x: W * 0.72, y: H * 0.55, size: 100, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#C8D8B8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 経路矢印
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 5; ctx.setLineDash([12, 8]);
          ctx.beginPath();
          ctx.moveTo(W * 0.55, H * 0.7);
          ctx.lineTo(W * 0.6, H * 0.55);
          ctx.lineTo(W * 0.72, H * 0.48);
          ctx.lineTo(W * 0.82, H * 0.35);
          ctx.stroke(); ctx.setLineDash([]);
          // 矢印先端
          ctx.fillStyle = '#16A34A'; ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.arc(W * 0.82, H * 0.32, 12, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          // 家マーク
          ctx.font = '30px serif'; ctx.textAlign = 'center';
          ctx.fillText('🏠', W * 0.55, H * 0.73);
          ctx.fillText('🏫', W * 0.82, H * 0.28);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'disaster-rolling-stock',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '備蓄を買っても\n賞味期限切れに\nしてしまう…',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#EDE0CC'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 棚
          [H * 0.22, H * 0.45, H * 0.65].forEach(y => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.44, y, W * 0.56, 10);
          });
          // 期限切れ食品（ほこりっぽい）
          ctx.globalAlpha = 0.55;
          ctx.font = '36px serif'; ctx.textAlign = 'center';
          ctx.fillText('🥫', W * 0.56, H * 0.38); ctx.fillText('🥫', W * 0.72, H * 0.38); ctx.fillText('🥫', W * 0.88, H * 0.38);
          ctx.fillText('🍜', W * 0.62, H * 0.58); ctx.fillText('🍜', W * 0.82, H * 0.58);
          ctx.globalAlpha = 1;
          // ×ラベル
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 16px "Yu Gothic"';
          ctx.fillText('期限切れ…', W * 0.68, H * 0.7);
          // ほこり
          ctx.font = '16px serif'; ctx.fillStyle = 'rgba(150,130,100,0.5)';
          ctx.fillText('～', W * 0.6, H * 0.42); ctx.fillText('～', W * 0.78, H * 0.4);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: 'ローリングストックにしろ。\n普段のものを\n多めに買え。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // ループ矢印（回転）
          ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 5; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.arc(W * 0.24, H * 0.45, 70, -Math.PI * 0.7, Math.PI * 0.7); ctx.stroke();
          ctx.beginPath(); ctx.arc(W * 0.24, H * 0.45, 70, Math.PI * 0.3, Math.PI * 1.7); ctx.stroke();
          ctx.globalAlpha = 1;
          // ラベル
          const labels = [['買う', W*0.32, H*0.28],['使う', W*0.38, H*0.55],['補充', W*0.1, H*0.55]];
          labels.forEach(([text, x, y]) => {
            ctx.fillStyle = '#1E3A8A'; ctx.font = 'bold 20px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText(text, x, y);
          });
          // 食品アイコン
          ctx.font = '32px serif';
          ctx.fillText('🥫', W * 0.15, H * 0.32);
          ctx.fillText('🍜', W * 0.35, H * 0.32);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '特別な非常食を\n用意しなきゃ\nいけないの？',
        sceneEmojis: [
          { emoji: '🤔', x: W * 0.7, y: H * 0.28, size: 80, alpha: 0.3 },
          { emoji: '💰', x: W * 0.75, y: H * 0.55, size: 80, alpha: 0.25 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 高級非常食イメージ（疑問符付き）
          ctx.font = '50px serif'; ctx.textAlign = 'center';
          ctx.fillText('🍱', W * 0.68, H * 0.45);
          ctx.fillStyle = '#F59E0B'; ctx.font = 'bold 24px serif';
          ctx.fillText('¥¥¥', W * 0.68, H * 0.6);
          // 疑問符
          ctx.fillStyle = '#92400E'; ctx.font = 'bold 50px "Yu Gothic"';
          ctx.fillText('？', W * 0.88, H * 0.38);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: 'いらない。普段の\n食品を+1個多めに\n持つだけだ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 棚（普通の食品）
          [H * 0.28, H * 0.5, H * 0.68].forEach(y => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(15, y, W * 0.44, 8);
          });
          // 食品
          ctx.font = '32px serif'; ctx.textAlign = 'center';
          const items = [['🥫', W*0.12, H*0.44], ['🍜', W*0.24, H*0.44], ['🥫', W*0.38, H*0.44],
                         ['🍞', W*0.12, H*0.62], ['🍝', W*0.24, H*0.62]];
          items.forEach(([e, x, y]) => ctx.fillText(e, x, y));
          // +1バッジ
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 22px "Yu Gothic"';
          [[W*0.38, H*0.44],[W*0.12, H*0.62]].forEach(([x, y]) => {
            ctx.fillText('+1', x + 18, y - 14);
          });
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },
];

// ── 追加3記事 ──────────────────────────────────────────

const ARTICLES2 = [
  {
    slug: 'evacuation-timing',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF3E0', bg2: '#FFE0B2',
        msg: '警戒レベル4が\n出た…まだ大丈夫\nかな？',
        sceneEmojis: [
          { emoji: '📺', x: W * 0.72, y: H * 0.38, size: 120, alpha: 0.35 },
        ],
        extraDraw(ctx) {
          // 部屋の壁
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 窓（大雨）
          ctx.fillStyle = '#4A7090'; ctx.fillRect(W * 0.5, 50, 150, 120);
          ctx.strokeStyle = '#333'; ctx.lineWidth = 4; ctx.strokeRect(W * 0.5, 50, 150, 120);
          // 雨
          ctx.strokeStyle = '#87CEEB'; ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
          for (let i = 0; i < 12; i++) {
            const rx = W * 0.52 + (i % 4) * 35 + 10;
            const ry = 60 + Math.floor(i / 4) * 35;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 4, ry + 20); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // TV（警報）
          ctx.fillStyle = '#222'; ctx.fillRect(W * 0.52, H * 0.48, 140, 90);
          ctx.fillStyle = '#DC2626'; ctx.fillRect(W * 0.54, H * 0.5, 136, 60);
          ctx.fillStyle = 'white'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('避難指示', W * 0.62, H * 0.535);
          ctx.font = 'bold 13px "Yu Gothic"'; ctx.fillText('警戒レベル4', W * 0.62, H * 0.555);
          // 床
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: 'ダメ！レベル4は\n即避難だ。\n迷うな！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W * 0.5, H);
          // 警戒レベル表（縦）
          const levels = [
            { lv: 5, label: '緊急安全確保', color: '#7B1FA2' },
            { lv: 4, label: '避難指示', color: '#DC2626', highlight: true },
            { lv: 3, label: '高齢者等避難', color: '#EA580C' },
            { lv: 2, label: '大雨注意報', color: '#D97706' },
            { lv: 1, label: '早期注意情報', color: '#65A30D' },
          ];
          levels.forEach((l, i) => {
            const by = 60 + i * 100;
            ctx.fillStyle = l.highlight ? l.color : l.color + '33';
            ctx.fillRect(15, by, W * 0.44, 85);
            if (l.highlight) {
              ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 4; ctx.strokeRect(15, by, W * 0.44, 85);
              // 点滅風の★
              ctx.font = '22px serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'white';
              ctx.fillText('⚠️', W * 0.38, by + 46);
            }
            ctx.fillStyle = l.highlight ? 'white' : l.color;
            ctx.font = `bold 18px "Yu Gothic"`;
            ctx.textAlign = 'center';
            ctx.fillText(`レベル${l.lv}：${l.label}`, W * 0.22, by + 50);
          });
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '「早すぎた」は\n成功。遅れること\nが最大のリスク。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 道路（雨の中避難）
          ctx.fillStyle = '#555'; ctx.fillRect(0, H * 0.7, W * 0.5, H * 0.3);
          // 人がリュック背負って歩く
          ctx.font = '55px serif'; ctx.textAlign = 'center';
          ctx.fillText('🏃', W * 0.16, H * 0.65);
          // 矢印（前進）
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 5; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.62); ctx.lineTo(W * 0.45, H * 0.62); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.42, H * 0.56); ctx.lineTo(W * 0.46, H * 0.62); ctx.lineTo(W * 0.42, H * 0.68); ctx.stroke();
          ctx.globalAlpha = 1;
          // 雨
          ctx.strokeStyle = '#87CEEB'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
          for (let i = 0; i < 10; i++) {
            const rx = 15 + (i % 5) * 45;
            const ry = H * 0.1 + Math.floor(i / 5) * 200;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 25); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          // ✅早期避難
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('✅ 早めが正解', W * 0.24, H * 0.5);
          ctx.fillStyle = '#888'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: 'わかった！\n迷ったら\nすぐ逃げる！',
        sceneEmojis: [
          { emoji: '✅', x: W * 0.72, y: H * 0.35, size: 110, alpha: 0.4 },
          { emoji: '🏫', x: W * 0.78, y: H * 0.65, size: 90, alpha: 0.3 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 避難所到着
          ctx.fillStyle = '#B0C8A8'; ctx.fillRect(W * 0.5, H * 0.3, 160, 120);
          ctx.fillStyle = '#7AA870'; ctx.fillRect(W * 0.5, H * 0.3, 160, 14);
          ctx.fillStyle = '#2B7A4B'; ctx.fillRect(W * 0.55, H * 0.3 + 20, 90, 30);
          ctx.fillStyle = 'white'; ctx.font = 'bold 16px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('避難所', W * 0.6, H * 0.3 + 39);
          // 安全エフェクト
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 3; ctx.globalAlpha = 0.4;
          [[W*0.62,H*0.2],[W*0.75,H*0.18],[W*0.85,H*0.24],[W*0.7,H*0.22]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18, y - 28); ctx.stroke();
            ctx.beginPath(); ctx.arc(x + 18, y - 33, 5, 0, Math.PI * 2); ctx.fill();
          });
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'evacuation-shelter-infection',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#F5F5F5', bg2: '#E8E8E8',
        msg: '避難所って\n病気がうつりやすい\nって本当？',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 体育館（混んでいる）
          ctx.fillStyle = '#D4A56A'; ctx.fillRect(W * 0.44, H * 0.6, W * 0.56, H * 0.4);
          ctx.strokeStyle = '#C08840'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(W * 0.7, H * 0.6); ctx.lineTo(W * 0.7, H); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W * 0.44, H * 0.77); ctx.lineTo(W, H * 0.77); ctx.stroke();
          // 人々（密集）
          ctx.font = '28px serif'; ctx.textAlign = 'center';
          const ppl = [[W*0.52,H*0.56],[W*0.62,H*0.54],[W*0.73,H*0.57],[W*0.83,H*0.55],
                       [W*0.55,H*0.68],[W*0.67,H*0.7],[W*0.78,H*0.66],[W*0.88,H*0.69]];
          ppl.forEach(([x,y]) => ctx.fillText('👤', x, y));
          // 飛沫表現
          ctx.fillStyle = '#87CEEB'; ctx.globalAlpha = 0.4;
          [[W*0.62,H*0.5],[W*0.73,H*0.52],[W*0.54,H*0.51]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x+15, y+10, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x-10, y+8, 3, 0, Math.PI*2); ctx.fill();
          });
          ctx.globalAlpha = 1;
          // 天井
          ctx.fillStyle = '#E8E0D8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H * 0.15);
          ctx.fillStyle = 'rgba(200,220,255,0.4)';
          [W*0.55, W*0.7, W*0.85].forEach(x => ctx.fillRect(x, 10, 50, 8));
          ctx.fillStyle = '#B0B0B0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: '本当だ。インフル・\nノロ・COVID-19が\n集団感染しやすい。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W * 0.5, H);
          // ウイルス（丸＋突起）
          const drawVirus = (ctx, cx, cy, r, color, alpha) => {
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              const x1 = cx + Math.cos(angle) * r;
              const y1 = cy + Math.sin(angle) * r;
              const x2 = cx + Math.cos(angle) * (r + 14);
              const y2 = cy + Math.sin(angle) * (r + 14);
              ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
          };
          drawVirus(ctx, W * 0.14, H * 0.28, 28, '#DC2626', 0.6);
          drawVirus(ctx, W * 0.34, H * 0.35, 22, '#7C3AED', 0.5);
          drawVirus(ctx, W * 0.22, H * 0.5, 18, '#DC2626', 0.4);
          drawVirus(ctx, W * 0.4, H * 0.52, 24, '#0891B2', 0.5);
          // ラベル
          const vs = [['インフルエンザ', W*0.24, H*0.15],['ノロウイルス', W*0.24, H*0.63],['COVID-19', W*0.24, H*0.75]];
          vs.forEach(([label, x, y]) => {
            ctx.fillStyle = '#7F1D1D'; ctx.font = 'bold 16px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText(label, x, y);
          });
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '手洗い・マスク・\n換気のよい\n場所選びが大事。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 手洗い
          ctx.font = '52px serif'; ctx.textAlign = 'center';
          ctx.fillText('🙌', W * 0.14, H * 0.22);
          ctx.fillStyle = '#87CEEB'; ctx.font = '24px serif';
          ctx.fillText('💧💧', W * 0.14, H * 0.3);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.fillText('手洗い', W * 0.14, H * 0.37);
          // マスク
          ctx.font = '52px serif'; ctx.textAlign = 'center';
          ctx.fillText('😷', W * 0.36, H * 0.22);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.fillText('マスク', W * 0.36, H * 0.37);
          // 換気
          ctx.font = '52px serif';
          ctx.fillText('💨', W * 0.14, H * 0.58);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.fillText('換気', W * 0.14, H * 0.66);
          // 場所選び（窓の近く）
          ctx.font = '52px serif'; ctx.fillText('🪟', W * 0.36, H * 0.55);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.fillText('窓際を選ぶ', W * 0.36, H * 0.66);
          // 区切り線
          ctx.strokeStyle = '#BFDBFE'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.12); ctx.lineTo(W * 0.25, H * 0.75); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H * 0.43); ctx.lineTo(W * 0.5, H * 0.43); ctx.stroke();
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '建物が安全なら\n在宅避難が\n一番安心だね！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 家（安全）
          ctx.fillStyle = '#D4E8C8';
          ctx.beginPath(); ctx.moveTo(W * 0.52, H * 0.32); ctx.lineTo(W * 0.72, H * 0.18); ctx.lineTo(W * 0.92, H * 0.32); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#B4D0A0'; ctx.fillRect(W * 0.56, H * 0.32, 160, 130);
          // 窓
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(W * 0.59, H * 0.36, 45, 45); ctx.fillRect(W * 0.75, H * 0.36, 45, 45);
          // ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.67, H * 0.43, 36, 60);
          // ✅大きく
          ctx.font = '55px serif'; ctx.textAlign = 'center';
          ctx.fillText('✅', W * 0.72, H * 0.24);
          // 備蓄アイコン
          ctx.font = '28px serif';
          ctx.fillText('🥫', W * 0.58, H * 0.7); ctx.fillText('💧', W * 0.72, H * 0.7); ctx.fillText('🔦', W * 0.86, H * 0.7);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },

  {
    slug: 'earthquake-zaitaku',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '地震！\n避難所に行かないと\nいけないの？',
        quake: true,
        sceneEmojis: [],
        extraDraw(ctx) {
          // 部屋（揺れている）
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 家具が倒れる
          ctx.save(); ctx.translate(W * 0.7, H * 0.38); ctx.rotate(0.25);
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(-15, -60, 30, 120); ctx.restore();
          // 棚から落ちるもの
          ctx.font = '28px serif'; ctx.textAlign = 'center';
          ctx.fillText('📚', W * 0.62, H * 0.55);
          ctx.fillText('🥫', W * 0.78, H * 0.6);
          // ひび割れ
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.15); ctx.lineTo(W * 0.55, H * 0.3); ctx.lineTo(W * 0.52, H * 0.45); ctx.stroke();
          ctx.globalAlpha = 1;
          // 窓（外が見える）
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(W * 0.75, 60, 90, 120);
          ctx.strokeStyle = '#555'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.75, 60, 90, 120);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '建物が安全なら\n在宅避難が\n最善だ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // RC造マンション（正面）
          ctx.fillStyle = '#C0CCD8';
          ctx.fillRect(20, 80, 200, 380);
          ctx.strokeStyle = '#A0B0C0'; ctx.lineWidth = 2; ctx.strokeRect(20, 80, 200, 380);
          // 窓（格子）
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
              ctx.fillStyle = row === 2 && col === 1 ? '#FFE566' : '#87CEEB';
              ctx.fillRect(32 + col * 62, 100 + row * 70, 42, 45);
            }
          }
          // 屋根
          ctx.fillStyle = '#90A0B0'; ctx.fillRect(10, 68, 220, 18);
          // 耐震OK
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('✅ RC造・耐震OK', W * 0.24, H * 0.6);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '7日分の備蓄と\n簡易トイレがあれば\n自宅が最強。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W * 0.5, H);
          // 備蓄棚
          [H * 0.22, H * 0.45, H * 0.65].forEach(y => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(15, y, W * 0.44, 10);
          });
          // 食品・水
          ctx.font = '30px serif'; ctx.textAlign = 'center';
          const items = [
            ['🥫', W*0.1, H*0.38], ['🍜', W*0.22, H*0.38], ['🥫', W*0.34, H*0.38],
            ['💧', W*0.1, H*0.58], ['💧', W*0.22, H*0.58], ['🔦', W*0.34, H*0.58],
            ['🚽', W*0.1, H*0.78], ['💊', W*0.22, H*0.78], ['🔋', W*0.34, H*0.78],
          ];
          items.forEach(([e, x, y]) => ctx.fillText(e, x, y));
          // 7日分バッジ
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(20, 20, 170, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 22px "Yu Gothic"';
          ctx.fillText('7日分 備蓄', W * 0.24, 50);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '在宅避難の\n準備を今すぐ\nしておこう！',
        sceneEmojis: [
          { emoji: '✅', x: W * 0.72, y: H * 0.32, size: 110, alpha: 0.4 },
        ],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(W * 0.44, 0, W * 0.56, H);
          // 快適な家
          ctx.fillStyle = '#C8E0C0';
          ctx.beginPath(); ctx.moveTo(W * 0.52, H * 0.35); ctx.lineTo(W * 0.72, H * 0.2); ctx.lineTo(W * 0.92, H * 0.35); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#A8C8A0'; ctx.fillRect(W * 0.56, H * 0.35, 155, 120);
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(W * 0.6, H * 0.39, 40, 40); ctx.fillRect(W * 0.76, H * 0.39, 40, 40);
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W * 0.68, H * 0.46, 32, 58);
          // 笑顔の家族
          ctx.font = '30px serif'; ctx.textAlign = 'center';
          ctx.fillText('👨‍👩‍👧', W * 0.72, H * 0.65);
          // 輝き
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.45;
          [[W*0.6,H*0.15],[W*0.75,H*0.12],[W*0.88,H*0.18],[W*0.65,H*0.14]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+16, y-24); ctx.stroke();
            ctx.beginPath(); ctx.arc(x+16, y-28, 5, 0, Math.PI * 2); ctx.fill();
          });
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H * 0.82, W, H * 0.18);
        },
      },
    ],
  },
];

// ── 保存版10記事 ────────────────────────────────────────

const ARTICLES3 = [
  {
    slug: 'kansei-breaker',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '避難するとき\nブレーカーって\n落とさないといけないの？',
        sceneEmojis: [{ emoji: '🏠', x: W*0.72, y: H*0.4, size: 130, alpha: 0.25 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 玄関ドア
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W*0.6, H*0.35, 90, 150);
          ctx.fillStyle = '#6B4423'; ctx.fillRect(W*0.63, H*0.38, 40, 80); ctx.fillRect(W*0.73, H*0.38, 40, 80);
          ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(W*0.73, H*0.52, 6, 0, Math.PI*2); ctx.fill();
          // リュック
          ctx.font = '50px serif'; ctx.textAlign = 'center'; ctx.fillText('🎒', W*0.84, H*0.7);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '停電が復旧したとき\n壊れた配線に\n電気が流れて火事になる！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 通電火災の図
          // 家（停電中）
          ctx.fillStyle = '#555'; ctx.fillRect(30, H*0.25, 110, 90);
          ctx.fillStyle = '#777'; ctx.fillRect(32, H*0.27, 106, 86);
          ctx.fillStyle = '#444';
          ctx.beginPath(); ctx.moveTo(25, H*0.25); ctx.lineTo(85, H*0.12); ctx.lineTo(145, H*0.25); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#888'; ctx.font = '18px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('停電中', 85, H*0.38);
          // 矢印（停電復旧→火事）
          ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 5; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(145, H*0.32); ctx.lineTo(200, H*0.32); ctx.stroke();
          ctx.fillStyle = '#FFD700'; ctx.font = '20px serif'; ctx.fillText('⚡', 205, H*0.33);
          ctx.globalAlpha = 1;
          // 火事の家
          ctx.fillStyle = '#B84030'; ctx.fillRect(220, H*0.25, 110, 90);
          ctx.fillStyle = '#9A3020';
          ctx.beginPath(); ctx.moveTo(215, H*0.25); ctx.lineTo(275, H*0.12); ctx.lineTo(335, H*0.25); ctx.closePath(); ctx.fill();
          ctx.font = '36px serif'; ctx.fillText('🔥', 275, H*0.38);
          ctx.font = 'bold 16px "Yu Gothic"'; ctx.fillStyle = '#DC2626';
          ctx.fillText('通電火災！', W*0.24, H*0.6);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF3E0', bg2: '#FFE0B2',
        msg: 'でも地震のパニックで\n忘れそう…\nどうすれば？',
        sceneEmojis: [{ emoji: '😰', x: W*0.72, y: H*0.35, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // ブレーカー（忘れている）
          ctx.fillStyle = '#888'; ctx.fillRect(W*0.52, H*0.28, 100, 160);
          ctx.fillStyle = '#AAA'; ctx.fillRect(W*0.54, H*0.3, 96, 156);
          // スイッチ（ON のまま）
          [[W*0.59, H*0.36], [W*0.73, H*0.36], [W*0.59, H*0.48], [W*0.73, H*0.48]].forEach(([x, y]) => {
            ctx.fillStyle = '#16A34A'; ctx.fillRect(x, y, 20, 10);
          });
          ctx.font = 'bold 14px "Yu Gothic"'; ctx.fillStyle = '#16A34A';
          ctx.textAlign = 'center'; ctx.fillText('ON', W*0.62, H*0.59);
          // ？
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 50px "Yu Gothic"';
          ctx.fillText('？', W*0.82, H*0.45);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '感震ブレーカーを\n付けておけば自動で遮断\n1,000円から設置できる！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // 感震ブレーカー（コンセント型）
          ctx.fillStyle = '#F0F0F0'; ctx.fillRect(30, H*0.22, 130, 90);
          ctx.strokeStyle = '#CCC'; ctx.lineWidth = 3; ctx.strokeRect(30, H*0.22, 130, 90);
          ctx.fillStyle = '#555'; ctx.fillRect(55, H*0.35, 25, 30); ctx.fillRect(105, H*0.35, 25, 30);
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 13px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('感震', 95, H*0.27);
          // 矢印（揺れ→自動OFF）
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 4; ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.moveTo(165, H*0.33); ctx.lineTo(220, H*0.33); ctx.stroke();
          ctx.globalAlpha = 1;
          // ブレーカー（OFF）
          ctx.fillStyle = '#888'; ctx.fillRect(230, H*0.22, 80, 120);
          [[255, H*0.3], [255, H*0.42], [255, H*0.54]].forEach(([x, y]) => {
            ctx.fillStyle = '#EEE'; ctx.fillRect(x, y, 30, 8);
          });
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('自動OFF✅', W*0.37, H*0.55);
          // 価格
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(15, H*0.64, 170, 44);
          ctx.fillStyle = 'white'; ctx.font = 'bold 20px "Yu Gothic"';
          ctx.fillText('1,000円〜', W*0.22, H*0.64+28);
          ctx.fillStyle = '#C0E8D0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'car-evacuation',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '避難所に行ったら\n満員で入れなかった…\nどうしよう！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 避難所（体育館）
          ctx.fillStyle = '#B0C8A0'; ctx.fillRect(W*0.5, H*0.18, 175, 130);
          ctx.fillStyle = '#90A880'; ctx.fillRect(W*0.5, H*0.18, 175, 14);
          // 満員看板
          ctx.fillStyle = '#DC2626'; ctx.fillRect(W*0.56, H*0.24, 110, 40);
          ctx.fillStyle = 'white'; ctx.font = 'bold 22px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('満 員', W*0.62, H*0.27);
          // 人々（はみ出している）
          ctx.font = '28px serif';
          [[W*0.55,H*0.52],[W*0.65,H*0.53],[W*0.75,H*0.5],[W*0.85,H*0.53]].forEach(([x,y]) => ctx.fillText('🚶', x, y));
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '車中泊避難という\n選択肢がある。\n雨・プライバシー・移動手段を確保できる。',
        sceneEmojis: [{ emoji: '🚗', x: W*0.25, y: H*0.48, size: 150, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 車のシルエット
          ctx.fillStyle = '#4A90D9'; ctx.fillRect(20, H*0.5, 220, 80);
          ctx.fillStyle = '#3A70B9'; ctx.fillRect(40, H*0.38, 160, 120);
          ctx.fillStyle = '#87CEEB'; ctx.fillRect(50, H*0.41, 140, 70);
          // タイヤ
          ctx.fillStyle = '#222';
          ctx.beginPath(); ctx.arc(65, H*0.64, 20, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(195, H*0.64, 20, 0, Math.PI*2); ctx.fill();
          // メリットアイコン
          ctx.font = '22px serif'; ctx.textAlign = 'center';
          ctx.fillText('☔', 30, H*0.3); ctx.fillText('🔒', 90, H*0.3); ctx.fillText('🚗', 150, H*0.3);
          ctx.fillStyle = '#1E40AF'; ctx.font = 'bold 12px "Yu Gothic"';
          ctx.fillText('雨除け', 30, H*0.35); ctx.fillText('プライバシー', 90, H*0.35); ctx.fillText('移動手段', 150, H*0.35);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#F5F5F5', bg2: '#E8E8E8',
        msg: 'でも車の中で\n寝るのって\n体に悪くないの？',
        sceneEmojis: [{ emoji: '🤔', x: W*0.72, y: H*0.32, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#EDEDEB'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 車内（シート）
          ctx.fillStyle = '#808070'; ctx.fillRect(W*0.5, H*0.28, 165, 200);
          ctx.fillStyle = '#606050'; ctx.fillRect(W*0.52, H*0.38, 145, 100);
          ctx.fillStyle = '#707060'; ctx.fillRect(W*0.52, H*0.3, 70, 80);
          ctx.fillStyle = '#707060'; ctx.fillRect(W*0.77, H*0.3, 70, 80);
          // ハンドル
          ctx.strokeStyle = '#444'; ctx.lineWidth = 8; ctx.globalAlpha = 0.35;
          ctx.beginPath(); ctx.arc(W*0.7, H*0.62, 40, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#B0B0B0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: '1〜2時間ごとに\n歩く。エンジンかけたまま\n寝るのは絶対NG！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W*0.5, H);
          // エコノミー症候群（赤×）
          ctx.font = '38px serif'; ctx.textAlign = 'center';
          ctx.fillText('🚶', W*0.14, H*0.22);
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.fillText('1〜2時間ごとに歩く', W*0.24, H*0.3);
          // エンジン×
          ctx.font = '38px serif'; ctx.fillText('🚗', W*0.14, H*0.48);
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 7; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(20, H*0.38); ctx.lineTo(100, H*0.58); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(100, H*0.38); ctx.lineTo(20, H*0.58); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 13px "Yu Gothic"';
          ctx.fillText('エンジンかけたまま寝ない', W*0.24, H*0.63);
          // 一酸化炭素
          ctx.font = '34px serif'; ctx.fillText('💨', W*0.14, H*0.74);
          ctx.fillStyle = '#7F1D1D'; ctx.font = 'bold 12px "Yu Gothic"';
          ctx.fillText('一酸化炭素中毒に注意', W*0.24, H*0.8);
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'evacuation-shelter-goods',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#F5F5F5', bg2: '#E8E8E8',
        msg: '避難所に来たけど\n騒がしくて眠れない…\n明るいし、床は硬いし…',
        sceneEmojis: [],
        extraDraw(ctx) {
          // 体育館の床
          ctx.fillStyle = '#D4A56A'; ctx.fillRect(W*0.44, H*0.6, W*0.56, H*0.4);
          // 人々（周囲）
          ctx.font = '26px serif'; ctx.textAlign = 'center';
          [[W*0.58,H*0.54],[W*0.72,H*0.56],[W*0.86,H*0.53]].forEach(([x,y]) => ctx.fillText('👤', x, y));
          // 騒音線
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
          [[W*0.62,H*0.45],[W*0.76,H*0.43],[W*0.68,H*0.47]].forEach(([x,y]) => {
            ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI); ctx.stroke();
          });
          ctx.globalAlpha = 1;
          // 天井（明るい照明）
          ctx.fillStyle = '#E0D8D0'; ctx.fillRect(W*0.44, 0, W*0.56, H*0.12);
          ctx.fillStyle = 'rgba(255,255,200,0.5)'; [W*0.56, W*0.72, W*0.88].forEach(x => ctx.fillRect(x, 10, 50, 10));
          ctx.fillStyle = '#B0B0A8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '避難所生活は\nホテルじゃない。\n事前準備が快適さを変える。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 準備あり vs なし
          // なし側
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 16px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('準備なし', W*0.12, H*0.22);
          ctx.font = '30px serif';
          ctx.fillText('😩', W*0.12, H*0.35);
          ctx.fillStyle = '#DC2626'; ctx.font = '12px "Yu Gothic"'; ctx.fillText('眠れない', W*0.12, H*0.44);
          // 区切り
          ctx.strokeStyle = '#BFDBFE'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W*0.24, H*0.15); ctx.lineTo(W*0.24, H*0.75); ctx.stroke();
          // あり側
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 16px "Yu Gothic"';
          ctx.fillText('準備あり', W*0.37, H*0.22);
          ctx.font = '30px serif';
          ctx.fillText('😊', W*0.37, H*0.35);
          ctx.fillStyle = '#16A34A'; ctx.font = '12px "Yu Gothic"'; ctx.fillText('快適！', W*0.37, H*0.44);
          // グッズアイコン
          ctx.font = '22px serif';
          [[W*0.31,H*0.58],[W*0.39,H*0.62],[W*0.47,H*0.58]].forEach(([x,y]) => ctx.fillText(['👂','😷','🩴'][Math.floor((x-W*0.31)/(W*0.08))], x, y));
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '何を持ってくれば\nよかったの？',
        sceneEmojis: [{ emoji: '😢', x: W*0.72, y: H*0.32, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 忘れたグッズが吹き出しに
          ctx.font = '36px serif'; ctx.textAlign = 'center';
          const icons = ['👂','😎','🩴','🧻','🪥'];
          icons.forEach((e, i) => {
            ctx.fillText(e, W*0.58 + (i%3)*48, H*0.38 + Math.floor(i/3)*55);
          });
          // ×
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 4; ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.moveTo(W*0.48, H*0.28); ctx.lineTo(W*0.95, H*0.28); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.48, H*0.55); ctx.lineTo(W*0.95, H*0.55); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.fillText('持ってくればよかった…', W*0.68, H*0.66);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '耳栓・アイマスク\nスリッパ・ウェットシート\n首まくら。これで快適！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // グッズ5点
          const goods = [['👂','耳栓',W*0.12,H*0.22],['😎','アイマスク',W*0.37,H*0.22],
                         ['🩴','スリッパ',W*0.12,H*0.46],['🧻','ウェットシート',W*0.37,H*0.46],
                         ['🛏️','首まくら',W*0.24,H*0.68]];
          goods.forEach(([e, label, x, y]) => {
            ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.fillText(e, x, y);
            ctx.fillStyle = '#16A34A'; ctx.font = 'bold 11px "Yu Gothic"'; ctx.fillText(label, x, y+22);
          });
          ctx.strokeStyle = '#BBF7D0'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W*0.25, H*0.12); ctx.lineTo(W*0.25, H*0.78); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.35); ctx.lineTo(W*0.5, H*0.35); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.58); ctx.lineTo(W*0.5, H*0.58); ctx.stroke();
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'women-disaster-prep',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF0F6', bg2: '#FFE0EE',
        msg: '防災リュックを\n準備したけど…\n女性として必要なものが入ってない気がする。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F8EEF4'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // チェックリスト
          ctx.fillStyle = 'white'; ctx.fillRect(W*0.5, H*0.18, 165, 220);
          ctx.strokeStyle = '#F9A8D4'; ctx.lineWidth = 2; ctx.strokeRect(W*0.5, H*0.18, 165, 220);
          ctx.fillStyle = '#1E293B'; ctx.font = 'bold 15px "Yu Gothic"';
          ctx.textAlign = 'left'; ctx.fillText('□ 水', W*0.52, H*0.27);
          ctx.fillText('□ 非常食', W*0.52, H*0.34);
          ctx.fillText('□ 懐中電灯', W*0.52, H*0.41);
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.fillText('← ないもの', W*0.65, H*0.5);
          ctx.fillText('生理用品？', W*0.62, H*0.57);
          ctx.fillText('プライバシー？', W*0.62, H*0.63);
          ctx.textAlign = 'center';
          ctx.fillStyle = '#F8D4E4'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '一般的な防災リストは\n女性のニーズを\n見落としがちだ。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 必需品リスト
          const items = ['生理用品 1ヶ月分','防犯ブザー','プライバシーポンチョ','使い捨て下着'];
          items.forEach((text, i) => {
            ctx.fillStyle = i < 2 ? '#DC2626' : '#7C3AED';
            ctx.fillRect(15, H*0.24+i*70, 210, 54);
            ctx.fillStyle = 'white'; ctx.font = 'bold 14px "Yu Gothic"';
            ctx.textAlign = 'center'; ctx.fillText('✅ '+text, 120, H*0.24+i*70+32);
          });
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF0F6', bg2: '#FFE0EE',
        msg: '他にはどんな\nものが必要？',
        sceneEmojis: [{ emoji: '🤔', x: W*0.72, y: H*0.32, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F8EEF4'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 吹き出しアイコン群
          ctx.font = '38px serif'; ctx.textAlign = 'center';
          [['🔕',W*0.56,H*0.32],['👙',W*0.74,H*0.32],['🛡️',W*0.88,H*0.32],
           ['💊',W*0.62,H*0.55],['🪪',W*0.8,H*0.55]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          ctx.fillStyle = '#F8D4E4'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '防犯ブザー・着替え多め\n着替えポンチョ・常備薬\n母子手帳コピーも！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          const items2 = [['🔕','防犯ブザー',W*0.12,H*0.22],['👚','着替え多め',W*0.37,H*0.22],
                          ['🧥','ポンチョ',W*0.12,H*0.46],['💊','常備薬',W*0.37,H*0.46],
                          ['📒','母子手帳コピー',W*0.24,H*0.68]];
          items2.forEach(([e, label, x, y]) => {
            ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.fillText(e, x, y);
            ctx.fillStyle = '#16A34A'; ctx.font = 'bold 11px "Yu Gothic"'; ctx.fillText(label, x, y+22);
          });
          ctx.strokeStyle = '#BBF7D0'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W*0.25, H*0.12); ctx.lineTo(W*0.25, H*0.78); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.35); ctx.lineTo(W*0.5, H*0.35); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.58); ctx.lineTo(W*0.5, H*0.58); ctx.stroke();
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'disaster-food-menu',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '7日分の食料って\n何をどのくらい\n買えばいいの？',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // スーパーの棚
          [H*0.22, H*0.4, H*0.58, H*0.72].forEach(y => {
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W*0.46, y, W*0.54, 8);
          });
          // 商品アイコン
          ctx.font = '28px serif'; ctx.textAlign = 'center';
          [['🥫',W*0.56,H*0.35],['🍜',W*0.7,H*0.35],['🥫',W*0.84,H*0.35],
           ['🍝',W*0.56,H*0.53],['🍱',W*0.7,H*0.53],['🥤',W*0.84,H*0.53]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          // ？？？
          ctx.fillStyle = '#92400E'; ctx.font = 'bold 36px "Yu Gothic"';
          ctx.fillText('？', W*0.65, H*0.68);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '1人1日2,000kcal\n×7日=14,000kcal\n4人家族で56,000kcal！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 黒板
          ctx.fillStyle = '#2D6A3F'; ctx.fillRect(15, H*0.18, 215, 200);
          ctx.strokeStyle = '#1A4228'; ctx.lineWidth = 4; ctx.strokeRect(15, H*0.18, 215, 200);
          ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 18px "Yu Gothic"';
          ctx.textAlign = 'center';
          ctx.fillText('2,000kcal', 120, H*0.28);
          ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '14px "Yu Gothic"';
          ctx.fillText('× 7日 = 14,000kcal', 120, H*0.36);
          ctx.fillText('× 4人 = 56,000kcal', 120, H*0.43);
          ctx.fillStyle = '#FFD700'; ctx.font = 'bold 16px "Yu Gothic"';
          ctx.fillText('が必要！', 120, H*0.5);
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '具体的に\n何を買えばいいの？',
        sceneEmojis: [{ emoji: '🛒', x: W*0.72, y: H*0.42, size: 110, alpha: 0.35 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: 'レトルト・缶詰・乾麺\nアルファ米を組み合わせ\nカセットコンロで温食も！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          const foods = [['🥫','缶詰',W*0.1,H*0.22],['🍜','乾麺',W*0.3,H*0.22],
                         ['🍱','レトルト',W*0.1,H*0.46],['🍚','アルファ米',W*0.3,H*0.46]];
          foods.forEach(([e,label,x,y]) => {
            ctx.font = '38px serif'; ctx.textAlign = 'center'; ctx.fillText(e, x, y);
            ctx.fillStyle = '#16A34A'; ctx.font = 'bold 12px "Yu Gothic"'; ctx.fillText(label, x, y+22);
          });
          ctx.font = '32px serif'; ctx.fillText('🔥', W*0.2, H*0.7);
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.fillText('カセットコンロで調理◎', W*0.24, H*0.77);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'earthquake-72h',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '大地震が来た！\n何から始めれば\nいいの？！',
        quake: true,
        sceneEmojis: [{ emoji: '💥', x: W*0.7, y: H*0.3, size: 90, alpha: 0.35 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // ひび割れた壁
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 3; ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.moveTo(W*0.5, 0); ctx.lineTo(W*0.54, H*0.2); ctx.lineTo(W*0.5, H*0.35); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.7, 0); ctx.lineTo(W*0.66, H*0.15); ctx.lineTo(W*0.72, H*0.3); ctx.stroke();
          ctx.globalAlpha = 1;
          // 倒れた家具
          ctx.save(); ctx.translate(W*0.8, H*0.5); ctx.rotate(0.4);
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(-15, -70, 30, 140); ctx.restore();
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: '揺れ中は\n頭を守って動くな。\n収まったら出口確保・火の元確認。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // ①頭を守る
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(15, H*0.18, 215, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 17px "Yu Gothic"';
          ctx.textAlign = 'center'; ctx.fillText('① 頭を守る・動かない', 120, H*0.18+32);
          // ②出口確保
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(15, H*0.34, 215, 50);
          ctx.fillStyle = 'white'; ctx.fillText('② 出口を確保する', 120, H*0.34+32);
          // ③火の元
          ctx.fillStyle = '#DC2626'; ctx.fillRect(15, H*0.5, 215, 50);
          ctx.fillStyle = 'white'; ctx.fillText('③ 火の元を確認', 120, H*0.5+32);
          ctx.font = '28px serif';
          [[W*0.06,H*0.22],[W*0.06,H*0.38],[W*0.06,H*0.54]].forEach(([x,y]) => ctx.fillText(['🛡️','🚪','🔥'][Math.floor((y-H*0.22)/(H*0.16))], x, y));
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: 'その後は？\n避難は？\n家族は？',
        sceneEmojis: [{ emoji: '😰', x: W*0.72, y: H*0.3, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 吹き出し（家族・避難所・スマホ）
          ctx.font = '36px serif'; ctx.textAlign = 'center';
          [['👨‍👩‍👧',W*0.6,H*0.32],['🏫',W*0.8,H*0.32],['📱',W*0.7,H*0.55]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          ctx.fillStyle = '#92400E'; ctx.font = 'bold 40px "Yu Gothic"';
          ctx.fillText('？', W*0.62, H*0.65); ctx.fillText('？', W*0.82, H*0.62);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '安否確認→情報収集\n→避難判断の順に\n行動する！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // タイムライン
          const steps = [['0〜30分','身の安全・火の元','#DC2626'],
                         ['〜3時間','安否確認・情報収集','#1D4ED8'],
                         ['〜24時間','避難判断','#D97706'],
                         ['72時間','生活態勢確立','#16A34A']];
          steps.forEach(([time, label, color], i) => {
            const y = H*0.18 + i*100;
            ctx.fillStyle = color; ctx.fillRect(15, y, 215, 80);
            ctx.fillStyle = 'white'; ctx.font = 'bold 12px "Yu Gothic"'; ctx.textAlign = 'center';
            ctx.fillText(time, 120, y+26);
            ctx.font = '13px "Yu Gothic"'; ctx.fillText(label, 120, y+50);
          });
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'disaster-storage',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '防災グッズを全部\nクローゼットの奥に\nしまったけど正しい？',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // クローゼット（ぎゅうぎゅう）
          ctx.fillStyle = '#8B5E3C'; ctx.fillRect(W*0.5, H*0.18, 170, 200);
          ctx.fillStyle = '#A0D0A0'; ctx.fillRect(W*0.52, H*0.2, 80, 196);
          ctx.fillStyle = '#90B890'; ctx.fillRect(W*0.63, H*0.2, 75, 196);
          ctx.fillStyle = '#555'; ctx.fillRect(W*0.5 + 75, H*0.18, 6, 200);
          // 詰め込まれたグッズ（奥）
          ctx.font = '20px serif'; ctx.textAlign = 'center';
          [['💧',W*0.58,H*0.32],['🥫',W*0.7,H*0.32],['🔦',W*0.58,H*0.45],['🎒',W*0.7,H*0.45]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(W*0.52, H*0.2, 160, 196);
          ctx.fillStyle = '#8B5E3C'; ctx.font = 'bold 14px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('奥…', W*0.63, H*0.52);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: '危険だ！地震で\n家が散乱したとき\n奥のグッズに手が届かなくなる。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W*0.5, H);
          // 瓦礫でクローゼットが塞がれている
          ctx.fillStyle = '#888'; ctx.fillRect(30, H*0.18, 200, 180);
          ctx.fillStyle = '#666'; ctx.fillRect(32, H*0.2, 196, 176);
          // 瓦礫
          ctx.fillStyle = '#8B7355'; [[20,H*0.4,80,30],[60,H*0.38,70,35],[15,H*0.5,90,25],[80,H*0.46,60,40]].forEach(([x,y,w,h]) => ctx.fillRect(x,y,w,h));
          // 赤×
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 10; ctx.globalAlpha = 0.75;
          ctx.beginPath(); ctx.moveTo(15, H*0.15); ctx.lineTo(235, H*0.52); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(235, H*0.15); ctx.lineTo(15, H*0.52); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 14px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('取り出せない！', W*0.24, H*0.66);
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: 'じゃあどこに\n置けばいいの？',
        sceneEmojis: [{ emoji: '🤔', x: W*0.72, y: H*0.32, size: 90, alpha: 0.3 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '玄関・寝室・リビング・車\n4か所に分散！\nどこで被災しても手が届く！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // 間取り図（簡易）
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 3;
          ctx.strokeRect(15, H*0.14, 215, 250);
          // 玄関
          ctx.fillStyle = '#EF9A34'; ctx.fillRect(15, H*0.32, 50, 32);
          ctx.fillStyle = 'white'; ctx.font = 'bold 10px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('玄関🎒', 40, H*0.32+20);
          // 寝室
          ctx.fillStyle = '#3B82F6'; ctx.fillRect(15, H*0.14, 100, 70);
          ctx.fillStyle = 'white'; ctx.font = 'bold 10px "Yu Gothic"'; ctx.fillText('寝室🔦', 65, H*0.14+38);
          // リビング
          ctx.fillStyle = '#16A34A'; ctx.fillRect(130, H*0.14, 100, 130);
          ctx.fillStyle = 'white'; ctx.font = 'bold 10px "Yu Gothic"'; ctx.fillText('リビング💧', 180, H*0.14+65);
          // 車
          ctx.fillStyle = '#7C3AED'; ctx.fillRect(130, H*0.32, 100, 70);
          ctx.fillStyle = 'white'; ctx.fillText('車🚗', 180, H*0.32+38);
          // ✅
          ctx.font = '28px serif'; ctx.fillText('✅', W*0.24, H*0.72);
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 12px "Yu Gothic"';
          ctx.fillText('分散収納が正解！', W*0.24, H*0.78);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'family-disaster-plan',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: 'もし学校にいるとき\n大地震が来たら\n家族とどこで会えばいいの？',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // 家族がバラバラ（吹き出し）
          ctx.font = '28px serif'; ctx.textAlign = 'center';
          [['🏫',W*0.58,H*0.28],['🏢',W*0.8,H*0.28],['🏠',W*0.68,H*0.52]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          // ？
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.setLineDash([8,6]);
          ctx.beginPath(); ctx.moveTo(W*0.58, H*0.35); ctx.lineTo(W*0.68, H*0.45); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.8, H*0.35); ctx.lineTo(W*0.68, H*0.45); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#92400E'; ctx.font = 'bold 28px "Yu Gothic"'; ctx.fillText('？', W*0.68, H*0.45);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#EFF6FF', bg2: '#DBEAFE',
        msg: 'それを事前に決めておく\nのが家族の防災計画だ。\n3点セットを今決めよう。',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8F0FA'; ctx.fillRect(0, 0, W*0.5, H);
          // 3点チェックリスト
          const pts = [['📍','集合場所'],['📞','連絡方法'],['👥','役割分担']];
          pts.forEach(([e, label], i) => {
            const y = H*0.22 + i*90;
            ctx.fillStyle = '#1E3A8A'; ctx.fillRect(15, y, 215, 70);
            ctx.font = '26px serif'; ctx.textAlign = 'left'; ctx.fillText(e, 25, y+44);
            ctx.fillStyle = 'white'; ctx.font = 'bold 16px "Yu Gothic"';
            ctx.fillText('✅ '+label, 58, y+44);
          });
          ctx.fillStyle = '#C0D0E0'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: 'どうやって\n決めればいいの？',
        sceneEmojis: [{ emoji: '✍️', x: W*0.72, y: H*0.42, size: 90, alpha: 0.35 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '公園を集合場所に決め\n171の練習をする\n9月1日に年1回見直す！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // 地図（集合場所）
          ctx.fillStyle = '#C8D8B8'; ctx.fillRect(15, H*0.16, 215, 140);
          ctx.font = '24px serif'; ctx.textAlign = 'center';
          ctx.fillText('🌳', 120, H*0.26); ctx.fillText('🏠', 55, H*0.38); ctx.fillText('🏫', 185, H*0.38);
          ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 4; ctx.setLineDash([8,5]);
          ctx.beginPath(); ctx.moveTo(55, H*0.35); ctx.lineTo(120, H*0.28); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(185, H*0.35); ctx.lineTo(120, H*0.28); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#DC2626'; ctx.font = '20px serif'; ctx.fillText('📍', 120, H*0.25);
          // 171
          ctx.fillStyle = '#1E3A8A'; ctx.fillRect(15, H*0.44, 100, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 18px "Yu Gothic"'; ctx.fillText('171', 65, H*0.44+32);
          // カレンダー
          ctx.fillStyle = '#D97706'; ctx.fillRect(130, H*0.44, 100, 50);
          ctx.fillStyle = 'white'; ctx.font = 'bold 14px "Yu Gothic"'; ctx.fillText('9/1 見直し', 180, H*0.44+32);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'disaster-communication',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FDECC8',
        msg: '大地震！家族に\n連絡しなきゃ！\nあれ電話がつながらない！',
        quake: true,
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // スマホ（つながらない）
          ctx.fillStyle = '#333'; ctx.fillRect(W*0.6, H*0.22, 85, 150);
          ctx.fillStyle = '#444'; ctx.fillRect(W*0.62, H*0.24, 81, 130);
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 20px "Yu Gothic"'; ctx.textAlign = 'center';
          ctx.fillText('通話不可', W*0.65, H*0.4);
          ctx.font = '30px serif'; ctx.fillText('📵', W*0.82, H*0.35);
          // ×
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 8; ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.moveTo(W*0.58, H*0.2); ctx.lineTo(W*0.78, H*0.4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.78, H*0.2); ctx.lineTo(W*0.58, H*0.4); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: '大規模地震後は\n電話回線がパンクして\nつながらなくなる。171を使え！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W*0.5, H);
          // 回線パンクの図
          ctx.font = '20px serif'; ctx.textAlign = 'center';
          const phones = [[W*0.08,H*0.22],[W*0.22,H*0.18],[W*0.36,H*0.22],[W*0.08,H*0.38],[W*0.22,H*0.42],[W*0.36,H*0.38]];
          phones.forEach(([x,y]) => ctx.fillText('📱', x, y));
          // 矢印が中央に集中
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
          phones.forEach(([x,y]) => {
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(W*0.22, H*0.58); ctx.stroke();
          });
          ctx.globalAlpha = 1;
          // パンク！
          ctx.fillStyle = '#DC2626'; ctx.fillRect(75, H*0.56, 85, 35);
          ctx.fillStyle = 'white'; ctx.font = 'bold 14px "Yu Gothic"'; ctx.fillText('パンク！', 118, H*0.56+22);
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFF9E6', bg2: '#FEF3C7',
        msg: '171って何？\nどうやって\n使うの？',
        sceneEmojis: [{ emoji: '❓', x: W*0.72, y: H*0.35, size: 90, alpha: 0.35 }],
        extraDraw(ctx) {
          ctx.fillStyle = '#F5EDD8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '171に電話→録音\n→家族が再生\nLINEテキストも有効！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // 手順図
          const steps2 = [['① 171 に電話','#1E3A8A'],['② メッセージを録音','#1E3A8A'],['③ 家族が再生','#16A34A']];
          steps2.forEach(([label, color], i) => {
            ctx.fillStyle = color; ctx.fillRect(15, H*0.18+i*85, 215, 65);
            ctx.fillStyle = 'white'; ctx.font = 'bold 16px "Yu Gothic"'; ctx.textAlign = 'center';
            ctx.fillText(label, 120, H*0.18+i*85+36);
          });
          // 矢印（下へ）
          ctx.fillStyle = '#94A3B8'; ctx.font = '24px serif';
          ctx.fillText('↓', 120, H*0.38); ctx.fillText('↓', 120, H*0.48);
          // LINE
          ctx.fillStyle = '#06C755'; ctx.fillRect(15, H*0.56+H*0.04, 215, 55);
          ctx.fillStyle = 'white'; ctx.font = 'bold 15px "Yu Gothic"'; ctx.fillText('+ LINEテキストも有効！', 120, H*0.56+H*0.04+32);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },

  {
    slug: 'disaster-heat-summer',
    panels: [
      {
        char: RISS, charSide: 'left',
        bg1: '#FFFBEB', bg2: '#FEF3C7',
        msg: '停電してエアコンが\n使えない！室温が\nどんどん上がってる！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FDECC8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // エアコン（×）
          ctx.fillStyle = '#888'; ctx.fillRect(W*0.5, 60, 165, 60);
          ctx.fillStyle = '#AAA'; ctx.fillRect(W*0.52, 64, 161, 52);
          ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 8; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(W*0.48, 50); ctx.lineTo(W*0.82, 130); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W*0.82, 50); ctx.lineTo(W*0.48, 130); ctx.stroke();
          ctx.globalAlpha = 1;
          // 温度計（高温）
          ctx.font = '40px serif'; ctx.textAlign = 'center'; ctx.fillText('🌡️', W*0.68, H*0.4);
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 24px "Yu Gothic"'; ctx.fillText('37℃', W*0.82, H*0.38);
          // 陽炎
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.globalAlpha = 0.35;
          for (let i = 0; i < 5; i++) {
            const x = W*0.5 + i*35;
            ctx.beginPath(); ctx.moveTo(x, H*0.5);
            ctx.bezierCurveTo(x-10, H*0.55, x+10, H*0.6, x, H*0.65); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#FEF2F2', bg2: '#FEE2E2',
        msg: '夏の停電は\n熱中症で命を落とすリスクがある。\n特に高齢者・子どもは注意！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FFDEDE'; ctx.fillRect(0, 0, W*0.5, H);
          // 要注意グループ
          ctx.font = '36px serif'; ctx.textAlign = 'center';
          [['👴',W*0.1,H*0.28],['👵',W*0.26,H*0.28],['👶',W*0.42,H*0.28]].forEach(([e,x,y]) => ctx.fillText(e, x, y));
          ctx.fillStyle = '#DC2626'; ctx.font = 'bold 14px "Yu Gothic"';
          ctx.fillText('高齢者・子どもは特に注意', W*0.24, H*0.4);
          // 危険温度
          ctx.fillStyle = '#7F1D1D'; ctx.fillRect(15, H*0.46, 215, 60);
          ctx.fillStyle = 'white'; ctx.font = 'bold 16px "Yu Gothic"';
          ctx.fillText('車内は1時間で60℃以上！', W*0.24, H*0.46+38);
          // 警告
          ctx.font = '40px serif'; ctx.fillText('⚠️', W*0.24, H*0.7);
          ctx.fillStyle = '#FFCECE'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: RISS, charSide: 'left',
        bg1: '#FFFBEB', bg2: '#FEF3C7',
        msg: '電気なしで\nどうやって涼めば\nいいの？',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#FDECC8'; ctx.fillRect(W*0.44, 0, W*0.56, H);
          // うちわで扇ぐが効かない（汗）
          ctx.font = '40px serif'; ctx.textAlign = 'center';
          ctx.fillText('🪭', W*0.7, H*0.38);
          // 汗
          ctx.font = '24px serif';
          ctx.fillText('💧', W*0.58, H*0.3); ctx.fillText('💧', W*0.82, H*0.28); ctx.fillText('💧', W*0.62, H*0.45);
          // まだ暑い（温度計）
          ctx.fillText('🌡️', W*0.8, H*0.48);
          ctx.fillStyle = '#C8B090'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
      {
        char: ROBOT, charSide: 'right',
        bg1: '#F0FDF4', bg2: '#DCFCE7',
        msg: '涼しい場所に移動\n水分と塩分補給\n冷却グッズで乗り切る！',
        sceneEmojis: [],
        extraDraw(ctx) {
          ctx.fillStyle = '#E8FAF0'; ctx.fillRect(0, 0, W*0.5, H);
          // 3つの対策
          const measures = [['🏫','涼しい場所へ移動',W*0.12,H*0.22],
                            ['💧','水分・塩分補給',W*0.37,H*0.22],
                            ['🧊','冷却グッズ',W*0.24,H*0.52]];
          measures.forEach(([e, label, x, y]) => {
            ctx.font = '38px serif'; ctx.textAlign = 'center'; ctx.fillText(e, x, y);
            ctx.fillStyle = '#16A34A'; ctx.font = 'bold 12px "Yu Gothic"'; ctx.fillText(label, x, y+22);
          });
          // 区切り線
          ctx.strokeStyle = '#BBF7D0'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W*0.25, H*0.12); ctx.lineTo(W*0.25, H*0.42); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, H*0.42); ctx.lineTo(W*0.5, H*0.42); ctx.stroke();
          // 経口補水液
          ctx.font = '28px serif'; ctx.fillText('🧉', W*0.14, H*0.72);
          ctx.fillStyle = '#16A34A'; ctx.font = 'bold 11px "Yu Gothic"'; ctx.fillText('経口補水液', W*0.14, H*0.78);
          ctx.fillStyle = '#B8E8C8'; ctx.fillRect(0, H*0.82, W, H*0.18);
        },
      },
    ],
  },
];

// ── 実行 ─────────────────────────────────────────────

async function main() {
  const rissImg  = await loadImage(fs.readFileSync(path.join(__dirname, '../public/img/riss.png')));
  const robotImg = await loadImage(fs.readFileSync(path.join(__dirname, '../public/img/robot.png')));

  for (const article of [...ARTICLES, ...ARTICLES2, ...ARTICLES3]) {
    const dir = path.join(__dirname, `../public/manga/${article.slug}`);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < article.panels.length; i++) {
      const p = article.panels[i];
      const c = p.char;

      const canvas = await drawPanel({
        charImg:      p.char === RISS ? rissImg : robotImg,
        charSide:     p.charSide,
        charName:     c.name,
        panelNum:     i + 1,
        numBg1:       c.numBg1,
        numBg2:       c.numBg2,
        bg1:          p.bg1,
        bg2:          p.bg2,
        sceneEmojis:  p.sceneEmojis || [],
        extraDraw:    p.extraDraw || null,
        quake:        p.quake || false,
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
