type DoctorPerspectiveData = {
  summary: string
  points: string[]
  redFlags?: string[]
  sourceLinks?: Array<{ label: string; href: string }>
  reviewed?: boolean
  reviewer?: string
}

type Props = {
  data: DoctorPerspectiveData
}

export default function DoctorPerspective({ data }: Props) {
  const reviewedLabel = data.reviewed
    ? `医師監修：${data.reviewer ?? '防災Lab編集部の医師'}`
    : '医師の視点（公開前レビュー要）'

  return (
    <section
      aria-labelledby="doctor-perspective-title"
      style={{
        background: 'linear-gradient(145deg, #F0F9FF 0%, #F8FAFC 100%)',
        border: '1.5px solid #BAE6FD',
        borderRadius: 16,
        padding: '20px 18px',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span aria-hidden="true" style={{ fontSize: 24 }}>🩺</span>
        <div>
          <h2
            id="doctor-perspective-title"
            style={{ margin: 0, color: '#0C4A6E', fontSize: 17, fontWeight: 900 }}
          >
            医師目線で見る、災害時のポイント
          </h2>
          <p style={{ margin: '3px 0 0', color: '#0369A1', fontSize: 11, fontWeight: 700 }}>
            {reviewedLabel}
          </p>
        </div>
      </div>

      <p style={{ margin: '0 0 14px', color: '#164E63', lineHeight: 1.75, fontSize: 14 }}>
        {data.summary}
      </p>

      <div style={{ display: 'grid', gap: 8 }}>
        {data.points.map((point, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span
              aria-hidden="true"
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#0284C7',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 800,
                marginTop: 2,
              }}
            >
              {index + 1}
            </span>
            <span style={{ color: '#0F172A', fontSize: 13, lineHeight: 1.65 }}>{point}</span>
          </div>
        ))}
      </div>

      {data.redFlags && data.redFlags.length > 0 && (
        <div style={{ marginTop: 16, padding: '12px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10 }}>
          <div style={{ color: '#9A3412', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
            すぐに相談・受診を考えるサイン
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#7C2D12', fontSize: 13, lineHeight: 1.7 }}>
            {data.redFlags.map((flag, index) => <li key={index}>{flag}</li>)}
          </ul>
        </div>
      )}

      {data.sourceLinks && data.sourceLinks.length > 0 && (
        <p style={{ margin: '14px 0 0', color: '#64748B', fontSize: 11, lineHeight: 1.6 }}>
          参考：{' '}
          {data.sourceLinks.map((source, index) => (
            <span key={source.href}>
              {index > 0 && ' ／ '}
              <a href={source.href} target="_blank" rel="noopener noreferrer" style={{ color: '#0369A1' }}>
                {source.label}
              </a>
            </span>
          ))}
        </p>
      )}

      {!data.reviewed && (
        <p style={{ margin: '12px 0 0', color: '#64748B', fontSize: 11, lineHeight: 1.6 }}>
          ※この欄は公開前レビュー用の草稿です。個別の診断・薬の中止や変更を指示するものではありません。緊急時は119、現地の救護所、自治体の案内を優先してください。
        </p>
      )}
    </section>
  )
}
