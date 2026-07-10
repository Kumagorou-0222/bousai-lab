'use strict';
/**
 * 既存のKindle EPUBに表紙画像（cover.jpg）を組み込む。
 *
 * - OEBPS/images/cover.jpg を追加
 * - content.opf の manifest に properties="cover-image" 付きで登録
 *   （<meta name="cover" content="img-cover"/> は既存のものをそのまま利用）
 * - pages/cover.xhtml を「表紙画像を全面表示」する内容に置き換え
 *
 * 実行: node scripts/add-cover-to-epub.js <epub-path> [<epub-path2> ...]
 * 事前に node scripts/generate-kindle-cover.js で kindle-export/cover.jpg を生成しておくこと
 */

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const ROOT = path.resolve(__dirname, '..');
const COVER_JPG = path.join(ROOT, 'kindle-export', 'cover.jpg');

const OLD_TITLE = '防災Lab まんがで学ぶ在宅避難ガイド';
const NEW_TITLE = 'こわがるためではなく、守るための防災――避難所に行かない「在宅避難」まんがガイド';

function makeCoverXhtml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
  <meta charset="UTF-8"/>
  <title>${NEW_TITLE}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
  <style type="text/css">
    body { margin: 0; padding: 0; }
    .cover-full { text-align: center; margin: 0; padding: 0; }
    .cover-full img { width: 100%; height: 100%; max-width: 100%; }
  </style>
</head>
<body>
<div class="cover-full">
  <img src="../images/cover.jpg" alt="${NEW_TITLE} 表紙"/>
</div>
</body>
</html>`;
}

async function patchEpub(epubPath) {
  if (!fs.existsSync(epubPath)) {
    console.error(`❌ 見つかりません: ${epubPath}`);
    return;
  }

  const buf = fs.readFileSync(epubPath);
  const zip = await JSZip.loadAsync(buf);

  // 1. 表紙画像を追加
  const coverBuf = fs.readFileSync(COVER_JPG);
  zip.file('OEBPS/images/cover.jpg', coverBuf);

  // 2. content.opf を書き換え（manifestにcover-image項目を追加）
  const opfPath = 'OEBPS/content.opf';
  let opf = await zip.file(opfPath).async('string');

  if (!opf.includes('id="img-cover"')) {
    opf = opf.replace(
      '</manifest>',
      '    <item id="img-cover" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n  </manifest>'
    );
  }
  if (!opf.includes('name="cover"')) {
    opf = opf.replace(
      '</metadata>',
      '    <meta name="cover" content="img-cover"/>\n  </metadata>'
    );
  }
  // タイトル更新（旧タイトル文字列が含まれる場合のみ置換）
  opf = opf.split(OLD_TITLE).join(NEW_TITLE);
  zip.file(opfPath, opf);

  // 2b. toc.ncx のタイトルも更新
  const ncxPath = 'OEBPS/toc.ncx';
  const ncxFile = zip.file(ncxPath);
  if (ncxFile) {
    let ncx = await ncxFile.async('string');
    ncx = ncx.split(OLD_TITLE).join(NEW_TITLE);
    zip.file(ncxPath, ncx);
  }

  // 3. cover.xhtml を画像表示版に置き換え
  zip.file('OEBPS/pages/cover.xhtml', makeCoverXhtml());

  // 4. mimetype は非圧縮のまま維持（EPUB仕様上必須）
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  const outBuf = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(epubPath, outBuf);
  const sizeMB = (outBuf.length / 1024 / 1024).toFixed(2);
  console.log(`✅ 表紙を追加しました: ${epubPath} (${sizeMB} MB)`);
}

async function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error('使い方: node scripts/add-cover-to-epub.js <epub-path> [...]');
    process.exit(1);
  }
  if (!fs.existsSync(COVER_JPG)) {
    console.error('❌ kindle-export/cover.jpg がありません。先に generate-kindle-cover.js を実行してください。');
    process.exit(1);
  }
  for (const t of targets) {
    await patchEpub(path.resolve(t));
  }
}

main().catch((err) => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
