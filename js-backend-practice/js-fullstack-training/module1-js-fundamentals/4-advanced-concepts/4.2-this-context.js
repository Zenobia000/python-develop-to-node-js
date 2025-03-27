// ===== JavaScript this 關鍵字 =====

// 'this' 是 JavaScript 中最令人困惑的概念之一
// 與 Python 的 self 不同，JavaScript 的 this 依調用方式而變化
// Python 的 self 是顯式傳遞的第一個參數，而 this 是隱式決定的

// 1. 全局環境中的 this
// 在瀏覽器中，全局的 this 指向 window 對象
// 在 Node.js 中，全局的 this 指向 global 對象，在模块中是 module.exports
console.log("全局中的 this:");
console.log(this); // 瀏覽器: Window, Node.js: {} 或 global

// 2. 函數中的 this
// ----- 普通函數調用 -----
// 普通函數中的 this 通常指向全局對象 (非嚴格模式)
function showThis() {
    console.log("普通函數中的 this:");
    console.log(this); // 瀏覽器: Window, Node.js: global
}
showThis();

// ----- 嚴格模式 -----
// 嚴格模式下，普通函數中的 this 是 undefined
function strictShowThis() {
    'use strict';
    console.log("嚴格模式下的 this:");
    console.log(this); // undefined
}
strictShowThis();

// 3. 方法中的 this
// ----- 對象方法 -----
// 當函數作為對象的方法調用時，this 指向該對象
// Python: def method(self): print(self)
const user = {
    name: "Alice",
    greet: function() {
        console.log(`Hello, I'm ${this.name}`);
    },
    // 簡短語法 (ES6+)
    sayHi() {
        console.log(`Hi from ${this.name}`);
    }
};

user.greet(); // "Hello, I'm Alice" (this 是 user)
user.sayHi(); // "Hi from Alice" (this 是 user)

// ----- 方法分離後調用 -----
// 如果將方法保存到變數中再調用，this 將丟失原始上下文
const greetFunc = user.greet;
// greetFunc(); // "Hello, I'm undefined" (this 不再是 user)

// 解決方法 1: bind
const boundGreet = user.greet.bind(user);
boundGreet(); // "Hello, I'm Alice" (this 被綁定為 user)

// 解決方法 2: 箭頭函數不綁定自己的 this
const user2 = {
    name: "Bob",
    hobbies: ["reading", "gaming", "coding"],
    showHobbies() {
        // 箭頭函數繼承外層的 this
        this.hobbies.forEach(hobby => {
            console.log(`${this.name} likes ${hobby}`);
        });
        
        // 與以下使用 bind 的寫法等效
        // this.hobbies.forEach(function(hobby) {
        //     console.log(`${this.name} likes ${hobby}`);
        // }.bind(this));
        
        // 問題寫法: this 丟失
        this.hobbies.forEach(function(hobby) {
            console.log(`${this.name} likes ${hobby}`); // this.name 是 undefined
        });
    }
};

user2.showHobbies();
// "Bob likes reading"
// "Bob likes gaming"
// "Bob likes coding"


// 4. 構造函數中的 this
// ----- 使用 new 調用函數 -----
// 當使用 new 調用函數時，this 指向新創建的對象
// Python: self 指向實例
function Person(name) {
    this.name = name;
    this.sayName = function() {
        console.log(`My name is ${this.name}`);
    };
}

const john = new Person("John");
john.sayName(); // "My name is John" (this 是 john)

// 忘記使用 new 會有問題
// const badExample = Person("BadExample"); // 在全局作用域設置 name
// console.log(badExample); // undefined，沒有返回值
// console.log(window.name); // 在瀏覽器中會是 "BadExample"

// 5. call, apply, bind 方法
// 這些方法允許明確設置 this 的值
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

// ----- call: 設置 this 並傳入參數列表 -----
// Python: 沒有直接等價物，近似於 introduce(alice, "Hello", "!")
introduce.call(alice, "Hello", "!"); // "Hello, I'm Alice!"

// ----- apply: 設置 this 並傳入參數數組 -----
// Python: 近似於 introduce(bob, *["Hi", "..."])
introduce.apply(bob, ["Hi", "..."]); // "Hi, I'm Bob..."

// ----- bind: 創建新函數，this 被永久綁定 -----
// Python: 沒有直接等價物，需要自定義包裝器
const charlieIntroduce = introduce.bind({ name: "Charlie" });
charlieIntroduce("Hey", "~"); // "Hey, I'm Charlie~"

// bind 也可以預設部分參數 (柯里化)
const aliceGreeting = introduce.bind(alice, "Welcome");
aliceGreeting("!"); // "Welcome, I'm Alice!"


// 6. 類和 this
// ES6 類中，方法中的 this 行為與對象方法一致
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Animal {
    speak() {
        console.log(`${this.name} barks.`);
    }
}

const dog = new Dog("Rex");
dog.speak(); // "Rex barks."

// 類方法分離後調用也會丟失 this
const dogSpeak = dog.speak;
// dogSpeak(); // "undefined barks."


// 7. 常見陷阱與解決方案
// ----- 回調函數中的 this -----
class Button {
    constructor(text) {
        this.text = text;
    }
    
    // 問題：callback 中的 this 指向全局
    registerClickBad() {
        document.addEventListener('click', function() {
            console.log(`Button ${this.text} clicked!`); // this.text 是 undefined
        });
        console.log("已註冊點擊處理 (但 this 會丟失)");
    }
    
    // 解決方案 1：保存 this
    registerClickBetter1() {
        const self = this;
        document.addEventListener('click', function() {
            console.log(`Button ${self.text} clicked!`); // 使用閉包捕獲的 self
        });
        console.log("已註冊點擊處理 (使用 self)");
    }
    
    // 解決方案 2：綁定 this
    registerClickBetter2() {
        document.addEventListener('click', function() {
            console.log(`Button ${this.text} clicked!`);
        }.bind(this));
        console.log("已註冊點擊處理 (使用 bind)");
    }
    
    // 解決方案 3：使用箭頭函數 (ES6+, 推薦)
    registerClick() {
        document.addEventListener('click', () => {
            console.log(`Button ${this.text} clicked!`);
        });
        console.log("已註冊點擊處理 (使用箭頭函數)");
    }
}

const button = new Button("Submit");
button.registerClick();


// 8. this 在不同環境的小結

// 1. 全局環境: this 是全局對象 (瀏覽器中是 window, Node.js 中是 global)
// 2. 函數調用: this 是全局對象 (嚴格模式下是 undefined)
// 3. 方法調用: this 是擁有該方法的對象
// 4. 構造函數: this 是新創建的實例對象
// 5. 箭頭函數: this 繼承自包含它的外層函數
// 6. 顯式設定: 使用 call, apply, bind 可以明確設置 this

// Python 開發者注意: JavaScript 的 this 是隱式決定的，取決於調用方式，
// 而 Python 的 self 是顯式傳遞的參數，有本質上的不同 