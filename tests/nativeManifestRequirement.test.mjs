import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requiredNativeDates} from '../scripts/require-native-comic-manifests.mjs';
test('過去作品へ遡及しない',()=>assert.deepEqual(requiredNativeDates([{slotDate:'2026-11-13'}],()=>false),[]));
test('採用日から未登録manifestを拒否',()=>assert.throws(()=>requiredNativeDates([{slotDate:'2026-11-14'}],()=>false),/未登録/));
test('翌日新作も未登録なら拒否',()=>assert.throws(()=>requiredNativeDates([{slotDate:'2026-11-15'}],()=>false),/未登録/));
test('登録済み全日付を既存解像度検査へ渡す',()=>assert.deepEqual(requiredNativeDates([{slotDate:'2026-11-14'},{slotDate:'2026-11-15'}],()=>true),['2026-11-14','2026-11-15']));
