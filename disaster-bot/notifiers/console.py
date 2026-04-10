def notify_console(text: str) -> None:
    print("\n" + "=" * 50)
    print("📢 投稿候補")
    print("=" * 50)
    print(text)
    print("=" * 50)
    print(f"文字数: {len(text)}/280\n")
