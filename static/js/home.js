/**
 * home page javascript
 */
const app = new Vue({
  el: '#app',
  delimiters: ["[[", "]]"],
  data() {
    return {
      screenshot: false,
      error: false
    }
  },
  methods: {
    async runTest() {
      const res = await axios.get('/api/test');
      if (res.status === 200) {
        this.screenshot = res.data.screenshot
      } else {
        this.error = 'APIの実行に失敗しました'
      }
    }
  }
});
