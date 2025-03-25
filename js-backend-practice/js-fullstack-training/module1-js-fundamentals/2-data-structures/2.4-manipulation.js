// ===== JavaScript 資料操作技巧 =====

// 1. 解構賦值 (Destructuring)
// ----- 陣列解構 -----
// Python: a, b, c = [1, 2, 3]
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳過元素
// Python: a, _, c = [1, 2, 3]
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// 剩餘元素
// Python: head, *tail = [1, 2, 3, 4, 5]
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head, tail); // 1 [2, 3, 4, 5]

// 設置默認值
// Python: a, b, c = [1, 2] + [None] * (3 - len([1, 2]))
//         c = c if c is not None else 3
const [x, y, z = 3] = [1, 2];
console.log(x, y, z); // 1 2 3

// ----- 物件解構 -----
// Python: name, age = person['name'], person['age']
const person = { name: "John", age: 30, job: "developer" };
const { name, age } = person;
console.log(name, age); // "John" 30

// 重命名
// Python: 沒有直接對應語法
const { name: fullName, job: profession } = person;
console.log(fullName, profession); // "John" "developer"

// 嵌套解構
// Python: 需要多行處理
const user = {
    id: 1,
    details: {
        firstName: "Alice",
        lastName: "Smith",
        address: {
            city: "台北",
            country: "台灣"
        }
    }
};

const { details: { firstName, address: { city } } } = user;
console.log(firstName, city); // "Alice" "台北"

// 2. 展開運算符 (Spread Operator)
// ----- 陣列展開 -----
// Python: [*arr1, *arr2]
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合併陣列
// Python: combined = arr1 + arr2
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 複製陣列
// Python: arr_copy = arr1.copy() 或 arr_copy = arr1[:]
const arrCopy = [...arr1];
console.log(arrCopy); // [1, 2, 3]

// 在特定位置插入元素
// Python: [1, 2, *arr2, 3]
const inserted = [1, 2, ...arr2, 3];
console.log(inserted); // [1, 2, 4, 5, 6, 3]

// ----- 物件展開 -----
// Python: {**obj1, **obj2}
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// 合併物件 (後面的覆蓋前面的相同屬性)
const mergedObj = { ...obj1, ...obj2 };
console.log(mergedObj); // { a: 1, b: 3, c: 4 }

// 複製物件並修改部分屬性
// Python: new_person = {**person, 'age': 31}
const updatedPerson = { ...person, age: 31, email: "john@example.com" };
console.log(updatedPerson);
// { name: "John", age: 31, job: "developer", email: "john@example.com" }

// 3. 函數式陣列操作
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ----- 過濾 (filter) -----
// Python: [x for x in numbers if x % 2 == 0]
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// ----- 映射 (map) -----
// Python: [x * 2 for x in numbers]
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// ----- 歸約 (reduce) -----
// Python: sum(numbers) 或 functools.reduce(lambda x, y: x + y, numbers)
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 55

// 複雜歸約: 分組
// Python: 
// groups = {}
// for num in numbers:
//     key = 'even' if num % 2 == 0 else 'odd'
//     if key not in groups: groups[key] = []
//     groups[key].append(num)
const grouped = numbers.reduce((result, num) => {
    const key = num % 2 === 0 ? 'even' : 'odd';
    if (!result[key]) result[key] = [];
    result[key].push(num);
    return result;
}, {});
console.log(grouped); // { odd: [1, 3, 5, 7, 9], even: [2, 4, 6, 8, 10] }

// ----- 找尋 (find) -----
// Python: next((x for x in numbers if x > 5), None)
const firstOver5 = numbers.find(num => num > 5);
console.log(firstOver5); // 6

// ----- 檢查條件 (some/every) -----
// Python: any(x > 5 for x in numbers)
const hasOver5 = numbers.some(num => num > 5);
console.log(hasOver5); // true

// Python: all(x > 0 for x in numbers)
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

// 4. 鏈式操作 (Method Chaining)
// 實現複雜資料轉換
// Python 需要多步驟或使用 pipe 庫
const data = [
    { id: 1, name: "Alice", score: 85 },
    { id: 2, name: "Bob", score: 92 },
    { id: 3, name: "Charlie", score: 78 },
    { id: 4, name: "David", score: 95 },
    { id: 5, name: "Eve", score: 88 }
];

// 過濾-映射-排序 鏈式操作
const result = data
    .filter(student => student.score >= 85)         // 過濾高分
    .map(student => ({                              // 映射成新格式
        fullName: student.name,
        grade: student.score >= 90 ? 'A' : 'B'
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName)); // 按名字排序

console.log(result);
// [
//   { fullName: "Alice", grade: "B" },
//   { fullName: "Bob", grade: "A" },
//   { fullName: "David", grade: "A" },
//   { fullName: "Eve", grade: "B" }
// ]

// 5. 巧用解構與展開
// ----- 交換變數 -----
// Python: a, b = b, a
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1

// ----- 從函數返回多個值 -----
function getUser() {
    // Python: return name, age, email
    return ["John", 30, "john@example.com"];
}

// Python: name, age, email = get_user()
const [userName, userAge, userEmail] = getUser();
console.log(userName, userAge, userEmail); // "John" 30 "john@example.com"

// 更好的方式：返回物件並解構
function getBetterUser() {
    // Python: return {"name": "Alice", "age": 25, "email": "alice@example.com"}
    return {
        name: "Alice",
        age: 25,
        email: "alice@example.com"
    };
}

const { name: userName2, age: userAge2 } = getBetterUser();
console.log(userName2, userAge2); // "Alice" 25

// ----- 合併解構與默認參數 -----
// Python: def process_config(config=None):
//             config = config or {}
//             debug = config.get('debug', False)
//             timeout = config.get('timeout', 1000)
function processConfig({ debug = false, timeout = 1000 } = {}) {
    console.log(`Debug: ${debug}, Timeout: ${timeout}`);
}

processConfig({ debug: true }); // "Debug: true, Timeout: 1000"
processConfig({}); // "Debug: false, Timeout: 1000"
processConfig(); // "Debug: false, Timeout: 1000"

// 6. 深拷貝與淺拷貝
// ----- 淺拷貝 -----
const original = { a: 1, b: { c: 2 } };

// 方法1: 展開運算符
const shallowCopy1 = { ...original };

// 方法2: Object.assign
const shallowCopy2 = Object.assign({}, original);

// 修改淺拷貝會影響原始嵌套物件
shallowCopy1.b.c = 99;
console.log(original.b.c); // 99 (原始物件的嵌套屬性被修改)

// ----- 深拷貝 -----
// 方法1: JSON 轉換 (簡單但有局限性，不處理函數、循環引用等)
const deepCopy1 = JSON.parse(JSON.stringify(original));

// 方法2: 第三方庫如 lodash (推薦)
// const deepCopy2 = _.cloneDeep(original);

// 方法3: 自定義遞歸函數 (簡單示例)
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    const copy = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            copy[key] = deepClone(obj[key]);
        }
    }
    
    return copy;
}

const deepCopy3 = deepClone(original);
deepCopy3.b.c = 42;
console.log(original.b.c); // 仍然是 99 (原始物件未被修改)

// 7. 實用技巧
// ----- 條件屬性 -----
const isPremium = true;
const userConfig = {
    name: "Alice",
    email: "alice@example.com",
    ...(isPremium && { level: "premium", maxStorage: "100GB" })
};
console.log(userConfig);
// 包含 level 和 maxStorage，因為 isPremium 為 true

// ----- 從物件中移除屬性並獲取其餘部分 -----
// Python: (使用字典解包與排除)
// name, *rest = person_data.pop('name'), person_data
const userData = { name: "Bob", age: 28, email: "bob@example.com", password: "secret" };
const { password, ...safeUserData } = userData;
console.log(safeUserData); // { name: "Bob", age: 28, email: "bob@example.com" }

// ----- 動態屬性名 -----
const field = "email";
const dynamicObj = {
    name: "Charlie",
    [field]: "charlie@example.com" // 動態屬性名
};
console.log(dynamicObj); // { name: "Charlie", email: "charlie@example.com" } 