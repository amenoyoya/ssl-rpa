from lib.arch import is_windows
from lib.webd import ChromeDriver, use_chrome_driver, load_url

@use_chrome_driver({
    'driver': './driver/chromedriver75.exe' if is_windows() else './driver/chromedriver75'
})
def main(driver: ChromeDriver) -> None:
    # さくらインターネット コンパネ
    load_url(driver, 'https://secure.sakura.ad.jp/rscontrol/')
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print('close chromedriver')
