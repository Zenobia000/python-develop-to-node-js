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