// Session Manager - Handles authentication across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Get current path to determine redirect
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.endsWith('index.html') || 
                           currentPath === '/' || 
                           currentPath.endsWith('/');
        
        // Only redirect if not on login page
        if (!isLoginPage) {
            window.location.href = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
        }
    } else {
        // User is logged in, update UI
        updateUserInterface(authToken);
    }
    
    // Set up logout button on all pages
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Update user interface based on logged in user
    function updateUserInterface(username) {
        // Get user data
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        const user = users.find(u => u.username === username);
        
        if (!user) return;
        
        // Update username display
        const currentUserNameEl = document.getElementById('current-user-name');
        if (currentUserNameEl) {
            currentUserNameEl.textContent = user.username;
        }
        
        // Show/hide admin elements
        if (user.role === 'admin') {
            document.body.classList.add('is-admin');
        } else {
            document.body.classList.remove('is-admin');
        }
        
        // Update user dashboard elements if they exist
        const userFullnameEl = document.getElementById('user-fullname');
        const userPositionEl = document.getElementById('user-position');
        const userIdEl = document.getElementById('user-id');
        const userEmailEl = document.getElementById('user-email');
        const userPhoneEl = document.getElementById('user-phone');
        const userAddressEl = document.getElementById('user-address');
        const userDobEl = document.getElementById('user-dob');
        
        if (userFullnameEl) userFullnameEl.textContent = user.fullname || user.username;
        if (userPositionEl) userPositionEl.textContent = user.position || 'Employee';
        if (userIdEl) userIdEl.textContent = 'Employee ID: ' + (user.id || 'N/A');
        if (userEmailEl) userEmailEl.textContent = user.email || 'N/A';
        if (userPhoneEl) userPhoneEl.textContent = user.phone || 'N/A';
        if (userAddressEl) userAddressEl.textContent = user.address || 'N/A';
        if (userDobEl) userDobEl.textContent = user.dob || 'N/A';
    }
});

// Initialize default users if none exist
function initializeUsers() {
    if (!localStorage.getItem('fuel_express_users')) {
        const defaultUsers = [
            {
                id: 'EMP-001',
                fullname: 'Admin User',
                email: 'admin@fuelexpress.com',
                username: 'admin',
                password: 'admin123', // In a real app, this would be hashed
                role: 'admin',
                position: 'System Administrator',
                phone: '+1 123 456 7890',
                address: '123 Admin St, Tech City',
                dob: '01/01/1985',
                createdAt: new Date().toISOString()
            },
            {
                id: 'EMP-002',
                fullname: 'John Doe',
                email: 'john@fuelexpress.com',
                username: 'john',
                password: 'john123',
                role: 'user',
                position: 'Software Developer',
                phone: '+1 234 567 8901',
                address: '456 User Ave, Code Town',
                dob: '05/15/1990',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('fuel_express_users', JSON.stringify(defaultUsers));
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to login page
    const currentPath = window.location.pathname;
    window.location.href = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
}

// Initialize users
initializeUsers();
