// ===== JavaScript 箭頭函數 (Arrow Functions) =====

// 箭頭函數是 ES6 引入的簡潔函數語法
// Python 開發者可能熟悉 lambda 表達式，箭頭函數是其增強版
// 但箭頭函數與傳統函數在 this 綁定、arguments 和 new 操作上有區別

// 1. 基本語法
// ----- 傳統函數 -----
// Python: def add(a, b): return a + b
function add(a, b) {
    return a + b;
}
console.log(add(2, 3)); // 5

// ----- 箭頭函數 -----
// Python: add = lambda a, b: a + b
const addArrow = (a, b) => a + b;
console.log(addArrow(2, 3)); // 5


// 2. 箭頭函數語法變體
// ----- 無參數 -----
// Python: say_hello = lambda: "Hello"
const sayHello = () => "Hello";
console.log(sayHello()); // Hello

// ----- 單一參數 (可省略括號) -----
// Python: double = lambda x: x * 2
const double = x => x * 2;
console.log(double(4)); // 8

// ----- 多條語句需使用大括號和return -----
// Python:
// def process(x):
//     result = x * 2
//     return result + 1
const process = x => {
    const result = x * 2;
    return result + 1;
};
console.log(process(3)); // 7

// ----- 返回物件需用括號包裹 -----
// Python: create_user = lambda name, age: {"name": name, "age": age}
const createUser = (name, age) => ({ name, age });
console.log(createUser("Alice", 30)); // { name: "Alice", age: 30 }


// 3. 箭頭函數的 this 綁定
// 箭頭函數不綁定自己的 this，而是繼承父作用域的 this
// Python 沒有直接對應的概念

// ----- 傳統函數中 this 指向調用對象 -----
const user = {
    name: "Bob",
    sayNameTraditional: function() {
        console.log(`My name is ${this.name}`);
    },
    sayNameArrow: () => {
        console.log(`My name is ${this.name}`); // this 不指向 user
    },
    sayNameArrowNested: function() {
        // 內層的箭頭函數繼承外層傳統函數的 this
        setTimeout(() => {
            console.log(`My name is ${this.name}`);
        }, 100);
    },
    sayNameTraditionalNested: function() {
        // 內層的傳統函數有自己的 this
        setTimeout(function() {
            console.log(`My name is ${this.name}`); // this 不指向 user
        }, 100);
    }
};

user.sayNameTraditional(); // My name is Bob
user.sayNameArrow(); // My name is undefined (全局 this.name 為 undefined)

// 在瀏覽器環境中測試以下代碼，這裡只作為演示
// user.sayNameArrowNested(); // My name is Bob (after 100ms)
// user.sayNameTraditionalNested(); // My name is undefined (after 100ms)


// 4. 其他箭頭函數特性
// ----- 沒有自己的 arguments 對象 -----
function regularFunction() {
    console.log(arguments);
    // arguments 是類數組對象，包含所有傳入的參數
}

const arrowFunction = () => {
    // console.log(arguments); // 錯誤：arguments 未定義
    // 箭頭函數中使用 rest 參數代替
    console.log("使用 rest 參數代替 arguments");
};

regularFunction(1, 2, 3); // Arguments object: { '0': 1, '1': 2, '2': 3, ... }
arrowFunction(); // "使用 rest 參數代替 arguments"

// ----- 使用 rest 參數代替 arguments -----
const arrowWithRest = (...args) => {
    console.log(args); // 真正的數組
};
arrowWithRest(1, 2, 3); // [1, 2, 3]

// ----- 不能用作構造函數 -----
// 不能使用 new 操作符
function Person(name) {
    this.name = name;
}
const person1 = new Person("Charlie");
console.log(person1.name); // Charlie

const PersonArrow = (name) => {
    this.name = name; // 這裡的 this 不是新创建的对象
};
// const person2 = new PersonArrow("Diana"); // 錯誤：PersonArrow 不是構造函數

// ----- 沒有 prototype 屬性 -----
console.log(Person.prototype); // Person {}
console.log(PersonArrow.prototype); // undefined


// 5. 箭頭函數的實際應用
// ----- 數組操作 -----
const numbers = [1, 2, 3, 4, 5];

// map
// Python: [x * 2 for x in numbers]
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter
// Python: [x for x in numbers if x % 2 == 0]
const evens = numbers.filter(x => x % 2 === 0);
console.log(evens); // [2, 4]

// reduce
// Python: sum(numbers)
const sum = numbers.reduce((total, x) => total + x, 0);
console.log(sum); // 15

// ----- 即時函數 (Immediately Invoked Function Expression, IIFE) -----
// Python: (lambda: print("IIFE"))()
const result = ((x, y) => x + y)(2, 3);
console.log(result); // 5

// ----- Promise 鏈式調用 -----
// function getData() {
//     return fetch('https://api.example.com/data')
//         .then(response => response.json())
//         .then(data => data.items)
//         .catch(error => console.error(error));
// }

// ----- 事件處理器 -----
// document.getElementById('button').addEventListener('click', () => {
//     console.log('Button clicked!');
// });


// 6. 何時使用箭頭函數 vs. 傳統函數
// ----- 適合使用箭頭函數的場景 -----
// 1. 簡短的回調函數
const fruits = ['apple', 'banana', 'orange'];
const fruitLengths = fruits.map(fruit => fruit.length);

// 2. 不需要自己的 this 的函數
// setInterval(() => console.log('Tick'), 1000);

// 3. 鏈式調用中的處理步驟
const data = [1, 2, 3, 4, 5]
    .filter(num => num % 2 === 0)
    .map(num => num * 10);
console.log(data); // [20, 40]

// ----- 不適合使用箭頭函數的場景 -----
// 1. 對象方法 (需要使用 this 指向對象)
const counter = {
    count: 0,
    // 不推薦: this 不指向 counter
    badIncrement: () => {
        this.count++;
    },
    // 推薦: this 指向 counter
    goodIncrement() {
        this.count++;
    }
};

// 2. 原型方法
// function Counter() {
//     this.count = 0;
// }
// Counter.prototype.increment = function() {
//     this.count++;
// };
// // 不推薦: Counter.prototype.decrement = () => { this.count--; };

// 3. 需要 arguments 對象的函數
// 4. 構造函數
// 5. 需要動態 this 的事件處理器 