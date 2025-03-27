/**
 * 競態條件與 Promise.race - 為 Python 開發者準備
 * 
 * 本文件展示如何處理競態條件，以及如何使用 Promise.race 和相關的競態模式
 */

// ========================
// 基本 Promise.race 用法
// ========================

// 創建延遲不同的幾個 Promise
function fetchWithTimeout(id, delay) {
  console.log(`開始請求 ${id}，延遲 ${delay}ms`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`請求 ${id} 完成`);
      resolve({ id, result: `數據 ${id}`, time: delay });
    }, delay);
  });
}

// 使用 Promise.race 獲取最快返回的結果
console.log("示例 1: 基本 Promise.race");

Promise.race([
  fetchWithTimeout("A", 2000),
  fetchWithTimeout("B", 1000),  // 這個會最快返回
  fetchWithTimeout("C", 3000)
])
.then(winner => {
  console.log("最快完成的請求:", winner);
  // 注意: 其他請求仍會繼續執行完畢
});

/**
 * Python 中的對應:
 * 
 * async def main():
 *     # 創建任務但不 await
 *     task_a = fetch_with_timeout("A", 2)
 *     task_b = fetch_with_timeout("B", 1)
 *     task_c = fetch_with_timeout("C", 3)
 *     
 *     # 等待第一個完成的任務
 *     done, pending = await asyncio.wait(
 *         [task_a, task_b, task_c],
 *         return_when=asyncio.FIRST_COMPLETED
 *     )
 *     
 *     # 獲取結果
 *     winner = list(done)[0].result()
 *     print(f"最快完成的請求: {winner}")
 *     
 *     # 可以選擇取消其他任務
 *     for task in pending:
 *         task.cancel()
 */

// ========================
// 超時控制模式
// ========================

// 創建一個超時 Promise
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`操作超時 (${ms}ms)`));
    }, ms);
  });
}

// 超時控制函數
async function fetchWithTimeoutControl(id, delay, timeoutMs) {
  try {
    console.log(`執行請求 ${id}，設置超時 ${timeoutMs}ms`);
    
    // 使用 Promise.race 在請求和超時之間競爭
    const result = await Promise.race([
      fetchWithTimeout(id, delay),
      timeout(timeoutMs)
    ]);
    
    console.log(`請求 ${id} 在超時前完成`);
    return result;
  } catch (error) {
    console.error(`請求 ${id} 錯誤:`, error.message);
    throw error;
  }
}

// 測試超時控制
setTimeout(() => {
  console.log("\n示例 2: 超時控制");
  
  // 成功案例 - 請求在超時前完成
  fetchWithTimeoutControl("D", 1500, 2000)
    .then(result => {
      console.log("成功結果:", result);
    })
    .catch(error => {
      console.error("不應該看到這個錯誤:", error);
    });
  
  // 失敗案例 - 請求超時
  fetchWithTimeoutControl("E", 3000, 1500)
    .then(result => {
      console.log("不應該看到這個結果:", result);
    })
    .catch(error => {
      console.error("預期的超時錯誤:", error.message);
    });
}, 4000);

/**
 * Python 中的對應:
 * 
 * async def fetch_with_timeout_control(id, delay, timeout_ms):
 *     try:
 *         # 創建主任務和超時任務
 *         task = asyncio.create_task(fetch_with_timeout(id, delay))
 *         
 *         # 等待任務或超時
 *         try:
 *             result = await asyncio.wait_for(task, timeout=timeout_ms/1000)
 *             print(f"請求 {id} 在超時前完成")
 *             return result
 *         except asyncio.TimeoutError:
 *             # 處理超時
 *             raise TimeoutError(f"操作超時 ({timeout_ms}ms)")
 *     except Exception as e:
 *         print(f"請求 {id} 錯誤: {e}")
 *         raise
 */

// ========================
// Promise.any 用法 (ES2021)
// ========================

// 和 Promise.race 類似，但只關注成功的 Promise
setTimeout(() => {
  console.log("\n示例 3: Promise.any - 獲取第一個成功結果");
  
  // 創建一些會成功或失敗的 Promise
  const promises = [
    // 1500ms 後失敗
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("第一個操作失敗")), 1500)),
    
    // 2000ms 後成功
    new Promise(resolve => 
      setTimeout(() => {
        console.log("第二個操作成功");
        resolve("成功結果 2");
      }, 2000)),
    
    // 1000ms 後成功
    new Promise(resolve => 
      setTimeout(() => {
        console.log("第三個操作成功");
        resolve("成功結果 3");
      }, 1000))
  ];
  
  // Promise.any 會返回第一個成功的結果
  Promise.any(promises)
    .then(result => {
      console.log("第一個成功的結果:", result);  // 成功結果 3
    })
    .catch(error => {
      console.error("所有 Promise 都失敗了:", error);
    });
}, 10000);

/**
 * Python 中的對應 (Python 3.11+):
 * 
 * async def demo_any():
 *     # 創建任務
 *     task1 = asyncio.create_task(failing_operation(1.5))
 *     task2 = asyncio.create_task(successful_operation(2, "成功結果 2"))
 *     task3 = asyncio.create_task(successful_operation(1, "成功結果 3"))
 *     
 *     # 等待第一個成功的任務
 *     try:
 *         result = await asyncio.wait_for(
 *             asyncio.wait([task1, task2, task3], 
 *                          return_when=asyncio.FIRST_COMPLETED),
 *             timeout=None
 *         )
 *         
 *         done, pending = result
 *         for task in done:
 *             try:
 *                 return task.result()
 *             except Exception:
 *                 continue  # 忽略失敗的任務
 *         
 *         # 如果所有完成的任務都失敗，等待其他任務
 *         for task in pending:
 *             try:
 *                 return await task
 *             except Exception:
 *                 continue
 *         
 *         raise Exception("所有任務都失敗了")
 *     except Exception as e:
 *         print(f"所有 Promise 都失敗了: {e}")
 */

// ========================
// 取消操作
// ========================

// 使用 AbortController 取消操作 (現代瀏覽器支持)
async function longOperation(signal) {
  return new Promise((resolve, reject) => {
    // 檢查是否已經被取消
    if (signal.aborted) {
      reject(new Error("操作已取消"));
      return;
    }
    
    console.log("長時間操作開始...");
    
    // 模擬長時間操作
    const timer = setTimeout(() => {
      console.log("長時間操作完成");
      resolve("操作結果");
    }, 5000);
    
    // 設置取消監聽器
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("操作被取消"));
    });
  });
}

// 演示取消
setTimeout(() => {
  console.log("\n示例 4: 取消長時間操作");
  
  const controller = new AbortController();
  const signal = controller.signal;
  
  // 啟動長時間操作
  const operationPromise = longOperation(signal)
    .then(result => {
      console.log("操作完成:", result);
    })
    .catch(error => {
      console.error("操作錯誤:", error.message);
    });
  
  // 2秒後取消操作
  setTimeout(() => {
    console.log("觸發取消...");
    controller.abort();
  }, 2000);
}, 16000);

// ========================
// 實用技巧與建議
// ========================

/**
 * 競態條件處理最佳實踐:
 * 
 * 1. 使用 Promise.race 處理超時和競態場景
 * 2. 使用 AbortController 取消進行中的操作
 * 3. 使用 Promise.any 獲取第一個成功的結果
 * 4. 注意未完成的 Promise - 它們仍會繼續執行（除非明確取消）
 * 5. 實現可重試機制處理暫時性失敗
 * 6. 確保所有 API 調用都有超時控制，避免無限等待
 * 7. 在 UI 中提供取消操作的機制
 */ 