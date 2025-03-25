// Python: 使用 _ 前綴約定或 @property 裝飾器
function createPerson(name) {
    let age = 0; // 私有變數
    
    return {
        getName: function() {
            return name;
        },
        getAge: function() {
            return age;
        },
        setAge: function(newAge) {
            if (newAge >= 0) {
                age = newAge;
            }
        },
        birthday: function() {
            age += 1;
            return `${name} 現在 ${age} 歲了!`;
        }
    };
}

const alice = createPerson("Alice");
console.log(alice.getName()); // "Alice"
console.log(alice.getAge()); // 0
alice.setAge(25);
console.log(alice.birthday()); // "Alice 現在 26 歲了!"