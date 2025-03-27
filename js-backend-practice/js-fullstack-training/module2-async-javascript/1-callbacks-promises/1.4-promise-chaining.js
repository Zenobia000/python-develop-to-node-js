/**
 * Promise 鏈式呼叫 - 為 Python 開發者準備
 * 
 * Promise 可以通過 .then() 鏈式呼叫，實現序列操作
 * 這類似於 Python 中的 await 序列
 */

// ========================
// 基本 Promise 鏈式呼叫
// ========================

// 簡單的 Promise 函數
function step1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("步驟 1 完成");
      resolve(100);
    }, 1000);
  });
}

function step2(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("步驟 2 完成，接收值:", value);
      resolve(value + 50);
    }, 1000);
  });
}

function step3(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("步驟 3 完成，接收值:", value);
      resolve(value * 2);
    }, 1000);
  });
}

// 開始鏈式調用
console.log("開始 Promise 鏈式調用");

step1()
  .then(result => {
    console.log("從步驟 1 獲得:", result);
    return step2(result);  // 返回新的 Promise
  })
  .then(result => {
    console.log("從步驟 2 獲得:", result);
    return step3(result);  // 返回新的 Promise
  })
  .then(finalResult => {
    console.log("最終結果:", finalResult);
  })
  .catch(error => {
    console.error("過程中出錯:", error);
  });

/**
 * Python 中的對應:
 * 
 * import asyncio
 * 
 * async def step1():
 *     await asyncio.sleep(1)
 *     print("步驟 1 完成")
 *     return 100
 * 
 * async def step2(value):
 *     await asyncio.sleep(1)
 *     print(f"步驟 2 完成，接收值: {value}")
 *     return value + 50
 * 
 * async def step3(value):
 *     await asyncio.sleep(1)
 *     print(f"步驟 3 完成，接收值: {value}")
 *     return value * 2
 * 
 * async def main():
 *     try:
 *         result1 = await step1()
 *         print(f"從步驟 1 獲得: {result1}")
 *         
 *         result2 = await step2(result1)
 *         print(f"從步驟 2 獲得: {result2}")
 *         
 *         result3 = await step3(result2)
 *         print(f"最終結果: {result3}")
 *     except Exception as e:
 *         print(f"過程中出錯: {e}")
 * 
 * asyncio.run(main())
 */

// ========================
// 錯誤處理與恢復
// ========================

// 創建可能失敗的 Promise
function riskyOperation(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% 失敗機率
      if (Math.random() < 0.5) {
        console.log(`操作 ${id} 成功`);
        resolve(`操作 ${id} 的結果`);
      } else {
        console.log(`操作 ${id} 失敗`);
        reject(new Error(`操作 ${id} 失敗`));
      }
    }, 1000);
  });
}

// 錯誤處理鏈式調用
riskyOperation(1)
  .then(result => {
    console.log("第一個操作結果:", result);
    return riskyOperation(2);
  })
  .then(result => {
    console.log("第二個操作結果:", result);
    return riskyOperation(3);
  })
  .catch(error => {
    // 這會捕獲鏈中任何操作的錯誤
    console.error("處理錯誤:", error.message);
    
    // 恢復並提供默認值繼續鏈式調用
    return "默認恢復值";
  })
  .then(result => {
    // 如果前面的操作出錯，result 會是 "默認恢復值"
    console.log("鏈式調用繼續，值:", result);
    return "最終結果";
  })
  .then(finalResult => {
    console.log("完整鏈式調用的最終結果:", finalResult);
  });

// ========================
// 重要注意事項
// ========================

// 1. 始終在 .then() 中返回值或 Promise，否則下一個 .then() 將接收 undefined
// 2. 一個 .catch() 可以處理之前所有的 Promise 錯誤
// 3. 在 .catch() 後可以繼續鏈式調用
// 4. .finally() 可以在結束時進行清理，無論成功或失敗 