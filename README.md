# CakePHP4 open TestCase

## Features

CakePHP4 では src/Controller 配下のクラスのテストケースは tests/TestCase/Controller にあります。
テストケースの命名ルールがきちんと決まっているのに、実装のたびにいちいちファイル名を指定して開くのは面倒なので、
`> Open TestCase` でテストケースを別のエディタグループで開くようにしました。

## Release Notes

### 1.0.1

* TestCase はエディタグループ２で、下に開くようにした
* エディタグループ２がある状態で、TestCase を開くときにエディタグループ１にフォーカスがあっても、エディタグループ２に開くようにした
* TestCase でなければエディタグループ１に開くようにした

### 1.0.0

Initial release.
