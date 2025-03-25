// ===== JavaScript 展開與剩餘參數 (Spread/Rest) =====

// 展開運算符 (...) 和剩餘參數是 ES6 引入的功能
// 它們共享相同的語法 (...) 但用途不同
// Python 開發者可能熟悉 * 和 ** 運算符，功能類似

// 1. 展開運算符 (Spread Operator)
// 用於「展開」陣列或物件中的元素

// ----- 陣列展開 -----
// 合併陣列
// Python: combined = [*arr1, *arr2]
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 複製陣列
// Python: arr_copy = arr1.copy() 或 arr_copy = arr1[:]
const arrCopy = [...arr1];
console.log(arrCopy); // [1, 2, 3]
// 注意：這是淺拷貝，與 Python 的 .copy() 一樣

// 插入元素
// Python: [1, 2, *middle, 6, 7]
const middle = [3, 4, 5];
const inserted = [1, 2, ...middle, 6, 7];
console.log(inserted); // [1, 2, 3, 4, 5, 6, 7]

// 將字符串展開為字符陣列
// Python: list("hello")
const chars = [..."hello"];
console.log(chars); // ["h", "e", "l", "l", "o"]

// ----- 物件展開 -----
// 合併物件
// Python: {**obj1, **obj2}
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 }; // 注意：b 將被覆蓋
const mergedObj = { ...obj1, ...obj2 };
console.log(mergedObj); // { a: 1, b: 3, c: 4 }

// 複製物件
// Python: obj_copy = obj1.copy()
const objCopy = { ...obj1 };
console.log(objCopy); // { a: 1, b: 2 }
// 注意：這是淺拷貝

// 擴展物件並覆蓋特定屬性
// Python: {**person, "age": 31}
const person = { name: "Alice", age: 30 };
const updatedPerson = { ...person, age: 31 };
console.log(updatedPerson); // { name: "Alice", age: 31 }

// 新增屬性
// Python: {**person, "email": "alice@example.com"}
const personWithEmail = { ...person, email: "alice@example.com" };
console.log(personWithEmail); 
// { name: "Alice", age: 30, email: "alice@example.com" }


// 2. 剩餘參數 (Rest Parameters)
// 用於「收集」多個元素為一個陣列
// Python 中的 *args 和 **kwargs 類似

// ----- 陣列解構中的剩餘參數 -----
// Python: first, *rest = [1, 2, 3, 4, 5]
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [2, 3, 4, 5]

// ----- 物件解構中的剩餘參數 -----
// Python: 沒有直接對應，但可以用字典解壓縮和排除
// name = user.pop("name"); rest_info = user
const user = { name: "Bob", age: 25, job: "designer", city: "台北" };
const { name, ...restInfo } = user;
console.log(name); // "Bob"
console.log(restInfo); // { age: 25, job: "designer", city: "台北" }

// ----- 函數參數中的剩餘參數 -----
// Python: def sum_all(*args): ...
function sumAll(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAll(1, 2, 3)); // 6
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// 結合普通參數和剩餘參數
// Python: def process_user(name, *args): ...
function processUser(name, ...otherInfo) {
    console.log(`Name: ${name}`);
    console.log(`Other info: ${otherInfo}`);
}

processUser("Charlie", 30, "developer", "台北");
// Name: Charlie
// Other info: 30,developer,台北

// 3. 展開與剩餘參數的結合使用

// ----- 函數參數轉發 -----
// Python: def wrapper(*args, **kwargs): original_func(*args, **kwargs)
function original(a, b, c) {
    return a + b + c;
}

function wrapper(...args) {
    console.log("Arguments:", args);
    return original(...args);
}

console.log(wrapper(1, 2, 3)); // Arguments: [1, 2, 3], Result: 6

// ----- 移除陣列中的特定元素 -----
// Python: first, *rest = [1, 2, 3, 4]; [first, *rest[1:]] 
function removeSecondElement(array) {
    const [first, _, ...rest] = array;
    return [first, ...rest];
}

console.log(removeSecondElement([1, 2, 3, 4, 5])); // [1, 3, 4, 5]

// ----- 動態參數收集和展開 -----
function dynamicProcess(action, ...items) {
    console.log(`Action: ${action}`);
    
    if (action === "log") {
        return items.map(item => `Logged: ${item}`);
    } else if (action === "sum") {
        return items.reduce((sum, item) => sum + item, 0);
    } else {
        return ["Unknown action", ...items];
    }
}

console.log(dynamicProcess("log", "A", "B", "C")); 
// ['Logged: A', 'Logged: B', 'Logged: C']
console.log(dynamicProcess("sum", 1, 2, 3, 4)); // 10


// 4. 實際應用場景

// ----- 不定數量參數的函數 -----
// Python: def max_value(*args): return max(args)
function maxValue(...numbers) {
    return Math.max(...numbers);
}
console.log(maxValue(5, 2, 9, 1, 7)); // 9

// ----- 物件屬性過濾 -----
// Python: filtered = {k: v for k, v in user.items() if k != "password"}
function filterSensitiveInfo(user) {
    const { password, ...safeInfo } = user;
    return safeInfo;
}

const userWithPassword = {
    name: "David",
    email: "david@example.com",
    password: "secret123"
};

console.log(filterSensitiveInfo(userWithPassword));
// { name: "David", email: "david@example.com" }

// ----- 預設配置與用戶配置合併 -----
// Python: {**default_config, **user_config}
function createConfig(userConfig) {
    const defaultConfig = {
        theme: "light",
        fontSize: 16,
        showSidebar: true
    };
    
    return { ...defaultConfig, ...userConfig };
}

console.log(createConfig({ theme: "dark" }));
// { theme: "dark", fontSize: 16, showSidebar: true }

// ----- 函數柯里化 -----
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        } else {
            return function(...moreArgs) {
                return curried(...args, ...moreArgs);
            };
        }
    };
}

function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6 