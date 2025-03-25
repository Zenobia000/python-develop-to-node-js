// ===== JavaScript 實用工具庫練習 =====
// 本練習將幫助 Python 開發者建立一個類似於 lodash 的 JavaScript 工具庫

// ----- Utility 工具庫 -----
// 我們將創建一個名為 _ 的對象（類似於 lodash），並在其上添加實用函數
const _ = {};

// ===== 字串操作 =====

// 首字母大寫
// Python: str.capitalize()
_.capitalize = function(str) {
    if (typeof str !== 'string' || !str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

// 截斷字串到指定長度，並添加省略號
// Python: textwrap.shorten()
_.truncate = function(str, length = 30, suffix = '...') {
    if (typeof str !== 'string') return '';
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
};

// 將駝峰式命名轉換為連字符式命名
// Python: 需自行實現
_.kebabCase = function(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
};

// 檢查字串是否是回文
// Python: s == s[::-1]
_.isPalindrome = function(str) {
    if (typeof str !== 'string') return false;
    str = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return str === str.split('').reverse().join('');
};

// ===== 數字操作 =====

// 將數字限制在範圍內
// Python: min(max(num, minVal), maxVal)
_.clamp = function(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
};

// 生成指定範圍內的隨機整數
// Python: random.randint(min, max)
_.random = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 計算平均值
// Python: sum(nums) / len(nums)
_.mean = function(nums) {
    if (!Array.isArray(nums) || nums.length === 0) return NaN;
    return nums.reduce((sum, n) => sum + n, 0) / nums.length;
};

// 四捨五入到指定小數位
// Python: round(num, precision)
_.round = function(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
};

// ===== 陣列操作 =====

// 獲取陣列中的最後一個元素
// Python: arr[-1]
_.last = function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr[arr.length - 1];
};

// 檢查陣列是否包含特定值
// Python: value in arr
_.includes = function(arr, value) {
    if (!Array.isArray(arr)) return false;
    return arr.includes(value);
};

// 移除陣列中的所有指定值
// Python: [x for x in arr if x != value]
_.without = function(arr, ...values) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => !values.includes(item));
};

// 將陣列分組成指定大小的塊
// Python: [arr[i:i+size] for i in range(0, len(arr), size)]
_.chunk = function(arr, size = 1) {
    if (!Array.isArray(arr)) return [];
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

// 移除陣列中的重複值
// Python: list(set(arr))
_.unique = function(arr) {
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr)];
};

// ===== 物件操作 =====

// 獲取物件的鍵
// Python: obj.keys()
_.keys = function(obj) {
    if (obj === null || typeof obj !== 'object') return [];
    return Object.keys(obj);
};

// 獲取物件的值
// Python: obj.values()
_.values = function(obj) {
    if (obj === null || typeof obj !== 'object') return [];
    return Object.values(obj);
};

// 挑選物件的特定屬性
// Python: {k: obj[k] for k in keys if k in obj}
_.pick = function(obj, ...keys) {
    if (obj === null || typeof obj !== 'object') return {};
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};

// 移除物件的特定屬性
// Python: {k: v for k, v in obj.items() if k not in keys}
_.omit = function(obj, ...keys) {
    if (obj === null || typeof obj !== 'object') return {};
    return Object.keys(obj).reduce((result, key) => {
        if (!keys.includes(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};

// ===== 函數操作 =====

// 延遲執行函數
// Python: 使用 time.sleep()
_.delay = function(func, wait, ...args) {
    return setTimeout(() => func(...args), wait);
};

// 節流函數：限制函數在一段時間內只能執行一次
_.throttle = function(func, wait) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= wait) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
};

// 防抖函數：函數在一段時間內沒有被再次調用，才執行
_.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// 柯里化函數：將多參數函數轉換為一系列單參數函數
// Python: 需自行實現
_.curry = function(fn) {
    const arity = fn.length;
    return function curried(...args) {
        if (args.length >= arity) {
            return fn.apply(this, args);
        } else {
            return function(...moreArgs) {
                return curried.apply(this, args.concat(moreArgs));
            };
        }
    };
};

// ===== 日期操作 =====

// 格式化日期
// Python: datetime.strftime()
_.formatDate = function(date, format = 'YYYY-MM-DD') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    const pad = (num) => num.toString().padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', pad(month))
        .replace('DD', pad(day))
        .replace('HH', pad(hours))
        .replace('mm', pad(minutes))
        .replace('ss', pad(seconds));
};

// 檢查日期是否在今天
_.isToday = function(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

// 計算兩個日期相差的天數
_.daysBetween = function(dateA, dateB) {
    if (!(dateA instanceof Date)) {
        dateA = new Date(dateA);
    }
    if (!(dateB instanceof Date)) {
        dateB = new Date(dateB);
    }
    
    // 將日期設為當日0時0分0秒，僅比較日期部分
    const a = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const b = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
    
    const diffMs = Math.abs(a - b);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

// ===== 測試我們的工具庫 =====

// 字串操作測試
console.log("\n----- 字串操作測試 -----");
console.log("capitalize:", _.capitalize('hello world')); // "Hello world"
console.log("truncate:", _.truncate("這是一個很長的字串，需要被截斷", 15)); // "這是一個很長的字串..."
console.log("kebabCase:", _.kebabCase("helloWorld")); // "hello-world"
console.log("isPalindrome:", _.isPalindrome("A man, a plan, a canal: Panama")); // true

// 數字操作測試
console.log("\n----- 數字操作測試 -----");
console.log("clamp:", _.clamp(15, 10, 20)); // 15
console.log("clamp:", _.clamp(5, 10, 20)); // 10
console.log("random:", _.random(1, 10)); // 1到10之間的隨機數
console.log("mean:", _.mean([1, 2, 3, 4, 5])); // 3
console.log("round:", _.round(3.1415926, 2)); // 3.14

// 陣列操作測試
console.log("\n----- 陣列操作測試 -----");
console.log("last:", _.last([1, 2, 3, 4, 5])); // 5
console.log("includes:", _.includes([1, 2, 3], 2)); // true
console.log("without:", _.without([1, 2, 3, 1, 2], 1, 2)); // [3]
console.log("chunk:", _.chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log("unique:", _.unique([1, 2, 3, 1, 2])); // [1, 2, 3]

// 物件操作測試
console.log("\n----- 物件操作測試 -----");
const obj = { a: 1, b: 2, c: 3 };
console.log("keys:", _.keys(obj)); // ["a", "b", "c"]
console.log("values:", _.values(obj)); // [1, 2, 3]
console.log("pick:", _.pick(obj, 'a', 'c')); // { a: 1, c: 3 }
console.log("omit:", _.omit(obj, 'b')); // { a: 1, c: 3 }

// 函數操作測試
console.log("\n----- 函數操作測試 -----");
const add = (a, b) => a + b;
const curriedAdd = _.curry(add);
console.log("curry:", curriedAdd(2)(3)); // 5

// 日期操作測試
console.log("\n----- 日期操作測試 -----");
console.log("formatDate:", _.formatDate(new Date())); // 今天日期，格式 YYYY-MM-DD
console.log("isToday:", _.isToday(new Date())); // true
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 5);
console.log("daysBetween:", _.daysBetween(new Date(), pastDate)); // 5

// ===== 挑戰：擴展你的工具庫 =====
// 1. 添加一個 memoize 函數，用於緩存函數的計算結果
// 2. 添加一個 flatten 函數，用於扁平化嵌套數組
// 3. 添加一個 times 函數，用於重複執行函數 n 次
// 4. 添加一個 deepClone 函數，用於深度克隆對象或數組

// 1. Memoize
_.memoize = function(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

// 測試 memoize
function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const fastFibonacci = _.memoize(function(n) {
    if (n < 2) return n;
    return fastFibonacci(n - 1) + fastFibonacci(n - 2);
});

console.log("\n----- Memoize 測試 -----");
console.time('standard fibonacci');
console.log("fibonacci(20):", fibonacci(20));
console.timeEnd('standard fibonacci');

console.time('memoized fibonacci');
console.log("fastFibonacci(20):", fastFibonacci(20));
console.timeEnd('memoized fibonacci');

// 2. Flatten
_.flatten = function(arr, depth = 1) {
    if (!Array.isArray(arr)) return [];
    
    return depth > 0
        ? arr.reduce((acc, val) => 
            acc.concat(Array.isArray(val) ? _.flatten(val, depth - 1) : val), [])
        : arr.slice();
};

console.log("\n----- Flatten 測試 -----");
console.log("flatten:", _.flatten([1, [2, [3, [4]], 5]])); // [1, 2, [3, [4]], 5]
console.log("flatten deep:", _.flatten([1, [2, [3, [4]], 5]], Infinity)); // [1, 2, 3, 4, 5]

// 3. Times
_.times = function(n, iteratee) {
    const results = Array(n);
    for (let i = 0; i < n; i++) {
        results[i] = iteratee(i);
    }
    return results;
};

console.log("\n----- Times 測試 -----");
console.log("times:", _.times(5, i => i * i)); // [0, 1, 4, 9, 16]

// 4. Deep Clone
_.deepClone = function(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    // 處理日期
    if (obj instanceof Date) return new Date(obj);
    
    // 處理數組
    if (Array.isArray(obj)) {
        return obj.map(item => _.deepClone(item));
    }
    
    // 處理普通對象
    const cloned = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            cloned[key] = _.deepClone(obj[key]);
        }
    }
    return cloned;
};

console.log("\n----- Deep Clone 測試 -----");
const original = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
const clone = _.deepClone(original);
original.b.d[2].e = 99;
console.log("original:", original);
console.log("clone:", clone); 