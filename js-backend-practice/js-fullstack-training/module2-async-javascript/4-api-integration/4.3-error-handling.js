/**
 * API 錯誤處理 - 為 Python 開發者準備
 * 
 * 本文件展示如何在 JavaScript 中處理 API 調用時的各種錯誤情況
 * 類似於 Python 中 requests 或 httpx 的錯誤處理機制
 */

// ========================
// 模擬 API 請求庫
// ========================

// 模擬各種 API 響應情況
function simulateAPICall(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`呼叫 API: ${endpoint}`);
    
    // 延遲模擬網絡請求
    setTimeout(() => {
      // 模擬不同的錯誤情況
      if (endpoint.includes('network-error')) {
        // 網絡錯誤，例如斷網
        reject(new Error('無法連接到伺服器，請檢查網絡連接'));
        return;
      }
      
      if (endpoint.includes('timeout')) {
        // 超時
        reject(new Error('請求超時，伺服器無響應'));
        return;
      }
      
      // 模擬 HTTP 狀態碼錯誤
      let status = 200;
      let statusText = 'OK';
      let data = { success: true, message: '請求成功' };
      
      if (endpoint.includes('404')) {
        status = 404;
        statusText = 'Not Found';
        data = { success: false, message: '找不到資源' };
      } else if (endpoint.includes('401')) {
        status = 401;
        statusText = 'Unauthorized';
        data = { success: false, message: '未授權，請登錄' };
      } else if (endpoint.includes('403')) {
        status = 403;
        statusText = 'Forbidden';
        data = { success: false, message: '禁止訪問此資源' };
      } else if (endpoint.includes('500')) {
        status = 500;
        statusText = 'Internal Server Error';
        data = { success: false, message: '伺服器內部錯誤' };
      } else if (endpoint.includes('validation-error')) {
        status = 422;
        statusText = 'Unprocessable Entity';
        data = { 
          success: false, 
          message: '驗證錯誤',
          errors: {
            email: '無效的電子郵件格式',
            password: '密碼長度必須至少為6個字符'
          }
        };
      } else if (endpoint.includes('malformed-json')) {
        // 模擬解析 JSON 錯誤
        resolve({
          status: 200,
          statusText: 'OK',
          json: () => Promise.reject(new Error('JSON 解析錯誤，無效的 JSON 格式')),
          text: () => Promise.resolve('{"broken JSON":]')
        });
        return;
      }
      
      // 創建模擬響應對象
      resolve({
        status,
        statusText,
        ok: status >= 200 && status < 300,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
        headers: {
          get: (name) => {
            const headers = {
              'content-type': 'application/json'
            };
            return headers[name.toLowerCase()];
          }
        }
      });
    }, 500);
  });
}

// ========================
// 基本錯誤處理
// ========================

// 處理 API 錯誤的基本方法
async function basicErrorHandling() {
  console.log("示例 1: 基本錯誤處理");
  
  try {
    // 發起請求
    const response = await simulateAPICall('/api/users');
    
    // 檢查 HTTP 狀態
    if (!response.ok) {
      throw new Error(`HTTP 錯誤: ${response.status} ${response.statusText}`);
    }
    
    // 解析 JSON
    const data = await response.json();
    console.log("請求成功:", data);
    
    return data;
  } catch (error) {
    console.error("錯誤處理:", error.message);
    return { success: false, message: error.message };
  }
}

// 調用基本示例
basicErrorHandling();

// ========================
// HTTP 狀態碼錯誤處理
// ========================

// 處理不同的 HTTP 狀態碼
async function handleHttpStatusErrors() {
  console.log("\n示例 2: HTTP 狀態碼錯誤處理");
  
  // 處理 404 錯誤
  try {
    console.log("嘗試訪問不存在的資源...");
    const response = await simulateAPICall('/api/users/404');
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error("資源不存在!");
        return { success: false, code: 'NOT_FOUND' };
      }
      throw new Error(`HTTP 錯誤: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("404 錯誤處理:", error.message);
    return { success: false, message: error.message };
  }
}

// 授權錯誤處理
async function handleAuthErrors() {
  console.log("\n示例 3: 授權錯誤處理");
  
  try {
    console.log("嘗試訪問需要授權的資源...");
    const response = await simulateAPICall('/api/users/401');
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("未授權訪問! 需要登錄");
        // 在實際應用中，可能會重定向到登錄頁面
        // window.location.href = '/login';
        return { success: false, code: 'UNAUTHORIZED' };
      } else if (response.status === 403) {
        console.error("禁止訪問! 權限不足");
        return { success: false, code: 'FORBIDDEN' };
      }
      throw new Error(`HTTP 錯誤: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("授權錯誤處理:", error.message);
    return { success: false, message: error.message };
  }
}

// 伺服器錯誤處理
async function handleServerErrors() {
  console.log("\n示例 4: 伺服器錯誤處理");
  
  try {
    console.log("嘗試訪問產生伺服器錯誤的端點...");
    const response = await simulateAPICall('/api/users/500');
    
    if (!response.ok) {
      if (response.status >= 500) {
        console.error("伺服器錯誤! 請稍後再試");
        // 在實際應用中，可能會顯示一個友好的錯誤頁面
        // 或者嘗試重新加載
        return { success: false, code: 'SERVER_ERROR' };
      }
      throw new Error(`HTTP 錯誤: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("伺服器錯誤處理:", error.message);
    return { success: false, message: error.message };
  }
}

// 延遲執行狀態碼處理示例
setTimeout(() => handleHttpStatusErrors(), 1000);
setTimeout(() => handleAuthErrors(), 2000);
setTimeout(() => handleServerErrors(), 3000);

// ========================
// 高級錯誤處理
// ========================

// 驗證錯誤處理
async function handleValidationErrors() {
  console.log("\n示例 5: 表單驗證錯誤處理");
  
  try {
    console.log("嘗試處理驗證錯誤...");
    const response = await simulateAPICall('/api/users/validation-error');
    
    if (!response.ok) {
      if (response.status === 422) {
        // 獲取詳細的驗證錯誤信息
        const errorData = await response.json();
        console.error("表單驗證失敗:");
        
        if (errorData.errors) {
          // 處理每個字段的錯誤
          Object.entries(errorData.errors).forEach(([field, error]) => {
            console.error(`- ${field}: ${error}`);
            // 在實際應用中，可能會更新 UI 顯示錯誤
            // document.getElementById(`${field}-error`).textContent = error;
          });
        }
        
        return { success: false, errors: errorData.errors };
      }
      throw new Error(`HTTP 錯誤: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("驗證錯誤處理:", error.message);
    return { success: false, errors: {} };
  }
}

// 網絡錯誤與超時處理
async function handleNetworkAndTimeoutErrors() {
  console.log("\n示例 6: 網絡錯誤與超時處理");
  
  // 處理網絡錯誤
  try {
    console.log("嘗試處理網絡錯誤...");
    await simulateAPICall('/api/network-error');
    
    // 這行代碼不會執行，因為上面會拋出網絡錯誤
    return { success: true };
  } catch (error) {
    console.error("網絡錯誤:", error.message);
    console.log("顯示離線模式選項或使用本地緩存數據");
    
    // 檢查是否有緩存數據
    const cachedData = null; // 實際應用中，這可能是從 localStorage 讀取
    return { success: false, offline: true, data: cachedData };
  }
}

// 解析錯誤處理
async function handleParsingErrors() {
  console.log("\n示例 7: JSON 解析錯誤處理");
  
  try {
    console.log("嘗試處理 JSON 解析錯誤...");
    const response = await simulateAPICall('/api/malformed-json');
    
    // 嘗試解析 JSON
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      console.error("JSON 解析錯誤:", parseError.message);
      
      // 嘗試獲取原始文本
      const text = await response.text();
      console.log("收到的原始響應:", text);
      
      throw new Error("服務器返回了無效的數據格式");
    }
  } catch (error) {
    console.error("總體錯誤:", error.message);
    return { success: false, message: "數據處理失敗" };
  }
}

// 延遲執行高級錯誤處理
setTimeout(() => handleValidationErrors(), 4000);
setTimeout(() => handleNetworkAndTimeoutErrors(), 5000);
setTimeout(() => handleParsingErrors(), 6000);

// ========================
// 集中式錯誤處理
// ========================

// 創建集中式 API 調用器
function createAPIClient() {
  console.log("\n示例 8: 集中式錯誤處理");
  
  // 自定義錯誤類
  class APIError extends Error {
    constructor(message, status, data = null) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }
  
  // API 調用函數
  async function callAPI(endpoint, options = {}) {
    try {
      console.log(`API 調用: ${endpoint}`);
      const response = await simulateAPICall(endpoint, options);
      
      if (!response.ok) {
        // 嘗試獲取錯誤細節
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e) {
          // 解析失敗
        }
        
        // 根據狀態碼拋出相應的錯誤
        switch (response.status) {
          case 401:
            throw new APIError('需要授權', response.status, errorData);
          case 403:
            throw new APIError('權限不足', response.status, errorData);
          case 404:
            throw new APIError('資源不存在', response.status, errorData);
          case 422:
            throw new APIError('驗證失敗', response.status, errorData);
          case 500:
          case 502:
          case 503:
            throw new APIError('伺服器錯誤', response.status, errorData);
          default:
            throw new APIError(`HTTP 錯誤: ${response.status}`, response.status, errorData);
        }
      }
      
      // 成功響應
      return await response.json();
    } catch (error) {
      // 處理網絡錯誤
      if (!(error instanceof APIError)) {
        if (error.message.includes('timeout')) {
          throw new APIError('請求超時', 0, null);
        } else {
          throw new APIError('網絡錯誤', 0, null);
        }
      }
      
      // 重新拋出 API 錯誤
      throw error;
    }
  }
  
  // 使用集中式錯誤處理
  async function testCentralizedErrorHandling() {
    try {
      // 測試不同的端點
      const successData = await callAPI('/api/users');
      console.log("成功響應:", successData);
      
      await callAPI('/api/users/404');
    } catch (error) {
      if (error instanceof APIError) {
        console.error(`API 錯誤 (${error.status}): ${error.message}`);
        
        // 根據錯誤類型處理
        switch (error.status) {
          case 401:
            console.log("重定向到登錄頁面");
            break;
          case 403:
            console.log("顯示禁止訪問消息");
            break;
          case 404:
            console.log("顯示資源不存在消息");
            break;
          case 422:
            if (error.data && error.data.errors) {
              console.log("顯示表單驗證錯誤:", error.data.errors);
            }
            break;
          case 500:
          case 502:
          case 503:
            console.log("顯示伺服器錯誤消息，建議用戶稍後再試");
            break;
          case 0:
            console.log("顯示網絡錯誤消息，檢查連接");
            break;
        }
      } else {
        console.error("未知錯誤:", error);
      }
    }
  }
  
  testCentralizedErrorHandling();
  
  return { callAPI };
}

// 延遲執行集中式錯誤處理
setTimeout(() => createAPIClient(), 7000);

// ========================
// 實用技巧與最佳實踐
// ========================

/**
 * API 錯誤處理最佳實踐:
 * 
 * 1. 創建自定義錯誤類 - 提供更多上下文
 * 2. 集中處理常見錯誤 - 避免重複代碼
 * 3. 區分不同類型的錯誤 - 網絡、HTTP 狀態、解析錯誤
 * 4. 實現重試機制 - 特別是對於網絡錯誤和服務器錯誤
 * 5. 為用戶提供有用的錯誤消息 - 避免技術細節
 * 6. 記錄詳細錯誤信息 - 用於調試和監控
 * 7. 在 UI 中優雅處理錯誤 - 避免空白頁面
 * 8. 保持一致的錯誤處理模式 - 跨整個應用
 */

// Python 對比
/**
 * Python 中的類似錯誤處理:
 * 
 * # requests 中的錯誤處理
 * import requests
 * from requests.exceptions import RequestException, HTTPError, Timeout, ConnectionError
 * 
 * try:
 *     response = requests.get("https://api.example.com/users")
 *     response.raise_for_status()  # 如果狀態碼 >= 400，拋出 HTTPError
 *     data = response.json()
 * except HTTPError as e:
 *     # 處理 HTTP 錯誤
 *     if e.response.status_code == 404:
 *         print("資源不存在")
 *     elif e.response.status_code == 401:
 *         print("需要授權")
 * except ValueError as e:
 *     # JSON 解析錯誤
 *     print("無效的 JSON 響應")
 * except Timeout:
 *     # 超時錯誤
 *     print("請求超時")
 * except ConnectionError:
 *     # 連接錯誤
 *     print("網絡連接錯誤")
 * except RequestException as e:
 *     # 所有其他請求錯誤
 *     print(f"請求錯誤: {e}")
 */ 