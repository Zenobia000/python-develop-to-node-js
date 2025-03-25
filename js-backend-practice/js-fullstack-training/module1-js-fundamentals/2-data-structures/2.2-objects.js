// ===== JavaScript 物件操作與 Python 字典比較 =====

// 1. 創建物件
// ----- 物件字面量 -----
// Python: person = {"name": "John", "age": 30}
const person = {
    name: "John",          // JS 不需要對鍵加引號(除非有特殊字元)
    age: 30,
    "job-title": "開發者"   // 包含特殊字元的鍵需要引號
};
console.log(person);

// ----- 使用建構函數 -----
// Python: empty_dict = dict()
const emptyObject = new Object();
console.log(emptyObject); // {}

// 2. 訪問屬性
// ----- 點符號 (常用) -----
// Python: person["name"] 
console.log(person.name); // "John"

// ----- 方括號符號 -----
// Python: person["name"]
console.log(person["name"]); // "John"
// 必須使用方括號的情況
console.log(person["job-title"]); // "開發者"

// ----- 動態屬性名 -----
const key = "age";
console.log(person[key]); // 30 (Python: person[key])

// 3. 修改和添加屬性
// ----- 修改屬性 -----
// Python: person["age"] = 31
person.age = 31;
console.log(person.age); // 31

// ----- 添加新屬性 -----
// Python: person["email"] = "john@example.com"
person.email = "john@example.com";
console.log(person); // 包含新的 email 屬性

// 4. 刪除屬性
// Python: del person["age"]
delete person.age;
console.log(person); // 已不包含 age 屬性

// 5. 檢查屬性存在
// Python: "name" in person
console.log("name" in person); // true
console.log(person.hasOwnProperty("name")); // true (只檢查自身屬性)

// 6. 獲取所有鍵和值
// ----- 獲取所有鍵 -----
// Python: list(person.keys())
const keys = Object.keys(person);
console.log(keys); // ["name", "job-title", "email"]

// ----- 獲取所有值 -----
// Python: list(person.values())
const values = Object.values(person);
console.log(values); // ["John", "開發者", "john@example.com"]

// ----- 獲取鍵值對 -----
// Python: list(person.items())
const entries = Object.entries(person);
console.log(entries); // [["name", "John"], ["job-title", "開發者"], ["email", "john@example.com"]]

// 7. 物件合併
// Python: merged = {**obj1, **obj2}
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 }; // 注意 b 會被覆蓋

// 使用 Object.assign 合併
const merged1 = Object.assign({}, obj1, obj2);
console.log(merged1); // { a: 1, b: 3, c: 4 }

// 使用展開運算符 (更現代的方式)
const merged2 = { ...obj1, ...obj2 };
console.log(merged2); // { a: 1, b: 3, c: 4 }

// 8. 物件解構
// ----- 基本解構 -----
// Python: name, job_title = person["name"], person["job-title"]
const { name, email } = person;
console.log(name, email); // "John" "john@example.com"

// ----- 重命名 -----
// Python: 沒有直接對應語法
const { name: fullName, "job-title": jobTitle } = person;
console.log(fullName, jobTitle); // "John" "開發者"

// ----- 設置默認值 -----
// Python: age = person.get("age", 25)
const { age = 25 } = person;
console.log(age); // 25 (因為 age 已被刪除)

// 9. 深層嵌套
// Python: nested = {"user": {"details": {"address": {"city": "台北"}}}}
const nested = {
    user: {
        details: {
            address: {
                city: "台北",
                zipcode: "100"
            }
        }
    }
};

// 存取深層屬性 
console.log(nested.user.details.address.city); // "台北"

// 深層解構
const { user: { details: { address: { city } } } } = nested;
console.log(city); // "台北"

// 10. 物件方法
const calculator = {
    value: 0,
    // 物件方法
    add(num) {  // 簡短語法 (等同於 add: function(num) {})
        this.value += num;
        return this;
    },
    subtract(num) {
        this.value -= num;
        return this;
    },
    getValue() {
        return this.value;
    }
};

// 方法鏈式調用
console.log(calculator.add(5).subtract(2).add(10).getValue()); // 13

// 11. 凍結與密封物件
// ----- 凍結物件 (不可修改、添加或刪除) -----
// Python: 沒有內置等價功能
const frozenConfig = Object.freeze({
    apiKey: "abc123",
    serverUrl: "https://api.example.com"
});

// 嘗試修改會失敗 (嚴格模式下會拋出錯誤)
frozenConfig.apiKey = "xyz";  // 不起作用
console.log(frozenConfig.apiKey); // 仍然是 "abc123"

// ----- 密封對象 (可修改已有屬性，但不能添加或刪除) -----
const sealedConfig = Object.seal({
    timeout: 1000,
    retries: 3
});

sealedConfig.timeout = 2000; // 可以修改
console.log(sealedConfig.timeout); // 2000

sealedConfig.newProp = "test"; // 不起作用
console.log(sealedConfig.newProp); // undefined

// 12. 物件判等
// Python 中可以直接比較字典: dict1 == dict2
const objA = { a: 1, b: 2 };
const objB = { a: 1, b: 2 };
const objC = objA;

console.log(objA === objB); // false (不同參考，即使內容相同)
console.log(objA === objC); // true (相同參考)

// 內容比較 (類似 Python 的 dict1 == dict2)
console.log(JSON.stringify(objA) === JSON.stringify(objB)); // true 