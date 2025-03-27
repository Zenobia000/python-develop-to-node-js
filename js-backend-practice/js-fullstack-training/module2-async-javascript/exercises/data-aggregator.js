/**
 * 多來源資料聚合 - 為 Python 開發者準備
 * 
 * 這個練習展示如何從多個 API 來源獲取數據，並將其聚合成單一的有用資料集。
 * 類似於 Python 中使用多個 API 然後用 pandas 合併處理的過程。
 */

// ========================
// 模擬不同的資料 API
// ========================

// 模擬產品 API
function fetchProducts() {
  console.log('獲取產品數據...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'p1', name: '高效能筆記型電腦', category: '電子產品', price: 1200 },
        { id: 'p2', name: '智能手機', category: '電子產品', price: 800 },
        { id: 'p3', name: '無線耳機', category: '配件', price: 150 },
        { id: 'p4', name: '觸控螢幕平板', category: '電子產品', price: 500 },
        { id: 'p5', name: '藍牙鍵盤', category: '配件', price: 80 }
      ]);
    }, 700);
  });
}

// 模擬庫存 API
function fetchInventory() {
  console.log('獲取庫存數據...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { productId: 'p1', stock: 5, warehouse: 'A', status: 'in_stock' },
        { productId: 'p2', stock: 15, warehouse: 'B', status: 'in_stock' },
        { productId: 'p3', stock: 0, warehouse: 'A', status: 'out_of_stock' },
        { productId: 'p4', stock: 3, warehouse: 'C', status: 'low_stock' },
        { productId: 'p5', stock: 12, warehouse: 'B', status: 'in_stock' }
      ]);
    }, 900);
  });
}

// 模擬顧客評價 API
function fetchReviews() {
  console.log('獲取顧客評價...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { productId: 'p1', rating: 4.7, count: 124, lastReviewed: '2023-02-15' },
        { productId: 'p2', rating: 4.5, count: 253, lastReviewed: '2023-03-20' },
        { productId: 'p3', rating: 3.8, count: 97, lastReviewed: '2023-01-10' },
        { productId: 'p4', rating: 4.2, count: 85, lastReviewed: '2023-04-05' },
        { productId: 'p5', rating: 4.0, count: 62, lastReviewed: '2023-03-01' }
      ]);
    }, 800);
  });
}

// 模擬銷售資料 API (偶爾會失敗以展示錯誤處理)
function fetchSales() {
  console.log('獲取銷售數據...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模擬 20% 的錯誤率
      if (Math.random() < 0.2) {
        reject(new Error('銷售資料 API 臨時不可用'));
        return;
      }
      
      resolve([
        { productId: 'p1', unitsSold: 325, lastMonthSold: 42, revenue: 390000 },
        { productId: 'p2', unitsSold: 582, lastMonthSold: 76, revenue: 465600 },
        { productId: 'p3', unitsSold: 423, lastMonthSold: 35, revenue: 63450 },
        { productId: 'p4', unitsSold: 264, lastMonthSold: 31, revenue: 132000 },
        { productId: 'p5', unitsSold: 190, lastMonthSold: 23, revenue: 15200 }
      ]);
    }, 1200);
  });
}

// ========================
// 資料聚合功能
// ========================

// 使用 Promise.all 並行獲取所有數據
async function fetchAllDataParallel() {
  console.log('開始並行獲取所有數據...');
  
  try {
    // 使用 Promise.all 並行獲取
    const [products, inventory, reviews, sales] = await Promise.all([
      fetchProducts(),
      fetchInventory(),
      fetchReviews(),
      fetchSales().catch(error => {
        // 如果銷售數據獲取失敗，返回空數組而不是拋出錯誤
        console.error(`銷售數據獲取失敗: ${error.message}`);
        return [];
      })
    ]);
    
    console.log('所有數據獲取完成！');
    
    // 聚合數據
    const aggregatedData = aggregateProductData(products, inventory, reviews, sales);
    return aggregatedData;
  } catch (error) {
    console.error('獲取數據過程中發生錯誤:', error);
    throw error;
  }
}

// 順序獲取數據 (當資源有限時使用)
async function fetchAllDataSequential() {
  console.log('開始順序獲取所有數據...');
  
  try {
    // 順序獲取數據
    const products = await fetchProducts();
    console.log(`獲取到 ${products.length} 個產品`);
    
    const inventory = await fetchInventory();
    console.log(`獲取到 ${inventory.length} 個庫存記錄`);
    
    const reviews = await fetchReviews();
    console.log(`獲取到 ${reviews.length} 個評價記錄`);
    
    let sales = [];
    try {
      sales = await fetchSales();
      console.log(`獲取到 ${sales.length} 個銷售記錄`);
    } catch (error) {
      console.error(`銷售數據獲取失敗: ${error.message}`);
    }
    
    console.log('所有數據順序獲取完成！');
    
    // 聚合數據
    const aggregatedData = aggregateProductData(products, inventory, reviews, sales);
    return aggregatedData;
  } catch (error) {
    console.error('順序獲取數據過程中發生錯誤:', error);
    throw error;
  }
}

// 聚合數據並添加業務邏輯
function aggregateProductData(products, inventory, reviews, sales) {
  if (!products || products.length === 0) {
    throw new Error('產品數據為空，無法聚合');
  }
  
  // 將其他數據轉換為以 productId 為鍵的映射
  const inventoryMap = inventory.reduce((map, item) => {
    map[item.productId] = item;
    return map;
  }, {});
  
  const reviewsMap = reviews.reduce((map, item) => {
    map[item.productId] = item;
    return map;
  }, {});
  
  const salesMap = sales.reduce((map, item) => {
    map[item.productId] = item;
    return map;
  }, {});
  
  // 合併數據
  const aggregatedProducts = products.map(product => {
    const inv = inventoryMap[product.id] || {
      stock: 0,
      warehouse: 'unknown',
      status: 'unknown'
    };
    
    const rev = reviewsMap[product.id] || {
      rating: 0,
      count: 0,
      lastReviewed: null
    };
    
    const sale = salesMap[product.id] || {
      unitsSold: 0,
      lastMonthSold: 0,
      revenue: 0
    };
    
    // 添加業務邏輯和轉換
    const stockStatus = inv.stock === 0 ? '缺貨' :
                         inv.stock < 5 ? '庫存低' : '庫存充足';
    
    const popularity = rev.count > 200 ? '熱門' :
                       rev.count > 100 ? '受歡迎' : '一般';
    
    const performance = sale.lastMonthSold > 50 ? '銷售強勁' :
                        sale.lastMonthSold > 20 ? '銷售良好' : '銷售緩慢';
    
    // 計算利潤率 (簡單估算)
    const profitMargin = (sale.revenue > 0 && sale.unitsSold > 0) ?
                         (sale.revenue - (product.price * sale.unitsSold * 0.6)) / sale.revenue * 100 :
                         0;
    
    // 返回富數據產品對象
    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      displayPrice: `$${product.price.toFixed(2)}`,
      
      // 庫存數據
      stock: inv.stock,
      stockStatus,
      warehouse: inv.warehouse,
      
      // 評價數據
      rating: rev.rating,
      reviews: rev.count,
      lastReviewed: rev.lastReviewed ? new Date(rev.lastReviewed) : null,
      popularity,
      
      // 銷售數據
      unitsSold: sale.unitsSold,
      lastMonthSales: sale.lastMonthSold,
      revenue: sale.revenue,
      performance,
      profitMargin: profitMargin.toFixed(2) + '%',
      
      // 綜合指標
      score: calculateProductScore(product, inv, rev, sale)
    };
  });
  
  return aggregatedProducts;
}

// 計算產品綜合分數
function calculateProductScore(product, inventory, reviews, sales) {
  let score = 0;
  
  // 根據庫存評分 (0-20 分)
  if (inventory.stock > 0) {
    score += Math.min(20, inventory.stock * 2);
  }
  
  // 根據評價評分 (0-30 分)
  if (reviews.rating > 0) {
    score += Math.min(30, reviews.rating * 6);
  }
  
  // 根據銷售評分 (0-50 分)
  if (sales.unitsSold > 0) {
    // 轉換為 0-50 分，給予更高銷量產品更多分數
    const salesScore = Math.log(sales.unitsSold) * 10;
    score += Math.min(50, salesScore);
  }
  
  return Math.round(score);
}

// ========================
// 數據分析功能
// ========================

// 獲取並分析數據
async function analyzeProductData() {
  try {
    // 獲取聚合數據
    const aggregatedData = await fetchAllDataParallel();
    
    // 產品類別分組
    const categoryCounts = aggregatedData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    // 最暢銷產品
    const bestSeller = [...aggregatedData].sort((a, b) => b.unitsSold - a.unitsSold)[0];
    
    // 評分最高產品
    const highestRated = [...aggregatedData].sort((a, b) => b.rating - a.rating)[0];
    
    // 庫存總價值
    const totalInventoryValue = aggregatedData.reduce(
      (sum, product) => sum + (product.price * product.stock),
      0
    );
    
    // 缺貨產品
    const outOfStock = aggregatedData.filter(product => product.stock === 0);
    
    // 收入按類別分組
    const revenueByCategory = aggregatedData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + (product.revenue || 0);
      return acc;
    }, {});
    
    // 返回分析結果
    return {
      productCount: aggregatedData.length,
      categoryCounts,
      bestSeller: {
        name: bestSeller.name,
        unitsSold: bestSeller.unitsSold,
        revenue: bestSeller.revenue
      },
      highestRated: {
        name: highestRated.name,
        rating: highestRated.rating,
        reviews: highestRated.reviews
      },
      totalInventoryValue,
      outOfStockCount: outOfStock.length,
      outOfStockProducts: outOfStock.map(p => p.name),
      revenueByCategory
    };
  } catch (error) {
    console.error('數據分析過程中發生錯誤:', error);
    throw error;
  }
}

// ========================
// 數據格式轉換
// ========================

// 將數據轉換為 CSV 格式
function convertToCSV(data) {
  if (!data || data.length === 0) {
    return '';
  }
  
  // 獲取標題
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  
  // 生成數據行
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      // 處理包含逗號或引號的數據
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

// 將數據轉換為儀表板格式數據
function transformToDashboardFormat(aggregatedData) {
  // 依類別分組
  const categories = {};
  
  aggregatedData.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = {
        categoryName: product.category,
        totalRevenue: 0,
        totalStock: 0,
        products: []
      };
    }
    
    categories[product.category].totalRevenue += product.revenue || 0;
    categories[product.category].totalStock += product.stock || 0;
    categories[product.category].products.push({
      id: product.productId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      sales: product.unitsSold
    });
  });
  
  return {
    summary: {
      totalProducts: aggregatedData.length,
      totalRevenue: aggregatedData.reduce((sum, p) => sum + (p.revenue || 0), 0),
      totalStock: aggregatedData.reduce((sum, p) => sum + (p.stock || 0), 0),
      averageRating: (aggregatedData.reduce((sum, p) => sum + (p.rating || 0), 0) / aggregatedData.length).toFixed(1)
    },
    categories: Object.values(categories),
    stockStatus: {
      inStock: aggregatedData.filter(p => p.stockStatus === '庫存充足').length,
      lowStock: aggregatedData.filter(p => p.stockStatus === '庫存低').length,
      outOfStock: aggregatedData.filter(p => p.stockStatus === '缺貨').length
    },
    topProducts: aggregatedData
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(p => ({
        id: p.productId,
        name: p.name,
        score: p.score,
        revenue: p.revenue,
        rating: p.rating
      }))
  };
}

// ========================
// 執行主程序
// ========================

// 主函數：獲取、聚合、分析並轉換數據
async function main() {
  console.log('開始數據聚合流程...');
  
  try {
    // 方法 1: 並行獲取所有數據
    console.log('\n===== 並行數據獲取 =====');
    const parallelData = await fetchAllDataParallel();
    console.log(`並行方式獲取並聚合了 ${parallelData.length} 個產品數據`);
    console.log('第一個產品示例:', parallelData[0]);
    
    // 方法 2: 順序獲取數據
    console.log('\n===== 順序數據獲取 =====');
    const sequentialData = await fetchAllDataSequential();
    console.log(`順序方式獲取並聚合了 ${sequentialData.length} 個產品數據`);
    
    // 數據分析
    console.log('\n===== 數據分析 =====');
    const analysis = await analyzeProductData();
    console.log('分析結果:', analysis);
    
    // 數據轉換
    console.log('\n===== 數據格式轉換 =====');
    
    // 轉換為 CSV
    const csvData = convertToCSV(parallelData);
    console.log('CSV 數據 (前 150 個字符):', csvData.substring(0, 150) + '...');
    
    // 轉換為儀表板格式
    const dashboardData = transformToDashboardFormat(parallelData);
    console.log('儀表板數據摘要:', {
      productCount: dashboardData.summary.totalProducts,
      categoryCount: dashboardData.categories.length,
      topProduct: dashboardData.topProducts[0].name
    });
    
    return {
      aggregatedData: parallelData,
      analysis,
      dashboardData
    };
  } catch (error) {
    console.error('主程序執行失敗:', error);
    throw error;
  }
}

// 執行主程序
console.log('數據聚合程序啟動中...');
main()
  .then(result => {
    console.log('\n程序執行完成!');
    
    // 可在控制台檢視結果
    console.log('\n可用命令:');
    console.log('- fetchAllDataParallel(): 並行獲取所有數據');
    console.log('- fetchAllDataSequential(): 順序獲取所有數據');
    console.log('- analyzeProductData(): 分析產品數據');
  })
  .catch(error => {
    console.error('程序執行失敗:', error);
  });

/**
 * 練習拓展想法：
 * 
 * 1. 添加分頁處理 - 當處理非常大的數據集時
 * 2. 實現數據源錯誤重試 - 使用指數退避策略
 * 3. 添加數據快照 - 在聚合過程中定期保存中間結果
 * 4. 添加實時數據更新 - 使用輪詢或 WebSocket
 * 5. 實現復雜過濾器 - 例如搜索特定條件的產品
 * 6. 為銷售預測添加時間序列分析
 * 7. 擴展聚合器以處理更多數據源
 */

// 匯出函數供外部使用
export {
  fetchAllDataParallel,
  fetchAllDataSequential,
  analyzeProductData,
  convertToCSV,
  transformToDashboardFormat
}; 