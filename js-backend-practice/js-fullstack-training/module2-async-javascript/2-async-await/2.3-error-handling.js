/**
 * Async/Await 錯誤處理 - 為 Python 開發者準備
 * 
 * 在 async/await 中處理錯誤的方式類似於 Python 中的 try/except
 */

// ========================
// 基本錯誤處理
// ========================

// 創建一個可能失敗的 Promise
function fetchData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error("ID 必須為正數"));
      } else {
        resolve(`ID ${id} 的數據`);
      }
    }, 1000);
  });
}

// 使用 try/catch 處理 async/await 錯誤
async function processData(id) {
  try {
    console.log(`處理 ID ${id} 的數據...`);
    const data = await fetchData(id);
    console.log("獲取成功:", data);
    return data;
  } catch (error) {
    console.error("錯誤:", error.message);
    return null; // 返回默認值
  }
}

// 測試成功案例
processData(1).then(result => {
  console.log("成功處理結果:", result);
});

// 測試失敗案例
processData(0).then(result => {
  console.log("失敗處理結果:", result); // 將顯示 null
});

/**
 * Python 中的對應:
 * 
 * import asyncio
 * 
 * async def fetch_data(id):
 *     await asyncio.sleep(1)
 *     if id <= 0:
 *         raise ValueError("ID 必須為正數")
 *     return f"ID {id} 的數據"
 * 
 * async def process_data(id):
 *     try:
 *         print(f"處理 ID {id} 的數據...")
 *         data = await fetch_data(id)
 *         print("獲取成功:", data)
 *         return data
 *     except Exception as e:
 *         print(f"錯誤: {e}")
 *         return None  # 返回默認值
 * 
 * async def main():
 *     # 測試成功案例
 *     result1 = await process_data(1)
 *     print(f"成功處理結果: {result1}")
 *     
 *     # 測試失敗案例
 *     result2 = await process_data(0)
 *     print(f"失敗處理結果: {result2}")  # 將顯示 None
 * 
 * asyncio.run(main())
 */

// ========================
// 錯誤處理最佳實踐
// ========================

// 創建具有不同錯誤類型的函數
function fetchUserDetails(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof userId !== 'number') {
        reject(new TypeError("用戶 ID 必須是數字"));
      } else if (userId <= 0) {
        reject(new RangeError("用戶 ID 必須為正數"));
      } else if (userId > 100) {
        // 模擬未找到用戶
        reject(new Error("用戶不存在"));
      } else {
        resolve({
          id: userId,
          name: `用戶 ${userId}`,
          email: `user${userId}@example.com`
        });
      }
    }, 1000);
  });
}


// 細化的錯誤處理
async function getUserInfo(userId) {
  try {
    console.log(`獲取用戶 ${userId} 的信息...`);
    const user = await fetchUserDetails(userId);
    console.log("用戶信息:", user);
    return user;
  } catch (error) {
    // 根據錯誤類型進行不同處理
    if (error instanceof TypeError) {
      console.error("類型錯誤:", error.message);
      return { error: "無效的用戶 ID 類型" };
    } else if (error instanceof RangeError) {
      console.error("範圍錯誤:", error.message);
      return { error: "用戶 ID 超出有效範圍" };
    } else {
      console.error("一般錯誤:", error.message);
      return { error: "無法獲取用戶信息" };
    }
  }
}

// 測試不同錯誤類型
async function testErrorHandling() {
  const testCases = [
    5,           // 有效 ID
    "invalid",   // 類型錯誤
    -10,         // 範圍錯誤
    999          // 用戶不存在
  ];
  
  for (const testId of testCases) {
    console.log("\n===== 測試用例:", testId, "=====");
    const result = await getUserInfo(testId);
    console.log("處理結果:", result);
  }
}

testErrorHandling();

// ========================
// 自定義錯誤類型
// ========================

// 創建自定義錯誤類
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

// 模擬 API 調用
function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === '/users') {
        resolve({ users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] });
      } else {
        reject(new APIError(`端點 "${endpoint}" 不存在`, 404));
      }
    }, 1000);
  });
}

// 使用自定義錯誤
async function callAPI(endpoint) {
  try {
    console.log(`調用 API: ${endpoint}`);
    const data = await fetchAPI(endpoint);
    console.log("API 返回:", data);
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`API 錯誤 (${error.statusCode}): ${error.message}`);
    } else {
      console.error("未知錯誤:", error);
    }
    
    // 重新拋出錯誤，讓調用者處理
    throw error;
  }
}

// 測試 API 調用
async function testAPICall() {
  try {
    // 成功調用
    await callAPI('/users');
    
    // 失敗調用
    await callAPI('/invalid');
  } catch (error) {
    console.log("主函數捕獲到錯誤，進行優雅處理");
  }
}

testAPICall();

// ========================
// 錯誤處理撇步
// ========================

// 1. 始終對 await 使用 try/catch
// 2. 為特定錯誤類型提供適當的處理
// 3. 使用自定義錯誤類進行更精細的錯誤處理
// 4. 在高層函數中集中處理錯誤，減少重複代碼
// 5. 考慮重試策略處理臨時性錯誤 