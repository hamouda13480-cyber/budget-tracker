// استرجاع البيانات المحفوظة أو إنشاء كائن جديد
let monthData = JSON.parse(localStorage.getItem('padlet_budget_data')) || {};

const quickPriceInput = document.getElementById('quick-price');
const addBtn = document.getElementById('add-btn');
const boardsGrid = document.getElementById('boards-grid');

// دالة لمعرفة اسم الشهر والسنة الحاليين تلقائياً من تقويم الجهاز
function getCurrentMonthKey() {
    const now = new Date();
    return now.toLocaleString('ar', { month: 'long', year: 'numeric' });
}

// التأكد من إنشاء كارت للشهر الحالي تلقائياً
function ensureCurrentMonthExists() {
    const currentKey = getCurrentMonthKey();
    if (!monthData[currentKey]) {
        monthData[currentKey] = [];
        saveData();
    }
    return currentKey;
}

// تشغيل الفحص والعرض عند فتح الصفحة
ensureCurrentMonthExists();
renderBoards();

// إضافة مبلغ جديد عند الضغط على زر الإضافة أو زر Enter
addBtn.addEventListener('click', addExpense);
quickPriceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addExpense();
});

function addExpense() {
    const price = parseFloat(quickPriceInput.value);
    if (isNaN(price) || price <= 0) return;

    // إضافة السعر تلقائياً لكارت الشهر الحالي
    const currentKey = ensureCurrentMonthExists();
    
    monthData[currentKey].push({
        id: Date.now(),
        amount: price
    });

    saveData();
    renderBoards();
    quickPriceInput.value = '';
    quickPriceInput.focus();
}

// حذف سعر معين من الشهر المحدد
function deleteExpense(monthKey, id) {
    monthData[monthKey] = monthData[monthKey].filter(item => item.id !== id);
    saveData();
    renderBoards();
}

// عرض جميع كروت الشهور بجانب بعضها
function renderBoards() {
    boardsGrid.innerHTML = '';
    const currentKey = getCurrentMonthKey();
    const monthKeys = Object.keys(monthData);

    monthKeys.forEach(monthKey => {
        const card = document.createElement('div');
        const isCurrent = (monthKey === currentKey);
        card.className = `month-card ${isCurrent ? 'current' : ''}`;

        let total = 0;
        let itemsHTML = '';

        monthData[monthKey].forEach(item => {
            total += item.amount;
            itemsHTML += `
                <li class="expense-item">
                    <span>${item.amount}</span>
                    <button class="del-btn" onclick="deleteExpense('${monthKey}', ${item.id})">✕</button>
                </li>
            `;
        });

        card.innerHTML = `
            <div class="month-title">${monthKey} ${isCurrent ? '(الحالي)' : ''}</div>
            <ul class="expenses-list">
                ${itemsHTML || '<li style="text-align:center; color:#888; font-size:0.85rem;">لا توجد مصاريف</li>'}
            </ul>
            <div class="month-total">
                المجموع: ${total}
            </div>
        `;

        boardsGrid.appendChild(card);
    });
}

function saveData() {
    localStorage.setItem('padlet_budget_data', JSON.stringify(monthData));
}