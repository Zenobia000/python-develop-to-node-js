// ===== JavaScript 控制流程與 Python 比較 =====

// 1. 條件判斷
// ----- if-else 條件 -----
// Python:
// if age >= 18:
//     print("成年")
// elif age >= 13:
//     print("青少年")
// else:
//     print("兒童")

// JavaScript:
const age = 20;
if (age >= 18) {
    console.log("成年");
} else if (age >= 13) {
    console.log("青少年");
} else {
    console.log("兒童");
}

// ----- 三元運算符 -----
// Python: status = "成年" if age >= 18 else "未成年"
// JavaScript:
const ageStatus = age >= 18 ? "成年" : "未成年";
console.log(ageStatus);

// ----- switch 語句 (Python 中沒有直接對應) -----
// Python 通常使用 if-elif-else 或字典映射
const day = 3;
switch (day) {
    case 1:
        console.log("星期一");
        break;
    case 2:
        console.log("星期二");
        break;
    case 3:
        console.log("星期三");
        break;
    default:
        console.log("其他日子");
}

// 2. 循環結構
// ----- for 循環 -----
// Python: for i in range(5):
//             print(i)
for (let i = 0; i < 5; i++) {
    console.log(i);  // 輸出 0, 1, 2, 3, 4
}

// ----- for...of (類似 Python 的 for...in) -----
// Python: for item in items:
//             print(item)
const items = ["蘋果", "香蕉", "橙子"];
for (const item of items) {
    console.log(item);
}

// ----- for...in (遍歷物件屬性) -----
// Python: for key in dictionary:
//             print(key, dictionary[key])
const person = { name: "John", age: 30, job: "開發者" };
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}


// ----- while 循環 -----
// Python: while count > 0:
//             print(count)
//             count -= 1
let count = 3;
while (count > 0) {
    console.log(`倒數: ${count}`);
    count--;
}

// ----- do...while 循環 (Python 沒有對應) -----
// 至少執行一次再檢查條件
let num = 1;
do {
    console.log(`do-while: ${num}`);
    num++;
} while (num <= 3);

// 3. 跳轉語句
// ----- break 和 continue -----
// Python 中語法相同
for (let i = 0; i < 10; i++) {
    if (i === 3) continue;  // 跳過 3
    if (i === 7) break;     // 遇到 7 結束循環
    console.log(i);         // 輸出 0, 1, 2, 4, 5, 6
}

// 4. 異常處理
// ----- try...catch...finally -----
// Python: try:
//             risky_function()
//         except Exception as e:
//             print(f"錯誤: {e}")
//         finally:
//             print("清理工作")

try {
    // 可能拋出錯誤的代碼
    const result = unknownFunction();  // 未定義的函數
    console.log(result);
} catch (error) {
    console.error(`捕獲到錯誤: ${error.message}`);
} finally {
    console.log("無論如何都會執行的清理代碼");
}

// 5. 短路評估
// ----- 與運算符 (&&) 和 或運算符 (||) -----
// Python 中語法相同
const a = 5;
const b = 0;

// 與運算: 如果第一個值為假，直接返回第一個值，否則返回第二個值
console.log(a && b);  // 0 (b)
console.log(b && a);  // 0 (b)

// 或運算: 如果第一個值為真，直接返回第一個值，否則返回第二個值
console.log(a || b);  // 5 (a)
console.log(b || a);  // 5 (a)

// 6. 空值合併運算符 (??)
// Python: value = user_input if user_input is not None else default_value
const userInput = null;
const defaultValue = "默認值";
const result = userInput ?? defaultValue;
console.log(result);  // "默認值"

// 7. 可選鏈操作符 (?.)
// Python 3.8+: print(user.get("address", {}).get("city"))
const user = {
    name: "Alice",
    address: {
        city: "台北",
        zip: "100"
    }
};

// 安全地訪問可能不存在的屬性
console.log(user?.address?.city);  // "台北"
console.log(user?.contacts?.email);  // undefined (不報錯) 