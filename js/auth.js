// User data storage
const USERS_KEY = 'fuel_express_users';
const CURRENT_USER_KEY = 'fuel_express_current_user';

// Initialize users if not exists
if (!localStorage.getItem(USERS_KEY)) {
    // Create default admin user
    const defaultUsers = [
        {
            fullName: 'Admin User',
            email: 'admin@fuelexpress.com',
            username: 'admin',
            password: 'admin123', // In a real app, this would be hashed
            role: 'admin',
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
}

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUser) {
        // Show login overlay
        document.getElementById('login-overlay').style.display = 'flex';
    } else {
        // Hide login overlay
        document.getElementById('login-overlay').style.display = 'none';
        
        // Update UI with user info
        updateUIWithUserInfo(JSON.parse(currentUser));
    }
}

// Update UI with user info
function updateUIWithUserInfo(user) {
    // You can customize this function to update UI elements with user info
    console.log('Logged in as:', user.username);
    
    // For example, you might want to add a user menu in the header
    const header = document.querySelector('header');
    
    // Check if user menu already exists
    if (!document.getElementById('user-menu')) {
        const userMenu = document.createElement('div');
        userMenu.id = 'user-menu';
        userMenu.className = 'user-menu';
        
        // Different menu for admin vs regular users
        if (user.role === 'admin') {
            userMenu.innerHTML = `
                <div class="user-info">
                    <i class="fas fa-user-shield"></i>
                    <span class="user-greeting">Administrator: ${user.fullName}</span>
                </div>
                <div class="user-actions">
                    <button id="admin-panel-button" class="menu-button">
                        <i class="fas fa-cogs"></i> Admin Panel
                    </button>
                    <button id="manage-users-button" class="menu-button">
                        <i class="fas fa-users-cog"></i> Manage Users
                    </button>
                    <button id="logout-button" class="menu-button logout-button">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <span class="user-greeting">Welcome, ${user.fullName}</span>
                </div>
                <div class="user-actions">
                    <button id="profile-button" class="menu-button">
                        <i class="fas fa-user-edit"></i> My Profile
                    </button>
                    <button id="logout-button" class="menu-button logout-button">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        }
        
        header.appendChild(userMenu);
        
        // Add CSS for the user menu
        const style = document.createElement('style');
        style.textContent = `
            .user-menu {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 10px;
                right: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 10px;
                z-index: 100;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .user-info i {
                margin-right: 8px;
                color: #4CAF50;
            }
            
            .user-greeting {
                font-weight: 500;
                color: #333;
            }
            
            .user-actions {
                display: flex;
                flex-direction: column;
            }
            
            .menu-button {
                display: flex;
                align-items: center;
                background: none;
                border: none;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.3s;
                text-align: left;
                color: #333;
            }
            
            .menu-button:hover {
                background-color: #f5f5f5;
            }
            
            .menu-button i {
                margin-right: 8px;
                width: 16px;
                text-align: center;
            }
            
            .logout-button {
                margin-top: 5px;
                color: #f44336;
            }
            
            .logout-button:hover {
                background-color: #ffebee;
            }
            
            @media (max-width: 768px) {
                .user-menu {
                    position: static;
                    margin-top: 10px;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        document.getElementById('logout-button').addEventListener('click', logout);
        
        if (user.role === 'admin') {
            document.getElementById('admin-panel-button').addEventListener('click', openAdminPanel);
            document.getElementById('manage-users-button').addEventListener('click', openUserManagement);
        } else {
            document.getElementById('profile-button').addEventListener('click', openUserProfile);
        }
    }
}

// Admin Panel
function openAdminPanel() {
    // Create modal for admin panel
    const adminPanelModal = document.createElement('div');
    adminPanelModal.className = 'modal';
    adminPanelModal.id = 'admin-panel-modal';
    
    adminPanelModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Admin Control Panel</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="admin-section">
                    <h3>System Settings</h3>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" id="company-name" value="Fuel Express Pvt. Ltd.">
                    </div>
                    <div class="form-group">
                        <label>System Theme</label>
                        <select id="system-theme">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="blue">Blue</option>
                        </select>
                    </div>
                    <button id="save-settings" class="admin-button">Save Settings</button>
                </div>
                
                <div class="admin-section">
                    <h3>Reset User Password</h3>
                    <div class="form-group">
                        <label>Select User</label>
                        <select id="reset-user">
                            <!-- Users will be loaded here -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="new-password">
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="confirm-password">
                    </div>
                    <button id="reset-password" class="admin-button">Reset Password</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(adminPanelModal);
    
    // Add CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 0;
            width: 60%;
            max-width: 700px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: modalopen 0.3s;
        }
        
        @keyframes modalopen {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: #4CAF50;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 20px;
        }
        
        .close-modal {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .modal-body {
            padding: 20px;
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .admin-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .admin-section h3 {
            margin-top: 0;
            color: #333;
        }
        
        .admin-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .admin-button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);
    
    // Load users for password reset
    const resetUserSelect = document.getElementById('reset-user');
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.fullName} (${user.username})`;
        resetUserSelect.appendChild(option);
    });
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('admin-panel-modal').remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminPanelModal) {
            adminPanelModal.remove();
        }
    });
    
    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => {
        alert('Settings saved successfully!');
    });
    
    // Reset password
    document.getElementById('reset-password').addEventListener('click', () => {
        const username = document.getElementById('reset-user').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!newPassword || !confirmPassword) {
            alert('Please enter both password fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Reset the password
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            alert(`Password for ${users[userIndex].fullName} has been reset successfully`);
            
            // Clear the form
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }
    });
}

// User Management
function openUserManagement() {
    // Create modal for user management
    const userManagementModal = document.createElement('div');
    userManagementModal.className = 'modal';
    userManagementModal.id = 'user-management-modal';
    
    userManagementModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>User Management</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="user-list-container">
                    <h3>All Users</h3>
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="user-list">
                            <!-- Users will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(userManagementModal);
    
    // Add CSS for the user table
    const style = document.createElement('style');
    style.textContent = `
        .user-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .user-table th, .user-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .user-table th {
            background-color: #f5f5f5;
            font-weight: 500;
        }
        
        .user-table tr:hover {
            background-color: #f9f9f9;
        }
        
        .user-action-btn {
            background: none;
            border: none;
            cursor: pointer;
            margin-right: 5px;
            color: #2196F3;
        }
        
        .user-delete-btn {
            color: #F44336;
        }
    `;
    document.head.appendChild(style);
    
    // Load users
    const userList = document.getElementById('user-list');
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="user-action-btn user-edit-btn" data-username="${user.username}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="user-action-btn user-delete-btn" data-username="${user.username}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        userList.appendChild(row);
    });
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('user-management-modal').remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === userManagementModal) {
            userManagementModal.remove();
        }
    });
    
    // Edit user
    const editButtons = document.querySelectorAll('.user-edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const username = button.dataset.username;
            alert(`Edit user: ${username}`);
            // Implement edit user functionality
        });
    });
    
    // Delete user
    const deleteButtons = document.querySelectorAll('.user-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const username = button.dataset.username;
            if (confirm(`Are you sure you want to delete user: ${username}?`)) {
                // Don't allow deleting the last admin
                const users = JSON.parse(localStorage.getItem(USERS_KEY));
                const adminUsers = users.filter(u => u.role === 'admin');
                
                if (adminUsers.length === 1 && adminUsers[0].username === username) {
                    alert('Cannot delete the last admin user');
                    return;
                }
                
                // Delete the user
                const updatedUsers = users.filter(u => u.username !== username);
                localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
                
                // Refresh the user list
                button.closest('tr').remove();
                
                alert(`User ${username} has been deleted`);
            }
        });
    });
}

// User Profile
function openUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    
    // Create modal for user profile
    const profileModal = document.createElement('div');
    profileModal.className = 'modal';
    profileModal.id = 'profile-modal';
    
    profileModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>My Profile</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="profile-section">
                    <h3>Personal Information</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="profile-fullname" value="${currentUser.fullName}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="profile-email" value="${currentUser.email}">
                    </div>
                    <button id="update-profile" class="admin-button">Update Profile</button>
                </div>
                
                <div class="profile-section">
                    <h3>Change Password</h3>
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" id="current-password">
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="profile-new-password">
                    </div>
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" id="profile-confirm-password">
                    </div>
                    <button id="change-password" class="admin-button">Change Password</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(profileModal);
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('profile-modal').remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.remove();
        }
    });
    
    // Update profile
    document.getElementById('update-profile').addEventListener('click', () => {
        const fullName = document.getElementById('profile-fullname').value;
        const email = document.getElementById('profile-email').value;
        
        if (!fullName || !email) {
            alert('Please fill in all fields');
            return;
        }
        
        // Update user in storage
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].fullName = fullName;
            users[userIndex].email = email;
            
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            
            // Update current user
            currentUser.fullName = fullName;
            currentUser.email = email;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
            
            // Update UI
            document.querySelector('.user-greeting').textContent = `Welcome, ${fullName}`;
            
            alert('Profile updated successfully');
        }
    });
    
    // Change password
    document.getElementById('change-password').addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('profile-new-password').value;
        const confirmPassword = document.getElementById('profile-confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        
        // Verify current password
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const user = users.find(u => u.username === currentUser.username);
        
        if (user.password !== currentPassword) {
            alert('Current password is incorrect');
            return;
        }
        
        // Update password
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        users[userIndex].password = newPassword;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current user
        currentUser.password = newPassword;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('profile-new-password').value = '';
        document.getElementById('profile-confirm-password').value = '';
        
        alert('Password changed successfully');
    });
}

// Login function
function login(username, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        
        // Update UI
        document.getElementById('login-overlay').style.display = 'none';
        updateUIWithUserInfo(user);
        
        return true;
    }
    
    return false;
}

// Signup function
function signup(fullName, email, username, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
        fullName,
        email,
        username,
        password, // In a real app, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Log in the new user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return { success: true };
}

// Logout function
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    location.reload();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    checkAuth();
    
    // Tab switching
    const loginTabs = document.querySelectorAll('.login-tab');
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            loginTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const formId = tab.dataset.tab + '-form';
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Login form submission
    document.getElementById('login-button').addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        const success = login(username, password);
        if (!success) {
            alert('Invalid username or password');
        }
    });
    
    // Signup form submission
    document.getElementById('signup-button').addEventListener('click', () => {
        const fullName = document.getElementById('signup-fullname').value;
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        // Validate inputs
        if (!fullName || !email || !username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Create account
        const result = signup(fullName, email, username, password);
        if (result.success) {
            alert('Account created successfully! You are now logged in.');
            document.getElementById('login-overlay').style.display = 'none';
            updateUIWithUserInfo({fullName, username, email});
        } else {
            alert(result.message);
        }
    });
    
    // Forgot password link
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please contact system administrator to reset your password.');
    });
});