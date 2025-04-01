/**
 * 原生 HTTP 伺服器 - 為 Python 開發者準備
 * 
 * 本文件介紹如何使用 Node.js 的內建 HTTP 模組建立一個基本的 Web 伺服器，
 * 並與 Python 的 HTTP 伺服器實現進行比較。
 */

// 導入 HTTP 模組
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// ========================
// 基本 HTTP 伺服器
// ========================

// 創建一個基本的 HTTP 伺服器
function createBasicServer() {
  // 創建伺服器實例
  const server = http.createServer((req, res) => {
    // 設置 HTTP 狀態碼和 Header
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    // 發送響應
    res.end('Hello, World! 這是一個基本的 Node.js HTTP 伺服器');
  });
  
  // 監聽特定端口
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}/`);
  });
  
  return server;
}

// 如果這個檔案是直接運行的，則啟動伺服器
if (require.main === module) {
  console.log('啟動基本 HTTP 伺服器...');
  createBasicServer();
}

/*
Python 對比 (使用內建 http.server):

import http.server
import socketserver

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"伺服器運行在 port {PORT}")
    httpd.serve_forever()
*/

// ========================
// 處理不同的 HTTP 方法
// ========================

// 創建處理不同 HTTP 方法的伺服器
function createMethodHandlingServer() {
  const server = http.createServer((req, res) => {
    // 獲取請求的方法和 URL
    const method = req.method;
    const reqUrl = req.url;
    
    console.log(`收到 ${method} 請求: ${reqUrl}`);
    
    // 根據 HTTP 方法處理請求
    switch (method) {
      case 'GET':
        handleGet(req, res);
        break;
      case 'POST':
        handlePost(req, res);
        break;
      case 'PUT':
        handlePut(req, res);
        break;
      case 'DELETE':
        handleDelete(req, res);
        break;
      default:
        // 處理不支援的方法
        res.statusCode = 405; // Method Not Allowed
        res.setHeader('Content-Type', 'text/plain');
        res.end('不支援的 HTTP 方法');
    }
  });
  
  // 監聽特定端口
  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`方法處理伺服器運行在 http://localhost:${PORT}/`);
    console.log('可以使用以下端點測試:');
    console.log('- GET    /api/items');
    console.log('- POST   /api/items');
    console.log('- PUT    /api/items/123');
    console.log('- DELETE /api/items/123');
  });
  
  return server;
}

// GET 方法處理器
function handleGet(req, res) {
  const parsedUrl = url.parse(req.url, true);
  
  // 根據路徑提供不同的響應
  if (parsedUrl.pathname === '/api/items') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      items: [
        { id: 1, name: '項目 1' },
        { id: 2, name: '項目 2' },
        { id: 3, name: '項目 3' }
      ]
    }));
  } else if (parsedUrl.pathname.startsWith('/api/items/')) {
    // 從 URL 獲取項目 ID
    const id = parsedUrl.pathname.split('/').pop();
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: parseInt(id), name: `項目 ${id}` }));
  } else {
    // 處理未找到的路徑
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('找不到資源');
  }
}

// POST 方法處理器
function handlePost(req, res) {
  let body = '';
  
  // 接收請求數據
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  // 處理完整請求
  req.on('end', () => {
    try {
      // 解析 JSON 數據
      const data = JSON.parse(body);
      
      res.statusCode = 201; // Created
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: '創建成功',
        item: { 
          id: Date.now(),  // 使用時間戳作為臨時 ID
          ...data 
        }
      }));
    } catch (error) {
      // 處理 JSON 解析錯誤
      res.statusCode = 400; // Bad Request
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: '無效的 JSON 數據' }));
    }
  });
}

// PUT 方法處理器
function handlePut(req, res) {
  const parsedUrl = url.parse(req.url);
  
  // 確認 URL 格式
  if (!parsedUrl.pathname.startsWith('/api/items/')) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('無效的 URL 格式，應為 /api/items/:id');
    return;
  }
  
  // 從 URL 獲取項目 ID
  const id = parsedUrl.pathname.split('/').pop();
  
  let body = '';
  
  // 接收請求數據
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  // 處理完整請求
  req.on('end', () => {
    try {
      // 解析 JSON 數據
      const data = JSON.parse(body);
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: '更新成功',
        item: { 
          id: parseInt(id),
          ...data 
        }
      }));
    } catch (error) {
      // 處理 JSON 解析錯誤
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: '無效的 JSON 數據' }));
    }
  });
}

// DELETE 方法處理器
function handleDelete(req, res) {
  const parsedUrl = url.parse(req.url);
  
  // 確認 URL 格式
  if (!parsedUrl.pathname.startsWith('/api/items/')) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('無效的 URL 格式，應為 /api/items/:id');
    return;
  }
  
  // 從 URL 獲取項目 ID
  const id = parsedUrl.pathname.split('/').pop();
  
  // 在實際應用中，這裡會刪除數據庫中的項目
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: '刪除成功',
    id: parseInt(id)
  }));
}

/*
Python 對比 (使用 Flask):

from flask import Flask, request, jsonify
app = Flask(__name__)

items = [
    {"id": 1, "name": "項目 1"},
    {"id": 2, "name": "項目 2"},
    {"id": 3, "name": "項目 3"}
]

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({"items": items})

@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    return jsonify({"id": item_id, "name": f"項目 {item_id}"})

@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()
    new_item = {"id": int(time.time()), **data}
    return jsonify({"message": "創建成功", "item": new_item}), 201

@app.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json()
    updated_item = {"id": item_id, **data}
    return jsonify({"message": "更新成功", "item": updated_item})

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    return jsonify({"message": "刪除成功", "id": item_id})

if __name__ == '__main__':
    app.run(port=3001, debug=True)
*/

// ========================
// 靜態檔案伺服器
// ========================

// 創建提供靜態檔案的伺服器
function createStaticFileServer() {
  const server = http.createServer((req, res) => {
    // 解析 URL 獲取路徑
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 將 / 轉為 /index.html (預設頁面)
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // 解析文件路徑
    const filePath = path.join(__dirname, 'public', pathname);
    
    // 獲取文件擴展名
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // 根據檔案擴展名設置適當的內容類型
    switch (extname) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpeg';
        break;
    }
    
    // 讀取檔案
    fs.readFile(filePath, (err, content) => {
      if (err) {
        // 檔案不存在
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('找不到檔案');
        } else {
          // 伺服器錯誤
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('伺服器錯誤: ' + err.code);
        }
      } else {
        // 成功讀取檔案
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
      }
    });
  });
  
  // 監聽特定端口
  const PORT = 3002;
  server.listen(PORT, () => {
    console.log(`靜態檔案伺服器運行在 http://localhost:${PORT}/`);
    console.log('請在此目錄中創建 public 資料夾以測試靜態檔案伺服器');
  });
  
  return server;
}

/*
Python 對比 (使用內建 http.server 作為靜態檔案伺服器):

# 最簡單的靜態檔案伺服器就是使用 SimpleHTTPRequestHandler
import http.server
import socketserver

PORT = 3002
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"靜態檔案伺服器運行在 port {PORT}")
    httpd.serve_forever()
*/

// ========================
// 路由管理
// ========================

// 創建帶有簡易路由管理的伺服器
function createRoutedServer() {
  // 定義路由處理函數
  const routes = {
    '/': (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>首頁</h1><p>歡迎使用 Node.js HTTP 伺服器</p>');
    },
    '/about': (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>關於我們</h1><p>這是一個示範 Node.js HTTP 模組的簡單伺服器</p>');
    },
    '/api/data': (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: '這是一些 API 數據',
        timestamp: Date.now()
      }));
    }
  };
  
  // 創建伺服器
  const server = http.createServer((req, res) => {
    // 解析 URL
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    
    // 檢查路由是否存在
    if (routes[pathname]) {
      // 調用對應的路由處理函數
      routes[pathname](req, res);
    } else {
      // 處理 404 Not Found
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>404 Not Found</h1><p>找不到請求的資源</p>');
    }
  });
  
  // 監聽特定端口
  const PORT = 3003;
  server.listen(PORT, () => {
    console.log(`路由伺服器運行在 http://localhost:${PORT}/`);
    console.log('可用路由:');
    console.log('- http://localhost:3003/');
    console.log('- http://localhost:3003/about');
    console.log('- http://localhost:3003/api/data');
  });
  
  return server;
}

/*
Python 對比 (自定義路由處理):

import http.server
import socketserver
import json
from urllib.parse import urlparse

class RouteHandler(http.server.BaseHTTPRequestHandler):
    # 定義路由
    routes = {
        '/': lambda self: self.serve_home(),
        '/about': lambda self: self.serve_about(),
        '/api/data': lambda self: self.serve_api_data()
    }
    
    def do_GET(self):
        url = urlparse(self.path)
        if url.path in self.routes:
            self.routes[url.path](self)
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>404 Not Found</h1><p>找不到請求的資源</p>')
    
    def serve_home(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>首頁</h1><p>歡迎使用 Python HTTP 伺服器</p>')
    
    def serve_about(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>關於我們</h1><p>這是一個示範 Python HTTP 伺服器的簡單實現</p>')
    
    def serve_api_data(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        data = json.dumps({
            'message': '這是一些 API 數據',
            'timestamp': int(time.time())
        }).encode('utf-8')
        self.wfile.write(data)

PORT = 3003
with socketserver.TCPServer(("", PORT), RouteHandler) as httpd:
    print(f"路由伺服器運行在 port {PORT}")
    httpd.serve_forever()
*/

// 提供伺服器創建函數以便外部調用
// 如果這個檔案是直接運行的，則啟動基本伺服器
if (require.main === module) {
  // 啟動其中一個伺服器實例
  // createBasicServer();
  // createMethodHandlingServer();
  // createStaticFileServer();
  // createRoutedServer();
  
  console.log('要啟動特定伺服器，請取消註釋對應的函數調用');
}

// 導出伺服器創建函數
module.exports = {
  createBasicServer,
  createMethodHandlingServer,
  createStaticFileServer,
  createRoutedServer
};

/**
 * Node.js HTTP 模組總結:
 * 
 * 1. http 模組提供了簡單但功能完整的 HTTP 服務器功能
 * 2. 使用 http.createServer() 創建伺服器，接受 request 處理函數
 * 3. 可以處理不同的 HTTP 方法 (GET, POST, PUT, DELETE)
 * 4. 結合 fs 模組可以創建靜態檔案伺服器
 * 5. 可以實現簡單的路由系統進行 URL 分發
 * 6. 適合簡單的 API 或小型應用，但大型應用通常使用框架
 * 
 * 在實際開發中，通常使用 Express 等框架簡化以上操作，
 * 但了解原生 HTTP 模組有助於理解 Node.js 的 Web 伺服器基礎。
 */ 