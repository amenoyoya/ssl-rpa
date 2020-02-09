/**
 * /api/
 */
const express = require('express');
const router = express.Router();
const sakura = require('./sakura');

/**
 * POST / == /api/
 * @request {
 *   login_user: string,
 *   login_passwd: string,
 *   ssl_target_domains: array[string],
 *   logging: {
 *     log: boolean,
 *     rotation: integer (1 - 24),
 *     hosts: boolean
 *   }
 * }
 * @response {
 *   login_result: "standard"|"pro"|"failed",
 *   ssl_results: array[boolean],
 *   logging_result: boolean
 * }
 */
router.post('/', async (req, res) => {
  const response = {};

  await sakura.puppet(
    // Dockerで動かすとき用のオプション
    process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD?
      {executablePath: '/usr/bin/chromium-browser', args: ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']}
      : {args: ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']},
    async page => {
      if (req.body.login_user && req.body.login_passwd) {
        // ログイン
        const panel_url = await sakura.login(page, req.body.login_user, req.body.login_passwd);
        response.login_result = sakura.getLoginStatus(panel_url);
        // SSL申請
        if (Array.isArray(req.body.ssl_target_domains)) {
          response.ssl_results = await sakura.requestSslDomains(page, panel_url, req.body.ssl_target_domains);
        }
        // ロギング設定
        if (typeof req.body.logging === 'object') {
          response.logging_result = await sakura.changeLogging(
            page, panel_url, req.body.logging.log, req.body.logging.rotation, req.body.logging.hosts
          );
        }
      }
    }
  );
  res.json(response);
})

// export
module.exports = router;
