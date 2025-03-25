// 9. Generator 函數 (生成器)
// Python: def gen(): yield 1; yield 2; yield 3
function* simpleGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const generator = simpleGenerator();
console.log(generator.next().value);  // 1
console.log(generator.next().value);  // 2
console.log(generator.next().value);  // 3
console.log(generator.next().done);   // true 
