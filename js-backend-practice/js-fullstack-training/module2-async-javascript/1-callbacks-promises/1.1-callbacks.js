/**
 * JavaScript 回調函數基礎 - 為 Python 開發者準備
 * 
 * Python 中的函數也可以作為參數傳遞，但 JavaScript 大量使用這種模式
 * 特別是在非同步操作中。
 */

// 基本回調函數範例
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback(); // 執行回調函數
}

// 使用回調函數
greet("Python Developer", function() {
  console.log("This is a callback function");
});

// Python 類比:
// def greet(name, callback):
//     print(f"Hello, {name}!")
//     callback()
// 
// greet("Python Developer", lambda: print("This is a callback function"))

// ----------------------
// 常見用例：計時器
// ----------------------
console.log("計時器開始");

setTimeout(function() {
  console.log("3 秒後執行的回調函數");
}, 3000);

console.log("計時器已設置，但程式繼續執行");

// Python 類比:
// import time
// from threading import Timer
// 
// print("計時器開始")
// Timer(3, lambda: print("3 秒後執行的函數")).start()
// print("計時器已設置，但程式繼續執行")

// ----------------------
// 事件監聽器（瀏覽器環境）
// ----------------------
// document.getElementById("myButton").addEventListener("click", function() {
//   console.log("按鈕被點擊了");
// });

// Python 類比 (Tkinter):
// import tkinter as tk
// root = tk.Tk()
// button = tk.Button(root, text="Click me")
// button.bind("<Button-1>", lambda e: print("按鈕被點擊了"))

// ----------------------
// 實用範例：資料過濾
// ----------------------
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 使用回調函數進行資料過濾
const evenNumbers = numbers.filter(function(number) {
  return number % 2 === 0;
});

console.log("偶數:", evenNumbers);  // [2, 4, 6, 8, 10]

// Python 類比:
// numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
// print("偶數:", even_numbers)  # [2, 4, 6, 8, 10] 