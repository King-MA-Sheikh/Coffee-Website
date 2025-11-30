<?php
// dashboard.php
session_start();

// Strict admin-only access
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: templates/login.html');
    exit;
}

// Only allow admin users with specific user_type
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    // Clear session and redirect to login
    session_destroy();
    header('Location: templates/login.html');
    exit;
}

// Prevent access if not admin
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    session_destroy();
    header('Location: templates/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ramanuj Cafe Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="static/coffee-dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <i class="fas fa-mug-hot"></i>
                </div>
                <div class="brand">Ramanuj Coffee Cafe</div>
            </div>
            
            <div class="sidebar-menu">
                <div class="menu-item active" data-target="dashboard">
                    <i class="fas fa-chart-pie"></i>
                    <span>Dashboard</span>
                </div>
                <div class="menu-item" data-target="orders">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Orders</span>
                    <span class="notification-badge">5</span>
                </div>
                <div class="menu-item" data-target="menu">
                    <i class="fas fa-coffee"></i>
                    <span>Menu Items</span>
                </div>
                <div class="menu-item" data-target="inventory">
                    <i class="fas fa-boxes"></i>
                    <span>Inventory</span>
                </div>
                <div class="menu-item" data-target="customers">
                    <i class="fas fa-users"></i>
                    <span>Customers</span>
                </div>
                <div class="menu-item" data-target="analytics">
                    <i class="fas fa-chart-line"></i>
                    <span>Analytics</span>
                </div>
                <div class="menu-item" data-target="settings">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </div>
            </div>
            
            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name"><?php echo $_SESSION['username']; ?></div>
                        <div class="user-role">Coffee Manager</div>
                    </div>
                </div>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <!-- Header -->
            <div class="header">
                <div class="header-left">
                    <div class="menu-toggle">
                        <i class="fas fa-bars"></i>
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search orders, customers...">
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-actions">
                        <div class="notification-icon">
                            <i class="fas fa-bell"></i>
                            <span class="notification-badge">3</span>
                        </div>
                        <div class="user-menu">
                            <div class="user-avatar small">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dashboard Content -->
            <div class="content-area">
                <!-- Dashboard Overview -->
                <div class="content-section active" id="dashboard">
                    <div class="section-header">
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back, <?php echo $_SESSION['username']; ?>! Here's what's happening today.</p>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #8B4513, #D2691E);">
                                <i class="fas fa-coffee"></i>
                            </div>
                            <div class="stat-info">
                                <h3>245</h3>
                                <p>Cups Sold Today</p>
                            </div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                12%
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #4CAF50, #45a049);">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-info">
                                <h3>$1,245</h3>
                                <p>Today's Revenue</p>
                            </div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                8%
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #2196F3, #1976D2);">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <h3>89</h3>
                                <p>New Customers</p>
                            </div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                5%
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #FF9800, #F57C00);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-info">
                                <h3>12 min</h3>
                                <p>Avg. Wait Time</p>
                            </div>
                            <div class="stat-trend down">
                                <i class="fas fa-arrow-down"></i>
                                3%
                            </div>
                        </div>
                    </div>
                    
                    <!-- Charts and Recent Activity -->
                    <div class="content-grid">
                        <div class="chart-container">
                            <div class="chart-header">
                                <h3>Sales Overview</h3>
                                <select class="time-filter">
                                    <option>Today</option>
                                    <option>This Week</option>
                                    <option>This Month</option>
                                </select>
                            </div>
                            <div class="chart-placeholder">
                                <div class="chart-bars">
                                    <div class="bar" style="height: 60%;" data-value="60"></div>
                                    <div class="bar" style="height: 80%;" data-value="80"></div>
                                    <div class="bar" style="height: 45%;" data-value="45"></div>
                                    <div class="bar" style="height: 90%;" data-value="90"></div>
                                    <div class="bar" style="height: 70%;" data-value="70"></div>
                                    <div class="bar" style="height: 85%;" data-value="85"></div>
                                    <div class="bar" style="height: 65%;" data-value="65"></div>
                                </div>
                                <div class="chart-labels">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="recent-orders">
                            <div class="section-header">
                                <h3>Recent Orders</h3>
                                <a href="#" class="view-all">View All</a>
                            </div>
                            <div class="orders-list">
                                <div class="order-item">
                                    <div class="order-info">
                                        <div class="order-id">#ORD-0012</div>
                                        <div class="order-items">Espresso ×2, Croissant</div>
                                        <div class="order-time">2 minutes ago</div>
                                    </div>
                                    <div class="order-status completed">Completed</div>
                                    <div class="order-price">$14.50</div>
                                </div>
                                
                                <div class="order-item">
                                    <div class="order-info">
                                        <div class="order-id">#ORD-0011</div>
                                        <div class="order-items">Cappuccino, Latte, Muffin</div>
                                        <div class="order-time">5 minutes ago</div>
                                    </div>
                                    <div class="order-status preparing">Preparing</div>
                                    <div class="order-price">$18.75</div>
                                </div>
                                
                                <div class="order-item">
                                    <div class="order-info">
                                        <div class="order-id">#ORD-0010</div>
                                        <div class="order-items">Americano, Tea, Sandwich</div>
                                        <div class="order-time">8 minutes ago</div>
                                    </div>
                                    <div class="order-status pending">Pending</div>
                                    <div class="order-price">$22.30</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Popular Items -->
                    <div class="popular-items">
                        <div class="section-header">
                            <h3>Popular Items</h3>
                        </div>
                        <div class="items-grid">
                            <div class="item-card">
                                <div class="item-image" style="background: linear-gradient(135deg, #8B4513, #A0522D);">
                                    <i class="fas fa-coffee"></i>
                                </div>
                                <div class="item-info">
                                    <h4>Espresso</h4>
                                    <p>89 sold today</p>
                                </div>
                                <div class="item-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.8</span>
                                </div>
                            </div>
                            
                            <div class="item-card">
                                <div class="item-image" style="background: linear-gradient(135deg, #D2691E, #CD853F);">
                                    <i class="fas fa-mug-hot"></i>
                                </div>
                                <div class="item-info">
                                    <h4>Cappuccino</h4>
                                    <p>67 sold today</p>
                                </div>
                                <div class="item-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.9</span>
                                </div>
                            </div>
                            
                            <div class="item-card">
                                <div class="item-image" style="background: linear-gradient(135deg, #A0522D, #DEB887);">
                                    <i class="fas fa-mug-hot"></i>
                                </div>
                                <div class="item-info">
                                    <h4>Latte</h4>
                                    <p>54 sold today</p>
                                </div>
                                <div class="item-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Orders Section -->
                <div class="content-section" id="orders">
                    <div class="section-header">
                        <h1>Orders Management</h1>
                        <p>Manage and track all customer orders</p>
                    </div>
                    <!-- Orders content would go here -->
                </div>
                
                <!-- Menu Items Section -->
                <div class="content-section" id="menu">
                    <div class="section-header">
                        <h1>Menu Items</h1>
                        <p>Manage your coffee shop menu and offerings</p>
                        <button class="btn btn-primary" onclick="openAddMenuItemModal()">
                            <i class="fas fa-plus"></i> Add New Item
                        </button>
                    </div>
                    
                    <!-- Menu Filters -->
                    <div class="filters-bar">
                        <div class="filter-group">
                            <label>Category:</label>
                            <select id="categoryFilter" onchange="filterMenuItems()">
                                <option value="all">All Categories</option>
                                <option value="coffee">Coffee</option>
                                <option value="tea">Tea</option>
                                <option value="pastry">Pastry</option>
                                <option value="sandwich">Sandwiches</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Status:</label>
                            <select id="statusFilter" onchange="filterMenuItems()">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="search-filter">
                            <input type="text" id="menuSearch" placeholder="Search menu items..." onkeyup="filterMenuItems()">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    
                    <!-- Menu Items Grid -->
                    <div class="menu-items-grid" id="menuItemsContainer">
                        <!-- Menu items will be loaded dynamically -->
                    </div>
                </div>
                
                <!-- Inventory Section -->
                <div class="content-section" id="inventory">
                    <div class="section-header">
                        <h1>Inventory Management</h1>
                        <p>Monitor stock levels and manage supplies</p>
                        <button class="btn btn-primary" onclick="openAddInventoryModal()">
                            <i class="fas fa-plus"></i> Add Stock
                        </button>
                    </div>
                    
                    <!-- Inventory Stats -->
                    <div class="inventory-stats">
                        <div class="inventory-stat">
                            <h3 id="totalItems">0</h3>
                            <p>Total Items</p>
                        </div>
                        <div class="inventory-stat warning">
                            <h3 id="lowStockItems">0</h3>
                            <p>Low Stock</p>
                        </div>
                        <div class="inventory-stat danger">
                            <h3 id="outOfStockItems">0</h3>
                            <p>Out of Stock</p>
                        </div>
                        <div class="inventory-stat">
                            <h3 id="inventoryValue">$0</h3>
                            <p>Total Value</p>
                        </div>
                    </div>
                    
                    <!-- Inventory Table -->
                    <div class="inventory-table-container">
                        <div class="table-actions">
                            <button class="btn btn-outline" onclick="exportInventory()">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn btn-outline" onclick="generateStockReport()">
                                <i class="fas fa-chart-bar"></i> Stock Report
                            </button>
                        </div>
                        <div class="inventory-table">
                            <div class="table-header">
                                <div>Item Name</div>
                                <div>Category</div>
                                <div>Current Stock</div>
                                <div>Min Stock</div>
                                <div>Unit Price</div>
                                <div>Status</div>
                                <div>Actions</div>
                            </div>
                            <div id="inventoryTableBody">
                                <!-- Inventory items will be loaded dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Customers Section -->
                <div class="content-section" id="customers">
                    <div class="section-header">
                        <h1>Customer Management</h1>
                        <p>Manage customer relationships and loyalty programs</p>
                        <button class="btn btn-primary" onclick="openAddCustomerModal()">
                            <i class="fas fa-user-plus"></i> Add Customer
                        </button>
                    </div>
                    
                    <!-- Customer Stats -->
                    <div class="customer-stats-grid">
                        <div class="customer-stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-content">
                                <h3 id="totalCustomers">0</h3>
                                <p>Total Customers</p>
                            </div>
                        </div>
                        <div class="customer-stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-crown"></i>
                            </div>
                            <div class="stat-content">
                                <h3 id="vipCustomers">0</h3>
                                <p>VIP Customers</p>
                            </div>
                        </div>
                        <div class="customer-stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="stat-content">
                                <h3 id="avgRating">0.0</h3>
                                <p>Average Rating</p>
                            </div>
                        </div>
                        <div class="customer-stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="stat-content">
                                <h3 id="totalLoyaltyPoints">0</h3>
                                <p>Loyalty Points</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Customers Grid -->
                    <div class="customers-grid" id="customersContainer">
                        <!-- Customers will be loaded dynamically -->
                    </div>
                </div>
                
                <!-- Analytics Section -->
                <div class="content-section" id="analytics">
                    <div class="section-header">
                        <h1>Business Analytics</h1>
                        <p>Deep insights into your coffee shop performance</p>
                        <div class="date-range-selector">
                            <select id="analyticsPeriod" onchange="loadAnalyticsData()">
                                <option value="7d">Last 7 Days</option>
                                <option value="30d" selected>Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Analytics Charts Grid -->
                    <div class="analytics-grid">
                        <div class="analytics-card large">
                            <div class="chart-header">
                                <h3>Revenue Trend</h3>
                                <div class="revenue-stats">
                                    <span class="revenue-change up" id="revenueChange">+12%</span>
                                </div>
                            </div>
                            <div class="chart-container-analytics">
                                <canvas id="revenueChart"></canvas>
                            </div>
                        </div>
                        
                        <div class="analytics-card">
                            <h3>Top Selling Items</h3>
                            <div class="top-items-list" id="topItemsList">
                                <!-- Top items will be loaded dynamically -->
                            </div>
                        </div>
                        
                        <div class="analytics-card">
                            <h3>Customer Demographics</h3>
                            <div class="chart-container-analytics">
                                <canvas id="demographicsChart"></canvas>
                            </div>
                        </div>
                        
                        <div class="analytics-card">
                            <h3>Peak Hours</h3>
                            <div class="peak-hours-chart">
                                <div class="hour-bars" id="peakHoursChart">
                                    <!-- Peak hours will be loaded dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Performance Metrics -->
                    <div class="performance-metrics">
                        <h3>Performance Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value" id="conversionRate">0%</div>
                                <div class="metric-label">Conversion Rate</div>
                                <div class="metric-trend up">+5%</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value" id="avgOrderValue">$0.00</div>
                                <div class="metric-label">Avg Order Value</div>
                                <div class="metric-trend up">+8%</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value" id="customerRetention">0%</div>
                                <div class="metric-label">Customer Retention</div>
                                <div class="metric-trend down">-2%</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value" id="tableTurnover">0</div>
                                <div class="metric-label">Table Turnover</div>
                                <div class="metric-trend up">+3%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Settings Section -->
                <div class="content-section" id="settings">
                    <div class="section-header">
                        <h1>System Settings</h1>
                        <p>Configure your coffee shop management system</p>
                    </div>
                    
                    <div class="settings-grid">
                        <!-- Shop Settings -->
                        <div class="settings-card">
                            <h3><i class="fas fa-store"></i> Shop Settings</h3>
                            <div class="form-group">
                                <label for="shopName">Shop Name</label>
                                <input type="text" id="shopName" class="form-control" value="Ramnauj Coffee">
                            </div>
                            <div class="form-group">
                                <label for="shopAddress">Address</label>
                                <textarea id="shopAddress" class="form-control" rows="3">271001 Chowk Market, Gonda City</textarea>
                            </div>
                            <div class="form-group">
                                <label for="shopPhone">Phone Number</label>
                                <input type="text" id="shopPhone" class="form-control" value="+91 6387951614">
                            </div>
                            <div class="form-group">
                                <label for="businessHours">Business Hours</label>
                                <input type="text" id="businessHours" class="form-control" value="Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-11PM">
                            </div>
                        </div>
                        
                        <!-- System Preferences -->
                        <div class="settings-card">
                            <h3><i class="fas fa-sliders-h"></i> System Preferences</h3>
                            <div class="toggle-group">
                                <div class="toggle-item">
                                    <span>Enable Notifications</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="toggle-item">
                                    <span>Auto Stock Alerts</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="toggle-item">
                                    <span>Loyalty Program</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="toggle-item">
                                    <span>Online Orders</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="currency">Currency</label>
                                <select id="currency" class="form-control">
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="timezone">Timezone</label>
                                <select id="timezone" class="form-control">
                                    <option>UTC-5 (EST)</option>
                                    <option>UTC-8 (PST)</option>
                                    <option>UTC+0 (GMT)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Security Settings -->
                        <div class="settings-card">
                            <h3><i class="fas fa-shield-alt"></i> Security</h3>
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input type="password" id="currentPassword" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" class="form-control">
                            </div>
                            <div class="toggle-item">
                                <span>Two-Factor Authentication</span>
                                <label class="toggle-switch">
                                    <input type="checkbox">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Backup & Export -->
                        <div class="settings-card">
                            <h3><i class="fas fa-database"></i> Data Management</h3>
                            <div class="backup-actions">
                                <button class="btn btn-outline" onclick="createBackup()">
                                    <i class="fas fa-save"></i> Create Backup
                                </button>
                                <button class="btn btn-outline" onclick="exportData()">
                                    <i class="fas fa-download"></i> Export Data
                                </button>
                            </div>
                            <div class="form-group">
                                <label for="autoBackup">Auto Backup Frequency</label>
                                <select id="autoBackup" class="form-control">
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                    <option>Never</option>
                                </select>
                            </div>
                            <div class="system-info">
                                <h4>System Information</h4>
                                <div class="info-item">
                                    <span>Version:</span>
                                    <span>2.1.0</span>
                                </div>
                                <div class="info-item">
                                    <span>Last Backup:</span>
                                    <span>2024-01-15 14:30</span>
                                </div>
                                <div class="info-item">
                                    <span>Database Size:</span>
                                    <span>45.2 MB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Settings Actions -->
                    <div class="settings-actions">
                        <button class="btn btn-success" onclick="saveSettings()">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button class="btn btn-outline" onclick="resetSettings()">
                            <i class="fas fa-undo"></i> Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals will be added here by JavaScript -->

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="static/coffee-dashboard.js"></script>
</body>
</html>