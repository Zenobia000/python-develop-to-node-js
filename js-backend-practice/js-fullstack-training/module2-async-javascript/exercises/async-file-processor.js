/**
 * 非同步檔案處理 - 為 Python 開發者準備
 * 
 * 這個練習展示如何使用 Node.js 的非同步檔案 API 來讀取、處理和寫入檔案。
 * 類似於 Python 中使用 aiofiles 或其他非同步檔案處理庫。
 * 
 * 注意：這個檔案需要在 Node.js 環境中執行，而非瀏覽器環境。
 */

// 導入 Node.js 檔案系統模組
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { createReadStream, createWriteStream } = require('fs');

// ========================
// 基本檔案操作
// ========================

// 讀取檔案內容
async function readFile(filePath) {
  console.log(`讀取檔案: ${filePath}`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`讀取檔案 ${filePath} 時發生錯誤:`, error.message);
    throw error;
  }
}

// 寫入檔案內容
async function writeFile(filePath, content) {
  console.log(`寫入檔案: ${filePath}`);
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`檔案 ${filePath} 寫入成功`);
  } catch (error) {
    console.error(`寫入檔案 ${filePath} 時發生錯誤:`, error.message);
    throw error;
  }
}

// 附加內容到檔案
async function appendToFile(filePath, content) {
  console.log(`附加內容到檔案: ${filePath}`);
  try {
    await fs.appendFile(filePath, content, 'utf-8');
    console.log(`內容成功附加到檔案 ${filePath}`);
  } catch (error) {
    console.error(`附加內容到檔案 ${filePath} 時發生錯誤:`, error.message);
    throw error;
  }
}

// 檢查檔案是否存在
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ========================
// 串流處理大檔案
// ========================

// 使用讀取串流處理大檔案
function processLargeFile(inputPath, outputPath, transformFn) {
  return new Promise((resolve, reject) => {
    console.log(`使用串流處理大檔案: ${inputPath}`);
    
    const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
    const writeStream = createWriteStream(outputPath);
    
    // 設置錯誤處理
    readStream.on('error', (error) => {
      console.error(`讀取 ${inputPath} 時發生錯誤:`, error.message);
      reject(error);
    });
    
    writeStream.on('error', (error) => {
      console.error(`寫入 ${outputPath} 時發生錯誤:`, error.message);
      reject(error);
    });
    
    // 創建介面來讀取串流中的每一行
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });
    
    // 處理每一行
    rl.on('line', (line) => {
      try {
        // 使用指定的轉換函數處理每一行
        const transformedLine = transformFn(line);
        writeStream.write(transformedLine + '\n');
      } catch (error) {
        console.error('處理行時發生錯誤:', error.message);
        reject(error);
      }
    });
    
    // 處理完成
    rl.on('close', () => {
      writeStream.end();
      console.log(`檔案 ${inputPath} 處理完成，輸出到 ${outputPath}`);
      resolve();
    });
  });
}

// ========================
// 多檔案處理
// ========================

// 並行處理目錄中的多個檔案
async function processFilesInDirectory(directoryPath, processFileFn) {
  console.log(`處理目錄: ${directoryPath}`);
  
  try {
    // 讀取目錄內容
    const files = await fs.readdir(directoryPath);
    console.log(`找到 ${files.length} 個檔案`);
    
    // 創建處理每個檔案的 Promise 陣列
    const processingPromises = files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      
      // 獲取檔案資訊
      const stats = await fs.stat(filePath);
      
      // 只處理檔案，不處理目錄
      if (stats.isFile()) {
        return processFileFn(filePath);
      }
    });
    
    // 並行執行所有處理
    const results = await Promise.all(processingPromises);
    console.log(`已處理 ${results.filter(Boolean).length} 個檔案`);
    return results.filter(Boolean);
  } catch (error) {
    console.error(`處理目錄 ${directoryPath} 時發生錯誤:`, error.message);
    throw error;
  }
}

// 按批次處理檔案 (避免同時處理太多檔案)
async function processFilesBatched(files, processFileFn, batchSize = 3) {
  console.log(`按批次處理 ${files.length} 個檔案，每批 ${batchSize} 個`);
  
  const results = [];
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`處理批次 ${Math.floor(i / batchSize) + 1}，共 ${batch.length} 個檔案`);
    
    // 處理當前批次的檔案
    const batchPromises = batch.map(file => processFileFn(file));
    const batchResults = await Promise.all(batchPromises);
    
    results.push(...batchResults);
  }
  
  return results;
}

// ========================
// 錯誤處理與重試機制
// ========================

// 帶有重試機制的檔案操作
async function fileOperationWithRetry(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`操作失敗 (嘗試 ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`等待 ${delay}ms 後重試...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // 指數退避 (exponential backoff)
        delay *= 2;
      }
    }
  }
  
  throw lastError;
}

// ========================
// 檔案轉換工具
// ========================

// CSV 解析器
function parseCSV(content, delimiter = ',') {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(delimiter);
  
  return lines.slice(1).map(line => {
    const values = line.split(delimiter);
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
}

// JSON 轉 CSV
function jsonToCSV(jsonArray, delimiter = ',') {
  if (!jsonArray || jsonArray.length === 0) return '';
  
  const headers = Object.keys(jsonArray[0]);
  const headerRow = headers.join(delimiter);
  
  const rows = jsonArray.map(item => {
    return headers.map(header => {
      const value = item[header];
      // 處理包含分隔符或引號的值
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(delimiter);
  });
  
  return [headerRow, ...rows].join('\n');
}

// ========================
// 檔案監控
// ========================

// 模擬檔案監控功能 (實際應用中可使用 fs.watch 或第三方庫)
function simulateFileWatch(filePath, callback, interval = 5000) {
  console.log(`開始監控檔案: ${filePath}`);
  
  let lastModified = null;
  
  // 定期檢查檔案是否變更
  const checkInterval = setInterval(async () => {
    try {
      const stats = await fs.stat(filePath);
      const currentModified = stats.mtime.getTime();
      
      if (lastModified !== null && currentModified !== lastModified) {
        console.log(`檔案 ${filePath} 已變更`);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          callback(content);
        } catch (error) {
          console.error(`讀取變更後的檔案時發生錯誤:`, error.message);
        }
      }
      
      lastModified = currentModified;
    } catch (error) {
      console.error(`監控檔案時發生錯誤:`, error.message);
    }
  }, interval);
  
  // 返回一個函數用於停止監控
  return () => {
    console.log(`停止監控檔案: ${filePath}`);
    clearInterval(checkInterval);
  };
}

// ========================
// 實用示例
// ========================

// 模擬檔案資料處理進度通知
function simulateProgressNotification(total, onProgress) {
  let processed = 0;
  
  return {
    // 更新進度
    update: (increment = 1) => {
      processed += increment;
      const percentage = Math.round((processed / total) * 100);
      onProgress(percentage, processed, total);
    },
    // 完成
    complete: () => {
      onProgress(100, total, total);
    }
  };
}

// 模擬一個複雜的檔案處理工作流程
async function complexFileWorkflow() {
  console.log('開始複雜檔案處理工作流程');
  
  // 在這個示例中，我們將模擬檔案而非實際讀寫
  // 在實際應用中，可以替換為真實的檔案路徑
  
  // 模擬讀取和處理 CSV 檔案
  console.log('1. 模擬讀取客戶資料 CSV');
  const simulatedCSV = `id,name,email,age
1,張小明,xming@example.com,34
2,王美麗,meili@example.com,29
3,林大華,dahua@example.com,45
4,陳小芳,xiaochen@example.com,22
5,李志明,zhiming@example.com,31`;
  
  // 解析 CSV
  const customerData = parseCSV(simulatedCSV);
  console.log(`成功解析 ${customerData.length} 位客戶資料`);
  
  // 處理資料：年齡計算
  console.log('2. 進行資料轉換');
  const processedData = customerData.map(customer => ({
    ...customer,
    age: parseInt(customer.age),
    category: parseInt(customer.age) < 30 ? '年輕客群' : '成熟客群',
    lastContact: new Date().toISOString()
  }));
  
  // 模擬處理進度
  console.log('3. 進行批次資料處理');
  const progress = simulateProgressNotification(
    processedData.length,
    (percentage, processed, total) => {
      console.log(`處理進度: ${percentage}% (${processed}/${total})`);
    }
  );
  
  // 模擬批次處理
  await processFilesBatched(processedData, async (data) => {
    // 模擬繁重處理
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 更新進度
    progress.update();
    return { ...data, processed: true };
  }, 2);
  
  progress.complete();
  
  // 轉換回 CSV
  console.log('4. 轉換為輸出格式');
  const outputCSV = jsonToCSV([
    ...processedData.map(p => ({
      ID: p.id,
      姓名: p.name,
      信箱: p.email,
      年齡: p.age,
      客群分類: p.category,
      最後聯絡: p.lastContact
    }))
  ]);
  
  console.log('輸出結果 (前 100 字):', outputCSV.substring(0, 100) + '...');
  
  // 如果是實際使用，可以寫入檔案
  // await writeFile('processed_customers.csv', outputCSV);
  
  // 模擬檔案監控
  console.log('\n5. 模擬檔案監控');
  console.log('(在實際環境中，此功能會監控檔案變化並自動處理)');
  
  // 模擬監控函數 - 在實際環境下會註冊監控器
  // const stopWatching = simulateFileWatch('customer_data.csv', (content) => {
  //   console.log('檔案已變更，重新處理...');
  //   // 重新處理檔案內容
  // });
  
  console.log('\n工作流程完成！');
  return { customerData, processedData, outputCSV };
}

// ========================
// 執行範例
// ========================

// 執行複雜檔案處理工作流程
console.log('檔案處理程序啟動...');

complexFileWorkflow()
  .then(result => {
    console.log('\n可在控制台檢查結果，或在後續使用以下功能：');
    console.log('- readFile(檔案路徑): 讀取檔案');
    console.log('- writeFile(檔案路徑, 內容): 寫入檔案');
    console.log('- processLargeFile(輸入檔案, 輸出檔案, 轉換函數): 處理大型檔案');
    console.log('- parseCSV(CSV字串): 解析CSV為物件陣列');
    console.log('- jsonToCSV(物件陣列): 轉換物件陣列為CSV字串');
  })
  .catch(error => {
    console.error('處理檔案時發生錯誤:', error);
  });

/**
 * 練習拓展想法：
 * 
 * 1. 實作檔案壓縮與解壓縮 - 使用 zlib 模組壓縮大型檔案
 * 2. 實作檔案加密與解密 - 使用 crypto 模組保護敏感資料
 * 3. 建立檔案資料庫 - 實作簡單的基於檔案的資料庫
 * 4. 增強檔案監控 - 使用 chokidar 等套件實現完整的檔案監控
 * 5. 實作檔案同步 - 模擬將檔案同步到遠端服務器
 * 6. 建立記錄系統 - 使用檔案系統建立自動旋轉的日誌
 * 7. 處理二進制檔案 - 例如圖片處理或文件轉換
 */

// 模擬 Node.js 環境中的模組導出
// module.exports = {
//   readFile,
//   writeFile,
//   appendToFile,
//   fileExists,
//   processLargeFile,
//   processFilesInDirectory,
//   processFilesBatched,
//   fileOperationWithRetry,
//   parseCSV,
//   jsonToCSV,
//   simulateFileWatch,
//   complexFileWorkflow
// };

// 匯出供模組使用
export {
  readFile,
  writeFile,
  appendToFile,
  fileExists,
  processLargeFile,
  processFilesInDirectory,
  processFilesBatched,
  fileOperationWithRetry,
  parseCSV,
  jsonToCSV,
  simulateFileWatch,
  complexFileWorkflow
}; 