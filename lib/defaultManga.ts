import type { MangaPanel } from './articles'

export const DEFAULT_MANGA_PANELS: MangaPanel[] = [
  { character: 'riss',  emotion: 'worried',  message: '災害のとき、どうしたらいいの？' },
  { character: 'robot', emotion: 'serious',  message: 'まずは落ち着いて行動することだ' },
  { character: 'robot', emotion: 'normal',   message: 'このページで大切なポイントを学ぼう' },
  { character: 'riss',  emotion: 'relieved', message: 'よかった！少し安心した！' },
]

/** panels が 4 未満のとき defaultMangaPanels で補完して必ず 4 枚返す */
export function completePanels(panels: MangaPanel[]): MangaPanel[] {
  if (panels.length >= 4) return panels.slice(0, 4)
  return [
    ...panels,
    ...DEFAULT_MANGA_PANELS.slice(panels.length),
  ]
}
