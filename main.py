from lib.arch import is_windows
from lib.webd import ChromeDriver, use_chrome_driver, load_url
from config import config

# さくらインターネット｜ログイン: (ChromeDriver, str, str) -> None
def sakura_login(driver: ChromeDriver, domain: str, password: str) -> None:
    load_url(driver, 'https://secure.sakura.ad.jp/rscontrol/')
    driver.find_element_by_xpath('//input[@name="domain"]').send_keys(domain)
    driver.find_element_by_xpath('//input[@name="password"]').send_keys(password)
    driver.find_element_by_xpath('//input[@class="image"]').submit()

@use_chrome_driver({
    'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75'
})
def main(driver: ChromeDriver) -> None:
    sakura_login(driver, config.domain, config.password)
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print('close chromedriver')
