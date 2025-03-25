// ===== JavaScript 物件模型設計練習 =====
// 本練習將幫助 Python 開發者使用 JavaScript 實現物件導向設計

// ===== 任務：實現一個簡單的圖書館管理系統 =====
// 設計要求：
// 1. 支援圖書、使用者、借閱記錄的管理
// 2. 實現繼承
// 3. 實現封裝（使用 private 字段）
// 4. 展示 JavaScript 的物件導向特性

// ----- 基底項目類別 -----
// 所有圖書館項目的基類
class LibraryItem {
    #id;         // 私有字段
    #createDate; // 私有字段
    
    constructor(id) {
        this.#id = id;
        this.#createDate = new Date();
    }
    
    // Getter 方法
    get id() {
        return this.#id;
    }
    
    get createDate() {
        return new Date(this.#createDate); // 返回副本避免外部修改
    }
    
    // 在子類實現的方法
    getDetails() {
        throw new Error("Method 'getDetails' must be implemented");
    }
    
    // 共用方法
    toString() {
        return `LibraryItem ${this.#id}`;
    }
}

// ----- 書籍類別 -----
// Python 等價物：
// class Book(LibraryItem):
//     def __init__(self, id, title, author, isbn, pages, category):
//         super().__init__(id)
//         self.title = title
//         # 等等
class Book extends LibraryItem {
    #title;    // 私有字段
    #author;   // 私有字段
    #isbn;     // 私有字段
    #pages;    // 私有字段
    #category; // 私有字段
    #available; // 是否可借閱
    
    constructor(id, title, author, isbn, pages, category) {
        super(id);
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#pages = pages;
        this.#category = category;
        this.#available = true;
    }
    
    // Getters
    get title() { return this.#title; }
    get author() { return this.#author; }
    get isbn() { return this.#isbn; }
    get pages() { return this.#pages; }
    get category() { return this.#category; }
    get available() { return this.#available; }
    
    // 實現父類方法
    getDetails() {
        return {
            id: this.id,
            title: this.#title,
            author: this.#author,
            isbn: this.#isbn,
            pages: this.#pages,
            category: this.#category,
            available: this.#available
        };
    }
    
    // 方法
    markAsUnavailable() {
        this.#available = false;
    }
    
    markAsAvailable() {
        this.#available = true;
    }
    
    toString() {
        return `${this.#title} by ${this.#author}`;
    }
}

// ----- 專業書籍子類別 -----
// 展示類繼承
class AcademicBook extends Book {
    #academicField;
    #citations;
    
    constructor(id, title, author, isbn, pages, academicField, citations = []) {
        super(id, title, author, isbn, pages, "Academic");
        this.#academicField = academicField;
        this.#citations = citations;
    }
    
    get academicField() { return this.#academicField; }
    get citations() { return [...this.#citations]; } // 返回副本避免外部修改
    
    addCitation(citation) {
        this.#citations.push(citation);
    }
    
    getDetails() {
        const baseDetails = super.getDetails();
        return {
            ...baseDetails,
            academicField: this.#academicField,
            citationsCount: this.#citations.length
        };
    }
}

// ----- 使用者類別 -----
class User extends LibraryItem {
    #name;
    #email;
    #membershipType;
    #borrowedBooks;
    
    constructor(id, name, email, membershipType = "Regular") {
        super(id);
        this.#name = name;
        this.#email = email;
        this.#membershipType = membershipType;
        this.#borrowedBooks = new Map(); // 書 ID => 借閱記錄ID
    }
    
    // Getters
    get name() { return this.#name; }
    get email() { return this.#email; }
    get membershipType() { return this.#membershipType; }
    
    // 檢查是否可以借更多書
    canBorrowMore() {
        const limit = this.#getMembershipLimit();
        return this.#borrowedBooks.size < limit;
    }
    
    // 私有方法 (通過閉包模擬，JavaScript 現在有私有方法但兼容性有限)
    #getMembershipLimit() {
        const limits = {
            "Regular": 3,
            "Premium": 5,
            "Student": 2,
            "Researcher": 10
        };
        return limits[this.#membershipType] || 3;
    }
    
    // 獲取借閱的書籍 ID
    getBorrowedBookIds() {
        return Array.from(this.#borrowedBooks.keys());
    }
    
    // 借書
    borrowBook(bookId, borrowId) {
        if (!this.canBorrowMore()) {
            throw new Error(`User has reached the borrowing limit for ${this.#membershipType} membership`);
        }
        this.#borrowedBooks.set(bookId, borrowId);
    }
    
    // 還書
    returnBook(bookId) {
        return this.#borrowedBooks.delete(bookId);
    }
    
    getDetails() {
        return {
            id: this.id,
            name: this.#name,
            email: this.#email,
            membershipType: this.#membershipType,
            borrowedBooksCount: this.#borrowedBooks.size,
            borrowingLimit: this.#getMembershipLimit()
        };
    }
    
    toString() {
        return `${this.#name} (${this.#membershipType} member)`;
    }
}

// ----- 借閱記錄類別 -----
class BorrowRecord extends LibraryItem {
    #userId;
    #bookId;
    #borrowDate;
    #dueDate;
    #returnDate;
    #status; // "active", "returned", "overdue"
    
    constructor(id, userId, bookId, dueDate) {
        super(id);
        this.#userId = userId;
        this.#bookId = bookId;
        this.#borrowDate = new Date();
        this.#dueDate = new Date(dueDate);
        this.#returnDate = null;
        this.#status = "active";
    }
    
    // Getters
    get userId() { return this.#userId; }
    get bookId() { return this.#bookId; }
    get borrowDate() { return new Date(this.#borrowDate); }
    get dueDate() { return new Date(this.#dueDate); }
    get returnDate() { return this.#returnDate ? new Date(this.#returnDate) : null; }
    get status() { return this.#status; }
    
    // 處理還書
    processReturn() {
        this.#returnDate = new Date();
        this.#status = "returned";
    }
    
    // 檢查是否逾期
    checkOverdue() {
        if (this.#status === "returned") return false;
        
        const now = new Date();
        if (now > this.#dueDate && this.#status !== "overdue") {
            this.#status = "overdue";
            return true;
        }
        return this.#status === "overdue";
    }
    
    // 計算逾期天數
    getOverdueDays() {
        if (this.#status !== "overdue") return 0;
        
        const now = new Date();
        const diffTime = now - this.#dueDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // 計算罰款 (如適用)
    calculateFine(fineRate = 1) {
        if (this.#status !== "overdue") return 0;
        return this.getOverdueDays() * fineRate;
    }
    
    getDetails() {
        return {
            id: this.id,
            userId: this.#userId,
            bookId: this.#bookId,
            borrowDate: this.#borrowDate,
            dueDate: this.#dueDate,
            returnDate: this.#returnDate,
            status: this.#status,
            overdueDays: this.getOverdueDays()
        };
    }
    
    toString() {
        return `BorrowRecord ${this.id}: Book ${this.#bookId} borrowed by User ${this.#userId}`;
    }
}

// ----- 圖書館類別 -----
// 管理整個圖書館系統
class Library {
    #books;      // Map of id => Book
    #users;      // Map of id => User
    #records;    // Map of id => BorrowRecord
    #nextBookId;
    #nextUserId;
    #nextRecordId;
    #dailyFineRate;
    
    constructor(dailyFineRate = 1) {
        this.#books = new Map();
        this.#users = new Map();
        this.#records = new Map();
        this.#nextBookId = 1;
        this.#nextUserId = 1;
        this.#nextRecordId = 1;
        this.#dailyFineRate = dailyFineRate;
    }
    
    // ----- 書籍管理 -----
    
    // 添加書籍
    addBook(title, author, isbn, pages, category) {
        const id = this.#nextBookId++;
        const book = new Book(id, title, author, isbn, pages, category);
        this.#books.set(id, book);
        return book;
    }
    
    // 添加學術書籍
    addAcademicBook(title, author, isbn, pages, academicField, citations = []) {
        const id = this.#nextBookId++;
        const book = new AcademicBook(id, title, author, isbn, pages, academicField, citations);
        this.#books.set(id, book);
        return book;
    }
    
    // 獲取書籍
    getBook(id) {
        return this.#books.get(id);
    }
    
    // 刪除書籍
    removeBook(id) {
        // 檢查書籍是否已借出
        const activeRecords = Array.from(this.#records.values())
            .filter(record => record.bookId === id && record.status === "active");
        
        if (activeRecords.length > 0) {
            throw new Error(`Cannot remove book with ID ${id} because it is currently borrowed`);
        }
        
        return this.#books.delete(id);
    }
    
    // 搜索書籍
    searchBooks(query) {
        query = query.toLowerCase();
        return Array.from(this.#books.values()).filter(book => {
            return book.title.toLowerCase().includes(query) ||
                   book.author.toLowerCase().includes(query) ||
                   book.category.toLowerCase().includes(query) ||
                   book.isbn.toLowerCase().includes(query);
        });
    }
    
    // ----- 使用者管理 -----
    
    // 添加使用者
    addUser(name, email, membershipType = "Regular") {
        const id = this.#nextUserId++;
        const user = new User(id, name, email, membershipType);
        this.#users.set(id, user);
        return user;
    }
    
    // 獲取使用者
    getUser(id) {
        return this.#users.get(id);
    }
    
    // 刪除使用者
    removeUser(id) {
        // 檢查使用者是否有未還的書
        const user = this.#users.get(id);
        if (user && user.getBorrowedBookIds().length > 0) {
            throw new Error(`Cannot remove user with ID ${id} because they have unreturned books`);
        }
        
        return this.#users.delete(id);
    }
    
    // 搜索使用者
    searchUsers(query) {
        query = query.toLowerCase();
        return Array.from(this.#users.values()).filter(user => {
            return user.name.toLowerCase().includes(query) ||
                   user.email.toLowerCase().includes(query) ||
                   user.membershipType.toLowerCase().includes(query);
        });
    }
    
    // ----- 借閱管理 -----
    
    // 借書
    borrowBook(userId, bookId, daysToReturn = 14) {
        const user = this.#users.get(userId);
        const book = this.#books.get(bookId);
        
        if (!user) throw new Error(`User with ID ${userId} not found`);
        if (!book) throw new Error(`Book with ID ${bookId} not found`);
        
        if (!book.available) {
            throw new Error(`Book "${book.title}" is not available for borrowing`);
        }
        
        if (!user.canBorrowMore()) {
            throw new Error(`User ${user.name} has reached their borrowing limit`);
        }
        
        // 設置還書日期
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToReturn);
        
        // 創建借閱記錄
        const recordId = this.#nextRecordId++;
        const record = new BorrowRecord(recordId, userId, bookId, dueDate);
        
        // 更新書籍和使用者狀態
        book.markAsUnavailable();
        user.borrowBook(bookId, recordId);
        
        // 存儲借閱記錄
        this.#records.set(recordId, record);
        
        return record;
    }
    
    // 還書
    returnBook(bookId, userId) {
        const user = this.#users.get(userId);
        const book = this.#books.get(bookId);
        
        if (!user) throw new Error(`User with ID ${userId} not found`);
        if (!book) throw new Error(`Book with ID ${bookId} not found`);
        
        // 查找對應的借閱記錄
        const record = Array.from(this.#records.values()).find(r => 
            r.bookId === bookId && r.userId === userId && r.status !== "returned");
        
        if (!record) {
            throw new Error(`No active borrow record found for this book and user`);
        }
        
        // 處理還書
        record.processReturn();
        book.markAsAvailable();
        user.returnBook(bookId);
        
        // 計算罰款 (如有)
        const fine = record.calculateFine(this.#dailyFineRate);
        
        return {
            success: true,
            fine,
            book,
            user,
            record
        };
    }
    
    // 檢查所有逾期書籍
    checkOverdueBooks() {
        const overdueRecords = [];
        
        for (const record of this.#records.values()) {
            if (record.status === "active" && record.checkOverdue()) {
                overdueRecords.push({
                    record,
                    user: this.#users.get(record.userId),
                    book: this.#books.get(record.bookId),
                    overdueDays: record.getOverdueDays(),
                    fine: record.calculateFine(this.#dailyFineRate)
                });
            }
        }
        
        return overdueRecords;
    }
    
    // ----- 報表生成 -----
    
    // 獲取所有書籍
    getAllBooks() {
        return Array.from(this.#books.values());
    }
    
    // 獲取所有使用者
    getAllUsers() {
        return Array.from(this.#users.values());
    }
    
    // 獲取所有借閱記錄
    getAllRecords() {
        return Array.from(this.#records.values());
    }
    
    // 獲取系統統計信息
    getStatistics() {
        const totalBooks = this.#books.size;
        const availableBooks = Array.from(this.#books.values()).filter(book => book.available).length;
        const totalUsers = this.#users.size;
        const activeRecords = Array.from(this.#records.values()).filter(r => r.status === "active").length;
        const overdueRecords = Array.from(this.#records.values()).filter(r => r.status === "overdue").length;
        
        return {
            totalBooks,
            availableBooks,
            borrowedBooks: totalBooks - availableBooks,
            totalUsers,
            activeRecords,
            overdueRecords
        };
    }
    
    // 某使用者的借閱歷史
    getUserBorrowHistory(userId) {
        const user = this.#users.get(userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);
        
        const records = Array.from(this.#records.values())
            .filter(record => record.userId === userId)
            .map(record => {
                const book = this.#books.get(record.bookId);
                return {
                    record,
                    book,
                    borrowDate: record.borrowDate,
                    returnDate: record.returnDate,
                    status: record.status
                };
            });
        
        return {
            user,
            records
        };
    }
}

// ===== 示例使用 =====

// 創建一個圖書館實例
const library = new Library(2); // 每天罰款 2 元

// 添加書籍
const book1 = library.addBook("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", 180, "Fiction");
const book2 = library.addBook("To Kill a Mockingbird", "Harper Lee", "9780061120084", 281, "Fiction");
const book3 = library.addAcademicBook("Introduction to Algorithms", "Thomas H. Cormen", "9780262033848", 1312, "Computer Science", [
    "Knuth, D. E. The Art of Computer Programming", 
    "Rivest, R. L. Introduction to Algorithms"
]);

// 添加使用者
const user1 = library.addUser("John Smith", "john@example.com", "Regular");
const user2 = library.addUser("Alice Johnson", "alice@example.com", "Premium");
const user3 = library.addUser("Robert Chen", "robert@example.com", "Researcher");

// 借書
console.log("\n----- 借書操作 -----");
const borrow1 = library.borrowBook(user1.id, book1.id, 7);
console.log(`${user1.name} 借了 "${book1.title}", 需在 ${borrow1.dueDate.toLocaleDateString()} 前歸還`);

const borrow2 = library.borrowBook(user2.id, book2.id, 14);
console.log(`${user2.name} 借了 "${book2.title}", 需在 ${borrow2.dueDate.toLocaleDateString()} 前歸還`);

const borrow3 = library.borrowBook(user3.id, book3.id, 30);
console.log(`${user3.name} 借了 "${book3.title}", 需在 ${borrow3.dueDate.toLocaleDateString()} 前歸還`);

// 搜索書籍
console.log("\n----- 搜索書籍 -----");
const searchResults = library.searchBooks("algorithms");
console.log(`搜索 "algorithms": 找到 ${searchResults.length} 本書`);
searchResults.forEach(book => {
    console.log(`- ${book.title} by ${book.author}`);
});

// 還書
console.log("\n----- 還書操作 -----");
const return1 = library.returnBook(book2.id, user2.id);
console.log(`${return1.user.name} 歸還了 "${return1.book.title}"`);
if (return1.fine > 0) {
    console.log(`需支付逾期罰款: ${return1.fine} 元`);
}

// 檢查逾期書籍 (若有設置過去的到期日，測試時可能會顯示逾期)
console.log("\n----- 逾期檢查 -----");
const overdueBooks = library.checkOverdueBooks();
if (overdueBooks.length > 0) {
    console.log(`發現 ${overdueBooks.length} 本逾期書籍:`);
    overdueBooks.forEach(item => {
        console.log(`- "${item.book.title}" 被 ${item.user.name} 借出，逾期 ${item.overdueDays} 天，罰款 ${item.fine} 元`);
    });
} else {
    console.log("沒有逾期書籍");
}

// 生成系統統計報表
console.log("\n----- 系統統計 -----");
const stats = library.getStatistics();
console.log(`總藏書: ${stats.totalBooks} 本`);
console.log(`可借閱: ${stats.availableBooks} 本`);
console.log(`借出中: ${stats.borrowedBooks} 本`);
console.log(`使用者: ${stats.totalUsers} 人`);
console.log(`處理中的借閱記錄: ${stats.activeRecords} 筆`);
console.log(`逾期記錄: ${stats.overdueRecords} 筆`);

// 使用者借閱歷史
console.log("\n----- 借閱歷史 -----");
const userHistory = library.getUserBorrowHistory(user1.id);
console.log(`${userHistory.user.name} 的借閱歷史:`);
userHistory.records.forEach(record => {
    console.log(`- "${record.book.title}": ${record.status}, 借閱日期: ${record.borrowDate.toLocaleDateString()}`);
}); 