import time
from typing import Tuple
from lib.arch import is_windows
from lib.webd import ChromeDriver, use_chrome_driver, load_url
from flask import Flask, render_template, jsonify, request

# さくらインターネット｜ログイン: (ChromeDriver, str, str) -> bool
def sakura_login(driver: ChromeDriver, domain: str, password: str) -> bool:
    load_url(driver, 'https://secure.sakura.ad.jp/rscontrol/rs')
    driver.find_element_by_xpath('//input[@name="domain"]').send_keys(domain)
    driver.find_element_by_xpath('//input[@name="password"]').send_keys(password)
    driver.find_element_by_xpath('//input[@class="image"]').submit()
    # ログインできたか確認
    load_url(driver, 'https://secure.sakura.ad.jp/rscontrol/rs')
    inputs: list = driver.find_elements_by_xpath('//input[@name="password"]')
    # パスワード入力ボックスがあるならログインできていない
    return len(inputs) == 0

# 無料SSL証明書（Let's Encrypt）申し込み: (ChromeDriver, str) -> bool
def sakura_apply_lets_encrypt(driver: ChromeDriver, domain: str) -> bool:
    load_url(driver, f'https://secure.sakura.ad.jp/rscontrol/rs/freessl?SNIDomain={domain}')
    buttons: list = driver.find_elements_by_xpath('//button[@type="submit"]')
    if len(buttons) == 0:
        return False
    buttons[0].submit()
    return True

# ---

INTERVAL: int = 5 # SSL申請のインターバル（秒）

# flask application
app = Flask(__name__)

# home: /
@app.route('/', methods=['GET'])
def home() -> Tuple[str, int]:
    return render_template('home.jinja',
        scripts=['/static/js/home.js']
    )

# login api: /api/apply
@app.route('/api/apply', methods=['POST'])
def login_api() -> Tuple[str, int]:
    res: dict = {
        'status': 200,
        'info': '',
        'error': ''
    }
    
    @use_chrome_driver({
        'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75',
        'headless': True
    })
    def main(driver: ChromeDriver) -> None:
        # ログイン
        if sakura_login(driver, request.json['login_domain'], request.json['login_password']):
            # res['screenshot'] = 'data:image/png;base64,' + driver.find_element_by_xpath('//body').screenshot_as_base64
            pass
        else:
            res['status'] = 401
            res['error'] = 'さくらインターネットのコントロールパネルにログインできませんでした\nログインドメイン名・パスワードが正しいか確認してください'
            return None
        # 対象ドメインをSSL登録申請
        for domain in request.json['domains']:
            if domain == '': 
                # ドメイン名が入力されていないならスキップ
                continue
            time.sleep(INTERVAL) # 負荷軽減
            if sakura_apply_lets_encrypt(driver, domain):
                res['info'] += f"Let's Encrypt applied: {domain}\n"
            else:
                res['error'] += f"Failed to apply Let's Encrypt: {domain}\n"
    
    return jsonify(res), res['status']

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)
