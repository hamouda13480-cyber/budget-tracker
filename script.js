let monthData = JSON.parse(localStorage.getItem('padlet_budget_data')) || {};

const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const addBtn = document.getElementById('add-btn');
const boardsGrid = document.getElementById('boards-grid');

function getCurrentMonthKey() {
    const now = new Date();
    return now.toLocaleString('ar', { month: 'long', year: 'numeric' });
}

function ensureCurrentMonthExists() {
    const currentKey = getCurrentMonthKey();
    if (!monthData[currentKey]) {
        monthData[currentKey] = [];
        saveData();
    }
    return currentKey;
}

ensureCurrentMonthExists();
renderBoards();

addBtn.addEventListener('click', addExpense);
itemPriceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addExpense();
});

function addExpense() {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);

    if (name === '' || isNaN(price) || price <= 0) return;

    const currentKey = ensureCurrentMonthExists();
    
    monthData[currentKey].push({
        id: Date.now(),
        name: name,
        amount: price
    });

    saveData();
    renderBoards();

    // تفريغ الحقول وإرجاع التركيز لاسم الحاجة
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemNameInput.focus();
}

function deleteExpense(monthKey, id) {
    monthData[monthKey] = monthData[monthKey].filter(item => item.id !== id);
    saveData();
    renderBoards();
}

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
                    <span>${item.name}: <strong>${item.amount}</strong></span>
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
