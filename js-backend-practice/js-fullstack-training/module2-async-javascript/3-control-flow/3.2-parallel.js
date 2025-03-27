/**
 * 非同步並行執行 - 為 Python 開發者準備
 * 
 * 本文件展示如何同時執行多個非同步操作，提高效率
 */

// ========================
// 模擬異步操作
// ========================

// 模擬 API 請求，延遲時間可變
function fetchData(id, delay = 1000) {
  console.log(`開始獲取數據 ${id}，預計耗時 ${delay}ms`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`數據 ${id} 獲取完成`);
      resolve({ id, data: `資料內容 ${id}`, timestamp: Date.now() });
    }, delay);
  });
}

// ========================
// 1. 使用 Promise.all 並行執行
// ========================

console.log("示例 1: 使用 Promise.all 並行執行");
console.time("Promise.all 總耗時");

// 創建多個 Promise
const promises = [
  fetchData(1, 2000),
  fetchData(2, 1000),
  fetchData(3, 1500)
];

// 同時執行所有 Promise
Promise.all(promises)
  .then(results => {
    console.log("所有數據獲取完成:", results);
    console.timeEnd("Promise.all 總耗時");
  })
  .catch(error => {
    console.error("至少有一個請求失敗:", error);
    console.timeEnd("Promise.all 總耗時");
  });

/**
 * Python 中的對應:
 * 
 * async def get_all_data():
 *     tasks = [
 *         fetch_data(1, 2),
 *         fetch_data(2, 1),
 *         fetch_data(3, 1.5)
 *     ]
 *     
 *     # 並行執行所有任務
 *     results = await asyncio.gather(*tasks)
 *     print("所有數據獲取完成:", results)
 */

// ========================
// 2. 使用 async/await 與 Promise.all
// ========================

async function fetchMultipleData() {
  console.log("\n示例 2: 使用 async/await 結合 Promise.all");
  console.time("async/await Promise.all 總耗時");
  
  try {
    // 在 async 函數中使用 Promise.all
    const results = await Promise.all([
      fetchData(4, 1800),
      fetchData(5, 1200),
      fetchData(6, 900)
    ]);
    
    console.log("所有數據獲取完成:", results);
    console.timeEnd("async/await Promise.all 總耗時");
    return results;
  } catch (error) {
    console.error("至少有一個請求失敗:", error);
    console.timeEnd("async/await Promise.all 總耗時");
    throw error;
  }
}

// 延遲執行，不干擾前一個示例
setTimeout(() => {
  fetchMultipleData()
    .then(data => console.log("返回的所有數據長度:", data.length));
}, 6000);

// ========================
// 3. 動態創建並並行執行任務
// ========================

async function fetchDataForUsers(userIds) {
  console.log(`\n示例 3: 為多個用戶 ${userIds} 並行獲取數據`);
  console.time("動態任務總耗時");
  
  try {
    // 為每個用戶 ID 創建一個獲取數據的 Promise
    const userPromises = userIds.map(userId => {
      // 為每個請求生成隨機延遲，模擬真實場景
      const delay = 500 + Math.floor(Math.random() * 2000);
      return fetchData(`user_${userId}`, delay);
    });
    
    // 並行執行所有請求
    const results = await Promise.all(userPromises);
    
    console.log(`所有 ${userIds.length} 個用戶的數據獲取完成`);
    console.timeEnd("動態任務總耗時");
    return results;
  } catch (error) {
    console.error("獲取用戶數據過程中出錯:", error);
    console.timeEnd("動態任務總耗時");
    throw error;
  }
}

// 延遲執行，不干擾前一個示例
setTimeout(() => {
  fetchDataForUsers([101, 102, 103, 104, 105])
    .then(data => {
      // 處理結果，如提取所有 ID
      const ids = data.map(item => item.id);
      console.log("獲取的所有用戶數據 ID:", ids);
    })
    .catch(error => {
      console.error("用戶數據獲取失敗:", error);
    });
}, 12000);

// ========================
// 4. 處理 Promise.all 中的錯誤
// ========================

// 創建一個可能失敗的 Promise
function fetchWithPossibleError(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // id 為偶數時模擬錯誤
      if (id % 2 === 0) {
        reject(new Error(`ID ${id} 的請求失敗`));
      } else {
        resolve({ id, success: true });
      }
    }, 1000);
  });
}

async function handleAllSettled() {
  console.log("\n示例 4: 處理部分失敗的並行請求");
  
  const ids = [1, 2, 3, 4, 5];
  
  try {
    // 1. 使用 Promise.all - 任何一個失敗都會導致整體失敗
    console.log("使用 Promise.all:");
    await Promise.all(ids.map(id => fetchWithPossibleError(id)));
    console.log("這行不會執行，因為有請求會失敗");
  } catch (error) {
    console.error("Promise.all 失敗:", error.message);
  }
  
  // 2. 使用 Promise.allSettled - 無論成功或失敗都會等待所有完成
  console.log("\n使用 Promise.allSettled:");
  const results = await Promise.allSettled(ids.map(id => fetchWithPossibleError(id)));
  
  // 分析結果
  console.log("所有請求完成，結果:");
  
  const fulfilled = results.filter(r => r.status === 'fulfilled');
  const rejected = results.filter(r => r.status === 'rejected');
  
  console.log(`成功的請求: ${fulfilled.length}`);
  console.log(`失敗的請求: ${rejected.length}`);
  
  // 處理成功的結果
  fulfilled.forEach(result => {
    console.log(`ID ${result.value.id} 成功`);
  });
  
  // 處理失敗的結果
  rejected.forEach((result, index) => {
    console.log(`失敗 ${index+1}: ${result.reason.message}`);
  });
}

// 延遲執行，不干擾前一個示例
setTimeout(() => {
  handleAllSettled()
    .then(() => console.log("所有請求處理完成"));
}, 18000);

// ========================
// 實用技巧與注意事項
// ========================

/**
 * 並行執行最佳實踐:
 * 
 * 1. 使用 Promise.all 當所有任務都需要成功完成
 * 2. 使用 Promise.allSettled 當需要處理部分任務失敗的情況
 * 3. 使用 Promise.race 當只需要最快完成的任務結果
 * 4. 使用 Promise.any 當需要第一個成功的結果 (忽略失敗的)
 * 5. 考慮並行任務的數量，過多可能導致性能問題
 * 6. 可以使用 map 函數為集合中的每個元素創建任務
 * 7. 結合 Promise.all 和 資料分批 處理大量數據
 */ 