const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
const OUT_ROOT = path.join(ROOT, 'public', 'manga');
const W = 900;
const H = 1200;
const TARGET_CATEGORIES = new Set(['typhoon', 'heavy-rain', 'flood', 'tsunami', 'volcano', 'landslide']);

const chars = {
  riss: {
    label: '防災リス',
    color: '#F59E0B',
    dark: '#7C2D12',
    img: imageDataUri(path.join(ROOT, 'public', 'img', 'riss.png')),
  },
  robot: {
    label: 'レスQロボ',
    color: '#2563EB',
    dark: '#1E3A8A',
    img: imageDataUri(path.join(ROOT, 'public', 'img', 'robot.png')),
  },
};

const metaBySlug = {
  'typhoon-before': {
    badge: '台風が来る前',
    title: '台風前日に今すぐやること3つ',
    conclusion: '外の物をしまう・水を確保・スマホを充電。台風当日は外に出ない準備を前日に終える。',
    points: ['外の物を屋内へ', '水と食料を確認', '全機器を充電'],
    lines: ['台風前日、何から？', '外の物を屋内へ。水と充電も今日中だ。', '当日は外に出ない準備をするんだね。', '前日に終えれば、当日は安全な場所で待てる。'],
  },
  'typhoon-day-before': {
    badge: '台風前日',
    title: '台風前日にやること5つ',
    conclusion: '前日が最後の安全な準備時間。充電・給水・片付け・ハザードマップ・避難経路を確認する。',
    points: ['充電する', '水をためる', '避難経路を確認'],
    lines: ['前日にやることが多すぎる…。', '充電・水・片付け・地図・経路の順だ。', 'リストで見れば動けそう！', '前日が最後の安全な準備時間だ。'],
  },
  'typhoon-day': {
    badge: '台風当日',
    title: '台風当日に今すぐやること',
    conclusion: '台風当日は外出しない。窓から離れ、避難情報を確認し、浸水時は上の階へ移動する。',
    points: ['外に出ない', '窓から離れる', '情報を確認'],
    lines: ['風が弱い。外を見てもいい？', 'だめだ。台風の目かもしれない。', '静かでも安全とは限らないんだ。', '窓から離れ、情報を確認して待機だ。'],
  },
  'typhoon-evacuation': {
    badge: '台風避難',
    title: '台風のとき避難が必要な判断基準',
    conclusion: '避難は強風・浸水の前に終える。レベル4は危険な場所から全員避難する合図。',
    points: ['ハザード確認', 'レベル4で避難', '無理なら垂直避難'],
    lines: ['避難指示。まだ大丈夫かな？', 'レベル4は危険な場所から全員避難だ。', '水が増えてからは動けないね。', '間に合わなければ2階以上へ。'],
  },
  'heavy-rain-guerrilla': {
    badge: 'ゲリラ豪雨',
    title: 'ゲリラ豪雨で命を守る行動',
    conclusion: '黒い雲・雷・急な風は危険サイン。地下や川から離れ、頑丈な建物へ早めに入る。',
    points: ['空の変化を見る', '地下に入らない', '建物へ退避'],
    lines: ['急に空が真っ黒！', '雷・強い風・黒い雲は危険サインだ。', '地下へ逃げるのはだめ？', '水が入る。頑丈な建物へ入ろう。'],
  },
  'heavy-rain-warning': {
    badge: '大雨警報',
    title: '大雨警報が出たらやること',
    conclusion: '大雨警報は様子見の合図ではない。避難情報・キキクル・ハザードマップをすぐ確認する。',
    points: ['警報を確認', '危険度を見る', '早めに避難'],
    lines: ['大雨警報。まだ降り始めだけど？', '様子見ではなく確認開始の合図だ。', '何を見ればいい？', '避難情報・キキクル・地図を確認だ。'],
  },
  'heavy-rain-what': {
    badge: '線状降水帯',
    title: '線状降水帯はなぜ危険？',
    conclusion: '同じ場所に雨雲がかかり続けるため、短時間で浸水・土砂災害の危険が高まる。',
    points: ['雨が続く', '急に危険化', '早めに離れる'],
    lines: ['線状降水帯って何？', '同じ場所に雨雲がかかり続ける状態だ。', '普通の大雨より危ない？', '短時間で浸水や土砂災害が進む。'],
  },
  'heavy-rain-underpass': {
    badge: 'アンダーパス',
    title: '大雨でアンダーパスに入ってはいけない理由',
    conclusion: 'アンダーパスは水が集まる。車で入るとエンジン停止や脱出困難につながる。',
    points: ['低い道を避ける', '車で入らない', '迂回する'],
    lines: ['アンダーパスなら早く通れる？', '低い道は水が一気に集まる。', '車なら抜けられそうだけど…。', 'エンジン停止で閉じ込められる。迂回だ。'],
  },
  'heavy-rain-road': {
    badge: '冠水道路',
    title: '冠水道路は歩いてはいけない',
    conclusion: '冠水道路は穴や流れが見えない。膝下でも転倒・転落の危険があるため迂回する。',
    points: ['水深を信じない', 'マンホール注意', '迂回する'],
    lines: ['少し冠水してるだけなら歩ける？', '水の下の穴や流れは見えない。', 'マンホールも見えないんだ…。', '冠水道路は歩かず、迂回か待機だ。'],
  },
  'flood-evacuation-guide': {
    badge: '洪水・浸水',
    title: '洪水・浸水で逃げ遅れない判断基準',
    conclusion: '水が来てから逃げない。浸水前に避難し、間に合わなければ上の階へ垂直避難する。',
    points: ['浸水前に避難', '車は使わない', '上の階へ'],
    lines: ['足首くらいなら避難できる？', '流れがあれば浅くても転ぶ。', '車で逃げるのは？', '冠水前に避難。無理なら上の階へ。'],
  },
  'musashino-flood-risk': {
    badge: '武蔵野市',
    title: '武蔵野市で浸水被害が起きやすい場所',
    conclusion: '大きな河川が少なくても油断しない。低い道・地下・ハザードマップで色がつく場所を確認する。',
    points: ['低い道を見る', '地下を避ける', 'マップ確認'],
    lines: ['武蔵野市は浸水しにくい？', '油断だ。低い道や地下に水が集まる。', '通勤路や学校も見るんだね。', '地図で色がつく場所を確認しよう。'],
  },
  'tsunami-warning-evacuation': {
    badge: '津波警報',
    title: '津波警報が出たら今すぐやること',
    conclusion: '津波は見てから逃げる災害ではない。強い揺れ・長い揺れなら高台へ逃げ、戻らない。',
    points: ['高台へ逃げる', '海を見に行かない', '解除まで戻らない'],
    lines: ['海の近くで大きく揺れた…。', '警報を待たず高台へ逃げる。', '荷物や車を取りに戻りたい…。', '戻らない。解除まで海から離れる。'],
  },
  'volcano-ashfall': {
    badge: '降灰・火山灰',
    title: '火山灰が降ったときの対策',
    conclusion: '火山灰は細かい岩石の粒。吸わない・目をこすらない・排水口へ流さない。',
    points: ['吸わない', 'こすらない', '流さない'],
    lines: ['外が白い。火山灰？', '細かい岩石の粒だ。吸わないで。', '目に入ったらこすっていい？', 'こすらず洗う。灰は排水口へ流さない。'],
  },
  'landslide-warning': {
    badge: '土砂災害',
    title: '土砂災害の前兆と避難判断',
    conclusion: '土砂災害は起きてからでは逃げにくい。崖・沢の近くは雨が強まる前に離れる。',
    points: ['崖から離れる', '前兆を見逃さない', '早めに避難'],
    lines: ['崖の近く、まだ大丈夫？', '土砂災害は起きてからでは遅い。', '夜に避難するのは怖い…。', '雨が強まる前に、崖や沢から離れる。'],
  },
};

function imageDataUri(file) {
  const ext = path.extname(file).slice(1);
  return `data:image/${ext};base64,${fs.readFileSync(file).toString('base64')}`;
}

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function wrapText(text, maxChars, maxLines = 4) {
  const chars = Array.from(String(text));
  const lines = [];
  let line = '';
  for (const ch of chars) {
    if ((line + ch).length > maxChars && line) {
      lines.push(line);
      line = ch;
      if (lines.length === maxLines - 1) break;
    } else {
      line += ch;
    }
  }
  const used = Array.from(lines.join('') + line).length;
  if (used < chars.length) line = line.replace(/[。、！!？?\s]+$/, '') + '…';
  lines.push(line);
  return lines.slice(0, maxLines);
}

function textLines(text, x, y, options = {}) {
  const {
    maxChars = 16,
    maxLines = 4,
    size = 26,
    weight = 800,
    color = '#111827',
    lineHeight = Math.round(size * 1.45),
    anchor = 'middle',
    width = 300,
  } = options;
  const lines = wrapText(text, maxChars, maxLines);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  return lines.map((line, i) => (
    `<text x="${x}" y="${startY + i * lineHeight}" text-anchor="${anchor}" font-family="Yu Gothic, Meiryo, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`
  )).join('');
}

function pill(text, x, y, fill, width = 160) {
  return `<rect x="${x}" y="${y}" width="${width}" height="36" rx="18" fill="${fill}"/>
  <text x="${x + width / 2}" y="${y + 24}" text-anchor="middle" font-family="Yu Gothic, Meiryo, sans-serif" font-size="17" font-weight="800" fill="white">${esc(text)}</text>`;
}

function bubble(text, x, y, w, h, color, tail = 'down') {
  let tri = '';
  if (tail === 'left') tri = `<path d="M${x} ${y + h * 0.55} L${x - 22} ${y + h * 0.68} L${x} ${y + h * 0.78} Z" fill="white" stroke="${color}" stroke-width="3"/>`;
  if (tail === 'right') tri = `<path d="M${x + w} ${y + h * 0.55} L${x + w + 22} ${y + h * 0.68} L${x + w} ${y + h * 0.78} Z" fill="white" stroke="${color}" stroke-width="3"/>`;
  if (tail === 'down') tri = `<path d="M${x + w * 0.45} ${y + h} L${x + w * 0.55} ${y + h + 20} L${x + w * 0.65} ${y + h} Z" fill="white" stroke="${color}" stroke-width="3"/>`;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="white" stroke="${color}" stroke-width="3"/>
    ${tri}
    ${textLines(text, x + w / 2, y + h / 2 + 8, { maxChars: 13, maxLines: 4, size: text.length > 42 ? 21 : 24, width: w - 40 })}
  </g>`;
}

function character(name, x, y, size, mirror = false) {
  const img = chars[name].img;
  const transform = mirror ? `transform="translate(${x + size} ${y}) scale(-1 1)"` : `transform="translate(${x} ${y})"`;
  return `<g ${transform}>
    <image href="${img}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>
  </g>`;
}

function desk(x, y) {
  return `<g>
    <rect x="${x}" y="${y}" width="170" height="24" rx="4" fill="#A16207"/>
    <rect x="${x - 8}" y="${y - 16}" width="186" height="20" rx="4" fill="#78350F"/>
    <rect x="${x + 18}" y="${y + 24}" width="18" height="108" fill="#92400E"/>
    <rect x="${x + 132}" y="${y + 24}" width="18" height="108" fill="#92400E"/>
  </g>`;
}

function roomBg(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.68}" fill="#FFEFD5"/>
    <rect x="${x}" y="${y + h * 0.68}" width="${w}" height="${h * 0.32}" fill="#C4B5A5"/>
    <rect x="${x + w - 105}" y="${y + 38}" width="70" height="88" fill="#7DD3FC" stroke="#7C2D12" stroke-width="3"/>
    <rect x="${x + 34}" y="${y + 176}" width="58" height="92" fill="#86EFAC"/>
    <circle cx="${x + 63}" cy="${y + 156}" r="36" fill="#16A34A"/>`;
}

function roadBg(x, y, w, h, water = false) {
  const rain = Array.from({ length: 18 }, (_, i) => {
    const rx = x + 20 + i * 24;
    const ry = y + 20 + (i % 5) * 28;
    return `<line x1="${rx}" y1="${ry}" x2="${rx - 18}" y2="${ry + 70}" stroke="#0EA5E9" stroke-opacity="0.55" stroke-width="4"/>`;
  }).join('');
  const flood = water ? `<rect x="${x}" y="${y + h * 0.64}" width="${w}" height="${h * 0.36}" fill="#0E7490" opacity="0.46"/>
    <path d="M${x + 10} ${y + h * 0.72} C${x + 80} ${y + h * 0.68}, ${x + 150} ${y + h * 0.76}, ${x + 230} ${y + h * 0.72} S${x + 360} ${y + h * 0.70}, ${x + w - 10} ${y + h * 0.74}" fill="none" stroke="white" stroke-opacity="0.65" stroke-width="4"/>` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#E0F2FE"/>
    ${rain}
    <rect x="${x}" y="${y + h * 0.58}" width="${w}" height="${h * 0.42}" fill="#9CA3AF"/>
    <line x1="${x + w / 2}" y1="${y + h * 0.61}" x2="${x + w / 2}" y2="${y + h}" stroke="#FACC15" stroke-width="6" stroke-dasharray="18 16"/>
    ${flood}`;
}

function car(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="35" width="120" height="48" rx="8" fill="#475569"/>
    <rect x="20" y="0" width="70" height="46" rx="8" fill="#64748B"/>
    <rect x="30" y="8" width="45" height="28" rx="3" fill="#BFDBFE"/>
    <circle cx="25" cy="86" r="18" fill="#334155"/>
    <circle cx="95" cy="86" r="18" fill="#334155"/>
  </g>`;
}

function mapBg(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#D9F99D"/>
    <path d="M${x + 80} ${y} V${y + h} M${x} ${y + 210} H${x + w}" stroke="#A3A3A3" stroke-width="12"/>
    <rect x="${x + 90}" y="${y + 222}" width="150" height="94" fill="#0E7490" opacity="0.35"/>
    <rect x="${x + 260}" y="${y + 80}" width="92" height="80" fill="#94A3B8" opacity="0.7"/>`;
}

function tsunamiBg(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#CFFAFE"/>
    <path d="M${x} ${y + 280} C${x + 130} ${y + 160}, ${x + 245} ${y + 335}, ${x + w} ${y + 238} V${y + h} H${x} Z" fill="#0EA5E9"/>
    <path d="M${x + 315} ${y + 230} A62 62 0 0 0 ${x + 405} ${y + 182}" fill="none" stroke="white" stroke-opacity="0.82" stroke-width="14"/>
    <path d="M${x} ${y + 286} Q${x + 95} ${y + 130}, ${x + 215} ${y + 286} V${y + h} H${x} Z" fill="#65A30D"/>`;
}

function volcanoBg(x, y, w, h) {
  const ash = Array.from({ length: 28 }, (_, i) => `<circle cx="${x + 20 + (i * 53) % 390}" cy="${y + 30 + (i * 37) % 220}" r="${3 + (i % 4)}" fill="#374151" opacity="0.42"/>`).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F3F4F6"/>
    ${ash}
    <path d="M${x + 255} ${y + 320} L${x + 340} ${y + 125} L${x + 420} ${y + 320} Z" fill="#6B7280"/>
    <ellipse cx="${x + 340}" cy="${y + 130}" rx="44" ry="12" fill="#374151"/>
    <rect x="${x}" y="${y + 318}" width="${w}" height="44" fill="#9CA3AF"/>`;
}

function landslideBg(x, y, w, h) {
  const rocks = Array.from({ length: 9 }, (_, i) => `<circle cx="${x + 285 + (i * 27) % 135}" cy="${y + 170 + (i * 31) % 140}" r="${10 + (i % 3) * 5}" fill="#78716C"/>`).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ECFCCB"/>
    <path d="M${x + 220} ${y + h} L${x + w} ${y + 80} V${y + h} Z" fill="#65A30D"/>
    <path d="M${x + 270} ${y + h} L${x + w} ${y + 180} V${y + h} Z" fill="#A16207"/>
    ${rocks}`;
}

function scene(article, panelNo, rect) {
  const { x, y, w, h } = rect;
  if (article.category === 'typhoon') return roomBg(x, y, w, h) + (panelNo === 1 ? desk(x + 124, y + 162) : '') + (panelNo === 2 ? `<rect x="${x}" y="${y + h * 0.75}" width="${w}" height="${h * 0.25}" fill="#0E7490" opacity="0.45"/>` : '');
  if (article.category === 'heavy-rain') return roadBg(x, y, w, h, panelNo >= 1) + (article.slug.includes('underpass') ? car(x + 235, y + 245, 0.88) : '') + (article.slug.includes('road') ? `<circle cx="${x + 312}" cy="${y + 302}" r="28" fill="#111827"/>` : '');
  if (article.category === 'flood') return article.slug.includes('musashino') ? mapBg(x, y, w, h) : roadBg(x, y, w, h, true) + (panelNo === 1 ? car(x + 238, y + 246, 0.85) : '');
  if (article.category === 'tsunami') return tsunamiBg(x, y, w, h);
  if (article.category === 'volcano') return volcanoBg(x, y, w, h);
  if (article.category === 'landslide') return landslideBg(x, y, w, h);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F8FAFC"/>`;
}

function panelSvg(article, panelData, i, rect) {
  const speaker = panelData.character;
  const other = speaker === 'riss' ? 'robot' : 'riss';
  const numColor = i === 3 ? '#16A34A' : i === 1 ? '#0284C7' : '#F97316';
  const line = metaBySlug[article.slug]?.lines?.[i] || panelData.message;
  const bg = scene(article, i, rect);
  const charsSvg = i === 3
    ? `${character('riss', rect.x + 72, rect.y + 192, 142)}${character('robot', rect.x + 244, rect.y + 174, 148)}`
    : i === 1 && article.category === 'typhoon'
      ? `${character('riss', rect.x + 86, rect.y + 208, 106)}${desk(rect.x + 82, rect.y + 172)}${character('robot', rect.x + 266, rect.y + 150, 130)}`
      : `${character(speaker, rect.x + 54, rect.y + 190, 138)}${character(other, rect.x + 264, rect.y + 184, 132, true)}`;
  return `<g>
    <clipPath id="clip-${article.slug}-${i}"><rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" rx="8"/></clipPath>
    <g clip-path="url(#clip-${article.slug}-${i})">${bg}${charsSvg}</g>
    <rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" rx="8" fill="none" stroke="#334155" stroke-width="2"/>
    <circle cx="${rect.x + 28}" cy="${rect.y + 28}" r="18" fill="${numColor}"/>
    <text x="${rect.x + 28}" y="${rect.y + 36}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="900" fill="white">${i + 1}</text>
    ${bubble(line, rect.x + 78, rect.y + (i === 2 ? 48 : 34), 276, i === 2 ? 118 : 128, chars[speaker].color)}
  </g>`;
}

function svgFor(article) {
  const meta = metaBySlug[article.slug];
  const panels = [
    { x: 64, y: 272, w: 378, h: 362 },
    { x: 458, y: 272, w: 378, h: 362 },
    { x: 64, y: 650, w: 378, h: 362 },
    { x: 458, y: 650, w: 378, h: 362 },
  ];
  const footerPoints = meta.points.slice(0, 3).map((p, i) => {
    const x = 210 + i * 205;
    const fill = ['#2563EB', '#16A34A', '#F97316'][i];
    return `<circle cx="${x}" cy="1114" r="15" fill="${fill}"/>
      <text x="${x}" y="1120" text-anchor="middle" font-family="Arial" font-size="16" font-weight="900" fill="white">${i + 1}</text>
      <text x="${x + 23}" y="1120" font-family="Yu Gothic, Meiryo, sans-serif" font-size="17" font-weight="800" fill="#334155">${esc(p)}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#FFFDF7"/>
    <rect x="36" y="34" width="${W - 72}" height="${H - 68}" rx="16" fill="white" stroke="#E5E7EB" stroke-width="1.5"/>
    ${pill(`🌪 ${meta.badge}`, W / 2 - 75, 34, '#EF4444', 170)}
    <text x="${W / 2}" y="104" text-anchor="middle" font-family="Yu Gothic, Meiryo, sans-serif" font-size="34" font-weight="900" fill="#111827">${esc(meta.title)}</text>
    <text x="${W / 2}" y="138" text-anchor="middle" font-family="Yu Gothic, Meiryo, sans-serif" font-size="18" font-weight="700" fill="#64748B">くまごろう（現役勤務医）　|　2026-06-13</text>
    <rect x="64" y="164" width="${W - 128}" height="72" rx="10" fill="#FFF7ED" stroke="#EF4444" stroke-width="2"/>
    ${textLines(`結論：${meta.conclusion}`, 92, 204, { maxChars: 39, maxLines: 2, size: 18, weight: 800, color: '#B91C1C', anchor: 'start' })}
    ${article.panels.slice(0, 4).map((p, i) => panelSvg(article, p, i, panels[i])).join('')}
    <rect x="64" y="1080" width="${W - 128}" height="66" rx="10" fill="#FFF7ED" stroke="#FECACA" stroke-width="1.5"/>
    ${pill('覚えよう', 82, 1096, '#EF4444', 108)}
    ${footerPoints}
    <text x="790" y="1131" font-size="42">📋</text>
  </svg>`;
}

function readTargets() {
  return fs.readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const file = path.join(ARTICLES_DIR, name);
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = matter(raw);
      return {
        file,
        raw,
        parsed,
        slug: name.replace(/\.mdx$/, ''),
        category: String(parsed.data.category || '').replaceAll('"', ''),
        panels: parsed.data.manga?.panels || [],
      };
    })
    .filter((a) => TARGET_CATEGORIES.has(a.category))
    .filter((a) => metaBySlug[a.slug])
    .filter((a) => a.panels.length >= 4);
}

function upsertMangaImage(article) {
  const block = `mangaImages:\n  - "/manga/${article.slug}/comic.png"`;
  let next = article.raw;
  if (next.includes('mangaImages:')) {
    next = next.replace(/mangaImages:\n(?:  - .+\n)+/m, `${block}\n`);
  } else {
    next = next.replace(/^manga:\s*$/m, `${block}\nmanga:`);
  }
  if (next !== article.raw) fs.writeFileSync(article.file, next, 'utf8');
}

async function main() {
  const targets = readTargets();
  for (const article of targets) {
    const outDir = path.join(OUT_ROOT, article.slug);
    fs.mkdirSync(outDir, { recursive: true });
    await sharp(Buffer.from(svgFor(article))).png().toFile(path.join(outDir, 'comic.png'));
    upsertMangaImage(article);
    console.log(`generated ${article.slug}`);
  }
  console.log(`done ${targets.length} comics`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
