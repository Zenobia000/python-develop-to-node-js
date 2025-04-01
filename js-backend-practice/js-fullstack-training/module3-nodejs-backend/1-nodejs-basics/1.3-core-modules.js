/**
 * Node.js 核心模組使用 - 為 Python 開發者準備
 * 
 * 本文件介紹 Node.js 的常用核心模組，
 * 並與 Python 標準庫的對應功能進行比較。
 */

// ========================
// 基本系統與檔案操作模組
// ========================

// 文件系統模組 (fs) - 類似 Python 的 os, io, pathlib
const fs = require('fs');
const fsPromises = fs.promises;  // fs 的 Promise 版本，Node.js 10+ 支援

// 路徑處理模組 (path) - 類似 Python 的 os.path, pathlib
const path = require('path');

// 作業系統信息 (os) - 類似 Python 的 os, platform
const os = require('os');

// 事件模組 (events) - 類似 Python 的 EventEmitter
const EventEmitter = require('events');

// ========================
// 路徑處理 (path)
// ========================

console.log("==== 路徑處理 (path) ====");

// 路徑操作
const filePath = '/home/user/docs/file.txt';
console.log(`路徑分析: ${filePath}`);
console.log(`目錄名: ${path.dirname(filePath)}`);    // 獲取目錄部分
console.log(`檔案名: ${path.basename(filePath)}`);   // 獲取檔案名
console.log(`擴展名: ${path.extname(filePath)}`);    // 獲取副檔名

// 路徑組合 (不同平台處理斜線)
const newPath = path.join('folder', 'subfolder', 'file.txt');
console.log(`組合路徑: ${newPath}`);

// 解析相對路徑為絕對路徑
console.log(`絕對路徑: ${path.resolve('logs', 'app.log')}`);

// 格式化路徑
console.log(`格式化路徑: ${path.format({
  dir: '/home/user',
  base: 'file.txt'
})}`);

/*
Python 對比:
import os.path

file_path = '/home/user/docs/file.txt'
print(f"目錄名: {os.path.dirname(file_path)}")
print(f"檔案名: {os.path.basename(file_path)}")
print(f"擴展名: {os.path.splitext(file_path)[1]}")

# 路徑組合
new_path = os.path.join('folder', 'subfolder', 'file.txt')
print(f"組合路徑: {new_path}")

# 絕對路徑
print(f"絕對路徑: {os.path.abspath(os.path.join('logs', 'app.log'))}")
*/

// ========================
// 檔案操作 (fs)
// ========================

console.log("\n==== 檔案操作 (fs) ====");

// 1. 同步檔案讀寫 (阻塞操作)
try {
  // 寫入檔案
  fs.writeFileSync('example.txt', 'Hello, Node.js!', 'utf8');
  console.log('檔案已同步寫入');
  
  // 讀取檔案
  const content = fs.readFileSync('example.txt', 'utf8');
  console.log(`同步讀取內容: ${content}`);
  
  // 檢查檔案
  const stats = fs.statSync('example.txt');
  console.log(`檔案大小: ${stats.size} 位元組`);
  
  // 刪除檔案
  fs.unlinkSync('example.txt');
  console.log('檔案已刪除');
} catch (err) {
  console.error('同步檔案操作錯誤:', err.message);
}

/*
Python 對比:
try:
    # 寫入檔案
    with open('example.txt', 'w', encoding='utf-8') as f:
        f.write('Hello, Python!')
    print('檔案已寫入')
    
    # 讀取檔案
    with open('example.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"讀取內容: {content}")
    
    # 檢查檔案
    import os
    stats = os.stat('example.txt')
    print(f"檔案大小: {stats.st_size} 位元組")
    
    # 刪除檔案
    os.unlink('example.txt')
    print('檔案已刪除')
except Exception as e:
    print(f"檔案操作錯誤: {e}")
*/

// 2. 非同步檔案操作 (Promise 版本)
async function asyncFileOperations() {
  try {
    // 寫入檔案
    await fsPromises.writeFile('async-example.txt', 'Hello, Async Node.js!', 'utf8');
    console.log('檔案已非同步寫入');
    
    // 讀取檔案
    const content = await fsPromises.readFile('async-example.txt', 'utf8');
    console.log(`非同步讀取內容: ${content}`);
    
    // 改名檔案
    await fsPromises.rename('async-example.txt', 'renamed-async.txt');
    console.log('檔案已改名');
    
    // 刪除檔案
    await fsPromises.unlink('renamed-async.txt');
    console.log('檔案已刪除');
  } catch (err) {
    console.error('非同步檔案操作錯誤:', err.message);
  }
}

// 調用非同步示例
asyncFileOperations();

/*
Python 對比 (使用 asyncio):
import asyncio
import aiofiles

async def async_file_operations():
    try:
        # 寫入檔案
        async with aiofiles.open('async-example.txt', 'w', encoding='utf-8') as f:
            await f.write('Hello, Async Python!')
        print('檔案已非同步寫入')
        
        # 讀取檔案
        async with aiofiles.open('async-example.txt', 'r', encoding='utf-8') as f:
            content = await f.read()
        print(f"非同步讀取內容: {content}")
        
        # 改名與刪除檔案
        import os
        os.rename('async-example.txt', 'renamed-async.txt')
        os.unlink('renamed-async.txt')
        print('檔案已刪除')
    except Exception as e:
        print(f"非同步檔案操作錯誤: {e}")

asyncio.run(async_file_operations())
*/

// ========================
// 檔案串流操作 (fs streams)
// ========================

console.log("\n==== 檔案串流操作 ====");

// 創建串流示例檔案
fs.writeFileSync('stream-example.txt', 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5', 'utf8');

// 使用串流讀取檔案
const readStream = fs.createReadStream('stream-example.txt', { encoding: 'utf8' });
console.log('開始讀取串流...');

// 處理串流事件
readStream.on('data', (chunk) => {
  console.log(`接收到資料塊: ${chunk.length} 個字符`);
});

readStream.on('end', () => {
  console.log('串流讀取完成');
  
  // 清理示例檔案
  fs.unlinkSync('stream-example.txt');
});

readStream.on('error', (err) => {
  console.error('串流讀取錯誤:', err.message);
});

/*
Python 對比:
# 基本串流讀取
with open('stream-example.txt', 'r', encoding='utf-8') as f:
    for line in f:  # Python 自動按行緩衝
        print(f"讀取行: {line.strip()}")
*/

// ========================
// 系統資訊 (os)
// ========================

console.log("\n==== 系統資訊 (os) ====");

// 系統相關信息
console.log(`CPU 架構: ${os.arch()}`);
console.log(`作業系統: ${os.platform()}`);
console.log(`主機名: ${os.hostname()}`);
console.log(`系統上線時間: ${Math.floor(os.uptime() / 60)} 分鐘`);
console.log(`使用者資訊: ${os.userInfo().username}`);

// 記憶體信息
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
console.log(`總記憶體: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`可用記憶體: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`記憶體使用率: ${(100 * (1 - freeMemory / totalMemory)).toFixed(2)}%`);

// CPU 信息
console.log(`CPU 核心數: ${os.cpus().length}`);

/*
Python 對比:
import platform
import psutil  # 需要安裝: pip install psutil

print(f"CPU 架構: {platform.machine()}")
print(f"作業系統: {platform.system()}")
print(f"主機名: {platform.node()}")
print(f"系統上線時間: {int(psutil.boot_time() / 60)} 分鐘")
print(f"使用者資訊: {psutil.users()[0].name}")

# 記憶體信息
memory = psutil.virtual_memory()
print(f"總記憶體: {memory.total / 1024 / 1024 / 1024:.2f} GB")
print(f"可用記憶體: {memory.available / 1024 / 1024 / 1024:.2f} GB")
print(f"記憶體使用率: {memory.percent:.2f}%")

# CPU 信息
print(f"CPU 核心數: {psutil.cpu_count()}")
*/

// ========================
// 事件處理 (events)
// ========================

console.log("\n==== 事件處理 (events) ====");

// 創建事件發射器
const myEmitter = new EventEmitter();

// 註冊事件處理器
myEmitter.on('event', (data) => {
  console.log('事件發生:', data);
});

// 發射事件
console.log('觸發自定義事件');
myEmitter.emit('event', { name: 'customEvent', time: new Date() });

// 一次性事件處理器
myEmitter.once('oneTimeEvent', (data) => {
  console.log('一次性事件:', data);
});

myEmitter.emit('oneTimeEvent', 'this happens once');
myEmitter.emit('oneTimeEvent', 'this will not be logged'); // 不會觸發

/*
Python 對比:
from events import Events  # 需要安裝: pip install events

# 創建事件對象
emitter = Events()

# 事件處理函數
def log_event(data):
    print('事件發生:', data)

# 監聽事件
emitter.on('event', log_event)

# 發送事件
print('觸發自定義事件')
emitter.emit('event', { 'name': 'customEvent', 'time': 'now' })

# Python 標準庫沒有直接對應，但可以使用 asyncio 或其他庫
*/

// ========================
// HTTP 網絡操作 (http/https)
// ========================

console.log("\n==== HTTP 網絡操作 ====");

// 導入 HTTP 模組
const http = require('http');

// 創建簡單的 HTTP 伺服器
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// HTTP 客戶端請求
function makeRequest() {
  console.log('發送 HTTP 請求...');
  
  // 選項對象
  const options = {
    hostname: 'example.com',
    port: 80,
    path: '/',
    method: 'GET'
  };
  
  // 創建請求
  const req = http.request(options, (res) => {
    console.log(`狀態碼: ${res.statusCode}`);
    console.log(`響應頭: ${JSON.stringify(res.headers)}`);
    
    // 獲取數據
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // 完成時顯示結果
    res.on('end', () => {
      console.log(`數據接收完成 (長度: ${data.length} 字符)`);
      // console.log(data);  // 完整 HTML 太長，這裡不顯示
    });
  });
  
  // 錯誤處理
  req.on('error', (e) => {
    console.error(`請求錯誤: ${e.message}`);
  });
  
  // 完成請求
  req.end();
}

// 嘗試發送請求 (但這裡禁用避免實際發送)
// makeRequest();

/*
Python 對比:
import http.server
import socketserver
import requests  # 需要安裝: pip install requests

# 伺服器
PORT = 8000
handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"伺服器運行在 port {PORT}")
    # httpd.serve_forever()  # 永久運行 (這裡禁用)

# 客戶端
def make_request():
    print('發送 HTTP 請求...')
    
    response = requests.get('https://example.com')
    print(f"狀態碼: {response.status_code}")
    print(f"響應頭: {response.headers}")
    print(f"數據接收完成 (長度: {len(response.text)} 字符)")
    # print(response.text)  # 完整 HTML 太長，這裡不顯示

# make_request()  # 禁用避免實際發送
*/

// ========================
// 網絡與 URL (url, querystring)
// ========================

console.log("\n==== URL 處理 ====");

// URL 解析 (舊 API)
const urlLib = require('url');
const querystring = require('querystring');

const sampleUrl = 'http://example.com:8080/path/to/page?query=value&foo=bar#section';

// 解析 URL
const parsedUrl = urlLib.parse(sampleUrl);
console.log('URL 解析:');
console.log(`- 協議: ${parsedUrl.protocol}`);
console.log(`- 主機名: ${parsedUrl.hostname}`);
console.log(`- 端口: ${parsedUrl.port}`);
console.log(`- 路徑名: ${parsedUrl.pathname}`);
console.log(`- 查詢字符串: ${parsedUrl.query}`);
console.log(`- 片段: ${parsedUrl.hash}`);

// 處理查詢參數
const params = querystring.parse(parsedUrl.query);
console.log('查詢參數:', params);

// 新的 URL API (類似瀏覽器 API)
const myURL = new URL(sampleUrl);
console.log('\n新 URL API:');
console.log(`- 源: ${myURL.origin}`);
console.log(`- 主機: ${myURL.host}`);
console.log(`- 路徑名: ${myURL.pathname}`);
console.log(`- 搜索參數: ${myURL.searchParams.get('query')}`);

// 修改 URL
myURL.searchParams.append('newParam', 'newValue');
console.log(`- 修改後的 URL: ${myURL.href}`);

/*
Python 對比:
from urllib.parse import urlparse, parse_qs

sample_url = 'http://example.com:8080/path/to/page?query=value&foo=bar#section'

# 解析 URL
parsed = urlparse(sample_url)
print('URL 解析:')
print(f"- 協議: {parsed.scheme}")
print(f"- 主機名: {parsed.netloc}")
print(f"- 路徑名: {parsed.path}")
print(f"- 查詢字符串: {parsed.query}")
print(f"- 片段: {parsed.fragment}")

# 處理查詢參數
params = parse_qs(parsed.query)
print(f"查詢參數: {params}")
*/

// ========================
// 加密與安全 (crypto)
// ========================

console.log("\n==== 加密與安全 (crypto) ====");

const crypto = require('crypto');

// 創建 hash 值
const hash = crypto.createHash('sha256');
hash.update('Hello, crypto!');
const hashDigest = hash.digest('hex');
console.log(`SHA-256 雜湊: ${hashDigest}`);

// 對稱加密 (AES)
function encryptAES(text, password) {
  // 從密碼生成 key 和 iv
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0); // 初始化向量
  
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

function decryptAES(encrypted, password) {
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

const plaintext = 'This is a secret message';
const password = 'secure-password';

// 加密與解密
const encrypted = encryptAES(plaintext, password);
console.log(`加密後: ${encrypted}`);

const decrypted = decryptAES(encrypted, password);
console.log(`解密後: ${decrypted}`);

/*
Python 對比:
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os

# 創建 hash 值
hash_obj = hashlib.sha256(b'Hello, crypto!')
print(f"SHA-256 雜湊: {hash_obj.hexdigest()}")

# 對稱加密 (AES)
def encrypt_aes(text, password):
    # 從密碼生成 key
    key = hashlib.sha256(password.encode()).digest()[:16]
    iv = os.urandom(16)  # 初始化向量
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    # 填充文本
    padded_text = text + (16 - len(text) % 16) * chr(16 - len(text) % 16)
    ct = encryptor.update(padded_text.encode()) + encryptor.finalize()
    
    return iv + ct  # 將 IV 與密文結合

def decrypt_aes(ct, password):
    key = hashlib.sha256(password.encode()).digest()[:16]
    iv = ct[:16]
    ct = ct[16:]
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    pt = decryptor.update(ct) + decryptor.finalize()
    
    # 移除填充
    return pt[:-pt[-1]].decode()

# 這裡簡化了 Python 的示例，實際使用會更複雜
*/

// ========================
// 子進程 (child_process)
// ========================

console.log("\n==== 子進程 (child_process) ====");

const { exec, execSync, spawn } = require('child_process');

// 同步執行外部命令
try {
  const output = execSync('echo "Hello from shell"', { encoding: 'utf8' });
  console.log(`同步執行結果: ${output.trim()}`);
} catch (err) {
  console.error('同步執行錯誤:', err.message);
}

// 非同步執行
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`非同步執行錯誤: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`標準錯誤: ${stderr}`);
  }
  console.log(`非同步執行成功，輸出長度: ${stdout.length} 字符`);
});

// 使用 spawn 執行長時間運行的進程
const child = spawn('node', ['-e', 'console.log("從子進程輸出");']);

child.stdout.on('data', (data) => {
  console.log(`子進程輸出: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`子進程錯誤: ${data}`);
});

child.on('close', (code) => {
  console.log(`子進程結束，退出碼: ${code}`);
});

/*
Python 對比:
import subprocess

# 同步執行
try:
    output = subprocess.check_output(['echo', 'Hello from shell'], universal_newlines=True)
    print(f"同步執行結果: {output.strip()}")
except subprocess.SubprocessError as e:
    print(f"同步執行錯誤: {e}")

# 非同步執行 (Python 3.5+)
import asyncio

async def run_command():
    proc = await asyncio.create_subprocess_shell(
        'ls -la',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    if stderr:
        print(f"標準錯誤: {stderr.decode()}")
    print(f"非同步執行成功，輸出長度: {len(stdout)} 字符")

# asyncio.run(run_command())  # 在 Python 3.7+ 使用
*/

// ========================
// 緩衝區 (Buffer)
// ========================

console.log("\n==== 緩衝區 (Buffer) ====");

// 創建緩衝區
const buf1 = Buffer.alloc(10);  // 創建長度為 10 的填充為 0 的緩衝區
console.log(`空緩衝區: ${buf1.toString('hex')}`);

// 使用數據創建緩衝區
const buf2 = Buffer.from('Hello, Buffer!', 'utf8');
console.log(`字符串緩衝區: ${buf2.toString('utf8')}`);
console.log(`十六進制: ${buf2.toString('hex')}`);
console.log(`Base64: ${buf2.toString('base64')}`);

// 操作緩衝區
buf1.write('Hi');
console.log(`寫入後的緩衝區: ${buf1.toString()}`);

// 陣列化
const array = Array.from(buf2);
console.log(`轉換為陣列 (前 5 個元素): [${array.slice(0, 5).join(', ')}]`);

/*
Python 對比:
# Python 使用 bytes 和 bytearray 處理二進制數據

# 創建緩衝區
buf1 = bytearray(10)  # 創建長度為 10 的填充為 0 的緩衝區
print(f"空緩衝區: {buf1.hex()}")

# 使用數據創建緩衝區
buf2 = bytes("Hello, Buffer!", "utf-8")
print(f"字符串緩衝區: {buf2.decode('utf-8')}")
print(f"十六進制: {buf2.hex()}")
import base64
print(f"Base64: {base64.b64encode(buf2).decode('ascii')}")

# 操作緩衝區
buf1[0:2] = b'Hi'
print(f"寫入後的緩衝區: {buf1.decode('utf-8', errors='ignore')}")

# 轉換為列表
array = list(buf2)
print(f"轉換為列表 (前 5 個元素): {array[:5]}")
*/

// ========================
// 壓縮 (zlib)
// ========================

console.log("\n==== 壓縮 (zlib) ====");

const zlib = require('zlib');
const input = 'This is a string that will be compressed and then decompressed';

// 壓縮
zlib.deflate(input, (err, compressed) => {
  if (err) {
    console.error('壓縮錯誤:', err);
    return;
  }
  
  console.log(`原始大小: ${input.length} 字節`);
  console.log(`壓縮後大小: ${compressed.length} 字節`);
  
  // 解壓縮
  zlib.inflate(compressed, (err, decompressed) => {
    if (err) {
      console.error('解壓縮錯誤:', err);
      return;
    }
    
    console.log(`解壓縮後: ${decompressed.toString()}`);
    console.log(`解壓縮後大小: ${decompressed.length} 字節`);
  });
});

/*
Python 對比:
import zlib

input_str = 'This is a string that will be compressed and then decompressed'
input_bytes = input_str.encode('utf-8')

# 壓縮
compressed = zlib.compress(input_bytes)
print(f"原始大小: {len(input_bytes)} 字節")
print(f"壓縮後大小: {len(compressed)} 字節")

# 解壓縮
decompressed = zlib.decompress(compressed)
print(f"解壓縮後: {decompressed.decode('utf-8')}")
print(f"解壓縮後大小: {len(decompressed)} 字節")
*/

// ========================
// 工具類模組 (util)
// ========================

console.log("\n==== 工具類模組 (util) ====");

const util = require('util');

// 格式化字符串
const formatted = util.format('Hello, %s! You have %d new messages.', 'User', 5);
console.log(`格式化: ${formatted}`);

// Promisify 回調函數
const readFilePromise = util.promisify(fs.readFile);

readFilePromise(__filename, 'utf8')
  .then(content => {
    console.log(`檔案大小: ${content.length} 字符`);
  })
  .catch(err => {
    console.error('讀取錯誤:', err);
  });

// 檢查類型
console.log(`是數組: ${util.isArray([1, 2, 3])}`);  // 已棄用，使用 Array.isArray()
console.log(`是日期: ${util.types.isDate(new Date())}`);

/*
Python 對比:
# 格式化字符串
formatted = "Hello, {}! You have {} new messages.".format('User', 5)
print(f"格式化: {formatted}")

# 類型檢查
import collections
import datetime
print(f"是列表: {isinstance([1, 2, 3], list)}")
print(f"是日期: {isinstance(datetime.datetime.now(), datetime.datetime)}")

# Python 的 util 功能分散在多個模組中
*/

/**
 * Node.js 核心模組總結:
 * 
 * 1. fs: 文件系統操作，包括同步/非同步文件讀寫
 * 2. path: 跨平台的文件路徑處理
 * 3. os: 作業系統相關信息和功能
 * 4. events: 事件處理，實現發布/訂閱模式
 * 5. http/https: HTTP 伺服器與客戶端功能
 * 6. url, querystring: URL 解析與處理
 * 7. crypto: 加密功能，包括雜湊、加密和解密
 * 8. child_process: 子進程管理
 * 9. buffer: 二進制數據處理
 * 10. zlib: 壓縮與解壓縮
 * 11. util: 常用工具函數
 * 
 * 除了核心模組，Node.js 還有豐富的第三方模組生態系統，
 * 可以透過 npm 進行安裝和管理。
 */ 