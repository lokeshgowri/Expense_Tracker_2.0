function Expense(desc, amount, cat, date, baseCat, method, photo) {
    this.description = desc;
    this.amount = parseFloat(amount);
    this.category = cat;
    this.baseCategory = baseCat || cat;
    this.date = date || new Date().toISOString().split('T')[0];
    this.paymentMethod = method || 'Cash';
    this.billPhoto = photo || null;
}

function ExpenseTrackerViewModel() {
    const self = this;
    const todayStr = new Date().toISOString().split('T')[0];

    self.isDarkMode = ko.observable(localStorage.getItem('theme') === 'dark');
    if (self.isDarkMode()) document.documentElement.setAttribute('data-theme', 'dark');
    
    self.toggleTheme = () => {
        self.isDarkMode(!self.isDarkMode());
        localStorage.setItem('theme', self.isDarkMode() ? 'dark' : 'light');
        if (self.isDarkMode()) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
    };

    self.toastMessage = ko.observable('');
    let toastTimeout = null;
    self.showToast = (msg) => {
        self.toastMessage(msg);
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => self.toastMessage(''), 3000);
    };

    self.newDescription = ko.observable('');
    self.newAmount = ko.observable('');
    self.newCategory = ko.observable('Food');
    self.customCategory = ko.observable('');
    self.newDate = ko.observable(todayStr);
    self.newPaymentMethod = ko.observable('Cash');
    self.billPhoto = ko.observable(null);
    self.billPhotoName = ko.observable('');
    
    self.editingExpense = ko.observable(null);

    self.salary = ko.observable(parseFloat(localStorage.getItem('salary')) || 0);
    self.salary.subscribe(val => localStorage.setItem('salary', val));

    self.selectedImage = ko.observable(null);
    self.viewImage = function(expense) {
        if (expense.billPhoto) self.selectedImage(expense.billPhoto);
    };
    self.closeImage = function() {
        self.selectedImage(null);
    };

    const saved = JSON.parse(localStorage.getItem('expenses')) || [];
    self.expenses = ko.observableArray(saved.map(e => 
        new Expense(e.description, e.amount, e.category, e.date, e.baseCategory, e.paymentMethod, e.billPhoto)
    ));

    self.expenses.subscribe(val => {
        try { localStorage.setItem('expenses', JSON.stringify(val)); }
        catch (e) { alert("Storage full! Image too large."); }
        self.updateChart();
    });

    self.totalExpenses = ko.computed(() => self.expenses().reduce((s, e) => s + e.amount, 0).toFixed(2));
    
    self.savings = ko.computed(() => {
        const income = parseFloat(self.salary()) || 0;
        const expenses = self.expenses().reduce((s, e) => s + e.amount, 0);
        return (income - expenses).toFixed(2);
    });
    
    self.totalToday = ko.computed(() => 
        self.expenses().filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0).toFixed(2)
    );
    
    self.totalMonth = ko.computed(() => {
        const monthStr = todayStr.slice(0, 7);
        return self.expenses().filter(e => e.date.startsWith(monthStr)).reduce((s, e) => s + e.amount, 0).toFixed(2);
    });

    self.filterCategory = ko.observable('');
    self.filterMethod = ko.observable('');
    self.filterMonth = ko.observable('');

    self.filteredExpenses = ko.computed(() => {
        let filtered = self.expenses();
        const catFilter = self.filterCategory();
        const methodFilter = self.filterMethod();
        const monthFilter = self.filterMonth();
        
        if (catFilter) filtered = filtered.filter(e => e.baseCategory === catFilter);
        if (methodFilter) filtered = filtered.filter(e => e.paymentMethod === methodFilter);
        if (monthFilter) filtered = filtered.filter(e => e.date.startsWith(monthFilter));
        
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    self.handleFileSelect = (data, e) => {
        const file = e.target.files[0];
        if (!file) return;
        self.billPhotoName(file.name);
        const r = new FileReader();
        r.onload = ev => self.billPhoto(ev.target.result);
        r.readAsDataURL(file);
    };

    self.editExpense = (expense) => {
        self.editingExpense(expense);
        self.newDescription(expense.description);
        self.newAmount(expense.amount);
        self.newCategory(expense.baseCategory);
        if (expense.category !== expense.baseCategory) {
            self.newCategory('Other');
            self.customCategory(expense.category);
        } else {
            self.customCategory('');
        }
        self.newDate(expense.date);
        self.newPaymentMethod(expense.paymentMethod);
        self.billPhoto(expense.billPhoto);
        self.billPhotoName(expense.billPhoto ? 'Existing Bill' : '');
    };
    
    self.cancelEdit = () => {
        self.editingExpense(null);
        self.newDescription(''); self.newAmount(''); self.newCategory('Food'); self.customCategory('');
        self.newDate(todayStr); self.newPaymentMethod('Cash'); self.billPhoto(null); self.billPhotoName('');
        document.getElementById('billFileInput').value = "";
    };

    self.addExpense = () => {
        if (!self.newDescription() || !self.newAmount()) return self.showToast('Please enter both description and amount.');
        
        const cat = (self.newCategory() === 'Other' && self.customCategory()) ? self.customCategory() : self.newCategory();
        const newExp = new Expense(self.newDescription(), self.newAmount(), cat, self.newDate(), self.newCategory(), self.newPaymentMethod(), self.billPhoto());

        if (self.editingExpense()) {
            self.expenses.replace(self.editingExpense(), newExp);
        } else {
            self.expenses.push(newExp);
        }

        self.cancelEdit();
    };

    self.removeExpense = e => self.expenses.remove(e);

    let chart = null;
    self.updateChart = () => {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;
        
        const totals = {};
        self.expenses().forEach(e => totals[e.baseCategory] = (totals[e.baseCategory] || 0) + e.amount);

        const data = {
            labels: Object.keys(totals),
            datasets: [{
                data: Object.values(totals),
                backgroundColor: ['#34C759', '#0071E3', '#FF9500', '#AF52DE', '#8E8E93'], // Matches Cash, Debit, Credit, Online, Other roughly
                borderWidth: 0
            }]
        };

        if (chart) { chart.data = data; chart.update(); }
        else {
            chart = new Chart(ctx, {
                type: 'doughnut', data,
                options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right' } } }
            });
        }
    };
}

window.onload = () => {
    const vm = new ExpenseTrackerViewModel();
    ko.applyBindings(vm);
    setTimeout(() => vm.updateChart(), 100);
};
