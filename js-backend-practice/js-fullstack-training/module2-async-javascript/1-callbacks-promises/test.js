// 導入內置模組 (類似 Python 內置模組)
const path = require('path');
const fs = require('fs');

// 使用導入的模組
console.log(`当前文件: ${path.basename(__filename)}`);
console.log(`绝对路径: ${path.resolve(__filename)}`);