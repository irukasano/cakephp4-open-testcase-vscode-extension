# CakePHP4 open TestCase

## Features

CakePHP4 では src/Controller 配下のクラスのテストケースは tests/TestCase/Controller にあります。
テストケースの命名ルールがきちんと決まっているのに、実装のたびにいちいちファイル名を指定して開くのは面倒なので、
`> Open TestCase` でテストケースを２番目のエディタグループで下に開くようにしました。

また、テストケースで`> Open Fixture` とすると、`protected $fixtures` で定義されている Fixture を
選択して開くことができます。これも２番目のエディタグループで下に開きます。

## Contribution

https://github.com/irukasano/cakephp4-open-testcase-vscode-extension

## Release Notes

### 1.0.6

* 二回目以降の `Open TestCase` の挙動がおかしかったので修正

### 1.0.5

* `Open Fxiture` を追加

### 1.0.4

* Fixture も下に表示するように修正

### 1.0.3

* TestCase 開いたときにうまく下に移動しない場合があるのを修正

### 1.0.2

* TestCase がエディタグループ２で開いたあとすぐに閉じてしまう問題を修正した

### 1.0.1

* TestCase はエディタグループ２で、下に開くようにした
* エディタグループ２がある状態で、TestCase を開くときにエディタグループ１にフォーカスがあっても、エディタグループ２に開くようにした
* TestCase でなければエディタグループ１に開くようにした

### 1.0.0

Initial release.
