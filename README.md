<div align="center">

  <br />
    <p>
     <img src="https://user-images.githubusercontent.com/93137582/235931240-477c3429-2f9e-4619-a4c4-4f6692d7dc5c.png" width="300" alt="Commander API"/></a>
    </p>

**統合版のコマンドを大幅に拡張するアドオン**
# Commander API
<div align="left">

「Commander API」は、Minecraftの統合版用アドオンで、既存のコマンドを大幅に拡張します。
このアドオンは、他のアドオンとの重複を避ける設計になっており、他のアドオンと併用することができます。また、公式のWikiが用意されており、使い方や機能についての情報を簡単に参照することができます。
「Commander API」を使用することで、Minecraftのゲームプレイをカスタマイズすることができます。例えば、拡張されたコマンドを使用することで、より複雑なシステムを作成したり、ゲームプレイを改善したりすることができます。また、より効率的に作業することができるようになります。

## Commander APIの機能
### Methods
* プレイヤーにformを表示する
* プレイヤーを追放する
* プレイヤーをkillする(クリエイティブモード含む)
* プレイヤーのネームタグを変更する
* プレイヤーのネームタグをリセットする
* 複数のコマンドを実行する
* カスタムされたアイテムをgiveする
* プレイヤーにtellする
* プレイヤーが選択中のスロットを変更する
### Events
* 送信されたチャットを受け取る
* ブロックの破壊を受け取る
* ブロックの設置を受け取る
* ボタンを押したことを受け取る
* エンティティが死んだ/倒したことを受け取る
* エンティティを攻撃したことを受け取る
* ダメージを受けた/与えたことを受け取る
* アイテムの使用を受け取る
* アイテムの設置を受け取る
* ワールドに入ったことを受け取る
* 投げ物が当たったことを受け取る
* プレイヤーの体力を受け取る
* X/Y/Z座標を受け取る
* X/Y視点を受け取る
* 選択中のスロットを受け取る
* 現在のUNIXタイムスタンプを受け取る
* ディメンションを受け取る
* X/Y/Z/XZ/XYZスピードを受け取る
* OPを持っているかを受け取る
* スニークしたかを受け取る
### Script Events
* Coming soon
### Config
* Coming soon

## セットアップ
① [リリース](https://github.com/191225/Commander-API/releases)からバージョンを選択し、`.mcpack`をダウンロードしてください。([最新のリリース](https://github.com/191225/Commander-API/releases/latest))<br>
② `.mcpack`をそのままマインクラフトにインポートしてください。(インポートの方法は解説しません)<br>
③ Commander APIをワールドに適用しワールドを開く。<br>
④ `/function Capi_setup`を実行し、セットアップをする。<br>
⑤ `/function Capi_config`で設定する。(オプション)

## Wiki
Commander APIには機能が分かりやすく解説されたWikiがあります！<br>
作成例もあるのでぜひ参照してください！<br>
[Wikiを見る](https://github.com/191225/Commander-API/wiki/Home)
