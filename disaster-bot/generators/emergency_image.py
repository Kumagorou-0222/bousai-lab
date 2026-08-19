import os
from PIL import Image, ImageDraw, ImageFont

# フォントパスの指定（Noto Sans CJK JP）
FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
if not os.path.exists(FONT_PATH):
    # フォールバック（環境によって異なる可能性があるため）
    FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def generate_emergency_image(title: str, level: int, advice_list: list[str], output_path: str):
    """
    緊急投稿用の画像を生成する
    """
    width, height = 1200, 675  # X (Twitter) の推奨アスペクト比 16:9
    
    # 背景色の決定
    if level >= 3:
        bg_color = (200, 0, 0)  # 濃い赤
        text_color = (255, 255, 255)
    elif level == 2:
        bg_color = (255, 140, 0)  # オレンジ
        text_color = (255, 255, 255)
    else:
        bg_color = (255, 255, 0)  # 黄色
        text_color = (0, 0, 0)

    image = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(image)

    try:
        # タイトル用フォント
        title_font = ImageFont.truetype(FONT_PATH, 80)
        # 本文用フォント
        body_font = ImageFont.truetype(FONT_PATH, 45)
        # ヘッダー用フォント
        header_font = ImageFont.truetype(FONT_PATH, 30)
    except Exception as e:
        print(f"Font load error: {e}")
        # フォールバックとしてデフォルトフォントを使用（日本語は化ける可能性あり）
        title_font = body_font = header_font = ImageFont.load_default()

    # ヘッダー
    draw.text((50, 30), "⚠️ 医師監修・緊急防災アラート", font=header_font, fill=text_color)
    
    # タイトル（中央寄せっぽく）
    draw.text((50, 100), title, font=title_font, fill=text_color)
    
    # 境界線
    draw.line((50, 220, 1150, 220), fill=text_color, width=5)
    
    # アドバイスの見出し
    draw.text((50, 250), "【今すぐすべき行動】", font=body_font, fill=text_color)
    
    # アドバイスリストの描画
    y_offset = 320
    for advice in advice_list[:5]:  # 最大5項目
        draw.text((80, y_offset), f"・ {advice}", font=body_font, fill=text_color)
        y_offset += 70

    # フッター（サイト名）
    draw.text((50, 600), "詳細はサイトで確認： bousai-lab.vercel.app", font=header_font, fill=text_color)

    # 保存
    image.save(output_path, "PNG")
    print(f"[画像生成完了] {output_path}")

if __name__ == "__main__":
    # テスト用
    test_advice = [
        "頭を保護し、丈夫な机の下に隠れてください",
        "火の元を確認し、揺れが収まるまで待ちます",
        "エレベーターは絶対に使用しないでください",
        "避難時はブレーカーを落としてください"
    ]
    generate_emergency_image("緊急地震速報（震度6弱）", 3, test_advice, "test_emergency.png")
