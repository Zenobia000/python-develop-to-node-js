/**
 * 複雜非同步流程控制 - 為 Python 開發者準備
 * 
 * 本文件展示如何處理更複雜的非同步流程，包括依賴關係、條件執行、
 * 批次處理、錯誤恢復、以及組合多種控制方式
 */

// ========================
// 模擬 API 函數
// ========================

// 模擬資料庫查詢
function queryDatabase(query) {
  console.log(`執行資料庫查詢: ${query}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模擬 10% 的查詢失敗
      if (Math.random() < 0.1) {
        reject(new Error(`資料庫查詢失敗: ${query}`));
        return;
      }
      
      if (query.includes("user")) {
        resolve([
          { id: 1, name: "Alice", role: "admin" },
          { id: 2, name: "Bob", role: "user" },
          { id: 3, name: "Charlie", role: "user" }
        ]);
      } else if (query.includes("product")) {
        resolve([
          { id: 101, name: "筆電", price: 1200 },
          { id: 102, name: "手機", price: 800 },
          { id: 103, name: "耳機", price: 100 }
        ]);
      } else {
        resolve([]);
      }
    }, 1000);
  });
}

// 模擬 API 請求
function apiRequest(endpoint, data = null) {
  console.log(`呼叫 API: ${endpoint}`, data ? `資料: ${JSON.stringify(data)}` : "");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint.includes("error")) {
        reject(new Error(`API 錯誤: ${endpoint}`));
        return;
      }
      
      if (endpoint.includes("users")) {
        resolve({ success: true, userId: data?.id || 1 });
      } else if (endpoint.includes("orders")) {
        resolve({ success: true, orderId: Date.now(), items: data?.items || [] });
      } else {
        resolve({ success: true, message: "操作完成" });
      }
    }, 1500);
  });
}

// ========================
// 1. 條件流程控制
// ========================

// 根據條件決定執行路徑的複雜流程
async function conditionalWorkflow(userId, isAdmin = false) {
  console.log(`示例 1: 為用戶 ${userId} 執行條件流程${isAdmin ? " (管理員)" : ""}`);
  
  try {
    // 1. 獲取用戶資料
    const users = await queryDatabase(`SELECT * FROM user WHERE id = ${userId}`);
    
    if (users.length === 0) {
      console.log("用戶不存在，執行新用戶流程");
      return { status: "error", message: "用戶不存在" };
    }
    
    const user = users[0];
    console.log("獲取用戶:", user);
    
    // 2. 根據用戶角色分支執行
    if (user.role === "admin" || isAdmin) {
      console.log("執行管理員流程");
      
      // 獲取所有用戶資料
      const allUsers = await queryDatabase("SELECT * FROM user");
      console.log(`系統有 ${allUsers.length} 個用戶`);
      
      return { 
        status: "success", 
        message: "管理員流程完成",
        userCount: allUsers.length
      };
    } else {
      console.log("執行普通用戶流程");
      
      // 獲取用戶訂單
      const orderResult = await apiRequest("/api/orders", { id: user.id });
      console.log("用戶訂單:", orderResult);
      
      return { 
        status: "success", 
        message: "用戶流程完成", 
        orderId: orderResult.orderId 
      };
    }
  } catch (error) {
    console.error("條件流程錯誤:", error.message);
    
    // 錯誤恢復策略
    return { 
      status: "error", 
      message: error.message,
      fallback: true
    };
  }
}

// 測試條件流程
conditionalWorkflow(1, true).then(result => {
  console.log("條件流程結果:", result);
});

// ========================
// 2. 批次處理與節流
// ========================

// 分批處理大量資料項
async function batchProcessing(items, batchSize = 3) {
  console.log(`\n示例 2: 批次處理 ${items.length} 個項目，批次大小: ${batchSize}`);
  
  const results = [];
  
  // 分組項目
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`處理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
    
    // 並行處理此批次中的所有項目
    const batchPromises = batch.map(item => {
      return apiRequest("/api/process", item)
        .catch(error => {
          console.error(`項目 ${item.id} 處理錯誤:`, error.message);
          return { success: false, item, error: error.message };
        });
    });
    
    // 等待此批次所有處理完成
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // 批次間延遲，避免過載 API
    if (i + batchSize < items.length) {
      console.log("批次間暫停 1 秒...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 計算成功與失敗
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  
  console.log(`批次處理完成: ${successful} 成功, ${failed} 失敗`);
  return { successful, failed, results };
}

// 測試批次處理
setTimeout(() => {
  // 創建測試項目
  const testItems = Array.from({ length: 10 }, (_, i) => ({ 
    id: i + 1, 
    name: `項目 ${i + 1}` 
  }));
  
  batchProcessing(testItems).then(result => {
    console.log("批次處理結果摘要:", {
      successful: result.successful,
      failed: result.failed
    });
  });
}, 6000);

// ========================
// 3. 瀑布流程與並行組合
// ========================

// 混合使用順序與並行執行
async function mixedWaterfallParallel() {
  console.log("\n示例 3: 瀑布流程與並行組合");
  
  try {
    // 第一步: 獲取初始資料 (順序)
    console.log("1. 獲取初始資料");
    const users = await queryDatabase("SELECT * FROM user");
    const products = await queryDatabase("SELECT * FROM product");
    
    console.log(`找到 ${users.length} 個用戶和 ${products.length} 個產品`);
    
    // 第二步: 同時處理用戶與產品 (並行)
    console.log("2. 並行處理用戶與產品");
    
    const [userResults, productResults] = await Promise.all([
      // 處理用戶 (內部順序)
      (async () => {
        const adminUsers = users.filter(u => u.role === "admin");
        console.log(`處理 ${adminUsers.length} 個管理員用戶`);
        
        // 順序處理每個管理員
        const adminResults = [];
        for (const admin of adminUsers) {
          const result = await apiRequest("/api/users/admin-check", admin);
          adminResults.push(result);
        }
        
        return adminResults;
      })(),
      
      // 處理產品 (內部並行)
      (async () => {
        const expensiveProducts = products.filter(p => p.price > 500);
        console.log(`處理 ${expensiveProducts.length} 個高價產品`);
        
        // 並行處理所有高價產品
        return Promise.all(
          expensiveProducts.map(product => 
            apiRequest("/api/products/premium", product)
          )
        );
      })()
    ]);
    
    console.log(`用戶處理結果: ${userResults.length}, 產品處理結果: ${productResults.length}`);
    
    // 第三步: 最終彙總 (順序)
    console.log("3. 最終彙總資料");
    const summary = await apiRequest("/api/summary", {
      adminCount: userResults.length,
      premiumProductCount: productResults.length
    });
    
    return {
      success: true,
      userResults,
      productResults,
      summary
    };
    
  } catch (error) {
    console.error("混合流程錯誤:", error.message);
    return { success: false, error: error.message };
  }
}

// 測試混合流程
setTimeout(() => {
  mixedWaterfallParallel().then(result => {
    console.log("混合流程結果:", result.success ? "成功" : "失敗");
  });
}, 15000);

// ========================
// 4. 重試機制
// ========================

// 帶有重試功能的函數
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`嘗試執行 (${attempt}/${maxRetries})`);
      return await fn();
    } catch (error) {
      console.error(`嘗試 ${attempt} 失敗:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1);  // 指數退避
        console.log(`等待 ${waitTime}ms 後重試...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw new Error(`在 ${maxRetries} 次嘗試後失敗: ${lastError.message}`);
}

// 測試重試機制
setTimeout(() => {
  console.log("\n示例 4: 重試機制");
  
  // 一個不穩定的函數，有 70% 機率失敗
  let attemptCount = 0;
  const unstableOperation = () => {
    attemptCount++;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.7 && attemptCount < 5) {
          reject(new Error("操作隨機失敗"));
        } else {
          resolve("操作最終成功");
        }
      }, 500);
    });
  };
  
  withRetry(unstableOperation, 5, 500)
    .then(result => {
      console.log("重試機制結果:", result);
      console.log(`總共嘗試次數: ${attemptCount}`);
    })
    .catch(error => {
      console.error("即使重試後仍然失敗:", error.message);
    });
}, 25000);

// ========================
// 實用技巧與建議
// ========================

/**
 * 複雜流程控制最佳實踐:
 * 
 * 1. 模組化設計: 將複雜流程拆分為更小、可重用的函數
 * 2. 清晰的錯誤處理: 每個階段都要考慮錯誤處理和恢復策略
 * 3. 批次處理: 處理大量項目時分批進行，避免占用過多資源
 * 4. 組合使用: 根據需要混合使用順序和並行執行
 * 5. 考慮取消: 提供取消長時間操作的機制
 * 6. 重試機制: 對臨時性錯誤實施自動重試，使用指數退避
 * 7. 狀態追蹤: 在複雜流程中記錄和追蹤執行狀態
 * 8. 超時控制: 為每個操作設置合理的超時時間
 * 9. 恢復點: 在關鍵階段保存進度，支持從失敗點恢復
 * 10. 測試: 徹底測試所有可能的流程路徑和錯誤情況
 */

/**
 * Python 中的類似模式:
 * 
 * # 混合使用順序和並行
 * async def mixed_waterfall_parallel():
 *     # 順序執行
 *     users = await query_database("SELECT * FROM user")
 *     products = await query_database("SELECT * FROM product")
 *     
 *     # 並行執行多個任務
 *     user_task = process_users(users)
 *     product_task = process_products(products)
 *     user_results, product_results = await asyncio.gather(user_task, product_task)
 *     
 *     # 繼續順序執行
 *     return await generate_summary(user_results, product_results)
 * 
 * # 重試裝飾器
 * def with_retry(max_retries=3, delay=1):
 *     def decorator(func):
 *         @functools.wraps(func)
 *         async def wrapper(*args, **kwargs):
 *             last_error = None
 *             for attempt in range(1, max_retries + 1):
 *                 try:
 *                     return await func(*args, **kwargs)
 *                 except Exception as e:
 *                     last_error = e
 *                     if attempt < max_retries:
 *                         wait_time = delay * (2 ** (attempt - 1))
 *                         await asyncio.sleep(wait_time)
 *             raise last_error
 *         return wrapper
 *     return decorator
 */ 