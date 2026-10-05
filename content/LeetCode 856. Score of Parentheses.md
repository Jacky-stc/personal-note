---
title: LeetCode 856. Score of Parentheses
slug: leetcode-856-score-of-parentheses
category: LeetCode
description: 使用 JavaScript 解 LeetCode 856 Score of Parentheses，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Stack
  - Bracket Sequences
date: 2026-10-05
draft: true
---

## 題目連結

[LeetCode 856. Score of Parentheses](https://leetcode.com/problems/score-of-parentheses/)

## 題目敘述

題目給定一個 Valid Parenthesis String（VPS）`s`，需要返回這個字串的分數。
計分方式：

1. `()` 記為 1 分
2. 如果兩組 `()` 位於同一層，則視為相加，例如 `()()` 記為 2 分
3. 如果 `()` 被包在內層，則記為 `2^（層數 - 1）` 分，例如 `(())` 記為 `2^(2-1)` 也就是 2 分

## 解題思路

這題真的是看懂題目要花半個小時，解題只需要十分鐘，也是看了留言區有人貼的圖才比較清楚題目到底想表達什麼，這裡附上作為參考：
https://leetcode.com/problems/score-of-parentheses/description/comments/3571291/
![[Pasted image 20261005220915.png]]

這一題最重要的點在於，**把一整包的 `()` 視為一個整體做計算**，也就是說，我們在乎的只有層層堆疊之後，**最裡面**的 `()` 到底屬於第幾層，應該要算幾分，當最裡面的 `()` 已經被計算過後，外層就可以不用再計算分數。
所以我們可以透過一個 stack 來記錄目前的 `(` 層數為多少，接著當我們遇到 `)` 的時候，如果他的前一位是 `(` 就表示它屬於當下的最內層，把分數記錄到總和之後就可以把層數 -1，繼續往後做計算。

### 解題步驟

1. 宣告 `depth`、`sum` 來記錄層數以及分數總和
2. 遇到 `(`，層數 +1
3. 遇到 `)`
   1. 如果前一位是 `(`，分數總和加上 `2^(depth-1)`，接著 `depth` -1
   2. 如果不是，就直接 `depth` -1

## JavaScript 實作

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var scoreOfParentheses = function (s) {
  let depth = 0,
    sum = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      depth++
    } else {
      if (s[i - 1] === "(") {
        sum = sum + 2 ** (depth - 1)
      }
      depth--
    }
  }
  return sum
}
```

## 複雜度

- **時間：** `O(n)`
- **空間：** `O(1)`
