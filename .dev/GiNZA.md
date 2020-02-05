# GiNZAを用いた自然言語処理

## GiNZAについて

- リクルートのAI研究機関であるMegagon Labsと国立国語研究所との共同研究成果の学習モデルを用いた自然言語処理ライブラリ
- ワンステップでの導入、高速・高精度な解析処理、単語依存構造解析レベルの国際化対応などの特長を備えた日本語自然言語処理オープンソースライブラリ
- 最先端の機械学習技術を取り入れた自然言語処理ライブラリ「spaCy」をフレームワークとして利用
- オープンソース形態素解析器「SudachiPy」を内部に組み込み、トークン化処理に利用
- 「GiNZA日本語UDモデル」にはMegagon Labsと国立国語研究所の共同研究成果が組み込まれている

***

## Environment

- OS:
    - Ubuntu 18.04
        - Windows 環境では GiNZA のビルドが上手くいかない
        - Windows 環境で行う場合は、VMware 等に Ubuntu をインストールして行う
            - `jupyter notebook --ip=* --no-browser` でホスト―ゲスト間通信可能な Jupyter Notebook を実行可能
- Python:
    - 3.6.10 (Anaconda: 4.7.12)
    - Jupyter Notebook

### Installation
```bash
# install: GiNZA
$ pip install ginza

# install: Matplotlib (グラフ描画用)
$ conda install matplotlib

# install: Scikit-Learn (機械学習用)
$ conda install scikit-learn
```
