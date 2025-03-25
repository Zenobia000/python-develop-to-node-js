// ===== JavaScript 解構賦值 (Destructuring) =====

// 解構賦值是 ES6 引入的語法，用於從陣列和物件中提取值並賦值給變數
// Python 開發者可能熟悉元組解包和字典獲取值，但 JS 解構更強大和靈活

// 1. 陣列解構
// ----- 基本陣列解構 -----
// Python: a, b, c = [1, 2, 3]
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// ----- 忽略某些元素 -----
// Python: a, _, c = [1, 2, 3]
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// ----- 剩餘運算符 -----
// Python: first, *rest = [1, 2, 3, 4, 5]
const [head, ...rest] = [1, 2, 3, 4, 5];
console.log(head, rest); // 1 [2, 3, 4, 5]

// ----- 默認值 -----
// Python: a, b, c = [1, 2] + [None] * (3 - len([1, 2])); c = 3 if c is None else c
const [x, y, z = 3] = [1, 2];
console.log(x, y, z); // 1 2 3

// ----- 巢狀陣列解構 -----
// Python: a, (b, c) = [1, [2, 3]]
const [i, [j, k]] = [1, [2, 3]];
console.log(i, j, k); // 1 2 3

// ----- 變數交換 -----
// Python: a, b = b, a
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1


// 2. 物件解構
// ----- 基本物件解構 -----
// Python: name, age = person["name"], person["age"]
const person = { name: "Alice", age: 30, job: "developer" };
const { name, age } = person;
console.log(name, age); // Alice 30

// ----- 指定新的變數名 -----
// Python: 需要額外步驟：full_name = person["name"]
const { name: fullName, job: profession } = person;
console.log(fullName, profession); // Alice developer

// ----- 默認值 -----
// Python: gender = person.get("gender", "unknown")
const { gender = "unknown" } = person;
console.log(gender); // unknown

// ----- 巢狀物件解構 -----
// Python: 需要多行處理
const user = {
    id: 1,
    details: {
        firstName: "Bob",
        lastName: "Smith",
        address: {
            city: "台北",
            zipcode: "100"
        }
    }
};

const { details: { firstName, lastName, address: { city } } } = user;
console.log(firstName, lastName, city); // Bob Smith 台北

// ----- 結合剩餘運算符 -----
// Python: 沒有直接對應，需要自定義處理
const { name: userName, ...otherProps } = person;
console.log(userName); // Alice
console.log(otherProps); // { age: 30, job: "developer" }


// 3. 函數參數解構
// ----- 陣列參數解構 -----
// Python: def process_point(x, y): ...
// 調用: process_point(*point)
function processPoint([x, y]) {
    console.log(`X: ${x}, Y: ${y}`);
}

processPoint([10, 20]); // X: 10, Y: 20

// ----- 物件參數解構 -----
// Python: def process_user(name, age, job="unknown"): ...
// 調用: process_user(**user_dict)
function processUser({ name, age, job = "unknown" }) {
    console.log(`${name} is ${age} years old and works as ${job}`);
}

processUser({ name: "Charlie", age: 35 }); // Charlie is 35 years old and works as unknown
processUser({ name: "Diana", age: 28, job: "designer" }); // Diana is 28 years old and works as designer

// ----- 從函數返回多個值 -----
// Python: def get_dimensions(): return width, height
function getDimensions() {
    return { width: 100, height: 200, unit: "px" };
}

const { width, height } = getDimensions();
console.log(width, height); // 100 200

// ----- 導入時解構 -----
// Python: from module import func1, func2
// const { useState, useEffect } = require('react');

// ----- 迭代時解構 -----
// Python: for name, score in scores.items(): ...
const scores = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 80 },
    { name: "Charlie", score: 90 }
];

// 直接解構陣列中的對象
for (const { name, score } of scores) {
    console.log(`${name}: ${score}`);
}
// Alice: 95
// Bob: 80
// Charlie: 90


// 4. 解構的進階用法
// ----- 動態屬性名解構 -----
// Python: 需要額外步驟
const key = "name";
// 注意：不能直接在解構中使用變數作為鍵名
// 但可以使用計算屬性名來實現類似效果
const { [key]: dynamicValue } = person;
console.log(dynamicValue); // Alice

// ----- 解構與類型轉換 -----
// 將字符串轉為數字
const { age: numericAge = parseInt("30") } = {};
console.log(numericAge); // 30

// ----- 有條件的解構 -----
// 只有存在時才解構
const config = null;
// 防止解構 null/undefined 導致錯誤
const { debug = false } = config || {};
console.log(debug); // false 

