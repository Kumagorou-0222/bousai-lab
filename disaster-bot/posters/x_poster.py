import tweepy
from config import (
    X_CONSUMER_KEY,
    X_CONSUMER_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_TOKEN_SECRET,
)


def post_to_x(text: str) -> None:
    if not all([X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET]):
        print("[X投稿スキップ] APIキーが未設定です")
        return

    client = tweepy.Client(
        consumer_key=X_CONSUMER_KEY,
        consumer_secret=X_CONSUMER_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )
    try:
        response = client.create_tweet(text=text)
        print(f"[X投稿完了] tweet_id={response.data['id']}")
    except tweepy.TweepyException as e:
        print(f"[X投稿失敗] {e}")
