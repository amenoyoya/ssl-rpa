# ssl-rpa

## What's this?

さくらインターネットで自動的にSSL証明書をインストールするツール

***

## Setup

### Environment
- **開発環境**
    - OS: Ubuntu 18.04 LTS
    - Python: `3.7.3`
        - Selenium: `3.141.0`
        - Flask: `1.1.1`
    - Google Chrome: `75.0`
- **サーバー環境**
    - OS: CentOS 7
    - Python: `3.6.5`
        - Selenium: `3.141.0`
        - Flask: `1.1.1`
    - Google Chrome: `75.0`

### Prepare development environment
```bash
# install python packages
$ pip install -r requirements.txt

# change executable chromedriver's permission
$ chmod 755 ./driver/chromedriver75
```

### Prepare server environment
```bash
# --- Install Python ---
# install required modules
$ sudo yum update -y && yum upgrade
$ sudo yum install -y gcc gcc-c++ make git openssl-devel bzip2-devel zlib-devel r sqlite-devel openssl-devel

# make pyenv from github
$ sudo chown -R <user> /usr/local/src/
$ git clone https://github.com/yyuu/pyenv.git /usr/local/src/pyenv
$ echo 'export PYENV_ROOT="/usr/local/src/pyenv"' | sudo tee /etc/profile.d/pyenv.sh
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' | sudo tee /etc/profile.d/pyenv.sh
$ echo 'eval "$(pyenv init -)"' | sudo tee /etc/profile.d/pyenv.sh
$ exec $SHELL –l # シェル再起動

# install python 3.6.5
$ pyenv install 3.6.5
$ pyenv global 3.6.5

# confirm version
$ pyenv versions
  system
* 3.6.5 (set by /usr/local/src/pyenv/version)


# --- Install Google Chrome ---
# install google chrome
$ sudo tee /etc/yum.repos.d/google-chrome.repo << EOS
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
EOS

$ sudo yum install -y google-chrome-stable

# cofirm google-chrome version
$ google-chrome --version
## => Google Chrome 75.0.3770.142 
```

***

## Design

- さくらインターネット｜コンパネ｜ログイン: https://secure.sakura.ad.jp/rscontrol
    - ドメイン名: `//input[@name="domain"]`
        - 登録ドメイン名入力
    - パスワード: `//input[@name="password"]`
        - 登録パスワード入力
    - 送信（ログイン）: `//input[@class="image"]`
- ドメイン一覧: https://secure.sakura.ad.jp/rscontrol/rs/domain
- SSL証明書登録: https://secure.sakura.ad.jp/rscontrol/rs/ssl-entry?SNIDomain=<ドメイン名>
    - 無料SSL証明書（Let's Encrypt）: https://secure.sakura.ad.jp/rscontrol/rs/freessl?SNIDomain=<ドメイン名>
    - 有料SSL証明書: https://secure.sakura.ad.jp/rscontrol/rs/ssl-select?Domain=<ドメイン名>
    - SSL証明書詳細: https://secure.sakura.ad.jp/rscontrol/rs/ssl?Domain=<ドメイン名>

### 無料SSL証明書登録自動化
- 無料SSL証明書（Let's Encrypt）: https://secure.sakura.ad.jp/rscontrol/rs/freessl?SNIDomain=<ドメイン名>
    - 申請ボタン: `//button[@type="submit"]`
