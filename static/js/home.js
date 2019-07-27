/**
 * home page javascript
 */
const app = new Vue({
  el: '#app',
  delimiters: ["[[", "]]"],
  data() {
    return {
      login_domain: '',
      login_password: '',
      screenshot: false,
      error: false
    }
  },
  methods: {
    login() {
      this.screenshot = false, this.error = false;
      axios.post('/api/login', {
        login_domain: this.login_domain,
        login_password: this.login_password
      })
      .then(() => {
        this.screenshot = res.data.screenshot;
      })
      .catch(() => {
        this.error = 'さくらインターネットにログインできませんでした\nドメイン名・パスワードをもう一度確認してください';
      });
    }
  }
});
