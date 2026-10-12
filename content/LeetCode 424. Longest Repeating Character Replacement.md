---
title: LeetCode 424. Longest Repeating Character Replacement
slug: leetcode-424-longest-repeating-character-replacement
category: LeetCode
description: 使用 JavaScript 解 LeetCode 424 Longest Repeating Character Replacement，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Hash Table
  - Sliding Window
date: 2026-10-12
draft: false
---

## 題目連結

[LeetCode 424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)

## 題目敘述

題目給定一個字串 `s` 和一個整數 `k`，字串 `s` 裡面只會包含大寫的英文字母，你可以選擇任意一個字母將其轉換為其他的字母，這個動作最多只能執行 `k` 次，在這個條件下返回你能找到最長的字串裡面每一個字母都相同。

> **Example 1:**
> **Input:** s = "ABAB", k = 2
> **Output:** 4
> **Explanation:** Replace the two 'A's with two 'B's or vice versa.

> **Example 2:**
> **Input:** s = "AABABBA", k = 1
> **Output:** 4
> **Explanation:** Replace the one 'A' in the middle with 'B' and form "AABBBBA".
> The substring "BBBB" has the longest repeating letters, which is 4.
> There may exists other ways to achieve this answer too.

## 解題思路：Sliding Window

這題的重點有兩個：

1. 記錄視窗中字母出現的最高頻率
2. 計算視窗中需要轉換的字母數量

我們可以建立一個長度固定為 26 的計數陣列，存放視窗中每個字母的出現次數。右側邊界擴張時更新對應的計數，並記錄目前觀察到的最高頻率 `maxFreq`。

視窗中需要轉換的次數是 **視窗長度減去出現次數最多的字母在視窗中的出現次數**。例如視窗包含 `AABCBA` 時，`A` 出現 3 次，其餘的 `BCB` 共 3 個字母需要轉換。

### 解題步驟

1. 建立一個計數陣列，存放視窗中每個字母的出現次數
2. 讓視窗右側不斷向右擴張，直到字串的尾端
3. 若是視窗中的 **非最大數量字母** 超過了整數 `k`，就將左側邊界向右縮攏

> [!NOTE]
> 以下判斷每次只將左側邊界向右移動一格：
>
> ```javascript
> if (right - left + 1 - maxFreq > k) {
>   map[s.charCodeAt(left) - 65]--
>   left++
> }
> ```
>
> `maxFreq` 不會因左側邊界移動而減少，所以有些當下的視窗可能不合法；但本題只求最大長度，這不會讓最終答案高估。

## JavaScript 實作

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function (s, k) {
  const map = new Array(26).fill(0)
  let left = 0
  let maxFreq = 0
  let maxLen = 0

  for (let right = 0; right < s.length; right++) {
    const index = s.charCodeAt(right) - 65
    map[index]++
    maxFreq = Math.max(maxFreq, map[index])

    if (right - left + 1 - maxFreq > k) {
      map[s.charCodeAt(left) - 65]--
      left++
    }

    maxLen = Math.max(maxLen, right - left + 1)
  }

  return maxLen
}
```

## 複雜度

- **時間：** `O(n)`，其中 `n` 是字串長度；右側指標逐字走訪，左側指標也只會向右移動。
- **空間：** `O(1)`；計數陣列固定只有 26 個位置，不隨字串長度增加。
