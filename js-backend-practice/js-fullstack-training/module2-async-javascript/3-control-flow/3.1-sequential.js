/**
 * 非同步順序執行 - 為 Python 開發者準備
 * 
 * 本文件展示如何順序執行非同步操作，確保一個操作完成後才開始下一個
 */

// ========================
// 模擬異步操作
// ========================

// 模擬獲取用戶資料的 API
function fetchUser(id) {
  console.log(`正在獲取用戶 ${id}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`
      });
    }, 1000);
  });
}

// 模擬獲取用戶訂單的 API
function fetchOrders(userId) {
  console.log(`正在獲取用戶 ${userId} 的訂單...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, userId, product: "筆電", price: 1200 },
        { id: 2, userId, product: "手機", price: 800 }
      ]);
    }, 1000);
  });
}

// 模擬處理付款的 API
function processPayment(orderId, amount) {
  console.log(`正在處理訂單 ${orderId} 的付款，金額: $${amount}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, transactionId: `T${Date.now()}` });
    }, 1500);
  });
}

// ========================
// 1. 使用 Promise 鏈進行順序操作
// ========================

console.log("示例 1: 使用 Promise 鏈");

// 獲取用戶 -> 獲取訂單 -> 處理付款
fetchUser(1)
  .then(user => {
    console.log("用戶資料:", user);
    return fetchOrders(user.id);  // 返回新的 Promise
  })
  .then(orders => {
    console.log("用戶訂單:", orders);
    // 使用第一個訂單進行付款
    return processPayment(orders[0].id, orders[0].price);
  })
  .then(paymentResult => {
    console.log("付款結果:", paymentResult);
  })
  .catch(error => {
    console.error("流程中出現錯誤:", error);
  });

/**
 * Python 中的對應:
 * 
 * async def workflow():
 *     # 獲取用戶 -> 獲取訂單 -> 處理付款
 *     user = await fetch_user(1)
 *     print("用戶資料:", user)
 *     
 *     orders = await fetch_orders(user['id'])
 *     print("用戶訂單:", orders)
 *     
 *     payment_result = await process_payment(orders[0]['id'], orders[0]['price'])
 *     print("付款結果:", payment_result)
 */

// ========================
// 2. 使用 async/await 進行順序操作
// ========================

// 相同流程，使用 async/await
async function orderWorkflow(userId) {
  try {
    console.log("\n示例 2: 使用 async/await");
    
    // 獲取用戶資料
    const user = await fetchUser(userId);
    console.log("用戶資料:", user);
    
    // 獲取用戶訂單
    const orders = await fetchOrders(user.id);
    console.log("用戶訂單:", orders);
    
    // 處理第一筆訂單的付款
    const payment = await processPayment(orders[0].id, orders[0].price);
    console.log("付款結果:", payment);
    
    return { user, orders, payment };
  } catch (error) {
    console.error("工作流程中出現錯誤:", error);
    throw error;
  }
}

// 調用 async 函數
setTimeout(() => {
  orderWorkflow(2)
    .then(result => {
      console.log("完整工作流程結果:", result);
    })
    .catch(error => {
      console.error("工作流程失敗:", error);
    });
}, 5000);  // 等待第一個示例完成

// ========================
// 3. 處理多個依賴操作
// ========================

// 複雜的多步驟流程
async function complexWorkflow() {
  try {
    console.log("\n示例 3: 複雜依賴操作");
    
    // 1. 獲取多個用戶資料 (一個接一個)
    const user1 = await fetchUser(3);
    console.log("用戶 1:", user1);
    
    const user2 = await fetchUser(4);
    console.log("用戶 2:", user2);
    
    // 2. 為每個用戶獲取訂單
    const orders1 = await fetchOrders(user1.id);
    const orders2 = await fetchOrders(user2.id);
    
    console.log("用戶 1 訂單:", orders1);
    console.log("用戶 2 訂單:", orders2);
    
    // 3. 處理所有訂單的付款 (示範循環中的順序處理)
    const allOrders = [...orders1, ...orders2];
    const paymentResults = [];
    
    for (const order of allOrders) {
      // 每次付款都等待前一次完成
      const payment = await processPayment(order.id, order.price);
      console.log(`訂單 ${order.id} 付款完成:`, payment);
      paymentResults.push(payment);
    }
    
    console.log("所有付款結果:", paymentResults);
    return paymentResults;
  } catch (error) {
    console.error("複雜工作流程錯誤:", error);
    throw error;
  }
}

// 調用複雜工作流程
setTimeout(() => {
  complexWorkflow()
    .then(() => {
      console.log("複雜工作流程完成");
    });
}, 10000);  // 等待前面的示例完成

// ========================
// 實用技巧與注意事項
// ========================

/**
 * 順序執行最佳實踐:
 * 
 * 1. 當每個步驟依賴於前一個步驟的結果時，使用順序執行
 * 2. 使用 async/await 比 Promise 鏈更清晰地表達順序操作
 * 3. 注意錯誤處理，確保每個步驟的錯誤都被捕獲
 * 4. 循環中使用 await 會順序執行，這可能不是最高效的方式
 * 5. 考慮只有真正需要順序的操作才使用順序執行，否則可以使用並行執行
 */ 