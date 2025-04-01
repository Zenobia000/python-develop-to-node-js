/**
 * CommonJS 模組系統 - 為 Python 開發者準備
 * 
 * 本文件介紹 Node.js 的 CommonJS 模組系統，
 * 並與 Python 的模組系統進行比較。
 */

// ========================
// 模組系統概述
// ========================

/*
Node.js 模組系統:
---------------
Node.js 使用 CommonJS 規範作為其模組系統。每個檔案都被視為獨立的模組，
並有自己的作用域，變數不會污染全域環境。

與 Python 對比:
- Node.js 的模組類似於 Python 的模組和包
- require() 函數類似於 Python 的 import 語句
- module.exports 類似於 Python 中將物件加入 __all__ 或直接定義變數
*/

// ========================
// 模組導入 (require)
// ========================

// 導入內置模組 (類似 Python 內置模組)
const path = require('path');
const fs = require('fs');

// 使用導入的模組
console.log(`当前文件: ${path.basename(__filename)}`);
console.log(`绝对路径: ${path.resolve(__filename)}`);

/*
Python 等效代碼:
import os.path
import os

print(f"当前文件: {os.path.basename(__file__)}")
print(f"绝对路径: {os.path.abspath(__file__)}")
*/

// 導入本地模組 (假設這些檔案存在)
// const myModule = require('./my-module');  // 從相同目錄導入
// const utils = require('../utils');        // 從上層目錄導入

// 導入 npm 安裝的套件 (類似 Python pip 安裝的套件)
// const express = require('express');
// const lodash = require('lodash');

// ========================
// 模組導出 (module.exports)
// ========================

// 方法 1: 使用 module.exports 導出單一物件
module.exports = {
  greet: function(name) {
    return `Hello, ${name}!`;
  },
  farewell: function(name) {
    return `Goodbye, ${name}!`;
  }
};

/*
Python 等效代碼:
def greet(name):
    return f"Hello, {name}!"
    
def farewell(name):
    return f"Goodbye, {name}!"
    
# 如果用 __all__ 明確導出
__all__ = ['greet', 'farewell']
*/

// 方法 2: 直接添加屬性到 exports (不太常用)
// exports.add = (a, b) => a + b;
// exports.subtract = (a, b) => a - b;

// 注意: 不能直接賦值給 exports
// exports = { add: (a, b) => a + b };  // 這樣不行!
// 必須使用 module.exports = { add: (a, b) => a + b };

// ========================
// 創建和使用多個模組
// ========================

// 創建模擬模組以作示範
const calculatorModule = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

// 有的人會將其放在單獨的文件，如 calculator.js，然後:
// module.exports = calculatorModule;

// 然後在另一個文件中引入:
// const calculator = require('./calculator');
// console.log(calculator.add(1, 2));

// 在此演示中，直接使用
console.log(`1 + 2 = ${calculatorModule.add(1, 2)}`);
console.log(`5 - 3 = ${calculatorModule.subtract(5, 3)}`);

/*
Python 等效代碼 (calculator.py):
def add(a, b):
    return a + b
    
def subtract(a, b):
    return a - b
    
def multiply(a, b):
    return a * b
    
def divide(a, b):
    return a / b

# 在另一個檔案中:
# from calculator import add, subtract
# print(f"1 + 2 = {add(1, 2)}")
*/

// ========================
// 實踐中的模組模式
// ========================

// 1. 暴露單一功能的模組
const singleFunctionModule = function(msg) {
  console.log(msg);
};
// module.exports = singleFunctionModule;

// 使用: const logger = require('./logger'); logger('Hello');

// 2. 工廠函數模式
function createAPI(config) {
  return {
    get: (id) => console.log(`GET ${id} with config ${config}`),
    post: (data) => console.log(`POST ${data} with config ${config}`)
  };
}
// module.exports = createAPI;

// 使用: const api = require('./api')('http://example.com');

// 3. 單例模式
const singleton = {
  data: [],
  add(item) {
    this.data.push(item);
  },
  getAll() {
    return this.data;
  }
};
// module.exports = singleton;

// ========================
// 模組解析策略
// ========================

console.log("\n模組解析策略:");

// 1. 核心/內置模組優先級最高
// require('http') 會載入 Node.js 核心模組

// 2. 檔案模組解析過程
// require('./module') 查找順序:
// - ./module.js
// - ./module.json
// - ./module.node
// - ./module/index.js (如果 ./module 是目錄)

// 3. 套件模組解析過程
// require('express') 查找順序:
// - 當前目錄 node_modules/express
// - 上層目錄 ../node_modules/express
// - 一直向上查找到系統根目錄

console.log("模組解析路徑:");
console.log(module.paths);  // 顯示 NODE_PATH 環境變數定義的目錄

/*
Python 模組解析 (對比):
import sys
print(sys.path)  # 顯示 Python 模組搜索路徑
*/

// ========================
// 模組快取
// ========================

// Node.js 會快取所有已載入的模組
console.log("\n已載入的模組:");
console.log(Object.keys(require.cache).slice(0, 3));  // 顯示前3個

// 清除模組快取 (極少使用)
// delete require.cache[require.resolve('./some-module')];

/*
Python 模組快取 (對比):
import sys
print(list(sys.modules.keys())[:3])  # 顯示前3個已載入模組

# 重新載入模組
import importlib
importlib.reload(some_module)
*/

// ========================
// ECMAScript 模組 (ESM)
// ========================

/*
Node.js 也支援 ECMAScript 模組 (import/export 語法):

// 命名導入/導出
import { something } from './module.mjs';
export const something = 'value';

// 默認導入/導出
import thing from './module.mjs';
export default function() { ... }

// 使用 .mjs 擴展名或在 package.json 中設置 "type": "module"

Python 對比:
from module import something  # 命名導入
from module import something as other_name  # 重命名導入
import module  # 導入整個模組
*/

// ========================
// 模組設計最佳實踐
// ========================

console.log("\n模組設計最佳實踐:");
console.log("1. 單一職責: 每個模組只應該有一個職責");
console.log("2. 暴露最小介面: 只導出必要的功能");
console.log("3. 避免副作用: 導入模組不應該執行副作用");
console.log("4. 依賴注入: 允許模組接收其依賴");
console.log("5. 配置: 允許使用者配置模組行為");

/**
 * CommonJS 模組系統總結:
 * 
 * 1. 使用 require() 函數導入模組
 * 2. 使用 module.exports 導出功能
 * 3. 每個檔案有獨立的變數作用域
 * 4. 模組第一次載入時執行併快取
 * 5. 模組系統是 Node.js 的核心特性之一
 */

// 示例: 如何在實際中使用模組
// 下面是導入之後使用的方式:

console.log("\n導入模組後的使用方式:");

// 如果有檔案 './greeting.js' 並導出如下:
// module.exports = { sayHello: name => `Hello, ${name}!` };

// 則可以這樣使用:
// const greeting = require('./greeting');
// console.log(greeting.sayHello('Node.js'));

// 模擬導入的模組
const greeting = { sayHello: name => `Hello, ${name}!` };
console.log(greeting.sayHello('Node.js'));

/*
Python 等效代碼:
# greeting.py
def say_hello(name):
    return f"Hello, {name}!"

# 使用
from greeting import say_hello
print(say_hello('Python'))
*/ 