// coffee-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                    
                    // Load data for the active section
                    loadSectionData(target);
                }
            });
        });
    });
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Load initial dashboard data
    loadDashboardData();
    
    // Animate stats cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe stat cards for animation
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Simulate real-time updates
    setInterval(updateDashboardStats, 10000);
    
    console.log('Coffee Dashboard initialized successfully');
});

// Load data for different sections
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'menu':
            loadMenuData();
            break;
        case 'inventory':
            loadInventoryData();
            break;
        case 'customers':
            loadCustomersData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Load dashboard data from server
function loadDashboardData() {
    // Simulated API call
    setTimeout(() => {
        const dashboardData = {
            todaySales: 245,
            todayRevenue: 1245,
            newCustomers: 89,
            avgWaitTime: 12,
            recentOrders: [
                { id: 'ORD-0012', items: 'Espresso ×2, Croissant', time: '2 minutes ago', status: 'completed', price: 14.50 },
                { id: 'ORD-0011', items: 'Cappuccino, Latte, Muffin', time: '5 minutes ago', status: 'preparing', price: 18.75 },
                { id: 'ORD-0010', items: 'Americano, Tea, Sandwich', time: '8 minutes ago', status: 'pending', price: 22.30 }
            ],
            popularItems: [
                { name: 'Espresso', sold_today: 89, rating: 4.8 },
                { name: 'Cappuccino', sold_today: 67, rating: 4.9 },
                { name: 'Latte', sold_today: 54, rating: 4.7 }
            ]
        };
        updateDashboardUI(dashboardData);
    }, 500);
}

// Update dashboard UI with real data
function updateDashboardUI(dashboardData) {
    // Update stats cards
    const stats = document.querySelectorAll('.stat-info h3');
    if (stats.length >= 4) {
        stats[0].textContent = dashboardData.todaySales;
        stats[1].textContent = '$' + dashboardData.todayRevenue.toLocaleString();
        stats[2].textContent = dashboardData.newCustomers;
        stats[3].textContent = dashboardData.avgWaitTime + ' min';
    }
    
    // Update recent orders
    const ordersList = document.querySelector('.orders-list');
    if (ordersList && dashboardData.recentOrders) {
        ordersList.innerHTML = '';
        dashboardData.recentOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-info">
                    <div class="order-id">#${order.id}</div>
                    <div class="order-items">${order.items}</div>
                    <div class="order-time">${order.time}</div>
                </div>
                <div class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                <div class="order-price">$${order.price.toFixed(2)}</div>
            `;
            ordersList.appendChild(orderItem);
        });
    }
    
    // Update popular items
    const itemsGrid = document.querySelector('.items-grid');
    if (itemsGrid && dashboardData.popularItems) {
        itemsGrid.innerHTML = '';
        dashboardData.popularItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            
            // Generate different background colors for items
            const colors = [
                'linear-gradient(135deg, #8B4513, #A0522D)',
                'linear-gradient(135deg, #D2691E, #CD853F)',
                'linear-gradient(135deg, #A0522D, #DEB887)'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            itemCard.innerHTML = `
                <div class="item-image" style="background: ${randomColor};">
                    <i class="fas fa-coffee"></i>
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.sold_today} sold today</p>
                </div>
                <div class="item-rating">
                    <i class="fas fa-star"></i>
                    <span>${item.rating}</span>
                </div>
            `;
            itemsGrid.appendChild(itemCard);
        });
    }
}

// Update dashboard stats with random data (for real-time simulation)
function updateDashboardStats() {
    // Only update if dashboard is active
    const dashboardSection = document.getElementById('dashboard');
    if (!dashboardSection || !dashboardSection.classList.contains('active')) return;
    
    // Add small random fluctuations to make it feel live
    const stats = document.querySelectorAll('.stat-info h3');
    if (stats.length >= 4) {
        const currentSales = parseInt(stats[0].textContent) || 245;
        const currentRevenue = parseInt(stats[1].textContent.replace('$', '').replace(',', '')) || 1245;
        const currentCustomers = parseInt(stats[2].textContent) || 89;
        const currentWaitTime = parseInt(stats[3].textContent) || 12;
        
        stats[0].textContent = Math.max(0, currentSales + Math.floor(Math.random() * 5 - 2));
        stats[1].textContent = '$' + Math.max(0, currentRevenue + Math.floor(Math.random() * 20 - 10)).toLocaleString();
        stats[2].textContent = Math.max(0, currentCustomers + Math.floor(Math.random() * 3 - 1));
        stats[3].textContent = Math.max(1, currentWaitTime + Math.floor(Math.random() * 2 - 1)) + ' min';
    }
}

// Load menu data
function loadMenuData() {
    // Simulated API call
    setTimeout(() => {
        const menuData = {
            items: [
                {
                    id: 1,
                    name: "Espresso",
                    price: 3.50,
                    category: "Coffee",
                    soldToday: 89,
                    totalSold: 1245,
                    rating: 4.8,
                    status: "active",
                    featured: true
                },
                {
                    id: 2,
                    name: "Cappuccino",
                    price: 4.25,
                    category: "Coffee",
                    soldToday: 67,
                    totalSold: 987,
                    rating: 4.9,
                    status: "active",
                    featured: false
                },
                {
                    id: 3,
                    name: "Latte",
                    price: 4.50,
                    category: "Coffee",
                    soldToday: 54,
                    totalSold: 856,
                    rating: 4.7,
                    status: "active",
                    featured: true
                },
                {
                    id: 4,
                    name: "Croissant",
                    price: 2.75,
                    category: "Pastry",
                    soldToday: 45,
                    totalSold: 678,
                    rating: 4.6,
                    status: "active",
                    featured: false
                },
                {
                    id: 5,
                    name: "Blueberry Muffin",
                    price: 3.25,
                    category: "Pastry",
                    soldToday: 38,
                    totalSold: 543,
                    rating: 4.5,
                    status: "active",
                    featured: false
                },
                {
                    id: 6,
                    name: "Iced Coffee",
                    price: 4.00,
                    category: "Cold Drinks",
                    soldToday: 42,
                    totalSold: 612,
                    rating: 4.4,
                    status: "inactive",
                    featured: false
                }
            ]
        };
        
        updateMenuUI(menuData);
    }, 500);
}

// Update menu UI
function updateMenuUI(menuData) {
    const menuContainer = document.getElementById('menuItemsContainer');
    if (!menuContainer) return;
    
    let menuHTML = '';
    
    menuData.items.forEach(item => {
        const colors = {
            'Coffee': 'linear-gradient(135deg, #8B4513, #A0522D)',
            'Pastry': 'linear-gradient(135deg, #D2691E, #CD853F)',
            'Tea': 'linear-gradient(135deg, #4CAF50, #45a049)',
            'Cold Drinks': 'linear-gradient(135deg, #2196F3, #1976D2)',
            'Sandwiches': 'linear-gradient(135deg, #FF9800, #F57C00)'
        };
        const color = colors[item.category] || 'linear-gradient(135deg, #8B4513, #A0522D)';
        
        const icons = {
            'Coffee': 'fa-coffee',
            'Pastry': 'fa-cookie',
            'Tea': 'fa-mug-hot',
            'Cold Drinks': 'fa-glass-whiskey',
            'Sandwiches': 'fa-bread-slice'
        };
        const icon = icons[item.category] || 'fa-coffee';
        
        menuHTML += `
            <div class="menu-item-card ${item.featured ? 'featured' : ''}">
                <div class="menu-item-header">
                    <div class="menu-item-icon" style="background: ${color};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="menu-item-details">
                        <h4>${item.name}</h4>
                        <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                        <span class="menu-item-category">${item.category}</span>
                        <span class="status-badge status-${item.status}">${item.status}</span>
                    </div>
                </div>
                <div class="menu-item-stats">
                    <div class="stat">
                        <div class="stat-value">${item.soldToday}</div>
                        <div class="stat-label">Today</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${item.totalSold}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${item.rating}</div>
                        <div class="stat-label">Rating</div>
                    </div>
                </div>
                <div class="menu-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="toggleMenuItemStatus(${item.id})">
                        <i class="fas fa-power-off"></i> ${item.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    menuContainer.innerHTML = menuHTML;
}

// Filter menu items
function filterMenuItems() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('menuSearch').value.toLowerCase();
    
    const menuItems = document.querySelectorAll('.menu-item-card');
    
    menuItems.forEach(item => {
        const category = item.querySelector('.menu-item-category').textContent.toLowerCase();
        const status = item.querySelector('.status-badge').textContent.toLowerCase();
        const name = item.querySelector('h4').textContent.toLowerCase();
        
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter.toLowerCase();
        const statusMatch = statusFilter === 'all' || status === statusFilter.toLowerCase();
        const searchMatch = name.includes(searchTerm) || category.includes(searchTerm);
        
        if (categoryMatch && statusMatch && searchMatch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Load inventory data
function loadInventoryData() {
    // Simulated API call
    setTimeout(() => {
        const inventoryData = {
            stats: {
                totalItems: 45,
                lowStockItems: 8,
                outOfStockItems: 2,
                inventoryValue: 12500
            },
            items: [
                { id: 1, name: "Coffee Beans", category: "Raw Materials", currentStock: 150, minStock: 50, unit: "kg", unitPrice: 25.50, status: "high" },
                { id: 2, name: "Milk", category: "Dairy", currentStock: 25, minStock: 30, unit: "liters", unitPrice: 1.20, status: "low" },
                { id: 3, name: "Sugar", category: "Raw Materials", currentStock: 45, minStock: 20, unit: "kg", unitPrice: 0.85, status: "medium" },
                { id: 4, name: "Paper Cups", category: "Packaging", currentStock: 12, minStock: 25, unit: "boxes", unitPrice: 8.75, status: "low" },
                { id: 5, name: "Vanilla Syrup", category: "Flavors", currentStock: 8, minStock: 10, unit: "bottles", unitPrice: 12.50, status: "low" },
                { id: 6, name: "Croissants", category: "Pastry", currentStock: 35, minStock: 15, unit: "pieces", unitPrice: 1.25, status: "high" },
                { id: 7, name: "Chocolate Powder", category: "Raw Materials", currentStock: 0, minStock: 5, unit: "kg", unitPrice: 18.75, status: "out" }
            ]
        };
        
        updateInventoryUI(inventoryData);
    }, 500);
}

// Update inventory UI
function updateInventoryUI(inventoryData) {
    // Update inventory stats
    document.getElementById('totalItems').textContent = inventoryData.stats.totalItems;
    document.getElementById('lowStockItems').textContent = inventoryData.stats.lowStockItems;
    document.getElementById('outOfStockItems').textContent = inventoryData.stats.outOfStockItems;
    document.getElementById('inventoryValue').textContent = '$' + inventoryData.stats.inventoryValue.toLocaleString();
    
    // Update inventory table
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;
    
    let tableHTML = '';
    
    inventoryData.items.forEach(item => {
        const statusClass = `stock-${item.status}`;
        const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
        
        tableHTML += `
            <div class="table-row">
                <div>${item.name}</div>
                <div>${item.category}</div>
                <div>${item.currentStock} ${item.unit}</div>
                <div>${item.minStock} ${item.unit}</div>
                <div>$${item.unitPrice.toFixed(2)}</div>
                <div><span class="stock-level ${statusClass}">${statusText}</span></div>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="restockItem(${item.id})">
                        <i class="fas fa-plus"></i> Restock
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

// Load customers data
function loadCustomersData() {
    // Simulated API call
    setTimeout(() => {
        const customersData = {
            stats: {
                totalCustomers: 1245,
                vipCustomers: 89,
                avgRating: 4.7,
                totalLoyaltyPoints: 45678
            },
            customers: [
                { 
                    id: 1, 
                    name: "John Smith", 
                    email: "john.smith@email.com", 
                    joinDate: "2024-01-15", 
                    totalOrders: 45, 
                    totalSpent: 856.50, 
                    loyaltyPoints: 1245,
                    isVip: true,
                    avatar: "JS"
                },
                { 
                    id: 2, 
                    name: "Sarah Johnson", 
                    email: "sarah.j@email.com", 
                    joinDate: "2024-02-03", 
                    totalOrders: 32, 
                    totalSpent: 612.75, 
                    loyaltyPoints: 890,
                    isVip: true,
                    avatar: "SJ"
                },
                { 
                    id: 3, 
                    name: "Mike Chen", 
                    email: "mike.chen@email.com", 
                    joinDate: "2024-01-28", 
                    totalOrders: 28, 
                    totalSpent: 423.80, 
                    loyaltyPoints: 645,
                    isVip: false,
                    avatar: "MC"
                },
                { 
                    id: 4, 
                    name: "Emily Davis", 
                    email: "emily.davis@email.com", 
                    joinDate: "2024-03-12", 
                    totalOrders: 15, 
                    totalSpent: 245.60, 
                    loyaltyPoints: 345,
                    isVip: false,
                    avatar: "ED"
                },
                { 
                    id: 5, 
                    name: "Robert Wilson", 
                    email: "robert.w@email.com", 
                    joinDate: "2024-02-20", 
                    totalOrders: 38, 
                    totalSpent: 712.40, 
                    loyaltyPoints: 1023,
                    isVip: true,
                    avatar: "RW"
                },
                { 
                    id: 6, 
                    name: "Lisa Brown", 
                    email: "lisa.brown@email.com", 
                    joinDate: "2024-03-05", 
                    totalOrders: 12, 
                    totalSpent: 198.25, 
                    loyaltyPoints: 198,
                    isVip: false,
                    avatar: "LB"
                }
            ]
        };
        
        updateCustomersUI(customersData);
    }, 500);
}

// Update customers UI
function updateCustomersUI(customersData) {
    // Update customer stats
    document.getElementById('totalCustomers').textContent = customersData.stats.totalCustomers.toLocaleString();
    document.getElementById('vipCustomers').textContent = customersData.stats.vipCustomers;
    document.getElementById('avgRating').textContent = customersData.stats.avgRating;
    document.getElementById('totalLoyaltyPoints').textContent = customersData.stats.totalLoyaltyPoints.toLocaleString();
    
    // Update customers grid
    const customersContainer = document.getElementById('customersContainer');
    if (!customersContainer) return;
    
    let customersHTML = '';
    
    customersData.customers.forEach(customer => {
        customersHTML += `
            <div class="customer-card ${customer.isVip ? 'vip' : ''}">
                <div class="customer-header">
                    <div class="customer-avatar">
                        ${customer.avatar}
                    </div>
                    <div class="customer-info">
                        <h4>${customer.name}</h4>
                        <div class="customer-email">${customer.email}</div>
                        <div class="customer-join-date">Joined: ${new Date(customer.joinDate).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="customer-stats">
                    <div class="customer-stat">
                        <div class="value">${customer.totalOrders}</div>
                        <div class="label">Orders</div>
                    </div>
                    <div class="customer-stat">
                        <div class="value">$${customer.totalSpent.toFixed(2)}</div>
                        <div class="label">Spent</div>
                    </div>
                    <div class="customer-stat">
                        <div class="value">${customer.loyaltyPoints}</div>
                        <div class="label">Points</div>
                    </div>
                </div>
                <div class="customer-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewCustomerDetails(${customer.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="sendPromotion(${customer.id})">
                        <i class="fas fa-gift"></i> Promote
                    </button>
                </div>
            </div>
        `;
    });
    
    customersContainer.innerHTML = customersHTML;
}

// Load analytics data
function loadAnalyticsData() {
    const period = document.getElementById('analyticsPeriod').value;
    
    // Simulated API call
    setTimeout(() => {
        const analyticsData = {
            revenueData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [12500, 13200, 14100, 14800, 15600, 16400],
                change: '+12%'
            },
            topItems: [
                { name: 'Espresso', sales: 1245, revenue: 4357.50 },
                { name: 'Cappuccino', sales: 987, revenue: 4194.75 },
                { name: 'Latte', sales: 856, revenue: 3852.00 },
                { name: 'Croissant', sales: 678, revenue: 1864.50 },
                { name: 'Iced Coffee', sales: 612, revenue: 2448.00 }
            ],
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                data: [25, 35, 20, 12, 8]
            },
            peakHours: [
                { hour: '6AM', orders: 45 },
                { hour: '7AM', orders: 89 },
                { hour: '8AM', orders: 124 },
                { hour: '9AM', orders: 98 },
                { hour: '10AM', orders: 76 },
                { hour: '11AM', orders: 65 },
                { hour: '12PM', orders: 112 },
                { hour: '1PM', orders: 95 },
                { hour: '2PM', orders: 78 },
                { hour: '3PM', orders: 82 },
                { hour: '4PM', orders: 105 },
                { hour: '5PM', orders: 118 }
            ],
            metrics: {
                conversionRate: '12.5%',
                avgOrderValue: 18.75,
                customerRetention: '68%',
                tableTurnover: 3.2
            }
        };
        
        updateAnalyticsUI(analyticsData);
    }, 500);
}

// Update analytics UI
function updateAnalyticsUI(analyticsData) {
    // Update revenue change
    document.getElementById('revenueChange').textContent = analyticsData.revenueData.change;
    document.getElementById('revenueChange').className = `revenue-change ${analyticsData.revenueData.change.includes('+') ? 'up' : 'down'}`;
    
    // Update performance metrics
    document.getElementById('conversionRate').textContent = analyticsData.metrics.conversionRate;
    document.getElementById('avgOrderValue').textContent = '$' + analyticsData.metrics.avgOrderValue.toFixed(2);
    document.getElementById('customerRetention').textContent = analyticsData.metrics.customerRetention;
    document.getElementById('tableTurnover').textContent = analyticsData.metrics.tableTurnover;
    
    // Update top items list
    const topItemsList = document.getElementById('topItemsList');
    if (topItemsList) {
        let topItemsHTML = '';
        analyticsData.topItems.forEach((item, index) => {
            topItemsHTML += `
                <div class="top-item">
                    <div class="top-item-rank">${index + 1}</div>
                    <div class="top-item-info">
                        <div class="top-item-name">${item.name}</div>
                        <div class="top-item-stats">
                            <span class="top-item-sales">${item.sales} sales</span> • 
                            <span>$${item.revenue.toFixed(2)} revenue</span>
                        </div>
                    </div>
                </div>
            `;
        });
        topItemsList.innerHTML = topItemsHTML;
    }
    
    // Update peak hours chart
    const peakHoursChart = document.getElementById('peakHoursChart');
    if (peakHoursChart) {
        let peakHoursHTML = '';
        analyticsData.peakHours.forEach(hour => {
            const height = (hour.orders / 124) * 100;
            peakHoursHTML += `
                <div class="hour-bar" style="height: ${height}%;" 
                     data-hour="${hour.hour}" 
                     data-orders="${hour.orders}">
                </div>
            `;
        });
        peakHoursChart.innerHTML = peakHoursHTML;
    }
    
    // Initialize charts
    initializeRevenueChart(analyticsData.revenueData);
    initializeDemographicsChart(analyticsData.demographics);
}

// Initialize revenue chart
function initializeRevenueChart(revenueData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }
    
    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueData.labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData.data,
                borderColor: '#8B4513',
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize demographics chart
function initializeDemographicsChart(demographicsData) {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    
    if (window.demographicsChart) {
        window.demographicsChart.destroy();
    }
    
    window.demographicsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: demographicsData.labels,
            datasets: [{
                data: demographicsData.data,
                backgroundColor: [
                    '#8B4513',
                    '#D2691E',
                    '#F4A460',
                    '#DEB887',
                    '#F5F5DC'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load settings data
function loadSettingsData() {
    // Settings are already loaded from the HTML
    console.log('Settings data loaded');
}

// Modal functions
function openAddMenuItemModal() {
    showModal('Add Menu Item', `
        <div class="form-row">
            <div class="form-group">
                <label for="itemName">Item Name</label>
                <input type="text" id="itemName" class="form-control" placeholder="Enter item name">
            </div>
            <div class="form-group">
                <label for="itemPrice">Price ($)</label>
                <input type="number" id="itemPrice" class="form-control" placeholder="0.00" step="0.01">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="itemCategory">Category</label>
                <select id="itemCategory" class="form-control">
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="pastry">Pastry</option>
                    <option value="cold-drinks">Cold Drinks</option>
                    <option value="sandwiches">Sandwiches</option>
                </select>
            </div>
            <div class="form-group">
                <label for="itemStatus">Status</label>
                <select id="itemStatus" class="form-control">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="itemDescription">Description</label>
            <textarea id="itemDescription" class="form-control" rows="3" placeholder="Enter item description"></textarea>
        </div>
    `, 'Add Item', saveMenuItem);
}

function openAddInventoryModal() {
    showModal('Add Stock', `
        <div class="form-group">
            <label for="inventoryItem">Item</label>
            <select id="inventoryItem" class="form-control">
                <option value="">Select item...</option>
                <option value="coffee-beans">Coffee Beans</option>
                <option value="milk">Milk</option>
                <option value="sugar">Sugar</option>
                <option value="cups">Paper Cups</option>
            </select>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="stockQuantity">Quantity</label>
                <input type="number" id="stockQuantity" class="form-control" placeholder="0">
            </div>
            <div class="form-group">
                <label for="stockUnit">Unit</label>
                <select id="stockUnit" class="form-control">
                    <option value="kg">kg</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                    <option value="bottles">Bottles</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="stockCost">Cost ($)</label>
            <input type="number" id="stockCost" class="form-control" placeholder="0.00" step="0.01">
        </div>
    `, 'Add Stock', addStock);
}

function openAddCustomerModal() {
    showModal('Add Customer', `
        <div class="form-row">
            <div class="form-group">
                <label for="customerName">Full Name</label>
                <input type="text" id="customerName" class="form-control" placeholder="Enter customer name">
            </div>
            <div class="form-group">
                <label for="customerEmail">Email</label>
                <input type="email" id="customerEmail" class="form-control" placeholder="Enter email address">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="customerPhone">Phone</label>
                <input type="tel" id="customerPhone" class="form-control" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label for="customerType">Customer Type</label>
                <select id="customerType" class="form-control">
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                </select>
            </div>
        </div>
    `, 'Add Customer', saveCustomer);
}

// Generic modal function
function showModal(title, content, actionText, actionCallback) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="${actionCallback.name}()">${actionText}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Action functions for modals
function saveMenuItem() {
    // Simulate saving menu item
    alert('Menu item saved successfully!');
    closeModal();
    loadMenuData(); // Reload to show new item
}

function addStock() {
    // Simulate adding stock
    alert('Stock added successfully!');
    closeModal();
    loadInventoryData(); // Reload to show updated stock
}

function saveCustomer() {
    // Simulate saving customer
    alert('Customer added successfully!');
    closeModal();
    loadCustomersData(); // Reload to show new customer
}

// Other action functions
function editMenuItem(id) {
    alert(`Editing menu item #${id}`);
}

function toggleMenuItemStatus(id) {
    alert(`Toggling status for menu item #${id}`);
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        alert(`Menu item #${id} deleted`);
        loadMenuData(); // Reload to reflect changes
    }
}

function restockItem(id) {
    alert(`Restocking item #${id}`);
}

function editInventoryItem(id) {
    alert(`Editing inventory item #${id}`);
}

function viewCustomerDetails(id) {
    alert(`Viewing details for customer #${id}`);
}

function editCustomer(id) {
    alert(`Editing customer #${id}`);
}

function sendPromotion(id) {
    alert(`Sending promotion to customer #${id}`);
}

function exportInventory() {
    alert('Exporting inventory data...');
}

function generateStockReport() {
    alert('Generating stock report...');
}

function createBackup() {
    alert('Creating system backup...');
}

function exportData() {
    alert('Exporting system data...');
}

function saveSettings() {
    alert('Settings saved successfully!');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        alert('Settings reset to default values');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Simulate logout
        window.location.href = 'templates/login.html';
    }
}

// Export functions for global access
window.coffeeDashboard = {
    loadDashboardData,
    updateDashboardStats,
    logout,
    loadSectionData
};