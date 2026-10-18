---
title: "LeetCode 筆記：用 Cycle Decomposition 求 Minimum Swaps"
slug: minimum-swaps-cycle-decomposition
category: LeetCode
description: "介紹如何用 Cycle Decomposition（循環分解）求排列的最少交換次數，說明每個 cycle 為何需要 k - 1 次交換，並示範 JavaScript 計算方式。"
tags:
  - LeetCode
  - JavaScript
  - Permutation
  - Cycle Decomposition
date: 2026-10-18
draft: false
---

## 前言

有一類常見的演算法問題：

> 給定兩個排列 (Permutation)，每次可以任意交換 (swap) 兩個位置，最少需要幾次 swap 才能從目前的排列變成目標排列？

例如：

```text
start  = [0, 1, 2, 3]
target = [1, 2, 0, 3]
```

我們可以：

```text
[0, 1, 2, 3]
 ↓ swap 0 和 1

[1, 0, 2, 3]
 ↓ swap 1 和 2

[1, 2, 0, 3]
```

因此答案是 2 swaps。這種類型最重要的演算法概念就是 **Cycle Decomposition**，他的核心公式是：

```text
一個長度為 k 的 cycle
需要 k - 1 次 swap
```

因此如果一個 permutation 被拆成

```text
cycle 1 長度 = k₁
cycle 2 長度 = k₂
cycle 3 長度 = k₃
...
```

minimum swaps 就是：

```text
(k₁ - 1) + (k₂ - 1) + (k₃ - 1) + ...
```

## 為什麼不能只算交換位置數量？

在看到這個問題，第一時間可能會聯想到「每次可以交換兩個元素，那就把要交換的位置數量除以 2 就好」，但我們看下面兩組不同的陣列：

```
[0,1,2,3]
[1,0,3,2]

Minimum Swaps = 2
```

```
[0,1,2,3]
[1,2,3,0]

Minimum Swaps = 3
```

同樣都是 4 個位置全換，但是第 2 組數列需要的 swap 卻是 3，所以最終我們還是需要看當前陣列切換到目標陣列所需的 **Cycle** 來決定 Minimum swaps 的數量。

## Permutation

在講 Cycle 之前要先講什麼是 Permutation，Permutation 的中文是排列，也就是一組數列經過重新排序之後，滿足以下條件：

- 出現一次
- 沒有消失
- 沒有新增

例如：

```
[0,2,3,1]
[1,3,0,2]
[2,3,1,0]
```

都是 `[0,1,2,3]` 的 Permutation。
因此每一個原始位置 (original index) 都一定會對應到一個唯一的目標位置 (target index)，而任何的 Permutation 都一定可以被拆分成 **一個或是多個互不重疊的 Cycles**。

## 什麼是 Cycle？

Cycle 指的是一個從起點出發之後回到起點，完整的閉環，我們可以從每個元素要去的位置去理解 Cycle：

```text
start  = [0, 1, 2, 3]
target = [1, 2, 0, 3]

index 0 的元素 → index 2
index 1 的元素 → index 0
index 2 的元素 → index 1
index 3 的元素 → index 3
```

我們試著把它串起來，可以得到

```text
0 -> 2 -> 1 -> 0
```

這樣的一個 Cycle，而 3 本身自成一個 Cycle，因此整個 permutation 可以分成 0、2、1 還有 3 兩個 Cycle，這個過程就是 **Cycle Decomposition**，每一個 Cycle 所需的 Minimum swaps 分別為 Cycle 長度 -1。

## 如何找到所有的 Cycle

以下用索引 `0` 到 `n - 1` 組成的排列示範如何找出 Cycle。若題目給的是任意 `start` 和 `target` 陣列，需要先建立每個元素在 `target` 中的目標索引映射，再將映射代入下方程式。

假設題目是

```js
const start = [0, 1, 2, 3]
const permutation = [1, 2, 3, 0]
```

我們可以先建立一個陣列讓我們知道哪些元素已經走過，

```js
const visited = new Array(4).fill(false)
```

接著我們從 index 0 開始，尋找我們要去的下一個位置，並且每到一個位置就將 `visited` 標記為 `true`，直到我們走到已經標記過的位置，我們就能知道這個 Cycle 已經結束，可以繼續尋找下一個未標記過的 Cycle。

```js
let current = 0
visited[0] = true
current = permutation[current]
```

所以我們要遍歷整個數列就會是這樣：

```js
const n = permutation.length
const visited = new Array(n).fill(false)
let minSwaps = 0

for (let i = 0; i < n; i++) {
  if (visited[i]) {
    continue
  }

  let current = i
  let cycleLength = 0

  while (!visited[current]) {
    visited[current] = true
    current = permutation[current]
    cycleLength++
  }

  minSwaps += cycleLength - 1
}
```

## Time Complexity

雖然在 for 迴圈裏面又寫了一個 while 迴圈，但是實際上每個元素都只會被處理到一次，所以 Cycle Decomposition 的 time complexity 是 O(n)。

## Space Complexity

使用 `visited` 陣列記錄每個索引是否已走訪，因此額外空間複雜度是 O(n)。

## LeetCode 相關題型

[3551. Minimum Swaps to Sort by Digit Sum](https://leetcode.com/problems/minimum-swaps-to-sort-by-digit-sum/)
