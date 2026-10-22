---
title: "LeetCode 3942. Minimum Operations to Sort a Permutation"
slug: leetcode-3942-minimum-operations-to-sort-a-permutation
category: LeetCode
description: "透過環狀排列判斷 LeetCode 3942 是否可排序，推導整體反轉與向左旋轉的最少操作數，並附上 O(n) 時間、O(1) 空間的 JavaScript 實作。"
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Array
  - Permutation
date: 2026-10-22
draft: false
---

## 題目連結

[LeetCode 3942. Minimum Operations to Sort a Permutation](https://leetcode.com/problems/minimum-operations-to-sort-a-permutation/)

## 題目敘述

`nums` 是由 `0` 到 `n - 1` 各出現一次所組成的排列。每次可以選擇以下一種操作：

1. **反轉**整個陣列。
2. **向左旋轉一格**：把第一個元素移到最後，其餘元素向左移一格。

求把 `nums` 排成 `[0, 1, ..., n - 1]` 的最少操作數；若無法達成，回傳 `-1`。

## 解題思路

### 1. 先判斷是否可排序

把陣列想成首尾相接的環。向左旋轉只會改變起點；反轉只會改變走訪這個環的方向。因此，若最後能排好序，從 `0` 開始繞一圈時，原本的數字順序必須是：

- 正向：`0, 1, 2, ..., n - 1`
- 反向：`0, n - 1, n - 2, ..., 1`

只檢查 `0` 和 `n - 1` 是否相鄰並不足夠。例如 `[1, 3, 0, 2]` 中，`3` 和 `0` 相鄰，但從 `0` 出發得到 `[0, 2, 1, 3]`，不符合任一方向，所以答案是 `-1`。

設 `p` 為 `0` 的位置。走到環上的第 `i` 個元素時，檢查 `nums[(p + i) % n]` 是否等於正向的 `i`，或反向的 `(n - i) % n`。兩種方向都不符合，就不可能排序。

### 2. 計算最少操作數

確認方向後，只需比較旋轉與反轉的順序。設 `p` 仍為 `0` 的原始索引：

| 原始環的方向 | 操作方式                                         | 操作數            |
| ------------ | ------------------------------------------------ | ----------------- |
| 正向         | 向左旋轉 `p` 次                                  | `p`               |
| 正向         | 反轉、向左旋轉 `n - p` 次、再反轉                | `n - p + 2`       |
| 反向         | 先反轉，再向左旋轉 `n - 1 - p` 次                | `n - p`           |
| 反向         | 向左旋轉 `(p + 1) % n` 次，讓 `0` 到尾端，再反轉 | `(p + 1) % n + 1` |

對正向排列，兩次反轉可以把向左旋轉變成向右旋轉；對反向排列，則至少需要一次反轉。分別計算有效方向的候選值，再取最小值即可。當 `n` 很小、兩個方向都成立時，也要同時比較兩組候選值。

例如：

- `[2, 3, 0, 1]` 是正向環，`p = 2`，向左旋轉兩次即可，答案是 `2`。
- `[0, 2, 1]` 是反向環，向左旋轉一次再反轉，答案是 `2`。
- `[1, 3, 0, 2]` 不是正向或反向環，答案是 `-1`。

## JavaScript 實作

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
  const n = nums.length
  const zeroIndex = nums.indexOf(0)
  let increasing = true
  let decreasing = true

  for (let offset = 0; offset < n; offset++) {
    const value = nums[(zeroIndex + offset) % n]

    if (value !== offset) increasing = false
    if (value !== (n - offset) % n) decreasing = false
  }

  let answer = Infinity

  if (increasing) {
    answer = Math.min(answer, zeroIndex, n - zeroIndex + 2)
  }

  if (decreasing) {
    answer = Math.min(answer, n - zeroIndex, ((zeroIndex + 1) % n) + 1)
  }

  return answer === Infinity ? -1 : answer
}
```

## 複雜度

- **時間：`O(n)`。** `indexOf(0)` 和環狀順序檢查各走訪陣列一次。
- **空間：`O(1)`。** 只使用固定數量的變數，沒有建立額外陣列。
