/**
 * 動作確認
 * @env SAKURA_USER: ログインID
 * @env SAKURA_PASSWD: ログインパスワード
 * @env SAKURA_DOMAIN: SSL申請テストをする場合に指定
 */

const sakura = require('./sakura');

sakura.puppet(
  {
    headless: false, // 画面を表示させる
    slowMo: 3,       // 動作確認のためゆっくり目に動かす
  },
  async page => {
    console.log('ログイン実行');
    const panel_url = await sakura.login(page, process.env.SAKURA_USER, process.env.SAKURA_PASSWD);
    console.log(panel_url, sakura.getLoginStatus(panel_url));
    
    if (process.env.SAKURA_DOMAIN) {
      console.log('------------------');
      console.log('SSL申請');
      console.log(await sakura.requestSslDomain(page, panel_url, process.env.SAKURA_DOMAIN));
    }

    console.log('------------------');
    console.log('ロギング設定');
    console.log(await sakura.changeLogging(page, panel_url, true, 12, true));
  }
);
