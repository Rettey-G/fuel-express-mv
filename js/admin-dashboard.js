document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin dashboard
    initAdminDashboard();
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // User management functionality
    setupUserManagement();
    
    // Permissions management
    setupPermissionsManagement();
    
    // Activity log
    setupActivityLog();
    
    // Settings management
    setupSettingsManagement();
});

// Initialize the admin dashboard
function initAdminDashboard() {
    // Load user statistics
    updateUserStats();
    
    // Load users
    loadUsers();
}

// Update user statistics
function updateUserStats() {
    const users = getUsers();
    
    // Update counters
    document.getElementById('total-users-count').textContent = users.length;
    document.getElementById('admin-users-count').textContent = users.filter(user => user.role === 'admin').length;
    document.getElementById('regular-users-count').textContent = users.filter(user => user.role === 'user').length;
    
    // For demo purposes, set active users to a random number between 1 and total users
    const activeUsers = Math.floor(Math.random() * users.length) + 1;
    document.getElementById('active-users-count').textContent = activeUsers;
}

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('fuel_express_users', JSON.stringify(users));
    updateUserStats();
}

// Load users into the user table
function loadUsers() {
    const users = getUsers();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    
    if (users.length === 0) {
        userList.innerHTML = '<tr><td colspan="9" class="text-center">No users found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-username', user.username);
        
        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" data-username="${user.username}"></td>
            <td>${user.id || '-'}</td>
            <td>${user.username}</td>
            <td>${user.fullname || '-'}</td>
            <td>${user.email || '-'}</td>
            <td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'Administrator' : 'Regular User'}</span></td>
            <td><span class="status ${user.status || 'active'}">${user.status === 'inactive' ? 'Inactive' : 'Active'}</span></td>
            <td>${user.lastLogin || 'Never'}</td>
            <td class="actions">
                <button class="action-btn edit" title="Edit User" data-username="${user.username}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" title="Delete User" data-username="${user.username}"><i class="fas fa-trash"></i></button>
                <button class="action-btn view" title="View Details" data-username="${user.username}"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        userList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addUserActionListeners();
}

// Add event listeners to user action buttons
function addUserActionListeners() {
    // Edit buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            editUser(username);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            if (confirm(`Are you sure you want to delete user "${username}"?`)) {
                deleteUser(username);
            }
        });
    });
    
    // View buttons
    document.querySelectorAll('.action-btn.view').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            viewUserDetails(username);
        });
    });
    
    // Checkboxes
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedUsersButtons);
    });
    
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('select-all-users');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            document.querySelectorAll('.user-checkbox').forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSelectedUsersButtons();
        });
    }
}

// Update buttons based on selected users
function updateSelectedUsersButtons() {
    const selectedUsers = document.querySelectorAll('.user-checkbox:checked');
    const editBtn = document.getElementById('edit-user-btn');
    const removeBtn = document.getElementById('remove-user-btn');
    
    if (selectedUsers.length === 1) {
        editBtn.disabled = false;
        removeBtn.disabled = false;
    } else if (selectedUsers.length > 1) {
        editBtn.disabled = true;
        removeBtn.disabled = false;
    } else {
        editBtn.disabled = true;
        removeBtn.disabled = true;
    }
}

// View user details
function viewUserDetails(username) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) return;
    
    // Update user details section
    document.getElementById('detail-username').textContent = user.username;
    document.getElementById('detail-fullname').textContent = user.fullname || '-';
    document.getElementById('detail-email').textContent = user.email || '-';
    document.getElementById('detail-role').textContent = user.role === 'admin' ? 'Administrator' : 'Regular User';
    document.getElementById('detail-status').textContent = user.status === 'inactive' ? 'Inactive' : 'Active';
    document.getElementById('detail-created').textContent = user.createdAt || '-';
    document.getElementById('detail-last-login').textContent = user.lastLogin || 'Never';
    
    // Update toggle status button
    const toggleStatusBtn = document.getElementById('toggle-status-btn');
    const toggleStatusText = document.getElementById('toggle-status-text');
    
    if (user.status === 'inactive') {
        toggleStatusText.textContent = 'Activate';
        toggleStatusBtn.classList.remove('danger');
        toggleStatusBtn.classList.add('primary');
    } else {
        toggleStatusText.textContent = 'Deactivate';
        toggleStatusBtn.classList.remove('primary');
        toggleStatusBtn.classList.add('danger');
    }
    
    // Show user details section
    document.getElementById('user-details').classList.remove('hidden');
    
    // Set up toggle status button
    toggleStatusBtn.onclick = function() {
        toggleUserStatus(username);
    };
    
    // Set up reset password button
    document.getElementById('reset-password-btn').onclick = function() {
        showResetPasswordForm(username);
    };
    
    // Set up view permissions button
    document.getElementById('view-permissions-btn').onclick = function() {
        // Switch to permissions tab and select this user's role
        document.querySelector('.tab-btn[data-tab="permissions-tab"]').click();
        document.getElementById('select-role').value = user.role;
        loadPermissions(user.role);
    };
}

// Toggle user status
function toggleUserStatus(username) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) return;
    
    // Toggle status
    users[userIndex].status = users[userIndex].status === 'inactive' ? 'active' : 'inactive';
    
    // Save users
    saveUsers(users);
    
    // Reload users
    loadUsers();
    
    // Update user details
    viewUserDetails(username);
}

// Show reset password form
function showResetPasswordForm(username) {
    // Set username in form
    document.getElementById('reset-user').value = username;
    
    // Clear password fields
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    // Clear error messages
    document.getElementById('new-password-error').textContent = '';
    document.getElementById('confirm-new-password-error').textContent = '';
    
    // Show form
    document.getElementById('reset-password-form').classList.remove('hidden');
    document.getElementById('user-details').classList.add('hidden');
    
    // Set up cancel button
    document.getElementById('cancel-reset-password').onclick = function() {
        document.getElementById('reset-password-form').classList.add('hidden');
        document.getElementById('user-details').classList.remove('hidden');
    };
    
    // Set up submit button
    document.getElementById('submit-reset-password').onclick = function() {
        resetPassword();
    };
}

// Reset password
function resetPassword() {
    const username = document.getElementById('reset-user').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    let isValid = true;
    
    if (!newPassword) {
        document.getElementById('new-password-error').textContent = 'Password is required';
        isValid = false;
    } else if (newPassword.length < 6) {
        document.getElementById('new-password-error').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    if (!confirmPassword) {
        document.getElementById('confirm-new-password-error').textContent = 'Please confirm your password';
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Update user password
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) return;
    
    users[userIndex].password = newPassword;
    
    // Save users
    saveUsers(users);
    
    // Show success message
    alert(`Password for user "${username}" has been reset successfully.`);
    
    // Hide form and show user details
    document.getElementById('reset-password-form').classList.add('hidden');
    document.getElementById('user-details').classList.remove('hidden');
}

// Setup user management
function setupUserManagement() {
    // Add user button
    document.getElementById('add-user-btn').addEventListener('click', function() {
        showUserForm('add');
    });
    
    // Edit user button
    document.getElementById('edit-user-btn').addEventListener('click', function() {
        const selectedUser = document.querySelector('.user-checkbox:checked');
        if (selectedUser) {
            const username = selectedUser.getAttribute('data-username');
            editUser(username);
        }
    });
    
    // Remove user button
    document.getElementById('remove-user-btn').addEventListener('click', function() {
        const selectedUsers = document.querySelectorAll('.user-checkbox:checked');
        if (selectedUsers.length > 0) {
            const usernames = Array.from(selectedUsers).map(checkbox => checkbox.getAttribute('data-username'));
            if (confirm(`Are you sure you want to delete ${usernames.length} user(s)?`)) {
                usernames.forEach(username => deleteUser(username));
            }
        }
    });
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', function() {
        filterUsers();
    });
    
    document.getElementById('user-search').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterUsers();
        }
    });
    
    // Role filter
    document.getElementById('role-filter').addEventListener('change', filterUsers);
    
    // Status filter
    document.getElementById('status-filter').addEventListener('change', filterUsers);
    
    // Clear filters
    document.getElementById('clear-filters').addEventListener('click', function() {
        document.getElementById('user-search').value = '';
        document.getElementById('role-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        loadUsers();
    });
    
    // Toggle password visibility
    document.getElementById('toggle-password').addEventListener('click', function() {
        togglePasswordVisibility('user-password', 'toggle-password');
    });
    
    document.getElementById('toggle-new-password').addEventListener('click', function() {
        togglePasswordVisibility('new-password', 'toggle-new-password');
    });
    
    // Cancel user form
    document.getElementById('cancel-user-form').addEventListener('click', function() {
        document.getElementById('user-form').classList.add('hidden');
    });
    
    // Submit user form
    document.getElementById('submit-user-form').addEventListener('click', function() {
        submitUserForm();
    });
}

// Show user form for add or edit
function showUserForm(mode, username = null) {
    // Set form title
    document.getElementById('form-title').textContent = mode === 'add' ? 'Add New User' : 'Edit User';
    
    // Clear form
    document.getElementById('user-username').value = '';
    document.getElementById('user-fullname').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-confirm-password').value = '';
    document.getElementById('user-role').value = 'user';
    document.getElementById('user-status').value = 'active';
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Set module access checkboxes
    document.getElementById('access-dashboard').checked = true;
    document.getElementById('access-employees').checked = false;
    document.getElementById('access-attendance').checked = false;
    document.getElementById('access-leave').checked = false;
    document.getElementById('access-payroll').checked = false;
    document.getElementById('access-recruitment').checked = false;
    document.getElementById('access-reports').checked = false;
    
    // If editing, populate form with user data
    if (mode === 'edit' && username) {
        const users = getUsers();
        const user = users.find(u => u.username === username);
        
        if (user) {
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-username').readOnly = true;
            document.getElementById('user-fullname').value = user.fullname || '';
            document.getElementById('user-email').value = user.email || '';
            document.getElementById('user-password').value = '';
            document.getElementById('user-confirm-password').value = '';
            document.getElementById('user-role').value = user.role || 'user';
            document.getElementById('user-status').value = user.status || 'active';
            
            // Set module access
            if (user.access) {
                document.getElementById('access-employees').checked = user.access.employees || false;
                document.getElementById('access-attendance').checked = user.access.attendance || false;
                document.getElementById('access-leave').checked = user.access.leave || false;
                document.getElementById('access-payroll').checked = user.access.payroll || false;
                document.getElementById('access-recruitment').checked = user.access.recruitment || false;
                document.getElementById('access-reports').checked = user.access.reports || false;
            }
        }
    }
    
    // Show form
    document.getElementById('user-form').classList.remove('hidden');
    document.getElementById('user-details').classList.add('hidden');
}

// Submit user form
function submitUserForm() {
    const username = document.getElementById('user-username').value;
    const fullname = document.getElementById('user-fullname').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const confirmPassword = document.getElementById('user-confirm-password').value;
    const role = document.getElementById('user-role').value;
    const status = document.getElementById('user-status').value;
    
    // Validate form
    let isValid = true;
    
    if (!username) {
        document.getElementById('username-error').textContent = 'Username is required';
        isValid = false;
    }
    
    if (!fullname) {
        document.getElementById('fullname-error').textContent = 'Full name is required';
        isValid = false;
    }
    
    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Check if username is readonly (editing) or not (adding)
    const isEditing = document.getElementById('user-username').readOnly;
    
    if (!isEditing) {
        // Adding new user, password is required
        if (!password) {
            document.getElementById('password-error').textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        if (!confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            isValid = false;
        }
    } else {
        // Editing user, password is optional
        if (password && password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        if (password && password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            isValid = false;
        }
    }
    
    if (!isValid) return;
    
    // Get module access
    const access = {
        dashboard: true,
        employees: document.getElementById('access-employees').checked,
        attendance: document.getElementById('access-attendance').checked,
        leave: document.getElementById('access-leave').checked,
        payroll: document.getElementById('access-payroll').checked,
        recruitment: document.getElementById('access-recruitment').checked,
        reports: document.getElementById('access-reports').checked
    };
    
    // Get users
    const users = getUsers();
    
    if (isEditing) {
        // Update existing user
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) return;
        
        // Update user data
        users[userIndex].fullname = fullname;
        users[userIndex].email = email;
        users[userIndex].role = role;
        users[userIndex].status = status;
        users[userIndex].access = access;
        
        // Update password if provided
        if (password) {
            users[userIndex].password = password;
        }
    } else {
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            document.getElementById('username-error').textContent = 'Username already exists';
            return;
        }
        
        // Add new user
        users.push({
            id: 'EMP-' + (users.length + 1).toString().padStart(3, '0'),
            username,
            fullname,
            email,
            password,
            role,
            status,
            access,
            createdAt: new Date().toISOString(),
            lastLogin: null
        });
    }
    
    // Save users
    saveUsers(users);
    
    // Hide form
    document.getElementById('user-form').classList.add('hidden');
    
    // Reload users
    loadUsers();
    
    // Show success message
    alert(isEditing ? `User "${username}" has been updated successfully.` : `User "${username}" has been added successfully.`);
}

// Edit user
function editUser(username) {
    showUserForm('edit', username);
}

// Delete user
function deleteUser(username) {
    // Get users
    const users = getUsers();
    
    // Remove user
    const updatedUsers = users.filter(u => u.username !== username);
    
    // Save users
    saveUsers(updatedUsers);
    
    // Reload users
    loadUsers();
    
    // Hide user details if visible
    document.getElementById('user-details').classList.add('hidden');
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    const users = getUsers();
    const filteredUsers = users.filter(user => {
        // Search term filter
        const matchesSearch = 
            searchTerm === '' || 
            user.username.toLowerCase().includes(searchTerm) || 
            (user.fullname && user.fullname.toLowerCase().includes(searchTerm)) || 
            (user.email && user.email.toLowerCase().includes(searchTerm));
        
        // Role filter
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Update user list
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        userList.innerHTML = '<tr><td colspan="9" class="text-center">No users found</td></tr>';
        return;
    }
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-username', user.username);
        
        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" data-username="${user.username}"></td>
            <td>${user.id || '-'}</td>
            <td>${user.username}</td>
            <td>${user.fullname || '-'}</td>
            <td>${user.email || '-'}</td>
            <td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'Administrator' : 'Regular User'}</span></td>
            <td><span class="status ${user.status || 'active'}">${user.status === 'inactive' ? 'Inactive' : 'Active'}</span></td>
            <td>${user.lastLogin || 'Never'}</td>
            <td class="actions">
                <button class="action-btn edit" title="Edit User" data-username="${user.username}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" title="Delete User" data-username="${user.username}"><i class="fas fa-trash"></i></button>
                <button class="action-btn view" title="View Details" data-username="${user.username}"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        userList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addUserActionListeners();
}

// Toggle password visibility
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Setup permissions management
function setupPermissionsManagement() {
    // Load permissions when role changes
    document.getElementById('select-role').addEventListener('change', function() {
        loadPermissions(this.value);
    });
    
    // Save permissions button
    document.getElementById('save-permissions').addEventListener('click', savePermissions);
    
    // Load initial permissions
    loadPermissions('admin');
}

// Load permissions for a role
function loadPermissions(role) {
    const permissionsList = document.getElementById('permissions-list');
    permissionsList.innerHTML = '';
    
    // Define modules
    const modules = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'employees', name: 'Employees' },
        { id: 'attendance', name: 'Attendance' },
        { id: 'leave', name: 'Leave' },
        { id: 'payroll', name: 'Payroll' },
        { id: 'recruitment', name: 'Recruitment' },
        { id: 'reports', name: 'Reports' }
    ];
    
    // Get permissions from localStorage
    const permissions = JSON.parse(localStorage.getItem('fuel_express_permissions') || '{}');
    const rolePermissions = permissions[role] || {};
    
    // Create permission rows
    modules.forEach(module => {
        const row = document.createElement('tr');
        
        // Default permissions
        const defaultPermissions = {
            view: module.id === 'dashboard' || role === 'admin',
            create: role === 'admin',
            edit: role === 'admin',
            delete: role === 'admin'
        };
        
        // Get module permissions
        const modulePermissions = rolePermissions[module.id] || defaultPermissions;
        
        row.innerHTML = `
            <td>${module.name}</td>
            <td>
                <label class="checkbox-label">
                    <input type="checkbox" class="permission-checkbox" 
                           data-role="${role}" data-module="${module.id}" data-action="view"
                           ${modulePermissions.view ? 'checked' : ''} 
                           ${module.id === 'dashboard' ? 'disabled' : ''}>
                </label>
            </td>
            <td>
                <label class="checkbox-label">
                    <input type="checkbox" class="permission-checkbox" 
                           data-role="${role}" data-module="${module.id}" data-action="create"
                           ${modulePermissions.create ? 'checked' : ''}>
                </label>
            </td>
            <td>
                <label class="checkbox-label">
                    <input type="checkbox" class="permission-checkbox" 
                           data-role="${role}" data-module="${module.id}" data-action="edit"
                           ${modulePermissions.edit ? 'checked' : ''}>
                </label>
            </td>
            <td>
                <label class="checkbox-label">
                    <input type="checkbox" class="permission-checkbox" 
                           data-role="${role}" data-module="${module.id}" data-action="delete"
                           ${modulePermissions.delete ? 'checked' : ''}>
                </label>
            </td>
        `;
        
        permissionsList.appendChild(row);
    });
}

// Save permissions
function savePermissions() {
    const role = document.getElementById('select-role').value;
    
    // Get all permission checkboxes
    const checkboxes = document.querySelectorAll('.permission-checkbox');
    
    // Get permissions from localStorage
    const permissions = JSON.parse(localStorage.getItem('fuel_express_permissions') || '{}');
    
    // Initialize role permissions
    permissions[role] = {};
    
    // Process checkboxes
    checkboxes.forEach(checkbox => {
        const module = checkbox.getAttribute('data-module');
        const action = checkbox.getAttribute('data-action');
        
        // Initialize module permissions if not exists
        if (!permissions[role][module]) {
            permissions[role][module] = {};
        }
        
        // Set permission
        permissions[role][module][action] = checkbox.checked;
    });
    
    // Save permissions
    localStorage.setItem('fuel_express_permissions', JSON.stringify(permissions));
    
    // Show success message
    alert(`Permissions for ${role === 'admin' ? 'Administrator' : 'Regular User'} role have been saved successfully.`);
}

// Setup activity log
function setupActivityLog() {
    // Load initial activity log
    loadActivityLog();
    
    // Apply filters button
    document.getElementById('apply-activity-filters').addEventListener('click', loadActivityLog);
}

// Load activity log
function loadActivityLog() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    // Get filters
    const userFilter = document.getElementById('activity-user-filter').value;
    const typeFilter = document.getElementById('activity-type-filter').value;
    const dateFrom = document.getElementById('activity-date-from').value;
    const dateTo = document.getElementById('activity-date-to').value;
    
    // Get activity log from localStorage
    const activityLog = JSON.parse(localStorage.getItem('fuel_express_activity_log') || '[]');
    
    // If no activity, generate some sample data
    if (activityLog.length === 0) {
        generateSampleActivityLog();
        return loadActivityLog();
    }
    
    // Filter activity log
    const filteredLog = activityLog.filter(activity => {
        // User filter
        const matchesUser = userFilter === 'all' || activity.username === userFilter;
        
        // Type filter
        const matchesType = typeFilter === 'all' || activity.type === typeFilter;
        
        // Date filter
        let matchesDate = true;
        if (dateFrom) {
            matchesDate = matchesDate && new Date(activity.timestamp) >= new Date(dateFrom);
        }
        if (dateTo) {
            matchesDate = matchesDate && new Date(activity.timestamp) <= new Date(dateTo + 'T23:59:59');
        }
        
        return matchesUser && matchesType && matchesDate;
    });
    
    // Sort by timestamp (newest first)
    filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Populate activity log table
    if (filteredLog.length === 0) {
        activityList.innerHTML = '<tr><td colspan="5" class="text-center">No activity found</td></tr>';
        return;
    }
    
    filteredLog.forEach(activity => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(activity.timestamp);
        const formattedDate = date.toLocaleString();
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${activity.username}</td>
            <td>${formatActivityType(activity.type)}</td>
            <td>${activity.details}</td>
            <td>${activity.ipAddress || '127.0.0.1'}</td>
        `;
        
        activityList.appendChild(row);
    });
}

// Format activity type
function formatActivityType(type) {
    const types = {
        login: '<span class="activity-type login">Login</span>',
        logout: '<span class="activity-type logout">Logout</span>',
        create: '<span class="activity-type create">Create</span>',
        update: '<span class="activity-type update">Update</span>',
        delete: '<span class="activity-type delete">Delete</span>'
    };
    
    return types[type] || type;
}

// Generate sample activity log
function generateSampleActivityLog() {
    const users = getUsers();
    const activityTypes = ['login', 'logout', 'create', 'update', 'delete'];
    const activityLog = [];
    
    // Generate random activities
    for (let i = 0; i < 20; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        let details = '';
        switch (type) {
            case 'login':
                details = 'User logged in';
                break;
            case 'logout':
                details = 'User logged out';
                break;
            case 'create':
                details = 'Created a new employee record';
                break;
            case 'update':
                details = 'Updated employee information';
                break;
            case 'delete':
                details = 'Deleted an employee record';
                break;
        }
        
        // Random date in the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        activityLog.push({
            username: user.username,
            type,
            details,
            timestamp: date.toISOString(),
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_activity_log', JSON.stringify(activityLog));
}

// Setup settings management
function setupSettingsManagement() {
    // Save settings button
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    // Reset settings button
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
    
    // Load settings
    loadSettings();
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('fuel_express_settings') || '{}');
    
    // Set default values if not set
    document.getElementById('password-expiry').value = settings.passwordExpiry || 90;
    document.getElementById('min-password-length').value = settings.minPasswordLength || 8;
    document.getElementById('require-special-chars').checked = settings.requireSpecialChars !== false;
    document.getElementById('require-numbers').checked = settings.requireNumbers !== false;
    document.getElementById('max-login-attempts').value = settings.maxLoginAttempts || 5;
    document.getElementById('lockout-duration').value = settings.lockoutDuration || 30;
    document.getElementById('session-timeout').value = settings.sessionTimeout || 30;
    document.getElementById('remember-me-option').checked = settings.rememberMeOption !== false;
}

// Save settings
function saveSettings() {
    const settings = {
        passwordExpiry: parseInt(document.getElementById('password-expiry').value),
        minPasswordLength: parseInt(document.getElementById('min-password-length').value),
        requireSpecialChars: document.getElementById('require-special-chars').checked,
        requireNumbers: document.getElementById('require-numbers').checked,
        maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
        lockoutDuration: parseInt(document.getElementById('lockout-duration').value),
        sessionTimeout: parseInt(document.getElementById('session-timeout').value),
        rememberMeOption: document.getElementById('remember-me-option').checked
    };
    
    // Save to localStorage
    localStorage.setItem('fuel_express_settings', JSON.stringify(settings));
    
    // Show success message
    alert('Settings have been saved successfully.');
}

// Reset settings
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
        // Remove settings from localStorage
        localStorage.removeItem('fuel_express_settings');
        
        // Load default settings
        loadSettings();
        
        // Show success message
        alert('Settings have been reset to default values.');
    }
}