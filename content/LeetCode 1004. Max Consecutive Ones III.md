---
title: LeetCode 1004. Max Consecutive Ones III
slug: leetcode-1004-max-consecutive-ones-iii
description: ""
tags:
  - LeetCode
  - Medium
  - Array
  - Sliding Window
  - Prefix Sum
  - Binary Search
date: 2026-09-24
draft: false
---

## 題目連結

[LeetCode 1004. Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)

## 題目敘述

給定一個二元的數列，裡面只會包含 `0` 或是 `1`，另外給予一個不超過數列長度的正整數 `k`，表示你可以將數列中 `k` 個 `0` 替換成 `1`，並試圖找出在該限制下最大長度連續都是 `1` 的子數列。
## 解題思路

由於我們必須在一個動態的範圍內判斷 `0` 的長度是否超過正整數 `k`，所以我們一樣可以使用移動窗口 ( Sliding Window ) 的方法，先給定左右邊界分別為  `0`，接著不斷重複以下動作：
1. 窗口中 `0` 的數量不超過 `k` 就繼續向右擴張，並透過右邊界減去左邊界更新最大數列長度
2. 窗口中 `0` 的數量若超過 `k`，就限縮左側邊界，直到窗口中 `0` 的數量恢復正常

## JavaScript 實作

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var longestOnes = function (nums, k) {
  let l = 0
  let r = 0
  let maxLen = 0
  let zeroSum = 0

  while (r < nums.length) {
    while (zeroSum <= k && r < nums.length) {
      if (nums[r] === 0) {
        zeroSum++
      }
      r++
      if (zeroSum <= k) {
        maxLen = Math.max(maxLen, r - l)
      }
    }

    while (zeroSum > k) {
      if (nums[l] === 0) {
        zeroSum--
      }
      l++
    }
  }

  return maxLen
}
```

## 複雜度

- **時間：** `O(n)`
- **空間：** `O(1)`
