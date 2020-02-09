# ssl-rpa

## What's this?

さくらインターネットで自動的にSSL証明書をインストールするツール

***

## Setup (local version)

### Environment
- **開発環境**
    - OS: Ubuntu 18.04 LTS
    - Node.js: `10.15.3`
        - yarn: `1.16.0`
    - Python: `3.7.3`
        - Selenium: `3.141.0`
        - Flask: `1.1.1`
    - Google Chrome: `75.0`
- **サーバー環境**
    - OS: CentOS 7
    - nginx: `1.16.0`
    - Python: `3.6.5`
        - Selenium: `3.141.0`
        - Flask: `1.1.1`
        - uWSGI: `2.0.18`
    - Google Chrome: `75.0`

### Prepare development environment
```bash
# install python packages
$ pip install -r requirements.txt

# change executable chromedriver's permission
$ chmod 755 ./driver/chromedriver

# install node packages
$ yarn install

# run webpack in watch mode (auto compile ./src/home.js)
$ yarn start
```

### Prepare server environment
```bash
# --- Install nginx ---
$ sudo rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
$ sudo yum -y update nginx-release-centos
$ sudo yum -y --enablerepo=nginx install nginx

# confirm version
$ nginx -v
nginx version: nginx/1.16.0

# register nginx service
$ sudo systemctl enable nginx.service

# start nginx
$ sudo systemctl start nginx.service


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

# install python packages
$ pip install -r requirements.txt


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
Google Chrome 75.0.3770.142


# --- Setup web server ---
# run uwsgi
$ uwsgi --ini uwsgi.ini &

# copy nginx config file
$ sudo cp ssl-rpa.conf /etc/nginx/conf.d/

# set your server settings
$ sudo vim /etc/nginx/conf.d/ssl-rpa.conf
## => ...

# restart nginx
$ sudo systemctl restart nginx.service
```

***

## Setup (Docker version)

### Docker
- **web** container:
    - localhost:
        - http://localhost:3333
        - http://ssl-rpa.localhost (need nginx-proxy)
    - From: `nginx:1.17-alpine`
    - Nginx server
        - port forward => docker://flask:1000
- **flask** container:
    - From: `python:3.7-slim`
    - Python: `3.7`
        - Flask: Micro web framework
        - Selenium: Headless browser controller
    - uWSGI: WSGI server (connect: Web server and Python + Flask)

### Execution
```bash
# build and execute docker containers
$ docker-compose build
$ docker-compose up -d
```

***

## Design

- さくらインターネット｜コンパネ｜ログイン: https://secure.sakura.ad.jp/rscontrol
    - ドメイン名: `//input[@name="domain"]`
        - 登録ドメイン名入力
    - パスワード: `//input[@name="password"]`
        - 登録パスワード入力
    - 送信（ログイン）: `//input[@class="image"]`
- コンパネルート:
    - 標準プラン: https://secure.sakura.ad.jp/rscontrol/rs
    - PROプラン: https://secure.sakura.ad.jp/rscontrol/main
- ドメイン一覧: /domain
- SSL証明書登録: /ssl-entry?SNIDomain=<ドメイン名>
    - 無料SSL証明書（Let's Encrypt）: /freessl?SNIDomain=<ドメイン名>
    - 有料SSL証明書: /ssl-select?Domain=<ドメイン名>
    - SSL証明書詳細: /ssl?Domain=<ドメイン名>

### 無料SSL証明書登録自動化
- 無料SSL証明書（Let's Encrypt）: /freessl?SNIDomain=<ドメイン名>
    - 申請ボタン: `//button[@type="submit"]`

### 独自SSL証明書インストール自動化
- 目的:
    - さくら以外の認証局からSSL認証をしてもらった場合の証明書インストール自動化（SNI SSL）
- 条件:
    - SSL証明書および中間証明書を発行済
- 登録画面（使わない）: /ssl?SNIDomain=<ドメイン名>
- 証明書のインストール: /ssl?Install=1&SNIDomain=<ドメイン名>
    - 入力ボックス: `//textbox[@name="Cert"]`
        ```ssl
        -----BEGIN CERTIFICATE-----
        RandomText
        -----END CERTIFICATE-----
        ```
    - 送信ボタン: `//input[@name="Submit_install"]`
        - => 成功した場合: /ssl?SNIDomain=<ドメイン名> に遷移
- 中間証明書のインストール: /ssl?CACert=1&SNIDomain=<ドメイン名>
    - 入力ボックス: `//textbox[@name="Cert"]`
        ```ssl
        -----BEGIN CERTIFICATE-----
        RandomText
        -----END CERTIFICATE-----
        ```
    - 送信ボタン: `//input[@name="Submit_cacert"]`
        - => 成功した場合: /ssl?SNIDomain=<ドメイン名> に遷移

### ログ設定自動化
- アクセスログの設定: /logging
    - アクセスログの保存設定:
        - 残す: `//input[@name="logging" and @value="1"]`
            - エラーログも残す（チェックボックス）: `//input[@name="errlog"]`
        - 残さない: `//input[@name="logging" and @value="0"]`
    - アクセスログの保存期間: `//select[@name="month"]` => option: 1-24
    - ホスト名の情報:
        - 残す: `//input[@name="VHost" and @value="1"]`
        - 残さない: `//input[@name="VHost" and @value="0"]`
    
