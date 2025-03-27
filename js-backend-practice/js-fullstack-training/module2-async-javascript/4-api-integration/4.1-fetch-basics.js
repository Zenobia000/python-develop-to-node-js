/**
 * Fetch API 基礎 - 為 Python 開發者準備
 * 
 * Fetch API 是瀏覽器提供的現代化 HTTP 請求接口
 * 類似於 Python 中的 requests 或 aiohttp
 */

// ========================
// 基本 Fetch 用法
// ========================

// 基本 GET 請求
function basicFetch() {
  console.log("示例 1: 基本 GET 請求");
  
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => {
      // 檢查響應狀態
      if (!response.ok) {
        throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
      }
      
      // 解析 JSON 響應
      return response.json();
    })
    .then(data => {
      console.log("獲取的數據:", data);
    })
    .catch(error => {
      console.error("錯誤:", error);
    });
}

// 使用 async/await 的 Fetch
async function fetchWithAsyncAwait() {
  console.log("\n示例 2: 使用 async/await 的 Fetch");
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const users = await response.json();
    console.log(`獲取了 ${users.length} 個用戶`);
    console.log("第一個用戶:", users[0].name);
    
    return users;
  } catch (error) {
    console.error("錯誤:", error);
    return [];
  }
}

// 調用基本示例
basicFetch();
setTimeout(() => fetchWithAsyncAwait(), 1000);

// ========================
// 不同 HTTP 方法
// ========================

// POST 請求
async function postExample() {
  console.log("\n示例 3: POST 請求");
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '使用 Fetch 的 POST 請求',
        body: '這是請求內容',
        userId: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("POST 響應:", data);
    return data;
  } catch (error) {
    console.error("POST 錯誤:", error);
    return null;
  }
}

// PUT 和 DELETE 請求
async function putAndDeleteExample() {
  console.log("\n示例 4: PUT 和 DELETE 請求");
  
  try {
    // PUT 請求: 更新資源
    const putResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 1,
        title: '更新的標題',
        body: '更新的內容',
        userId: 1
      })
    });
    
    if (!putResponse.ok) {
      throw new Error(`PUT 請求錯誤! 狀態碼: ${putResponse.status}`);
    }
    
    const putData = await putResponse.json();
    console.log("PUT 響應:", putData);
    
    // DELETE 請求: 刪除資源
    const deleteResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`DELETE 請求錯誤! 狀態碼: ${deleteResponse.status}`);
    }
    
    console.log("DELETE 響應狀態:", deleteResponse.status);
    
    return { put: putData, delete: deleteResponse.status };
  } catch (error) {
    console.error("PUT/DELETE 錯誤:", error);
    return null;
  }
}

// 延遲執行
setTimeout(() => postExample(), 2000);
setTimeout(() => putAndDeleteExample(), 3000);

// ========================
// 設置請求頭和查詢參數
// ========================

// 帶有請求頭和查詢參數的請求
async function headersAndParams() {
  console.log("\n示例 5: 請求頭和查詢參數");
  
  try {
    // 構建 URL 查詢參數
    const params = new URLSearchParams({
      _limit: 3,
      _sort: 'id',
      _order: 'desc'
    });
    
    // 發送請求
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Custom-Header': 'custom-value'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`獲取了 ${data.length} 條評論`);
    console.log("請求頭:", response.headers.get('content-type'));
    
    return data;
  } catch (error) {
    console.error("錯誤:", error);
    return [];
  }
}

// 延遲執行
setTimeout(() => headersAndParams(), 4000);

/**
 * Python 與 JavaScript 的 HTTP 請求對比:
 * 
 * JavaScript (Fetch)          | Python (requests)          | Python (aiohttp)
 * ---------------------------|----------------------------|---------------------------
 * fetch(url)                 | requests.get(url)          | async with session.get(url) as resp
 * response.json()            | response.json()            | await response.json()
 * response.text()            | response.text              | await response.text()
 * response.ok                | response.ok                | response.status < 400
 * response.status            | response.status_code       | response.status
 * headers: {'Content-Type'}  | headers={'Content-Type'}   | headers={'Content-Type'}
 * method: 'POST'             | requests.post()            | session.post()
 * body: JSON.stringify(data) | json=data                  | json=data
 */

// ========================
// 實用技巧與注意事項
// ========================

/**
 * Fetch API 最佳實踐:
 * 
 * 1. 始終檢查 response.ok
 * 2. 使用 try/catch 包裝 fetch 調用
 * 3. 對大型數據使用流處理 (response.body)
 * 4. 正確設置 Content-Type 頭部
 * 5. 使用 AbortController 取消請求
 * 6. 在 Node.js 環境中使用 node-fetch 或 cross-fetch
 * 7. 創建基本的包裝函數簡化重複的 fetch 調用
 * 8. 考慮使用 axios 等庫，獲得更多功能
 */

// 可重用的 fetch 函數包裝器
async function apiFetch(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// 使用包裝後的函數
setTimeout(() => {
  console.log("\n示例 6: 使用包裝後的 Fetch");
  
  apiFetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(data => console.log("簡化的 fetch 結果:", data))
    .catch(error => console.error("簡化的 fetch 錯誤:", error));
}, 5000); 