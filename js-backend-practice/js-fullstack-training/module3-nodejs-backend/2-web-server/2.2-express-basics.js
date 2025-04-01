/**
 * Express 基礎 - 為 Python 開發者準備
 * 
 * 本文件介紹 Express 框架的基本用法，包括路由、中間件和基本功能，
 * 並與 Python 的 Flask 框架進行比較。
 * 
 * 注意: 在實際使用中，需要先安裝 Express:
 * npm install express
 */

// ========================
// Express 簡介
// ========================

/*
Express 是 Node.js 最流行的 Web 應用框架，提供了一組強大的功能來構建 Web 應用和 API：

1. 路由系統 - 處理不同 HTTP 方法和 URL 路徑
2. 中間件系統 - 處理請求和響應的流程
3. 模板引擎集成 - 生成 HTML 頁面
4. 靜態檔案服務 - 提供靜態資源
5. 錯誤處理 - 集中處理應用錯誤
6. API 構建 - 方便構建 RESTful API

Python 對比:
Express 在 Node.js 生態系統中的地位類似於 Python 中的 Flask。
兩者都是輕量級、靈活、簡單但功能強大的 Web 框架。
*/

// 導入 Express 模組 (在實際應用中需要先安裝)
// const express = require('express');

// 為了演示目的，我們創建一個模擬的 Express 模組
const express = createMockExpress();

// ========================
// 基本 Express 應用
// ========================

// 創建基本的 Express 應用
function createBasicExpressApp() {
  // 創建 Express 應用實例
  const app = express();
  
  // 定義路由
  app.get('/', (req, res) => {
    res.send('Hello, Express! 這是一個基本的 Express 應用');
  });
  
  // 監聽端口
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Express 伺服器運行在 http://localhost:${PORT}/`);
  });
  
  return app;
}

/*
Python 對比 (使用 Flask):

from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask! 這是一個基本的 Flask 應用'

if __name__ == '__main__':
    app.run(port=3000)
*/

// ========================
// Express 路由
// ========================

// 創建展示路由功能的 Express 應用
function createRoutedExpressApp() {
  const app = express();
  
  // 1. 基本路由
  app.get('/', (req, res) => {
    res.send('<h1>首頁</h1><p>這是 Express 路由示例</p>');
  });
  
  // 2. 路徑參數
  app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`<h1>用戶資料</h1><p>您正在查看用戶 ${userId} 的資料</p>`);
  });
  
  // 3. 查詢字符串
  app.get('/search', (req, res) => {
    const query = req.query.q || '無關鍵字';
    const page = req.query.page || 1;
    res.send(`<h1>搜尋結果</h1><p>關鍵字: ${query}, 頁碼: ${page}</p>`);
  });
  
  // 4. 不同 HTTP 方法
  app.post('/api/users', (req, res) => {
    res.json({ message: '已創建用戶', method: 'POST' });
  });
  
  app.put('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json({ message: `已更新用戶 ${userId}`, method: 'PUT' });
  });
  
  app.delete('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json({ message: `已刪除用戶 ${userId}`, method: 'DELETE' });
  });
  
  // 5. 路由鏈式調用
  app.route('/api/products')
    .get((req, res) => {
      res.json({ message: '取得所有產品', method: 'GET' });
    })
    .post((req, res) => {
      res.json({ message: '新增產品', method: 'POST' });
    });
  
  app.route('/api/products/:productId')
    .get((req, res) => {
      const productId = req.params.productId;
      res.json({ message: `取得產品 ${productId}`, method: 'GET' });
    })
    .put((req, res) => {
      const productId = req.params.productId;
      res.json({ message: `更新產品 ${productId}`, method: 'PUT' });
    })
    .delete((req, res) => {
      const productId = req.params.productId;
      res.json({ message: `刪除產品 ${productId}`, method: 'DELETE' });
    });
  
  // 6. 404 處理 (放在所有路由之後)
  app.use((req, res) => {
    res.status(404).send('<h1>404 - 找不到頁面</h1>');
  });
  
  // 監聽端口
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Express 路由示例運行在 http://localhost:${PORT}/`);
    console.log('可以測試的路由:');
    console.log('- http://localhost:3001/');
    console.log('- http://localhost:3001/users/123');
    console.log('- http://localhost:3001/search?q=express&page=2');
    console.log('- 使用 POST 方法訪問 /api/users');
    console.log('- 使用 PUT 方法訪問 /api/users/123');
    console.log('- 使用 DELETE 方法訪問 /api/users/123');
  });
  
  return app;
}

/*
Python 對比 (使用 Flask):

from flask import Flask, request, jsonify

app = Flask(__name__)

# 1. 基本路由
@app.route('/')
def home():
    return '<h1>首頁</h1><p>這是 Flask 路由示例</p>'

# 2. 路徑參數
@app.route('/users/<user_id>')
def user_profile(user_id):
    return f'<h1>用戶資料</h1><p>您正在查看用戶 {user_id} 的資料</p>'

# 3. 查詢字符串
@app.route('/search')
def search():
    query = request.args.get('q', '無關鍵字')
    page = request.args.get('page', 1)
    return f'<h1>搜尋結果</h1><p>關鍵字: {query}, 頁碼: {page}</p>'

# 4. 不同 HTTP 方法
@app.route('/api/users', methods=['POST'])
def create_user():
    return jsonify({'message': '已創建用戶', 'method': 'POST'})

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    return jsonify({'message': f'已更新用戶 {user_id}', 'method': 'PUT'})

@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    return jsonify({'message': f'已刪除用戶 {user_id}', 'method': 'DELETE'})

# 5. 多方法路由
@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        return jsonify({'message': '取得所有產品', 'method': 'GET'})
    elif request.method == 'POST':
        return jsonify({'message': '新增產品', 'method': 'POST'})

@app.route('/api/products/<product_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_product(product_id):
    if request.method == 'GET':
        return jsonify({'message': f'取得產品 {product_id}', 'method': 'GET'})
    elif request.method == 'PUT':
        return jsonify({'message': f'更新產品 {product_id}', 'method': 'PUT'})
    elif request.method == 'DELETE':
        return jsonify({'message': f'刪除產品 {product_id}', 'method': 'DELETE'})

# 6. 404 處理
@app.errorhandler(404)
def page_not_found(e):
    return '<h1>404 - 找不到頁面</h1>', 404

if __name__ == '__main__':
    app.run(port=3001)
*/

// ========================
// Express 中間件
// ========================

// 創建展示中間件功能的 Express 應用
function createMiddlewareExpressApp() {
  const app = express();
  
  // 1. 內置中間件 - 解析請求體
  // app.use(express.json());  // 解析 JSON 請求體
  // app.use(express.urlencoded({ extended: true }));  // 解析 URL 編碼數據
  
  // 模擬上述功能
  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
          next();
        } catch (e) {
          res.status(400).json({ error: '無效的 JSON' });
        }
      });
    } else {
      next();
    }
  });
  
  // 2. 自定義中間件 - 記錄請求
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();  // 調用下一個中間件或路由處理器
  });
  
  // 3. 路由特定中間件
  const authenticateUser = (req, res, next) => {
    // 在實際應用中，這裡會檢查用戶令牌或會話
    const isAuthenticated = req.headers.authorization === 'Bearer secret-token';
    
    if (isAuthenticated) {
      req.user = { id: 123, name: 'Test User' };  // 添加用戶數據到請求對象
      next();  // 繼續處理請求
    } else {
      res.status(401).json({ error: '未授權' });  // 拒絕訪問
    }
  };
  
  // 4. 錯誤處理中間件
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: '伺服器內部錯誤',
      message: err.message
    });
  };
  
  // 5. 第三方中間件示例 (在實際應用中通常從包導入)
  const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  };
  
  // 使用前面定義的中間件
  app.use(corsMiddleware);  // 應用 CORS 中間件到所有路由
  
  // 公開路由 - 不需要授權
  app.get('/api/public', (req, res) => {
    res.json({ message: '這是公共 API' });
  });
  
  // 受保護路由 - 需要授權
  app.get('/api/private', authenticateUser, (req, res) => {
    res.json({ 
      message: '這是私有 API', 
      user: req.user  // 使用中間件添加的用戶數據
    });
  });
  
  // 產生錯誤的路由 - 測試錯誤處理中間件
  app.get('/api/error', (req, res, next) => {
    try {
      // 故意拋出錯誤
      throw new Error('模擬的錯誤情況');
    } catch (err) {
      next(err);  // 傳遞錯誤到錯誤處理中間件
    }
  });
  
  // 最後應用錯誤處理中間件 (必須是最後一個中間件)
  app.use(errorHandler);
  
  // 監聽端口
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Express 中間件示例運行在 http://localhost:${PORT}/`);
    console.log('可以測試的路由:');
    console.log('- http://localhost:3002/api/public');
    console.log('- http://localhost:3002/api/private (需要授權頭: Authorization: Bearer secret-token)');
    console.log('- http://localhost:3002/api/error (將觸發錯誤處理中間件)');
  });
  
  return app;
}

/*
Python 對比 (使用 Flask):

from flask import Flask, request, jsonify, make_response, g
from functools import wraps
import datetime

app = Flask(__name__)

# 1. 使用 Flask 擴展實現請求體解析
# Flask 默認支持 JSON 和 Form 數據

# 2. 自定義中間件 - 請求記錄器 (在 Flask 中稱為裝飾器或攔截器)
@app.before_request
def log_request():
    print(f"{datetime.datetime.now().isoformat()} - {request.method} {request.path}")

# 3. 路由特定中間件 (使用裝飾器實現)
def authenticate_user(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header == 'Bearer secret-token':
            # 將用戶數據添加到全局 flask.g 對象
            # (Flask 中沒有直接修改請求對象的慣例)
            g.user = {'id': 123, 'name': 'Test User'}
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "未授權"}), 401
    return decorated

# 4. 錯誤處理
@app.errorhandler(500)
def handle_error(error):
    return jsonify({
        "error": "伺服器內部錯誤",
        "message": str(error)
    }), 500

# 5. CORS 中間件
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

@app.route('/api/options', methods=['OPTIONS'])
def options():
    return make_response('', 200)

# 公開路由
@app.route('/api/public')
def public_api():
    return jsonify({"message": "這是公共 API"})

# 受保護路由
@app.route('/api/private')
@authenticate_user
def private_api():
    return jsonify({
        "message": "這是私有 API",
        "user": g.user
    })

# 錯誤路由
@app.route('/api/error')
def error_api():
    raise Exception("模擬的錯誤情況")

if __name__ == '__main__':
    app.run(port=3002)
*/

// ========================
// 靜態檔案與模板引擎
// ========================

// 創建使用靜態檔案和模板引擎的 Express 應用
function createTemplateExpressApp() {
  const app = express();
  
  // 1. 提供靜態檔案
  // 在實際應用中，使用：
  // app.use(express.static('public'));
  // 這會將 'public' 目錄中的檔案作為靜態資源提供
  
  // 2. 設置模板引擎 (在實際應用中)
  /*
  app.set('view engine', 'ejs');  // 設置 EJS 模板引擎
  app.set('views', './views');    // 設置視圖目錄
  */
  
  // 3. 使用模板 (在實際應用中)
  app.get('/template-example', (req, res) => {
    // 實際使用模板引擎時：
    // res.render('index', { title: 'Express 模板', message: '這是一個動態數據' });
    
    // 為演示目的，直接返回 HTML
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Express 模板示例</title>
        </head>
        <body>
          <h1>Express 模板示例</h1>
          <p>這是模擬的模板渲染結果，實際中會使用模板引擎如 EJS, Pug, Handlebars 等</p>
          <p>動態數據: 這是一個模擬的動態數據</p>
        </body>
      </html>
    `);
  });
  
  // 4. 處理表單提交
  app.post('/form-submit', (req, res) => {
    // 在實際應用中，使用 req.body 訪問表單數據
    // 需要首先配置 body-parser 中間件
    
    // 為演示，模擬表單處理
    res.send(`
      <h1>表單已提交</h1>
      <p>在實際應用中，此處會處理表單數據並可能重定向到其他頁面</p>
      <a href="/template-example">返回</a>
    `);
  });
  
  // 監聽端口
  const PORT = 3003;
  app.listen(PORT, () => {
    console.log(`Express 模板示例運行在 http://localhost:${PORT}/`);
    console.log('可以訪問 http://localhost:3003/template-example 查看模板示例');
  });
  
  return app;
}

/*
Python 對比 (使用 Flask 和 Jinja2 模板):

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# 1. 靜態檔案 - Flask 自動從 'static' 目錄提供靜態檔案
# 在 HTML 中使用: <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">

# 2. 模板使用
@app.route('/template-example')
def template_example():
    # Flask 使用 Jinja2 模板引擎 (類似於 EJS)
    return render_template('index.html', title='Flask 模板', message='這是一個動態數據')

# 3. 處理表單提交
@app.route('/form-submit', methods=['POST'])
def form_submit():
    # 使用 request.form 訪問表單數據
    # 或者 request.json 訪問 JSON 數據
    return render_template('submit.html', message='表單已提交')

if __name__ == '__main__':
    app.run(port=3003)

# 模板文件: ./templates/index.html
"""
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <form action="/form-submit" method="post">
      <input type="text" name="name" placeholder="Your name">
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
"""
*/

// ========================
// 模擬 Express 框架實現
// ========================

// 為了演示目的，創建一個非常簡化的 Express 模擬
function createMockExpress() {
  // 返回一個函數，調用後創建一個模擬的 Express 應用
  return function() {
    // 模擬路由存儲
    const routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {}
    };
    
    // 模擬中間件陣列
    const middlewares = [];
    
    // 模擬應用物件
    const app = {
      // 方法處理器
      get: (path, handler) => addRoute('GET', path, handler),
      post: (path, handler) => addRoute('POST', path, handler),
      put: (path, handler) => addRoute('PUT', path, handler),
      delete: (path, handler) => addRoute('DELETE', path, handler),
      
      // 中間件處理
      use: (handler) => {
        middlewares.push(handler);
        return app;
      },
      
      // 路由方法鏈
      route: (path) => {
        const router = {};
        
        router.get = (handler) => {
          addRoute('GET', path, handler);
          return router;
        };
        
        router.post = (handler) => {
          addRoute('POST', path, handler);
          return router;
        };
        
        router.put = (handler) => {
          addRoute('PUT', path, handler);
          return router;
        };
        
        router.delete = (handler) => {
          addRoute('DELETE', path, handler);
          return router;
        };
        
        return router;
      },
      
      // 啟動伺服器
      listen: (port, callback) => {
        if (callback) callback();
        return { close: () => console.log('伺服器已關閉') };
      },
      
      // 設置
      set: () => app
    };
    
    // 添加路由到路由存儲
    function addRoute(method, path, handler) {
      routes[method][path] = handler;
      return app;
    }
    
    return app;
  };
}

// ========================
// 執行示例
// ========================

// 如果這個檔案被直接運行，則不執行任何示例
// 在實際環境中，需要先安裝 Express
if (require.main === module) {
  console.log('這是一個 Express 示例文件，在實際使用前需要安裝 Express:');
  console.log('npm install express');
  console.log('\n要執行不同示例，請取消註釋以下對應的函數調用:');
  console.log('// createBasicExpressApp();');
  console.log('// createRoutedExpressApp();');
  console.log('// createMiddlewareExpressApp();');
  console.log('// createTemplateExpressApp();');
}

// 導出函數
module.exports = {
  createBasicExpressApp,
  createRoutedExpressApp,
  createMiddlewareExpressApp,
  createTemplateExpressApp
};

/**
 * Express 框架總結:
 * 
 * 1. Express 是 Node.js 最流行的 Web 框架，輕量且靈活
 * 2. 它提供了強大的路由系統，支持參數、查詢字符串和不同的 HTTP 方法
 * 3. 中間件系統是 Express 的核心，用於處理請求流程
 * 4. 可以集成多種模板引擎來渲染動態 HTML 頁面
 * 5. 自帶靜態檔案服務，方便提供 CSS、JavaScript 等資源
 * 6. 適合構建 RESTful API、傳統 Web 應用或混合應用
 * 7. 生態系統龐大，有眾多擴展和中間件可用
 * 
 * 與 Python Flask 框架比較:
 * - Express 與 Flask 都是輕量級、靈活的框架
 * - Express 使用中間件鏈，Flask 使用裝飾器
 * - Express 默認不包含許多功能，需要中間件，Flask 整合性更高
 * - Express 更適合 API 開發，Flask 更全能
 * - Express 使用回調或 Promise，Flask 支持同步風格
 */ 