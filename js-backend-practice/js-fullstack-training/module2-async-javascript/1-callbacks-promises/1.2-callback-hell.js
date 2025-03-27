/**
 * 回調地獄 (Callback Hell) - 為 Python 開發者準備
 * 
 * 當多個非同步操作需要依序執行時，巢狀的回調函數會導致程式碼難以閱讀和維護。
 * 這種情況在 Python 中通常使用 async/await 解決。
 */

// 模擬非同步函數：獲取用戶資料
function getUserData(userId, callback) {
  console.log(`獲取 ID ${userId} 的用戶資料...`);
  
  // 模擬網路請求延遲
  setTimeout(() => {
    const userData = {
      id: userId,
      username: `user${userId}`,
      email: `user${userId}@example.com`
    };
    
    callback(null, userData); // 第一個參數是錯誤（這裡為空），第二個是數據
  }, 1000);
}

// 模擬非同步函數：獲取用戶文章
function getUserPosts(userId, callback) {
  console.log(`獲取用戶 ${userId} 的文章...`);
  
  setTimeout(() => {
    const posts = [
      { id: 1, title: `用戶 ${userId} 的第一篇文章` },
      { id: 2, title: `用戶 ${userId} 的第二篇文章` }
    ];
    
    callback(null, posts);
  }, 1000);
}

// 模擬非同步函數：獲取文章評論
function getPostComments(postId, callback) {
  console.log(`獲取文章 ${postId} 的評論...`);
  
  setTimeout(() => {
    const comments = [
      { id: 1, text: `評論 1 on 文章 ${postId}` },
      { id: 2, text: `評論 2 on 文章 ${postId}` }
    ];
    
    callback(null, comments);
  }, 1000);
}

// ====================
// 回調地獄範例
// ====================
console.log("開始回調地獄範例...");

getUserData(1, (error, user) => {
  if (error) {
    console.error("獲取用戶資料時出錯:", error);
    return;
  }
  
  console.log("用戶資料:", user);
  
  getUserPosts(user.id, (error, posts) => {
    if (error) {
      console.error("獲取文章時出錯:", error);
      return;
    }
    
    console.log("用戶文章:", posts);
    
    // 使用第一篇文章的 ID
    getPostComments(posts[0].id, (error, comments) => {
      if (error) {
        console.error("獲取評論時出錯:", error);
        return;
      }
      
      console.log("文章評論:", comments);
      
      // 如需繼續巢狀，情況會變得更糟...
      // 想像再多幾層...
      
      console.log("所有數據獲取完成");
    });
  });
});

/**
 * Python 中的對比 (using async/await)：
 * 
 * async def get_user_data(user_id):
 *     print(f"獲取 ID {user_id} 的用戶資料...")
 *     await asyncio.sleep(1)  # 模擬延遲
 *     return {"id": user_id, "username": f"user{user_id}", "email": f"user{user_id}@example.com"}
 * 
 * async def get_user_posts(user_id):
 *     print(f"獲取用戶 {user_id} 的文章...")
 *     await asyncio.sleep(1)
 *     return [
 *         {"id": 1, "title": f"用戶 {user_id} 的第一篇文章"},
 *         {"id": 2, "title": f"用戶 {user_id} 的第二篇文章"}
 *     ]
 * 
 * async def get_post_comments(post_id):
 *     print(f"獲取文章 {post_id} 的評論...")
 *     await asyncio.sleep(1)
 *     return [
 *         {"id": 1, "text": f"評論 1 on 文章 {post_id}"},
 *         {"id": 2, "text": f"評論 2 on 文章 {post_id}"}
 *     ]
 * 
 * async def main():
 *     user = await get_user_data(1)
 *     print("用戶資料:", user)
 *     
 *     posts = await get_user_posts(user["id"])
 *     print("用戶文章:", posts)
 *     
 *     comments = await get_post_comments(posts[0]["id"])
 *     print("文章評論:", comments)
 *     
 *     print("所有數據獲取完成")
 * 
 * # 使用 asyncio 運行 main 函數
 * import asyncio
 * asyncio.run(main())
 */

// 這種回調地獄的解決方案是使用 Promise 或 async/await
// 請參閱下一個檔案 1.3-promises-basics.js 和 2.1-async-functions.js 