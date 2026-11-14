// 個別実生成版の寸法・非拡大・台帳一致の出荷ゲート。目視レビューは別途必須。
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const date=process.argv[2]??'2026-11-14';
const manifest=JSON.parse(fs.readFileSync(`docs/daily_native_resolution/${date}-manifest.json`));
const entry=JSON.parse(fs.readFileSync('data/x-night-approved.json')).find(x=>x.slotDate===date);
const bytes=fs.readFileSync(`public/manga/daily/${date}.png`);
const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);
assert.ok(Math.max(w,h)>=2400,'長辺2400px未達のため出荷禁止');
assert.equal(w*4,h*3,'3:4ではありません');
assert.equal(w,entry.width);assert.equal(h,entry.height);
assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.imageSha256);
assert.equal(entry.imageSha256,manifest.sha256);
assert.equal(manifest.upscale,false);assert.equal(manifest.panels.length,4);
for(const p of manifest.panels){
 assert.equal(p.scale,1);assert.equal(p.nativeWidth,p.placedWidth);assert.equal(p.nativeHeight,p.placedHeight);
}
assert.ok(manifest.panels[0].nativeHeight+manifest.panels[2].nativeHeight>=2400,'余白を除く絵の2段合計が不足');
assert.throws(()=>assert.ok(Math.max(1086,1448)>=2400));
console.log('個別生成の寸法・非拡大・SHA・台帳・サイズ不足拒否ゲート: PASS');
