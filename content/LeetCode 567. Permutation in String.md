---
title: LeetCode 567. Permutation in String
slug: leetcode-567-permutation-in-string
category: LeetCode
description: 使用 JavaScript 解 LeetCode 567 Permutation in String，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Hash Table
  - Two Pointers
  - Sliding Window
date: 2026-09-30
---

## 題目連結

[LeetCode 567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)

## 題目敘述

題目給定兩個字串 `s1`、`s2`，我們需要去判定在 `s2` 中是否含有 `s1` 的 **permutation** ( 這裡 Permutation 的定義是該字串以任意方式重組，例如 `cba` 就屬於 `abc` 的 Permutation )，若是有的話就返回 `true`，反之則是 `false`。

**Example 1:**

> **Input:** s1 = "ab", s2 = "eidbaooo"
> **Output:** true
> **Explanation:** s2 contains one permutation of s1 ("ba").

**Example 2:**

> **Input:** s1 = "ab", s2 = "eidboaoo"
> **Output:** false

## 解題思路

我們需要去找到在 `s2` 中是否包含有 `s1` 的 permutation，而 `s1` 的長度是固定的，所以我們可以透過固定長度的移動窗口 ( Sliding Window )，不斷向右滑動並且在每次滑動的過程中去比較當下窗口的字串是否屬於 `s1` 的 permutation 即可

### 解題步驟

1. 建立兩個長度為26的空array，用來記錄兩組字串中每個字母出現的次數 ( 這裡也可以選擇使用hash map的方式，看個人喜好 )
2. 先檢查 `s2` 的前 `s1` 長度字串是否為 `s1` 的 permutation ( 這麼的用意是先將我們的窗口撐開至與 `s1` 長度相等 )
3. 若是不相等，我們再接著去向右移動窗口並依序進行比較，直到窗口右側抵達 `s2` 的尾端

## JavaScript 實作

```javascript
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  let n1 = s1.length,
    n2 = s2.length
  if (n2 < n1) return false

  let c1 = new Array(26).fill(0)
  let c2 = new Array(26).fill(0)

  for (let i = 0; i < n1; i++) {
    c1[s1.charCodeAt(i) - 97]++
    c2[s2.charCodeAt(i) - 97]++
  }

  const equal = (a, b) => a.every((v, i) => v === b[i])

  if (equal(c1, c2)) return true

  for (let i = n1; i < n2; i++) {
    c2[s2.charCodeAt(i) - 97]++
    c2[s2.charCodeAt(i - n1) - 97]--

    if (equal(c1, c2)) return true
  }

  return false
}
```

## 複雜度

- **時間：** `O(n)` ( 因為我們每次最多都只會做 n * 26次比較 )
- **空間：** `O(1)`
