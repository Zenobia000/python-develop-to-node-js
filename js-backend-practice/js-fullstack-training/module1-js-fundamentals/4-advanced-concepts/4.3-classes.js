// ===== JavaScript 類別與繼承 =====

// ES6 引入了類語法，使物件導向編程更容易
// 然而，JS 的類仍然基於原型繼承，與 Python 的類概念有所不同
// Python 開發者需理解 JavaScript 類的本質是語法糖

// 1. 類的基本語法
// ----- 類聲明 -----
// Python:
// class Person:
//     def __init__(self, name, age):
//         self.name = name
//         self.age = age
//     def greet(self):
//         return f"Hi, I'm {self.name}"
class Person {
    // 建構方法
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // 實例方法
    greet() {
        return `Hi, I'm ${this.name}`;
    }
    
    // Python 的 __str__ 方法
    toString() {
        return `Person(name=${this.name}, age=${this.age})`;
    }
}

// 創建實例
const alice = new Person("Alice", 30);
console.log(alice.greet()); // "Hi, I'm Alice"
console.log(alice.toString()); // "Person(name=Alice, age=30)"
console.log(alice); // Person { name: "Alice", age: 30 }


// 2. 類字段/屬性
// ----- 實例字段 -----
// 在 ES2022+ 中可以直接在類中定義字段
class Product {
    // 實例字段 (無需在建構函數中定義)
    id = Math.random().toString(36).substr(2, 9);
    createdAt = new Date();
    
    // 可選字段需要初始化或在建構函數中賦值
    description;
    
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    
    getInfo() {
        return `${this.name}: $${this.price}, ID: ${this.id}`;
    }
}

const product = new Product("Phone", 999);
console.log(product.getInfo()); // "Phone: $999, ID: xyz123..."
console.log(product.createdAt); // 當前日期時間


// 3. 靜態方法與字段
// ----- 靜態方法 -----
// Python:
// @classmethod
// def create_anonymous(cls):
//     return cls("Anonymous", 0)
class User {
    static userCount = 0; // 靜態字段 (ES2022+)
    
    constructor(name, role = "user") {
        this.name = name;
        this.role = role;
        User.userCount++; // 訪問靜態字段
    }
    
    // 實例方法
    getPermissions() {
        return User.getDefaultPermissions(this.role);
    }
    
    // 靜態方法 (無需實例即可調用)
    static getDefaultPermissions(role) {
        const permissions = {
            user: ["read"],
            editor: ["read", "write"],
            admin: ["read", "write", "delete"]
        };
        return permissions[role] || [];
    }
    
    // 創建特殊用戶的工廠方法
    static createAdmin(name) {
        return new User(name, "admin");
    }
    
    static createGuest() {
        return new User("Guest", "user");
    }
}

// 調用靜態方法
console.log(User.getDefaultPermissions("editor")); // ["read", "write"]

// 使用工廠方法
const admin = User.createAdmin("Bob");
console.log(admin.getPermissions()); // ["read", "write", "delete"]

// 訪問靜態字段
console.log(`已創建 ${User.userCount} 個用戶`); // "已創建 2 個用戶"


// 4. getter 與 setter
// ----- 存取器屬性 -----
// Python: 使用 @property 和 @x.setter
class Circle {
    #radius = 0; // 私有字段 (ES2022+)
    
    constructor(radius) {
        this.radius = radius; // 會調用 setter
    }
    
    // Getter
    get radius() {
        return this.#radius;
    }
    
    // Setter
    set radius(value) {
        if (value <= 0) {
            throw new Error("Radius must be positive");
        }
        this.#radius = value;
    }
    
    // 計算屬性
    get area() {
        return Math.PI * this.#radius * this.#radius;
    }
    
    get circumference() {
        return 2 * Math.PI * this.#radius;
    }
}

const circle = new Circle(5);
console.log(circle.radius); // 5 (調用 getter)
console.log(circle.area.toFixed(2)); // "78.54" (調用 getter)

circle.radius = 10; // 調用 setter
console.log(circle.circumference.toFixed(2)); // "62.83"

// 錯誤示範
try {
    const badCircle = new Circle(-5); // 拋出錯誤
} catch (e) {
    console.log(e.message); // "Radius must be positive"
}


// 5. 類繼承
// ----- extends 關鍵字 -----
// Python: class Dog(Animal):
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a noise`;
    }
    
    eat() {
        return `${this.name} eats`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        // 調用父類建構方法
        // Python: super().__init__(name)
        super(name);
        this.breed = breed;
    }
    
    // 覆寫父類方法
    speak() {
        return `${this.name} barks`;
    }
    
    // 新增方法
    fetch() {
        return `${this.name} fetches the ball`;
    }
    
    // 調用父類方法並擴展
    eat() {
        return `${super.eat()} dog food`;
    }
}

const dog = new Dog("Rex", "German Shepherd");
console.log(dog.speak()); // "Rex barks" (覆寫方法)
console.log(dog.eat()); // "Rex eats dog food" (擴展方法)
console.log(dog.fetch()); // "Rex fetches the ball" (新方法)


// 6. 私有字段與方法
// ----- 私有字段 (ES2022+) -----
// Python: 使用 _name 約定或 __name 名稱修飾
class BankAccount {
    #balance = 0; // 私有字段 (使用 # 前綴)
    #transactions = []; // 私有字段
    
    constructor(owner, initialBalance = 0) {
        this.owner = owner; // 公共字段
        
        if (initialBalance > 0) {
            this.#deposit(initialBalance, "Initial deposit");
        }
    }
    
    // 私有方法 (ES2022+)
    #deposit(amount, description = "Deposit") {
        this.#balance += amount;
        this.#transactions.push({
            type: "deposit",
            amount,
            date: new Date(),
            description
        });
    }
    
    #withdraw(amount, description = "Withdrawal") {
        if (amount > this.#balance) {
            throw new Error("Insufficient funds");
        }
        
        this.#balance -= amount;
        this.#transactions.push({
            type: "withdrawal",
            amount,
            date: new Date(),
            description
        });
    }
    
    // 公共介面
    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this.#deposit(amount);
        return this.#balance;
    }
    
    withdraw(amount) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }
        this.#withdraw(amount);
        return this.#balance;
    }
    
    transfer(amount, targetAccount) {
        if (!(targetAccount instanceof BankAccount)) {
            throw new Error("Target must be a bank account");
        }
        
        this.#withdraw(amount, `Transfer to ${targetAccount.owner}`);
        targetAccount.#deposit(amount, `Transfer from ${this.owner}`);
    }
    
    getBalance() {
        return this.#balance;
    }
    
    getStatement() {
        return {
            owner: this.owner,
            balance: this.#balance,
            transactions: [...this.#transactions] // 返回副本以防修改
        };
    }
}

const account1 = new BankAccount("Alice", 1000);
const account2 = new BankAccount("Bob");

account1.deposit(500);
account1.withdraw(200);
account1.transfer(300, account2);

console.log(account1.getBalance()); // 1000
console.log(account2.getBalance()); // 300

// 無法直接訪問私有字段和方法
// console.log(account1.#balance); // 語法錯誤
// account1.#deposit(100); // 語法錯誤


// 7. 對象屬性與類的區別
// 類其實只是原型繼承的語法糖
// ----- ES5 中使用函數和原型實現類似功能 -----
function PersonES5(name, age) {
    this.name = name;
    this.age = age;
}

PersonES5.prototype.greet = function() {
    return `Hi, I'm ${this.name}`;
};

// 等效於前面的 Person 類
const bob = new PersonES5("Bob", 25);
console.log(bob.greet()); // "Hi, I'm Bob"

// ----- instanceof 運算符 -----
// 檢查實例是否屬於某個類
console.log(alice instanceof Person); // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog); // true


// 8. Mixin 模式
// JavaScript 不支持多重繼承，但可以通過 Mixin 模式實現類似功能
// ----- Mixin 函數 -----
// Python: 可使用多重繼承，JS 需自行實現

// Mixin 對象
const TimestampMixin = {
    getCreatedAt() {
        return this._createdAt;
    },
    
    setCreated() {
        this._createdAt = new Date();
    }
};

const LoggerMixin = {
    log(message) {
        console.log(`[${this.constructor.name}] ${message}`);
    },
    
    logError(error) {
        console.error(`[ERROR][${this.constructor.name}] ${error.message}`);
    }
};

// 將 Mixin 應用到類
function applyMixins(targetClass, ...mixins) {
    mixins.forEach(mixin => {
        Object.getOwnPropertyNames(mixin).forEach(name => {
            if (name !== 'constructor') {
                targetClass.prototype[name] = mixin[name];
            }
        });
    });
}

class Task {
    constructor(title) {
        this.title = title;
        this.completed = false;
        this.setCreated(); // 來自 TimestampMixin
    }
    
    complete() {
        this.completed = true;
        this.log(`Task '${this.title}' completed`); // 來自 LoggerMixin
    }
}

// 應用 Mixins
applyMixins(Task, TimestampMixin, LoggerMixin);

const task = new Task("Learn JavaScript");
task.complete(); // [Task] Task 'Learn JavaScript' completed
console.log(task.getCreatedAt()); // 當前日期時間 