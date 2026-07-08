const AMAZON_TAG = 'bousailab0c-22'
const RAKUTEN_ROOM_USER_ID = '1000000575653283'
const RAKUTEN_ROOM_USER_NAME = 'くまごろう'
const RAKUTEN_ROOM_BASE = 'https://room.rakuten.co.jp/room_e510207d9c'

const AMAZON_ASIN_BY_QUERY: Record<string, string> = {
  '3m n95 マスク 9501': 'B0CVXGKH7F',
  'anker powercore 26800': 'B0C3GTMX5M',
  'anker ポータブル電源 1000wh': 'B0D5XGP6CW',
  'bos 非常用トイレ 袋': 'B0DZ2XF3YN',
  'bos 非常用トイレ 袋 凝固剤': 'B0FJ83NHRD',
  'bos 防臭袋 ll 200枚': 'B0BVR46WQT',
  'bos 防臭袋 s 防災': 'B0BVR46WQT',
  'bos 防臭袋 防災 携帯トイレ用': 'B0FJ83NHRD',
  'gentos ex-036d': 'B0078ZTWP4',
  'gentos ledランタン 防災': 'B0078ZTWP4',
  'jackery ポータブル電源 1000': 'B0DBQCN7HZ',
  'jackery ポータブル電源 1000 plus': 'B0DBQCN7HZ',
  'led 懐中電灯 防災 単3': 'B07QW5L7J6',
  'ledキャンドルランタン 防災': 'B0078ZTWP4',
  'ledランタン usb充電式 防災 キャンプ': 'B0FMF1TJ27',
  'ledランタン ソーラー usb充電 防災': 'B0FMF1TJ27',
  'ledランタン 乾電池 単3 防災 200lm': 'B0DHG6WN63',
  'ledランタン 乾電池式 防災 200lm': 'B0DHG6WN63',
  'ledランタン 充電式 防水 防災': 'B0FMF1TJ27',
  'ledランタン 防災 乾電池 キャンプ': 'B0FMF1TJ27',
  'lifesaver liberty': 'B0D3BHG5RR',
  'lifestraw personal': 'B09GHBNG6Y',
  'os-1 経口補水液 24本': 'B003UTTPTK',
  'sawyer mini sp128': 'B0DDH4KK3N',
  'sawyer squeeze sp131': 'B07PX1CBYX',
  'アクアタブス': 'B06XPCCD4Y',
  'アルコール消毒液 手指 防災 500ml': 'B088ZFSDJL',
  'アルファ米 非常食 5年保存': 'B0CCDFSMWZ',
  'イワタニ カセットコンロ 防災': 'B0GTLQZ26Y',
  'おむつ 防災 備蓄 大容量 紙おむつ': 'B0CH2FYP8J',
  'カセットコンロ ガス缶 防災 セット': 'B0GTLQZ26Y',
  'カセットコンロ 防災 iwatani': 'B0GTLQZ26Y',
  'カセットボンベ 12本 防災 備蓄': 'B0GV9DTBVJ',
  'カセットボンベ 24本 イワタニ': 'B0H1VRXVG1',
  'クーラーボックス 30l 防災 保冷剤': 'B0FVFB98CC',
  'サラヤ ハンドラボ 消毒': 'B0C2TF8HQ8',
  'ショーワグローブ ニトリル 使い捨て': 'B09KGT8K2P',
  'ソーラーパネル ポータブル電源 防災': 'B0FZL86GXC',
  'ソーラーパネル 折りたたみ 防災 100w': 'B0GFCZJ19Y',
  'ピュレル 手指消毒液': 'B00ZHQJCS8',
  'ヘッドライト 防災 led 防水': 'B07QW5L7J6',
  'ポータブル電源 1000wh': 'B0DBQCN7HZ',
  'ポータブル電源 1000wh 防災': 'B0DBQCN7HZ',
  'ポータブル電源 1000wh 防災 停電': 'B0D5XGP6CW',
  'ポータブル電源 500wh ac出力': 'B0F3JMHLGG',
  'ポータブル電源 500wh 防災 家庭用': 'B0D5XGP6CW',
  'ミルトン 錠剤': 'B0GYNQKYDT',
  'モバイルバッテリー 10000mah pd 軽量': 'B0GWHZ4SHZ',
  'モバイルバッテリー 20000mah': 'B0CG8Q3LMR',
  'モバイルバッテリー 20000mah pd 防災': 'B0CG8Q3LMR',
  'モバイルバッテリー 20000mah pse': 'B0GSG45Z7F',
  'モバイルバッテリー 20000mah usb-c': 'B0CG8Q3LMR',
  'モバイルバッテリー 20000mah 防災': 'B0CG8Q3LMR',
  'モバイルバッテリー 30000mah 急速充電': 'B0GSG45Z7F',
  '液体ミルク 常温 防災 備蓄 乳児': 'B09VSN77Y8',
  '液体ミルク 防災 備蓄 ほほえみ': 'B087JZ84K7',
  '家具転倒防止 突っ張り棒 セット': 'B085RZGH8D',
  '家具転倒防止 突っ張り棒 地震': 'B085RZGH8D',
  '花王 ハイター 業務用': 'B0G431XFQ3',
  '簡易トイレ 50回分 防災': 'B0FJ83NHRD',
  '缶詰 レトルト 備蓄 セット': 'B0CCDFSMWZ',
  '缶詰 非常食 セット 防災': 'B0B5TLQ562',
  '給水タンク 防災 折りたたみ 10l': 'B0FVX7WR2T',
  '携帯トイレ 100回分 マンション 断水 凝固剤': 'B0FJ83NHRD',
  '携帯トイレ 高吸収 防災 まとめ買い': 'B0FJ83NHRD',
  '携帯トイレ 防災 100回分': 'B0FJ83NHRD',
  '携帯トイレ 防災 簡易 袋型': 'B0FJ83NHRD',
  '携帯トイレ 洋式 50回分 防災 凝固剤': 'B0FJ83NHRD',
  '携帯トイレ 防災 凝固剤 50回': 'B0FJ83NHRD',
  '手回し ソーラー 防災ラジオ 充電': 'B0CRF2974M',
  '折りたたみ ウォータータンク 20l 防災': 'B0H1NFYV9H',
  '折りたたみ キャリーカート 耐荷重 防災': 'B09W22ZZ32',
  '折りたたみ杖 軽量 防災 歩行補助': 'B0GNR57RCJ',
  '耐震マット 家具 冷蔵庫 転倒防止': 'B09SDC1SW3',
  '耐震ラッチ 食器棚 マンション 吊り戸棚': 'B07T9Q9RVQ',
  '単3電池 24本 パナソニック 備蓄': 'B0016JUS8I',
  '東レ トレビーノ 防災': 'B0CJB4WRSW',
  '東レ トレビーノ ポット型 浄水器': 'B0CJB4WRSW',
  '非常用マット 断熱 保温 防災 アルミ': 'B0F28YDFL9',
  '備蓄水 2l 12本 ミネラルウォーター': 'B084T9C6WD',
  '備蓄水 2l 12本 長期保存': 'B084T9C6WD',
  '備蓄水 2l 長期保存 防災': 'B084T9C6WD',
  '不織布マスク 50枚 防災 非常用': 'B0D3LH2DD1',
  '保存水 2l 5年 ケース': 'B09HZ9P5QJ',
  '保存水 5年 防災 長期': 'B084T9C6WD',
  '保冷バッグ 大容量 防災 アウトドア': 'B0GNZSCS7R',
  '保冷剤 大型 防災 長持ち': 'B0GRG695SL',
  '防災 救急セット ファーストエイド': 'B0B69YGJ7S',
  '防災ヘルメット 折りたたみ 軽量': 'B079VBGQZR',
  '防災ラジオ am fm 乾電池 防水': 'B0FX48SGR3',
  '防災リュック セット 中身入り': 'B0FH94Y4VR',
  '薬ケース 防災 お薬手帳 携帯': 'B0C3QT8JSZ',
  '養生テープ 窓ガラス飛散防止': 'B0C7FW48JW',
  '哺乳瓶 使い捨て 滅菌済み 防災': 'B0GMFT1QXW',
}

const RAKUTEN_ROOM_COLLECT_BY_QUERY: Record<string, string> = {
  '保存水 2l 5年 ケース': '1700381321254185',
  '保存水 長期 防災 2l': '1700381321254185',
  '保存水 2l 防災 長期': '1700381321254185',
  '保存水 2l 12本': '1700381321254185',
  '保存水 2l 12本 長期保存': '1700381321254185',
  '長期保存水 2l 12本': '1700381321254185',
  '備蓄水 2l 長期保存 防災': '1700381321254185',
  '携帯トイレ 防災 100回分': '1700381321135426',
  '携帯トイレ 防災 凝固剤 50回分': '1700381321135426',
  '携帯トイレ 防災 凝固剤 50回': '1700381321135426',
  '携帯トイレ 防災': '1700381321135426',
  'bos 防臭袋 sサイズ': '1700299467375347',
  'bos 防臭袋 s 防災': '1700299467375347',
  'bos 防臭袋 ll': '1700369119335333',
  'bos 防臭袋 ll 200枚': '1700369119335333',
  '非常用トイレ': '1700369119335333',
  '防災リュック セット 中身入り': '1700370206494364',
  '防災リュック セット': '1700370206494364',
  '防災リュック 1人用': '1700370205279664',
  '防災セット 2人用': '1700370206893177',
  'ポータブル電源 1000wh': '1700299466506532',
  'ポータブル電源 1000wh 大容量': '1700299466506532',
  'jackery ポータブル電源 1000': '1700369118944357',
  'ポータブル電源 500wh ac出力': '1700369119147234',
  'ポータブル電源 500wh': '1700369119147234',
  'ソーラーパネル ポータブル電源 防災': '1700370208988329',
  'anker powercore 26800': '1700381794750129',
  'gentos ex-036d ledランタン': '1700381794653158',
  'ledランタン 乾電池 防災': '1700381794653158',
  'アルファ米 非常食 長期保存': '1700369120521408',
  'アルファ米 非常食 5年保存': '1700369120521408',
  '非常食 セット 5日分 加熱不要': '1700369119983168',
  '非常食 セット 7日分': '1700369119983168',
  '缶詰 防災 セット 長期保存': '1700369119983168',
  'カセットガス 12本セット 防災': '1700369148630100',
  'カセットボンベ 12本 防災 備蓄': '1700369148630100',
  'カセットコンロ 防災 ガス缶': '1700369148630100',
  '防災スリッパ': '1700370204511245',
  'エアベッド': '1700369119477377',
  '衛生用品 防災': '1700299468676487',
  'フリーズドライ 味噌汁': '1700370203577403',
  '家具転倒防止 突っ張り棒': '1700381794764231',
  '折りたたみ ウォータータンク 20l': '1700381794778469',
  '折りたたみ ウォータータンク 20l 防災': '1700381794778469',
  '単3電池 24本 備蓄': '1700381794793352',
  'クーラーボックス 保冷剤 防災': '1700381869257344',
  '液体ミルク 防災 備蓄': '1700381870066358',
  'モバイルバッテリー 20000mah 防災': '1700381870338272',
}

function normalizeKeyword(value: string) {
  return decodeURIComponent(value)
    .replace(/\+/g, ' ')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSearchKeyword(raw: string) {
  try {
    const url = new URL(raw)
    return url.searchParams.get('k') ?? url.pathname.split('/').filter(Boolean).pop() ?? raw
  } catch {
    return raw
  }
}

function findMappedValue(map: Record<string, string>, keywordOrUrl: string) {
  const keyword = normalizeKeyword(extractSearchKeyword(keywordOrUrl))
  if (map[keyword]) return map[keyword]

  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length)
  return sortedKeys.find((key) => keyword.includes(key) || key.includes(keyword))
    ? map[sortedKeys.find((key) => keyword.includes(key) || key.includes(keyword)) as string]
    : undefined
}

export function amazonProductUrl(keywordOrUrl: string) {
  const directAsin = keywordOrUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1]
  const asin = directAsin ?? findMappedValue(AMAZON_ASIN_BY_QUERY, keywordOrUrl)
  if (asin) return `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TAG}`

  const keyword = extractSearchKeyword(keywordOrUrl)
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_TAG}`
}

export function rakutenRoomUrl(keywordOrUrl?: string) {
  if (!keywordOrUrl) return `${RAKUTEN_ROOM_BASE}/items`
  const existingCollectId = keywordOrUrl.match(/room_e510207d9c\/(\d{16})/)?.[1]
  const collectId = existingCollectId ?? findMappedValue(RAKUTEN_ROOM_COLLECT_BY_QUERY, keywordOrUrl)
  if (collectId) return `${RAKUTEN_ROOM_BASE}/${collectId}`

  const keyword = extractSearchKeyword(keywordOrUrl)
  return `https://room.rakuten.co.jp/search/item?keyword=${encodeURIComponent(keyword)}&user_id=${RAKUTEN_ROOM_USER_ID}&user_name=${encodeURIComponent(RAKUTEN_ROOM_USER_NAME)}`
}
