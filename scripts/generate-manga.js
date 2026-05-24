// @ts-check
'use strict';

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// ── キャンバスサイズ ──────────────────────────────────
const W = 600;
const H = 800;

// ── キャラクター定義 ──────────────────────────────────
const CHARS = {
  riss: {
    img: path.join(__dirname, '../public/img/riss.png'),
    name: '防災リス',
    bg: '#FFFBEB',
    bgBottom: '#FFF3C7',
    bubble: '#FFFFFF',
    bubbleBorder: '#F59E0B',
    nameColor: '#92400E',
    nameBg: 'rgba(245,158,11,0.18)',
    textColor: '#78350F',
    numBg1: '#FF8C00',
    numBg2: '#FFD000',
    shadowColor: 'rgba(245,158,11,0.35)',
  },
  robot: {
    img: path.join(__dirname, '../public/img/robot.png'),
    name: 'レスQロボ',
    bg: '#EFF6FF',
    bgBottom: '#DBEAFE',
    bubble: '#FFFFFF',
    bubbleBorder: '#3B82F6',
    nameColor: '#1E3A8A',
    nameBg: 'rgba(59,130,246,0.15)',
    textColor: '#1E40AF',
    numBg1: '#1E3A8A',
    numBg2: '#06B6D4',
    shadowColor: 'rgba(59,130,246,0.30)',
  },
};

// ── パネルデータ ──────────────────────────────────────
const ARTICLES = [
  {
    slug: 'kids-earthquake-rules',
    panels: [
      { char: 'riss',  msg: '地震が来たとき、\n子どもはどうすれば\nいいの？',      icon: '🏫', iconLabel: '学校' },
      { char: 'robot', msg: 'まず机の下に入れ。\n頭を守り、揺れが収まるまで\n動くな。', icon: '🪑', iconLabel: '机の下' },
      { char: 'riss',  msg: '机の下がないときは\nどうするの？',                    icon: '🎒', iconLabel: 'かばん' },
      { char: 'robot', msg: 'かばんで頭を守り、\n柱に近づいてしゃがめ。',           icon: '🏛️', iconLabel: '柱' },
    ],
  },
  {
    slug: 'kids-shelter-basics',
    panels: [
      { char: 'riss',  msg: '避難所ってどんな\n場所なの？\n行ったことない…',         icon: '🏫', iconLabel: '避難所' },
      { char: 'robot', msg: '学校の体育館や\n公民館が多い。\n大勢で過ごす場所だ。',   icon: '🏟️', iconLabel: '体育館' },
      { char: 'riss',  msg: 'ご飯やトイレは\nどうなるの？',                         icon: '🍱', iconLabel: '配給' },
      { char: 'robot', msg: '食事は配給、\nトイレは共用。\n不便でも安全な場所だ。',   icon: '🤝', iconLabel: '助け合い' },
    ],
  },
  {
    slug: 'earthquake-car',
    panels: [
      { char: 'riss',  msg: '運転中に地震！\nどうすればいいの！？',                  icon: '🚗', iconLabel: '車' },
      { char: 'robot', msg: '慌てるな。\nゆっくり減速して\n路肩に寄れ。',             icon: '🛑', iconLabel: '減速' },
      { char: 'robot', msg: '急ブレーキはNG。\n橋やトンネルの\n手前で停車しろ。',     icon: '🌉', iconLabel: '橋注意' },
      { char: 'riss',  msg: '鍵をつけたまま\n車を離れるのも\n忘れずだね！',           icon: '🔑', iconLabel: '鍵' },
    ],
  },
  {
    slug: 'earthquake-highrise',
    panels: [
      { char: 'riss',  msg: '高層マンションで\n地震！すぐ逃げないと\nいけない？',     icon: '🏢', iconLabel: '高層' },
      { char: 'robot', msg: '揺れている間は\n動くな。\n高層は揺れが長い。',           icon: '🌊', iconLabel: '長周期' },
      { char: 'robot', msg: '高層は長周期地震動で\n5分以上揺れることも\nある。',      icon: '⏱️', iconLabel: '5分以上' },
      { char: 'riss',  msg: '揺れが収まったら\n階段で。エレベーターは\n絶対ダメだ！', icon: '🚶', iconLabel: '階段' },
    ],
  },
  {
    slug: 'earthquake-sleep',
    panels: [
      { char: 'riss',  msg: '寝てるときに地震！\nどうしたらいい！？',                icon: '🛏️', iconLabel: '就寝中' },
      { char: 'robot', msg: '布団から出るな。\n枕で頭を守れ。',                      icon: '🛌', iconLabel: '布団' },
      { char: 'robot', msg: '暗闇で動くと\nガラスで足を切るぞ。\n収まるまで待て。',   icon: '⚠️', iconLabel: 'ガラス注意' },
      { char: 'riss',  msg: '枕元にスリッパと\n懐中電灯を置いておけば\n安心だね！',   icon: '🔦', iconLabel: '枕元備品' },
    ],
  },
  {
    slug: 'evacuation-dvt',
    panels: [
      { char: 'riss',  msg: '避難所でじっとして\nいるけど、足が\nむくんできた…',      icon: '🏃', iconLabel: '避難所' },
      { char: 'robot', msg: 'エコノミークラス\n症候群の危険信号だ。\nすぐ動け。',     icon: '🩺', iconLabel: '血栓注意' },
      { char: 'robot', msg: '同じ姿勢で血流が\n悪くなる。足首を\n動かして水を飲め。', icon: '💧', iconLabel: '水分補給' },
      { char: 'riss',  msg: '足首を動かして\n水を飲む。これだけで\n全然違う！',       icon: '✅', iconLabel: '予防OK' },
    ],
  },
  {
    slug: 'musashino-shelters',
    panels: [
      { char: 'riss',  msg: '地震が来たら\nどこの避難所に\n行けばいいの？',           icon: '🗺️', iconLabel: '武蔵野市' },
      { char: 'robot', msg: '自宅が安全なら\n在宅避難が基本だ。\nまず確認しろ。',     icon: '🏠', iconLabel: '在宅避難' },
      { char: 'robot', msg: '武蔵野市の避難所は\n学校・公民館が\n中心だ。',          icon: '📍', iconLabel: '42か所' },
      { char: 'riss',  msg: '事前に経路を\n確認しておくんだね！\n今すぐやる！',       icon: '👟', iconLabel: '経路確認' },
    ],
  },
  {
    slug: 'disaster-rolling-stock',
    panels: [
      { char: 'riss',  msg: '備蓄を買っても\n賞味期限切れに\nしてしまう…',           icon: '😓', iconLabel: '期限切れ' },
      { char: 'robot', msg: 'ローリングストックにしろ。\n普段のものを\n多めに買え。',  icon: '🔄', iconLabel: '循環備蓄' },
      { char: 'riss',  msg: '特別な非常食を\n用意しなきゃ\nいけないの？',             icon: '🤔', iconLabel: '疑問' },
      { char: 'robot', msg: 'いらない。普段の食品を\n+1個多めに\n持つだけだ。',       icon: '➕', iconLabel: '+1個' },
    ],
  },
];

// ── ユーティリティ ────────────────────────────────────

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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = text.split('\n');
  let totalLines = [];
  for (const line of lines) {
    if (line === '') { totalLines.push(''); continue; }
    // Split by characters for Japanese
    let current = '';
    for (const ch of line) {
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        totalLines.push(current);
        current = ch;
      } else {
        current = test;
      }
    }
    if (current) totalLines.push(current);
  }
  totalLines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });
  return totalLines.length;
}

// ── パネル描画 ────────────────────────────────────────

async function drawPanel(charImg, panelNum, charName, message, icon, iconLabel, colors) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 背景グラデーション
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, colors.bg);
  bgGrad.addColorStop(1, colors.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 外枠
  ctx.strokeStyle = colors.bubbleBorder;
  ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  // 内枠（薄い）
  ctx.strokeStyle = colors.bubbleBorder + '44';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  // 大きなアイコン背景（薄く右下）
  ctx.font = '140px serif';
  ctx.globalAlpha = 0.07;
  ctx.fillText(icon, W - 175, H - 200);
  ctx.globalAlpha = 1;

  // キャラクター画像（上部中央）
  const charSize = 300;
  const charX = (W - charSize) / 2;
  const charY = 44;
  const frameR = 20;
  const framePad = 14;

  // キャラクターフレーム（白背景＋影）
  ctx.shadowColor = colors.shadowColor;
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  roundRect(ctx, charX - framePad, charY - framePad, charSize + framePad * 2, charSize + framePad * 2, frameR);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // フレームボーダー
  ctx.strokeStyle = colors.bubbleBorder + '66';
  ctx.lineWidth = 2;
  roundRect(ctx, charX - framePad, charY - framePad, charSize + framePad * 2, charSize + framePad * 2, frameR);
  ctx.stroke();

  // キャラクター本体
  ctx.drawImage(charImg, charX, charY, charSize, charSize);

  // キャラクター名バッジ
  const nameFont = 'bold 22px "Yu Gothic"';
  ctx.font = nameFont;
  const nameMeasure = ctx.measureText(charName);
  const nameBadgeW = nameMeasure.width + 28;
  const nameBadgeH = 34;
  const nameBadgeX = (W - nameBadgeW) / 2;
  const nameBadgeY = charY + charSize + 4;

  ctx.fillStyle = colors.nameBg;
  roundRect(ctx, nameBadgeX, nameBadgeY, nameBadgeW, nameBadgeH, 17);
  ctx.fill();

  ctx.fillStyle = colors.nameColor;
  ctx.font = nameFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(charName, W / 2, nameBadgeY + nameBadgeH / 2);

  // 吹き出しエリア
  const bubbleTop = charY + charSize + nameBadgeH + 22;
  const bubbleLeft = 22;
  const bubbleRight = W - 22;
  const bubbleW = bubbleRight - bubbleLeft;
  const bubbleH = H - bubbleTop - 22;
  const bubbleRadius = 20;

  // 吹き出し三角（上部中央）
  ctx.fillStyle = colors.bubbleBorder;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 14, bubbleTop);
  ctx.lineTo(W / 2 + 14, bubbleTop);
  ctx.lineTo(W / 2, bubbleTop - 18);
  ctx.closePath();
  ctx.fill();

  // 吹き出し本体 - 影
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = colors.bubble;
  roundRect(ctx, bubbleLeft, bubbleTop, bubbleW, bubbleH, bubbleRadius);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 吹き出しボーダー
  ctx.strokeStyle = colors.bubbleBorder;
  ctx.lineWidth = 3;
  roundRect(ctx, bubbleLeft, bubbleTop, bubbleW, bubbleH, bubbleRadius);
  ctx.stroke();

  // メッセージテキスト
  const fontSize = message.length > 30 ? 28 : 32;
  ctx.font = `bold ${fontSize}px "Yu Gothic"`;
  ctx.fillStyle = colors.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const textPaddingX = 30;
  const textMaxW = bubbleW - textPaddingX * 2;
  const lineH = fontSize * 1.65;
  const lines = message.split('\n');
  const totalH = lines.length * lineH;
  const textStartY = bubbleTop + (bubbleH - totalH) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, textStartY + i * lineH);
  });

  // パネル番号バッジ
  const badgeSize = 52;
  const badgeX = W - badgeSize - 12;
  const badgeY = 12;

  const numGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize);
  numGrad.addColorStop(0, colors.numBg1);
  numGrad.addColorStop(1, colors.numBg2);

  ctx.shadowColor = colors.shadowColor;
  ctx.shadowBlur = 10;
  ctx.fillStyle = numGrad;
  ctx.beginPath();
  ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'white';
  ctx.font = 'bold 30px "Yu Gothic"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(panelNum), badgeX + badgeSize / 2, badgeY + badgeSize / 2);

  // アイコンラベル（左上）
  ctx.font = 'bold 18px "Yu Gothic"';
  ctx.fillStyle = colors.nameColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const labelBgW = ctx.measureText(iconLabel).width + 36;
  ctx.fillStyle = colors.nameBg;
  roundRect(ctx, 12, 14, labelBgW, 34, 17);
  ctx.fill();
  ctx.font = '20px serif';
  ctx.fillText(icon, 16, 31);
  ctx.font = 'bold 17px "Yu Gothic"';
  ctx.fillStyle = colors.nameColor;
  ctx.fillText(iconLabel, 40, 31);

  return canvas;
}

// ── メイン処理 ────────────────────────────────────────

async function main() {
  const rissImg  = await loadImage(fs.readFileSync(CHARS.riss.img));
  const robotImg = await loadImage(fs.readFileSync(CHARS.robot.img));
  const charImages = { riss: rissImg, robot: robotImg };

  for (const article of ARTICLES) {
    const dir = path.join(__dirname, `../public/manga/${article.slug}`);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < article.panels.length; i++) {
      const p = article.panels[i];
      const colors = CHARS[p.char];
      const charImg = charImages[p.char];

      const canvas = await drawPanel(
        charImg,
        i + 1,
        colors.name,
        p.msg,
        p.icon,
        p.iconLabel,
        colors,
      );

      const outPath = path.join(dir, `panel-0${i + 1}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ ${article.slug}/panel-0${i + 1}.png`);
    }
  }

  console.log('\n🎉 全パネル生成完了！');
}

main().catch(console.error);
