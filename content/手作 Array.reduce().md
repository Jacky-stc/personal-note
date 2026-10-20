---
title: "手作 Array.reduce()：初始值與稀疏陣列處理"
slug: implement-array-reduce-typescript
category: JavaScript
description: "以 TypeScript 手作 Array.reduce()，整理初始值與 accumulator 的型別、稀疏陣列中 hole 和 undefined 的差異，以及跳過空洞的實作細節。"
tags:
  - JavaScript
  - TypeScript
  - Array.reduce
  - Sparse Array
date: 2026-10-20
draft: false
---

跟之前的手刻 Object.groupBy() 一樣，本來以為不會到太困難，沒想到寫完之後才發現全是坑，有好多需要注意的地方：

- Array 和 initialValue 的 type definition
- 怎麼處理 Sparse Array
- Hole 跟 undefined 的差別
- 沒有 initialValue 的時候怎麼定 accumulator

先看完整的程式碼：

```ts
function myReduce<T>(items: T[], cb: (acc: T, curr: T, index: number, arr: T[]) => T): T
function myReduce<T, K>(
  items: T[],
  cb: (acc: K, curr: T, index: number, arr: T[]) => K,
  initialValue: K,
): K
function myReduce<T, K>(
  items: T[],
  cb: (acc: T | K, curr: T, index: number, arr: T[]) => T | K,
  initialValue?: K,
): T | K {
  const hasInitialValue = arguments.length >= 3
  const length = items.length

  let acc: T | K
  let index = 0

  if (hasInitialValue) {
    acc = initialValue as K
  } else {
    while (index < length && !(index in items)) {
      index++
    }

    if (index >= length) {
      throw new TypeError("Reduce of empty array with no initial value")
    }

    acc = items[index]
    index++
  }

  for (; index < length; index++) {
    if (!(index in items)) {
      continue
    }

    acc = cb(acc, items[index], index, items)
  }

  return acc
}
```

開始迭代前先記錄陣列長度，因此 callback 期間新加入的元素不會在這次 `reduce` 中被處理。

## 為什麼需要 T、K 兩個 generic type？

雖然在大部分的情況下 array 和 initial value 的 type 會是一樣的，但是原生的 `array.reduce()` 是有支援兩個 type 不同還是能正常運作
例如：

```js
const result = [1, 2, 3].reduce((acc, curr) => acc + curr, "10")
// result 為 "10123"
```

所以我們一樣保留這個彈性。透過 overload 分別描述有無 `initialValue` 的情況，讓回傳型別能正確對應到 accumulator。

## 怎麼處理 Sparse Array (稀疏陣列)？

這是這整個題目最重要也最容易被忽略的地方，所有特別作處理的地方幾乎都是為了避免遇到 Sparse Array。

> #### 什麼是 Sparse Array？

意思是在這個陣列當中有某個位置是 **empty** 的，他還是會算作 array 的長度，但他就是一個空洞 (hole)。
下面兩個 array 都屬於 Sparse Array：

```js
const arr = [1, , 2, 3]

const arr2 = Array(3)
// [ , , ]
```

> #### Hole 跟 undefined 的差異

在 Sparse Array 中，hole 跟 undefined 其實有很多很相似的地方，但是他們並不等價，所以我們不能直接用

```js
if(items[i] === undefined)
```

來判斷這個 index 是不是一個 hole。

```js
const a = [undefined]
const b = Array(1)

a.length // 1
b.length // 1

a[0] // undefined
b[0] // undefined

0 in a // true
0 in b // false
```

我們需要判斷的是這一個的 property 存不存在，而不是它等不等於 undefined。
用另一個比較直觀的例子：

```js
const arr = [1, undefined, 2]
arr.reduce((a, b) => a + b, "0")
// "01undefined2"
```

這裡的 undefined 是真的要加上去的東西所以不能被跳過。

> #### 怎麼處理

介紹完 Sparse Array 就可以來看要怎麼處理，首先是 accumulator 的值，如果沒有提供 initial value 的話，我們可以一直檢查 `index in items` 來找到第一個存在 property 的格子，當作起始 index：

```js
while (index < length && !(index in items)) {
  index++
}
```

接下來是 callback function 的處理，每次要進 callback function 之前都先檢查這個 index 是不是 hole，是的話就直接跳過：

```js
for (; index < length; index++) {
  if (!(index in items)) {
    continue
  }

  acc = cb(acc, items[index], index, items)
}
```

## 參考資料

[MDN：Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
