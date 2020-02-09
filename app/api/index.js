/**
 * /api/
 */
const express = require('express');
const router = express.Router();

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
 *   login: "standard"|"pro"|"failed",
 *   ssl_results: array[boolean],
 *   logging_result: boolean
 * }
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Hello, Express!'
  });
})

// export
module.exports = router;
