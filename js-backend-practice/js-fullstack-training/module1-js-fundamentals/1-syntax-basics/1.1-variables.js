// ===== JavaScript 變數宣告與 Python 比較 =====

// 1. 變數宣告方式
// Python: 直接賦值即可宣告變數
// name = "John"

// JavaScript: 使用 let 宣告可變變數 (推薦)
let name = "John";
name = "Jane"; // 可以重新賦值

// 2. 常數宣告
// Python: 通常使用大寫變數名表示常數，但沒有真正的常數
// PI = 3.14159

// JavaScript: 使用 const 宣告常數
const PI = 3.14159;
// PI = 3; // 這會報錯: Assignment to constant variable

// 3. 作用域比較
// Python: 有全局作用域和函數作用域，沒有塊級作用域
// JavaScript: 有全局、函數、塊級作用域

// 塊級作用域示例 (Python 中沒有這個概念)
{
    let blockScoped = "只在這個塊中可見";
    const alsoBlockScoped = "也只在這個塊中可見";
    console.log(blockScoped); // 正常顯示
}
// console.log(blockScoped); // 錯誤: blockScoped is not defined

// 4. 舊式變數宣告 - var (不推薦使用)
// var 有函數作用域，但沒有塊級作用域，會造成混淆
var oldStyle = "舊式變數";
{
    var oldStyle = "在塊中修改";
}
console.log(oldStyle); // 輸出: "在塊中修改" - 塊外的變數被修改了!

// 5. 多重賦值
// Python: a, b = 1, 2

// JavaScript: 使用解構賦值
let [a, b] = [1, 2];
console.log(a, b); // 輸出: 1 2

// 6. 命名規則
// Python: 常用 snake_case
// first_name = "John"

// JavaScript: 常用 camelCase
let firstName = "John";

// 變數提升 (Hoisting) - JavaScript 獨有特性
console.log(hoisted); // 輸出: undefined (而非報錯)
var hoisted = "被提升的變數";

// 最佳實踐: 使用 let 和 const，避免使用 var
// const 用於不變的值，let 用於需要改變的值 