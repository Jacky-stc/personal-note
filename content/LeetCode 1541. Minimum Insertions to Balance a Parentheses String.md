---
title: LeetCode 1541. Minimum Insertions to Balance a Parentheses String
slug: leetcode-1541-minimum-insertions-to-balance-a-parentheses-string
category: LeetCode
description: 使用 JavaScript 解 LeetCode 1541 Minimum Insertions to Balance a Parentheses String，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Stack
  - Bracket Sequences
  - Greedy
date: 2026-10-11
draft: false
---

## 題目連結

[LeetCode 1541. Minimum Insertions to Balance a Parentheses String](https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/)

## 題目敘述

題目給予一個只包含 `(` 和 `)` 的字串 `s`，如果要讓字串達到 balanced 的狀態，需要滿足以下條件：

1. 所有的 `(` 都必須有相對應的 `))`，且兩個 `)` 必須要是連續出現的
2. 以相對應的 `())` 來說，`(` 必須要出現在 `))` 的前面
   你可以在任意位置插入 `(` 或是 `)`，需要試著找出最小的插入數量讓字串 `s` 達到 balanced。

> **Example 1:**
> **Input:** s = "(()))"
> **Output:** 1
> **Explanation:** The second '(' has two matching '))', but the first '(' has only ')' matching. We need to add one more ')' at the end of the string to be "(())))" which is balanced.

> **Example 2:**
> **Input:** s = "())"
> **Output:** 0
> **Explanation:** The string is already balanced.

> **Example 3:**
> **Input:** s = "))())("
> **Output:** 3
> **Explanation:** Add '(' to match the first '))', Add '))' to match the last '('.

## 解題思路

我們可以先宣告一個 `left` 來保存 `(` 的數量，每當我們遇到 `)` 的時候，我們就可以去判斷以下的情境：

- 他的下一位也是 `)`，那我們就可以跳過下一個循環，將兩個 `)` 視為一組
  - 有多餘的 `(`，將其進行配對並且 `(` 數量減一
  - 沒有多餘的 `(`，表示我們要額外補一個在左側，插入數量加一
- 他的下一位不是 `)`
  - 有多餘的 `(`，表示我們只要補一個 `)` 即可，插入數量加一，`(` 數量減一
  - 沒有多餘的 `(`，表示我們需要補一個 `(` 和一個 `)`，插入數量加二

## JavaScript 實作

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minInsertions = function (s) {
  let left = 0,
    result = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      left++
    } else {
      if (s[i + 1] === ")") {
        if (left > 0) {
          left--
        } else {
          result++
        }
        i++
      } else {
        if (left > 0) {
          result++
          left--
        } else {
          result += 2
        }
      }
    }
  }
  return result + left * 2
}
```

## 複雜度

- **時間：** `O(n)`
- **空間：** `O(1)`
