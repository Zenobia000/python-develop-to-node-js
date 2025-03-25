// ===== JavaScript 資料轉換練習 =====
// 本練習將幫助 Python 開發者熟悉 JavaScript 的資料處理方式

// ----- 輸入資料 -----
const users = [
    { id: 1, name: "Alice", age: 25, department: "Engineering", salary: 70000, skills: ["JavaScript", "React", "Node"] },
    { id: 2, name: "Bob", age: 32, department: "Marketing", salary: 65000, skills: ["Analytics", "SEO"] },
    { id: 3, name: "Charlie", age: 28, department: "Engineering", salary: 80000, skills: ["Python", "Django", "PostgreSQL"] },
    { id: 4, name: "Diana", age: 24, department: "HR", salary: 60000, skills: ["Communication", "Recruiting"] },
    { id: 5, name: "Ethan", age: 35, department: "Engineering", salary: 90000, skills: ["JavaScript", "React", "MongoDB", "Express"] },
    { id: 6, name: "Fiona", age: 29, department: "Marketing", salary: 72000, skills: ["Social Media", "Content Creation", "Analytics"] },
    { id: 7, name: "George", age: 40, department: "Management", salary: 95000, skills: ["Leadership", "Strategy"] }
];

// ===== 練習 1: 基本陣列轉換 =====
// 1.1 - 僅獲取所有用戶的名稱
// Python: [user["name"] for user in users]
const names = users.map(user => user.name);
console.log("1.1 用戶名稱:", names);

// 1.2 - 過濾出工程部門的用戶
// Python: [user for user in users if user["department"] == "Engineering"]
const engineers = users.filter(user => user.department === "Engineering");
console.log("1.2 工程師:", engineers);

// 1.3 - 計算所有用戶薪資總和
// Python: sum(user["salary"] for user in users)
const totalSalary = users.reduce((sum, user) => sum + user.salary, 0);
console.log("1.3 薪資總和:", totalSalary);

// ===== 練習 2: 資料轉換與解構 =====
// 2.1 - 創建 {id: name} 形式的物件
// Python: {user["id"]: user["name"] for user in users}
const idToName = users.reduce((obj, user) => {
    obj[user.id] = user.name;
    return obj;
}, {});
console.log("2.1 ID 到名稱映射:", idToName);

// 2.2 - 使用解構取出用戶資訊並重新格式化
// Python: [(user["name"], user["age"], user["department"]) for user in users]
const userInfo = users.map(({ name, age, department }) => ({
    fullName: name,
    yearsOld: age,
    team: department
}));
console.log("2.2 重新格式化用戶:", userInfo);

// 2.3 - 按部門分組用戶
// Python: 
// departments = {}
// for user in users:
//     dept = user["department"]
//     if dept not in departments:
//         departments[dept] = []
//     departments[dept].append(user)
const departmentGroups = users.reduce((groups, user) => {
    const { department } = user;
    if (!groups[department]) {
        groups[department] = [];
    }
    groups[department].push(user);
    return groups;
}, {});
console.log("2.3 部門分組:", departmentGroups);

// ===== 練習 3: 複雜資料轉換 =====
// 3.1 - 技能統計：找出所有不同技能及擁有該技能的用戶數量
// Python: 
// skills = {}
// for user in users:
//     for skill in user["skills"]:
//         skills[skill] = skills.get(skill, 0) + 1
const skillCounts = users.reduce((counts, user) => {
    user.skills.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
    });
    return counts;
}, {});
console.log("3.1 技能統計:", skillCounts);

// 3.2 - 計算每個部門的平均薪資
// Python:
// dept_totals = {}
// dept_counts = {}
// for user in users:
//     dept = user["department"]
//     dept_totals[dept] = dept_totals.get(dept, 0) + user["salary"]
//     dept_counts[dept] = dept_counts.get(dept, 0) + 1
// dept_averages = {dept: dept_totals[dept] / dept_counts[dept] for dept in dept_totals}
const deptAverageSalaries = Object.entries(
    users.reduce((depts, user) => {
        const { department, salary } = user;
        if (!depts[department]) {
            depts[department] = { total: 0, count: 0 };
        }
        depts[department].total += salary;
        depts[department].count += 1;
        return depts;
    }, {})
).reduce((avgs, [dept, { total, count }]) => {
    avgs[dept] = total / count;
    return avgs;
}, {});
console.log("3.2 部門平均薪資:", deptAverageSalaries);

// 3.3 - 創建年齡分佈圖 (20-25, 26-30, 31-35, 36+)
// Python:
// age_groups = {"20-25": 0, "26-30": 0, "31-35": 0, "36+": 0}
// for user in users:
//     age = user["age"]
//     if age <= 25: age_groups["20-25"] += 1
//     elif age <= 30: age_groups["26-30"] += 1
//     elif age <= 35: age_groups["31-35"] += 1
//     else: age_groups["36+"] += 1
const ageDistribution = users.reduce((dist, user) => {
    const { age } = user;
    if (age <= 25) dist["20-25"] = (dist["20-25"] || 0) + 1;
    else if (age <= 30) dist["26-30"] = (dist["26-30"] || 0) + 1;
    else if (age <= 35) dist["31-35"] = (dist["31-35"] || 0) + 1;
    else dist["36+"] = (dist["36+"] || 0) + 1;
    return dist;
}, {});
console.log("3.3 年齡分佈:", ageDistribution);

// ===== 練習 4: 高階函數和鏈式調用 =====
// 4.1 - 找出薪資最高的工程師
// Python: max([u for u in users if u["department"] == "Engineering"], key=lambda u: u["salary"])
const highestPaidEngineer = users
    .filter(user => user.department === "Engineering")
    .reduce((highest, engineer) => 
        engineer.salary > (highest?.salary || 0) ? engineer : highest, null);
console.log("4.1 薪資最高的工程師:", highestPaidEngineer?.name);

// 4.2 - 按年齡排序並提取名字和部門
// Python: sorted(users, key=lambda u: u["age"])
const sortedUserInfo = users
    .slice() // 創建副本以避免修改原數組
    .sort((a, b) => a.age - b.age)
    .map(({ name, department }) => `${name} (${department})`);
console.log("4.2 按年齡排序的用戶:", sortedUserInfo);

// 4.3 - 找出技能數量最多的用戶
// Python: max(users, key=lambda u: len(u["skills"]))
const mostSkilledUser = users.reduce((mostSkilled, user) => 
    user.skills.length > mostSkilled.skills.length ? user : mostSkilled, users[0]);
console.log("4.3 技能最多的用戶:", `${mostSkilledUser.name} (${mostSkilledUser.skills.length} skills)`);

// ===== 挑戰題 =====
// 1. 實現一個搜索函數，可以按名稱、部門或技能搜索用戶
function searchUsers(query, property = 'name') {
    query = query.toLowerCase();
    
    return users.filter(user => {
        if (property === 'skills') {
            return user.skills.some(skill => 
                skill.toLowerCase().includes(query));
        } else {
            return String(user[property]).toLowerCase().includes(query);
        }
    });
}

console.log("挑戰題 1 - 按名稱搜索 'a':", searchUsers('a'));
console.log("挑戰題 1 - 按部門搜索 'engineering':", searchUsers('engineering', 'department'));
console.log("挑戰題 1 - 按技能搜索 'javascript':", searchUsers('javascript', 'skills'));

// 2. 創建一個函數，返回部門技能矩陣 (哪些部門擁有哪些技能)
function getDepartmentSkills() {
    return Object.entries(
        users.reduce((depts, user) => {
            const { department, skills } = user;
            if (!depts[department]) {
                depts[department] = new Set();
            }
            skills.forEach(skill => depts[department].add(skill));
            return depts;
        }, {})
    ).reduce((result, [dept, skillSet]) => {
        result[dept] = [...skillSet];
        return result;
    }, {});
}

console.log("挑戰題 2 - 部門技能矩陣:", getDepartmentSkills());

// 3. 實現一個函數，根據任意屬性的組合來計算平均值
// 例如 getAverageByProperty('salary', 'department') 計算每個部門的平均薪資
// 例如 getAverageByProperty('age') 計算所有用戶的平均年齡
function getAverageByProperty(valueKey, groupKey = null) {
    if (!groupKey) {
        // 計算整體平均
        const sum = users.reduce((total, user) => total + user[valueKey], 0);
        return sum / users.length;
    } else {
        // 按分組計算平均
        const groups = users.reduce((acc, user) => {
            const group = user[groupKey];
            if (!acc[group]) {
                acc[group] = { sum: 0, count: 0 };
            }
            acc[group].sum += user[valueKey];
            acc[group].count += 1;
            return acc;
        }, {});
        
        return Object.entries(groups).reduce((result, [group, { sum, count }]) => {
            result[group] = sum / count;
            return result;
        }, {});
    }
}

console.log("挑戰題 3 - 平均年齡:", getAverageByProperty('age'));
console.log("挑戰題 3 - 按部門計算平均薪資:", getAverageByProperty('salary', 'department')); 