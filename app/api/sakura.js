/**
 * Puppeteer: さくらレンタルサーバ操作
 */
const puppeteer = require('puppeteer');

module.exports = {
  /**
   * puppeteer実行
   * @param option: dict puppeteer起動オプション
   * @param callback: function(page) => null puppeteer実行関数
   */
  puppet(option, callback) {
    puppeteer.launch(option).then(async browser => {
      const page = await browser.newPage();
      if (option.viewport !== undefined ) {
        await page.setViewport(option.viewport);
      }
      await callback(page);
      browser.close();
    });
  },

  /**
   * さくらコントロールパネルログイン
   * @param page: puppeteer.Browser.Page
   * @param login_user: string
   * @param login_passwd: string
   * @return panel_url: string ログイン実行後のURL
   */
  async login(page, login_user, login_passwd) {
    await page.goto('https://secure.sakura.ad.jp/rscontrol/', {
      waitUntil: 'domcontentloaded'
    });
    // ログイン情報入力
    await page.type('input[name="domain"]', login_user);
    await page.type('input[name="password"]', login_passwd);
    await page.click('input.image');
    // ページ遷移待機: 1秒
    await page.waitFor(1000);
    return page.url();
  },

  /**
   * ログイン後のURLからログイン状態取得
   * @param panel_url: string
   * @return status: string "standard"|"pro"|"failed"
   */
  getLoginStatus(panel_url) {
    const result = panel_url.match(/^https\:\/\/secure\.sakura\.ad\.jp\/rscontrol\/([^\/]+)\/$/);
    if (result === null) {
      return 'failed';
    }
    if (result[1] === 'rs') {
      return 'standard';
    }
    if (result[1] === 'main') {
      return 'pro';
    }
    return 'failed';
  },

  /**
   * 無料SSL（Let's Encrypt）申請
   * @param page: puppeteer.Browser.Page
   * @param panel_url: string
   * @param domain: string
   * @return result: boolean
   */
  async requestSslDomain(page, panel_url, domain) {
    await page.goto(`${panel_url}freessl?SNIDomain=${domain}`, {
      waitUntil: 'domcontentloaded'
    });
    if (false === await page.$('button[type="submit"]').then(res => !!res)) {
      // 申請ボタンがないなら false
      return false;
    }
    // 申請ボタンクリック
    await page.click('button[type="submit"]');
    return true;
  },

  /**
   * 複数ドメインのSSL申請
   * @param page: puppeteer.Browser.Page
   * @param panel_url: string
   * @param domains: array[string]
   * @return results: array[boolean]
   */
  async requestSslDomains(page, panel_url, domains) {
    const results = [];
    for (let i = 0; i < domains.length; ++i) {
      results.push(await this.requestSslDomain(page, panel_url, domains[i]));
    }
    return results;
  },

  /**
   * ロギング設定の変更
   * @param page: puppeteer.Browser.Page
   * @param panel_url: string
   * @param logging: boolean true にした場合、アクセスログとエラーログを両方保存
   * @param rotation: int ログ保存期間（1～24ヶ月）
   * @param hostinfo: boolean true にした場合、ホスト情報もログに記録
   * @return result: boolean
   */
  async changeLogging(page, panel_url, logging = null, rotation = null, hostinfo = null) {
    await page.goto(`${panel_url}logging`, {
      waitUntil: 'domcontentloaded'
    });
    if (logging !== null) {
      await page.click(`input[name="logging"][value="${logging? 1: 0}"]`);
      if (logging) {
        await page.evaluate(() => {
          const element = document.querySelector('input[name="errlog"]');
          if (element !== null) {
            element.value = '1';
          }
        });
      }
    }
    if (rotation !== null && !isNaN(rotation = parseInt(rotation))) {
      if (rotation < 1) {
        rotation = 1;
      }
      if (rotation > 24) {
        rotation = 24;
      }
      await page.select('select[name="month"]', rotation.toString());
    }
    if (hostinfo !== null) {
      await page.click(`input[name="VHost"][value="${hostinfo? 1: 0}"]`);
    }
    // 設定保存ボタンクリック
    await page.click('input.image');
    return true;
  }
}
