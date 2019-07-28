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

# flask application
app = Flask(__name__)

# home: /
@app.route('/', methods=['GET'])
def home() -> Tuple[str, int]:
    return render_template('home.jinja',
        scripts=['/static/js/home.js']
    )

# login api: /api/login
@app.route('/api/login', methods=['POST'])
def login_api() -> Tuple[str, int]:
    res: dict = {'status': 200}

    @use_chrome_driver({
        'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75',
        'headless': True
    })
    def main(driver: ChromeDriver) -> None:
        # ログイン
        if sakura_login(driver, request.json['login_domain'], request.json['login_password']):
            res['screenshot'] = 'data:image/png;base64,' + driver.find_element_by_xpath('//body').screenshot_as_base64
        else:
            res['status'] = 401
        # 対象ドメインをSSL登録申請
        '''
        for domain in config.target_domains:
            time.sleep(config.interval) # 負荷軽減
            if sakura_apply_lets_encrypt(driver, domain):
                print("Let's Encrypt applied: ", domain)
            else:
                err: str = "Failed to apply Let's Encrypt: " + domain
                print(err)
                logging.error(err)
        '''
    return jsonify(res), res['status']

# test api: /api/test
@app.route('/api/test', methods=['GET'])
def test_api() -> Tuple[str, int]:
    res: dict = {}
    
    @use_chrome_driver({
        'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75',
        'headless': True,
        'size': (1960, 1024)
    })
    def api(driver: ChromeDriver) -> None:
        load_url(driver, 'https://google.co.jp')
        res['screenshot'] = 'data:image/png;base64,' + driver.find_element_by_xpath('//body').screenshot_as_base64
    return jsonify(res)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=2001, debug=True)