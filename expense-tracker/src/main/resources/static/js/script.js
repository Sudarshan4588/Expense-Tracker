document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:8081/api/expenses';
    const modal = document.getElementById('expense-modal');
    const addBtn = document.getElementById('add-btn');
    const closeBtn = document.querySelector('.close-btn');
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const filterCategory = document.getElementById('filter-category');
    const filterMonth = document.getElementById('filter-month');
    const totalAmountEl = document.getElementById('total-amount');
    const monthAmountEl = document.getElementById('month-amount');
    const modalTitle = document.getElementById('modal-title');
    const expenseIdInput = document.getElementById('expense-id');

    let expenses = [];
    let expensesChart; // Chart instance

    // Event listeners
    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    expenseForm.addEventListener('submit', handleFormSubmit);
    filterCategory.addEventListener('change', filterExpenses);
    filterMonth.addEventListener('change', filterExpenses);

    // Initialize
    fetchExpenses();

    function openAddModal() {
        expenseIdInput.value = '';
        expenseForm.reset();
        modalTitle.textContent = 'Add New Expense';
        modal.style.display = 'block';
    }

    function openEditModal(expense) {
        expenseIdInput.value = expense.id;
        document.getElementById('title').value = expense.title;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;
        document.getElementById('date').value = expense.date.split('T')[0];
        modalTitle.textContent = 'Edit Expense';
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const expenseData = {
            title: document.getElementById('title').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };

        const id = expenseIdInput.value;

        try {
            if (id) {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(expenseData)
                });
            } else {
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(expenseData)
                });
            }

            closeModal();
            fetchExpenses();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchExpenses() {
        try {
            const response = await fetch(apiUrl);
            expenses = await response.json();
            renderExpenses(expenses);
            updateSummary();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    function renderExpenses(expensesToRender) {
        expensesList.innerHTML = '';

        if (expensesToRender.length === 0) {
            expensesList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No expenses found</td></tr>';
            return;
        }

        expensesToRender.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.title}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${expense.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${expense.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            expensesList.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const expense = expenses.find(exp => exp.id == id);
                openEditModal(expense);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteExpense(id);
            });
        });
    }

    async function deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    }

    function filterExpenses() {
        const category = filterCategory.value;
        const monthYear = filterMonth.value;

        let filteredExpenses = [...expenses];

        if (category !== 'all') {
            filteredExpenses = filteredExpenses.filter(expense => expense.category === category);
        }

        if (monthYear) {
            const [year, month] = monthYear.split('-');
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() == year &&
                       (expenseDate.getMonth() + 1) == month;
            });
        }

        renderExpenses(filteredExpenses);
    }

    function updateSummary() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Total expenses for this year
        const totalThisYear = expenses.reduce((sum, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getFullYear() === currentYear) {
                return sum + expense.amount;
            }
            return sum;
        }, 0);

        totalAmountEl.textContent = `${totalThisYear.toFixed(2)}`;

        // Current month total (you can keep this as it is)
        const currentMonth = currentDate.getMonth() + 1;
        const monthTotal = expenses.reduce((sum, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getFullYear() === currentYear &&
                (expenseDate.getMonth() + 1) === currentMonth) {
                return sum + expense.amount;
            }
            return sum;
        }, 0);

        monthAmountEl.textContent = `${monthTotal.toFixed(2)}`;


        // ---- Chart Update ----
        const categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        const labels = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

        if (expensesChart) {
            expensesChart.destroy();
        }

        const ctx = document.getElementById('expensesChart').getContext('2d');
        expensesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#ff6384','#36a2eb','#ffce56',
                        '#4bc0c0','#9966ff','#ff9f40','#66bb6a'
                    ]
                }]
            }
        });
        // ---- Month-wise Bar Chart (current year only) ----
        const monthlyTotals = {};

        // Filter expenses for current year
        const expensesThisYear = expenses.filter(exp => {
            const expenseDate = new Date(exp.date);
            return expenseDate.getFullYear() === currentYear;
        });

        // Group expenses by month (1-12)
        expensesThisYear.forEach(exp => {
            const expenseDate = new Date(exp.date);
            const month = expenseDate.getMonth() + 1; // 1-12
            monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
        });

        // Prepare labels (Jan to Dec) and values
        const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthValues = monthLabels.map((_, idx) => monthlyTotals[idx + 1] || 0);

        // Destroy previous chart if exists
        if (window.monthlyChart) {
            window.monthlyChart.destroy();
        }

        const ctx2 = document.getElementById('monthlyExpensesChart').getContext('2d');
        window.monthlyChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: `Expenses in ${currentYear}`,
                    data: monthValues,
                    backgroundColor: '#36a2eb'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });



    }
    document.getElementById('generate-pdf-btn').addEventListener('click', generateYearlyPDF);

    function generateYearlyPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Filter expenses for current year
        const expensesThisYear = expenses.filter(exp => {
            const expenseDate = new Date(exp.date);
            return expenseDate.getFullYear() === currentYear;
        });

        if (expensesThisYear.length === 0) {
            alert(`No expenses found for ${currentYear}`);
            return;
        }

        // Title
        doc.setFontSize(18);
        doc.text(`Expense Report - ${currentYear}`, 14, 20);

        // Table headers
        doc.setFontSize(12);
        const headers = ["Title", "Amount", "Category", "Date"];
        let startY = 30;
        let startX = 14;
        const rowHeight = 8;

        // Draw table header
        headers.forEach((header, index) => {
            doc.text(header, startX + index * 50, startY);
        });

        startY += rowHeight;

        // Add expense rows
        expensesThisYear.forEach(exp => {
            doc.text(exp.title, startX, startY);
            doc.text(exp.amount.toFixed(2), startX + 50, startY);
            doc.text(exp.category, startX + 100, startY);
            doc.text(new Date(exp.date).toLocaleDateString(), startX + 150, startY);
            startY += rowHeight;
            if (startY > 280) { // Add new page if needed
                doc.addPage();
                startY = 20;
            }
        });

        // Total
        const totalThisYear = expensesThisYear.reduce((sum, exp) => sum + exp.amount, 0);
        doc.setFontSize(14);
        doc.text(`Total Expenses: ${totalThisYear.toFixed(2)}`, startX, startY + 10);

        // Save PDF
        doc.save(`Expense_Report_${currentYear}.pdf`);
    }



    document.getElementById('category').addEventListener('change', handleCategoryChange);

    function handleCategoryChange() {
        const categorySelect = document.getElementById('category');
        const otherCategoryGroup = document.getElementById('other-category-group');

        if (otherCategoryGroup) {
            if (categorySelect.value === 'Other') {
                otherCategoryGroup.style.display = 'block';
            } else {
                otherCategoryGroup.style.display = 'none';
            }
        }
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

});
