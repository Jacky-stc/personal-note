---
title: LeetCode 1254. Number of Closed Islands
slug: leetcode-1254-number-of-closed-islands
category: LeetCode
description: 使用 JavaScript DFS 先移除與邊界相連的陸地，再計算 LeetCode 1254 的封閉島嶼數量，並分析 O(mn) 時間與空間複雜度。
tags:
  - LeetCode
  - Medium
  - JavaScript
  - DFS
  - Matrix
date: 2026-10-26
draft: false
---

## 題目連結

[LeetCode 1254. Number of Closed Islands](https://leetcode.com/problems/number-of-closed-islands/)

## 題目敘述

題目給定一個 2D 的 `grid`，裡面包含 0 (陸地) 和 1 (水)，需要找出所有「閉合陸地」的數量，閉合陸地指的就是一塊相連的陸地 (0) 周圍上下左右全部被水 (1) 包圍。

> **Example 1:**
> ![](https://assets.leetcode.com/uploads/2019/10/31/sample_3_1610.png)
> **Input:** grid = `[[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]`
> **Output:** 2
> **Explanation:**
> Islands in gray are closed because they are completely surrounded by water (group of 1s).

## 解題思路

要找到所有被水包圍的陸地，我們可以先去除那些一定不可能被包圍的陸地群，也就是有碰到邊界的陸地群，例如

```
1 1 1 1 1
0 0 1 0 1
1 0 1 0 1
1 0 1 1 1
1 1 1 1 1
```

在上面這個例子中，最左邊那一塊接觸到邊界的陸地就一定不可能被包圍

```
0 0
  0
  0
```

所以我們可以透過 DFS 的方法先把**所有與邊界相連的陸地群都轉變成水**，那麼我們就可以確保剩下的陸地一定都被水包圍，那我們只需要去數有多少個陸地群即可

### DFS 實作

DFS 在這類 matrix 概念的題目非常好用，它最重要的觀念就是三個：

1. 先設定條件，不符合就返回
2. 只要走訪一個地方，就要想辦法把它標記為 visited，不管用什麼方法
3. 持續往深處探索，不行就 return

所以遇到這類題目，我們都可以先宣告一個 dfs function，方便我們後面作使用：

```js
const rows = grid.length
const columns = grid[0].length

const dfs = (r, c) => {
  if (r < 0 || r >= rows || c < 0 || c >= columns || grid[r][c] === 1) {
    return
  }
  // r跟c代表的是row跟column，前面四個條件就是
  // 1. r超過左邊界
  // 2. r超過右邊界
  // 3. c超過上邊界
  // 4. c超過下邊界
  // 最後一個則是根據每一題會有所不同，這裡我們要找的是陸地所以遇到水就跳過

  grid[r][c] = 1
  // 這裡我們把已經走過的陸地標記為1，
  // 可以視為把它標記為visited或是轉成水下次就不會重複走

  dfs(r - 1, c)
  dfs(r + 1, c)
  dfs(r, c + 1)
  dfs(r, c - 1)
  // 往上下左右深處走
}
```

有了這個 function 之後，我們要做的就是先把跟上下左右邊界相連的陸地消除 (轉變為1)

```js
for (let i = 0; i < rows; i++) {
  if (grid[i][0] === 0) {
    dfs(i, 0)
  }
  if (grid[i][columns - 1] === 0) {
    dfs(i, columns - 1)
  }
}
for (let i = 0; i < columns; i++) {
  if (grid[0][i] === 0) {
    dfs(0, i)
  }
  if (grid[rows - 1][i] === 0) {
    dfs(rows - 1, i)
  }
}
```

接下來我們只要遍歷每一格去找相連的陸地群即可

```js
let result = 0

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    if (grid[i][j] === 0) {
      result++
      dfs(i, j)
    }
  }
}
return result
```

## JavaScript 實作

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  const rows = grid.length
  const columns = grid[0].length

  const dfs = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= columns || grid[r][c] === 1) return

    grid[r][c] = 1

    dfs(r - 1, c)
    dfs(r + 1, c)
    dfs(r, c + 1)
    dfs(r, c - 1)
  }

  for (let i = 0; i < rows; i++) {
    if (grid[i][0] === 0) {
      dfs(i, 0)
    }
    if (grid[i][columns - 1] === 0) {
      dfs(i, columns - 1)
    }
  }
  for (let i = 0; i < columns; i++) {
    if (grid[0][i] === 0) {
      dfs(0, i)
    }
    if (grid[rows - 1][i] === 0) {
      dfs(rows - 1, i)
    }
  }

  let result = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] === 0) {
        result++
        dfs(i, j)
      }
    }
  }
  return result
}
```

## 複雜度

由於所有的格子都只會被處理過一遍，所以假設 grid 是 m * n，時間複雜度就是 O(mn)。
比較特別的是空間複雜度，雖然我們這題不會去額外建立一個 `visitesd` 的 array，看起來好像是 O(1)，但是在呼叫 dfs function 的過程中，可能會累積很多個 function call frame 在 call stack 中

```js
dfs(1, 1)
│
└─ dfs(2, 1)
   │
   └─ dfs(3, 1)
      │
      └─ dfs(4, 1)
         │
         └─ ...
```

只要下一層的 DFS 還沒 return，上一層就不能從 stack 中移除，所以完整的 auxiliary space 要把 call stack也算進去，最差的情況下會是 O(mn)

- **時間：** `O(mn)`
- **空間：** `O(mn)`
