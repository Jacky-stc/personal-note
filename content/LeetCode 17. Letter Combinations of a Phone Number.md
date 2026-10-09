---
title: LeetCode 17. Letter Combinations of a Phone Number
slug: leetcode-17-letter-combinations-of-a-phone-number
category: LeetCode
description: 使用 JavaScript 解 LeetCode 17 Letter Combinations of a Phone Number，整理題目思路、程式實作與時間空間複雜度
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Hash Table
  - Backtracking
date: 2026-10-07
draft: true
---

## 題目連結

[LeetCode 17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

## 題目敘述

給予一個長度界於 1-4 之間的字串，其中包含數字 `2-9` 的任意排列組合，每一個數字都有相對應的英文字母，試著找出所有可能的字母排列組合

![[Pasted image 20261007202619.png|259]]

**Example 1:**

>**Input:** digits = "23"
**Output:** ["ad","ae","af","bd","be","bf","cd","ce","cf"]

**Example 2:**

>**Input:** digits = "2"
**Output:** ["a","b","c"]
## 解題思路：Backtracking
很多這種需要找出所有解的題目，都很適合使用 Backtracking 來遞迴所有的子路徑，並且在遇到不合適的分支時可以即時砍掉，回歸原點再尋找下一條路徑。
Backtracking 的特點就是我們每次都拿這個 function 所建立的產物，再丟回到這個function 中，直到我們達到底部，接著當我們回歸的時候，需要把這一次嘗試的內容砍掉換成新的。
以這一題為例，假設題目輸入的字串是 `259`，那麼我們的第一遍搜尋就會是：
```
a -> j -> w,x,y,z
```
這時我們已經把這條路徑的底部都探索過了，所以我們回歸到 `j` 之後需要把 `j` 砍掉，做新的嘗試：
```
a -> h -> w,x,y,z
```
## JavaScript 實作

```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if(digits.length === 0){
        return []
    }
    const numberList = {
        '2':['a','b','c'],
        '3':['d','e','f'],
        '4':['g','h','i'],
        '5':['j','k','l'],
        '6':['m','n','o'],
        '7':['p','q','r','s'],
        '8':['t','u','v'],
        '9':['w','x','y','z']
    }
    if(digits.length === 1) return numberList[digits]
    const path = [], result = [];
    function track(index, currPath){
        if(currPath.length === digits.length){
            result.push(currPath.join(''))
            return
        }
        for(let i = 0;i<numberList[digits[index]].length; i++){
            path.push(numberList[digits[index]][i])
            track(index+1, path)
            path.pop()
        }
    }
    track(0, path)
    return result
};
```

## 複雜度

- **時間：** `O(n * 4^n)`
- **空間：** `O(n)`