import Vue from 'vue';
import Loading from 'vue-loading-overlay';
// IE11/Safari9用のpolyfill
import 'babel-polyfill';

Vue.use(Loading);

new Vue({
  el: "#app",
  delimiters: ["[[", "]]"],
  data() {
    return {
      login_domain: '',
      login_password: '',
      is_processing: false, // Ajax通信中
      screenshot: false,
      error: false
    }
  },
  methods: {
    login() {
      // show loading
      const loader = this.$loading.show();
      this.is_processing = true;
      // reset data
      this.screenshot = false, this.error = false;
      // post api
      axios.post('/api/login', {
        login_domain: this.login_domain,
        login_password: this.login_password
      })
      .then((res) => {
        this.screenshot = res.data.screenshot;
      })
      .catch((err) => {
        this.error = 'さくらインターネットにログインできませんでした\nドメイン名・パスワードをもう一度確認してください';
      })
      .then((res) => {
        // hide loading
        loader.hide();
        this.is_processing = false;
      });
    }
  }
});