/**
 * ChatGPTで生成した4コマ画像を保存するスクリプト
 *
 * ダウンロードフォルダにある最新の「ChatGPT Image *.png」を
 * public/manga/<slug>/comic.png へ移動し、記事/下書きの frontmatter の
 * mangaImages を更新する。
 *
 * 実行例:
 *   node scripts/save-comic.js --slug hazard-map
 *   node scripts/save-comic.js --slug hazard-map --file "C:\\path\\to\\image.png"
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = process.cwd();
const DOWNLOADS = path.join(os.homedir(), 'Downloads');

function findLatestChatGptImage() {
  const files = fs
    .readdirSync(DOWNLOADS)
    .filter((f) => /^ChatGPT Image .*\.png$/i.test(f))
    .map((f) => {
      const full = path.join(DOWNLOADS, f);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  return files[0]?.full ?? null;
}

function upsertMangaImage(slug) {
  for (const dir of ['content/articles', 'content/drafts']) {
    const file = path.join(ROOT, dir, `${slug}.mdx`);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const block = `mangaImages:\n  - "/manga/${slug}/comic.png"`;
    let next = raw;
    if (/^mangaImages:/m.test(next)) {
      next = next.replace(/mangaImages:\r?\n(?:  - .+\r?\n)+/m, `${block}\n`);
    } else {
      next = next.replace(/^manga:\s*$/m, `${block}\nmanga:`);
    }
    if (next !== raw) {
      fs.writeFileSync(file, next, 'utf8');
      console.log(`frontmatter更新: ${dir}/${slug}.mdx`);
    }
    return true;
  }
  return false;
}

function main() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');
  const slug = slugIndex >= 0 ? args[slugIndex + 1] : null;
  const fileIndex = args.indexOf('--file');
  const explicit = fileIndex >= 0 ? args[fileIndex + 1] : null;

  if (!slug) {
    console.error('使い方: node scripts/save-comic.js --slug <slug> [--file <path>]');
    process.exit(1);
  }

  const src = explicit ?? findLatestChatGptImage();
  if (!src || !fs.existsSync(src)) {
    console.error('❌ ChatGPT画像が見つかりません（Downloadsを確認してください）');
    process.exit(1);
  }

  const outDir = path.join(ROOT, 'public', 'manga', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'comic.png');
  fs.copyFileSync(src, dest);
  console.log(`✅ 保存: public/manga/${slug}/comic.png （元: ${path.basename(src)}）`);

  if (!upsertMangaImage(slug)) {
    console.warn(`⚠️ ${slug}.mdx が見つからないため frontmatter は未更新です`);
  }
}

main();
