import tweepy
from config import (
    X_CONSUMER_KEY,
    X_CONSUMER_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_TOKEN_SECRET,
)


def post_to_x(text: str, image_path: str = None) -> None:
    if not all([X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET]):
        print("[X投稿スキップ] APIキーが未設定です")
        return

    # API v2 Client
    client = tweepy.Client(
        consumer_key=X_CONSUMER_KEY,
        consumer_secret=X_CONSUMER_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )

    media_ids = []
    if image_path:
        try:
            # Media upload requires v1.1 API
            auth = tweepy.OAuth1UserHandler(
                X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
            )
            api_v1 = tweepy.API(auth)
            media = api_v1.media_upload(filename=image_path)
            media_ids = [media.media_id]
            print(f"[Xメディアアップロード完了] media_id={media.media_id}")
        except Exception as e:
            print(f"[Xメディアアップロード失敗] {e}")
            # 画像アップロードに失敗しても、テキストのみで続行を試みる

    try:
        if media_ids:
            response = client.create_tweet(text=text, media_ids=media_ids)
        else:
            response = client.create_tweet(text=text)
        print(f"[X投稿完了] tweet_id={response.data['id']}")
    except tweepy.TweepyException as e:
        print(f"[X投稿失敗] {e}")
        raise  # 呼び出し元でエラー通知できるように再スロー
