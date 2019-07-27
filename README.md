# ssl-rpa

## What's this?

さくらインターネットで自動的にSSL証明書をインストールするツール

***

## Setup

### Environment
- OS: Ubuntu 18.04 LTS
- Python: `3.7.3`
    - Selenium: `3.141.0`
- Google Chrome: `75.0`

### Prepare
```bash
# install python packages
$ pip install -r requirements.txt

# change executable chromedriver's permission
$ chmod 755 ./driver/chromedriver75
```

***

## Design

- さくらインターネット｜コンパネ｜ログイン: https://secure.sakura.ad.jp/rscontrol
    - ドメイン名: `//input[@name="domain"]`
        - 登録ドメイン名入力
    - パスワード: `//input[@name="password"]`
        - 登録パスワード入力
    - 送信（ログイン）: `//input[@class="image"]`
- ドメイン一覧: https://secure.sakura.ad.jp/rscontrol/rs/domain
- SSL証明書登録: https://secure.sakura.ad.jp/rscontrol/rs/ssl-entry?SNIDomain=<ドメイン名>
    - 無料SSL証明書（Let's Encrypt）: https://secure.sakura.ad.jp/rscontrol/rs/freessl?SNIDomain=<ドメイン名>
    - 有料SSL証明書: https://secure.sakura.ad.jp/rscontrol/rs/ssl-select?Domain=<ドメイン名>
    - SSL証明書詳細: https://secure.sakura.ad.jp/rscontrol/rs/ssl?Domain=<ドメイン名>

### 無料SSL証明書登録自動化
- 無料SSL証明書（Let's Encrypt）: https://secure.sakura.ad.jp/rscontrol/rs/freessl?SNIDomain=<ドメイン名>
    - 申請ボタン: `//button[@type="submit"]`
