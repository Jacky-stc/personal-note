<%*
const number = await tp.system.prompt("LeetCode 題號", "", true)
const problemTitle = await tp.system.prompt("英文題名", "", true)
const difficulty = await tp.system.suggester(
  ["Easy", "Medium", "Hard"],
  ["Easy", "Medium", "Hard"],
  true,
  "選擇題目難度",
)
const topicsInput = await tp.system.prompt("標籤，以逗號分隔", "JavaScript")

const title = `LeetCode ${number.trim()}. ${problemTitle.trim()}`
const problemSlug = problemTitle
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
const slug = `leetcode-${number.trim()}-${problemSlug}`
const tags = (topicsInput ?? "")
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean)

await tp.file.rename(title)
-%>
---
title: <% JSON.stringify(title) %>
slug: <% slug %>
description: ""
tags:
  - LeetCode
  - <% difficulty %>
<% tags.map((tag) => `  - ${JSON.stringify(tag)}`).join("\n") %>
date: <% tp.date.now("YYYY-MM-DD") %>
draft: true
---

## 題目連結

[LeetCode <% number %>. <% problemTitle %>](https://leetcode.com/problems/<% problemSlug %>/)

## 題目敘述

<% tp.file.cursor(1) %>

## 解題思路

### 核心概念

<% tp.file.cursor(2) %>

### 解題步驟

1.
2.
3.

## JavaScript 實作

```javascript
/**
 * @param {}
 * @return {}
 */
var solution = function () {
  // TODO
}
```

## 複雜度

- **時間：** `O()`
- **空間：** `O()`

## 易錯點

-
