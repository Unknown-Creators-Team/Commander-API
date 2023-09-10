---
label: キャンセルメッセージ
icon: x
authors:
  - name: Nano
    email: nano@un-known.xyz
    link: https://twitter.com/Nano191225
    avatar: /images/nano-icon.png
date: 2023-09-10T10:00
description: 特定の条件でメッセージの送信をキャンセルします。
layout: default
---

特定の条件でメッセージの送信をキャンセルします。<br><br>

<div align="center">
<img src="https://user-images.githubusercontent.com/93137582/235956436-21602cfe-a061-47ab-8851-bb3c90c8e7dc.png">

`/function Capi/config`を使用して設定画面を表示

<br>

<img src="https://user-images.githubusercontent.com/93137582/235956629-0043d9e6-e992-4c2c-967f-46374b8d52fa.png">

各々のボタンから設定できます

<div align="left">

!!!warning
文字列と文字列を `, ` で区切る必要があり、文字列に `,` は使用できません。
!!!

==- で始まっているか
指定した文字列から始まるメッセージをキャンセルします。
+++ 1. ?
`?commands` のようなメッセージがキャンセルされます。
+++ 2. !
`!?` のようなメッセージがキャンセルされます。
+++ 3. #
`#hello` のようなメッセージがキャンセルされます。
+++
==-

==- で終わっているか
指定した文字列で終わるメッセージをキャンセルします。
+++ 1. .
`I'm human.` のようなメッセージがキャンセルされます。
+++ 2. !
`HEY!` のようなメッセージがキャンセルされます。
+++
==-

==- が含まれているか
指定した文字列が含まれるメッセージをキャンセルします。
+++ 1. help
`I need your help!`, `.help` のようなメッセージがキャンセルされます。
+++
==-