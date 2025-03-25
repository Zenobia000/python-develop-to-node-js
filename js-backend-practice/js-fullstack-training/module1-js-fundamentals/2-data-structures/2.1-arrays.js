// ===== JavaScript 陣列操作與 Python 列表比較 =====

// 1. 創建陣列
// Python: fruits = ["apple", "banana", "orange"]
const fruits = ["apple", "banana", "orange"];

// Python: numbers = list(range(1, 6))
const numbers = [1, 2, 3, 4, 5];

// 使用 Array 構造函數
// Python: zeros = [0] * 5
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// 2. 基本操作
// 訪問元素 (類似Python)
console.log(fruits[0]); // "apple"

// 修改元素 (類似Python)
fruits[1] = "kiwi";
console.log(fruits); // ["apple", "kiwi", "orange"]

// 獲取長度 (Python: len(fruits))
console.log(fruits.length); // 3

// 3. 添加和刪除元素
// 添加到尾部 (Python: fruits.append("grape"))
fruits.push("grape");
console.log(fruits); // ["apple", "kiwi", "orange", "grape"]

// 添加到頭部 (Python: fruits.insert(0, "melon"))
fruits.unshift("melon");
console.log(fruits); // ["melon", "apple", "kiwi", "orange", "grape"]

// 從尾部刪除 (Python: fruits.pop())
const lastFruit = fruits.pop();
console.log(lastFruit); // "grape"
console.log(fruits); // ["melon", "apple", "kiwi", "orange"]

// 從頭部刪除 (Python: fruits.pop(0))
const firstFruit = fruits.shift();
console.log(firstFruit); // "melon"
console.log(fruits); // ["apple", "kiwi", "orange"]

// 指定位置刪除 (Python: del fruits[1:2])
// splice(開始索引, 刪除數量, 插入項目...)
fruits.splice(1, 1);
console.log(fruits); // ["apple", "orange"]

// 插入元素 (Python: fruits.insert(1, "mango"))
fruits.splice(1, 0, "mango");
console.log(fruits); // ["apple", "mango", "orange"]

// 4. 陣列方法 (類比Python)
// 連接陣列 (Python: fruits + vegetables)
const vegetables = ["carrot", "broccoli"];
const combined = fruits.concat(vegetables);
console.log(combined); 
// ["apple", "mango", "orange", "carrot", "broccoli"]

// 截取部分 (Python: fruits[1:3])
const sliced = combined.slice(1, 3);
console.log(sliced); // ["mango", "orange"]

// 查找元素索引 (Python: fruits.index("apple"))
const index = fruits.indexOf("mango");
console.log(index); // 1

// 檢查元素是否存在 (Python: "apple" in fruits)
console.log(fruits.includes("apple")); // true

// 陣列轉字串 (Python: ", ".join(fruits))
console.log(fruits.join(", ")); // "apple, mango, orange"

// 5. 迭代陣列
// Python: for fruit in fruits:
//             print(fruit)
fruits.forEach(fruit => {
    console.log(fruit);
});

// 6. 陣列變換 (函數式方法)
const numArray = [1, 2, 3, 4, 5];

// map (Python: [x*2 for x in numbers])
const doubled = numArray.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter (Python: [x for x in numbers if x > 2])
const filtered = numArray.filter(num => num > 2);
console.log(filtered); // [3, 4, 5]

// reduce (Python: sum(numbers))
const sum = numArray.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// 7. 排序
// Python: sorted(fruits) 或 fruits.sort()
fruits.sort();
console.log(fruits); // ["apple", "mango", "orange"] (字母順序)

// 自定義排序 (Python: fruits.sort(key=len))
const longFruits = ["watermelon", "apple", "kiwi", "dragonfruit"];
longFruits.sort((a, b) => a.length - b.length);
console.log(longFruits); // ["kiwi", "apple", "watermelon", "dragonfruit"]

// 8. 多維陣列 (類比Python嵌套列表)
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
console.log(matrix[1][1]); // 5

// 9. 陣列解構 (Python: a, *rest = [1, 2, 3, 4])
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// 10. 陣列複製 (Python: new_list = fruits.copy())
// 淺複製
const fruitsCopy = [...fruits]; // 展開運算符
// 或
const anotherCopy = Array.from(fruits);
// 或
const thirdCopy = fruits.slice();

// 11. 陣列填充 (Python: [0] * 5)
const filledArray = new Array(5).fill("x");
console.log(filledArray); // ["x", "x", "x", "x", "x"]

// 12. 陣列扁平化 (Python: [item for sublist in nested for item in sublist])
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.flat();
console.log(flat); // [1, 2, 3, 4, 5]

// 13. 陣列檢查
console.log(Array.isArray(fruits)); // true
console.log(Array.isArray({})); // false 