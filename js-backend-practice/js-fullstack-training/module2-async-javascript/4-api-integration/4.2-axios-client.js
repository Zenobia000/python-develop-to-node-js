/**
 * Axios 客戶端 - 為 Python 開發者準備
 * 
 * Axios 是一個基於 Promise 的 HTTP 客戶端，可用於瀏覽器和 Node.js 環境
 * 類似於 Python 中的 requests 庫，提供了比 Fetch API 更多的功能
 * 
 * 注意: 在實際使用中，需要先安裝 Axios:
 * npm install axios
 */

// ========================
// 模擬 Axios 庫 (實際使用中請使用 npm 安裝正式的 Axios)
// ========================

// 這裡模擬 Axios 行為，實際專案中請使用真正的 Axios 庫
const axios = {
  get: (url, config = {}) => {
    console.log(`Axios GET: ${url}`);
    return fetch(url, { 
      method: 'GET',
      headers: config.headers || {}
    })
    .then(response => {
      if (!response.ok) {
        // Axios 風格的錯誤處理
        return Promise.reject({
          response: {
            status: response.status,
            statusText: response.statusText,
            data: null
          },
          message: `Request failed with status ${response.status}`
        });
      }
      return response.json().then(data => ({ data, status: response.status }));
    });
  },
  
  post: (url, data = {}, config = {}) => {
    console.log(`Axios POST: ${url}`);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          response: {
            status: response.status,
            statusText: response.statusText,
            data: null
          },
          message: `Request failed with status ${response.status}`
        });
      }
      return response.json().then(responseData => ({ data: responseData, status: response.status }));
    });
  },
  
  put: (url, data = {}, config = {}) => {
    console.log(`Axios PUT: ${url}`);
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          response: {
            status: response.status,
            statusText: response.statusText,
            data: null
          },
          message: `Request failed with status ${response.status}`
        });
      }
      return response.json().then(responseData => ({ data: responseData, status: response.status }));
    });
  },
  
  delete: (url, config = {}) => {
    console.log(`Axios DELETE: ${url}`);
    return fetch(url, {
      method: 'DELETE',
      headers: config.headers || {}
    })
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          response: {
            status: response.status,
            statusText: response.statusText,
            data: null
          },
          message: `Request failed with status ${response.status}`
        });
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json().then(data => ({ data, status: response.status }));
      }
      return { data: null, status: response.status };
    });
  },
  
  // Axios 攔截器 (Interceptors)
  interceptors: {
    request: {
      use: (successFn, errorFn) => {
        console.log("設置請求攔截器");
        // 在實際的 Axios 中，這會攔截所有請求
        axios._requestInterceptor = { successFn, errorFn };
      }
    },
    response: {
      use: (successFn, errorFn) => {
        console.log("設置響應攔截器");
        // 在實際的 Axios 中，這會攔截所有響應
        axios._responseInterceptor = { successFn, errorFn };
      }
    }
  },
  
  // 創建自定義實例
  create: (config = {}) => {
    console.log("創建自定義 Axios 實例:", config);
    // 在實際的 Axios 中，這會返回一個新的實例
    return axios;
  }
};

// ========================
// 基本 Axios 用法
// ========================

// 基本 GET 請求
function basicAxiosGet() {
  console.log("示例 1: 基本 Axios GET 請求");
  
  axios.get('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => {
      console.log("狀態碼:", response.status);
      console.log("獲取的數據:", response.data);
    })
    .catch(error => {
      console.error("錯誤:", error.message);
      if (error.response) {
        console.error("錯誤狀態碼:", error.response.status);
      }
    });
}

// 使用 async/await 的 Axios
async function axiosWithAsyncAwait() {
  console.log("\n示例 2: 使用 async/await 的 Axios");
  
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log(`獲取了 ${response.data.length} 個用戶`);
    console.log("第一個用戶:", response.data[0].name);
    
    return response.data;
  } catch (error) {
    console.error("錯誤:", error.message);
    if (error.response) {
      console.error("錯誤狀態碼:", error.response.status);
    }
    return [];
  }
}

// 調用基本示例
basicAxiosGet();
setTimeout(() => axiosWithAsyncAwait(), 1000);

// ========================
// Axios 的高級功能
// ========================

// 1. 並行請求
async function axiosParallelRequests() {
  console.log("\n示例 3: Axios 並行請求");
  
  try {
    const [users, posts] = await Promise.all([
      axios.get('https://jsonplaceholder.typicode.com/users'),
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
    ]);
    
    console.log(`獲取了 ${users.data.length} 個用戶和 ${posts.data.length} 篇文章`);
    
    return {
      users: users.data,
      posts: posts.data
    };
  } catch (error) {
    console.error("並行請求錯誤:", error.message);
    return { users: [], posts: [] };
  }
}

// 2. 請求攔截器
function setupInterceptors() {
  console.log("\n示例 4: Axios 攔截器");
  
  // 請求攔截器
  axios.interceptors.request.use(
    config => {
      console.log("請求發送前攔截:", config);
      
      // 添加授權頭
      // config.headers.Authorization = 'Bearer token123';
      
      // 添加時間戳防緩存
      // config.params = { ...config.params, _t: Date.now() };
      
      return config;
    },
    error => {
      console.error("請求錯誤攔截:", error);
      return Promise.reject(error);
    }
  );
  
  // 響應攔截器
  axios.interceptors.response.use(
    response => {
      console.log("響應攔截:", response.status);
      
      // 可以統一處理數據
      // if (response.data && response.data.code === 0) {
      //   return response.data.data;
      // }
      
      return response;
    },
    error => {
      console.error("響應錯誤攔截:", error.message);
      
      // 可以處理特定錯誤碼
      // if (error.response && error.response.status === 401) {
      //   // 重定向到登錄頁
      // }
      
      return Promise.reject(error);
    }
  );
  
  // 攔截器設置後的請求
  axios.get('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => {
      console.log("攔截器處理後的響應:", response.data);
    })
    .catch(error => {
      console.error("攔截器處理後的錯誤:", error.message);
    });
}

// 3. 自定義實例
function customAxiosInstance() {
  console.log("\n示例 5: Axios 自定義實例");
  
  // 創建自定義實例
  const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
    headers: {
      'X-Custom-Header': 'custom-value',
      'Accept': 'application/json'
    }
  });
  
  // 使用自定義實例
  api.get('/users/1')
    .then(response => {
      console.log("自定義實例響應:", response.data);
    })
    .catch(error => {
      console.error("自定義實例錯誤:", error.message);
    });
}

// 延遲執行高級功能
setTimeout(() => axiosParallelRequests(), 2000);
setTimeout(() => setupInterceptors(), 3000);
setTimeout(() => customAxiosInstance(), 4000);

// ========================
// Axios 與 Python 庫對比
// ========================

/**
 * Axios 與 Python 請求庫的對比:
 * 
 * Axios (JavaScript)      | requests (Python)           | httpx (Python)
 * ------------------------|------------------------------|----------------------------
 * axios.get(url)          | requests.get(url)           | httpx.get(url)
 * axios.post(url, data)   | requests.post(url, json=data)| httpx.post(url, json=data)
 * response.data           | response.json()             | response.json()
 * response.status         | response.status_code        | response.status_code
 * try/catch               | try/except                  | try/except
 * interceptors            | 自定義 Session               | 事件掛鉤/中間件
 * axios.create()          | requests.Session()          | httpx.Client()
 * 並行: Promise.all       | 並行: 多線程/協程            | 並行: 非同步客戶端
 */

// ========================
// 實用技巧與建議
// ========================

/**
 * Axios 最佳實踐:
 * 
 * 1. 創建基本 API 實例 - 配置全局設置
 * 2. 使用攔截器統一處理請求/響應格式
 * 3. 集中管理 API 端點和請求函數
 * 4. 使用請求取消功能處理競態條件
 * 5. 設置合理的超時處理
 * 6. 在攔截器中處理授權和令牌刷新
 * 7. 錯誤響應統一處理
 * 8. 依賴注入測試 - 使 API 調用可模擬化
 */

// 簡單的 API 服務示例
function createApiService() {
  console.log("\n示例 6: 創建 API 服務");
  
  // 創建基本 API 客戶端
  const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // 設置攔截器
  apiClient.interceptors.request.use(
    config => {
      // 添加授權頭
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // API 端點函數
  const apiService = {
    // 用戶相關 API
    users: {
      getAll: () => apiClient.get('/users'),
      getById: (id) => apiClient.get(`/users/${id}`),
      createUser: (userData) => apiClient.post('/users', userData),
      updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
      deleteUser: (id) => apiClient.delete(`/users/${id}`)
    },
    
    // 文章相關 API
    posts: {
      getAll: (params = {}) => apiClient.get('/posts', { params }),
      getById: (id) => apiClient.get(`/posts/${id}`),
      getComments: (postId) => apiClient.get(`/posts/${postId}/comments`),
      createPost: (postData) => apiClient.post('/posts', postData),
      updatePost: (id, postData) => apiClient.put(`/posts/${id}`, postData),
      deletePost: (id) => apiClient.delete(`/posts/${id}`)
    }
  };
  
  // 使用 API 服務
  apiService.users.getById(1)
    .then(response => {
      console.log("API 服務響應:", response.data);
      
      // 獲取用戶文章
      return apiService.posts.getAll({ userId: response.data.id });
    })
    .then(postsResponse => {
      console.log(`用戶有 ${postsResponse.data.length} 篇文章`);
    })
    .catch(error => {
      console.error("API 服務錯誤:", error.message);
    });
  
  return apiService;
}

// 延遲創建 API 服務
setTimeout(() => createApiService(), 5000); 