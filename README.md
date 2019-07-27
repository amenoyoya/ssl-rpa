# ssl-rpa

## What's this?

さくらインターネットで自動的にSSL証明書をインストールするツール

***

## Setup

### Environment
- OS: Ubuntu 18.04 LTS
- Python: `3.7.3`
    - Selenium: `3.141.0`
- Google Chrome: `75.0`

### Prepare
```bash
# install python packages
$ pip install -r requirements.txt

# change executable chromedriver's permission
$ chmod 755 ./driver/chromedriver75
```
