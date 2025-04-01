/**
 * npm 生態系統 - 為 Python 開發者準備
 * 
 * 本文件介紹 Node.js 的套件管理系統 npm (Node Package Manager)，
 * 並與 Python 的 pip 套件管理系統進行比較。
 */

// ========================
// npm 簡介
// ========================

/*
什麼是 npm?
-----------
npm (Node Package Manager) 是 Node.js 的官方套件管理器，
用於安裝、共享和管理 JavaScript 套件。

npm 包含:
1. 命令行工具 (CLI)
2. 線上套件登錄庫 (registry)
3. package.json 設定檔系統

Python 對比:
- npm 相當於 Python 的 pip 套件管理器
- npm registry 相當於 PyPI (Python Package Index)
- package.json 相當於 Python 的 requirements.txt 或 setup.py
*/

// ========================
// package.json 介紹
// ========================

/*
package.json 是 Node.js 專案的核心設定檔，包含:

1. 專案元數據 (名稱、版本、描述等)
2. 依賴套件列表 (dependencies, devDependencies)
3. 腳本命令 (scripts)
4. 項目配置 (如私有、許可證等)

基本的 package.json 示例:

{
  "name": "my-app",                  // 套件名稱
  "version": "1.0.0",                // 版本 (遵循語意化版本)
  "description": "My Node.js app",   // 描述
  "main": "index.js",                // 入口點
  "scripts": {                       // 腳本命令
    "start": "node index.js",
    "test": "jest",
    "dev": "nodemon index.js"
  },
  "dependencies": {                  // 生產環境依賴
    "express": "^4.17.1",
    "mongoose": "~5.12.3"
  },
  "devDependencies": {               // 開發環境依賴
    "jest": "^27.0.0",
    "nodemon": "^2.0.7"
  },
  "engines": {                       // 指定 Node.js 版本限制
    "node": ">=14.0.0"
  },
  "license": "MIT"                   // 許可證
}

創建新的 package.json:
$ npm init            // 互動式創建
$ npm init -y         // 使用默認值快速創建

Python 對比:
# Poetry 的 pyproject.toml 是最類似的替代方案
# 範例 pyproject.toml
[tool.poetry]
name = "my-app"
version = "1.0.0"
description = "My Python app"
authors = ["Your Name <email@example.com>"]

[tool.poetry.dependencies]
python = "^3.8"
flask = "^2.0.1"

[tool.poetry.dev-dependencies]
pytest = "^6.2.5"
black = "^21.5b2"

# 而傳統的 setup.py:
from setuptools import setup

setup(
    name="my-app",
    version="1.0.0",
    description="My Python app",
    install_requires=["flask>=2.0.1"],
    extras_require={
        "dev": ["pytest>=6.2.5", "black>=21.5b2"]
    }
)
*/

// ========================
// npm 命令介紹
// ========================

/*
基本 npm 命令:

1. 安裝套件:
   $ npm install express       # 安裝 express 並添加到 dependencies
   $ npm install jest --save-dev  # 安裝 jest 並添加到 devDependencies
   $ npm install -g nodemon    # 全局安裝 nodemon

2. 使用縮寫:
   $ npm i express            # install 縮寫 i
   $ npm i jest -D            # --save-dev 縮寫 -D
   $ npm i -g nodemon         # global 縮寫 -g

3. 安裝特定版本:
   $ npm i express@4.17.1     # 安裝特定版本
   $ npm i express@latest     # 安裝最新版本

4. 從 package.json 安裝所有依賴:
   $ npm install              # 安裝所有依賴
   $ npm i --production       # 僅安裝生產環境依賴

5. 更新套件:
   $ npm update              # 更新所有套件
   $ npm update express      # 更新特定套件

6. 移除套件:
   $ npm uninstall express   # 移除套件

7. 運行腳本:
   $ npm run start           # 運行 package.json 中定義的 start 腳本
   $ npm start               # 特殊腳本可以省略 run (start, test, etc.)

8. 列出已安裝套件:
   $ npm list                # 列出本地安裝的套件
   $ npm list -g --depth=0   # 列出全局安裝的套件 (僅頂層)

Python 對比:
# pip 命令:
$ pip install flask          # 安裝 flask
$ pip install pytest --dev   # Python 沒有內建開發依賴概念
$ pip install -g flask       # Python 不鼓勵全局安裝 (通常會使用 venv)
$ pip install -r requirements.txt  # 從 requirements.txt 安裝依賴
$ pip uninstall flask        # 移除套件
$ pip list                   # 列出已安裝套件
*/

// ========================
// 語意化版本 (Semantic Versioning)
// ========================

/*
npm 使用語意化版本 (SemVer) 格式: 主版本.次版本.修補版本 (MAJOR.MINOR.PATCH)

- MAJOR: 不相容的 API 變更 (破壞性變更)
- MINOR: 向後相容的功能新增
- PATCH: 向後相容的問題修正

版本指定符號:
- ^1.2.3: 相容更新 (1.x.x, 但不包含 2.0.0+)
- ~1.2.3: 修補程式更新 (1.2.x, 但不包含 1.3.0+)
- 1.2.3: 精確版本
- >=1.2.3: 大於或等於指定版本
- *: 任何版本

範例:
"dependencies": {
  "express": "^4.17.1",   // 任何 4.x.x 版本，至少 4.17.1
  "mongoose": "~5.12.3",  // 任何 5.12.x 版本，至少 5.12.3
  "moment": "2.29.1",     // 精確使用 2.29.1 版本
  "lodash": ">=4.0.0",    // 任何至少 4.0.0 的版本
  "colors": "*"           // 任何版本
}

Python 對比:
# PEP 440 版本標准
Flask==2.0.1        # 精確版本
Flask>=2.0.1        # 大於或等於
Flask>=2.0.1,<3.0.0 # 範圍指定
Flask~=2.0.1        # 相容版本 (2.0.1 或更高，但低於 2.1.0)
*/

// ========================
// package-lock.json 與確定性安裝
// ========================

/*
package-lock.json:
- 自動生成的鎖定檔案，記錄確切的依賴樹
- 確保不同環境使用相同的依賴版本
- 包含每個套件的確切版本、完整依賴關係和完整性哈希

好處:
1. 確定性安裝 - 每次 npm install 都會得到完全相同的依賴樹
2. 加速安裝 - npm 可以跳過解析依賴，直接使用鎖定檔指定的版本
3. 安全性 - 包含套件完整性哈希，防止篡改

注意事項:
- package-lock.json 應該加入版本控制
- 不要手動編輯 package-lock.json

Python 對比:
# Pipenv 的 Pipfile.lock
# Poetry 的 poetry.lock
# pip-tools 的 requirements.txt + requirements.lock
# 虛擬環境的 pip freeze > requirements.txt
*/

// ========================
// npm scripts
// ========================

/*
npm scripts 是定義在 package.json 中的命令腳本，可用於自動化任務

範例:
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "test": "jest",
  "lint": "eslint .",
  "build": "webpack --mode production",
  "deploy": "npm run build && firebase deploy",
  "custom": "echo 'Custom script'"
}

運行腳本:
$ npm start          # 運行 start 腳本 (特殊腳本，不需要 run)
$ npm run dev        # 運行 dev 腳本
$ npm run deploy     # 運行多個腳本 (先 build，然後 firebase deploy)

腳本的好處:
1. 標准化項目命令
2. 腳本中可以訪問 node_modules/.bin/ 中的命令
3. 可以組合多個命令
4. 可以在腳本中使用 Node.js 環境變數

Python 對比:
# 類似於 Makefile 或使用工具如:
# tox, nox, invoke, fabric 等
# 或 Poetry 的腳本部分:

[tool.poetry.scripts]
start = "myapp:main"
test = "pytest:main"
*/

// ========================
// node_modules 與依賴管理
// ========================

/*
node_modules:
- 存放所有下載的依賴的目錄
- 通常很大，不應加入版本控制 (.gitignore)
- 採用扁平化結構 (npm v3+)，減少重複依賴

依賴類型:
1. dependencies: 生產環境需要的依賴
   $ npm install express --save
   
2. devDependencies: 只在開發時需要的依賴
   $ npm install jest --save-dev
   
3. peerDependencies: 宿主環境應提供的依賴
   (在 package.json 中手動定義)
   
4. optionalDependencies: 可選的依賴，安裝失敗不會導致 npm install 失敗
   $ npm install some-package --save-optional
   
5. bundledDependencies: 打包時一起發布的依賴
   (在 package.json 中手動定義)

Python 對比:
# pip 基本不區分依賴類型，但可以通過以下方式實現:

# 生產環境依賴 (requirements.txt)
flask==2.0.1
requests==2.26.0

# 開發依賴 (requirements-dev.txt)
-r requirements.txt
pytest==6.2.5
black==21.5b2

# 或使用 setup.py 的 extras_require
extras_require={
    'dev': ['pytest', 'black'],
    'test': ['pytest'],
}

# 或使用 Poetry 的區分
[tool.poetry.dependencies]
python = "^3.8"
flask = "^2.0.1"

[tool.poetry.dev-dependencies]
pytest = "^6.2.5"
*/

// ========================
// npx - npm 包執行器
// ========================

/*
npx 是 npm 5.2.0+ 附帶的工具，用於執行 npm 包

基本用法:
- 執行本地安裝的套件: $ npx jest
- 一次性執行未安裝的套件: $ npx create-react-app my-app
- 指定 Node.js 版本運行腳本: $ npx -p node@14 node -v

優點:
1. 避免全局安裝套件
2. 使用最新版本的套件，無需安裝
3. 解決命令衝突問題

Python 對比:
# pipx - 用於在隔離環境中安裝和運行 Python 應用
$ pipx install black
$ pipx run black my_file.py
$ pipx run --spec black==21.5b2 black my_file.py
*/

// ========================
// 其他包管理工具
// ========================

/*
Yarn:
- Facebook 開發的 npm 替代品
- 優點: 快速、可靠、安全
- 命令類似於 npm: yarn add, yarn remove 等
- 使用 yarn.lock 鎖定版本

$ yarn add express       # 安裝依賴
$ yarn add jest --dev    # 安裝開發依賴
$ yarn                   # 安裝所有依賴
$ yarn start             # 運行腳本

pnpm:
- 性能更好的 npm 替代品
- 優點: 節省磁盤空間，快速安裝
- 使用硬連結和符號連結共享依賴

$ pnpm install express   # 安裝依賴
$ pnpm add -D jest       # 安裝開發依賴
$ pnpm install           # 安裝所有依賴
$ pnpm start             # 運行腳本

Python 對比:
# pip 替代品:
# - Poetry (更現代的依賴管理)
# - Pipenv (結合 pip 和 virtualenv)
# - conda (科學計算領域)
*/

// ========================
// 常見 npm 套件介紹
// ========================

/*
Web 框架與服務:
- express: 快速、精簡的 Web 框架
- koa: 現代輕量級 Web 框架 (Express 創建者打造)
- fastify: 高效能 Web 框架
- nest.js: 完整企業級框架，類似 Angular 架構

工具庫:
- lodash/underscore: 實用函數庫
- moment/date-fns: 日期處理
- axios: HTTP 客戶端
- dotenv: 環境變數管理

前端框架/工具:
- react, vue, angular: 前端 UI 框架
- webpack, parcel: 打包工具
- babel: JavaScript 編譯器
- typescript: JavaScript 超集，添加靜態類型

開發與測試:
- jest, mocha: 測試框架
- eslint: 代碼檢查
- prettier: 代碼格式化
- nodemon: 開發時自動重啟服務

資料庫:
- mongoose: MongoDB ODM
- sequelize: SQL ORM
- knex: SQL 查詢構建器
- typeorm: TypeScript ORM

Python 對比:
# Web 框架: Flask, Django, FastAPI
# 工具庫: requests, pendulum, python-dotenv
# 前端: (Python 主要用於後端)
# 開發與測試: pytest, pylint, black, watchdog
# 資料庫: SQLAlchemy, Peewee, Django ORM, mongoengine
*/

// ========================
// npm 安全性與最佳實踐
// ========================

/*
安全性檢查:
$ npm audit              # 檢查漏洞
$ npm audit fix          # 自動修復漏洞
$ npm audit fix --force  # 強制修復，即使有破壞性變更

最佳實踐:
1. 鎖定版本: 使用 package-lock.json
2. 定期更新依賴: npm update
3. 使用私有 registry 保存企業套件
4. 避免不必要的依賴，謹慎選擇
5. 避免過度使用全局安裝
6. 注意許可證兼容性

Python 對比:
# 安全檢查:
$ pip-audit              # 使用 pip-audit 工具
# 或
$ safety check           # 使用 safety 工具
*/

/**
 * npm 生態系統總結:
 * 
 * 1. npm 是 Node.js 的官方套件管理器，類似 Python 的 pip
 * 2. package.json 是專案配置文件，定義依賴和腳本
 * 3. npm 使用語意化版本，精確控制依賴版本
 * 4. npm scripts 提供了標准化的項目命令定義
 * 5. node_modules 存放所有安裝的依賴
 * 6. 生態系統龐大，有許多常用套件和替代工具
 * 7. npm 提供安全審計和依賴維護工具
 * 
 * 與 Python 生態系統類似，npm 提供了一系列工具來管理項目依賴，
 * 但 npm 更集中、標准化，而 Python 的工具生態較為分散。
 */

// 示範如何編寫使用第三方套件的簡單代碼
// (在實際場景，先運行 npm install express)

/*
// 導入 express
const express = require('express');

// 創建應用
const app = express();
const port = 3000;

// 定義路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Python 對比 (使用 Flask):
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(port=3000)
*/ 