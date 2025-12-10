# Contributing to Commander-API
Commander-APIへの貢献に興味を持っていただき、ありがとうございます！  
このページでは、Commander-APIへ貢献する方法について記されています。  
読み進める前に、以下のページを閲覧しておくことをオススメします。  
[OSSに貢献するときの心得](https://zenn.dev/kyome/articles/1259c94ad576ca)  

## はじめに。
### 環境
開発には以下のプログラムが必要です。
- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com/)

### インストール
1. リポジトリをクローンします。
```bash
git clone https://github.com/Unknown-Creators-Team/Commander-API.git
```

2. 依存関係をインストールします。  
開発に必要な型定義ファイルやTypeScriptの開発環境をインストールします。
```bash
npm install
```

### 開発
開発に使用される主なスクリプトは以下の2つです。
- `npm run watch`: `src`の変更を検知し、`scripts`へコンパイル結果を保存します。
- `npm run build`: `scripts`をリセットし、コンパイルを行います。

## 貢献する方法
### 問題の報告
バグや機能リクエストがある場合は[Commander API Community](https://discord.gg/uTqyqtHWG4)にて行うようにしてください。

### 機能の開発 (バグ修正を含む)
1. あなたのリポジトリを最新の状態に更新してください。
```bash
git pull
```

2. ブランチを変更してください。  
開発には `alpha` ブランチを使用します。
```bash
git switch alpha
```

3. TypeScriptコンパイラを起動する  
Commander-APIではTypeScriptを使用しています。  
```bash
npm run watch
```

4. (必要であれば) Minecraft Debuggerを起動する  
もしあなたがVisual Studio Codeで開発をしているならば、Minecraft Debuggerを使用できます。  
Minecraft Debuggerを用いて開発をすると、ファイル更新時の自動リロードを使えたり、エラーログがVSCodeに表示され、開発効率がアップするでしょう。  
![Debugger](.github/img/debugger.png)  
起動できたら、Minecraftで以下のコマンドを実行します。
```bash
/script debugger connect
```

5. **開発する**  
バグの原因となりうる `as any` などは使わないようにしましょう。  
6. **テストを実行する**  
Commander-APIには[テスト機能](https://capi.un-known.xyz/docs/ScriptEvent/test)が存在します。  
このテスト機能を用いることで、既存の機能が正しく動いているかを確認できます。  
開発をし終わったなら、このテストを実行し問題がないかを確認してください。
7. **コミット/プッシュする**  
おつかれさまでした。  
あなたが書いたコードは開発者によってレビューされ、問題がないと判断されたら`stable`にプッシュされます。

### コードスタイル
Minecraft内で用いる識別子には [`sneak_case`](https://developer.mozilla.org/ja/docs/Glossary/Snake_case) を使用します。  
コード内で用いる変数名などには [`camelCase`](https://developer.mozilla.org/ja/docs/Glossary/Camel_case) を使用します。
`URL`や`ID`などの頭字語は `Url` を使用します。

## バージョン表記
`x.y.z`
- **x** 大規模アップデート時にアップします。
- **y** Minecraftのアップデート対応時にアップします。
- **z** バグ修正等の場合にアップします。

## その他
- バージョンアップの際は `manifest.json` や `functions/capi/version.mcfunction` を変更することを忘れないでください。
