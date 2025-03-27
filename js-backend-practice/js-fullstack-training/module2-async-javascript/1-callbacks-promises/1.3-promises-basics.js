/**
 * Promise 基礎 - 為 Python 開發者準備
 * 
 * Promise 是 JavaScript 處理非同步操作的標準方式
 * 類似於 Python 中的 Future 或 asyncio.Task
 */

// ========================
// 基本 Promise 結構
// ========================

// 創建一個 Promise
const myPromise = new Promise((resolve, reject) => {
  // 執行非同步任務
  // - 成功時: 調用 resolve(value)
  // - 失敗時: 調用 reject(error)
  
  const success = true; // 模擬操作結果
  
  if (success) {
    resolve("操作成功!");  // 履行 (fulfilled)
  } else {
    reject(new Error("出現錯誤")); // 拒絕 (rejected)
  }
});

// 使用 Promise
myPromise
  .then(result => {
    console.log("成功結果:", result);
  })
  .catch(error => {
    console.error("錯誤:", error.message);
  });

/**
 * Python 中的類似結構:
 * 
 * import asyncio
 * 
 * async def my_coroutine():
 *     success = True
 *     if success:
 *         return "操作成功!"
 *     else:
 *         raise Exception("出現錯誤")
 * 
 * async def main():
 *     try:
 *         result = await my_coroutine()
 *         print("成功結果:", result)
 *     except Exception as e:
 *         print("錯誤:", str(e))
 * 
 * asyncio.run(main())
 */

// ========================
// 使用 Promise 的實用範例
// ========================

// 模擬 1 秒後獲取數據
function fetchData() {
  return new Promise((resolve, reject) => {
    console.log("正在獲取數據...");
    
    setTimeout(() => {
      const data = { id: 1, name: "產品資料" };
      
      // 假設 10% 的機率失敗
      if (Math.random() < 0.1) {
        reject(new Error("網路錯誤"));
      } else {
        resolve(data);
      }
    }, 1000);
  });
}

// 使用 fetchData 函數
console.log("開始獲取數據");

fetchData()
  .then(data => {
    console.log("獲取的數據:", data);
    return data.id; // 可以返回一個值繼續鏈式調用
  })
  .then(id => {
    console.log("數據 ID:", id);
  })
  .catch(error => {
    console.error("獲取數據時出錯:", error.message);
  })
  .finally(() => {
    console.log("獲取數據操作完成，無論成功或失敗");
  });

console.log("請求已發送，等待數據...");

// ========================
// Promise 狀態
// ========================

/**
 * 一個 Promise 有三種可能的狀態:
 * 1. 等待中 (pending) - 初始狀態
 * 2. 履行 (fulfilled) - 操作成功完成
 * 3. 拒絕 (rejected) - 操作失敗
 * 
 * Promise 一旦履行或拒絕，就會維持在該狀態，不再變化
 */

// ========================
// 實用功能：將回調 API 轉換為 Promise
// ========================

// 原始回調函數
function traditionalCallback(value, callback) {
  setTimeout(() => {
    if (typeof value !== 'number') {
      callback(new Error("值必須是數字"));
      return;
    }
    callback(null, value * 2);
  }, 1000);
}

// 將回調 API 包裝為 Promise
function promisify(value) {
  return new Promise((resolve, reject) => {
    traditionalCallback(value, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// 使用 promisify 函數
promisify(5)
  .then(result => console.log("結果:", result)) // 結果: 10
  .catch(error => console.error("錯誤:", error.message));

promisify("not a number")
  .then(result => console.log("結果:", result))
  .catch(error => console.error("錯誤:", error.message)); // 錯誤: 值必須是數字

/**
 * Python 中的對應可能是將一個回調式 API 包裝為協程:
 * 
 * import asyncio
 * 
 * def traditional_callback(value, callback):
 *     def delayed():
 *         if not isinstance(value, (int, float)):
 *             callback(Exception("值必須是數字"), None)
 *             return
 *         callback(None, value * 2)
 *     
 *     loop = asyncio.get_event_loop()
 *     loop.call_later(1, delayed)
 * 
 * async def promisify(value):
 *     future = asyncio.Future()
 *     
 *     def callback(error, result):
 *         if error:
 *             future.set_exception(error)
 *         else:
 *             future.set_result(result)
 *     
 *     traditional_callback(value, callback)
 *     return await future 