/**
 * Node.js 環境介紹 - 為 Python 開發者準備
 * 
 * 本文件介紹 Node.js 執行環境及其與瀏覽器 JavaScript 的差異，
 * 並與 Python 運行環境進行比較。
 */

// ========================
// Node.js 介紹
// ========================

/*
什麼是 Node.js?
--------------
Node.js 是基於 Chrome V8 引擎的 JavaScript 執行環境，
使開發者能夠使用 JavaScript 編寫伺服器端程式。

對 Python 開發者的比較：
- Node.js 相當於 Python 的解釋器環境，但專注於非同步 I/O
- Node.js 使用事件驅動模型，而不是 Python 的多線程模型或協程
- Node.js 單線程事件循環相當於 Python 的 asyncio，但設計思路不同
*/

// ========================
// 全域物件與環境變數
// ========================

// 全域物件
console.log("全域物件：");

// global 相當於瀏覽器中的 window
console.log("global 是 Node.js 的全域物件（相當於瀏覽器中的 window）");

// process 提供與當前 Node.js 進程互動的接口
console.log(`Node.js 版本: ${process.version}`);
console.log(`執行平台: ${process.platform}`);

// 訪問環境變數 (類似 Python 的 os.environ)
console.log("環境變數 NODE_ENV:", process.env.NODE_ENV || '未設定');

/*
Python 對比：
import sys
import os

print(f"Python 版本: {sys.version}")
print(f"執行平台: {sys.platform}")
print(f"環境變數 PYTHONPATH: {os.environ.get('PYTHONPATH', '未設定')}")
*/

// ========================
// REPL 環境
// ========================

/*
Node.js 具有交互式 REPL (Read-Eval-Print Loop)，類似 Python 的交互式解釋器：

在終端機輸入 `node` 啟動 REPL：
> const greeting = "Hello, Node.js!"
undefined
> console.log(greeting)
Hello, Node.js!
undefined
> .exit    // 退出 REPL

Python 對比：
$ python
>>> greeting = "Hello, Python!"
>>> print(greeting)
Hello, Python!
>>> exit()    # 退出 Python 解釋器
*/

// ========================
// 執行 Node.js 腳本
// ========================

/*
執行 Node.js 腳本：
$ node script.js

Python 對比：
$ python script.py

這兩者概念非常類似，都是調用解釋器並提供腳本路徑
*/

// ========================
// Node.js 特有特性
// ========================

// 1. 非阻塞 I/O 操作
const fs = require('fs');

// 非同步讀取檔案（不會阻塞執行）
fs.readFile(__filename, 'utf8', (err, data) => {
  if (err) {
    console.error('讀取檔案錯誤:', err);
    return;
  }
  console.log(`非同步讀取了 ${data.length} 個字符`);
});

console.log('這行先執行，因為檔案讀取是非同步的');

/*
Python 對比 (使用 asyncio):
import asyncio
import aiofiles

async def read_file():
    async with aiofiles.open(__file__, 'r') as file:
        data = await file.read()
        print(f"非同步讀取了 {len(data)} 個字符")

asyncio.run(read_file())
print('在 asyncio 中，這行也可能先執行')
*/

// 2. 事件循環

// 模擬事件循環的簡單示例
setTimeout(() => {
  console.log('1秒後執行');
}, 1000);

console.log('立即執行');

/*
Python 對比 (asyncio):
import asyncio

async def delayed_print():
    await asyncio.sleep(1)
    print('1秒後執行')

async def main():
    task = asyncio.create_task(delayed_print())
    print('立即執行')
    await task

asyncio.run(main())
*/

// 3. 模塊系統
// Node.js 使用 CommonJS 模塊系統，詳見 1.2-commonjs-modules.js

// ========================
// 重要差異
// ========================

console.log("\n重要差異 (Node.js vs Python):");

console.log("1. 執行模型:");
console.log("   - Node.js: 單線程事件循環，非阻塞 I/O");
console.log("   - Python: 默認多線程，但有 GIL 限制，asyncio 提供事件循環");

console.log("\n2. 套件管理:");
console.log("   - Node.js: npm/yarn 中央儲存庫，package.json 定義依賴");
console.log("   - Python: pip 套件管理，requirements.txt 或 Poetry/Pipenv");

console.log("\n3. 執行效能:");
console.log("   - Node.js: V8 引擎，JIT 編譯，非常適合 I/O 密集型應用");
console.log("   - Python: 解釋型語言，CPU 計算較慢，但支援 C 擴展");

console.log("\n4. 偵錯工具:");
console.log("   - Node.js: Chrome DevTools，VS Code 整合");
console.log("   - Python: pdb, ipdb, IDE 整合");

console.log("\n5. 部署方式:");
console.log("   - Node.js: 通常使用 PM2, Docker, Serverless");
console.log("   - Python: gunicorn/uwsgi, Docker, Serverless");

// ========================
// 實際演示:當前目錄檔案
// ========================

// 使用 Node.js 列出當前目錄檔案 (使用 Promise)
fs.promises.readdir('.')
  .then(files => {
    console.log('\n當前目錄檔案:');
    files.forEach(file => console.log(`- ${file}`));
  })
  .catch(err => console.error('讀取目錄錯誤:', err));

/*
Python 等效代碼:
import os

try:
    files = os.listdir('.')
    print('\n當前目錄檔案:')
    for file in files:
        print(f"- {file}")
except Exception as e:
    print(f"讀取目錄錯誤: {e}")
*/

/**
 * Node.js 環境總結:
 * 
 * 1. Node.js 是伺服器端 JavaScript 執行環境
 * 2. 事件驅動，非阻塞 I/O 特別適合網絡應用
 * 3. 單線程模型結合 libuv 實現高並發
 * 4. npm 生態系統提供豐富的庫與框架
 * 5. 適用於 API、微服務、實時應用等場景
 */

// 如果是從命令行直接運行
if (require.main === module) {
  console.log('這個文件被直接執行');
} else {
  console.log('這個文件被作為模組引入');
}

/*
Python 等效代碼:
if __name__ == '__main__':
    print('這個文件被直接執行')
else:
    print('這個文件被作為模組引入')
*/ 