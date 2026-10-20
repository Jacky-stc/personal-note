---
title: "手作 Object.groupBy()：Iterable、PropertyKey 與 TypeScript 泛型"
slug: implement-object-groupby-typescript
category: JavaScript
description: "從 Iterable、callback 索引、PropertyKey 與 null-prototype 物件出發，說明以 TypeScript 手作 Object.groupBy() 的型別設計與實作細節。"
tags:
  - JavaScript
  - TypeScript
  - Object.groupBy
  - Generics
date: 2026-10-19
draft: false
---

## `Object.groupBy()`

```ts
function myGroupBy<T, K extends PropertyKey>(
  items: Iterable<T>,
  cb: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = Object.create(null)
  let index = 0

  for (const item of items) {
    const key = cb(item, index)
    result[key] ??= []
    result[key].push(item)
    index++
  }

  return result
}
```

原本以為這題不會到太難，但看了 MDN 裡面實際原生 API 的定義之後，才發現實在有太多需要注意和特別做處理的地方了。

1. **為什麼 `items` 的 type 不是 `T[]`？**

   因為原生的 `Object.groupBy()` 本來就沒有限定必須傳入 Array，而是一個 iterable，像是 `Set`，所以必須要是 `Iterable<T>`

   > An iterable (such as an Array) whose elements will be grouped.

   而於此同時，callback function 又必須要支援 index，所以我們必須自己處理和維護這個 index

   ```ts
   let index = 0

   for (const item of items) {
     const key = cb(item, index)
     result[key] ??= []
     result[key].push(item)
     index++
   }
   ```

2. **為什麼要用 `PropertyKey`？**

   JavaScript object 的 property key 其實只有 `string | symbol`，但是在 TypeScript 裡面的定義是：

   ```ts
   type PropertyKey = string | number | symbol
   ```

   而實際上當我們使用 number 做為 object 的 key，他也會被自動轉型成 string

   ```js
   const obj = {}
   obj[1] = "test"
   Object.keys(obj) // ["1"]
   ```

   因此這裡使用 `PropertyKey` 只是為了讓他更方便、通用而已。

3. **為什麼要用 `Object.create(null)`？**

   假設我們這樣子宣告：

   ```js
   const result = {}
   ```

   然後我們呼叫這個函式

   ```js
   const result = myGroupBy(["test"], () => "constructor")
   ```

   會有一個問題是在原本的 object prototype 中，本來就已經存在 `constructor` 了，所以如果你後面再去檢查 `result['constructor']` 就可能跟原本 prototype 裡面的 property 產生衝突。如果我們只是想要把 object 當作純 dictionary 的話就可以使用

   ```ts
   Object.create(null)
   ```

   來確保他沒有任何 prototype。MDN 裡面關於 `Object.groupBy()` 的 return value 寫的也是

   > `A null-prototype object with properties for all groups, each assigned to an array containing the elements of the associated group.`

4. **為什麼需要另外一個 generic type `K`？**

   如果我們單純把 callback function 的 return type 設定成 `PropertyKey`，可能會有一點太寬，假設我們今天傳入的參數長這樣：

   ```ts
   const result = myGroupBy(products, (product) => {
     return product.size > 10 ? "big" : "small"
   })
   ```

   透過 `K extends PropertyKey`，TypeScript 可以自行推導

   ```ts
   K = "big" | "small"
   ```

   比起原本的

   ```ts
   Record<string, T[]>
   ```

   會更精確一點。

## 參考資料

[MDN：Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)
