/**
 * API 資料轉換 - 為 Python 開發者準備
 * 
 * 本文件展示如何處理、轉換和規範化從 API 獲取的數據
 * 類似於 Python 中使用 pandas 或自定義函數處理 API 數據
 */

// ========================
// 模擬 API 響應
// ========================

// 模擬獲取用戶資料的 API
function fetchUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, first_name: "Alice", last_name: "Johnson", email: "alice@example.com", role: "admin", created_at: "2023-01-15T08:30:00Z" },
        { id: 2, first_name: "Bob", last_name: "Smith", email: "bob@example.com", role: "user", created_at: "2023-02-20T14:15:30Z" },
        { id: 3, first_name: "Charlie", last_name: "Brown", email: "charlie@example.com", role: "user", created_at: "2023-03-10T11:45:20Z" }
      ]);
    }, 500);
  });
}

// 模擬獲取產品資料的 API
function fetchProducts() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { product_id: "p001", product_name: "Laptop", price: "1200.00", category: "electronics", in_stock: "true" },
        { product_id: "p002", product_name: "Smartphone", price: "800.00", category: "electronics", in_stock: "true" },
        { product_id: "p003", product_name: "Headphones", price: "150.00", category: "accessories", in_stock: "false" }
      ]);
    }, 700);
  });
}

// 模擬獲取訂單資料的 API
function fetchOrders() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { order_id: "o001", user_id: 1, items: [{ product_id: "p001", quantity: 1 }, { product_id: "p003", quantity: 2 }], total: "1500.00", status: "completed", order_date: "2023-04-05T09:20:15Z" },
        { order_id: "o002", user_id: 2, items: [{ product_id: "p002", quantity: 1 }], total: "800.00", status: "processing", order_date: "2023-04-10T16:40:30Z" },
        { order_id: "o003", user_id: 3, items: [{ product_id: "p001", quantity: 1 }, { product_id: "p002", quantity: 1 }], total: "2000.00", status: "completed", order_date: "2023-04-15T13:10:45Z" }
      ]);
    }, 600);
  });
}

// ========================
// 基本資料轉換
// ========================

// 基本資料規範化
async function basicTransformation() {
  console.log("示例 1: 基本資料轉換");
  
  try {
    // 獲取用戶數據
    const users = await fetchUsers();
    console.log("原始用戶數據:", users[0]);
    
    // 規範化用戶數據
    const normalizedUsers = users.map(user => ({
      id: user.id,
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      createdAt: new Date(user.created_at)
    }));
    
    console.log("規範化後的用戶:", normalizedUsers[0]);
    return normalizedUsers;
  } catch (error) {
    console.error("數據轉換錯誤:", error);
    return [];
  }
}

// 調用基本示例
basicTransformation();

// ========================
// 類型轉換與驗證
// ========================

// 轉換數據類型並進行驗證
async function typeConversionAndValidation() {
  console.log("\n示例 2: 類型轉換與驗證");
  
  try {
    const products = await fetchProducts();
    console.log("原始產品數據:", products[0]);
    
    // 轉換並驗證產品數據
    const processedProducts = products.map(product => {
      // 價格轉換為數字
      const price = parseFloat(product.price);
      if (isNaN(price)) {
        throw new Error(`無效的價格: ${product.price}`);
      }
      
      // 庫存轉換為布爾值
      const inStock = product.in_stock === "true";
      
      return {
        id: product.product_id,
        name: product.product_name,
        price,
        category: product.category,
        inStock,
        // 添加額外計算字段
        priceWithTax: price * 1.1, // 假設 10% 稅率
        displayPrice: `$${price.toFixed(2)}`
      };
    });
    
    console.log("處理後的產品:", processedProducts[0]);
    return processedProducts;
  } catch (error) {
    console.error("類型轉換錯誤:", error);
    return [];
  }
}

// 延遲執行
setTimeout(() => typeConversionAndValidation(), 1000);

// ========================
// 複雜資料結構轉換
// ========================

// 處理嵌套數據結構
async function complexDataTransformation() {
  console.log("\n示例 3: 複雜數據結構轉換");
  
  try {
    // 獲取訂單和產品數據
    const [orders, products] = await Promise.all([
      fetchOrders(),
      fetchProducts()
    ]);
    
    console.log("原始訂單:", orders[0]);
    
    // 創建產品查詢映射
    const productMap = products.reduce((map, product) => {
      map[product.product_id] = {
        id: product.product_id,
        name: product.product_name,
        price: parseFloat(product.price)
      };
      return map;
    }, {});
    
    // 轉換訂單數據
    const enhancedOrders = orders.map(order => {
      // 處理訂單項目
      const items = order.items.map(item => {
        const product = productMap[item.product_id];
        return {
          product: product || { id: item.product_id, name: "未知產品", price: 0 },
          quantity: item.quantity,
          subtotal: product ? product.price * item.quantity : 0
        };
      });
      
      // 計算總和
      const calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      
      // 添加用戶信息的佔位符
      return {
        id: order.order_id,
        date: new Date(order.order_date),
        status: order.status,
        userId: order.user_id,
        items,
        itemCount: items.length,
        total: parseFloat(order.total),
        calculatedTotal, // 用於比較或檢驗
        discrepancy: Math.abs(parseFloat(order.total) - calculatedTotal) > 0.01,
        display: {
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          date: new Date(order.order_date).toLocaleDateString(),
          total: `$${parseFloat(order.total).toFixed(2)}`
        }
      };
    });
    
    console.log("增強的訂單:", enhancedOrders[0]);
    return enhancedOrders;
  } catch (error) {
    console.error("複雜數據轉換錯誤:", error);
    return [];
  }
}

// 延遲執行
setTimeout(() => complexDataTransformation(), 2000);

// ========================
// 數據關聯與聚合
// ========================

// 整合多個 API 的數據
async function dataRelationAndAggregation() {
  console.log("\n示例 4: 數據關聯與聚合");
  
  try {
    // 獲取所有數據
    const [users, products, orders] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders()
    ]);
    
    // 創建查詢映射
    const userMap = users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {});
    
    const productMap = products.reduce((map, product) => {
      map[product.product_id] = {
        ...product,
        price: parseFloat(product.price)
      };
      return map;
    }, {});
    
    // 構建完整的訂單數據
    const completeOrders = orders.map(order => {
      const user = userMap[order.user_id];
      
      // 處理訂單項目
      const items = order.items.map(item => {
        const product = productMap[item.product_id];
        return {
          product: product ? {
            id: product.product_id,
            name: product.product_name,
            price: product.price,
            category: product.category
          } : { id: item.product_id, name: "未知產品" },
          quantity: item.quantity,
          subtotal: product ? product.price * item.quantity : 0
        };
      });
      
      return {
        id: order.order_id,
        date: new Date(order.order_date),
        status: order.status,
        user: user ? {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        } : { id: order.user_id, name: "未知用戶" },
        items,
        total: parseFloat(order.total)
      };
    });
    
    console.log("完整訂單數據:", completeOrders[0]);
    
    // 創建用戶訂單匯總
    const userOrderSummary = users.map(user => {
      const userOrders = orders.filter(order => order.user_id === user.id);
      
      const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const orderCount = userOrders.length;
      
      return {
        userId: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        totalOrders: orderCount,
        totalSpent,
        averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0
      };
    });
    
    console.log("用戶訂單匯總:", userOrderSummary);
    
    // 產品銷售統計
    const productSalesStats = Object.values(productMap).map(product => {
      let totalSold = 0;
      let revenue = 0;
      
      orders.forEach(order => {
        const item = order.items.find(item => item.product_id === product.product_id);
        if (item) {
          totalSold += item.quantity;
          revenue += parseFloat(product.price) * item.quantity;
        }
      });
      
      return {
        productId: product.product_id,
        name: product.product_name,
        category: product.category,
        totalSold,
        revenue,
        inStock: product.in_stock === "true"
      };
    });
    
    console.log("產品銷售統計:", productSalesStats);
    
    return {
      completeOrders,
      userOrderSummary,
      productSalesStats
    };
  } catch (error) {
    console.error("數據關聯與聚合錯誤:", error);
    return {};
  }
}

// 延遲執行
setTimeout(() => dataRelationAndAggregation(), 3000);

// ========================
// 數據格式轉換
// ========================

// 轉換為不同的數據格式
async function dataExportFormatting() {
  console.log("\n示例 5: 數據格式轉換");
  
  try {
    // 獲取用戶數據
    const users = await fetchUsers();
    
    // 1. 轉換為 CSV 格式
    const headers = ['id', 'first_name', 'last_name', 'email', 'role', 'created_at'];
    let csvData = headers.join(',') + '\n';
    
    users.forEach(user => {
      const row = headers.map(header => {
        // 處理欄位中的逗號 (CSV 特殊字符)
        let value = user[header]?.toString() || '';
        if (value.includes(',')) {
          value = `"${value}"`;
        }
        return value;
      });
      csvData += row.join(',') + '\n';
    });
    
    console.log("CSV 數據:\n", csvData);
    
    // 2. 轉換為扁平化 JSON
    const flatJson = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      role_display: user.role === 'admin' ? '管理員' : '普通用戶',
      created_at: user.created_at,
      created_date: new Date(user.created_at).toLocaleDateString()
    }));
    
    console.log("扁平化 JSON:", flatJson[0]);
    
    // 3. 轉換為樹狀結構
    // 按角色分組
    const userTree = users.reduce((tree, user) => {
      const role = user.role;
      
      if (!tree[role]) {
        tree[role] = [];
      }
      
      tree[role].push({
        id: user.id,
        name: {
          first: user.first_name,
          last: user.last_name,
          full: `${user.first_name} ${user.last_name}`
        },
        contact: {
          email: user.email
        },
        meta: {
          createdAt: user.created_at
        }
      });
      
      return tree;
    }, {});
    
    console.log("樹狀結構:", JSON.stringify(userTree, null, 2));
    
    return {
      csv: csvData,
      flatJson,
      treeJson: userTree
    };
  } catch (error) {
    console.error("數據格式轉換錯誤:", error);
    return {};
  }
}

// 延遲執行
setTimeout(() => dataExportFormatting(), 4000);

// ========================
// 集中式數據處理
// ========================

// 創建一個集中式數據處理服務
function createDataService() {
  console.log("\n示例 6: 集中式數據處理服務");
  
  // 通用轉換器
  const transformers = {
    // 用戶轉換器
    user: (user) => ({
      id: user.id,
      fullName: `${user.first_name} ${user.last_name}`,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: new Date(user.created_at),
      displayName: user.role === 'admin' ? 
        `${user.first_name} ${user.last_name} (Admin)` : 
        `${user.first_name} ${user.last_name}`
    }),
    
    // 產品轉換器
    product: (product) => {
      const price = parseFloat(product.price);
      return {
        id: product.product_id,
        name: product.product_name,
        price,
        category: product.category,
        inStock: product.in_stock === "true",
        displayPrice: `$${price.toFixed(2)}`
      };
    },
    
    // 訂單轉換器
    order: (order, productMap = {}) => {
      // 處理訂單項目
      const items = Array.isArray(order.items) ? order.items.map(item => {
        const product = productMap[item.product_id];
        return {
          productId: item.product_id,
          productName: product ? product.name : 'Unknown Product',
          quantity: item.quantity,
          unitPrice: product ? product.price : 0,
          subtotal: product ? product.price * item.quantity : 0
        };
      }) : [];
      
      return {
        id: order.order_id,
        userId: order.user_id,
        items,
        total: parseFloat(order.total),
        status: order.status,
        date: new Date(order.order_date),
        displayStatus: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        displayDate: new Date(order.order_date).toLocaleDateString(),
        displayTotal: `$${parseFloat(order.total).toFixed(2)}`
      };
    }
  };
  
  // 數據服務 API
  const dataService = {
    // 轉換單個實體
    transform: (type, data, context = {}) => {
      const transformer = transformers[type];
      if (!transformer) {
        throw new Error(`未知的轉換類型: ${type}`);
      }
      return transformer(data, context);
    },
    
    // 轉換集合
    transformCollection: (type, dataArray, context = {}) => {
      return dataArray.map(item => dataService.transform(type, item, context));
    },
    
    // 獲取並轉換用戶
    async getUsers() {
      const users = await fetchUsers();
      return dataService.transformCollection('user', users);
    },
    
    // 獲取並轉換產品
    async getProducts() {
      const products = await fetchProducts();
      return dataService.transformCollection('product', products);
    },
    
    // 獲取並轉換訂單，包含關聯數據
    async getOrders(includeProducts = false) {
      const orders = await fetchOrders();
      
      let productMap = {};
      if (includeProducts) {
        const products = await fetchProducts();
        productMap = products.reduce((map, product) => {
          map[product.product_id] = dataService.transform('product', product);
          return map;
        }, {});
      }
      
      return dataService.transformCollection('order', orders, productMap);
    },
    
    // 匯出為 CSV
    exportCsv: (data, headers) => {
      let csv = headers.join(',') + '\n';
      
      data.forEach(item => {
        const row = headers.map(header => {
          let value = item[header]?.toString() || '';
          if (value.includes(',')) {
            value = `"${value}"`;
          }
          return value;
        });
        csv += row.join(',') + '\n';
      });
      
      return csv;
    }
  };
  
  // 演示使用數據服務
  async function demoDataService() {
    try {
      // 獲取轉換後的用戶
      const users = await dataService.getUsers();
      console.log("轉換後的用戶:", users[0]);
      
      // 獲取轉換後的產品
      const products = await dataService.getProducts();
      console.log("轉換後的產品:", products[0]);
      
      // 獲取包含產品的訂單
      const orders = await dataService.getOrders(true);
      console.log("轉換後的訂單:", orders[0]);
      
      // 創建用戶 CSV
      const userCsv = dataService.exportCsv(users, ['id', 'fullName', 'email', 'role']);
      console.log("用戶 CSV:\n", userCsv);
      
      return { users, products, orders };
    } catch (error) {
      console.error("數據服務錯誤:", error);
      return {};
    }
  }
  
  // 執行演示
  demoDataService();
  
  return dataService;
}

// 延遲執行數據服務
setTimeout(() => createDataService(), 5000);

// ========================
// 實用技巧與最佳實踐
// ========================

/**
 * 數據轉換最佳實踐:
 * 
 * 1. 創建轉換函數庫 - 重用常見的數據轉換邏輯
 * 2. 使用映射表處理枚舉值 - 將代碼映射為可讀文本
 * 3. 確保數據類型一致性 - 明確轉換字符串、數字等
 * 4. 使用適當的錯誤處理 - 處理無效或缺失數據
 * 5. 添加輸入驗證 - 在處理前檢查數據格式
 * 6. 創建資料模型 - 使用類或工廠函數標準化數據結構
 * 7. 使用不可變數據 - 避免修改原始數據，創建新對象
 * 8. 添加懶加載關係 - 僅在需要時加載關聯數據
 */

// Python 對比
/**
 * Python 中的類似數據轉換:
 * 
 * import pandas as pd
 * from datetime import datetime
 * 
 * # 使用 pandas 進行數據轉換
 * def transform_users(users_data):
 *     # 轉換為 DataFrame
 *     df = pd.DataFrame(users_data)
 *     
 *     # 添加衍生列
 *     df['full_name'] = df['first_name'] + ' ' + df['last_name']
 *     
 *     # 轉換日期
 *     df['created_at'] = pd.to_datetime(df['created_at'])
 *     
 *     # 過濾和分組
 *     admin_users = df[df['role'] == 'admin']
 *     users_by_role = df.groupby('role')
 *     
 *     # 輸出不同格式
 *     csv_data = df.to_csv(index=False)
 *     json_data = df.to_json(orient='records')
 *     
 *     return {
 *         'processed_df': df,
 *         'admin_users': admin_users,
 *         'users_by_role': {role: group.to_dict('records') for role, group in users_by_role},
 *         'csv': csv_data,
 *         'json': json_data
 *     }
 */ 