// 7. 常見陷阱與解決方案
// ----- 回調函數中的 this -----
const EventEmitter = require('events');

// 創建一個事件發射器替代瀏覽器中的 document
const emitter = new EventEmitter();

class Button {
    constructor(text) {
        this.text = text;
    }
    
    // 問題：callback 中的 this 指向全局
    registerClickBad() {
        emitter.on('click', function() {
            console.log(`Button ${this.text} clicked!`); // this.text 是 undefined
        });
        console.log("已註冊點擊處理 (但 this 會丟失)");
    }
    
    // 解決方案 1：保存 this
    registerClickBetter1() {
        const self = this;
        emitter.on('click', function() {
            console.log(`Button ${self.text} clicked!`); // 使用閉包捕獲的 self
        });
        console.log("已註冊點擊處理 (使用 self)");
    }
    
    // 解決方案 2：綁定 this
    registerClickBetter2() {
        emitter.on('click', function() {
            console.log(`Button ${this.text} clicked!`);
        }.bind(this));
        console.log("已註冊點擊處理 (使用 bind)");
    }
    
    // 解決方案 3：使用箭頭函數 (ES6+, 推薦)
    registerClick() {
        emitter.on('click', () => {
            console.log(`Button ${this.text} clicked!`);
        });
        console.log("已註冊點擊處理 (使用箭頭函數)");
    }
}

const button = new Button("Submit");
// 測試各種方法
button.registerClickBad();
button.registerClickBetter1();
button.registerClickBetter2();
button.registerClick();

// 觸發點擊事件進行測試
console.log("\n模擬點擊事件：");
emitter.emit('click');
