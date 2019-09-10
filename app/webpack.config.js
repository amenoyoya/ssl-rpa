const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production', // 開発: development, 本番: production
  entry: './src/home.js', // コンパイルのエントリーポイントファイル
  // 出力先パス（絶対パス指定）
  output: {
    path: path.join(__dirname, 'static', 'js'),
    filename: 'home.js'
  },
  module: {
    // コンパイル設定
    rules: [
      {
        // .js ファイル
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader', // babel-loader で ECMAScript5 にトランスコンパイル
            options: {
              presets: ['@babel/preset-env']　// ブラウザ環境に合わせて自動的にコンパイル
            }
          }
        ]
      },
      {
        // .vue ファイル
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader', // vue-loader で Vueコンポーネントファイルをコンパイル
            options: {
              loaders: {
                js: ['babel-loader'] // .vue ファイル内の script タグを babel-loader でトランスコンパイル
              },
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  },
  // import設定
  resolve: {
    extensions: [".js", ".vue"], // .js, .vue を import
    modules: ["node_modules"],
    alias: {
      vue$: 'vue/dist/vue.esm.js', // vue-template-compiler用
    },
  },
  plugins: [new VueLoaderPlugin()]
};