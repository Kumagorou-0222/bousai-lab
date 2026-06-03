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

// tail: 'left'|'right'|'top'|'bottom'|'bl'|'br' or null
function drawBubble(ctx, bx, by, bw, bh, tail, fill, border) {
  roundRect(ctx, bx, by, bw, bh, 18);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  if (!tail) return;
  const tw = 22, tl = 30;
  ctx.save(); ctx.beginPath();
  if (tail === 'left') {
    ctx.moveTo(bx+2, by+bh/2-tw/2); ctx.lineTo(bx-tl, by+bh/2); ctx.lineTo(bx+2, by+bh/2+tw/2);
  } else if (tail === 'right') {
    ctx.moveTo(bx+bw-2, by+bh/2-tw/2); ctx.lineTo(bx+bw+tl, by+bh/2); ctx.lineTo(bx+bw-2, by+bh/2+tw/2);
  } else if (tail === 'bottom') {
    ctx.moveTo(bx+bw/2-tw/2, by+bh-2); ctx.lineTo(bx+bw/2, by+bh+tl); ctx.lineTo(bx+bw/2+tw/2, by+bh-2);
  } else if (tail === 'top') {
    ctx.moveTo(bx+bw/2-tw/2, by+2); ctx.lineTo(bx+bw/2, by-tl); ctx.lineTo(bx+bw/2+tw/2, by+2);
  } else if (tail === 'bl') {
    ctx.moveTo(bx+16, by+bh-2); ctx.lineTo(bx-12, by+bh+tl); ctx.lineTo(bx+16+tw, by+bh-2);
  } else if (tail === 'br') {
    ctx.moveTo(bx+bw-16-tw, by+bh-2); ctx.lineTo(bx+bw+12, by+bh+tl); ctx.lineTo(bx+bw-16, by+bh-2);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 3.5; ctx.stroke();
  // seam cover
  ctx.strokeStyle = fill; ctx.lineWidth = 5; ctx.beginPath();
  if (tail === 'left')   { ctx.moveTo(bx+3,by+bh/2-tw/2+3); ctx.lineTo(bx+3,by+bh/2+tw/2-3); }
  if (tail === 'right')  { ctx.moveTo(bx+bw-3,by+bh/2-tw/2+3); ctx.lineTo(bx+bw-3,by+bh/2+tw/2-3); }
  if (tail === 'bottom') { ctx.moveTo(bx+bw/2-tw/2+3,by+bh-3); ctx.lineTo(bx+bw/2+tw/2-3,by+bh-3); }
  if (tail === 'top')    { ctx.moveTo(bx+bw/2-tw/2+3,by+3); ctx.lineTo(bx+bw/2+tw/2-3,by+3); }
  if (tail === 'bl')     { ctx.moveTo(bx+18,by+bh-3); ctx.lineTo(bx+16+tw-2,by+bh-3); }
  if (tail === 'br')     { ctx.moveTo(bx+bw-16-tw+2,by+bh-3); ctx.lineTo(bx+bw-18,by+bh-3); }
  ctx.stroke(); ctx.restore();
}

function drawBubbleText(ctx, msg, bx, by, bw, bh, color) {
  const n = msg.replace(/\n/g,'').length;
  const fs = n > 20 ? 21 : n > 14 ? 25 : 29;
  ctx.font = `bold ${fs}px "Yu Gothic"`;
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = msg.split('\n'), lh = fs * 1.65;
  const sy = by + bh/2 - ((lines.length-1)*lh)/2;
  lines.forEach((ln, i) => ctx.fillText(ln, bx+bw/2, sy+i*lh));
}

function drawBadge(ctx, num, bg1, bg2) {
  const bx = W-56, by = 8, br = 24;
  const g = ctx.createLinearGradient(bx,by,bx+br*2,by+br*2);
  g.addColorStop(0,bg1); g.addColorStop(1,bg2);
  ctx.shadowColor='rgba(0,0,0,0.35)'; ctx.shadowBlur=10;
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(bx+br,by+br,br,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='white'; ctx.font='bold 28px "Yu Gothic"';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(String(num),bx+br,by+br);
}

function drawChar(ctx, img, x, y, size, flip) {
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.25)'; ctx.shadowBlur=18; ctx.shadowOffsetY=10;
  if (flip) { ctx.translate(x+size,y); ctx.scale(-1,1); ctx.drawImage(img,0,0,size,size); }
  else { ctx.drawImage(img,x,y,size,size); }
  ctx.restore();
}

function nameTag(ctx, name, cx, y, bg, fg) {
  ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
  const nw = ctx.measureText(name).width + 16, nh = 22;
  roundRect(ctx, cx-nw/2, y, nw, nh, 8);
  ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(name, cx, y+14);
}

// ── 場面プリミティブ ───────────────────────────────────────

function drawRain(ctx, alpha, x0, y0, w, h, n=30) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#88BBDD'; ctx.lineWidth=1.5;
  for (let i=0;i<n;i++) {
    const rx=x0+(i*43%w), ry=y0+(i*67%h);
    ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx-12,ry+50); ctx.stroke();
  }
  ctx.restore();
}

function drawSpeedLines(ctx, cx, cy, n, r1, r2, color, alpha) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle=color; ctx.lineWidth=1.5;
  for (let i=0;i<n;i++) {
    const a=(i/n)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawImpact(ctx, cx, cy, size, color) {
  ctx.save(); ctx.fillStyle=color;
  const pts=8; ctx.beginPath();
  for (let i=0;i<pts*2;i++) {
    const r=i%2===0?size:size*0.42;
    const a=(i/(pts*2))*Math.PI*2 - Math.PI/2;
    i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawCheck(ctx, cx, cy, size, color) {
  ctx.strokeStyle=color; ctx.lineWidth=size*0.16; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.shadowColor=color+'55'; ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.moveTo(cx-size*0.38,cy+size*0.05); ctx.lineTo(cx-size*0.05,cy+size*0.38);
  ctx.lineTo(cx+size*0.42,cy-size*0.32);
  ctx.stroke(); ctx.shadowBlur=0;
}

function drawSun(ctx, cx, cy, r) {
  ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#FFDD44'; ctx.lineWidth=3; ctx.globalAlpha=0.6;
  for (let i=0;i<10;i++) {
    const a=(i/10)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*(r+6),cy+Math.sin(a)*(r+6));
    ctx.lineTo(cx+Math.cos(a)*(r+24),cy+Math.sin(a)*(r+24));
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawPerson(ctx, cx, cy, size, color, alpha) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=color;
  ctx.beginPath(); ctx.arc(cx,cy-size*0.55,size*0.2,0,Math.PI*2); ctx.fill();
  ctx.fillRect(cx-size*0.15,cy-size*0.34,size*0.3,size*0.32);
  ctx.fillRect(cx-size*0.15,cy-size*0.02,size*0.12,size*0.28);
  ctx.fillRect(cx+size*0.03,cy-size*0.02,size*0.12,size*0.28);
  ctx.restore();
}

function drawVirus(ctx, cx, cy, r, col, spikes, alpha) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=col;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  for (let i=0;i<spikes;i++) {
    const a=(i/spikes)*Math.PI*2, len=r*0.45+(i%2)*r*0.15;
    const x2=cx+Math.cos(a)*(r+len), y2=cy+Math.sin(a)*(r+len);
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x2,y2,r*0.18,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=r*0.12;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.restore();
}

function drawSfx(ctx, text, cx, cy, size, color) {
  ctx.save();
  ctx.font = `bold ${size}px "Yu Gothic"`;
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'white'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.strokeText(text, cx, cy);
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

// 窓（嵐）
function drawStormWindow(ctx, x, y, w, h) {
  ctx.fillStyle = '#3A5070'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle = '#2A3848'; ctx.lineWidth=4; ctx.strokeRect(x,y,w,h);
  ctx.strokeStyle = '#2A3848'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x+w/2,y); ctx.lineTo(x+w/2,y+h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y+h/2); ctx.lineTo(x+w,y+h/2); ctx.stroke();
  drawRain(ctx, 0.7, x+2, y+2, w-4, h-4, 16);
}

// TV（警報）
function drawTV(ctx, x, y, w, h, label1, label2) {
  ctx.fillStyle='#111'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle='#CC0000'; ctx.fillRect(x+4,y+4,w-8,h-24);
  ctx.fillStyle='#FF3333'; ctx.fillRect(x+4,y+4,w-8,26);
  ctx.fillStyle='white'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
  ctx.fillText('緊急警報', x+w/2, y+20);
  ctx.font='bold 22px "Yu Gothic"'; ctx.fillText(label1, x+w/2, y+h/2-4);
  ctx.font='bold 15px "Yu Gothic"'; ctx.fillText(label2, x+w/2, y+h/2+18);
  ctx.fillStyle='#222'; ctx.fillRect(x+w/2-12,y+h-18,24,10);
  ctx.fillRect(x+w/2-20,y+h-8,40,5);
}

// 避難所建物
function drawShelter(ctx, x, y, w, h) {
  ctx.fillStyle='#C8D8E8'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#8899AA'; ctx.lineWidth=2; ctx.strokeRect(x,y,w,h);
  ctx.fillStyle='#8899AA'; ctx.fillRect(x,y,w,20);
  for (let r=0;r<3;r++) for (let c=0;c<3;c++) {
    const wx=x+14+c*(w-28)/3, wy=y+28+r*50;
    ctx.fillStyle='#A8D0E8'; ctx.fillRect(wx,wy,(w-28)/3-8,36);
  }
  const dx=x+(w-40)/2, dy=y+h-60;
  ctx.fillStyle='#6B4226'; ctx.fillRect(dx,dy,40,60);
  ctx.fillStyle='#15803D'; ctx.fillRect(x,y+h-85,w,28);
  ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
  ctx.fillText('避難所', x+w/2, y+h-66);
}

// ── パネルエンジン ────────────────────────────────────────

async function drawPanel({ bgDraw, sceneDraw, chars=[], effectsDraw, bubbles=[], panelNum, nb1, nb2, border='#1E293B' }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bgDraw && bgDraw(ctx);
  sceneDraw && sceneDraw(ctx);
  for (const c of chars) {
    drawChar(ctx, c.img, c.x, c.y, c.size, c.flip||false);
    if (c.name) nameTag(ctx, c.name, c.x+c.size/2, c.y+c.size+2, c.nb||'rgba(0,0,0,0.5)', c.nf||'white');
  }
  effectsDraw && effectsDraw(ctx);
  for (const b of bubbles) {
    drawBubble(ctx, b.x, b.y, b.w, b.h, b.tail, b.fill, b.border);
    drawBubbleText(ctx, b.msg, b.x, b.y, b.w, b.h, b.tc);
  }
  drawBadge(ctx, panelNum, nb1, nb2);
  ctx.strokeStyle=border; ctx.lineWidth=5; ctx.strokeRect(3,3,W-6,H-6);
  return canvas;
}

// ── 記事定義 ──────────────────────────────────────────────

const RB = { nb1:'#FF8C00', nb2:'#FFD000' }; // リスバッジ
const QB = { nb1:'#1E3A8A', nb2:'#06B6D4' }; // ロボバッジ
const RF = '#FFFEF0', RBR = '#F59E0B', RTC = '#78350F';
const QF = '#F0F9FF', QBR = '#3B82F6', QTC = '#1E40AF';

function makeArticles(riss, robot) {
  return [

  // ═══════════════════════════════════════════════
  // evacuation-timing
  // ═══════════════════════════════════════════════
  { slug: 'evacuation-timing', panels: [

    // Panel 1: 危険発生 — TV警報が出た暗い部屋
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A2535'); g.addColorStop(1,'#0F1825');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 床
        ctx.fillStyle='#2A1E10'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#3A2A18'; ctx.fillRect(0,H*0.8,W,5);
        // 壁
        ctx.fillStyle='#1E2D3E'; ctx.fillRect(0,0,W,H*0.8);
        // 大きな窓（左上）
        drawStormWindow(ctx, 30, 40, 220, 280);
        // 風の横線
        ctx.strokeStyle='#607090'; ctx.lineWidth=2; ctx.globalAlpha=0.4;
        [120,160,200].forEach(y => {
          ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(250,y); ctx.stroke();
        });
        ctx.globalAlpha=1;
        // TV（右）
        drawTV(ctx, 320, 80, 220, 150, '避難指示', '警戒レベル4');
        // 赤点滅ライン
        ctx.fillStyle='#FF2222'; ctx.globalAlpha=0.8;
        ctx.fillRect(320,80,220,8);
        ctx.globalAlpha=1;
        // ソファ
        ctx.fillStyle='#4A3828'; ctx.fillRect(60,H*0.72,200,80);
        ctx.fillStyle='#5A4838'; ctx.fillRect(60,H*0.72,200,22);
        ctx.fillStyle='#4A3828'; ctx.fillRect(56,H*0.72,18,90); // 左アーム
        ctx.fillRect(242,H*0.72,18,90); // 右アーム
        // 暗い雰囲気の影
        const shadow = ctx.createLinearGradient(0,H*0.5,0,H);
        shadow.addColorStop(0,'transparent'); shadow.addColorStop(1,'rgba(0,0,0,0.4)');
        ctx.fillStyle=shadow; ctx.fillRect(0,H*0.5,W,H*0.5);
      },
      chars: [{ img: riss, x: 90, y: H*0.5, size: 130, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{
        x:20, y:12, w:270, h:110, tail:'bl',
        fill:RF, border:RBR, tc:RTC,
        msg:'警戒レベル4が\n出た…大丈夫かな',
      }],
    },

    // Panel 2: 失敗しそう — まだ居座るリス（危険が迫る）
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#141E2A'); g.addColorStop(1,'#0A1218');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#18212E'; ctx.fillRect(0,0,W,H*0.8);
        // 窓（嵐が悪化、横なぐりの雨）
        drawStormWindow(ctx, 30, 40, 220, 270);
        drawRain(ctx, 0.9, 30, 40, 220, 270, 24);
        // ドアの隙間から水
        ctx.fillStyle='#1E4070'; ctx.globalAlpha=0.6;
        ctx.fillRect(380,H*0.78,130,8);
        ctx.beginPath(); ctx.ellipse(440,H*0.79,70,6,0,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
        ctx.fillStyle='#60A8D8'; ctx.globalAlpha=0.5;
        ctx.fillText && null;
        // ドア
        ctx.fillStyle='#2A1A0A'; ctx.fillRect(380,H*0.35,120,H*0.45);
        ctx.strokeStyle='#1A0E05'; ctx.lineWidth=3; ctx.strokeRect(380,H*0.35,120,H*0.45);
        ctx.fillStyle='#8B6040'; ctx.beginPath(); ctx.arc(388,H*0.58,7,0,Math.PI*2); ctx.fill();
        // 水のラベル
        ctx.font='bold 14px "Yu Gothic"'; ctx.fillStyle='#60B0FF'; ctx.textAlign='center'; ctx.globalAlpha=0.8;
        ctx.fillText('⚠ 浸水始まってる！', 445, H*0.76);
        ctx.globalAlpha=1;
        // TV（まだついてる）
        drawTV(ctx, 310, 80, 160, 110, '避難指示', 'レベル４');
        // ソファ
        ctx.fillStyle='#3A2818'; ctx.fillRect(30,H*0.72,200,80);
        ctx.fillStyle='#4A3828'; ctx.fillRect(30,H*0.72,200,22);
        ctx.fillRect(26,H*0.72,18,90); ctx.fillRect(212,H*0.72,18,90);
      },
      chars: [{ img: riss, x: 55, y: H*0.5, size: 128, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{
        x:15, y:15, w:295, h:120, tail:'bl',
        fill:RF, border:RBR, tc:RTC,
        msg:'今くらいなら\nまだ大丈夫でしょ♪',
      }],
      effectsDraw(ctx) {
        // ドアから水が染み出す矢印
        ctx.fillStyle='#4090C8'; ctx.globalAlpha=0.7;
        [[395,H*0.8,'→'],[410,H*0.82,'→'],[425,H*0.84,'→']].forEach(([x,y,t]) => {
          ctx.font='bold 16px serif'; ctx.textAlign='center';
          ctx.fillText(t,x,y);
        });
        ctx.globalAlpha=1;
      },
    },

    // Panel 3: ロボが止める — 緊急介入！
    { ...QB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A0808'); g.addColorStop(1,'#3D0C0C');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#200A0A'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#280E0E'; ctx.fillRect(0,0,W,H*0.8);
        // ドアが開いてロボが飛び込む
        ctx.fillStyle='#1A0A04'; ctx.fillRect(W*0.55,H*0.2,130,H*0.6);
        ctx.strokeStyle='#0D0602'; ctx.lineWidth=3; ctx.strokeRect(W*0.55,H*0.2,130,H*0.6);
        // ドア外（明るい廊下から）
        ctx.fillStyle='#604020'; ctx.globalAlpha=0.8;
        ctx.fillRect(W*0.56,H*0.21,128,H*0.58);
        ctx.globalAlpha=1;
        // 集中線（ロボ登場の衝撃）
        drawSpeedLines(ctx, W*0.68, H*0.42, 28, 60, 280, '#FF4444', 0.35);
        // インパクト星
        drawImpact(ctx, W*0.62, H*0.35, 48, '#FF6600');
        drawImpact(ctx, W*0.79, H*0.22, 32, '#FF4444');
      },
      chars: [
        { img: robot, x: W*0.38, y: H*0.25, size: 160, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img: riss,  x: 20,     y: H*0.55, size: 110,            name:'防災リス',  nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) {
        drawSfx(ctx,'！！', W*0.25, H*0.22, 72, '#FF2222');
      },
      bubbles: [{
        x: 15, y: 18, w: W*0.5, h: 130, tail:'bottom',
        fill:QF, border:QBR, tc:QTC,
        msg:'今すぐ逃げろ！！\nレベル4は命取りだ！',
      }],
    },

    // Panel 4: リスが行動 — 避難所へ走る！
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A3050'); g.addColorStop(0.4,'#4080C0'); g.addColorStop(1,'#60A858');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 夜明けの空
        const sky = ctx.createLinearGradient(0,0,0,H*0.55);
        sky.addColorStop(0,'#1A2850'); sky.addColorStop(0.5,'#6090C8'); sky.addColorStop(1,'#F0A840');
        ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
        // 道路
        ctx.fillStyle='#2A2A2A'; ctx.fillRect(0,H*0.7,W,H*0.3);
        ctx.fillStyle='#333'; ctx.fillRect(0,H*0.7,W,3);
        ctx.setLineDash([40,20]); ctx.strokeStyle='#FFD700'; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(0,H*0.82); ctx.lineTo(W,H*0.82); ctx.stroke();
        ctx.setLineDash([]);
        // 草地
        ctx.fillStyle='#3A8030'; ctx.fillRect(0,H*0.55,W,H*0.15);
        // 避難所建物（奥）
        drawShelter(ctx, W*0.52, H*0.08, 200, 330);
        // 太陽（夜明け）
        const sunG = ctx.createRadialGradient(W*0.15,H*0.12,0,W*0.15,H*0.12,80);
        sunG.addColorStop(0,'#FFE840'); sunG.addColorStop(1,'rgba(255,200,0,0)');
        ctx.fillStyle=sunG; ctx.fillRect(0,0,W*0.4,H*0.4);
        // 矢印「避難所→」
        ctx.font='bold 18px "Yu Gothic"'; ctx.fillStyle='#FFD000';
        ctx.textAlign='center'; ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=6;
        ctx.fillText('← 避難所', W*0.78, H*0.67);
        ctx.shadowBlur=0;
        // モーションライン（走行）
        ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.setLineDash([18,10]);
        [H*0.68,H*0.73,H*0.77].forEach(y => {
          ctx.beginPath(); ctx.moveTo(W*0.45,y); ctx.lineTo(W*0.55,y); ctx.stroke();
        });
        ctx.setLineDash([]);
      },
      chars: [{ img: riss, x: 150, y: H*0.46, size: 148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) {
        drawCheck(ctx, W*0.12, H*0.14, 58, '#22C55E');
        drawSfx(ctx,'GO!', W*0.44, H*0.52, 38, '#22C55E');
      },
      bubbles: [{
        x: 20, y: 14, w: 280, h: 115, tail:'br',
        fill:RF, border:'#16A34A', tc:'#14532D',
        msg:'レベル4は\n即避難が正解！',
      }],
    },

  ]},

  // ═══════════════════════════════════════════════
  // evacuation-shelter-infection
  // ═══════════════════════════════════════════════
  { slug: 'evacuation-shelter-infection', panels: [

    // Panel 1: 危険発生 — ウイルスが漂う密な避難所
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1E1030'); g.addColorStop(1,'#2A1840');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 体育館天井
        ctx.fillStyle='#16102A'; ctx.fillRect(0,0,W,60);
        [W*0.2,W*0.5,W*0.8].forEach(x => {
          ctx.fillStyle='rgba(255,255,200,0.75)'; ctx.fillRect(x-24,12,48,12);
          const lg = ctx.createRadialGradient(x,18,0,x,18,120);
          lg.addColorStop(0,'rgba(255,255,150,0.25)'); lg.addColorStop(1,'transparent');
          ctx.fillStyle=lg; ctx.fillRect(x-120,0,240,180);
        });
        // 床
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.72,W,H*0.28);
        ctx.strokeStyle='#A8804A'; ctx.lineWidth=1.5;
        [H*0.84,H*0.93].forEach(y => {
          ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
        });
        [W*0.25,W*0.5,W*0.75].forEach(x => {
          ctx.beginPath(); ctx.moveTo(x,H*0.72); ctx.lineTo(x,H); ctx.stroke();
        });
        // 壁
        ctx.fillStyle='#C0B8D8'; ctx.fillRect(0,60,W,H*0.62);
        // 密集した人シルエット
        const ppl = [
          [70,H*0.62],[150,H*0.60],[230,H*0.63],[310,H*0.61],[390,H*0.62],[470,H*0.60],[550,H*0.63],
          [110,H*0.72],[200,H*0.71],[290,H*0.72],[380,H*0.71],[470,H*0.72],[540,H*0.71],
          [60,H*0.82],[160,H*0.81],[260,H*0.82],[360,H*0.81],[460,H*0.82],[550,H*0.81],
        ];
        ppl.forEach(([x,y]) => drawPerson(ctx,x,y,36,'#5050A0',0.8));
        // ウイルス浮遊
        const virPos = [[120,H*0.3],[260,H*0.25],[380,H*0.32],[480,H*0.28],[160,H*0.45],[350,H*0.42],[520,H*0.38]];
        virPos.forEach(([x,y],i) => drawVirus(ctx,x,y,14+i%3*4,'#CC44FF',8,0.7));
        // 咳の飛沫ライン
        ctx.strokeStyle='#CC88FF'; ctx.lineWidth=1.5; ctx.globalAlpha=0.5;
        [[300,H*0.53,370,H*0.47],[305,H*0.55,390,H*0.52],[310,H*0.57,385,H*0.6]].forEach(([x1,y1,x2,y2]) => {
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        });
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) {
        drawSfx(ctx,'ゴホッ！', W*0.5, H*0.56, 36, '#FF88FF');
        // 警告ラベル
        roundRect(ctx, 15, 15, 295, 55, 10);
        ctx.fillStyle='rgba(150,0,200,0.75)'; ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 19px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('⚠ 密集＝感染リスク大！', 162, 48);
      },
      bubbles: [],
    },

    // Panel 2: 失敗しそう — マスクなしで座るリス
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#2A1840'; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#1E1230'; ctx.fillRect(0,0,W,H*0.78);
        // 咳をする隣人（右）
        drawPerson(ctx, W*0.72, H*0.62, 80, '#604080', 0.9);
        // 飛沫ライン → リスへ
        ctx.strokeStyle='#CC44FF'; ctx.lineWidth=2; ctx.globalAlpha=0.7; ctx.setLineDash([8,5]);
        [[W*0.64,H*0.52,W*0.48,H*0.56],[W*0.67,H*0.55,W*0.46,H*0.6],[W*0.65,H*0.58,W*0.44,H*0.64]].forEach(([x1,y1,x2,y2])=>{
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        });
        ctx.setLineDash([]); ctx.globalAlpha=1;
        // ウイルスがリスに接近
        drawVirus(ctx, W*0.38, H*0.45, 18, '#CC44FF', 8, 0.85);
        drawVirus(ctx, W*0.33, H*0.55, 14, '#AA22EE', 8, 0.7);
        drawVirus(ctx, W*0.42, H*0.58, 12, '#BB33FF', 7, 0.65);
        // 「マスクなし」×マーク
        ctx.strokeStyle='#FF2222'; ctx.lineWidth=4; ctx.globalAlpha=0.85;
        ctx.beginPath(); ctx.moveTo(W*0.28,H*0.38); ctx.lineTo(W*0.35,H*0.45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.35,H*0.38); ctx.lineTo(W*0.28,H*0.45); ctx.stroke();
        ctx.globalAlpha=1;
        ctx.fillStyle='#FF4444'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('マスクなし!', W*0.32, H*0.35);
      },
      chars: [{ img: riss, x: 80, y: H*0.44, size: 130, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) {
        drawSfx(ctx,'ゴホッ！', W*0.76, H*0.46, 30, '#FF88FF');
      },
      bubbles: [{
        x:200, y:12, w:270, h:110, tail:'bl',
        fill:RF, border:RBR, tc:RTC,
        msg:'ちょっとくらい\n大丈夫かな…',
      }],
    },

    // Panel 3: ロボが止める — マスクを届ける！
    { ...QB,
      bgDraw(ctx) {
        ctx.fillStyle='#1A1030'; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#1A0C28'; ctx.fillRect(0,0,W,H*0.8);
        // 集中線（緊急）
        drawSpeedLines(ctx, W*0.5, H*0.45, 32, 50, 300, '#4444FF', 0.28);
        // インパクト
        drawImpact(ctx, W*0.55, H*0.2, 42, '#3B82F6');
        // ウイルス（吹き飛ばされる演出）
        [
          [W*0.1,H*0.2,0.3],[W*0.85,H*0.15,0.25],[W*0.9,H*0.6,0.2],
        ].forEach(([x,y,a]) => drawVirus(ctx,x,y,10,'#AA22EE',6,a));
      },
      chars: [
        { img: robot, x: W*0.36, y: H*0.2, size: 158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img: riss,  x: 18,     y: H*0.52, size: 115,           name:'防災リス',  nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) {
        // マスクのアイコン（ロボが持っている）
        ctx.fillStyle='#E8F4EE'; ctx.strokeStyle='#16A34A'; ctx.lineWidth=3.5;
        ctx.beginPath(); ctx.ellipse(W*0.6,H*0.33,38,22,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle='#A8D8B8'; ctx.lineWidth=1.5;
        [-7,0,7].forEach(oy=>{
          ctx.beginPath(); ctx.moveTo(W*0.6-30,H*0.33+oy); ctx.lineTo(W*0.6+30,H*0.33+oy); ctx.stroke();
        });
        drawSfx(ctx,'！！', W*0.22, H*0.2, 60, '#FF3333');
      },
      bubbles: [{
        x: 18, y: 15, w: 295, h: 120, tail:'bottom',
        fill:QF, border:QBR, tc:QTC,
        msg:'マスクを付けろ！\n今すぐ！！',
      }],
    },

    // Panel 4: リスが行動 — 予防OKで安心
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#0A1A10'); g.addColorStop(1,'#142A1C');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#102015'; ctx.fillRect(0,0,W,H*0.78);
        // 天井ライト（明るめ）
        const lg = ctx.createRadialGradient(W*0.5,0,0,W*0.5,0,300);
        lg.addColorStop(0,'rgba(200,255,200,0.15)'); lg.addColorStop(1,'transparent');
        ctx.fillStyle=lg; ctx.fillRect(0,0,W,H*0.78);
        // 人々（ほどよい間隔）
        [[90,H*0.64],[240,H*0.62],[W*0.75,H*0.64]].forEach(([x,y]) => drawPerson(ctx,x,y,42,'#405880',0.6));
        // 間隔ライン
        ctx.strokeStyle='#4ADE80'; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.globalAlpha=0.5;
        ctx.beginPath(); ctx.moveTo(170,H*0.55); ctx.lineTo(170,H*0.78); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(330,H*0.55); ctx.lineTo(330,H*0.78); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha=1;
        // チェックリスト
        [['マスク✓','#4ADE80'],['手洗い✓','#4ADE80'],['換気✓','#4ADE80']].forEach(([t,c],i)=>{
          ctx.fillStyle=c; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='left'; ctx.globalAlpha=0.9;
          ctx.fillText(t, W*0.56, H*0.22+i*38);
        });
        ctx.globalAlpha=1;
      },
      chars: [{ img: riss, x: 290, y: H*0.4, size: 138, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) {
        drawCheck(ctx, W*0.8, H*0.55, 55, '#4ADE80');
      },
      bubbles: [{
        x: 14, y: 14, w: 270, h: 120, tail:'right',
        fill:RF, border:'#16A34A', tc:'#14532D',
        msg:'手洗い・マスクで\n感染を防げる！',
      }],
    },

  ]},

  // ═══════════════════════════════════════════════
  // earthquake-zaitaku
  // ═══════════════════════════════════════════════
  { slug: 'earthquake-zaitaku', panels: [

    // Panel 1: 危険発生 — 大地震！部屋が揺れる
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1A08'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 揺れた部屋（斜め）
        ctx.save(); ctx.translate(W/2,H/2); ctx.rotate(0.04);
        // 壁
        ctx.fillStyle='#D4C8A8'; ctx.fillRect(-W/2,-H/2,W,H*0.75);
        // ヒビ
        ctx.strokeStyle='#8A6A30'; ctx.lineWidth=3; ctx.globalAlpha=0.7;
        [['-30%y','15%x'],['-20%y','50%x']].forEach(()=>{});
        ctx.beginPath(); ctx.moveTo(-180,-280); ctx.lineTo(-100,-80); ctx.lineTo(-160,80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(120,-260); ctx.lineTo(180,-60); ctx.lineTo(140,100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-50,-300); ctx.lineTo(-80,-100); ctx.stroke();
        ctx.globalAlpha=1;
        // 棚（傾いた）
        ctx.save(); ctx.translate(-150,-100); ctx.rotate(0.15);
        ctx.fillStyle='#7A5030'; ctx.fillRect(-20,-180,200,20);
        ctx.fillRect(-20,0,200,20); ctx.fillRect(-20,0,16,180); ctx.fillRect(164,0,16,180);
        ctx.fillStyle='#5A3818'; ctx.fillRect(-20,-180,16,360);
        ctx.restore();
        // 落下する本
        ctx.save(); ctx.translate(-90,-40); ctx.rotate(-0.6);
        ctx.fillStyle='#4060A8'; ctx.fillRect(-20,-8,40,16); ctx.restore();
        ctx.save(); ctx.translate(-50,-20); ctx.rotate(0.8);
        ctx.fillStyle='#A04040'; ctx.fillRect(-16,-8,32,16); ctx.restore();
        ctx.save(); ctx.translate(-130,20); ctx.rotate(-0.4);
        ctx.fillStyle='#408040'; ctx.fillRect(-18,-8,36,16); ctx.restore();
        // 窓（亀裂入り）
        ctx.fillStyle='#7A9AB0'; ctx.fillRect(100,-300,180,200);
        ctx.strokeStyle='#4A6A80'; ctx.lineWidth=4; ctx.strokeRect(100,-300,180,200);
        ctx.strokeStyle='#FFFFF0'; ctx.lineWidth=2; ctx.globalAlpha=0.6;
        ctx.beginPath(); ctx.moveTo(130,-280); ctx.lineTo(190,-100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(250,-260); ctx.lineTo(200,-150); ctx.lineTo(260,-200); ctx.stroke();
        ctx.globalAlpha=1;
        // 床
        ctx.fillStyle='#3A2810'; ctx.fillRect(-W/2,H/2*0.5,W,H/2);
        ctx.restore();
        // 埃
        ctx.fillStyle='rgba(200,180,120,0.2)';
        ctx.beginPath(); ctx.arc(180,320,80,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(440,180,60,0,Math.PI*2); ctx.fill();
      },
      chars: [],
      effectsDraw(ctx) {
        drawSpeedLines(ctx, W/2, H/2, 24, 30, 280, '#FF8800', 0.2);
        drawSfx(ctx,'ドドドドド！', W/2, H*0.1, 46, '#FF6600');
        drawSfx(ctx,'ガタガタ！', W*0.15, H*0.85, 30, '#FF8800');
      },
      bubbles: [],
    },

    // Panel 2: 失敗しそう — 避難所に行こうとするリス
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0E8D0'); g.addColorStop(1,'#D0C8A0');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 玄関
        ctx.fillStyle='#C8B888'; ctx.fillRect(0,0,W,H);
        // 床
        ctx.fillStyle='#6A4828'; ctx.fillRect(0,H*0.75,W,H*0.25);
        // 壁
        ctx.fillStyle='#D8C898'; ctx.fillRect(0,0,W,H*0.75);
        // ドア（前）
        ctx.fillStyle='#5A3818'; ctx.fillRect(W*0.55,H*0.1,160,H*0.65);
        ctx.strokeStyle='#3A2008'; ctx.lineWidth=4; ctx.strokeRect(W*0.55,H*0.1,160,H*0.65);
        // ドアノブ
        ctx.fillStyle='#C8A840'; ctx.beginPath(); ctx.arc(W*0.56+12,H*0.43,9,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#C8B060'; ctx.fillRect(W*0.55+6,H*0.43-3,18,6);
        // 窓（外が見える）= 安全な建物
        ctx.fillStyle='#90C8F0'; ctx.fillRect(40,60,200,220);
        ctx.strokeStyle='#5090C0'; ctx.lineWidth=4; ctx.strokeRect(40,60,200,220);
        ctx.strokeStyle='#5090C0'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(140,60); ctx.lineTo(140,280); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40,170); ctx.lineTo(240,170); ctx.stroke();
        // 窓の外：安全そうな建物
        ctx.fillStyle='#C8D4E0'; ctx.fillRect(55,70,80,190);
        ctx.fillStyle='#A0B0C0'; ctx.fillRect(55,70,80,15);
        for (let r=0;r<3;r++) for (let c=0;c<2;c++) {
          ctx.fillStyle='#80C0E0'; ctx.fillRect(60+c*38,92+r*48,28,32);
        }
        // 靴箱
        ctx.fillStyle='#8B5E3C'; ctx.fillRect(10,H*0.6,120,H*0.15);
        ctx.strokeStyle='#6A3E1C'; ctx.lineWidth=2; ctx.strokeRect(10,H*0.6,120,H*0.15);
      },
      chars: [{ img: riss, x: W*0.25, y: H*0.32, size: 148, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) {
        // リュック（背負っているイメージ）
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.25+140,H*0.38,28,50);
        ctx.strokeStyle='#0F5E2A'; ctx.lineWidth=2; ctx.strokeRect(W*0.25+140,H*0.38,28,50);
      },
      bubbles: [{
        x: 15, y: 12, w: 285, h: 120, tail:'br',
        fill:RF, border:RBR, tc:RTC,
        msg:'避難所に\n行かなきゃ！！',
      }],
    },

    // Panel 3: ロボが止める — ドアを塞ぐロボ
    { ...QB,
      bgDraw(ctx) {
        ctx.fillStyle='#D8C898'; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#6A4828'; ctx.fillRect(0,H*0.75,W,H*0.25);
        ctx.fillStyle='#D0C090'; ctx.fillRect(0,0,W,H*0.75);
        // ドア
        ctx.fillStyle='#5A3818'; ctx.fillRect(W*0.52,H*0.05,165,H*0.7);
        ctx.strokeStyle='#3A2008'; ctx.lineWidth=4; ctx.strokeRect(W*0.52,H*0.05,165,H*0.7);
        // 窓の外：安全な建物 ＋ 新耐震ラベル
        ctx.fillStyle='#90C8F0'; ctx.fillRect(40,50,210,230);
        ctx.strokeStyle='#5090C0'; ctx.lineWidth=3; ctx.strokeRect(40,50,210,230);
        ctx.fillStyle='#C8D4E0'; ctx.fillRect(55,60,90,200);
        ctx.fillStyle='#A0B0C0'; ctx.fillRect(55,60,90,16);
        for (let r=0;r<3;r++) for (let c=0;c<2;c++) {
          ctx.fillStyle='#80C0E0'; ctx.fillRect(60+c*42,84+r*52,32,36);
        }
        // 新耐震ラベル
        ctx.fillStyle='#15803D'; ctx.fillRect(48,268,204,28);
        ctx.fillStyle='white'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('✓ 新耐震基準　安全！', 150,287);
        // 集中線（ロボの登場）
        drawSpeedLines(ctx, W*0.72, H*0.42, 20, 30, 150, '#3B82F6', 0.3);
      },
      chars: [
        { img: robot, x: W*0.44, y: H*0.1, size: 165, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img: riss,  x: 22,     y: H*0.45, size: 115,           name:'防災リス',  nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) {
        drawSfx(ctx,'！', W*0.28, H*0.22, 60, '#DC2626');
      },
      bubbles: [{
        x: 14, y: 14, w: 320, h: 130, tail:'bottom',
        fill:QF, border:QBR, tc:QTC,
        msg:'待て！建物は安全だ！\n外の方が危険！',
      }],
    },

    // Panel 4: リスが行動 — 在宅避難成功
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0F8FF'); g.addColorStop(1,'#E0F0E8');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 窓（外：青空）
        ctx.fillStyle='#7AC8F0'; ctx.fillRect(W*0.5,30,220,220);
        ctx.strokeStyle='#5090C0'; ctx.lineWidth=4; ctx.strokeRect(W*0.5,30,220,220);
        ctx.strokeStyle='#5090C0'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(W*0.5+110,30); ctx.lineTo(W*0.5+110,250); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.5,140); ctx.lineTo(W*0.5+220,140); ctx.stroke();
        drawSun(ctx, W*0.88, 65, 26);
        // 棚（備蓄）
        ctx.fillStyle='#8B5E3C'; ctx.fillRect(W*0.5,270,220,320);
        ctx.strokeStyle='#6A3E1C'; ctx.lineWidth=2; ctx.strokeRect(W*0.5,270,220,320);
        [330,390,450].forEach(y=>{
          ctx.fillStyle='#6A4228'; ctx.fillRect(W*0.5,y,220,12);
        });
        // 水ボトル
        for (let i=0;i<3;i++) {
          const bx=W*0.5+18+i*62;
          ctx.fillStyle='#B8D8F0'; ctx.fillRect(bx,280,44,44);
          ctx.strokeStyle='#7AB0D0'; ctx.lineWidth=1.5; ctx.strokeRect(bx,280,44,44);
          ctx.fillStyle='#2563EB'; ctx.fillRect(bx+8,270,28,12);
          ctx.fillStyle='#1E40AF'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText('水',bx+22,308);
        }
        // 缶詰
        for (let i=0;i<3;i++) {
          const bx=W*0.5+18+i*62;
          ctx.fillStyle='#E8C878'; ctx.fillRect(bx,342,44,40);
          ctx.strokeStyle='#C8A050'; ctx.lineWidth=1.5; ctx.strokeRect(bx,342,44,40);
          ctx.fillStyle='#8B5E3C'; ctx.font='bold 11px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText('缶詰',bx+22,367);
        }
        // 床
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,H*0.55,W*0.5,H*0.25);
        // 「7日分」ラベル
        ctx.fillStyle='#1E3A8A'; ctx.fillRect(W*0.5,590,220,45);
        ctx.fillStyle='white'; ctx.font='bold 19px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('７日分 備蓄あり！', W*0.5+110,619);
      },
      chars: [{ img: riss, x: 60, y: H*0.38, size: 148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) {
        drawCheck(ctx, W*0.28, H*0.22, 58, '#16A34A');
      },
      bubbles: [{
        x: 14, y: 12, w: 285, h: 115, tail:'br',
        fill:RF, border:'#16A34A', tc:'#14532D',
        msg:'在宅避難が\n正解だった！',
      }],
    },

  ]},

  // ═══════════════════════════════════════════════
  // earthquake-sleep
  // ═══════════════════════════════════════════════
  { slug: 'earthquake-sleep', panels: [

    // Panel 1: 危険発生 — 就寝中に大地震！
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#0A1020'); g.addColorStop(1,'#182030');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        // 夜の部屋
        ctx.fillStyle='#141C2C'; ctx.fillRect(0,0,W,H);
        // 窓（夜空）
        ctx.fillStyle='#08101C'; ctx.fillRect(W*0.55,30,200,200);
        ctx.strokeStyle='#2A3848'; ctx.lineWidth=4; ctx.strokeRect(W*0.55,30,200,200);
        ctx.strokeStyle='#2A3848'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(W*0.55+100,30); ctx.lineTo(W*0.55+100,230); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.55,130); ctx.lineTo(W*0.55+200,130); ctx.stroke();
        // 月・星
        ctx.fillStyle='rgba(255,230,50,0.85)';
        ctx.beginPath(); ctx.arc(W*0.75,80,20,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(200,200,50,0.8)'; ctx.font='18px serif'; ctx.textAlign='center';
        ['★','★','★'].forEach((s,i)=>ctx.fillText(s,[W*0.6,W*0.8,W*0.9][i],[55,100,55][i]));
        // 布団（揺れている）
        ctx.save(); ctx.translate(W/2,H*0.65); ctx.rotate(0.05);
        ctx.fillStyle='#A08870'; ctx.fillRect(-230,-28,460,56);  // 布団
        ctx.fillStyle='#E8D0B0'; ctx.fillRect(-230,-40,460,16);  // 枕
        ctx.restore();
        // 棚から物が落ちる
        ctx.fillStyle='#8B5E3C'; ctx.fillRect(30,180,180,16);
        ctx.save(); ctx.translate(100,220); ctx.rotate(-0.8);
        ctx.fillStyle='#4060A8'; ctx.fillRect(-20,-8,40,16); ctx.restore();
        ctx.save(); ctx.translate(160,240); ctx.rotate(0.6);
        ctx.fillStyle='#C05050'; ctx.fillRect(-16,-8,32,16); ctx.restore();
        ctx.save(); ctx.translate(65,255); ctx.rotate(-0.4);
        ctx.fillStyle='#408040'; ctx.fillRect(-15,-8,30,16); ctx.restore();
        // 床
        ctx.fillStyle='#1A1008'; ctx.fillRect(0,H*0.78,W,H*0.22);
        // ガラス破片（床）
        ctx.fillStyle='rgba(150,200,255,0.5)';
        [[50,H*0.8,22,7],[110,H*0.83,16,5],[80,H*0.86,20,6],[160,H*0.81,14,5]].forEach(([x,y,w,h])=>{
          ctx.save(); ctx.translate(x+w/2,y+h/2); ctx.rotate(Math.random()*0.8-0.4);
          ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
        });
      },
      chars: [],
      effectsDraw(ctx) {
        drawSpeedLines(ctx, W/2, H/2, 22, 20, 260, '#FF8800', 0.22);
        drawSfx(ctx,'ガタガタ！！', W/2, H*0.15, 44, '#FF6600');
        drawSfx(ctx,'ドドドド', W*0.2, H*0.82, 28, '#FF8800');
      },
      bubbles: [],
    },

    // Panel 2: 失敗しそう — リスが布団から飛び出そうとする
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#141C2C'; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#1A1008'; ctx.fillRect(0,H*0.75,W,H*0.25);
        ctx.fillStyle='#141C2C'; ctx.fillRect(0,0,W,H*0.75);
        // 布団（乱れた）
        ctx.save(); ctx.translate(0,H*0.55); ctx.rotate(-0.08);
        ctx.fillStyle='#8A7050'; ctx.fillRect(0,0,W,60);
        ctx.fillStyle='#D0B890'; ctx.fillRect(0,0,W,18);
        ctx.restore();
        // 床のガラス（危険！）
        ctx.fillStyle='rgba(150,200,255,0.55)';
        [[60,H*0.78,28,8],[130,H*0.81,20,6],[90,H*0.84,24,7],[200,H*0.8,18,5],
         [260,H*0.77,22,7],[320,H*0.82,16,5]].forEach(([x,y,w,h])=>{
          ctx.save(); ctx.translate(x+w/2,y+h/2); ctx.rotate((Math.random()*1.2-0.6));
          ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
        });
        // ガラス危険ライン
        ctx.strokeStyle='rgba(150,200,255,0.3)'; ctx.lineWidth=1;
        [[40,H*0.76,180,H*0.86],[160,H*0.74,90,H*0.83]].forEach(([x1,y1,x2,y2])=>{
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        });
        // ⚠ガラス警告
        ctx.fillStyle='#FF4444'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.85;
        ctx.fillText('⚠ ガラス！', 165, H*0.73);
        ctx.globalAlpha=1;
        // 暗闇エフェクト
        const dark = ctx.createRadialGradient(W/2,H/2,100,W/2,H/2,350);
        dark.addColorStop(0,'transparent'); dark.addColorStop(1,'rgba(0,0,0,0.5)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
      },
      chars: [{ img: riss, x: 200, y: H*0.26, size: 140, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{
        x: 10, y: 12, w: 285, h: 120, tail:'right',
        fill:RF, border:RBR, tc:RTC,
        msg:'逃げなきゃ！！\n外に出ないと！',
      }],
    },

    // Panel 3: ロボが止める — 暗闇で動くな！
    { ...QB,
      bgDraw(ctx) {
        ctx.fillStyle='#0F1820'; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#0A1008'; ctx.fillRect(0,H*0.75,W,H*0.25);
        ctx.fillStyle='#0F1820'; ctx.fillRect(0,0,W,H*0.75);
        // ガラスが光る（危険強調）
        ctx.fillStyle='rgba(150,200,255,0.6)';
        [[40,H*0.78,26,8],[100,H*0.81,20,6],[75,H*0.84,22,7],[190,H*0.8,18,5],
         [250,H*0.77,24,7],[320,H*0.82,16,5],[380,H*0.79,20,6]].forEach(([x,y,w,h])=>{
          ctx.save(); ctx.translate(x+w/2,y+h/2); ctx.rotate((x*0.1)%1-0.5);
          ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
        });
        // 赤いスポットライト（ガラス危険エリア）
        const dangerLight = ctx.createRadialGradient(200,H*0.8,0,200,H*0.8,120);
        dangerLight.addColorStop(0,'rgba(255,50,50,0.2)'); dangerLight.addColorStop(1,'transparent');
        ctx.fillStyle=dangerLight; ctx.fillRect(0,H*0.65,400,H*0.35);
        // 集中線
        drawSpeedLines(ctx, W*0.62, H*0.38, 22, 40, 200, '#3B82F6', 0.28);
      },
      chars: [
        { img: robot, x: W*0.38, y: H*0.1, size: 162, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img: riss,  x: 18,     y: H*0.48, size: 112,           name:'防災リス',  nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) {
        // ガラスを指さす矢印
        ctx.strokeStyle='#FF4444'; ctx.lineWidth=3; ctx.globalAlpha=0.8;
        ctx.beginPath(); ctx.moveTo(W*0.38+80,H*0.73); ctx.lineTo(200,H*0.79); ctx.stroke();
        ctx.globalAlpha=1;
        drawSfx(ctx,'！', W*0.3, H*0.2, 66, '#FF3333');
      },
      bubbles: [{
        x: 14, y: 16, w: 305, h: 130, tail:'bottom',
        fill:QF, border:QBR, tc:QTC,
        msg:'待て！暗闇で動くと\nガラスで足を切るぞ！',
      }],
    },

    // Panel 4: リスが行動 — 布団の中で揺れが収まるのを待つ
    { ...RB,
      bgDraw(ctx) {
        const g = ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#101828'); g.addColorStop(1,'#1A2838');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#0A0808'; ctx.fillRect(0,H*0.72,W,H*0.28);
        ctx.fillStyle='#101828'; ctx.fillRect(0,0,W,H*0.72);
        // 布団（安全）
        ctx.fillStyle='#706050'; ctx.fillRect(30,H*0.52,440,90);
        ctx.fillStyle='#F0E0C0'; ctx.fillRect(30,H*0.52,440,28); // 枕
        // 枕で頭を守る（イラスト）
        ctx.fillStyle='#D4B890'; ctx.fillRect(60,H*0.52-5,120,28);
        // 窓（夜明け前）
        ctx.fillStyle='#1A2535'; ctx.fillRect(W*0.6,40,180,180);
        ctx.strokeStyle='#2A3848'; ctx.lineWidth=3; ctx.strokeRect(W*0.6,40,180,180);
        ctx.strokeStyle='#2A3848'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(W*0.6+90,40); ctx.lineTo(W*0.6+90,220); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.6,130); ctx.lineTo(W*0.6+180,130); ctx.stroke();
        // 星（穏やかになった）
        ctx.fillStyle='rgba(255,255,200,0.6)'; ctx.font='16px serif'; ctx.textAlign='center';
        ['★','★','★'].forEach((s,i)=>ctx.fillText(s,W*0.63+i*60,[75,55,75][i]));
        // 「揺れが収まるまで待て」ラベル
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,40,H*0.35,340,50,10); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('揺れが収まるまで布団の中で待て！', 210,H*0.35+32);
      },
      chars: [{ img: riss, x: 55, y: H*0.3, size: 130, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) {
        drawCheck(ctx, W*0.55, H*0.2, 56, '#4ADE80');
      },
      bubbles: [{
        x: 280, y: 12, w: 295, h: 120, tail:'bl',
        fill:RF, border:'#16A34A', tc:'#14532D',
        msg:'揺れが収まるまで\n布団の中で待つ！',
      }],
    },

  ]},

  ]; // end return
} // end makeArticles

// ── 実行 ─────────────────────────────────────────────────

async function main() {
  const rissImg  = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/riss.png')));
  const robotImg = await loadImage(fs.readFileSync(path.join(__dirname,'../public/img/robot.png')));

  const ARTICLES = makeArticles(rissImg, robotImg);

  for (const article of ARTICLES) {
    const dir = path.join(__dirname,`../public/manga/${article.slug}`);
    fs.mkdirSync(dir,{recursive:true});

    for (let i=0; i<article.panels.length; i++) {
      const p = article.panels[i];
      const canvas = await drawPanel({
        bgDraw:     p.bgDraw,
        sceneDraw:  p.sceneDraw,
        chars:      p.chars || [],
        effectsDraw:p.effectsDraw,
        bubbles:    p.bubbles || [],
        panelNum:   i+1,
        nb1:        p.nb1,
        nb2:        p.nb2,
        border:     p.border,
      });
      const out = path.join(dir,`panel-0${i+1}.png`);
      fs.writeFileSync(out, canvas.toBuffer('image/png'));
      console.log(`✅ ${article.slug}/panel-0${i+1}.png`);
    }
  }
  console.log('\n🎉 完了！');
}

main().catch(console.error);
