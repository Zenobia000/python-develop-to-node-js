// ===== JavaScript Set和Map與Python對比 =====

// ===== Set (集合) =====
// 1. 建立Set
// Python: fruits_set = {"apple", "banana", "orange"}
const fruitsSet = new Set(["apple", "banana", "orange"]);
console.log(fruitsSet); // Set(3) {"apple", "banana", "orange"}

// 從字符串建立Set (每個字符作為一個元素)
// Python: chars_set = set("hello")
const charsSet = new Set("hello");
console.log(charsSet); // Set(4) {"h", "e", "l", "o"} (注意'l'只出現一次)

// 2. 基本操作
// ----- 添加元素 -----
// Python: fruits_set.add("grape")
fruitsSet.add("grape");
console.log(fruitsSet); // Set(4) {"apple", "banana", "orange", "grape"}

// 添加重複元素無效
fruitsSet.add("apple");
console.log(fruitsSet); // 仍然是Set(4) {"apple", "banana", "orange", "grape"}

// ----- 刪除元素 -----
// Python: fruits_set.remove("banana")
fruitsSet.delete("banana");
console.log(fruitsSet); // Set(3) {"apple", "orange", "grape"}

// ----- 檢查元素是否存在 -----
// Python: "apple" in fruits_set
console.log(fruitsSet.has("apple")); // true
console.log(fruitsSet.has("banana")); // false

// ----- 獲取大小 -----
// Python: len(fruits_set)
console.log(fruitsSet.size); // 3

// ----- 清空集合 -----
// Python: fruits_set.clear()
const tempSet = new Set(["temp1", "temp2"]);
tempSet.clear();
console.log(tempSet); // Set(0) {}

// 3. 迭代Set
// ----- for...of循環 -----
// Python: for fruit in fruits_set:
for (const fruit of fruitsSet) {
    console.log(fruit);
}

// ----- forEach方法 -----
fruitsSet.forEach(fruit => {
    console.log(`水果: ${fruit}`);
});

// ----- 轉換為陣列 -----
// Python: fruits_list = list(fruits_set)
const fruitsArray = Array.from(fruitsSet);
// 或使用展開運算符
const fruitsArray2 = [...fruitsSet];
console.log(fruitsArray); // ["apple", "orange", "grape"]

// 4. 集合操作
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// ----- 聯集 -----
// Python: set_a | set_b 或 set_a.union(set_b)
const union = new Set([...setA, ...setB]);
console.log(union); // Set(6) {1, 2, 3, 4, 5, 6}

// ----- 交集 -----
// Python: set_a & set_b 或 set_a.intersection(set_b)
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log(intersection); // Set(2) {3, 4}

// ----- 差集 -----
// Python: set_a - set_b 或 set_a.difference(set_b)
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log(difference); // Set(2) {1, 2}

// ----- 對稱差集 -----
// Python: set_a ^ set_b 或 set_a.symmetric_difference(set_b)
const symmetricDifference = new Set(
    [...setA].filter(x => !setB.has(x)).concat([...setB].filter(x => !setA.has(x)))
);
console.log(symmetricDifference); // Set(4) {1, 2, 5, 6}

// ===== Map (映射) =====
// 1. 建立Map
// Python: scores = {"John": 85, "Alice": 92, "Bob": 78}
const scoresMap = new Map([
    ["John", 85],
    ["Alice", 92],
    ["Bob", 78]
]);
console.log(scoresMap); // Map(3) {"John" => 85, "Alice" => 92, "Bob" => 78}

// 空Map
const emptyMap = new Map();

// 2. 基本操作
// ----- 設置鍵值對 -----
// Python: scores["Eve"] = 95
scoresMap.set("Eve", 95);
console.log(scoresMap); // Map(4) {"John" => 85, "Alice" => 92, "Bob" => 78, "Eve" => 95}

// 鏈式設置
scoresMap.set("Charlie", 88).set("David", 76);

// ----- 獲取值 -----
// Python: scores["Alice"]
console.log(scoresMap.get("Alice")); // 92

// 獲取不存在的鍵
// Python: scores.get("Unknown", "Not found")
console.log(scoresMap.get("Unknown")); // undefined
// 使用邏輯或運算符提供默認值
console.log(scoresMap.get("Unknown") || "Not found"); // "Not found"

// ----- 檢查鍵是否存在 -----
// Python: "Bob" in scores
console.log(scoresMap.has("Bob")); // true

// ----- 刪除鍵值對 -----
// Python: del scores["Bob"]
scoresMap.delete("Bob");
console.log(scoresMap.has("Bob")); // false

// ----- 獲取大小 -----
// Python: len(scores)
console.log(scoresMap.size); // 5 (John, Alice, Eve, Charlie, David)

// ----- 清空Map -----
// Python: scores.clear()
const tempMap = new Map([["temp", 1]]);
tempMap.clear();
console.log(tempMap.size); // 0

// 3. 迭代Map
// ----- 迭代鍵值對 -----
// Python: for name, score in scores.items():
for (const [name, score] of scoresMap) {
    console.log(`${name}: ${score}`);
}

// ----- 只迭代鍵 -----
// Python: for name in scores:
for (const name of scoresMap.keys()) {
    console.log(name);
}

// ----- 只迭代值 -----
// Python: for score in scores.values():
for (const score of scoresMap.values()) {
    console.log(score);
}

// ----- forEach方法 -----
scoresMap.forEach((score, name) => {
    console.log(`${name} scored ${score}`);
});

// 4. 轉換
// ----- Map轉物件 -----
// Python: dict(scores_items)
const scoresObj = Object.fromEntries(scoresMap);
console.log(scoresObj); // {John: 85, Alice: 92, Eve: 95, Charlie: 88, David: 76}

// ----- 物件轉Map -----
// Python: scores_map = dict(scores_obj.items())
const objToMap = new Map(Object.entries({
    x: 1,
    y: 2,
    z: 3
}));
console.log(objToMap); // Map(3) {"x" => 1, "y" => 2, "z" => 3}

// 5. Map的優勢 (相比於物件)
// ----- 任意類型的鍵 -----
// Python字典僅支持可哈希的類型作為鍵
const complexMap = new Map();

// 使用物件作為鍵
const objKey = { id: 1 };
complexMap.set(objKey, "Object as key");

// 使用函數作為鍵
function fnKey() {}
complexMap.set(fnKey, "Function as key");

// 使用數組作為鍵
const arrayKey = [1, 2, 3];
complexMap.set(arrayKey, "Array as key");

console.log(complexMap.get(objKey)); // "Object as key"
console.log(complexMap.get(fnKey)); // "Function as key"
console.log(complexMap.get(arrayKey)); // "Array as key"

// 6. WeakMap和WeakSet (弱引用版本)
// Python沒有直接對應的內置類型

// WeakMap: 當鍵不再被其他地方引用時，其項目會被垃圾回收
const weakMap = new WeakMap();
let obj = { data: "some data" };
weakMap.set(obj, "metadata");

// 當obj被重新賦值或不再訪問時，weakMap中的項目可能被自動移除
obj = null;

// WeakSet: 類似Set，但弱引用其中的項目
const weakSet = new WeakSet();
let obj2 = { id: 123 };
weakSet.add(obj2);

// 當obj2被重新賦值或不再訪問時，weakSet中的項目可能被自動移除
obj2 = null;

// 注意: WeakMap和WeakSet不可枚舉，因為成員可能隨時消失
// 它們主要用於關聯額外數據到對象，而不影響垃圾回收 