class config:
    # ログイン用設定
    login_domain: str = 'login_domain.sakura.ne.jp'
    login_password: str = 'login_password'
    # SSL化したいドメインのリスト
    target_domains: list = ['example.com', 'example.net', 'example.jp']
    # 負荷軽減用｜処理の間隔（秒）
    interval: int = 5
