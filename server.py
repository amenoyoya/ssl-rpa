import logging, time
from typing import Tuple
from lib.arch import is_windows
from lib.webd import ChromeDriver, use_chrome_driver, load_url
from flask import Flask, render_template
from config import config

# ログ設定
logging.basicConfig(filename='./error.log', level=logging.ERROR)

# さくらインターネット｜ログイン: (ChromeDriver, str, str) -> None
def sakura_login(driver: ChromeDriver, domain: str, password: str) -> None:
    load_url(driver, 'https://secure.sakura.ad.jp/rscontrol/')
    driver.find_element_by_xpath('//input[@name="domain"]').send_keys(domain)
    driver.find_element_by_xpath('//input[@name="password"]').send_keys(password)
    driver.find_element_by_xpath('//input[@class="image"]').submit()

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
    return render_template('home.jinja')

'''
@use_chrome_driver({
    'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75'
})
def main(driver: ChromeDriver) -> None:
    # ログイン
    sakura_login(driver, config.login_domain, config.login_password)
    # 対象ドメインをSSL登録申請
    for domain in config.target_domains:
        time.sleep(config.interval) # 負荷軽減
        if sakura_apply_lets_encrypt(driver, domain):
            print("Let's Encrypt applied: ", domain)
        else:
            err: str = "Failed to apply Let's Encrypt: " + domain
            print(err)
            logging.error(err)
'''
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=2001, debug=True)