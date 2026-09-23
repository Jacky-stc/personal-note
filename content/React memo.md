---
title: React memo
slug: react-memo
category: React
---
在前端效能優化的過程中，大家通常第一時間想到的就是 `memo` 和 `useMemo` ，下面會介紹我們該在什麼時候用 `memo` 來包我們的 component，`React.memo` 背後的底層邏輯是什麼，以及它在什麼情況下有可能會失效。
## 基礎應用

假設今天我們有一個 Parent component，裡面有兩個 input bar 分別可以輸入 `name` 和 `address`，用戶輸入之後會透過 `setState` 改變他們的值，我們把其中一個值 `name` 傳到他的 Child component
#### Without memo
``` javascript
//
import { memo, useState } from 'react';

export default function Parent() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Child name={name} />
    </>
  );
}

const Child = function Child({ name }) {
  console.log("Child was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
};
```

當用戶更新 `address` 的時候， `Parent` 呼叫 `setState` 導致 re-render ，而此時由於 Parent component 的 re-render 行為，導致 `Child` 也跟著 re-render
#### With memo
```javascript
const Child = memo(function Child({ name }) {
  console.log("Child was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```
當我們把 `Child` 包上 `memo` 之後，就算Parent component 觸發 re-render，他也會根據傳進來的 `name` 跟之前一不一樣來決定需不需要 re-render。

即使 re-render不必然會導致元件的 `reflow` 和 `repaint`，但 `memo` 確實幫我們節省了 component函式執行以及 Virtual DOM 的比對成本。
## 底層原理
1. **定義物件**

	當我們把 component 傳入 `memo` 之後，React會建立一個帶有 `REACT_MEMO_TYPE` 的物件
	```javascript
	export function memo(type, compare) {
	  const elementType = {
	    $$typeof: REACT_MEMO_TYPE,
	    type,
	    compare: compare === undefined ? null : compare,
	};

	  return elementType;
	}
	```
2. **建立 Fiber**

	接著當 React 要將 JSX element 建立為 Fiber 時，會去檢查他的 type，把 Fiber 標記為 `MemoComponent`
	```javascript
	default: {
	        // $FlowFixMe[invalid-compare]
	        if (typeof resolvedType === 'object' && resolvedType !== null) {
	          switch (resolvedType.$$typeof) {
	            // $FlowFixMe[invalid-compare]
	            case REACT_MEMO_TYPE:
	              fiberTag = MemoComponent;
	              break getTag;
	```
	`MemoComponent` 在 update 時主要會執行以下幾件事：
	```javascript
	const hasScheduledUpdateOrContext =
	  checkScheduledUpdateOrContext(current, renderLanes);

	if (!hasScheduledUpdateOrContext) {
	  const prevProps = currentChild.memoizedProps;
	  let compare = Component.compare;
	  compare = compare !== null ? compare : shallowEqual;
	  if (
	    compare(prevProps, nextProps) &&
	    current.ref === workInProgress.ref
	  ) {
	    return bailoutOnAlreadyFinishedWork(...);
	  }
	}

	// 不能 bailout，建立／取得 inner child 的 work-in-progress Fiber
	const newChild = createWorkInProgress(currentChild, nextProps);
	return newChild;
	```
	簡單來說就是，要成功跳過 component，至少需要：
	1. 沒有目前優先級需要處理的 scheduled update。
	2. 它依賴的 context 沒改變。
	3. 舊 props 與新 props 比較相等。
	4. `ref` 沒改變。

	只要其中一項不成立，就繼續處理 inner component。

2. **比較差異**

	當我們沒有傳入 custom compare function的時候，React會預設使用 `shallowEqual`
	```javascript
	shallowEqual(prevProps, nextProps)
	```
	`shallowEqual` 會透過 `Object.is()` 比較每一個prop，而不是深層比較，他比較的是 prop 的 reference，所以當今天我們傳進來的 prop 是一個 `function` 或是一個 `object` 的話，對他來說每次的render都還是一個新的 reference，這件事情就有可能會導致 `React.memo` 無法達到我們想要的避免 re-render 的效果

## 總結
1. 當我們不希望 Parent component 的 re-render 會導致 Child component re-render 的時候，在 Child component 包 `memo`
2. 當傳入的 props 是 function 或是 object 的時候，`React.memo` 就有可能會失效
3. `React.memo` 不是萬靈丹，請把他當成優化的手段而非程式碼執行的必要

## References
https://react.dev/reference/react/memo
https://github.com/react/react/blob/main/packages/react/src/ReactMemo.js
https://github.com/react/react/blob/main/packages/react-reconciler/src/ReactFiber.js
https://github.com/react/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js
