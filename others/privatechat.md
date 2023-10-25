---
label: プライベートチャット
authors:
  - name: Nano
    email: nano@un-known.xyz
    link: https://twitter.com/Nano191225
    avatar: /images/nano-icon.png
date: 2023-10-25T23:30
description: プライベートチャットについて
---

`Capi:privatechat` スコアでプライベートチャットを管理します。
プライベートチャットに参加中は通常のチャットを見ることはできますが、送信はできません。
プライベートチャットから退出するにはスコアをリセットしてください。

!!!
スコア 0 はルームとして扱われません。
!!!

#### 例
自分をルーム10に入れる
```
/scoreboard players set @s Capi:privatechat 10
```

ルームから退出する1
```
/scoreboard players reset @s Capi:privatechat
```

ルームから退出する2
```
/scoreaboard players set @s Capi:privatechat 0
```