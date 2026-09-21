---
title: "前端狀態管理: 淺談Redux, Zustand, useContext差異與選擇"
slug: frontend-state-management-redux-zustand-usecontext
description: 比較 Redux、Zustand 與 React useContext 的設計理念、適用情境與選擇方式
tags:
  - 前端
  - React
  - 狀態管理
date: 2026-09-14
---

在 React 專案中，狀態管理工具並不是越強大越好。真正重要的問題是：**這份狀態應該由誰擁有、誰需要讀取，以及它會如何變化？**

Redux、Zustand 和 `useContext` 都能讓多個元件取得共用資料，但它們解決問題的方式不同。選擇工具前，應先判斷資料本身的性質，而不是看到「全域狀態」就立刻加入狀態管理套件。

## 先判斷狀態應該放在哪裡

React 應用程式中的資料，大致可分成以下幾類：

1. **元件區域狀態**：輸入框內容、Modal 是否開啟、目前選中的頁籤。通常使用 `useState` 或 `useReducer` 即可。
2. **跨元件的客戶端狀態**：登入者資訊、購物車、編輯器設定、跨頁面流程。這是 Context、Zustand 或 Redux 常處理的範圍。
3. **伺服器狀態**：API 回傳資料、快取、重新驗證、載入與錯誤狀態。通常更適合交給 TanStack Query、SWR 或框架本身的資料取得機制。
4. **URL 狀態**：搜尋條件、分頁、排序方式。若狀態需要被分享、加入書籤或透過上一頁還原，應優先放在 URL，而不是全域 store。

> [!tip] 核心原則
> 讓狀態盡可能靠近使用它的元件。只有在多個相距較遠的元件確實需要共用時，才考慮把它提升到 Context 或全域 store。

## useContext：傳遞依賴，而非完整狀態管理方案

`useContext` 是 React 原生提供的 Context 消費方式。它適合將某個值提供給元件樹中的後代，避免層層傳遞 props。

```tsx
import { createContext, useContext, useState } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme 必須在 ThemeProvider 中使用")
  return context
}
```

### 適合使用 useContext 的情境

- 主題、語系、權限或目前登入者等低頻率更新資料
- 第三方服務或共用物件的注入
- 狀態只存在於某個子樹，而非整個應用程式
- 專案規模小，更新邏輯簡單

### 需要注意的地方

Provider 的 `value` 發生變化時，使用該 Context 的元件會重新渲染。若把大量、頻繁變動且彼此無關的資料全部放進同一個 Context，容易形成過大的更新範圍。

可以透過拆分 Context、穩定 `value` 的參考，或將狀態與操作分成不同 Context 改善；但當這些最佳化逐漸變得複雜，通常代表專案開始需要專門的狀態管理工具。

## Zustand：輕量、直接的全域 Store

Zustand 以 Hook 為核心，不需要 Provider，也不要求固定的 action 或 reducer 結構。元件可以透過 selector 訂閱 store 中需要的部分。

```tsx
import { create } from "zustand"

type CartStore = {
  itemCount: number
  addItem: () => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  addItem: () => set((state) => ({ itemCount: state.itemCount + 1 })),
  clearCart: () => set({ itemCount: 0 }),
}))

function CartBadge() {
  const itemCount = useCartStore((state) => state.itemCount)
  return <span>{itemCount}</span>
}
```

### 適合使用 Zustand 的情境

- 中小型專案需要簡單的跨元件狀態
- 希望以少量樣板程式建立 store
- 狀態更新頻繁，需要元件只訂閱特定欄位
- UI 工具、Dashboard、編輯器或互動密集的應用程式
- 團隊願意自行制定 store 分割與 action 命名規則

### 需要注意的地方

Zustand 給予很高的自由度，但自由也意味著架構不會自動形成。若缺少約定，容易把所有資料塞進單一 store，或讓元件直接散落各種難以追蹤的更新操作。

使用 selector 時，也要避免每次都建立不必要的新物件；同時應將業務操作封裝成有意義的 action，而不是讓畫面元件隨意修改狀態。

## Redux Toolkit：明確且可追蹤的資料流

現代 Redux 通常搭配 Redux Toolkit 使用。它透過 slice、action 與 reducer 建立明確的狀態變更流程，並提供成熟的開發工具與 middleware 生態系。

```tsx
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: { itemCount: 0 },
  reducers: {
    addItems(state, action: PayloadAction<number>) {
      state.itemCount += action.payload
    },
    clearCart(state) {
      state.itemCount = 0
    },
  },
})

export const { addItems, clearCart } = cartSlice.actions

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
})
```

### 適合使用 Redux Toolkit 的情境

- 大型或長期維護的產品
- 多個團隊共同開發，需要一致的資料流規範
- 狀態變化複雜，且需要清楚追蹤每一次變更
- 需要 middleware、時間旅行除錯、action log 或完整 DevTools
- 許多功能需要共享同一批領域資料

### 需要注意的地方

Redux Toolkit 已大幅減少傳統 Redux 的樣板程式，但它仍要求開發者理解 store、slice、dispatch、selector 與不可變更新等概念。對只有少量共用狀態的小專案來說，這些結構可能大於實際需求。

若資料主要來自 API，可先評估 Redux Toolkit 內的 RTK Query，或使用專門的伺服器狀態工具，不必手動替每個請求建立 loading、error 與 cache 狀態。

## 三者比較

| 面向       | useContext            | Zustand              | Redux Toolkit      |
| ---------- | --------------------- | -------------------- | ------------------ |
| 定位       | React 依賴傳遞機制    | 輕量全域狀態庫       | 結構化狀態管理方案 |
| 學習成本   | 低                    | 低                   | 中至高             |
| 樣板程式   | 少                    | 少                   | 較多，但規則明確   |
| 更新粒度   | 以 Context value 為主 | selector 訂閱        | selector 訂閱      |
| Provider   | 通常需要              | 不需要               | 通常需要           |
| 資料流規範 | 由團隊自行設計        | 彈性高               | 明確且一致         |
| DevTools   | React DevTools        | 支援 middleware 整合 | 成熟完整           |
| 適合規模   | 小型、局部範圍        | 小型至中大型         | 中大型、複雜產品   |

## 如何選擇

可以依序問以下問題：

1. **狀態只被少數鄰近元件使用嗎？**
   - 是：使用 `useState` 或 `useReducer`，不需要全域工具。
2. **資料主要是 API 快取嗎？**
   - 是：優先使用伺服器狀態工具。
3. **只是要向元件樹傳遞穩定、低頻更新的資料嗎？**
   - 是：使用 `useContext`。
4. **需要簡單的跨頁面狀態與細粒度訂閱嗎？**
   - 是：Zustand 通常是成本較低的選擇。
5. **是否需要嚴格資料流、完整除錯紀錄與大型團隊協作規範？**
   - 是：選擇 Redux Toolkit。

> [!note] 不需要一次決定永久架構
> 專案可以先使用區域狀態與 Context，需求變複雜後再抽出 Zustand store 或 Redux slice。重點是讓狀態邊界清楚，避免為了預測未來而過早增加複雜度。

## 常見誤區

### 把所有狀態都設成全域

全域狀態會增加元件之間的隱性依賴。Modal、表單輸入或單一頁籤狀態若沒有跨區域共享需求，應留在元件附近。

### 用 Context 模擬大型 Store

Context 可以搭配 `useReducer` 建立類似 store 的結構，但當 selector、效能最佳化、middleware 與除錯需求陸續出現時，自行維護的成本可能高於直接採用成熟工具。

### 將伺服器資料完全複製到全域狀態

API 資料通常涉及快取時效、重試、重新驗證與競態條件。將它複製進一般 store，可能同時產生兩份來源，進而造成資料不同步。

### 只根據套件大小選擇

套件大小固然重要，但團隊熟悉度、除錯能力、資料流複雜度與長期維護成本通常影響更大。多幾個 kilobytes 不一定比混亂的狀態邏輯昂貴。

## 結論

- `useContext` 適合傳遞低頻更新的共用依賴，不應被視為萬用的全域狀態庫。
- Zustand 適合希望快速建立、低樣板且能細粒度訂閱的全域狀態。
- Redux Toolkit 適合需要可預測資料流、強大工具與團隊規範的複雜應用。

最好的狀態管理策略，通常不是選出唯一工具，而是讓不同類型的狀態回到最合適的位置。
