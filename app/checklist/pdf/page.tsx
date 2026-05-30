'use client'

const BASE = 'https://bousai-lab.vercel.app'

const SECTIONS = [
  {
    id: 'water-food',
    title: '💧 水・食料の備蓄',
    color: '#1D4ED8',
    items: [
      { text: '飲料水 — 1人1日3L × 7日分', note: '4人家族なら2Lペットボトル42本', href: '/best-disaster-items' },
      { text: '非常食 — レトルト・缶詰・乾麺 7日分', note: '味の素アルファ米、井村屋えいようかん等', href: '/best-disaster-items' },
      { text: '経口補水液（OS-1）6本以上', note: '嘔吐・下痢・熱中症時に必須' },
      { text: '使い捨て食器・割り箸・ラップ', note: '洗い物不要で衛生的' },
    ],
  },
  {
    id: 'toilet',
    title: '🚽 トイレ対策',
    color: '#16A34A',
    items: [
      { text: '携帯トイレ（凝固剤タイプ）50回分以上', note: '大規模地震では断水が数週間続く', href: '/articles/emergency-toilet' },
      { text: '防臭袋（二重構造タイプ）50枚以上', note: 'BOS防臭袋がおすすめ', href: '/articles/emergency-toilet' },
      { text: 'トイレットペーパー 多めに備蓄', note: 'ポリ袋と組み合わせて使用' },
      { text: '給水タンク・ポリ容器（給水車対応）', note: '20L以上のものを1〜2個' },
    ],
  },
  {
    id: 'power',
    title: '🔋 電源・照明',
    color: '#D97706',
    items: [
      { text: 'モバイルバッテリー 20,000mAh以上', note: 'スマホ約5〜6回分。常に満充電で保管', href: '/articles/mobile-battery' },
      { text: 'LEDランタン（乾電池式・200lm以上）', note: 'ろうそくより安全。部屋全体を照らせる', href: '/best-disaster-items' },
      { text: '乾電池（単3・単4 各10本以上）', note: '期限を確認して定期交換' },
      { text: 'カセットコンロ＋ガス缶12本以上', note: 'ガス停止時の調理に必須', href: '/best-disaster-items' },
      { text: 'ポータブル電源 1,000Wh以上（推奨）', note: '長期停電・医療機器使用者に特に重要', href: '/best-disaster-items' },
    ],
  },
  {
    id: 'bag',
    title: '🎒 防災バッグ（持ち出し用）',
    color: '#DC2626',
    items: [
      { text: '防災リュック（30L以上）に一式入れる', note: '玄関・寝室近くに置く', href: '/articles/disaster-backpack' },
      { text: '飲料水 500ml × 3本', note: '避難直後の1〜2日分' },
      { text: '非常食 1〜2日分', note: 'カロリーメイト・スポーツゼリー等' },
      { text: '携帯トイレ 5回分以上', href: '/articles/emergency-toilet' },
      { text: 'モバイルバッテリー（充電済み）', href: '/articles/mobile-battery' },
      { text: '懐中電灯・予備電池' },
      { text: '救急セット（絆創膏・ガーゼ・消毒液）' },
      { text: 'お薬手帳コピー・常備薬（3日分）' },
      { text: '現金（硬貨含む・1万円以上）' },
      { text: '保険証・マイナンバーカードのコピー' },
      { text: '防寒シート・レインポンチョ' },
      { text: '家族の連絡先メモ（紙に書く）' },
      { text: 'ホイッスル・軍手・マスク' },
    ],
  },
  {
    id: 'house',
    title: '🏠 家の中の対策',
    color: '#7C3AED',
    items: [
      { text: '寝室の家具を固定（突っ張り棒・L字金具）', note: '地震死因の3〜5割は家具転倒', href: '/articles/earthquake-furniture' },
      { text: '冷蔵庫に転倒防止ベルトを設置' },
      { text: '枕元に懐中電灯・スリッパを置く', note: '夜間地震で素足歩きは危険' },
      { text: 'ガスの元栓の場所を家族で確認' },
      { text: 'ブレーカーの場所を家族で確認' },
    ],
  },
  {
    id: 'info',
    title: '📍 情報・連絡',
    color: '#0891B2',
    items: [
      { text: '家族の避難場所・集合場所を決めてある' },
      { text: '近くの避難所（一次・二次）を確認済み' },
      { text: 'ハザードマップを確認・印刷済み', note: '市区町村のWebサイトから無料DL' },
      { text: '家族全員の携帯番号を紙にメモ済み' },
      { text: '災害用伝言ダイヤル（171）の使い方を知っている' },
      { text: '建物の建築年を確認（1981年以降か）', note: '新耐震基準は1981年6月以降' },
    ],
  },
]

export default function ChecklistPdfPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: white; font-family: 'Hiragino Sans', 'Meiryo', sans-serif; }

        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 14mm 14mm 16mm;
          margin: 0 auto;
          background: white;
        }
        .page + .page {
          page-break-before: always;
          border-top: 3px solid #E2E8F0;
          margin-top: 8mm;
        }

        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #1D4ED8;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        .site-name { font-size: 11px; font-weight: 700; color: #1D4ED8; }
        .site-url { font-size: 10px; color: #64748B; }

        h1 {
          font-size: 20px; font-weight: 900; color: #0F172A;
          margin-bottom: 4px;
        }
        .subtitle { font-size: 11px; color: #64748B; margin-bottom: 10px; line-height: 1.6; }

        .summary-box {
          background: #FFF7ED;
          border: 1.5px solid #FED7AA;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 11px;
          color: #92400E;
          margin-bottom: 16px;
          line-height: 1.7;
        }

        .section {
          margin-bottom: 14px;
          break-inside: avoid;
        }
        .section-title {
          font-size: 13px;
          font-weight: 800;
          color: white;
          padding: 5px 12px;
          border-radius: 6px 6px 0 0;
        }
        .section-body {
          border: 1.5px solid #E2E8F0;
          border-top: none;
          border-radius: 0 0 6px 6px;
          overflow: hidden;
        }
        .item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 12px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 12px;
        }
        .item:last-child { border-bottom: none; }
        .item:nth-child(even) { background: #FAFAFA; }

        .checkbox {
          width: 14px;
          height: 14px;
          border: 1.5px solid #94A3B8;
          border-radius: 3px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .item-main { flex: 1; }
        .item-text { color: #1E293B; font-weight: 600; line-height: 1.4; }
        .item-note { color: #64748B; font-size: 10px; margin-top: 1px; }
        .item-link {
          flex-shrink: 0;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          text-decoration: none;
          white-space: nowrap;
          align-self: center;
        }

        .cta-box {
          border: 2px solid #1D4ED8;
          border-radius: 10px;
          padding: 12px 16px;
          margin-top: 16px;
          background: #EFF6FF;
        }
        .cta-title { font-size: 13px; font-weight: 800; color: #1D4ED8; margin-bottom: 8px; }
        .cta-links { display: flex; flex-direction: column; gap: 6px; }
        .cta-link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }
        .cta-arrow { color: #1D4ED8; font-weight: 700; }
        .cta-url { color: #1D4ED8; font-weight: 700; }
        .cta-desc { color: #475569; }

        .footer {
          margin-top: 14px;
          padding-top: 8px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94A3B8;
        }

        @media print {
          body { background: white; }
          .page { margin: 0; width: 100%; padding: 10mm 12mm 12mm; }
          .page + .page { margin-top: 0; border-top: none; }
          @page { size: A4; margin: 0; }
          .no-print { display: none !important; }
        }

        @media screen {
          body { background: #F1F5F9; padding: 16px 0 40px; }
          .print-btn {
            display: block;
            width: fit-content;
            margin: 0 auto 16px;
            padding: 12px 32px;
            background: #1D4ED8;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
          }
        }
      `}</style>

      {/* 画面表示時のみ印刷ボタン */}
      <div className="no-print" style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <button className="print-btn" onClick={() => window.print()}>
          📄 PDFで保存 / 印刷する
        </button>
        <p style={{ fontSize: 12, color: '#64748B' }}>印刷ダイアログで「PDFに保存」を選択してください</p>
      </div>

      {/* ─── ページ 1：水・食料 / トイレ / 電源 ─── */}
      <div className="page">
        <div className="site-header">
          <span className="site-name">防災Lab — 医師が教える防災知識</span>
          <span className="site-url">{BASE}</span>
        </div>

        <h1>家庭の防災チェックリスト</h1>
        <p className="subtitle">
          監修：くまごろう（現役勤務医）｜{BASE}/checklist
        </p>

        <div className="summary-box">
          ⚠️ <strong>大規模地震では「断水・停電・ガス停止」が数週間続きます。</strong><br />
          このチェックリストで「今日できる備え」を確認してください。
          各項目の「詳しく見る」から防災Labのおすすめ記事・商品ページにアクセスできます。
        </div>

        {SECTIONS.slice(0, 3).map((section) => (
          <div key={section.id} className="section">
            <div className="section-title" style={{ background: section.color }}>
              {section.title}
            </div>
            <div className="section-body">
              {section.items.map((item, i) => (
                <div key={i} className="item">
                  <div className="checkbox" />
                  <div className="item-main">
                    <div className="item-text">{item.text}</div>
                    {item.note && <div className="item-note">💡 {item.note}</div>}
                  </div>
                  {item.href && (
                    <a
                      href={`${BASE}${item.href}`}
                      className="item-link"
                      style={{ color: section.color, border: `1px solid ${section.color}`, background: `${section.color}10` }}
                    >
                      詳しく見る →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── ページ 2：防災バッグ / 家の中 / 情報 ─── */}
      <div className="page">
        <div className="site-header">
          <span className="site-name">防災Lab — 医師が教える防災知識</span>
          <span className="site-url">{BASE}</span>
        </div>

        {SECTIONS.slice(3).map((section) => (
          <div key={section.id} className="section">
            <div className="section-title" style={{ background: section.color }}>
              {section.title}
            </div>
            <div className="section-body">
              {section.items.map((item, i) => (
                <div key={i} className="item">
                  <div className="checkbox" />
                  <div className="item-main">
                    <div className="item-text">{item.text}</div>
                    {item.note && <div className="item-note">💡 {item.note}</div>}
                  </div>
                  {item.href && (
                    <a
                      href={`${BASE}${item.href}`}
                      className="item-link"
                      style={{ color: section.color, border: `1px solid ${section.color}`, background: `${section.color}10` }}
                    >
                      詳しく見る →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="cta-box">
          <div className="cta-title">📱 チェックが入らなかった項目はこちらから準備できます</div>
          <div className="cta-links">
            {[
              { url: '/best-disaster-items', label: '医師が選ぶ防災グッズ完全版', desc: '優先度・コスパ・選び方を徹底解説' },
              { url: '/articles/mobile-battery', label: 'モバイルバッテリーの選び方', desc: '20,000mAh以上・2台持ちが正解' },
              { url: '/articles/emergency-toilet', label: '携帯トイレの選び方', desc: '凝固剤タイプ50回分が目安' },
              { url: '/articles/disaster-backpack', label: '防災バッグの中身リスト', desc: '医師監修・優先度順に解説' },
            ].map((link) => (
              <div key={link.url} className="cta-link-item">
                <span className="cta-arrow">▶</span>
                <span className="cta-url">{BASE}{link.url}</span>
                <span className="cta-desc">— {link.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="footer">
          <span>防災Lab（{BASE}）｜現役医師・くまごろう監修</span>
          <span>印刷日: {new Date().toLocaleDateString('ja-JP')}</span>
        </div>
      </div>
    </>
  )
}
