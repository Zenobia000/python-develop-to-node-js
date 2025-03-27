/**
 * Await 運算符 - 為 Python 開發者準備
 * 
 * await 關鍵字用於等待 Promise 解析，只能在 async 函數內使用
 * 與 Python 中的 await 非常相似
 */

// ========================
// await 基本用法
// ========================

// 創建一個返回 Promise 的函數
function delay(ms, value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

// 使用 await 等待 Promise
async function basicAwait() {
  console.log("函數開始");
  
  // await 會暫停函數執行，直到 Promise 解析完成
  const result = await delay(2000, "完成");
  console.log("延遲後收到:", result);
  
  // 函數繼續執行
  console.log("函數結束");
  
  return "全部完成";
}

// 調用 async 函數
console.log("準備調用 async 函數");
basicAwait().then(msg => console.log("最終消息:", msg));
console.log("async 函數已調用，但我們不等待它");

/**
 * Python 中的對應:
 * 
 * import asyncio
 * 
 * async def delay(ms, value):
 *     await asyncio.sleep(ms / 1000)  # Python 中以秒為單位
 *     return value
 * 
 * async def basic_await():
 *     print("函數開始")
 *     
 *     # await 暫停函數執行
 *     result = await delay(2000, "完成")
 *     print(f"延遲後收到: {result}")
 *     
 *     # 繼續執行
 *     print("函數結束")
 *     
 *     return "全部完成"
 * 
 * async def main():
 *     print("準備調用 async 函數")
 *     task = asyncio.create_task(basic_await())
 *     print("async 函數已調用，但我們不等待它")
 *     msg = await task
 *     print(f"最終消息: {msg}")
 * 
 * asyncio.run(main())
 */

// ========================
// await 與變數賦值
// ========================

async function awaitWithVariables() {
  // 可以直接將 await 結果賦值給變數
  const value1 = await delay(1000, "第一個值");
  console.log("收到:", value1);
  
  // 可以在表達式中使用 await
  const value2 = (await delay(1000, 5)) * 2;
  console.log("計算結果:", value2);
  
  // 可以連續使用多個 await
  const value3 = await delay(500, "A");
  const value4 = await delay(500, "B");
  console.log("連續值:", value3, value4);
  
  return "完成變數示例";
}

awaitWithVariables().then(console.log);

// ========================
// await 錯誤處理
// ========================

// 創建一個可能失敗的 Promise
function riskyOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% 失敗機率
      if (Math.random() < 0.5) {
        resolve("成功結果");
      } else {
        reject(new Error("操作失敗"));
      }
    }, 1000);
  });
}

// 使用 try/catch 處理 await 的錯誤
async function handleAwaitErrors() {
  try {
    console.log("嘗試風險操作...");
    const result = await riskyOperation();
    console.log("操作成功:", result);
  } catch (error) {
    // 如果被 await 的 Promise 被 reject，錯誤會被這裡捕獲
    console.error("捕獲錯誤:", error.message);
  }
  
  console.log("無論成功或失敗，都會執行這行");
  
  return "錯誤處理完成";
}

handleAwaitErrors().then(msg => console.log(msg));

// ========================
// await 中不能使用的情況
// ========================

// 錯誤示例: await 不能在常規函數中使用
// function wrongUseOfAwait() {
//   const result = await delay(1000, "value");  // 語法錯誤！
//   return result;
// }

// 正確用法: 將函數轉換為 async
async function correctUseOfAwait() {
  const result = await delay(1000, "value");
  return result;
}

// await 只能在 async 函數內部使用
// 也可以在模塊頂層使用 (ES 模塊，非 CommonJS) 