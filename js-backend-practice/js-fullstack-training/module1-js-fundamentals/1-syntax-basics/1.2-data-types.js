// ===== JavaScript 資料類型與 Python 比較 =====

// 1. 基本類型
// ----- 數字 -----
// Python: 有 int 和 float 兩種數字類型
// JavaScript: 只有 Number 類型 (內部都是 64 位浮點數)
const jsNumber = 42;
const jsFloat = 3.14;
console.log(typeof jsNumber); // "number"
console.log(typeof jsFloat);  // "number"

// 特殊數字值 (Python 中沒有)
const infinity = Infinity;
const notANumber = NaN;
console.log(1 / 0);  // Infinity
console.log(0 / 0);  // NaN

// ----- 字串 -----
// Python: 單引號和雙引號作用相同
// JavaScript: 單引號、雙引號和反引號(樣板字串)
const singleQuotes = 'Hello';
const doubleQuotes = "World";
const personName = "Alice";
// 模板字串 (類似 Python f-string)
const greeting = `Hello, ${personName}!`; // Python: f"Hello, {name}!"
console.log(greeting); // "Hello, Alice!"

// ----- 布林值 -----
// Python: True, False (首字母大寫)
// JavaScript: true, false (全小寫)
const isActive = true;
const hasPermission = false;

// ----- null 和 undefined -----
// Python: None
// JavaScript: null 和 undefined (兩種不同概念)
const nullValue = null;        // 明確表示沒有值
let undefinedValue;            // 變數宣告但未賦值
console.log(undefinedValue);   // undefined

// ----- 符號 (Symbol) -----
// Python 中沒有等價物
const uniqueSymbol = Symbol('description');
console.log(typeof uniqueSymbol); // "symbol"

// 2. 複合類型
// ----- 物件 (對應 Python 字典) -----
const person = {
    name: "John",         // Python: "name": "John"
    age: 30,
    isEmployed: true
};
console.log(person.name); // "John" (點符號，常用)
console.log(person["age"]); // 30 (方括號符號，類似 Python)

// ----- 陣列 (對應 Python 列表) -----
const fruits = ["apple", "banana", "orange"];
console.log(fruits[0]); // "apple"
console.log(fruits.length); // 3

// ----- 日期 (Python 中使用 datetime 模組) -----
const now = new Date();
console.log(now.toISOString());

// 3. 類型轉換
// ----- 自動轉換 (Python 較少有此情況) -----
console.log("5" + 2);        // "52" (字串連接)
console.log("5" - 2);        // 3 (數值運算)
console.log(true + 1);       // 2 (true 轉為 1)

// ----- 顯式轉換 -----
// 字串轉數字
const stringNumber = "42";
// Python: int("42")
console.log(Number(stringNumber)); // 42
console.log(Number("42"));      // 42
console.log(Number("3.14"));    // 3.14
console.log(Number(""));        // 0
console.log(Number("42px"));    // NaN (因為包含非數值字符)
console.log(Number("0xFF"));    // 255 (可識別十六進制)
console.log(Number(true));      // 1
console.log(Number(false));     // 0
console.log(parseInt(stringNumber, 10)); // 42
console.log(parseInt("42"));       // 42
console.log(parseInt("3.14"));     // 3 (只取整數部分)
console.log(parseInt("42px"));     // 42 (忽略非數字部分)
console.log(parseInt(""));         // NaN
console.log(parseInt("px42"));     // NaN (首字符非數字)
console.log(parseInt("0xFF"));     // 255 (默認識別十六進制)
console.log(parseInt("0xFF", 16)); // 255 (明確指定十六進制)
console.log(parseInt("FF", 16));   // 255 (指定十六進制)
console.log(parseInt("10", 2));    // 2 (二進制解析)
console.log(parseFloat("3.14")); // 3.14
console.log(parseFloat("42"));      // 42
console.log(parseFloat("3.14"));    // 3.14
console.log(parseFloat("3.14.15")); // 3.14 (只識別第一個小數點)
console.log(parseFloat("42px"));    // 42 (忽略非數字部分)
console.log(parseFloat(""));        // NaN
console.log(parseFloat("px42"));    // NaN (首字符非數字)
console.log(parseFloat("0xFF"));    // 0 (只解析 "0")

// 數字轉字串
// Python: str(42)
console.log(String(42)); // "42"
console.log((42).toString()); // "42"

// 4. 類型檢查
// Python: type(value) 或 isinstance(value, type)
// JavaScript: typeof 運算符
console.log(typeof 42);       // "number"
console.log(typeof "hello");  // "string"
console.log(typeof true);     // "boolean"
console.log(typeof {});       // "object"
console.log(typeof []);       // "object" (注意: 陣列也是物件)
console.log(typeof null);     // "object" (這是JS的一個歷史遺留問題)

// 檢查陣列
console.log(Array.isArray([])); // true 