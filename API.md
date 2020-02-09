# ssl-rpa

## API仕様

### POST: /api/
- さくらレンタルサーバにログインして各種設定を行うAPI
    - Request:
        - `login_user: string`: ログインユーザ名
        - `login_passwd: string`: ログインパスワード
        - `ssl_target_domains: array[string]`: 無料SSL申請を行うドメイン名の配列
        - `logging: object`:
            - `log: boolean`: アクセスログ（エラーログ）を残すかどうか
            - `rotation: integer`: ログ保管期間（1～24ヶ月）
            - `hosts: boolean`: ホスト情報もログに記録するかどうか
    - Response:
        - `login_result: string`: ログインの結果
            - `"standard"`: スタンダードプランのコントロールパネルにログイン
            - `"pro"`: PROプランのコントロールパネルにログイン
            - `"failed"`: ログインに失敗
        - `ssl_results: array[boolean]`: SSL申請した各ドメインの申請が正常に完了したかどうか
        - `logging_result: boolean`: アクセスログ設定が正常に完了したかどうか

***

## test

```bash
# ログインテスト
$ curl -X POST -H 'Content-Type: application/json' -d '{"login_user":"yourdomain.sakura.ne.jp", "login_passwd":"yourpassword"}' http://localhost:3333/api/

# 無料SSL（Let's encrypt）申請テスト
$ curl -X POST -H 'Content-Type: application/json' -d '{"login_user":"yourdomain.sakura.ne.jp", "login_passwd":"yourpassword", "ssl_target_domains":["yourdomain.com"]}' http://localhost:3333/api/

# アクセスログ設定テスト
$ curl -X POST -H 'Content-Type: application/json' -d '{"login_user":"yourdomain.sakura.ne.jp", "login_passwd":"yourpassword", "logging":{"log":true, "rotation":12, "hosts":false}}' http://localhost:3333/api/
```
