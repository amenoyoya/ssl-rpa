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
      is_processing: false, // Ajax通信中
      // メッセージ
      info: '',
      error: '',
      // コンパネログイン用
      login_domain: '',
      login_password: '',
      // SSL申請用
      domains: ['']
    }
  },
  methods: {
    /* 対象ドメイン追加 */
    addDomain() {
      this.domains.push('');
    },

    /* 申請実行 */
    apply() {
      // show loading
      const loader = this.$loading.show();
      this.is_processing = true;
      // reset data
      this.info = '', this.error = '';
      // post api
      axios.post(url_for('api/apply'), {
        login_domain: this.login_domain,
        login_password: this.login_password,
        domains: this.domains
      })
      .then((res) => {
        this.info = res.data.info;
        this.error = res.data.error;
      })
      .catch((err) => {
        this.error = err.response.data.error;
      })
      .then((res) => {
        // hide loading
        loader.hide();
        this.is_processing = false;
      });
    }
  }
});