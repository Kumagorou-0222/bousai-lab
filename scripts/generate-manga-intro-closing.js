'use strict';
const { createCanvas, loadImage } = require('canvas');
const fs   = require('fs');
const path = require('path');

const W = 600, H = 750;
const ROOT   = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IMG    = path.join(PUBLIC, 'img');

// ── ユーティリティ（generate-manga5と同一） ──────────────────

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
  else if (tail==='bl') { ctx.moveTo(bx+16,by+bh-2); ctx.lineTo(bx-12,by+bh+tl); ctx.lineTo(bx+16+tw,by+bh-2); }
  else if (tail==='br') { ctx.moveTo(bx+bw-16-tw,by+bh-2); ctx.lineTo(bx+bw+12,by+bh+tl); ctx.lineTo(bx+bw-16,by+bh-2); }
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=border; ctx.lineWidth=3.5; ctx.stroke();
  ctx.strokeStyle=fill; ctx.lineWidth=5; ctx.beginPath();
  if (tail==='left')   { ctx.moveTo(bx+3,by+bh/2-tw/2+3); ctx.lineTo(bx+3,by+bh/2+tw/2-3); }
  if (tail==='right')  { ctx.moveTo(bx+bw-3,by+bh/2-tw/2+3); ctx.lineTo(bx+bw-3,by+bh/2+tw/2-3); }
  if (tail==='bottom') { ctx.moveTo(bx+bw/2-tw/2+3,by+bh-3); ctx.lineTo(bx+bw/2+tw/2-3,by+bh-3); }
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
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2); ctx.stroke();
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

function drawPerson(ctx, cx, cy, size, color, alpha) {
  ctx.save(); ctx.globalAlpha=alpha||1; ctx.fillStyle=color;
  ctx.beginPath(); ctx.arc(cx,cy-size*0.55,size*0.2,0,Math.PI*2); ctx.fill();
  ctx.fillRect(cx-size*0.15,cy-size*0.34,size*0.3,size*0.32);
  ctx.fillRect(cx-size*0.15,cy-size*0.02,size*0.12,size*0.28);
  ctx.fillRect(cx+size*0.03,cy-size*0.02,size*0.12,size*0.28);
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

// ── キャラクター定数 ──────────────────────────────────────
const RF='#FFFEF0', RBR='#F59E0B', RTC='#78350F';
const QF='#F0F9FF', QBR='#3B82F6', QTC='#1E40AF';
const RB = { nb1:'#FF8C00', nb2:'#FFD000', border:'#B45309' };
const QB = { nb1:'#1E3A8A', nb2:'#06B6D4', border:'#1D4ED8' };

// ── 共通背景 ───────────────────────────────────────────────

function brightOutdoor(ctx) {
  const g=ctx.createLinearGradient(0,0,0,H*0.75);
  g.addColorStop(0,'#A8D8F8'); g.addColorStop(1,'#E8F4FF');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#B8D8A8'; ctx.fillRect(0,H*0.78,W,H*0.22);
  drawSun(ctx,78,75,36);
  [[155,52,30],[198,43,36],[236,54,26],[455,68,22],[488,58,28]].forEach(([x,y,r])=>{
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  });
}

function gymBg(ctx) {
  ctx.fillStyle='#E8E4D8'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#D8C8A0'; ctx.fillRect(0,H*0.82,W,H*0.18);
  ctx.fillStyle='#D8D0C0'; ctx.fillRect(0,0,W,62);
  [115,295,490].forEach(x=>{
    ctx.fillStyle='rgba(255,255,200,0.88)'; ctx.fillRect(x-52,10,104,18);
    ctx.strokeStyle='#CCC'; ctx.lineWidth=1; ctx.strokeRect(x-52,10,104,18);
    const lg=ctx.createRadialGradient(x,19,0,x,19,130);
    lg.addColorStop(0,'rgba(255,255,170,0.35)'); lg.addColorStop(1,'transparent');
    ctx.fillStyle=lg; ctx.fillRect(x-130,0,260,220);
  });
}

function hospitalBg(ctx) {
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#EDF6FF'); g.addColorStop(1,'#E0EEF8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#C8E0F2'; ctx.fillRect(0,H*0.82,W,H*0.18);
  ctx.fillStyle='#DDE8F4'; ctx.fillRect(0,0,W,62);
  [135,355,535].forEach(x=>{
    ctx.fillStyle='rgba(255,255,215,0.88)'; ctx.fillRect(x-48,12,96,18);
    ctx.strokeStyle='#BCD'; ctx.lineWidth=1; ctx.strokeRect(x-48,12,96,18);
  });
  ctx.fillStyle='#DC2626'; ctx.fillRect(W*0.82-8,74,16,55); ctx.fillRect(W*0.82-22,92,44,18);
}

function warmRoom(ctx) {
  ctx.fillStyle='#FFF8F0'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#D4B890'; ctx.fillRect(0,H*0.82,W,H*0.18);
}

function nightRoom(ctx) {
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#18202E'); g.addColorStop(1,'#252E42');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2A1808'; ctx.fillRect(0,H*0.82,W,H*0.18);
}

// ── 漫画定義 ─────────────────────────────────────────────

function makeArticles(riss, robot) { return [

  // ─────────────────────────────────────────────
  // A. intro-landlord — 大家として
  // ─────────────────────────────────────────────
  { slug: 'intro-landlord', panels: [

    // P1: マンション外観 — 大家として
    { ...RB,
      bgDraw: brightOutdoor,
      sceneDraw(ctx) {
        // マンション外観（右側）
        ctx.fillStyle='#B8C8D8'; ctx.fillRect(W*0.42,H*0.06,225,H*0.7);
        ctx.strokeStyle='#8898A8'; ctx.lineWidth=3; ctx.strokeRect(W*0.42,H*0.06,225,H*0.7);
        ctx.fillStyle='#9AA8B8'; ctx.fillRect(W*0.42,H*0.06,225,22);
        for (let r=0;r<5;r++) for (let c=0;c<3;c++) {
          const wx=W*0.42+20+c*68, wy=H*0.06+30+r*98;
          ctx.fillStyle='#80B4D4'; ctx.fillRect(wx,wy,50,62);
          ctx.strokeStyle='#6090B4'; ctx.lineWidth=1.5; ctx.strokeRect(wx,wy,50,62);
        }
        // 入口ドア
        ctx.fillStyle='#506070'; ctx.fillRect(W*0.42+86,H*0.66,54,H*0.1);
        ctx.strokeStyle='#304050'; ctx.lineWidth=2; ctx.strokeRect(W*0.42+86,H*0.66,54,H*0.1);
        // 「賃貸管理中」看板
        ctx.fillStyle='#1E3A8A'; roundRect(ctx,W*0.42,H*0.76,225,36,4); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('賃貸マンション 管理中',W*0.42+112,H*0.76+24);
        // 管理会社ロゴ
        ctx.fillStyle='rgba(255,200,50,0.8)'; ctx.font='bold 11px "Yu Gothic"';
        ctx.fillText('🏢 オーナー管理',W*0.42+112,H*0.76+48);
      },
      chars: [{ img:riss, x:16, y:H*0.36, size:142, name:'大家リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) {},
      bubbles: [{ x:165,y:14,w:300,h:120,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'大家として\n建物管理さえ\nしておけば\n十分かな？' }],
    },

    // P2: エレベーター停止シーン
    { ...RB,
      bgDraw(ctx) {
        ctx.fillStyle='#CCC8C0'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#B8B0A8'; ctx.fillRect(0,H*0.82,W,H*0.18);
      },
      sceneDraw(ctx) {
        ctx.fillStyle='#C0B8B0'; ctx.fillRect(0,0,W,H*0.82);
        // エレベータードア（右）
        ctx.fillStyle='#7888A0'; ctx.fillRect(W*0.44,H*0.05,200,H*0.74);
        ctx.strokeStyle='#586880'; ctx.lineWidth=4; ctx.strokeRect(W*0.44,H*0.05,200,H*0.74);
        ctx.beginPath(); ctx.moveTo(W*0.44+100,H*0.05); ctx.lineTo(W*0.44+100,H*0.79);
        ctx.strokeStyle='#405060'; ctx.lineWidth=3; ctx.stroke();
        // 「運転休止」アラート
        ctx.fillStyle='#CC0000'; ctx.fillRect(W*0.44+16,H*0.08,168,54);
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('⚠ 運転休止中',W*0.44+100,H*0.08+20);
        ctx.font='bold 13px "Yu Gothic"';
        ctx.fillText('地震発生のため',W*0.44+100,H*0.08+42);
        // 非常階段の案内
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.44+14,H*0.66,172,46,5); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('→ 非常階段を使用',W*0.44+100,H*0.66+18);
        ctx.fillText('エレベーター不可',W*0.44+100,H*0.66+38);
        // ×ボタン
        ctx.fillStyle='#666'; ctx.beginPath(); ctx.arc(W*0.44+18,H*0.44,15,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#FF4444'; ctx.lineWidth=3; ctx.globalAlpha=0.9;
        ctx.beginPath(); ctx.moveTo(W*0.44+9,H*0.44-9); ctx.lineTo(W*0.44+27,H*0.44+9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.44+27,H*0.44-9); ctx.lineTo(W*0.44+9,H*0.44+9); ctx.stroke();
        ctx.globalAlpha=1;
        // 高齢者シルエット
        drawPerson(ctx,W*0.88,H*0.55,52,'#907060',0.85);
        ctx.fillStyle='#555'; ctx.font='bold 11px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('高齢入居者',W*0.88,H*0.32);
      },
      chars: [{ img:riss, x:18, y:H*0.36, size:140, name:'大家リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'ガーン！',W*0.3,H*0.14,38,'#CC0000'); },
      bubbles: [{ x:165,y:14,w:298,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'エレベーター停止…\n高齢の入居者さんは\n階段を使えるの？！' }],
    },

    // P3: ロボが防災対応を説明（夜の廊下）
    { ...QB,
      bgDraw: nightRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#2A1808'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // デスク（右側）
        ctx.fillStyle='#6A4020'; ctx.fillRect(W*0.4,H*0.58,230,16);
        ctx.fillStyle='#502E12'; ctx.fillRect(W*0.42,H*0.58+16,10,H*0.24);
        ctx.fillRect(W*0.4+218,H*0.58+16,10,H*0.24);
        // 防災マニュアル
        ctx.fillStyle='#FFF8E8'; ctx.fillRect(W*0.44,H*0.36,175,H*0.22);
        ctx.strokeStyle='#C8A060'; ctx.lineWidth=2; ctx.strokeRect(W*0.44,H*0.36,175,H*0.22);
        ctx.fillStyle='#1A1A60'; ctx.font='bold 14px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('防災対応マニュアル',W*0.44+87,H*0.36+20);
        ctx.font='11px "Yu Gothic"'; ctx.textAlign='left'; ctx.fillStyle='#333';
        ['・EV停止時の対応','・高齢者サポート計画','・72時間の備え'].forEach((t,i)=>
          ctx.fillText(t,W*0.44+12,H*0.36+44+i*22));
        // 積まれた本（右端）
        ['#CC4444','#3344BB','#338844'].forEach((c,i)=>{
          ctx.fillStyle=c; ctx.fillRect(W*0.42+145+i*22,H*0.22,18,H*0.36);
          ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1; ctx.strokeRect(W*0.42+145+i*22,H*0.22,18,H*0.36);
        });
        // 電球のぼんやり光
        const lx=W*0.55, ly=H*0.08;
        const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,200);
        lg.addColorStop(0,'rgba(255,230,100,0.45)'); lg.addColorStop(1,'transparent');
        ctx.fillStyle=lg; ctx.fillRect(0,0,W,H*0.75);
        ctx.fillStyle='#FFE840'; ctx.beginPath(); ctx.arc(lx,ly,16,0,Math.PI*2); ctx.fill();
      },
      chars: [{ img:robot, x:14, y:H*0.3, size:148, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' }],
      effectsDraw(ctx) { drawSpeedLines(ctx,W*0.28,H*0.42,18,40,170,'#3B82F6',0.22); },
      bubbles: [{ x:170,y:12,w:298,h:126,tail:'bl',fill:QF,border:QBR,tc:QTC,msg:'大家こそ\n入居者が発災後に\n生き延びるかまで\n考えるべきだ！' }],
    },

    // P4: 入居者と防災チェックリストを共有
    { ...RB,
      bgDraw: warmRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#F0E8D8'; ctx.fillRect(0,0,W,H*0.82);
        // アパートドア（右）
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.44,H*0.1,148,H*0.68);
        ctx.strokeStyle='#6A4028'; ctx.lineWidth=3; ctx.strokeRect(W*0.44,H*0.1,148,H*0.68);
        // ドアノブ
        ctx.fillStyle='#D4A820'; ctx.beginPath(); ctx.arc(W*0.44+16,H*0.46,9,0,Math.PI*2); ctx.fill();
        // ドアに貼られたチェックリスト
        ctx.fillStyle='#FFFFE8'; ctx.fillRect(W*0.44+30,H*0.14,100,130);
        ctx.strokeStyle='#C8A060'; ctx.lineWidth=1.5; ctx.strokeRect(W*0.44+30,H*0.14,100,130);
        ctx.fillStyle='#1A1A60'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('防災チェック',W*0.44+80,H*0.14+16);
        ctx.font='11px "Yu Gothic"'; ctx.textAlign='left'; ctx.fillStyle='#333';
        ['✅ 水備蓄 OK','✅ 非常食 OK','✅ 階段確認','✅ 連絡先共有'].forEach((t,i)=>
          ctx.fillText(t,W*0.44+34,H*0.14+36+i*22));
        // 入居者（高齢者）
        drawPerson(ctx,W*0.82,H*0.52,55,'#E0A080',0.9);
        // 入居者の小さな吹き出し
        ctx.fillStyle='rgba(255,255,255,0.92)'; roundRect(ctx,W*0.58,H*0.2,155,55,10); ctx.fill();
        ctx.strokeStyle='#BBB'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle='#333'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('大家さん…',W*0.58+77,H*0.2+18);
        ctx.fillText('ありがとうございます！',W*0.58+77,H*0.2+38);
      },
      chars: [{ img:riss, x:14, y:H*0.34, size:145, name:'大家リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.3,H*0.22,50,'#16A34A'); },
      bubbles: [{ x:8,y:8,w:308,h:118,tail:'br',fill:RF,border:'#16A34A',tc:'#14532D',msg:'大家が先頭に立って\n入居者の防災を\n支えていく！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // B. intro-father — 父として
  // ─────────────────────────────────────────────
  { slug: 'intro-father', panels: [

    // P1: 地域の防災訓練に参加
    { ...RB,
      bgDraw: brightOutdoor,
      sceneDraw(ctx) {
        // 公民館外観（右）
        ctx.fillStyle='#C8D8C0'; ctx.fillRect(W*0.4,H*0.07,228,H*0.69);
        ctx.strokeStyle='#88A880'; ctx.lineWidth=3; ctx.strokeRect(W*0.4,H*0.07,228,H*0.69);
        ctx.fillStyle='#A8C8A0'; ctx.fillRect(W*0.4,H*0.07,228,22);
        // 窓
        [[20,38],[120,38],[20,140],[120,140]].forEach(([dx,dy])=>{
          ctx.fillStyle='#D8EEF8'; ctx.fillRect(W*0.4+dx,H*0.07+dy,80,70);
          ctx.strokeStyle='#88A880'; ctx.lineWidth=1.5; ctx.strokeRect(W*0.4+dx,H*0.07+dy,80,70);
        });
        // 防災訓練の横断幕
        ctx.fillStyle='#DC2626'; ctx.fillRect(W*0.4+8,H*0.3,214,52);
        ctx.fillStyle='white'; ctx.font='bold 18px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('地域防災訓練',W*0.4+114,H*0.3+20);
        ctx.font='bold 14px "Yu Gothic"';
        ctx.fillText('今日：避難所シミュレーション',W*0.4+114,H*0.3+40);
        // 入口
        ctx.fillStyle='#607850'; ctx.fillRect(W*0.4+80,H*0.64,68,H*0.12);
        // 参加者
        [W*0.4+28,W*0.4+54].forEach(x=>drawPerson(ctx,x,H*0.7,48,'#6080A0',0.75));
      },
      chars: [{ img:riss, x:16, y:H*0.37, size:140, name:'父リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) {},
      bubbles: [{ x:165,y:14,w:298,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'父として\n地域の防災訓練に\nやってきたぞ！\nいざ参加！' }],
    },

    // P2: 体育館の避難所シミュレーション
    { ...RB,
      bgDraw: gymBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B890'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 体育館フロアライン
        ctx.strokeStyle='#C0A040'; ctx.lineWidth=2; ctx.globalAlpha=0.35;
        ctx.beginPath(); ctx.moveTo(0,H*0.5); ctx.lineTo(W,H*0.5); ctx.stroke();
        ctx.globalAlpha=1;
        // 段ボールパーティション（3列）
        for (let c=0;c<3;c++) {
          const bx=W*0.4+c*62, by=H*0.32;
          ctx.fillStyle='#D4A060'; ctx.fillRect(bx,by,56,H*0.46);
          ctx.strokeStyle='#B88040'; ctx.lineWidth=1.5; ctx.strokeRect(bx,by,56,H*0.46);
          ctx.strokeStyle='#C09040'; ctx.lineWidth=1; ctx.globalAlpha=0.45;
          for (let j=1;j<5;j++) {
            ctx.beginPath(); ctx.moveTo(bx,by+j*26); ctx.lineTo(bx+56,by+j*26); ctx.stroke();
          }
          ctx.globalAlpha=1;
          // 区画番号
          ctx.fillStyle='#1E3A8A'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText(`A-${c+1}`,bx+28,H*0.82-4);
        }
        // 床の区画線（点線）
        ctx.strokeStyle='#999'; ctx.lineWidth=1.5; ctx.setLineDash([8,5]);
        ctx.beginPath(); ctx.moveTo(W*0.4,H*0.78); ctx.lineTo(W*0.88,H*0.78); ctx.stroke();
        ctx.setLineDash([]);
        // 毛布シルエット
        ctx.fillStyle='rgba(80,120,160,0.4)'; ctx.fillRect(W*0.42,H*0.62,52,18);
        ctx.fillRect(W*0.42+62,H*0.62,52,18);
      },
      chars: [{ img:riss, x:16, y:H*0.36, size:140, name:'父リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'ドキッ…',W*0.32,H*0.14,36,'#DC2626'); },
      bubbles: [{ x:165,y:10,w:298,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'これが実際の\n避難所か…\n思ったより\nずっと狭い！' }],
    },

    // P3: 黒板に「定員30%」が書かれている
    { ...RB,
      bgDraw: gymBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8C0A8'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 黒板（右側）
        ctx.fillStyle='#1A3A1A'; ctx.fillRect(W*0.4,H*0.09,228,H*0.64);
        ctx.strokeStyle='#2A4A2A'; ctx.lineWidth=4; ctx.strokeRect(W*0.4,H*0.09,228,H*0.64);
        // 黒板枠
        ctx.fillStyle='#5A3820'; ctx.fillRect(W*0.38,H*0.09-10,233,14);
        ctx.fillRect(W*0.38,H*0.73,233,14);
        // 白チョーク文字
        ctx.fillStyle='rgba(240,240,240,0.92)'; ctx.font='bold 19px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('避難所の収容定員',W*0.4+114,H*0.09+38);
        // 大きな「30%」
        ctx.font='bold 72px "Yu Gothic"'; ctx.fillStyle='rgba(255,120,120,0.9)';
        ctx.fillText('30%',W*0.4+114,H*0.09+130);
        // 説明
        ctx.font='bold 16px "Yu Gothic"'; ctx.fillStyle='rgba(240,240,240,0.85)';
        ctx.fillText('市民全員は入れない！',W*0.4+114,H*0.09+170);
        // 棒グラフ
        ctx.fillStyle='rgba(255,100,100,0.75)'; ctx.fillRect(W*0.4+30,H*0.09+195,65,130);
        ctx.fillStyle='rgba(200,200,200,0.3)'; ctx.fillRect(W*0.4+110,H*0.09+195,65,130);
        ctx.fillStyle='rgba(200,200,200,0.3)'; ctx.fillRect(W*0.4+165,H*0.09+195,45,130);
        ctx.fillStyle='rgba(240,240,240,0.7)'; ctx.font='11px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('収容可',W*0.4+62,H*0.09+338);
        ctx.fillText('残り70%',W*0.4+155,H*0.09+338);
      },
      chars: [{ img:riss, x:14, y:H*0.38, size:140, name:'父リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawImpact(ctx,W*0.28,H*0.2,42,'#DC2626'); },
      bubbles: [{ x:8,y:8,w:300,h:122,tail:'br',fill:RF,border:RBR,tc:RTC,msg:'えっ！\n市民全員は\n避難所に入れない？！\n自宅で備えるしかない！' }],
    },

    // P4: 自宅で家族と備蓄品を確認
    { ...RB,
      bgDraw: warmRoom,
      sceneDraw(ctx) {
        ctx.fillStyle='#FFF0D8'; ctx.fillRect(0,0,W,H*0.82);
        // 棚（右）
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.42,H*0.1,225,16);
        ctx.fillStyle='#6A4028';
        ctx.fillRect(W*0.44,H*0.1+16,10,H*0.7);
        ctx.fillRect(W*0.44+205,H*0.1+16,10,H*0.7);
        ctx.fillRect(W*0.44,H*0.1+H*0.23+16,225,10);
        ctx.fillRect(W*0.44,H*0.1+H*0.46+16,225,10);
        // 水ペットボトル
        for (let r=0;r<2;r++) for (let c=0;c<4;c++) {
          const bx=W*0.46+c*46, by=H*0.14+r*H*0.23+8;
          ctx.fillStyle='rgba(100,180,235,0.72)'; ctx.fillRect(bx,by,38,88);
          ctx.strokeStyle='#3880A8'; ctx.lineWidth=1; ctx.strokeRect(bx,by,38,88);
          ctx.fillStyle='#A0D8F0'; ctx.fillRect(bx+4,by+4,30,14);
          ctx.fillStyle='#1860A0'; ctx.font='bold 10px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText('2L',bx+19,by+56);
        }
        // 缶詰・非常食（下段）
        for (let c=0;c<4;c++) {
          const bx=W*0.46+c*46, by=H*0.1+H*0.48;
          ctx.fillStyle=['#E8C878','#D4905A','#80C0E8','#A0D080'][c]; ctx.fillRect(bx,by,38,75);
          ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(bx,by,38,75);
          ctx.fillStyle='#333'; ctx.font='bold 10px "Yu Gothic"'; ctx.textAlign='center';
          ctx.fillText(['缶詰','レトルト','水','非常食'][c],bx+19,by+46);
        }
        // 子供たち（2人）
        drawPerson(ctx,W*0.84,H*0.54,52,'#90B0E8',0.88);
        drawPerson(ctx,W*0.9,H*0.6,44,'#E890B0',0.88);
        // 備蓄完了ラベル
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.42,H*0.76,225,40,5); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('家族4人分 備蓄完了！',W*0.42+112,H*0.76+26);
      },
      chars: [{ img:riss, x:12, y:H*0.34, size:145, name:'父リス', nb:'rgba(21,128,61,0.7)', nf:'white' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.2,50,'#16A34A'); },
      bubbles: [{ x:8,y:8,w:308,h:118,tail:'br',fill:RF,border:'#16A34A',tc:'#14532D',msg:'自宅を\n"生き残れる家"に\n変えるのが\n父の役目だ！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // C. intro-doctor — 医師として
  // ─────────────────────────────────────────────
  { slug: 'intro-doctor', panels: [

    // P1: 発災後の外来が大混雑
    { ...RB,
      bgDraw: hospitalBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8DCF0'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 待合椅子（右側）
        for (let c=0;c<4;c++) {
          const sx=W*0.4+c*44, sy=H*0.52;
          ctx.fillStyle='#3870C0'; ctx.fillRect(sx,sy,36,32);
          ctx.fillStyle='#2858A0'; ctx.fillRect(sx-2,sy+32,40,8);
          if (c<4) drawPerson(ctx,sx+18,sy-12,40,'#707070',0.82);
        }
        // 待ち時間表示
        ctx.fillStyle='#CC0000'; roundRect(ctx,W*0.38,H*0.08,222,58,5); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('現在の待ち時間',W*0.38+111,H*0.08+20);
        ctx.font='bold 26px "Yu Gothic"';
        ctx.fillText('3時間以上',W*0.38+111,H*0.08+46);
        // 通路にも人
        [W*0.42,W*0.56,W*0.72].forEach(x=>drawPerson(ctx,x,H*0.4,36,'#888',0.55));
        // 混雑注意
        ctx.fillStyle='rgba(200,80,0,0.8)'; ctx.font='bold 15px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('⚠ 発災後 大混雑',W/2,H*0.33);
      },
      chars: [{ img:riss, x:16, y:H*0.37, size:138, name:'医師リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'ザワザワ…',W*0.34,H*0.14,32,'#CC4444'); },
      bubbles: [{ x:163,y:10,w:302,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'発災後の外来…\nこんなに患者さんが\n押し寄せて\nくるのか！' }],
    },

    // P2: お薬手帳なしの患者と困る医師
    { ...QB,
      bgDraw: hospitalBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C0D8F0'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 診察机（右）
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(W*0.42,H*0.55,210,90);
        ctx.strokeStyle='#C8C0B0'; ctx.lineWidth=2; ctx.strokeRect(W*0.42,H*0.55,210,90);
        ctx.fillStyle='#5A3820'; ctx.fillRect(W*0.42,H*0.55,210,18);
        ctx.fillStyle='white'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('診察室',W*0.42+105,H*0.55+13);
        // カルテ（お薬手帳なしの欄）
        ctx.fillStyle='white'; ctx.fillRect(W*0.44,H*0.58+2,175,68);
        ctx.strokeStyle='#AAA'; ctx.lineWidth=1; ctx.strokeRect(W*0.44,H*0.58+2,175,68);
        ctx.fillStyle='#333'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='left';
        ctx.fillText('お薬手帳：',W*0.44+10,H*0.58+20);
        ctx.fillStyle='#CC0000'; ctx.font='bold 22px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('見当たらない',W*0.44+87,H*0.58+50);
        // 「？」マーク
        ctx.font='bold 44px "Yu Gothic"'; ctx.fillStyle='rgba(200,50,50,0.65)';
        ctx.fillText('？',W*0.44+162,H*0.58+45);
        // 患者シルエット（右側）
        drawPerson(ctx,W*0.85,H*0.47,56,'#808080',0.88);
        ctx.fillStyle='rgba(200,80,0,0.75)'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('薬を全部流した',W*0.85,H*0.27);
        ctx.fillText('手帳も…',W*0.85,H*0.32);
        // 聴診器
        ctx.strokeStyle='#3870C0'; ctx.lineWidth=5; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(W*0.72,H*0.36,28,0,Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.72-28,H*0.36); ctx.lineTo(W*0.72-35,H*0.54); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.72+28,H*0.36); ctx.lineTo(W*0.72+35,H*0.54); ctx.stroke();
        ctx.fillStyle='#3870C0'; ctx.beginPath(); ctx.arc(W*0.72-35,H*0.54,7,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(W*0.72+35,H*0.54,7,0,Math.PI*2); ctx.fill();
      },
      chars: [{ img:robot, x:W*0.4, y:H*0.23, size:148, flip:true, name:'医師ロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' }],
      effectsDraw(ctx) { drawSfx(ctx,'困った…',W*0.26,H*0.17,32,'#DC2626'); },
      bubbles: [{ x:8,y:8,w:308,h:118,tail:'bottom',fill:QF,border:QBR,tc:QTC,msg:'お薬手帳がない！\n薬の名前も\n用量も不明…\nこれでは処方できない！' }],
    },

    // P3: 「事前に伝えることが大切」と気づく
    { ...RB,
      bgDraw: hospitalBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C0D8F0'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 机（右）
        ctx.fillStyle='#E8E0D0'; ctx.fillRect(W*0.4,H*0.56,225,88);
        ctx.strokeStyle='#C8B090'; ctx.lineWidth=2; ctx.strokeRect(W*0.4,H*0.56,225,88);
        // 処方箋（机上）
        ctx.fillStyle='#FFFFE8'; ctx.fillRect(W*0.44,H*0.42,175,H*0.18);
        ctx.strokeStyle='#C0B850'; ctx.lineWidth=1.5; ctx.strokeRect(W*0.44,H*0.42,175,H*0.18);
        ctx.fillStyle='#1A1A70'; ctx.font='bold 13px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('処 方 箋',W*0.44+87,H*0.42+16);
        ctx.font='11px "Yu Gothic"'; ctx.textAlign='left'; ctx.fillStyle='#333';
        ['患者：○○ 様','診断：□□','薬品：？？？','用量：不明'].forEach((t,i)=>
          ctx.fillText(t,W*0.44+10,H*0.42+36+i*22));
        ctx.fillStyle='rgba(200,50,50,0.65)'; ctx.font='bold 24px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('???',W*0.44+150,H*0.56);
        // 薬ビン（机の奥）
        ['#A060A0','#6080C0','#60A060'].forEach((c,i)=>{
          ctx.fillStyle=c; roundRect(ctx,W*0.42+155+i*22,H*0.46,16,H*0.12,4); ctx.fill();
          ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1; ctx.stroke();
        });
        // 思考の吹き出し（思い浮かぶ）
        ctx.fillStyle='rgba(255,255,240,0.88)'; roundRect(ctx,W*0.42+30,H*0.13,175,70,12); ctx.fill();
        ctx.strokeStyle='#C0A840'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle='#333'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('もし事前に薬の',W*0.42+117,H*0.13+18);
        ctx.fillText('情報を知っていたら…',W*0.42+117,H*0.13+36);
        ctx.fillText('もっと助けられた',W*0.42+117,H*0.13+54);
      },
      chars: [{ img:riss, x:16, y:H*0.33, size:145, name:'医師リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'うーん…',W*0.34,H*0.15,32,'#5050A0'); },
      bubbles: [{ x:168,y:10,w:298,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'薬の情報を\n事前に持っていれば\nこんなに困らない\nのに…！' }],
    },

    // P4: 「伝えることが防災」— 本を書く
    { ...QB,
      bgDraw(ctx) {
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#E8F4FF'); g.addColorStop(1,'#F4FAFF');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#C8E0F2'; ctx.fillRect(0,H*0.82,W,H*0.18);
      },
      sceneDraw(ctx) {
        // 本の原稿（右）
        ctx.fillStyle='white'; ctx.fillRect(W*0.4,H*0.09,228,H*0.7);
        ctx.strokeStyle='#80A8C0'; ctx.lineWidth=2.5; ctx.strokeRect(W*0.4,H*0.09,228,H*0.7);
        // タイトル帯
        ctx.fillStyle='#1E3A8A'; ctx.fillRect(W*0.4,H*0.09,228,46);
        ctx.fillStyle='white'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('防災と医療の本',W*0.4+114,H*0.09+18);
        ctx.font='bold 12px "Yu Gothic"';
        ctx.fillText('〜あなたの命を守る情報〜',W*0.4+114,H*0.09+38);
        // 目次
        ctx.fillStyle='#444'; ctx.font='12px "Yu Gothic"'; ctx.textAlign='left';
        ['第1章 お薬手帳を守る','第2章 病院との連携','第3章 在宅医療と防災','','第4章 伝えることが防災','  ・薬情報を事前に共有','  ・かかりつけ医と相談'].forEach((t,i)=>
          ctx.fillText(t,W*0.4+14,H*0.09+62+i*46));
        // 強調ライン
        ctx.strokeStyle='#DC2626'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(W*0.4+10,H*0.09+200); ctx.lineTo(W*0.4+218,H*0.09+200); ctx.stroke();
        ctx.fillStyle='#DC2626'; ctx.font='bold 16px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('伝えることが防災！',W*0.4+114,H*0.74);
        // ペン
        ctx.fillStyle='#1E3A8A';
        ctx.beginPath(); ctx.moveTo(W*0.84,H*0.36); ctx.lineTo(W*0.9,H*0.22); ctx.lineTo(W*0.92,H*0.36); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#3B5A9A'; ctx.fillRect(W*0.84,H*0.36,W*0.08,H*0.22);
      },
      chars: [{ img:robot, x:W*0.4, y:H*0.26, size:148, flip:true, name:'医師ロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.18,50,'#16A34A'); },
      bubbles: [{ x:8,y:8,w:308,h:118,tail:'bottom',fill:QF,border:QBR,tc:QTC,msg:'だからこの本を書いた！\n"伝えること"こそが\n医師にできる\n最大の防災だ！' }],
    },

  ]},

  // ─────────────────────────────────────────────
  // D. closing-community — 地域の力
  // ─────────────────────────────────────────────
  { slug: 'closing-community', panels: [

    // P1: 体育館の炊き出しシーン
    { ...RB,
      bgDraw: gymBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B890'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 大鍋
        ctx.fillStyle='#484848'; ctx.fillRect(W*0.4,H*0.5,215,18);
        ctx.fillStyle='#383838'; ctx.beginPath();
        ctx.ellipse(W*0.4+107,H*0.5+18,108,22,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#585858'; ctx.beginPath();
        ctx.ellipse(W*0.4+107,H*0.5+15,103,18,0,0,Math.PI*2); ctx.fill();
        // 湯気
        [W*0.4+35,W*0.4+80,W*0.4+130,W*0.4+178].forEach(x=>{
          ctx.strokeStyle='rgba(210,210,215,0.65)'; ctx.lineWidth=4; ctx.lineCap='round';
          ctx.beginPath();
          ctx.moveTo(x,H*0.5); ctx.bezierCurveTo(x-10,H*0.38,x+10,H*0.3,x,H*0.2);
          ctx.stroke();
        });
        // カセットコンロ
        ctx.fillStyle='#666'; ctx.fillRect(W*0.4+35,H*0.62,145,38);
        ctx.fillStyle='#444'; ctx.fillRect(W*0.4+55,H*0.65,105,12);
        // 「炊き出し」看板
        ctx.fillStyle='#DC2626'; roundRect(ctx,W*0.38,H*0.09,222,52,6); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 20px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('炊き出し 実施中！',W*0.38+111,H*0.09+20);
        ctx.font='bold 14px "Yu Gothic"';
        ctx.fillText('みんなで温かく',W*0.38+111,H*0.09+40);
        // スタッフ
        drawPerson(ctx,W*0.86,H*0.55,54,'#6080A0',0.88);
        drawPerson(ctx,W*0.92,H*0.6,48,'#A06080',0.88);
      },
      chars: [{ img:riss, x:16, y:H*0.38, size:136, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'いい香り！',W*0.34,H*0.15,30,'#FF8C00'); },
      bubbles: [{ x:162,y:10,w:302,h:118,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'体育館の炊き出しで\n82歳のお婆さんが\n一人で全部\n仕切ってるよ！' }],
    },

    // P2: お婆さんがカセットコンロでお湯を沸かす
    { ...RB,
      bgDraw: gymBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B890'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // カセットコンロ（大きく右側）
        ctx.fillStyle='#555'; ctx.fillRect(W*0.44,H*0.58,215,62);
        ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.strokeRect(W*0.44,H*0.58,215,62);
        ctx.fillStyle='#333'; ctx.beginPath();
        ctx.ellipse(W*0.44+107,H*0.58+16,60,11,0,0,Math.PI*2); ctx.fill();
        // 炎（3層）
        ['#FF4500','#FF8C00','#FFD700'].forEach((col,i)=>{
          ctx.fillStyle=col; ctx.beginPath();
          for (let j=0;j<10;j++) {
            const a=(j/10)*Math.PI*2, r=44-i*10+(j%2)*8;
            const fx=W*0.44+107+Math.cos(a)*r, fy=H*0.58+16-i*5-Math.sin(Math.abs(a))*18+Math.sin(a)*3;
            j===0?ctx.moveTo(fx,fy):ctx.lineTo(fx,fy);
          }
          ctx.closePath(); ctx.fill();
        });
        // やかん
        ctx.fillStyle='#7888A0'; ctx.beginPath();
        ctx.ellipse(W*0.44+107,H*0.44,58,24,0,0,Math.PI*2); ctx.fill();
        ctx.fillRect(W*0.44+49,H*0.3,116,H*0.14);
        ctx.fillStyle='#6878A0'; ctx.fillRect(W*0.44+54,H*0.22,106,H*0.16);
        ctx.strokeStyle='#5868A0'; ctx.lineWidth=2; ctx.strokeRect(W*0.44+49,H*0.3,116,H*0.14);
        // 湯気（やかんから）
        [W*0.44+68,W*0.44+100,W*0.44+134].forEach(x=>{
          ctx.strokeStyle='rgba(180,200,220,0.82)'; ctx.lineWidth=5; ctx.lineCap='round';
          ctx.beginPath();
          ctx.moveTo(x,H*0.22); ctx.bezierCurveTo(x-8,H*0.14,x+8,H*0.08,x,H*0.02);
          ctx.stroke();
        });
        // お婆さんシルエット（右端）
        drawPerson(ctx,W*0.88,H*0.5,54,'#9080A0',0.92);
        // お婆さんの台詞
        ctx.fillStyle='rgba(255,255,255,0.92)'; roundRect(ctx,W*0.52,H*0.13,175,78,10); ctx.fill();
        ctx.strokeStyle='#AAA'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle='#333'; ctx.font='bold 12px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('阪神のとき',W*0.52+87,H*0.13+17);
        ctx.fillText('お湯一杯で',W*0.52+87,H*0.13+33);
        ctx.fillText('何人が救われたか',W*0.52+87,H*0.13+49);
        ctx.fillText('…見てたから',W*0.52+87,H*0.13+65);
      },
      chars: [{ img:riss, x:14, y:H*0.38, size:136, name:'防災リス', nb:'rgba(245,158,11,0.7)', nf:'#78350F' }],
      effectsDraw(ctx) { drawSfx(ctx,'ぐつぐつ！',W*0.32,H*0.14,30,'#FF6600'); },
      bubbles: [{ x:162,y:8,w:302,h:110,tail:'bl',fill:RF,border:RBR,tc:RTC,msg:'阪神の経験から\n学んでいるんだ…\nすごい！' }],
    },

    // P3: 温かいお茶を配布するシーン
    { ...QB,
      bgDraw: gymBg,
      sceneDraw(ctx) {
        ctx.fillStyle='#C8B890'; ctx.fillRect(0,H*0.82,W,H*0.18);
        // 配布テーブル（右）
        ctx.fillStyle='#A08060'; ctx.fillRect(W*0.4,H*0.6,238,18);
        ctx.fillStyle='#8B6040'; ctx.fillRect(W*0.4,H*0.6+18,238,8);
        ctx.fillRect(W*0.42,H*0.6+26,10,H*0.2);
        ctx.fillRect(W*0.4+228,H*0.6+26,10,H*0.2);
        // カップ（5個）
        for (let c=0;c<5;c++) {
          const cx=W*0.42+20+c*42, cy=H*0.5;
          ctx.fillStyle='#E8F0E0'; ctx.beginPath();
          ctx.ellipse(cx,cy,18,8,0,0,Math.PI*2); ctx.fill();
          ctx.fillRect(cx-18,cy,36,30);
          ctx.fillStyle='#D0E8C8'; ctx.beginPath();
          ctx.ellipse(cx,cy+30,18,8,0,0,Math.PI*2); ctx.fill();
          ctx.strokeStyle='#D0E8C8'; ctx.lineWidth=3; ctx.lineCap='round';
          ctx.beginPath(); ctx.arc(cx+20,cy+14,10,-(Math.PI/2),(Math.PI/2)); ctx.stroke();
          ctx.fillStyle='rgba(140,200,80,0.5)'; ctx.beginPath();
          ctx.ellipse(cx,cy+2,15,6,0,0,Math.PI*2); ctx.fill();
          ctx.strokeStyle='rgba(200,220,195,0.65)'; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx-5,cy-14,cx+5,cy-23,cx,cy-32); ctx.stroke();
        }
        // 受け取る人たち
        [W*0.58,W*0.72,W*0.85].forEach(x=>drawPerson(ctx,x,H*0.4,48,'#808080',0.78));
        // 笑顔マーク
        ['😊','😊','😊'].forEach((e,i)=>{
          ctx.font='22px sans-serif'; ctx.textAlign='center';
          ctx.fillText(e,[W*0.58,W*0.72,W*0.85][i],H*0.27);
        });
      },
      chars: [{ img:robot, x:14, y:H*0.36, size:140, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' }],
      effectsDraw(ctx) { drawSfx(ctx,'ほっこり…',W*0.3,H*0.15,30,'#FF8C00'); },
      bubbles: [{ x:162,y:8,w:302,h:118,tail:'bl',fill:QF,border:QBR,tc:QTC,msg:'備えた人の行動が\n周りを温める！\n温かい飲み物が\n心まで救うんだ！' }],
    },

    // P4: 「備えた人が次を助ける」
    { ...QB,
      bgDraw: brightOutdoor,
      sceneDraw(ctx) {
        // 地域の人々が手をつなぐ
        const people=[
          {x:W*0.4,y:H*0.48,s:58,c:'#6080A0'},
          {x:W*0.52,y:H*0.45,s:54,c:'#A06080'},
          {x:W*0.64,y:H*0.48,s:56,c:'#80A060'},
          {x:W*0.76,y:H*0.46,s:52,c:'#A08040'},
        ];
        people.forEach(p=>drawPerson(ctx,p.x,p.y,p.s,p.c,0.88));
        // 繋いだ手（線）
        ctx.strokeStyle='#16A34A'; ctx.lineWidth=4; ctx.lineCap='round';
        [[W*0.4,W*0.52],[W*0.52,W*0.64],[W*0.64,W*0.76]].forEach(([x1,x2])=>{
          ctx.beginPath(); ctx.moveTo(x1+28,H*0.48); ctx.lineTo(x2-28,H*0.48); ctx.stroke();
        });
        // ハート
        [W*0.46,W*0.58,W*0.7].forEach(x=>{
          ctx.fillStyle='rgba(255,100,100,0.75)'; ctx.font='20px sans-serif'; ctx.textAlign='center';
          ctx.fillText('♥',x,H*0.34);
        });
        // まとめメッセージ板
        ctx.fillStyle='#15803D'; roundRect(ctx,W*0.36,H*0.69,245,72,8); ctx.fill();
        ctx.fillStyle='white'; ctx.font='bold 17px "Yu Gothic"'; ctx.textAlign='center';
        ctx.fillText('備えた人が',W*0.36+122,H*0.69+22);
        ctx.fillText('次の誰かを助ける',W*0.36+122,H*0.69+46);
        ctx.font='bold 13px "Yu Gothic"';
        ctx.fillText('あなたから地域の防災力を！',W*0.36+122,H*0.69+66);
      },
      chars: [{ img:robot, x:W*0.38, y:H*0.26, size:140, flip:true, name:'レスQロボ', nb:'rgba(59,130,246,0.7)', nf:'#EFF6FF' }],
      effectsDraw(ctx) { drawCheck(ctx,W*0.28,H*0.18,50,'#16A34A'); },
      bubbles: [{ x:8,y:8,w:308,h:118,tail:'bottom',fill:QF,border:QBR,tc:QTC,msg:'あなたが備えれば\n地域が変わる！\n防災力はつながりから\n始まるんだ！' }],
    },

  ]},

];}

// ── 実行 ─────────────────────────────────────────────────────────
async function main() {
  const riss  = await loadImage(path.join(IMG, 'riss.png'));
  const robot = await loadImage(path.join(IMG, 'robot.png'));
  const articles = makeArticles(riss, robot);

  for (const manga of articles) {
    const outDir = path.join(PUBLIC, 'manga', manga.slug);
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`\n📖 ${manga.slug}`);

    for (let i = 0; i < manga.panels.length; i++) {
      const p = manga.panels[i];
      const canvas = await drawPanel({
        bgDraw:      p.bgDraw,
        sceneDraw:   p.sceneDraw,
        chars:       p.chars || [],
        effectsDraw: p.effectsDraw,
        bubbles:     p.bubbles || [],
        panelNum:    i + 1,
        nb1:         p.nb1,
        nb2:         p.nb2,
        border:      p.border,
      });

      const outPath = path.join(outDir, `panel-0${i + 1}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`  ✅ panel-0${i + 1}.png`);
    }
  }

  console.log('\n🎉 全コマ生成完了！');
  articles.forEach(m => console.log(`  - public/manga/${m.slug}/`));
}

main().catch(err => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
