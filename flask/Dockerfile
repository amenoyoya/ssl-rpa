FROM python:3.7-slim

# 作業ディレクトリを変数`project_dir`に格納
ARG project_dir=/var/www/app

# 必要なファイルをコンテナ内のプロジェクトディレクトリにコピー
COPY ./requirements.txt ${project_dir}/requirements.txt
COPY ./chromedriver76   ${project_dir}/driver/chromedriver

WORKDIR $project_dir

# install
RUN apt-get update && apt-get install -y gcc wget gnupg && \
    : 'Install Google Chrome' && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add && \
    echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    : 'requirements.txtに記載されたパッケージをインストール' && \
    pip install --upgrade pip && pip install -r requirements.txt && \
    : 'chrome driver の実行権限付与' && \
    chmod +x ./driver/chromedriver
