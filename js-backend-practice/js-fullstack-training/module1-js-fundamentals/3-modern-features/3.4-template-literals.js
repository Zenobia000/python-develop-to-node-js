// ===== JavaScript 模板字串 (Template Literals) =====

// 模板字串是 ES6 引入的字符串語法，使用反引號(`)定義
// Python 開發者可能熟悉格式化字符串(f-strings)，功能類似
// 模板字串提供了更強大的字符串處理能力

// 1. 基本用法
// ----- 傳統字符串 -----
const name = "Alice";
const greeting1 = "Hello, " + name + "!";
console.log(greeting1); // Hello, Alice!

// ----- 模板字串 -----
// Python: f"Hello, {name}!"
const greeting2 = `Hello, ${name}!`;
console.log(greeting2); // Hello, Alice!


// 2. 變數與表達式嵌入
// ----- 插入簡單變數 -----
const age = 30;
// Python: f"{name} is {age} years old"
console.log(`${name} is ${age} years old`); // Alice is 30 years old

// ----- 插入表達式 -----
// Python: f"Next year, {name} will be {age + 1}"
console.log(`Next year, ${name} will be ${age + 1}`); // Next year, Alice will be 31

// ----- 插入函數調用 -----
function getTitle() {
    return "Engineer";
}
// Python: f"{name} works as a {get_title()}"
console.log(`${name} works as a ${getTitle()}`); // Alice works as a Engineer

// ----- 插入三元運算符 -----
// Python: f"{name} is {'an adult' if age >= 18 else 'a minor'}"
console.log(`${name} is ${age >= 18 ? 'an adult' : 'a minor'}`); // Alice is an adult


// 3. 多行字符串
// ----- 傳統多行字符串需要換行符或串聯 -----
const multiline1 = "Line 1\n" +
                  "Line 2\n" +
                  "Line 3";

// ----- 模板字串支持原生多行 -----
// Python: """Line 1
//          Line 2
//          Line 3"""
const multiline2 = `Line 1
Line 2
Line 3`;

console.log(multiline1 === multiline2); // true
console.log(multiline2);
// Line 1
// Line 2
// Line 3


// 4. 標籤模板 (Tagged Templates)
// 標籤模板是一個強大的功能，Python 中沒有直接對應
// 它允許你使用函數處理模板字串各個部分

// ----- 基本標籤函數 -----
function simpleTag(strings, ...values) {
    console.log('Strings:', strings);
    console.log('Values:', values);
    
    // 手動組合結果
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
}

const item = "book";
const price = 29.99;
const simpleResult = simpleTag`The ${item} costs $${price}.`;
// Strings: ['The ', ' costs $', '.']
// Values: ['book', 29.99]
console.log(simpleResult); // The book costs $29.99.

// ----- 自定義格式化標籤函數 -----
function formatCurrency(strings, ...values) {
    return strings.reduce((result, str, i) => {
        // 格式化值（如果是數字則添加貨幣格式）
        let value = values[i - 1];
        if (typeof value === 'number') {
            value = `$${value.toFixed(2)}`;
        }
        return result + value + str;
    });
}

const product = "Laptop";
const cost = 1299.99;
const formatted = formatCurrency`The ${product} costs ${cost} today!`;
console.log(formatted); // The Laptop costs $1300.00 today!

// ----- 安全HTML標籤函數 (防止XSS) -----
function safeHTML(strings, ...values) {
    const escapeHTML = (str) => {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };
    
    return strings.reduce((result, str, i) => {
        // 轉義值以防注入
        let value = i > 0 ? escapeHTML(values[i - 1]) : '';
        return result + value + str;
    });
}

const username = '<script>alert("XSS!")</script>';
const safeOutput = safeHTML`<div>Welcome, ${username}!</div>`;
console.log(safeOutput); 
// <div>Welcome, &lt;script&gt;alert(&quot;XSS!&quot;)&lt;/script&gt;!</div>


// 5. 實際應用場景
// ----- 構建複雜HTML -----
const users = [
    { name: "Alice", age: 30, active: true },
    { name: "Bob", age: 25, active: false },
    { name: "Charlie", age: 35, active: true }
];

const userList = `
<ul>
    ${users
        .filter(user => user.active)
        .map(user => `<li>${user.name} (${user.age})</li>`)
        .join('')}
</ul>
`;
console.log(userList);
// <ul>
//     <li>Alice (30)</li>
//     <li>Charlie (35)</li>
// </ul>

// ----- SQL查詢構建 -----
function buildQuery(table, filters) {
    const conditions = Object.entries(filters)
        .map(([column, value]) => `${column} = '${value}'`)
        .join(' AND ');
    
    return `SELECT * FROM ${table} WHERE ${conditions}`;
}

const query = buildQuery('users', { status: 'active', age_above: 18 });
console.log(query); // SELECT * FROM users WHERE status = 'active' AND age_above = '18'

// ----- 多語言支持 -----
const i18n = {
    'en': {
        greeting: 'Hello',
        farewell: 'Goodbye'
    },
    'es': {
        greeting: 'Hola',
        farewell: 'Adiós'
    },
    'zh': {
        greeting: '你好',
        farewell: '再見'
    }
};

function translate(lang, strings, ...values) {
    const translated = strings.map(str => {
        // 簡單的替換，實際應用中會更複雜
        if (str.trim() === 'Hello') return i18n[lang].greeting;
        if (str.trim() === 'Goodbye') return i18n[lang].farewell;
        return str;
    });
    
    // 組合字符串和值
    return translated.reduce((result, str, i) => {
        const value = i > 0 ? values[i - 1] : '';
        return result + value + str;
    });
}

const userName = "Carlos";
const enGreeting = translate('en', ['Hello', ', ', '!'], userName);
const esGreeting = translate('es', ['Hello', ', ', '!'], userName);
const zhGreeting = translate('zh', ['Hello', ', ', '!'], userName);

console.log(enGreeting); // "Hello, Carlos!"
console.log(esGreeting); // "Hola, Carlos!"
console.log(zhGreeting); // "你好, Carlos!" 