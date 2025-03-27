/**
 * JavaScript Async/Await 與 Python asyncio 比較
 * 
 * 本文件對比 JavaScript 與 Python 中的非同步程式設計模式
 * 幫助 Python 開發者更容易理解 JavaScript 的非同步模型
 */

// ========================
// 基本概念對比
// ========================

/**
 * 1. 核心概念對應
 * 
 * JavaScript           | Python
 * ---------------------|------------------
 * Promise              | Future / Task
 * async function       | async def function
 * await                | await
 * .then()              | awaiting the result
 * .catch()             | try/except
 * 
 * 2. 執行模型差異
 * 
 * JavaScript: 單線程事件循環 (Event Loop)
 * Python asyncio: 協程基於事件循環，但允許多線程整合
 */

// ========================
// 基本函數對比
// ========================

// JavaScript: 創建 Promise
function jsDelay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`等待了 ${ms} 毫秒`);
    }, ms);
  });
}

// JavaScript: async 函數
async function jsAsyncFunction() {
  console.log("JS: 開始");
  const result = await jsDelay(1000);
  console.log("JS:", result);
  return "JS 完成";
}

/**
 * Python 對應:
 * 
 * import asyncio
 * 
 * # Python: 創建協程
 * async def py_delay(seconds):
 *     await asyncio.sleep(seconds)
 *     return f"等待了 {seconds} 秒"
 * 
 * # Python: async 函數
 * async def py_async_function():
 *     print("Python: 開始")
 *     result = await py_delay(1)
 *     print(f"Python: {result}")
 *     return "Python 完成"
 * 
 * # 執行協程
 * asyncio.run(py_async_function())
 */

// 執行 JavaScript 函數
jsAsyncFunction().then(result => {
  console.log("JS 最終結果:", result);
});

// ========================
// 並行性對比
// ========================

// JavaScript: 並行執行多個 Promise
async function jsParallel() {
  console.log("JS 並行: 開始");
  
  // 啟動多個非同步操作並同時等待結果
  const results = await Promise.all([
    jsDelay(1000),
    jsDelay(2000),
    jsDelay(1500)
  ]);
  
  console.log("JS 並行結果:", results);
  return "JS 並行完成";
}

/**
 * Python 對應:
 * 
 * async def py_parallel():
 *     print("Python 並行: 開始")
 *     
 *     # 啟動多個協程並同時等待結果
 *     results = await asyncio.gather(
 *         py_delay(1),
 *         py_delay(2),
 *         py_delay(1.5)
 *     )
 *     
 *     print(f"Python 並行結果: {results}")
 *     return "Python 並行完成"
 */

jsParallel().then(console.log);

// ========================
// 錯誤處理對比
// ========================

// JavaScript: 錯誤處理
function jsRiskyOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        resolve("成功");
      } else {
        reject(new Error("JS 操作失敗"));
      }
    }, 1000);
  });
}

async function jsErrorHandling() {
  try {
    console.log("JS 嘗試風險操作");
    const result = await jsRiskyOperation();
    console.log("JS 結果:", result);
  } catch (error) {
    console.error("JS 錯誤:", error.message);
  }
}

/**
 * Python 對應:
 * 
 * async def py_risky_operation():
 *     await asyncio.sleep(1)
 *     if random.random() < 0.5:
 *         return "成功"
 *     else:
 *         raise Exception("Python 操作失敗")
 * 
 * async def py_error_handling():
 *     try:
 *         print("Python 嘗試風險操作")
 *         result = await py_risky_operation()
 *         print(f"Python 結果: {result}")
 *     except Exception as e:
 *         print(f"Python 錯誤: {e}")
 */

jsErrorHandling();

// ========================
// 取消操作對比
// ========================

// JavaScript: 使用 AbortController 取消操作
function jsCancellableOperation(signal) {
  return new Promise((resolve, reject) => {
    // 檢查是否已取消
    if (signal.aborted) {
      reject(new Error("操作已取消"));
      return;
    }
    
    const timer = setTimeout(() => {
      resolve("操作完成");
    }, 5000);
    
    // 監聽取消事件
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("操作已取消"));
    });
  });
}

async function jsDemoCancellation() {
  const controller = new AbortController();
  const signal = controller.signal;
  
  // 2 秒後取消操作
  setTimeout(() => {
    console.log("JS: 取消操作");
    controller.abort();
  }, 2000);
  
  try {
    console.log("JS: 開始長時間操作");
    const result = await jsCancellableOperation(signal);
    console.log("JS 結果:", result);  // 不會執行到這裡
  } catch (error) {
    console.error("JS:", error.message);
  }
}

/**
 * Python 對應:
 * 
 * async def py_cancellable_operation():
 *     try:
 *         await asyncio.sleep(5)
 *         return "操作完成"
 *     except asyncio.CancelledError:
 *         print("Python: 操作被取消")
 *         raise
 * 
 * async def py_demo_cancellation():
 *     # 創建任務
 *     task = asyncio.create_task(py_cancellable_operation())
 *     
 *     # 2 秒後取消任務
 *     await asyncio.sleep(2)
 *     print("Python: 取消操作")
 *     task.cancel()
 *     
 *     try:
 *         result = await task
 *         print(f"Python 結果: {result}")  # 不會執行到這裡
 *     except asyncio.CancelledError:
 *         print("Python: 任務已取消")
 */

jsDemoCancellation();

// ========================
// 主要差異總結
// ========================

/**
 * 1. 執行環境
 *    JavaScript: 瀏覽器或 Node.js 的單一線程事件循環
 *    Python: asyncio 事件循環，需要明確運行和停止
 * 
 * 2. 語法風格
 *    JavaScript: Promise 鏈或 async/await
 *    Python: 主要用 async/await (Python 3.5+)
 * 
 * 3. 並行處理
 *    JavaScript: Promise.all, Promise.race
 *    Python: asyncio.gather, asyncio.wait, asyncio.as_completed
 * 
 * 4. 取消操作
 *    JavaScript: AbortController/AbortSignal (較新)
 *    Python: Task.cancel() 和處理 CancelledError
 * 
 * 5. 整合其他 I/O
 *    JavaScript: 內建支持非同步 I/O
 *    Python: 需要專門的非同步庫 (aiohttp, asyncpg 等)
 */

// ========================
// 實用技巧
// ========================

// JavaScript 對 Python 開發者的提示：
// 1. 記住所有 async 函數都返回 Promise
// 2. 瀏覽器環境中無需啟動事件循環，它已經在運行
// 3. 使用 Promise.all 代替 asyncio.gather
// 4. 在 Node.js 中，許多模組同時提供回調和 Promise API
// 5. 使用第三方庫如 axios 處理 HTTP 請求，而非 fetch 