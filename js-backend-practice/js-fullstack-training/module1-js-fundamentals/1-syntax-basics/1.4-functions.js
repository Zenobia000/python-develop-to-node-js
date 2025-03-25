// ===== JavaScript 函數與 Python 比較 =====

// 1. 基本函數宣告
// ----- 函數宣告語法 -----
// Python:
// def greet(name):
//     return f"Hello, {name}!"

// JavaScript:
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("John"));  // "Hello, John!"

// ----- 函數表達式 -----
// JavaScript 特有，Python 中較少使用此模式
const sayHello = function(name) {
    return `Hello, ${name}!`;
};

console.log(sayHello("Alice"));  // "Hello, Alice!"

// 2. 箭頭函數 (Python 中沒有直接對應，類似於 lambda)
// ----- 基本箭頭函數 -----
// Python: multiply = lambda x, y: x * y
const multiply = (x, y) => x * y;
console.log(multiply(2, 3));  // 6

// ----- 多行箭頭函數 -----
const calculateArea = (width, height) => {
    const area = width * height;
    return area;
};
console.log(calculateArea(5, 3));  // 15

// 3. 參數處理
// ----- 預設參數 -----
// Python: def greet(name, greeting="Hello"):
//             return f"{greeting}, {name}!"
function welcome(name, greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
console.log(welcome("Bob"));  // "Hello, Bob!"
console.log(welcome("Bob", "Hi"));  // "Hi, Bob!"

// ----- 剩餘參數 (類似 Python 的 *args) -----
// Python: def sum_all(*args):
//             return sum(args)
function sumAll(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log(sumAll(1, 2, 3, 4));  // 10

// ----- 參數解構 -----
// Python 通常使用關鍵字參數或字典解包
function displayPerson({ name, age }) {
    console.log(`${name} is ${age} years old.`);
}
displayPerson({ name: "Eve", age: 25 });  // "Eve is 25 years old."

// 4. 閉包 (Closure)
// ----- 閉包概念 -----
// Python 也有閉包，但JavaScript中更常用
function createCounter() {
    let count = 0;  // 私有變數
    
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3

// 5. 高階函數 (Higher-order functions)
// ----- 接受函數作為參數 -----
// Python: def apply_twice(func, value):
//             return func(func(value))
function applyTwice(func, value) {
    return func(func(value));
}

const double = x => x * 2;
console.log(applyTwice(double, 3));  // 12 (3*2*2)

// ----- 返回函數 -----
// Python 也支持，但JavaScript中更常見
function multiplyBy(factor) {
    return function(number) {
        return number * factor;
    };
}

const multiplyByTwo = multiplyBy(2);
const multiplyByThree = multiplyBy(3);

console.log(multiplyByTwo(5));  // 10
console.log(multiplyByThree(5));  // 15

// 6. IIFE (立即調用函數表達式)
// Python 中較少使用此模式
(function() {
    const privateName = "Secret";
    console.log(`IIFE executed: ${privateName}`);
})();

// 7. 函數與 this 關鍵字
// Python 中使用 self 參數，但概念不同
// ----- 普通函數中的 this -----
const user = {
    name: "Alex",
    greet: function() {
        return `Hi, I'm ${this.name}`;
    }
};
console.log(user.greet());  // "Hi, I'm Alex"

// ----- 箭頭函數中的 this (從外部作用域繼承) -----
const person = {
    name: "Taylor",
    regularGreet: function() {
        return `Hi, I'm ${this.name}`;
    },
    arrowGreet: () => {
        // 這裡的 this 不是 person
        return `Arrow greeting: ${this.name}`;
    },
    delayedGreet: function() {
        setTimeout(function() {
            // 在傳統函數中，this 會是 window 或 global
            console.log(`Delayed: Hi, I'm ${this.name}`); // this.name 通常是 undefined
        }, 100);
        
        setTimeout(() => {
            // 箭頭函數保留外部的 this
            console.log(`Arrow delayed: Hi, I'm ${this.name}`); // "Arrow delayed: Hi, I'm Taylor"
        }, 100);
    }
};

person.delayedGreet(); 

// 8. 遞迴函數
// ----- 遞迴實現階乘 -----
// Python: def factorial(n):
//             return 1 if n <= 1 else n * factorial(n-1)
function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
console.log(factorial(5));  // 120

// 9. Generator 函數 (生成器)
// Python: def gen(): yield 1; yield 2; yield 3
function* simpleGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const generator = simpleGenerator();
console.log(generator.next().value);  // 1
console.log(generator.next().value);  // 2
console.log(generator.next().value);  // 3
console.log(generator.next().done);   // true 