// ===== JavaScript 閉包與作用域 (Closures & Scope) =====

// 閉包是 JavaScript 中一個核心概念，允許函數記住並存取其創建時的作用域
// Python 也有閉包，但 JavaScript 中更為常用且概念略有不同

// 1. 作用域 (Scope)
// ----- 全局作用域 -----
// 全局變數在所有地方都可以訪問
// Python: 全局變數在模組中定義
const globalVar = "我是全局變數";

function testScope() {
    console.log(globalVar); // 可訪問全局變數
    
    // 函數作用域
    const functionVar = "我是函數作用域變數";
    console.log(functionVar); // 可訪問
    
    if (true) {
        // 塊級作用域 (ES6引入的let和const)
        // Python: 沒有真正的塊級作用域
        let blockVar = "我是塊級作用域變數";
        const blockConst = "我也是塊級作用域常量";
        
        console.log(blockVar); // 可訪問
        console.log(functionVar); // 可訪問外層函數作用域
    }
    
    // console.log(blockVar); // 錯誤: blockVar 未定義，塊級變數不能在塊外訪問
    
    // var 聲明的變數有函數作用域，沒有塊級作用域
    if (true) {
        var varInBlock = "var 無視塊級作用域";
    }
    console.log(varInBlock); // 可訪問，因為 var 只有函數作用域
}

testScope();
// console.log(functionVar); // 錯誤: functionVar 未定義，在函數外不可訪問


// 2. 閉包 (Closures)
// 閉包是函數及其能夠訪問的周圍狀態（詞法環境）的組合
// ----- 基本閉包 -----
// Python:
// def create_counter():
//     count = 0
//     def counter():
//         nonlocal count
//         count += 1
//         return count
//     return counter
function createCounter() {
    let count = 0; // 私有變數
    
    return function() {
        count += 1; // 閉包可以訪問和修改外部函數的變數
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 創建另一個計數器實例，有自己獨立的 count 變數
const counter2 = createCounter();
console.log(counter2()); // 1 (獨立的作用域)

// ----- 模擬私有變數 -----
// Python: 使用 _ 前綴約定或 @property 裝飾器
function createPerson(name) {
    let age = 0; // 私有變數
    
    return {
        getName: function() {
            return name;
        },
        getAge: function() {
            return age;
        },
        setAge: function(newAge) {
            if (newAge >= 0) {
                age = newAge;
            }
        },
        birthday: function() {
            age += 1;
            return `${name} 現在 ${age} 歲了!`;
        }
    };
}

const alice = createPerson("Alice");
console.log(alice.getName()); // "Alice"
console.log(alice.getAge()); // 0
alice.setAge(25);
console.log(alice.birthday()); // "Alice 現在 26 歲了!"
// console.log(alice.age); // undefined，無法直接訪問私有變數

// ----- 柯里化 (Currying) 與閉包 -----
// Python: 也可以實現，但更少見
function multiply(a) {
    return function(b) {
        return a * b;
    };
}

const double = multiply(2);
console.log(double(5)); // 10
console.log(double(7)); // 14

// ----- 閉包陷阱：循環中創建閉包 -----
function createFunctions() {
    const functions = [];
    
    // 問題：所有閉包共享同一個 i 變數
    for (var i = 0; i < 3; i++) {
        functions.push(function() {
            return i;
        });
    }
    // 此時 i 已經是 3
    
    return functions;
}

const fns = createFunctions();
console.log(fns[0]()); // 3 (不是 0，因為閉包捕獲的是變數引用，不是值)
console.log(fns[1]()); // 3
console.log(fns[2]()); // 3

// 解決方法 1：使用立即執行函數創建獨立作用域
function createFunctionsFixed1() {
    const functions = [];
    
    for (var i = 0; i < 3; i++) {
        functions.push((function(value) {
            return function() {
                return value;
            };
        })(i));
    }
    
    return functions;
}

// 解決方法 2：使用 let 創建塊級作用域 (ES6+，更推薦)
function createFunctionsFixed2() {
    const functions = [];
    
    for (let i = 0; i < 3; i++) {
        functions.push(function() {
            return i;
        });
    }
    
    return functions;
}

const fixedFns = createFunctionsFixed2();
console.log(fixedFns[0]()); // 0
console.log(fixedFns[1]()); // 1
console.log(fixedFns[2]()); // 2


// 3. 實際應用案例
// ----- 事件處理器 -----
function setupButton(buttonId, message) {
    // document.getElementById(buttonId).addEventListener('click', function() {
    //     console.log(message); // 閉包捕獲 message 變數
    // });
    console.log(`設置了按鈕 ${buttonId} 的點擊處理，將顯示: ${message}`);
}

setupButton('btn1', 'Hello World');

// ----- 模組模式 -----
const calculator = (function() {
    let result = 0;
    
    return {
        add: function(x) {
            result += x;
            return this;
        },
        subtract: function(x) {
            result -= x;
            return this;
        },
        multiply: function(x) {
            result *= x;
            return this;
        },
        getValue: function() {
            return result;
        },
        reset: function() {
            result = 0;
            return this;
        }
    };
})();

console.log(calculator.add(5).multiply(2).subtract(3).getValue()); // 7

// ----- 數據緩存 -----
function createCache() {
    const cache = {};
    
    return function(key, value) {
        if (value === undefined) {
            return cache[key]; // 獲取緩存值
        } else {
            cache[key] = value; // 設置緩存值
            return value;
        }
    };
}

const cache = createCache();
cache('name', 'John');
console.log(cache('name')); // "John"
cache('count', 42);
console.log(cache('count')); // 42 