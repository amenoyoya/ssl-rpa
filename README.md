# ssl-rpa

さくらインターネットで自動的にSSL証明書をインストールするツール

***

## Environment

- OS:
    - Ubuntu 18.04 LTS
    - Windows 10
- Node.js: 12.14.1
    - Yarn package manager: 1.21.1
    - Express Web Framework: 4.17.1

### Structure
```bash
./
|_ app/   # Express WEB アプリ
|   |_ api/
|   |   |_ index.js  # APIルーティング
|   |   |_ sakura.js # さくらレンタルサーバ操作API
|   |   |_ test.js   # API動作確認スクリプト
|   |
|   |_ public/
|   |   |_ index.html # WEB公開ファイル
|   |
|   |_ app.js # Expressサーバ
|
|_ docker/ # Dockerコンテナ
|   |_ certs/   # SSL証明書格納ディレクトリ
|   |_ express/ # expressコンテナ
|       |_ Dockerfile
|       |_ package.json # Expressサーバに必要なnode_modulesを記述
|
|_ docker-compose.yml
|_ package.json # ローカル開発時に必要なnode_modulesを記述
```

### Setup
```bash
# node_modules インストール
$ yarn install

# Expressサーバ起動: http://localhost:3333
$ node app/app.js
```

### Deployment
```bash
# -- user@server

# masterブランチ pull
$ pull origin master

# docker-compose.yml の変更を無視
$ git update-index --assume-unchanged docker-compose.yml

# 本番公開用の docker-compose.yml 作成
## --host <ドメイン名>: 公開ドメイン名
## --email <メールアドレス>: Let's Encrypt 申請用メールアドレス（省略時: admin@<ドメイン名>）
## +noproxy: 複数のDockerComposeで運用していて nginx-proxy, letsencrypt コンテナが別に定義されている場合に指定
$ node handledocker.js --host yourdomain.com --email yourmail@yourdomain.com +noproxy

# Docker実行ユーザIDを合わせてDockerコンテナビルド
$ export UID && docker-compose build

# コンテナ起動
$ export UID && docker-compose up -d
```

***

## Design

- さくらインターネット｜コンパネ｜ログイン: https://secure.sakura.ad.jp/rscontrol
    - ドメイン名: `//input[@name="domain"]`
        - 登録ドメイン名入力
    - パスワード: `//input[@name="password"]`
        - 登録パスワード入力
    - 送信（ログイン）: `//input[@class="image"]`
- コンパネルート:
    - 標準プラン: https://secure.sakura.ad.jp/rscontrol/rs
    - PROプラン: https://secure.sakura.ad.jp/rscontrol/main
- ドメイン一覧: /domain
- SSL証明書登録: /ssl-entry?SNIDomain=<ドメイン名>
    - 無料SSL証明書（Let's Encrypt）: /freessl?SNIDomain=<ドメイン名>
    - 有料SSL証明書: /ssl-select?Domain=<ドメイン名>
    - SSL証明書詳細: /ssl?Domain=<ドメイン名>

### 無料SSL証明書登録自動化
- 無料SSL証明書（Let's Encrypt）: /freessl?SNIDomain=<ドメイン名>
    - 申請ボタン: `//button[@type="submit"]`

### 独自SSL証明書インストール自動化
- 目的:
    - さくら以外の認証局からSSL認証をしてもらった場合の証明書インストール自動化（SNI SSL）
- 条件:
    - SSL証明書および中間証明書を発行済
- 登録画面（使わない）: /ssl?SNIDomain=<ドメイン名>
- 証明書のインストール: /ssl?Install=1&SNIDomain=<ドメイン名>
    - 入力ボックス: `//textbox[@name="Cert"]`
        ```ssl
        -----BEGIN CERTIFICATE-----
        RandomText
        -----END CERTIFICATE-----
        ```
    - 送信ボタン: `//input[@name="Submit_install"]`
        - => 成功した場合: /ssl?SNIDomain=<ドメイン名> に遷移
- 中間証明書のインストール: /ssl?CACert=1&SNIDomain=<ドメイン名>
    - 入力ボックス: `//textbox[@name="Cert"]`
        ```ssl
        -----BEGIN CERTIFICATE-----
        RandomText
        -----END CERTIFICATE-----
        ```
    - 送信ボタン: `//input[@name="Submit_cacert"]`
        - => 成功した場合: /ssl?SNIDomain=<ドメイン名> に遷移

### ログ設定自動化
- アクセスログの設定: /logging
    - アクセスログの保存設定:
        - 残す: `//input[@name="logging" and @value="1"]`
            - エラーログも残す（チェックボックス）: `//input[@name="errlog"]`
        - 残さない: `//input[@name="logging" and @value="0"]`
    - アクセスログの保存期間: `//select[@name="month"]` => option: 1-24
    - ホスト名の情報:
        - 残す: `//input[@name="VHost" and @value="1"]`
        - 残さない: `//input[@name="VHost" and @value="0"]`
    - 送信ボタン: `//input[@type="image"]`
    
