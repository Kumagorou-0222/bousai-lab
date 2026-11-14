// 正式採用日以降の夜枠は原寸生成manifest必須。過去の台帳へは遡及しない。
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
export function requiredNativeDates(entries, exists=fs.existsSync) {
  const dates=new Set();
  for (const entry of entries) {
    if (entry.slotDate < '2026-11-14') continue;
    assert.match(entry.slotDate??'', /^\d{4}-\d{2}-\d{2}$/, '夜枠日付の形式が不正');
    const file=`docs/daily_native_resolution/${entry.slotDate}-manifest.json`;
    assert.ok(exists(file), `${entry.slotDate}: 原寸個別生成manifest未登録のため出荷禁止`);
    dates.add(entry.slotDate);
  }
  return [...dates].sort();
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const entries=JSON.parse(fs.readFileSync('data/x-night-approved.json'));
  for (const date of requiredNativeDates(entries)) console.log(date);
}
