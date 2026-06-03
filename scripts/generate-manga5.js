'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 600, H = 750;

// ── 共通ユーティリティ（generate-manga4と同一） ─────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

function drawBubble(ctx, bx, by, bw, bh, tail, fill, border) {
  roundRect(ctx, bx, by, bw, bh, 18);
  ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=border; ctx.lineWidth=3.5; ctx.stroke();
  if (!tail) return;
  const tw=22, tl=30;
  ctx.save(); ctx.beginPath();
  if (tail==='left')   { ctx.moveTo(bx+2,by+bh/2-tw/2); ctx.lineTo(bx-tl,by+bh/2); ctx.lineTo(bx+2,by+bh/2+tw/2); }
  else if (tail==='right')  { ctx.moveTo(bx+bw-2,by+bh/2-tw/2); ctx.lineTo(bx+bw+tl,by+bh/2); ctx.lineTo(bx+bw-2,by+bh/2+tw/2); }
  else if (tail==='bottom') { ctx.moveTo(bx+bw/2-tw/2,by+bh-2); ctx.lineTo(bx+bw/2,by+bh+tl); ctx.lineTo(bx+bw/2+tw/2,by+bh-2); }
  else if (tail==='top')    { ctx.moveTo(bx+bw/2-tw/2,by+2); ctx.lineTo(bx+bw/2,by-tl); ctx.lineTo(bx+bw/2+tw/2,by+2); }
  else if (tail==='bl') { ctx.moveTo(bx+16,by+bh-2); ctx.lineTo(bx-12,by+bh+tl); ctx.lineTo(bx+16+tw,by+bh-2); }
  else if (tail==='br') { ctx.moveTo(bx+bw-16-tw,by+bh-2); ctx.lineTo(bx+bw+12,by+bh+tl); ctx.lineTo(bx+bw-16,by+bh-2); }
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=border; ctx.lineWidth=3.5; ctx.stroke();
  ctx.strokeStyle=fill; ctx.lineWidth=5; ctx.beginPath();
  if (tail==='left')   { ctx.moveTo(bx+3,by+bh/2-tw/2+3); ctx.lineTo(bx+3,by+bh/2+tw/2-3); }
  if (tail==='right')  { ctx.moveTo(bx+bw-3,by+bh/2-tw/2+3); ctx.lineTo(bx+bw-3,by+bh/2+tw/2-3); }
  if (tail==='bottom') { ctx.moveTo(bx+bw/2-tw/2+3,by+bh-3); ctx.lineTo(bx+bw/2+tw/2-3,by+bh-3); }
  if (tail==='top')    { ctx.moveTo(bx+bw/2-tw/2+3,by+3); ctx.lineTo(bx+bw/2+tw/2-3,by+3); }
  if (tail==='bl')     { ctx.moveTo(bx+18,by+bh-3); ctx.lineTo(bx+16+tw-2,by+bh-3); }
  if (tail==='br')     { ctx.moveTo(bx+bw-16-tw+2,by+bh-3); ctx.lineTo(bx+bw-18,by+bh-3); }
  ctx.stroke(); ctx.restore();
}

function drawBubbleText(ctx, msg, bx, by, bw, bh, color) {
  const n=msg.replace(/\n/g,'').length;
  const fs=n>20?21:n>14?25:29;
  ctx.font=`bold ${fs}px "Yu Gothic"`;
  ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle';
  const lines=msg.split('\n'), lh=fs*1.65;
  const sy=by+bh/2-((lines.length-1)*lh)/2;
  lines.forEach((ln,i)=>ctx.fillText(ln,bx+bw/2,sy+i*lh));
}

function drawBadge(ctx, num, bg1, bg2) {
  const bx=W-56,by=8,br=24;
  const g=ctx.createLinearGradient(bx,by,bx+br*2,by+br*2);
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
  const nw=ctx.measureText(name).width+16, nh=22;
  roundRect(ctx,cx-nw/2,y,nw,nh,8);
  ctx.fillStyle=bg; ctx.fill();
  ctx.fillStyle=fg; ctx.fillText(name,cx,y+14);
}

function drawSpeedLines(ctx, cx, cy, n, r1, r2, color, alpha) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle=color; ctx.lineWidth=1.5;
  for (let i=0;i<n;i++) {
    const a=(i/n)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2); ctx.stroke();
  }
  ctx.restore();
}

function drawImpact(ctx, cx, cy, size, color) {
  ctx.save(); ctx.fillStyle=color;
  const pts=8; ctx.beginPath();
  for (let i=0;i<pts*2;i++) {
    const r=i%2===0?size:size*0.42;
    const a=(i/(pts*2))*Math.PI*2-Math.PI/2;
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
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*(r+6),cy+Math.sin(a)*(r+6));
    ctx.lineTo(cx+Math.cos(a)*(r+24),cy+Math.sin(a)*(r+24)); ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawSfx(ctx, text, cx, cy, size, color) {
  ctx.save();
  ctx.font=`bold ${size}px "Yu Gothic"`;
  ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.strokeStyle='white'; ctx.lineWidth=6; ctx.lineJoin='round';
  ctx.strokeText(text,cx,cy); ctx.fillText(text,cx,cy);
  ctx.restore();
}

// ── パネルエンジン ─────────────────────────────────────────

async function drawPanel({ bgDraw, sceneDraw, chars=[], effectsDraw, bubbles=[], panelNum, nb1, nb2, border='#1E293B' }) {
  const canvas=createCanvas(W,H); const ctx=canvas.getContext('2d');
  bgDraw&&bgDraw(ctx); sceneDraw&&sceneDraw(ctx);
  for (const c of chars) {
    drawChar(ctx,c.img,c.x,c.y,c.size,c.flip||false);
    if (c.name) nameTag(ctx,c.name,c.x+c.size/2,c.y+c.size+2,c.nb||'rgba(0,0,0,0.5)',c.nf||'white');
  }
  effectsDraw&&effectsDraw(ctx);
  for (const b of bubbles) {
    drawBubble(ctx,b.x,b.y,b.w,b.h,b.tail,b.fill,b.border);
    drawBubbleText(ctx,b.msg,b.x,b.y,b.w,b.h,b.tc);
  }
  drawBadge(ctx,panelNum,nb1,nb2);
  ctx.strokeStyle=border; ctx.lineWidth=5; ctx.strokeRect(3,3,W-6,H-6);
  return canvas;
}

// ── 定数 ──────────────────────────────────────────────────

const RB={nb1:'#FF8C00',nb2:'#FFD000'};
const QB={nb1:'#1E3A8A',nb2:'#06B6D4'};
const RF='#FFFEF0',RBR='#F59E0B',RTC='#78350F';
const QF='#F0F9FF',QBR='#3B82F6',QTC='#1E40AF';

// ── 共通シーン要素 ─────────────────────────────────────────

function darkRoom(ctx) {
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1A2535'); g.addColorStop(1,'#0F1825');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2A1E10'; ctx.fillRect(0,H*0.8,W,H*0.2);
}

function brightRoom(ctx) {
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#F0F8FF'); g.addColorStop(1,'#E0F0E8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.8,W,H*0.2);
}

function drawWaterBottles(ctx, x, y, count, cols) {
  for (let i=0;i<count;i++) {
    const bx=x+(i%cols)*52, by=y-Math.floor(i/cols)*80;
    ctx.fillStyle='#B8D8F0'; ctx.fillRect(bx,by,38,72);
    ctx.strokeStyle='#7AB0D0'; ctx.lineWidth=2; ctx.strokeRect(bx,by,38,72);
    ctx.fillStyle='#2563EB'; ctx.fillRect(bx+7,by-12,24,14);
    ctx.fillStyle='#1E40AF'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
    ctx.fillText('水',bx+19,by+42);
  }
}

function drawShelf(ctx, x, y, w, h) {
  ctx.fillStyle='#7A5030'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#5A3018'; ctx.lineWidth=2; ctx.strokeRect(x,y,w,h);
  [y+h*0.3, y+h*0.6].forEach(sy=>{
    ctx.fillStyle='#6A4228'; ctx.fillRect(x,sy,w,12);
  });
}

function drawKitchen(ctx) {
  // 壁
  ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.7);
  // 床
  ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.7,W,H*0.3);
  // シンク台
  ctx.fillStyle='#A0A8B0'; ctx.fillRect(W*0.3,H*0.5,W*0.65,H*0.3);
  ctx.strokeStyle='#808890'; ctx.lineWidth=2; ctx.strokeRect(W*0.3,H*0.5,W*0.65,H*0.3);
  // シンク
  ctx.fillStyle='#707880'; ctx.fillRect(W*0.38,H*0.52,180,100);
  ctx.strokeStyle='#505860'; ctx.lineWidth=3; ctx.strokeRect(W*0.38,H*0.52,180,100);
  // 蛇口
  ctx.fillStyle='#888'; ctx.fillRect(W*0.38+80,H*0.45,12,55);
  ctx.fillStyle='#999'; ctx.fillRect(W*0.38+68,H*0.45,36,10);
}

// ── 記事定義 ──────────────────────────────────────────────

function makeArticles(riss, robot) { return [

  // ─────────────────────────────────────────────
  // 1. blackout-water — 停電＋断水
  // ─────────────────────────────────────────────
  { slug: 'blackout-water', panels: [

    // P1: 危険発生 — 停電＋断水シーン
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        // 暗い（停電）
        const dark=ctx.createRadialGradient(W/2,H/2,50,W/2,H/2,350);
        dark.addColorStop(0,'rgba(0,0,0,0.3)'); dark.addColorStop(1,'rgba(0,0,0,0.75)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // 蛇口から水が出ない
        ctx.fillStyle='#FF4444'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.9;
        ctx.fillText('⚡ 停電！', W*0.6, H*0.3);
        ctx.fillText('💧 断水！', W*0.6, H*0.38);
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'ガーン…',W/2,H*0.15,44,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — 蛇口をひねっても出ない
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        const dark=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,300);
        dark.addColorStop(0,'rgba(0,0,0,0.2)'); dark.addColorStop(1,'rgba(0,0,0,0.7)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // ×マーク（水が出ない）
        ctx.strokeStyle='#FF4444'; ctx.lineWidth=5; ctx.globalAlpha=0.8;
        const fx=W*0.38+86, fy=H*0.42;
        ctx.beginPath(); ctx.moveTo(fx-16,fy-16); ctx.lineTo(fx+16,fy+16); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx+16,fy-16); ctx.lineTo(fx-16,fy+16); ctx.stroke();
        ctx.globalAlpha=1;
      },
      chars: [{ img:riss, x:30, y:H*0.35, size:140, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:200, y:14, w:275, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'水が出ない…\nどうすれば…' }],
    },

    // P3: ロボが止める
    { ...QB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        const dark=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,300);
        dark.addColorStop(0,'rgba(0,0,0,0.15)'); dark.addColorStop(1,'rgba(0,0,0,0.65)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        drawSpeedLines(ctx,W*0.62,H*0.42,20,40,180,'#3B82F6',0.28);
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.2, size:155, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5, size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'！',W*0.28,H*0.18,66,'#FF3333'); },
      bubbles: [{ x:14, y:14, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'2L×人数×3日分の\n備蓄水が必要だ！' }],
    },

    // P4: 行動 — 備蓄水を使う
    { ...RB, bgDraw: brightRoom,
      sceneDraw(ctx) {
        // 明るいキッチン
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.7);
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.7,W,H*0.3);
        drawShelf(ctx, W*0.5, H*0.1, 210, H*0.65);
        drawWaterBottles(ctx, W*0.52, H*0.62, 6, 3);
        // ラベル
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,W*0.5,H*0.72,210,40,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('２L×３日分 備蓄！', W*0.5+105, H*0.72+26);
        drawSun(ctx, 60, 60, 30);
      },
      chars: [{ img:riss, x:55, y:H*0.35, size:145, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'備蓄水があれば\n断水も乗り切れる！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 2. disaster-water — 備蓄水
  // ─────────────────────────────────────────────
  { slug: 'disaster-water', panels: [

    // P1: 危険発生 — 地震で配管破損・濁り水
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1A08'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        drawKitchen(ctx);
        // 揺れエフェクト
        drawSpeedLines(ctx,W/2,H/2,20,30,280,'#F59E0B',0.18);
        // 配管から濁り水
        ctx.fillStyle='rgba(180,140,80,0.7)';
        ctx.beginPath(); ctx.ellipse(W*0.38+86,H*0.62,30,12,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#A06020'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.85;
        ctx.fillText('配管破損！', W*0.5, H*0.42);
        ctx.fillText('⚠ 濁り水', W*0.5, H*0.5);
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'ドーン！',W/2,H*0.12,48,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — 水道水を飲もうとする
    { ...RB,
      bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        // 蛇口から濁り水
        ctx.fillStyle='rgba(180,140,60,0.5)';
        ctx.beginPath(); ctx.ellipse(W*0.38+86,H*0.58,22,9,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#B07030'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.8;
        ctx.fillText('※ 濁っている…', W*0.5, H*0.44);
        ctx.globalAlpha=1;
      },
      chars: [{ img:riss, x:30, y:H*0.35, size:140, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:190, y:14, w:290, h:120, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'配管、大丈夫かな？\n飲んでも平気？' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        drawSpeedLines(ctx,W*0.6,H*0.4,20,40,180,'#3B82F6',0.25);
        drawImpact(ctx,W*0.55,H*0.22,40,'#3B82F6');
      },
      chars: [
        { img:robot, x:W*0.36, y:H*0.2, size:155, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5, size:112, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'待て！',W*0.26,H*0.18,44,'#DC2626'); },
      bubbles: [{ x:14, y:14, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'配管が無事か\n確認してから使え！\n備蓄水を優先せよ！' }],
    },

    // P4: 行動 — 備蓄水を使う
    { ...RB, bgDraw: brightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.7);
        drawShelf(ctx,W*0.5,H*0.08,215,H*0.7);
        drawWaterBottles(ctx,W*0.52,H*0.68,9,3);
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.5,H*0.77,215,44,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('１人21L以上 備蓄済！',W*0.5+107,H*0.77+28);
        drawSun(ctx,60,60,30);
      },
      chars: [{ img:riss, x:50, y:H*0.32, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.18,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:290, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'備蓄水を使えば\n安全に過ごせる！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 3. emergency-food — 非常食
  // ─────────────────────────────────────────────
  { slug: 'emergency-food', panels: [

    // P1: 危険発生 — スーパーが空っぽ
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#F0EDE8'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.8,W,H*0.2);
      },
      sceneDraw(ctx) {
        // 店内
        ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H*0.8);
        // 天井照明
        [W*0.25,W*0.75].forEach(x=>{
          ctx.fillStyle='rgba(255,255,200,0.8)'; ctx.fillRect(x-40,0,80,12);
          const lg=ctx.createRadialGradient(x,6,0,x,6,150);
          lg.addColorStop(0,'rgba(255,255,150,0.3)'); lg.addColorStop(1,'transparent');
          ctx.fillStyle=lg; ctx.fillRect(x-150,0,300,200);
        });
        // 棚（空）
        [[40,H*0.15],[40,H*0.38],[40,H*0.61],[W*0.52,H*0.15],[W*0.52,H*0.38],[W*0.52,H*0.61]].forEach(([x,y])=>{
          ctx.fillStyle='#8B6040'; ctx.fillRect(x,y,220,16);
          ctx.strokeStyle='#6A4028'; ctx.lineWidth=1.5; ctx.strokeRect(x,y,220,16);
          // 空の棚に「SOLD OUT」
          ctx.fillStyle='rgba(200,50,50,0.15)'; ctx.fillRect(x,y+16,220,H*0.23-16);
          ctx.fillStyle='#CC4444'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.6;
          ctx.fillText('SOLD OUT',x+110,y+H*0.12);
          ctx.globalAlpha=1;
        });
      },
      chars: [],
      effectsDraw(ctx) {
        ctx.fillStyle='#DC2626'; ctx.font='bold 26px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.9;
        ctx.fillText('⚠ 食料が全部なくなった！',W/2,H*0.08);
        ctx.globalAlpha=1;
      },
      bubbles: [],
    },

    // P2: 失敗しそう — 棚が空で途方に暮れるリス
    { ...RB,
      bgDraw(ctx) { ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.8,W,H*0.2);
        // 空の棚
        [H*0.2,H*0.45,H*0.65].forEach(y=>{
          ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.48,y,220,14);
          ctx.fillStyle='rgba(200,50,50,0.12)'; ctx.fillRect(W*0.48,y+14,220,H*0.22);
          ctx.fillStyle='#CC4444'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.5;
          ctx.fillText('空…',W*0.48+110,y+H*0.14);
          ctx.globalAlpha=1;
        });
      },
      chars: [{ img:riss, x:30, y:H*0.3, size:145, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'ガーン',W*0.38,H*0.12,40,'#DC2626'); },
      bubbles: [{ x:185, y:14, w:290, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'何も残ってない…\n家に食料がない！' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw(ctx) { ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.8,W,H*0.2);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,180,'#3B82F6',0.28);
        drawImpact(ctx,W*0.58,H*0.2,42,'#3B82F6');
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'！！',W*0.3,H*0.17,62,'#FF3333'); },
      bubbles: [{ x:14, y:14, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'7日分の非常食を\n今すぐ家に備蓄しろ！\nローリングストックで管理！' }],
    },

    // P4: 行動 — 備蓄完了
    { ...RB, bgDraw: brightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.7);
        drawShelf(ctx,W*0.5,H*0.08,215,H*0.7);
        // 缶詰・レトルト
        for (let r=0;r<2;r++) for (let c=0;c<3;c++) {
          const bx=W*0.52+18+c*60, by=H*0.22+r*90;
          ctx.fillStyle=['#E8C878','#D4905A','#80C0E8'][c]; ctx.fillRect(bx,by,46,70);
          ctx.strokeStyle='#888'; ctx.lineWidth=1.5; ctx.strokeRect(bx,by,46,70);
          ctx.fillStyle='#333'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText(['缶詰','レトルト','アルファ米'][c],bx+23,by+42);
        }
        drawWaterBottles(ctx,W*0.52,H*0.72,3,3);
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.5,H*0.8,215,42,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('７日分 備蓄完了！',W*0.5+107,H*0.8+27);
        drawSun(ctx,60,60,30);
      },
      chars: [{ img:riss, x:50, y:H*0.35, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:290, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'備蓄があれば\n食料難も乗り切れる！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 4. lantern — ランタン
  // ─────────────────────────────────────────────
  { slug: 'lantern', panels: [

    // P1: 危険発生 — 真っ暗な停電
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        const dark=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,380);
        dark.addColorStop(0,'rgba(0,0,0,0.6)'); dark.addColorStop(1,'rgba(0,0,0,0.95)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // 家具シルエット
        ctx.fillStyle='rgba(30,30,40,0.8)';
        ctx.fillRect(30,H*0.55,180,90); // ソファ
        ctx.fillRect(W*0.55,H*0.45,150,110); // タンス
        // 電球（消えた）
        ctx.fillStyle='rgba(80,80,80,0.4)'; ctx.beginPath(); ctx.arc(W/2,70,30,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='rgba(100,100,100,0.3)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(W/2,40); ctx.lineTo(W/2,30); ctx.stroke();
        ctx.fillStyle='rgba(150,150,150,0.4)'; ctx.font='bold 20px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('×',W/2,77);
      },
      chars: [],
      effectsDraw(ctx) {
        drawSfx(ctx,'⚡ 停電！！',W/2,H*0.18,46,'#FF6600');
        ctx.fillStyle='rgba(200,200,200,0.3)'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('真っ暗…',W/2,H*0.45);
      },
      bubbles: [],
    },

    // P2: 失敗しそう — スマホライトで代用（バッテリー消費）
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        const dark=ctx.createRadialGradient(200,H*0.6,0,200,H*0.6,200);
        dark.addColorStop(0,'rgba(255,255,200,0.2)'); dark.addColorStop(1,'rgba(0,0,0,0.85)');
        ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // スマホ画面（バッテリー低）
        ctx.fillStyle='#111'; ctx.fillRect(W*0.6,H*0.3,120,210);
        ctx.strokeStyle='#333'; ctx.lineWidth=3; ctx.strokeRect(W*0.6,H*0.3,120,210);
        ctx.fillStyle='#222'; ctx.fillRect(W*0.6+8,H*0.3+12,104,158);
        // バッテリー表示
        ctx.fillStyle='#FF3333'; ctx.fillRect(W*0.6+18,H*0.3+25,20,18);
        ctx.fillStyle='#FF5555'; ctx.fillRect(W*0.6+38,H*0.3+28,4,12);
        ctx.fillStyle='white'; ctx.font='bold 11px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('1%',W*0.6+28,H*0.3+38);
        ctx.fillStyle='#FF4444'; ctx.font='bold 16px "Yu Gothic"';
        ctx.fillText('電池切れ寸前',W*0.6+60,H*0.3+88);
        ctx.fillStyle='rgba(255,255,200,0.3)'; ctx.font='10px sans-serif';
        ctx.fillText('フラッシュ使用中',W*0.6+60,H*0.3+130);
      },
      chars: [{ img:riss, x:20, y:H*0.38, size:148, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:185, y:14, w:290, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'スマホライトで\nなんとかなるかな♪' }],
    },

    // P3: ロボが止める
    { ...QB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,180,'#3B82F6',0.28);
        drawImpact(ctx,W*0.56,H*0.2,42,'#3B82F6');
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'ダメだ！',W*0.26,H*0.17,38,'#FF3333'); },
      bubbles: [{ x:14, y:14, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'スマホの電池が切れたら\n通信も不能になるぞ！\nLEDランタンを使え！' }],
    },

    // P4: 行動 — ランタンで明るい部屋
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createRadialGradient(W/2,H*0.45,30,W/2,H*0.45,350);
        g.addColorStop(0,'#FFF8DC'); g.addColorStop(1,'#2A2018');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='rgba(30,20,10,0.4)'; ctx.fillRect(0,H*0.8,W,H*0.2);
        // ランタン（光の輪）
        const lanternGlow=ctx.createRadialGradient(W*0.62,H*0.38,0,W*0.62,H*0.38,240);
        lanternGlow.addColorStop(0,'rgba(255,220,100,0.55)');
        lanternGlow.addColorStop(0.6,'rgba(255,200,80,0.15)');
        lanternGlow.addColorStop(1,'transparent');
        ctx.fillStyle=lanternGlow; ctx.fillRect(0,0,W,H);
        // ランタン本体
        ctx.fillStyle='#C8A050'; ctx.fillRect(W*0.55,H*0.2,80,100);
        ctx.strokeStyle='#A08030'; ctx.lineWidth=3; ctx.strokeRect(W*0.55,H*0.2,80,100);
        ctx.fillStyle='rgba(255,220,100,0.85)'; ctx.fillRect(W*0.55+8,H*0.2+12,64,76);
        ctx.fillStyle='#FFE040'; ctx.beginPath(); ctx.arc(W*0.55+40,H*0.2+50,18,0,Math.PI*2); ctx.fill();
        // スマホバッテリー満タン
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,W*0.52,H*0.7,230,40,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('🔦 スマホ電池温存！',W*0.52+115,H*0.7+26);
      },
      chars: [{ img:riss, x:30, y:H*0.4, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.22,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:310, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'LEDランタンで\n部屋が明るい！\nスマホも温存できた！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 5. cassette-stove — カセットコンロ
  // ─────────────────────────────────────────────
  { slug: 'cassette-stove', panels: [

    // P1: 危険発生 — 停電でIHが使えない
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        const dark=ctx.createRadialGradient(W/2,H/2,40,W/2,H/2,350);
        dark.addColorStop(0,'rgba(0,0,0,0.3)'); dark.addColorStop(1,'rgba(0,0,0,0.75)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // IHコンロ（消えた）
        ctx.fillStyle='#1A1A1A'; ctx.fillRect(W*0.35,H*0.47,200,80);
        ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.strokeRect(W*0.35,H*0.47,200,80);
        ctx.fillStyle='rgba(200,50,50,0.4)'; ctx.font='bold 28px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('×',W*0.35+100,H*0.47+52);
        ctx.fillStyle='#FF4444'; ctx.font='bold 15px "Yu Gothic"'; ctx.globalAlpha=0.8;
        ctx.fillText('IHコンロ使用不可',W*0.35+100,H*0.38);
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'⚡ 停電！',W/2,H*0.12,46,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — コンロのスイッチを押しても動かない
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx);
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#1A1A1A'; ctx.fillRect(W*0.44,H*0.48,190,75);
        ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.strokeRect(W*0.44,H*0.48,190,75);
        ctx.fillStyle='#FF3333'; ctx.font='bold 22px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.7;
        ctx.fillText('反応なし',W*0.44+95,H*0.48+45);
        ctx.globalAlpha=1;
      },
      chars: [{ img:riss, x:30, y:H*0.33, size:145, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:185, y:14, w:290, h:120, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'お湯も沸かせない…\nご飯も炊けない！' }],
    },

    // P3: ロボが止める
    { ...QB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        drawKitchen(ctx); ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,W,H);
        drawSpeedLines(ctx,W*0.62,H*0.4,20,40,180,'#3B82F6',0.28);
        drawImpact(ctx,W*0.56,H*0.2,40,'#3B82F6');
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.18, size:155, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'！',W*0.28,H*0.17,62,'#FF3333'); },
      bubbles: [{ x:14, y:14, w:308, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'カセットコンロ＋\nボンベ12本以上が\n防災の基本だ！' }],
    },

    // P4: 行動 — カセットコンロで調理
    { ...RB, bgDraw: brightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.7);
        // カセットコンロ
        ctx.fillStyle='#333'; ctx.fillRect(W*0.45,H*0.42,200,60);
        ctx.strokeStyle='#555'; ctx.lineWidth=2; ctx.strokeRect(W*0.45,H*0.42,200,60);
        // 炎（青）
        ctx.fillStyle='#3B82F6'; ctx.globalAlpha=0.7;
        ctx.beginPath(); ctx.ellipse(W*0.45+100,H*0.42,30,15,0,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
        // 鍋
        ctx.fillStyle='#888'; ctx.fillRect(W*0.45+50,H*0.3,100,115);
        ctx.strokeStyle='#666'; ctx.lineWidth=2; ctx.strokeRect(W*0.45+50,H*0.3,100,115);
        ctx.fillStyle='rgba(200,80,80,0.4)'; ctx.fillRect(W*0.45+50,H*0.3,100,30);
        // 湯気
        ctx.strokeStyle='rgba(200,200,200,0.6)'; ctx.lineWidth=3; ctx.setLineDash([4,6]);
        [[W*0.45+70,H*0.28],[W*0.45+100,H*0.24],[W*0.45+130,H*0.28]].forEach(([x,y])=>{
          ctx.beginPath(); ctx.moveTo(x,y+6); ctx.bezierCurveTo(x-10,y-10,x+10,y-20,x,y-36); ctx.stroke();
        });
        ctx.setLineDash([]);
        // ボンベ収納
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,W*0.5,H*0.77,210,40,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('ガス缶12本 備蓄！',W*0.5+105,H*0.77+26);
        drawSun(ctx,60,60,30);
      },
      chars: [{ img:riss, x:30, y:H*0.35, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'カセットコンロで\n温かい食事が作れる！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 6. portable-power-station — ポータブル電源
  // ─────────────────────────────────────────────
  { slug: 'portable-power-station', panels: [

    // P1: 危険発生 — 3日以上の長期停電
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        const dark=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,380);
        dark.addColorStop(0,'rgba(0,0,0,0.7)'); dark.addColorStop(1,'rgba(0,0,0,0.95)');
        ctx.fillStyle=dark; ctx.fillRect(0,0,W,H);
        // カレンダー（3日）
        ctx.fillStyle='#1E3A8A'; ctx.fillRect(W*0.3,H*0.2,240,160);
        ctx.strokeStyle='#3B82F6'; ctx.lineWidth=2; ctx.strokeRect(W*0.3,H*0.2,240,160);
        ctx.fillStyle='white'; ctx.font='bold 22px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('停電3日目',W*0.3+120,H*0.2+40);
        ctx.font='bold 60px "Yu Gothic"'; ctx.fillStyle='#FF6B6B';
        ctx.fillText('⚡',W*0.3+120,H*0.2+120);
        // 死んだデバイス
        ctx.fillStyle='rgba(40,40,40,0.8)';
        ctx.fillRect(30,H*0.55,100,60); // スマホ
        ctx.fillRect(160,H*0.55,120,70); // ノートPC
        ctx.fillRect(310,H*0.55,80,50); // タブレット
        ['📱','💻','📟'].forEach((e,i)=>{
          ctx.fillStyle='rgba(180,180,180,0.5)'; ctx.font='24px serif'; ctx.textAlign='center';
          ctx.fillText(e,[80,220,350][i],H*0.55+35);
        });
      },
      chars: [],
      effectsDraw(ctx) {
        ctx.fillStyle='#FF6B6B'; ctx.font='bold 20px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.9;
        ctx.fillText('全機器が使えない！',W/2,H*0.12);
        ctx.globalAlpha=1;
      },
      bubbles: [],
    },

    // P2: 失敗しそう — スマホが充電できない
    { ...RB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H);
        // コンセントから煙（停電）
        ctx.fillStyle='#333'; ctx.fillRect(W*0.55,H*0.35,80,60);
        ctx.strokeStyle='#555'; ctx.lineWidth=2; ctx.strokeRect(W*0.55,H*0.35,80,60);
        ctx.fillStyle='#CC4444'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.8;
        ctx.fillText('×',W*0.55+40,H*0.35+36);
        ctx.globalAlpha=1;
        // 充電コード（繋いでも無駄）
        ctx.strokeStyle='#555'; ctx.lineWidth=4; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(W*0.55+40,H*0.35); ctx.lineTo(W*0.36,H*0.62); ctx.stroke();
      },
      chars: [{ img:riss, x:14, y:H*0.42, size:148, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:185, y:14, w:290, h:120, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'スマホもPCも\n充電できない…\nどうすれば！' }],
    },

    // P3: ロボが止める
    { ...QB, bgDraw: darkRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,180,'#3B82F6',0.3);
        drawImpact(ctx,W*0.56,H*0.2,40,'#3B82F6');
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:14,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'！',W*0.28,H*0.17,62,'#FF3333'); },
      bubbles: [{ x:14, y:14, w:308, h:140, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'1000Wh以上の\nポータブル電源があれば\nスマホ・照明・扇風機\nまで動かせるぞ！' }],
    },

    // P4: 行動 — ポータブル電源で快適
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0F8FF'); g.addColorStop(1,'#E0ECF8');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.8,W,H*0.2);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E4D8'; ctx.fillRect(0,0,W,H*0.7);
        // ポータブル電源
        ctx.fillStyle='#1E2A3A'; ctx.fillRect(W*0.48,H*0.35,200,120);
        ctx.strokeStyle='#3B82F6'; ctx.lineWidth=3; ctx.strokeRect(W*0.48,H*0.35,200,120);
        ctx.fillStyle='#60A0D0'; ctx.fillRect(W*0.48+12,H*0.35+15,176,55);
        // バッテリー残量（緑）
        ctx.fillStyle='#22C55E'; ctx.fillRect(W*0.48+16,H*0.35+19,160,47);
        ctx.fillStyle='white'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('🔋 1000Wh  充電92%',W*0.48+100,H*0.35+47);
        // ACコンセント
        ctx.fillStyle='#888'; ctx.fillRect(W*0.48+14,H*0.35+80,50,30);
        ctx.fillStyle='white'; ctx.font='bold 11px "Yu Gothic"'; ctx.fillText('AC 100V',W*0.48+39,H*0.35+97);
        // 接続デバイス
        ['📱','💡','🌀'].forEach((e,i)=>{
          ctx.fillStyle='rgba(255,255,255,0.9)'; roundRect(ctx,W*0.48-110+i*38,H*0.55,32,44,6); ctx.fill();
          ctx.font='18px serif'; ctx.textAlign='center'; ctx.fillText(e,W*0.48-94+i*38,H*0.55+28);
        });
        ctx.strokeStyle='#3B82F6'; ctx.lineWidth=2;
        [W*0.48-94,W*0.48-56,W*0.48-18].forEach(x=>{
          ctx.beginPath(); ctx.moveTo(x,H*0.55); ctx.lineTo(x,H*0.35+100); ctx.stroke();
        });
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.48,H*0.77,200,38,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('72時間以上使える！',W*0.48+100,H*0.77+24);
      },
      chars: [{ img:riss, x:24, y:H*0.35, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.22,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:14, y:14, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'電源があれば\n長期停電も\n乗り切れる！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 7. evacuation-shelter-basics — 避難所の基本
  // ─────────────────────────────────────────────
  { slug: 'evacuation-shelter-basics', panels: [

    // P1: 危険発生 — 混雑した避難所入り口
    { ...RB,
      bgDraw(ctx) { ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#D4CCC0'; ctx.fillRect(0,0,W,H*0.78);
        // 避難所看板
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.15,H*0.04,W*0.7,55);
        ctx.fillStyle='white'; ctx.font='bold 26px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('🏫 避難所　受付→', W/2, H*0.04+37);
        // 混雑する人々
        const pplPos=[[60,H*0.55],[140,H*0.52],[220,H*0.55],[300,H*0.53],[380,H*0.55],[460,H*0.52],[540,H*0.54],
                      [90,H*0.67],[180,H*0.68],[280,H*0.67],[380,H*0.69],[480,H*0.67]];
        pplPos.forEach(([x,y])=>{
          ctx.fillStyle='#5068A0'; ctx.globalAlpha=0.7;
          ctx.beginPath(); ctx.arc(x,y-20,12,0,Math.PI*2); ctx.fill();
          ctx.fillRect(x-9,y-7,18,22);
          ctx.globalAlpha=1;
        });
        // 混雑感
        ctx.fillStyle='#DC2626'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.75;
        ctx.fillText('⚠ 大混雑！どこへ行けば？',W/2,H*0.35);
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) {},
      bubbles: [],
    },

    // P2: 失敗しそう — 受付を無視してさまようリス
    { ...RB,
      bgDraw(ctx) { ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#D4CCC0'; ctx.fillRect(0,0,W,H*0.78);
        // 受付（スルー）
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.52,H*0.35,200,120);
        ctx.strokeStyle='#6A4028'; ctx.lineWidth=2; ctx.strokeRect(W*0.52,H*0.35,200,120);
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.52,H*0.35,200,32);
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('受付はこちら',W*0.52+100,H*0.35+22);
        // リスが受付を無視して通り過ぎる方向を示す矢印
        ctx.strokeStyle='#FF4444'; ctx.lineWidth=3; ctx.globalAlpha=0.7;
        ctx.beginPath(); ctx.moveTo(W*0.38,H*0.55); ctx.lineTo(W*0.22,H*0.55); ctx.stroke();
        ctx.fillStyle='#FF4444'; ctx.font='12px sans-serif'; ctx.fillText('通り過ぎてる',W*0.3,H*0.48);
        ctx.globalAlpha=1;
      },
      chars: [{ img:riss, x:10, y:H*0.38, size:138, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:165, y:14, w:300, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'どこに座れば\nいいんだろう？\n勝手に入っていいかな…' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw(ctx) { ctx.fillStyle='#E0D8CC'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B090'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#D4CCC0'; ctx.fillRect(0,0,W,H*0.78);
        drawSpeedLines(ctx,W*0.62,H*0.42,20,40,180,'#3B82F6',0.25);
        drawImpact(ctx,W*0.55,H*0.2,40,'#3B82F6');
        // 受付（強調）
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.52,H*0.48,185,110);
        ctx.strokeStyle='#22C55E'; ctx.lineWidth=3; ctx.strokeRect(W*0.52,H*0.48,185,110);
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('→ まず受付！',W*0.52+92,H*0.48+32);
        ctx.fillText('→ 名前を登録',W*0.52+92,H*0.48+60);
        ctx.fillText('→ 場所の指定',W*0.52+92,H*0.48+88);
      },
      chars: [
        { img:robot, x:W*0.36, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:10,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'待て！',W*0.25,H*0.17,40,'#DC2626'); },
      bubbles: [{ x:10, y:10, w:310, h:120, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'まず受付で\n手続きせよ！\n勝手に動くな！' }],
    },

    // P4: 行動 — 受付完了、落ち着いた
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0FDF4'); g.addColorStop(1,'#E8F8F0');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.8,W,H*0.2);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#E4ECE4'; ctx.fillRect(0,0,W,H*0.78);
        // 受付カウンター（完了）
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.48,H*0.38,215,110);
        ctx.strokeStyle='#22C55E'; ctx.lineWidth=3; ctx.strokeRect(W*0.48,H*0.38,215,110);
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.48,H*0.38,215,32);
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('✅ 受付完了',W*0.48+107,H*0.38+22);
        ctx.fillStyle='#0F172A'; ctx.font='bold 13px "Yu Gothic"';
        ctx.fillText('名前：防災リス',W*0.48+107,H*0.38+58);
        ctx.fillText('エリア：D-3',W*0.48+107,H*0.38+80);
        ctx.fillText('食事：朝・夕2回',W*0.48+107,H*0.38+102);
      },
      chars: [{ img:riss, x:24, y:H*0.35, size:145, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.32,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:10, y:10, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'受付でルール確認！\n安心して避難できた！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 8. mansion-disaster-prep — マンション防災
  // ─────────────────────────────────────────────
  { slug: 'mansion-disaster-prep', panels: [

    // P1: 危険発生 — マンションで地震
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1A08'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        // マンション外観（揺れている）
        ctx.save(); ctx.translate(W/2,H*0.4); ctx.rotate(0.04);
        ctx.fillStyle='#B8C4C8'; ctx.fillRect(-130,-180,260,360);
        ctx.strokeStyle='#8898A8'; ctx.lineWidth=3; ctx.strokeRect(-130,-180,260,360);
        ctx.fillStyle='#9098A8'; ctx.fillRect(-130,-180,260,18);
        for (let r=0;r<4;r++) for (let c=0;c<3;c++) {
          ctx.fillStyle='#80B8D8'; ctx.fillRect(-110+c*80,r*70-155,55,46);
        }
        // ヒビ
        ctx.strokeStyle='#FF8800'; ctx.lineWidth=2.5; ctx.globalAlpha=0.7;
        ctx.beginPath(); ctx.moveTo(-60,-180); ctx.lineTo(-40,-50); ctx.lineTo(-70,80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80,-160); ctx.lineTo(100,-30); ctx.lineTo(75,100); ctx.stroke();
        ctx.globalAlpha=1;
        ctx.restore();
        drawSpeedLines(ctx,W/2,H*0.4,18,20,260,'#F59E0B',0.2);
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'ドドドド！！',W/2,H*0.1,44,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — エレベーターで降りようとする
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#D8D0C8'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#C0B8B0'; ctx.fillRect(0,H*0.78,W,H*0.22);
      },
      sceneDraw(ctx) {
        // 廊下
        ctx.fillStyle='#C8C0B8'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#B8B0A8'; ctx.fillRect(0,H*0.78,W,H*0.22);
        // エレベータードア
        ctx.fillStyle='#8090A0'; ctx.fillRect(W*0.45,H*0.08,180,H*0.7);
        ctx.strokeStyle='#607080'; ctx.lineWidth=4; ctx.strokeRect(W*0.45,H*0.08,180,H*0.7);
        // 真ん中の線
        ctx.beginPath(); ctx.moveTo(W*0.45+90,H*0.08); ctx.lineTo(W*0.45+90,H*0.78); ctx.stroke();
        // ボタン
        ctx.fillStyle='#60B060'; ctx.beginPath(); ctx.arc(W*0.45+20,H*0.44,14,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('▼',W*0.45+20,H*0.44+6);
        // 「▽」ボタンを押そうとするリスの手
        ctx.strokeStyle='#F0C0A0'; ctx.lineWidth=8; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(W*0.38,H*0.38); ctx.lineTo(W*0.45+14,H*0.44); ctx.stroke();
      },
      chars: [{ img:riss, x:20, y:H*0.32, size:140, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:170, y:14, w:300, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'エレベーターで\n下の階に逃げよう！' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw(ctx) { ctx.fillStyle='#D0C8C0'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#B8B0A8'; ctx.fillRect(0,H*0.78,W,H*0.22);
        // エレベーター（閉じた状態）
        ctx.fillStyle='#6878A0'; ctx.fillRect(W*0.48,H*0.15,175,H*0.62);
        ctx.strokeStyle='#FF4444'; ctx.lineWidth=3; ctx.strokeRect(W*0.48,H*0.15,175,H*0.62);
        ctx.fillStyle='#FF4444'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.85;
        ctx.fillText('⚠ 使用禁止！',W*0.48+87,H*0.15+45);
        ctx.fillText('閉じ込め危険！',W*0.48+87,H*0.15+75);
        ctx.globalAlpha=1;
        // ×印
        ctx.strokeStyle='#FF2222'; ctx.lineWidth=6; ctx.globalAlpha=0.7;
        ctx.beginPath(); ctx.moveTo(W*0.48+20,H*0.15+100); ctx.lineTo(W*0.48+155,H*0.77); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.48+155,H*0.15+100); ctx.lineTo(W*0.48+20,H*0.77); ctx.stroke();
        ctx.globalAlpha=1;
        drawSpeedLines(ctx,W*0.56,H*0.42,20,40,180,'#3B82F6',0.28);
      },
      chars: [
        { img:robot, x:W*0.3, y:H*0.18, size:162, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:10,    y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'ダメだ！',W*0.24,H*0.17,38,'#FF3333'); },
      bubbles: [{ x:10, y:10, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'地震後はエレベーター禁止！\n閉じ込められるぞ！\n階段で避難せよ！' }],
    },

    // P4: 行動 — 階段で安全に避難
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0F8FF'); g.addColorStop(1,'#E0ECF8');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#808080'; ctx.fillRect(0,H*0.78,W,H*0.22);
      },
      sceneDraw(ctx) {
        // 階段
        ctx.fillStyle='#E8E0D8'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#808080'; ctx.fillRect(0,H*0.78,W,H*0.22);
        // 非常口
        ctx.fillStyle='#16A34A'; ctx.fillRect(W*0.52,H*0.1,200,65);
        ctx.fillStyle='white'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('非常口 ▼ 階段',W*0.52+100,H*0.1+42);
        // 階段ステップ
        for (let i=0;i<6;i++) {
          ctx.fillStyle=i%2===0?'#C0B8B0':'#D0C8C0';
          ctx.fillRect(W*0.3+i*30,H*0.35+i*62,W*0.7-i*30,60);
          ctx.strokeStyle='#A0989A'; ctx.lineWidth=1; ctx.strokeRect(W*0.3+i*30,H*0.35+i*62,W*0.7-i*30,60);
        }
        // 手すり
        ctx.strokeStyle='#888'; ctx.lineWidth=5; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(W*0.3,H*0.32); ctx.lineTo(W,H*0.72); ctx.stroke();
        // 懐中電灯ライン
        const flashlight=ctx.createRadialGradient(180,H*0.42,0,180,H*0.42,160);
        flashlight.addColorStop(0,'rgba(255,230,150,0.25)'); flashlight.addColorStop(1,'transparent');
        ctx.fillStyle=flashlight; ctx.fillRect(0,H*0.25,360,H*0.4);
      },
      chars: [{ img:riss, x:30, y:H*0.3, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.26,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:190, y:14, w:285, h:115, tail:'bl', fill:RF, border:'#16A34A', tc:'#14532D', msg:'階段で安全に\n避難できた！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 9. family-children-disaster — 子連れ防災
  // ─────────────────────────────────────────────
  { slug: 'family-children-disaster', panels: [

    // P1: 危険発生 — 子どもがいる部屋で地震
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1A08'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        // 子ども部屋
        ctx.save(); ctx.translate(0,0); ctx.rotate(0.03);
        // 本棚
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.5-10,H*0.08,220,H*0.55);
        ctx.strokeStyle='#6A4028'; ctx.lineWidth=2; ctx.strokeRect(W*0.5-10,H*0.08,220,H*0.55);
        // 落下する本
        ctx.save(); ctx.translate(W*0.6,H*0.35); ctx.rotate(-0.7);
        ctx.fillStyle='#4060A8'; ctx.fillRect(-20,-8,40,16); ctx.restore();
        ctx.save(); ctx.translate(W*0.72,H*0.3); ctx.rotate(0.8);
        ctx.fillStyle='#C04040'; ctx.fillRect(-16,-8,32,16); ctx.restore();
        // おもちゃ
        ctx.save(); ctx.translate(120,H*0.62); ctx.rotate(-0.4);
        ctx.fillStyle='#FFD700'; ctx.fillRect(-15,-10,30,20); ctx.restore();
        ctx.restore();
        // 地震ライン
        drawSpeedLines(ctx,W/2,H/2,18,20,260,'#F59E0B',0.2);
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'ガタガタ！！',W/2,H*0.1,44,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — 揺れている最中に外へ出ようとする
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1808'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        // ドア（出口）
        ctx.fillStyle='#4A2810'; ctx.fillRect(W*0.52,H*0.1,140,H*0.7);
        ctx.strokeStyle='#3A1808'; ctx.lineWidth=4; ctx.strokeRect(W*0.52,H*0.1,140,H*0.7);
        // ドアノブ
        ctx.fillStyle='#C8A840'; ctx.beginPath(); ctx.arc(W*0.52+12,H*0.45,8,0,Math.PI*2); ctx.fill();
        // 子ども（小さなシルエット）
        ctx.fillStyle='#F0C0A0'; ctx.beginPath(); ctx.arc(W*0.38,H*0.52,14,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FF8050'; ctx.fillRect(W*0.38-10,H*0.52+10,20,25);
        drawSpeedLines(ctx,W*0.4,H*0.4,12,20,120,'#F59E0B',0.18);
      },
      chars: [{ img:riss, x:18, y:H*0.3, size:148, name:'防災リス（親）', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:175, y:14, w:295, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'子どもを連れて\n早く外へ逃げなきゃ！！' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A1A2E'); g.addColorStop(1,'#0A0A1A');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#100C08'; ctx.fillRect(0,H*0.8,W,H*0.2);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,200,'#3B82F6',0.3);
        drawImpact(ctx,W*0.55,H*0.2,44,'#3B82F6');
        // 机（隠れる場所）
        ctx.fillStyle='#6A4228'; ctx.fillRect(W*0.55,H*0.55,180,60);
        ctx.strokeStyle='#4A2A10'; ctx.lineWidth=2; ctx.strokeRect(W*0.55,H*0.55,180,60);
        ctx.fillStyle='white'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.85;
        ctx.fillText('↓ ここへ！',W*0.55+90,H*0.52);
        ctx.globalAlpha=1;
      },
      chars: [
        { img:robot, x:W*0.38, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:10,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'危ない！',W*0.25,H*0.17,36,'#FF3333'); },
      bubbles: [{ x:10, y:10, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'揺れ中に動くな！\n頭を守り机の下へ！\n揺れが収まってから行動！' }],
    },

    // P4: 行動 — 机の下で安全に待機
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#F0F8FF'); g.addColorStop(1,'#E0F0F8');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#A08868'; ctx.fillRect(0,H*0.8,W,H*0.2);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.8);
        // 机
        ctx.fillStyle='#8B5E3C'; ctx.fillRect(W*0.28,H*0.35,W*0.65,80);
        ctx.strokeStyle='#6A3E1C'; ctx.lineWidth=3; ctx.strokeRect(W*0.28,H*0.35,W*0.65,80);
        // 机の脚
        [[W*0.3,H*0.44],[W*0.85,H*0.44]].forEach(([x,y])=>{
          ctx.fillStyle='#7A4E2C'; ctx.fillRect(x-6,y,12,H*0.36);
        });
        // 机の下にリス＋子ども
        ctx.fillStyle='#F0C8A0'; ctx.beginPath(); ctx.arc(W*0.62,H*0.53,11,0,Math.PI*2); ctx.fill(); // 子の頭
        ctx.fillStyle='#FF9070'; ctx.fillRect(W*0.62-8,H*0.53+8,16,20); // 子の体
        // 「頭を守る」枕
        ctx.fillStyle='#F0E0C8'; ctx.fillRect(W*0.48,H*0.44,55,20);
        ctx.strokeStyle='#D0C0A8'; ctx.lineWidth=1.5; ctx.strokeRect(W*0.48,H*0.44,55,20);
        ctx.fillStyle='#888'; ctx.font='bold 11px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('頭を守る',W*0.48+27,H*0.44+14);
        // チェックリスト
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,W*0.28,H*0.72,W*0.65,42,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('揺れが収まるまで机の下で待機！',W*0.28+(W*0.65)/2,H*0.72+27);
      },
      chars: [{ img:riss, x:W*0.28+10, y:H*0.44-130, size:140, name:'防災リス（親）', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.12,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:10, y:10, w:270, h:115, tail:'right', fill:RF, border:'#16A34A', tc:'#14532D', msg:'揺れが収まるまで\n机の下で待つ！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 10. family-elderly-disaster — 高齢者防災
  // ─────────────────────────────────────────────
  { slug: 'family-elderly-disaster', panels: [

    // P1: 危険発生 — 高齢者がいる家で地震
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1A08'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        // 和室風の部屋
        ctx.fillStyle='#3A2818'; ctx.fillRect(W*0.5,H*0.08,220,H*0.62);
        ctx.strokeStyle='#2A1808'; ctx.lineWidth=2; ctx.strokeRect(W*0.5,H*0.08,220,H*0.62);
        // 和室の窓
        ctx.fillStyle='#2A3850'; ctx.fillRect(W*0.55,H*0.12,150,140);
        ctx.strokeStyle='#1A2838'; ctx.lineWidth=3; ctx.strokeRect(W*0.55,H*0.12,150,140);
        // 仏壇や棚が揺れる
        ctx.save(); ctx.translate(W*0.6,H*0.4); ctx.rotate(0.1);
        ctx.fillStyle='#6A4028'; ctx.fillRect(-35,-80,70,160);
        ctx.restore();
        drawSpeedLines(ctx,W/2,H/2,16,20,250,'#F59E0B',0.2);
        // 高齢者シルエット（白髪）
        ctx.fillStyle='#E0D8C8'; ctx.beginPath(); ctx.arc(W*0.62,H*0.52,18,0,Math.PI*2); ctx.fill(); // 頭（白髪）
        ctx.fillStyle='#A08870'; ctx.fillRect(W*0.62-14,H*0.52+16,28,35); // 体
      },
      chars: [],
      effectsDraw(ctx) { drawSfx(ctx,'ドドドド！',W/2,H*0.1,44,'#FF6600'); },
      bubbles: [],
    },

    // P2: 失敗しそう — 急いで避難所へ連れて行こうとする
    { ...RB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#2A1808'); g.addColorStop(1,'#1A1004');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#201506'; ctx.fillRect(0,H*0.8,W,H*0.2);
        ctx.fillStyle='#2A2018'; ctx.fillRect(0,0,W,H*0.8);
        // ドア（出口）
        ctx.fillStyle='#4A2810'; ctx.fillRect(W*0.52,H*0.1,145,H*0.68);
        ctx.strokeStyle='#3A1808'; ctx.lineWidth=4; ctx.strokeRect(W*0.52,H*0.1,145,H*0.68);
        // 高齢者（引っ張られている）
        ctx.fillStyle='#E0D8C8'; ctx.beginPath(); ctx.arc(W*0.52-20,H*0.45,18,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#A08870'; ctx.fillRect(W*0.52-34,H*0.45+15,28,40);
        // 杖
        ctx.strokeStyle='#8B6040'; ctx.lineWidth=4; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(W*0.52-20,H*0.45+55); ctx.lineTo(W*0.52-5,H*0.45+90); ctx.stroke();
      },
      chars: [{ img:riss, x:10, y:H*0.3, size:148, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      bubbles: [{ x:170, y:14, w:295, h:115, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'高齢者を連れて\n急いで避難所へ！！' }],
    },

    // P3: ロボが止める
    { ...QB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A1A2E'); g.addColorStop(1,'#0A0A1A');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#100808'; ctx.fillRect(0,H*0.8,W,H*0.2);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,200,'#3B82F6',0.3);
        drawImpact(ctx,W*0.55,H*0.22,42,'#3B82F6');
        // マンション（安全）
        ctx.fillStyle='#2A3848'; roundRect(ctx,W*0.55,H*0.45,180,200,6); ctx.fill();
        ctx.strokeStyle='#4ADE80'; ctx.lineWidth=2; ctx.strokeStyle='#4ADE80'; ctx.strokeRect(W*0.55,H*0.45,180,200);
        ctx.fillStyle='#4ADE80'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.85;
        ctx.fillText('✓ RC造 安全！',W*0.55+90,H*0.45+40);
        ctx.fillText('在宅避難が最善',W*0.55+90,H*0.45+70);
        ctx.fillText('高齢者の移動は', W*0.55+90,H*0.45+100);
        ctx.fillText('リスクがある！',W*0.55+90,H*0.45+130);
        ctx.globalAlpha=1;
      },
      chars: [
        { img:robot, x:W*0.36, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:10,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'待て！',W*0.25,H*0.17,40,'#FF3333'); },
      bubbles: [{ x:10, y:10, w:310, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'待て！建物が安全なら\n在宅避難の方が\n高齢者には安全だ！' }],
    },

    // P4: 行動 — 在宅避難で安心
    { ...RB,
      bgDraw: brightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.78);
        drawShelf(ctx,W*0.52,H*0.1,215,H*0.62);
        drawWaterBottles(ctx,W*0.54,H*0.58,3,3);
        // 薬ボックス
        ctx.fillStyle='#FF8888'; ctx.fillRect(W*0.54+180,H*0.18,55,50);
        ctx.strokeStyle='#CC4444'; ctx.lineWidth=2; ctx.strokeRect(W*0.54+180,H*0.18,55,50);
        ctx.fillStyle='white'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('薬',W*0.54+207,H*0.18+32);
        // 緊急連絡先メモ
        ctx.fillStyle='#FFF3CD'; ctx.fillRect(W*0.54,H*0.68,215,42);
        ctx.strokeStyle='#F59E0B'; ctx.lineWidth=1.5; ctx.strokeRect(W*0.54,H*0.68,215,42);
        ctx.fillStyle='#78350F'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('緊急連絡先 / かかりつけ医',W*0.54+107,H*0.68+27);
        drawSun(ctx,60,60,30);
      },
      chars: [{ img:riss, x:28, y:H*0.35, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.2,55,'#16A34A'); },
      bubbles: [{ x:10, y:10, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'在宅避難で\n薬も緊急連絡先も\nバッチリ準備した！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // 11. evacuation-health-checklist — 避難所健康チェック
  // ─────────────────────────────────────────────
  { slug: 'evacuation-health-checklist', panels: [

    // P1: 危険発生 — 避難所で体調を崩す人が続出
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#2A2040'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#1A1830'; ctx.fillRect(0,H*0.78,W,H*0.22);
      },
      sceneDraw(ctx) {
        // 避難所内
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#1E1830'; ctx.fillRect(0,0,W,H*0.78);
        // 体調不良の人々（横になっている）
        [[60,H*0.55,160,30],[220,H*0.6,160,30],[400,H*0.57,150,30]].forEach(([x,y,w,h])=>{
          ctx.fillStyle='#A09080'; ctx.fillRect(x,y,w,h);
          ctx.strokeStyle='#806850'; ctx.lineWidth=1; ctx.strokeRect(x,y,w,h);
        });
        // 体調不良アイコン
        ['😷','😓','🤒'].forEach((e,i)=>{
          ctx.font='28px serif'; ctx.textAlign='center'; ctx.fillText(e,[140,300,475][i],H*0.52);
        });
        ctx.fillStyle='#FF8888'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center'; ctx.globalAlpha=0.8;
        ctx.fillText('⚠ 体調不良が続出！',W/2,H*0.25);
        ctx.globalAlpha=1;
      },
      chars: [],
      effectsDraw(ctx) {},
      bubbles: [],
    },

    // P2: 失敗しそう — 薬を忘れた
    { ...RB,
      bgDraw(ctx) { ctx.fillStyle='#1E1830'; ctx.fillRect(0,0,W,H); },
      sceneDraw(ctx) {
        ctx.fillStyle='#C8A068'; ctx.fillRect(0,H*0.78,W,H*0.22);
        ctx.fillStyle='#1E1830'; ctx.fillRect(0,0,W,H*0.78);
        // 空のカバン
        ctx.fillStyle='#4A6040'; ctx.fillRect(W*0.5,H*0.2,200,180);
        ctx.strokeStyle='#2A4020'; ctx.lineWidth=3; ctx.strokeRect(W*0.5,H*0.2,200,180);
        // カバンの中（空）
        ctx.fillStyle='#3A5030'; ctx.fillRect(W*0.5+12,H*0.2+12,176,156);
        ctx.fillStyle='rgba(200,50,50,0.3)'; ctx.font='bold 30px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('空っぽ',W*0.5+100,H*0.2+90);
        // 薬のアイコン（取り残し）
        ctx.fillStyle='#FF8888'; roundRect(ctx,W*0.5-80,H*0.45,55,45,6); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('薬',W*0.5-52,H*0.45+29);
        // 矢印
        ctx.fillStyle='#FF4444'; ctx.font='bold 20px "Yu Gothic"';
        ctx.fillText('←忘れた！',W*0.5-20,H*0.45+30);
      },
      chars: [{ img:riss, x:20, y:H*0.32, size:145, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'しまった！',W*0.4,H*0.12,36,'#DC2626'); },
      bubbles: [{ x:180, y:14, w:295, h:120, tail:'bl', fill:RF, border:RBR, tc:RTC, msg:'薬を持ってくるの\n忘れた！\nどうしよう…' }],
    },

    // P3: ロボが止める（チェックリスト！）
    { ...QB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#1A1A2E'); g.addColorStop(1,'#0A0A1A');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#0A0808'; ctx.fillRect(0,H*0.8,W,H*0.2);
        drawSpeedLines(ctx,W*0.62,H*0.42,22,40,200,'#3B82F6',0.3);
        drawImpact(ctx,W*0.55,H*0.2,42,'#3B82F6');
        // チェックリスト（スマホ）
        ctx.fillStyle='#111'; ctx.fillRect(W*0.55,H*0.35,165,H*0.4);
        ctx.strokeStyle='#3B82F6'; ctx.lineWidth=2; ctx.strokeRect(W*0.55,H*0.35,165,H*0.4);
        ctx.fillStyle='#1E40AF'; ctx.fillRect(W*0.55+8,H*0.35+10,149,32);
        ctx.fillStyle='white'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('避難前チェックリスト',W*0.55+82,H*0.35+30);
        ['✓ 薬（常備薬）','✓ 処方箋コピー','✓ おくすり手帳','✓ 水・非常食'].forEach((item,i)=>{
          ctx.fillStyle='#4ADE80'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='left';
          ctx.fillText(item, W*0.55+14, H*0.35+55+i*33);
        });
      },
      chars: [
        { img:robot, x:W*0.36, y:H*0.18, size:158, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' },
        { img:riss,  x:10,     y:H*0.5,  size:115, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' },
      ],
      effectsDraw(ctx) { drawSfx(ctx,'！！',W*0.26,H*0.17,60,'#FF3333'); },
      bubbles: [{ x:10, y:10, w:308, h:130, tail:'bottom', fill:QF, border:QBR, tc:QTC, msg:'事前にチェックリストで\n確認しておけ！\n薬は命に関わるぞ！' }],
    },

    // P4: 行動 — チェックリスト完璧で出発
    { ...RB, bgDraw: brightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(0,0,W,H*0.78);
        // 準備完了カバン
        ctx.fillStyle='#15803D'; ctx.fillRect(W*0.5,H*0.12,210,H*0.6);
        ctx.strokeStyle='#0E5C2A'; ctx.lineWidth=3; ctx.strokeRect(W*0.5,H*0.12,210,H*0.6);
        ctx.fillStyle='#22C55E'; ctx.fillRect(W*0.5+10,H*0.12+10,190,36);
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('✅ 準備完了！',W*0.5+105,H*0.12+33);
        // アイテム一覧
        [['💊 薬・処方箋コピー','#4ADE80'],['📋 おくすり手帳','#4ADE80'],['💧 備蓄水','#4ADE80'],['🍱 非常食','#4ADE80']].forEach(([t,c],i)=>{
          ctx.fillStyle=c; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='left'; ctx.globalAlpha=0.9;
          ctx.fillText(t, W*0.5+18, H*0.12+60+i*50);
        });
        ctx.globalAlpha=1;
        drawSun(ctx,60,60,30);
      },
      chars: [{ img:riss, x:30, y:H*0.32, size:148, name:'防災リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.18,58,'#16A34A'); },
      bubbles: [{ x:10, y:10, w:295, h:115, tail:'br', fill:RF, border:'#16A34A', tc:'#14532D', msg:'チェックリストで\n万全の準備！\n安心して避難できる！' }],
    },

  ]},

]; } // end makeArticles

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
        bgDraw:      p.bgDraw,
        sceneDraw:   p.sceneDraw,
        chars:       p.chars||[],
        effectsDraw: p.effectsDraw,
        bubbles:     p.bubbles||[],
        panelNum:    i+1,
        nb1:         p.nb1,
        nb2:         p.nb2,
        border:      p.border,
      });
      const out = path.join(dir,`panel-0${i+1}.png`);
      fs.writeFileSync(out,canvas.toBuffer('image/png'));
      console.log(`✅ ${article.slug}/panel-0${i+1}.png`);
    }
  }
  console.log('\n🎉 全44枚 完了！');
}
main().catch(console.error);
