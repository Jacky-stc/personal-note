---
title: LeetCode 209. Minimum Size Subarray Sum
slug: leetcode-209-minimum-size-subarray-sum
description: 使用滑動視窗尋找總和至少為 target 的最短連續子陣列
tags:
  - LeetCode
  - Sliding Window
  - JavaScript
---

## 題目敘述

給定一個**只包含正整數**的陣列 `nums`，以及一個正整數 `target`，找出總和大於或等於 `target` 的最短**連續子陣列**長度。如果不存在符合條件的子陣列，回傳 `0`。

### 範例 1

- **輸入：** `target = 7`、`nums = [2, 3, 1, 2, 4, 3]`
- **輸出：** `2`
- **說明：** `[4, 3]` 是符合條件且長度最短的子陣列。

### 範例 2

- **輸入：** `target = 4`、`nums = [1, 4, 4]`
- **輸出：** `1`

### 範例 3

- **輸入：** `target = 11`、`nums = [1, 1, 1, 1, 1, 1, 1, 1]`
- **輸出：** `0`

## 解題思路：滑動視窗

因為陣列中的數字都是正整數，向右擴大視窗時，總和只會增加；從左側縮小視窗時，總和只會減少。可以利用這個特性維護一段連續的範圍，不必枚舉所有子陣列。

1. 將左、右邊界 `l`、`r` 設為 `0`，並用 `sum` 記錄視窗內的總和。此時視窗包含索引 `l` 到 `r - 1`。
2. 移動右邊界並加入新數字，直到 `sum >= target`，或右邊界抵達陣列尾端。
3. 當 `sum >= target` 時，先更新最短長度，再移除左邊的數字並移動左邊界，嘗試找到更短的視窗。
4. 重複以上過程；若沒有找到符合條件的視窗，回傳 `0`。

## JavaScript 實作

```javascript
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  let l = 0
  let r = 0
  let sum = 0
  let minLen = nums.length + 1

  while (r < nums.length) {
    while (sum < target && r < nums.length) {
      sum += nums[r]
      r++
    }

    while (sum >= target) {
      minLen = Math.min(minLen, r - l)
      sum -= nums[l]
      l++
    }
  }

  return minLen === nums.length + 1 ? 0 : minLen
}
```

## 複雜度

- **時間：** `O(n)`。左、右邊界各最多走過整個陣列一次。
- **空間：** `O(1)`。除了邊界、總和與最短長度，只使用固定數量的變數。
