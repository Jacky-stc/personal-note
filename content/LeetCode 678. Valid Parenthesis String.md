---
title: LeetCode 678. Valid Parenthesis String
slug: leetcode-678-valid-parenthesis-string
category: LeetCode
description: 使用 JavaScript 解 LeetCode 678 Valid Parenthesis String，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Dynamic Programming
  - Stack
  - Greedy
  - Bracket Sequence
date: 2026-10-05
draft: false
---

## 題目連結

[LeetCode 678. Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string/)

## 題目敘述

函式會輸入一個字串 `s`，`s` 只會包含 `(`、`)`或是 `*`，`*` 可以被任意當作 `(`、`)`或是空字串 `""` 使用，需要判定輸入的字串 `s` 是否為 Valid Parenthesis String（VPS），而 VPS 的定義是：

1. 所有的 `(` 都有相對應的 `)`
2. 所有的 `)` 都有相對應的 `(`

若字串 `s` 為 VPS 就返回 `true`，反之為 `false`

## 解題思路 1：Stack

這題可以用兩種解法來解，第一個先介紹 Leetcode hint 所提示的，使用兩個 stack 來解的方式。
我們可以先分別創建兩個 stack 用來記錄還沒配對的 `(` 以及 `*` 的 `index`，第一次的迴圈我們只需要判定所有的 `)` 是否都有相對應的 `(`，有的話就從 `(` 的 stack 中移除，如果不夠的話就使用 `*` 的 stack，同樣使用完也從 stack 中移除。
接下來第二個迴圈我們來處理第一個 stack 中剩下未配對的 `(`，這裡只有當 `*` 的 index 比 `(` 的還要大，我們才能把它當作合法的 `)` 來使用

### 解題步驟

1. 創建 `(` index stack 以及 `*` index stack
2. 配對所有的 `)`
3. 處理未配對的 `(`

## JavaScript 實作

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var checkValidString = function (s) {
  const leftStack = []
  const starStack = []

  // 第一階段：處理每個 ')'
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      leftStack.push(i)
    } else if (s[i] === "*") {
      starStack.push(i)
    } else {
      // s[i] === ')'
      if (leftStack.length > 0) {
        leftStack.pop()
      } else if (starStack.length > 0) {
        // 把較早出現的 '*' 當成 '('
        starStack.pop()
      } else {
        // 沒有 '(' 或 '*' 可以配對這個 ')'
        return false
      }
    }
  }

  // 第二階段：用剩餘的 '*' 配對剩餘的 '('
  while (leftStack.length > 0 && starStack.length > 0) {
    const leftIndex = leftStack.pop()
    const starIndex = starStack.pop()

    // '*' 必須在 '(' 後面，才能把它當成 ')'
    if (leftIndex > starIndex) {
      return false
    }
  }

  // 還有未配對的 '('，代表 '*' 不夠
  return leftStack.length === 0
}
```

## 複雜度

- **時間：** `O(n)`
- **空間：** `O(n)`

## 解題思路 2：Min & Max

第二種解法相對較為抽象一點，我們可以先宣告兩個變數 `min`、`max`，起始值為 `0`，並且我們把遇到 `(` 的事件視為 +1，遇到 `)` 的事件視為 -1，重點在於 `*`，由於他有可能是 `(` 或是 `)`，所以我們需要同時對 `min` 去做 -1 以及 `max` 做 +1，因此 `min` 與 `max` 所代表的意義是：如果我們把所有 `*` 都視為 `(` 或是 `)` 的話，分數會是多少？接下來需要關注的點有兩個：

#### Max的值

- `max < 0`，那只有一種可能，`)` 的數量已經超過當下左側 `(` 所能負荷的數量了，因此直接返回 `false`
- `max > 0`，暫時不理他

#### Min的值

- `min < 0`，在 `min < 0` 但是 `max > 0` 的情況，表示我們把太多的 `*` 當作 `)` 來使用，所以我們只需要把 `min` 的值拉回成 `0` 即可，這個動作的意思是我們把剛剛假設成 `)` 的 `*` 以 `(` 來替代
- `min > 0`，如果到了最後迴圈已經走完，但是 `min > 0` 的話，表示整個字串中包含了太多的 `(`，因此返回 `false`

## JavaScript 實作

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var checkValidString = function (s) {
  let min = 0,
    max = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      min++
      max++
    } else if (s[i] === ")") {
      min--
      max--
    } else if (s[i] === "*") {
      min--
      max++
    }

    if (max < 0) return false
    min = Math.max(min, 0)
  }
  return min === 0
}
```

## 複雜度

- **時間：** `O(n)`
- **空間：** `O(1)`
