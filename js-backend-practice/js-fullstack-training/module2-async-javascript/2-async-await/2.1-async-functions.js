/**
 * Async 函數基礎 - 為 Python 開發者準備
 * 
 * async/await 是 ES2017 引入的特性，用於簡化 Promise 的使用
 * 與 Python 中的 async/await 非常相似
 */

// ========================
// Async 函數基礎
// ========================

// 一個基本的 async 函數
async function greet() {
  // async 函數始終返回 Promise
  return "Hello, World!";
}

// 使用 async 函數
console.log("呼叫 async 函數...");

greet()
  .then(message => {
    console.log("接收到的消息:", message);
  })
  .catch(error => {
    console.error("錯誤:", error);
  });

console.log("繼續執行...");

// 箭頭函數也可以是 async
const greetArrow = async () => {
  return "Hello from arrow function!";
};

greetArrow().then(console.log);

/**
 * Python 中的對應:
 * 
 * async def greet():
 *     return "Hello, World!"
 * 
 * async def main():
 *     print("呼叫 async 函數...")
 *     message = await greet()
 *     print(f"接收到的消息: {message}")
 *     print("繼續執行...")
 * 
 * # 使用 asyncio 運行
 * import asyncio
 * asyncio.run(main())
 */

// ========================
// 返回值與錯誤處理
// ========================

// 返回值的 async 函數
async function getData() {
  return { id: 1, name: "資料" };
}

// 拋出錯誤的 async 函數
async function failingFunction() {
  throw new Error("發生了錯誤");
}

// 使用這些函數
getData().then(data => console.log("獲取的數據:", data));

failingFunction()
  .then(data => console.log("這不會執行"))
  .catch(error => console.error("捕獲的錯誤:", error.message));

// ========================
// 與其他 async 函數連結
// ========================

// 創建幾個互相依賴的 async 函數
async function fetchUser(id) {
  // 模擬 API 調用
  console.log(`正在獲取用戶 ${id}...`);
  return { id, name: `用戶 ${id}` };
}

async function fetchUserPosts(user) {
  // 模擬 API 調用
  console.log(`正在獲取 ${user.name} 的文章...`);
  return [
    { id: 1, title: `${user.name} 的第一篇文章` },
    { id: 2, title: `${user.name} 的第二篇文章` }
  ];
}

// 將這些函數組合在一起
async function getUserPosts(userId) {
  try {
    // 使用 await 依序調用函數
    const user = await fetchUser(userId);
    console.log("獲取到用戶:", user);
    
    const posts = await fetchUserPosts(user);
    console.log("獲取到文章:", posts);
    
    return { user, posts };
  } catch (error) {
    console.error("獲取用戶文章時出錯:", error);
    throw error; // 重新拋出錯誤
  }
}

// 使用合成函數
console.log("開始獲取用戶資料...");

getUserPosts(1)
  .then(result => {
    console.log("最終結果:", result);
  })
  .catch(error => {
    console.error("主流程錯誤:", error);
  });

/**
 * Python 中的對應:
 * 
 * async def fetch_user(id):
 *     print(f"正在獲取用戶 {id}...")
 *     return {"id": id, "name": f"用戶 {id}"}
 * 
 * async def fetch_user_posts(user):
 *     print(f"正在獲取 {user['name']} 的文章...")
 *     return [
 *         {"id": 1, "title": f"{user['name']} 的第一篇文章"},
 *         {"id": 2, "title": f"{user['name']} 的第二篇文章"}
 *     ]
 * 
 * async def get_user_posts(user_id):
 *     try:
 *         user = await fetch_user(user_id)
 *         print("獲取到用戶:", user)
 *         
 *         posts = await fetch_user_posts(user)
 *         print("獲取到文章:", posts)
 *         
 *         return {"user": user, "posts": posts}
 *     except Exception as e:
 *         print(f"獲取用戶文章時出錯: {e}")
 *         raise
 * 
 * async def main():
 *     print("開始獲取用戶資料...")
 *     try:
 *         result = await get_user_posts(1)
 *         print("最終結果:", result)
 *     except Exception as e:
 *         print(f"主流程錯誤: {e}")
 * 
 * import asyncio
 * asyncio.run(main())
 */ 