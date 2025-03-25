// ===== JavaScript 模組系統 =====

// JavaScript 有多種模組系統，最常見的是 ES Modules 和 CommonJS
// Python 開發者熟悉的 import/from 語法在 ES Modules 中有類似形式

// 由於模組需要在多個文件中定義和使用，以下代碼為示例格式

// ====================================
// 示例 1: ES Modules (ESM) - 現代網頁與Node.js 14+ 常用
// ====================================

// ----- 檔案: math.js -----
// 導出函數
// Python: def add(a, b): return a + b
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

// 導出物件/變數
export const PI = 3.14159;

// 默認導出 (每個文件只能有一個)
// Python: 沒有直接對應概念
export default function multiply(a, b) {
    return a * b;
}

// ----- 檔案: app.js -----
// 導入具名導出
// Python: from math import add, PI
import { add, PI } from './math.js';

// 使用別名
// Python: from math import subtract as sub
import { subtract as sub } from './math.js';

// 導入默認導出
// Python: 沒有直接對應概念
import multiply from './math.js';

// 導入所有導出並指定命名空間
// Python: import math
import * as math from './math.js';

console.log(add(5, 3)); // 8
console.log(sub(5, 3)); // 2
console.log(multiply(5, 3)); // 15
console.log(PI); // 3.14159
console.log(math.add(2, 2)); // 4


// ====================================
// 示例 2: CommonJS - Node.js 傳統模塊系統
// ====================================

// ----- 檔案: utils.js -----
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 導出方式 1: module.exports 對象
module.exports = {
    formatDate,
    capitalize
};

// 或者單獨導出
// exports.formatDate = formatDate;
// exports.capitalize = capitalize;

// ----- 檔案: logger.js -----
// 單一功能模塊也可以直接賦值
module.exports = function logger(message) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
};

// ----- 檔案: app.js -----
// 導入整個模塊
// Python: import utils
const utils = require('./utils.js');

// 使用解構賦值導入特定功能
// Python: from utils import formatDate, capitalize
const { formatDate, capitalize } = require('./utils.js');

// 導入單一功能模塊
// Python: from logger import logger
const logger = require('./logger.js');

console.log(utils.formatDate(new Date())); // "2023-07-01"
console.log(formatDate(new Date())); // "2023-07-01"
console.log(capitalize('hello')); // "Hello"
logger('Application started'); // "[LOG] 2023-07-01T12:34:56.789Z: Application started"


// ====================================
// 示例 3: 動態導入 (ES Modules)
// ====================================

// 動態導入允許按需載入模塊
// Python: 類似於 importlib
async function loadModule() {
    try {
        // 動態導入返回 Promise
        const mathModule = await import('./math.js');
        console.log(mathModule.add(5, 5)); // 10
        console.log(mathModule.default(4, 4)); // 16 (默認導出)
    } catch (err) {
        console.error('模塊加載失敗:', err);
    }
}

// loadModule();
console.log("動態導入示例");


// ====================================
// 示例 4: 模塊使用示例 - 用戶管理系統
// ====================================

// ----- 檔案: models/user.js -----
// export class User {
//     constructor(id, username, email) {
//         this.id = id;
//         this.username = username;
//         this.email = email;
//         this.createdAt = new Date();
//     }
//     
//     getInfo() {
//         return {
//             id: this.id,
//             username: this.username,
//             email: this.email,
//             createdAt: this.createdAt
//         };
//     }
// }

// ----- 檔案: services/userService.js -----
// import { User } from '../models/user.js';

// let users = [];
// let nextId = 1;

// export function createUser(username, email) {
//     const user = new User(nextId++, username, email);
//     users.push(user);
//     return user;
// }

// export function findUserById(id) {
//     return users.find(user => user.id === id);
// }

// export function findUserByUsername(username) {
//     return users.find(user => user.username === username);
// }

// export function updateUser(id, updates) {
//     const user = findUserById(id);
//     if (!user) return null;
//     
//     Object.assign(user, updates);
//     return user;
// }

// export function deleteUser(id) {
//     const initialLength = users.length;
//     users = users.filter(user => user.id !== id);
//     return users.length !== initialLength;
// }

// export function getAllUsers() {
//     return [...users]; // 返回副本以防止外部修改
// }

// ----- 檔案: main.js -----
// import * as userService from './services/userService.js';

// // 創建用戶
// const alice = userService.createUser('alice', 'alice@example.com');
// const bob = userService.createUser('bob', 'bob@example.com');

// console.log(userService.getAllUsers());

// // 更新用戶
// userService.updateUser(1, { username: 'alice_updated' });

// // 查詢用戶
// const foundUser = userService.findUserById(1);
// console.log(foundUser.getInfo());


// ====================================
// 示例 5: 模塊設計模式
// ====================================

// ----- 模塊模式 (Module Pattern) -----
// 利用閉包創建私有作用域，僅暴露公共API
// 這在ES模塊出現前很常用

const calculator = (function() {
    // 私有變數和函數
    let result = 0;
    
    function validateNumber(num) {
        if (typeof num !== 'number') {
            throw new Error('Invalid number');
        }
    }
    
    // 公共API
    return {
        add(num) {
            validateNumber(num);
            result += num;
            return this;
        },
        subtract(num) {
            validateNumber(num);
            result -= num;
            return this;
        },
        getResult() {
            return result;
        },
        reset() {
            result = 0;
            return this;
        }
    };
})();

console.log(calculator.add(5).subtract(2).getResult()); // 3


// ====================================
// 模塊系統比較 (Python vs JavaScript)
// ====================================

// Python:
// 1. 導入整個模組:
//    import math
// 2. 從模組導入特定函數:
//    from math import sin, cos
// 3. 導入時使用別名:
//    import numpy as np
//    from math import sin as sine
// 4. 動態導入:
//    importlib.import_module("math")

// JavaScript ES Modules:
// 1. 導入整個模組:
//    import * as math from './math.js';
// 2. 從模組導入特定函數:
//    import { sin, cos } from './math.js';
// 3. 導入時使用別名:
//    import { sin as sine } from './math.js';
// 4. 動態導入:
//    import('./math.js').then(math => ...)

// JavaScript CommonJS:
// 1. 導入整個模組:
//    const math = require('./math');
// 2. 從模組導入特定函數:
//    const { sin, cos } = require('./math');
// 3. 導入時使用別名:
//    const { sin: sine } = require('./math');
// 4. 動態導入:
//    require('./math') // 但會同步阻塞 